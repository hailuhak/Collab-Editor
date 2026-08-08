/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Socket.IO realtime server.
 *
 * Responsibilities:
 *  - Authenticate sockets with the short-lived JWT issued by /api/socket/token.
 *  - Authorize document access using the Permission table (cached per socket).
 *  - Act as the source of truth for open documents: hold latest content in
 *    memory, debounce persistence to Postgres, and broadcast canonical state
 *    to every client in a document room.
 *  - Track presence (who is viewing, cursor/selection, typing activity).
 *  - Take periodic version snapshots so users get a meaningful history.
 */

const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// documentId -> { content, revision, title, lastModifiedBy, saveTimer, lastSnapshotAt }
const documentState = new Map();

// documentId -> Map(userId -> { socketIds:Set, user })
const documentPresence = new Map();

const SNAPSHOT_INTERVAL_MS = 5 * 60 * 1000; // snapshot every 5 minutes
const SAVE_DEBOUNCE_MS = 1500;

function getSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
}

function canEdit(role) {
  return role === "OWNER" || role === "EDITOR";
}

function colorForId(id) {
  const palette = [
    "#4285F4", "#EA4335", "#FBBC04", "#34A853",
    "#F06292", "#8E24AA", "#00ACC1", "#6D4C41",
    "#5C6BC0", "#D81B60", "#039BE5", "#7CB342",
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return palette[hash % palette.length];
}

function getState(documentId, document) {
  let state = documentState.get(documentId);
  if (!state) {
    state = {
      content: document ? document.content : "",
      revision: document ? document.revision : 0,
      title: document ? document.title : "Untitled document",
      lastModifiedBy: document ? document.lastModifiedById : null,
      saveTimer: null,
      lastSnapshotAt: null,
    };
    documentState.set(documentId, state);
  }
  return state;
}

function presenceFor(documentId) {
  let presence = documentPresence.get(documentId);
  if (!presence) {
    presence = new Map();
    documentPresence.set(documentId, presence);
  }
  return presence;
}

function toRemoteUser(userId, user, cursor = null, active = false) {
  return {
    id: userId,
    name: user.name || user.email || "Unnamed",
    email: user.email || null,
    image: user.image || null,
    color: colorForId(userId),
    cursor,
    active,
  };
}

async function loadDocument(documentId) {
  return prisma.document.findUnique({ where: { id: documentId } });
}

async function saveDocument(documentId, state) {
  if (!state.dirty) return;
  state.dirty = false;

  const now = new Date();

  // Optionally snapshot a version before overwriting content.
  const shouldSnapshot =
    !state.lastSnapshotAt ||
    now.getTime() - state.lastSnapshotAt.getTime() > SNAPSHOT_INTERVAL_MS;

  try {
    await prisma.$transaction(async (tx) => {
      const doc = await tx.document.findUnique({ where: { id: documentId } });
      if (!doc) return;

      await tx.document.update({
        where: { id: documentId },
        data: {
          content: state.content,
          revision: state.revision,
          title: state.title,
          lastModifiedById: state.lastModifiedBy,
        },
      });

      if (shouldSnapshot) {
        const last = await tx.version.aggregate({
          where: { documentId },
          _max: { version: true },
        });
        const next = (last._max.version || 0) + 1;
        await tx.version.create({
          data: {
            documentId,
            content: state.content,
            version: next,
            authorId: state.lastModifiedBy || doc.ownerId,
          },
        });
        state.lastSnapshotAt = now;
      }
    });
  } catch (err) {
    console.error("[socket] failed to persist document", documentId, err);
  }
}

function scheduleSave(documentId, state) {
  if (state.saveTimer) {
    clearTimeout(state.saveTimer);
  }
  state.dirty = true;
  state.saveTimer = setTimeout(() => {
    saveDocument(documentId, state);
    state.saveTimer = null;
  }, SAVE_DEBOUNCE_MS);
}

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true,
    },
    path: "/socket.io",
  });

  // ---- authentication middleware ----
  io.use((socket, next) => {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    const secret = getSecret();
    if (!token || !secret) return next(new Error("unauthorized"));

    try {
      const payload = jwt.verify(token, secret);
      socket.data.user = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        image: payload.image,
      };
      next();
    } catch {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user;

    // Cache the role for the joined document on this socket.
    socket.data.role = null;
    socket.data.documentId = null;

    // ---- join a document room ----
    socket.on("doc:join", async (payload) => {
      const documentId = payload && payload.documentId;
      if (!documentId || typeof documentId !== "string") {
        return socket.emit("error", "invalid payload");
      }

      const permission = await prisma.permission.findUnique({
        where: {
          userId_documentId: { userId: user.id, documentId },
        },
      });

      if (!permission) {
        return socket.emit("error", "forbidden");
      }

      // Leave any previously joined room.
      if (socket.data.documentId) {
        socket.leave(`doc:${socket.data.documentId}`);
        removePresence(io, socket.data.documentId, user.id, socket.id);
      }

      socket.data.role = permission.role;
      socket.data.documentId = documentId;

      const room = `doc:${documentId}`;
      socket.join(room);

      const document = await loadDocument(documentId);
      const state = getState(documentId, document);
      socket.emit("doc:init", {
        content: state.content,
        revision: state.revision,
        title: state.title,
        users: [],
      });

      // Register presence.
      const presence = presenceFor(documentId);
      let entry = presence.get(user.id);
      if (!entry) {
        entry = {
          socketIds: new Set(),
          user: toRemoteUser(user.id, user),
        };
        presence.set(user.id, entry);
      }
      entry.socketIds.add(socket.id);

      // Send the current user list to the newly joined socket.
      const users = Array.from(presence.values()).map((e) => e.user);
      socket.emit("presence:list", { users });

      // Notify others in the room.
      const self = toRemoteUser(user.id, user);
      socket.to(room).emit("presence:update", { user: self });
    });

    // ---- realtime content update ----
    socket.on("doc:update", (payload) => {
      const documentId = socket.data.documentId;
      if (!documentId || documentId !== (payload && payload.documentId)) return;

      if (!canEdit(socket.data.role)) {
        return socket.emit("error", "forbidden");
      }

      const content = payload.content;
      if (typeof content !== "string") return;

      const state = getState(documentId);
      state.content = content;
      state.revision = (state.revision || 0) + 1;
      state.lastModifiedBy = user.id;

      if (typeof payload.title === "string") {
        state.title = payload.title;
      }

      scheduleSave(documentId, state);

      socket.to(`doc:${documentId}`).emit("doc:updated", {
        content,
        revision: state.revision,
        title: payload.title,
        userId: user.id,
        updatedAt: new Date().toISOString(),
      });
    });

    // ---- presence: cursor / selection / active state ----
    socket.on("presence:update", (payload) => {
      const documentId = socket.data.documentId;
      if (!documentId || documentId !== (payload && payload.documentId)) return;

      const presence = presenceFor(documentId);
      const entry = presence.get(user.id);
      if (entry) {
        const cursor = payload.cursor || null;
        entry.user.cursor = cursor;
        if (typeof payload.active === "boolean") {
          entry.user.active = payload.active;
        }
        socket.to(`doc:${documentId}`).emit("presence:update", {
          user: entry.user,
        });
      }
    });

    // ---- typing indicator ----
    socket.on("typing", (payload) => {
      const documentId = socket.data.documentId;
      if (!documentId || documentId !== (payload && payload.documentId)) return;

      socket.to(`doc:${documentId}`).emit("typing", {
        userId: user.id,
        name: user.name || user.email || "Someone",
      });
    });

    // ---- cleanup ----
    socket.on("disconnect", () => {
      if (socket.data.documentId) {
        removePresence(io, socket.data.documentId, user.id, socket.id);
      }
    });
  });

  return io;
}

function removePresence(io, documentId, userId, socketId) {
  const presence = documentPresence.get(documentId);
  if (!presence) return;

  const entry = presence.get(userId);
  if (!entry) return;

  entry.socketIds.delete(socketId);

  if (entry.socketIds.size === 0) {
    presence.delete(userId);
    io.to(`doc:${documentId}`).emit("presence:left", { userId });
  }
}

module.exports = { initSocketServer };
