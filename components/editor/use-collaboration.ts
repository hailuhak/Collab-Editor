"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { Editor } from "@tiptap/react";

import { updateDocumentContent } from "@/app/actions/documents";
import type {
  DocumentInitPayload,
  DocumentUpdatedPayload,
  RemoteUser,
} from "@/lib/socket";
import { buildRemoteCursorDecorations, remoteCursorsKey } from "@/lib/remote-cursors";

type SaveStatus = "saved" | "saving";

type UseCollaborationOptions = {
  documentId: string;
  editor: Editor | null;
  canEdit: boolean;
};

export function useCollaboration({
  documentId,
  editor,
  canEdit,
}: UseCollaborationOptions) {
  const socketRef = useRef<Socket | null>(null);
  const editorRef = useRef<Editor | null>(null);
  const [presence, setPresence] = useState<RemoteUser[]>([]);
  const [typingIds, setTypingIds] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [connected, setConnected] = useState(false);

  const revisionRef = useRef(0);
  const applyingRef = useRef(false);
  const presenceRef = useRef<RemoteUser[]>([]);
  const lastCursorRef = useRef<{ from: number; to: number } | null>(null);
  const typingThrottleRef = useRef(0);
  const typingTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useEffect(() => {
    presenceRef.current = presence;
  }, [presence]);

  // ------------------------------------------------------------------
  // Render remote cursors / selections as ProseMirror decorations
  // ------------------------------------------------------------------
  useEffect(() => {
    const currentEditor = editorRef.current;
    if (!currentEditor?.view) return;

    const decorations = buildRemoteCursorDecorations(
      currentEditor.state.doc,
      presenceRef.current
    );
    currentEditor.view.dispatch(
      currentEditor.state.tr.setMeta(remoteCursorsKey, decorations)
    );
  }, [presence, documentId]);

  // ------------------------------------------------------------------
  // Apply canonical server content into the editor (no echo back)
  // ------------------------------------------------------------------
  const applyRemoteContent = useCallback((content: string) => {
    const currentEditor = editorRef.current;
    if (!currentEditor) return;

    try {
      const json = JSON.parse(content);
      const current = currentEditor.getJSON();
      if (JSON.stringify(json) === JSON.stringify(current)) return;

      applyingRef.current = true;
      currentEditor.commands.setContent(json, { emitUpdate: false });
      currentEditor.commands.focus("start");
    } catch {
      // Malformed content from the server: ignore.
    }
  }, []);

  // ------------------------------------------------------------------
  // Socket connection + inbound events
  // ------------------------------------------------------------------
  useEffect(() => {
    let disposed = false;

    async function connect() {
      try {
        const res = await fetch("/api/socket/token");
        if (!res.ok || disposed) return;
        const { token } = await res.json();
        if (disposed) return;

        const socket = io({ auth: { token } });
        socketRef.current = socket;

        socket.on("connect", () => {
          setConnected(true);
          socket.emit("doc:join", { documentId });
        });
        socket.on("disconnect", () => setConnected(false));
        socket.on("connect_error", () => setConnected(false));

        socket.on("doc:init", (payload: DocumentInitPayload) => {
          revisionRef.current = payload.revision;
          applyRemoteContent(payload.content);
          setPresence(payload.users);
        });

        socket.on("doc:updated", (payload: DocumentUpdatedPayload) => {
          if (payload.revision <= revisionRef.current) return;
          revisionRef.current = payload.revision;
          applyRemoteContent(payload.content);
        });

        socket.on("presence:list", ({ users }: { users: RemoteUser[] }) => {
          setPresence(users);
        });

        socket.on("presence:update", ({ user }: { user: RemoteUser }) => {
          setPresence((prev) => {
            const idx = prev.findIndex((u) => u.id === user.id);
            if (idx === -1) return [...prev, user];
            const next = [...prev];
            next[idx] = user;
            return next;
          });
        });

        socket.on("presence:left", ({ userId }: { userId: string }) => {
          setPresence((prev) => prev.filter((u) => u.id !== userId));
        });

        socket.on(
          "typing",
          ({ userId }: { userId: string }) => {
            setTypingIds((prev) =>
              prev.includes(userId) ? prev : [...prev, userId]
            );
            const timer = typingTimersRef.current[userId];
            if (timer) clearTimeout(timer);
            typingTimersRef.current[userId] = setTimeout(() => {
              setTypingIds((prev) => prev.filter((id) => id !== userId));
            }, 2500);
          }
        );
      } catch {
        // Socket setup failed; the autosave server action is the fallback.
      }
    }

    connect();

    return () => {
      disposed = true;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [documentId, applyRemoteContent]);

  // ------------------------------------------------------------------
  // Editor -> socket: content, typing indicator, presence
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!editor || !canEdit) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const handleUpdate = () => {
      const now = Date.now();
      if (now - typingThrottleRef.current > 3000) {
        typingThrottleRef.current = now;
        socketRef.current?.emit("typing", { documentId });
      }

      clearTimeout(timer);
      timer = setTimeout(() => {
        if (applyingRef.current) {
          applyingRef.current = false;
          return;
        }

        const content = JSON.stringify(editor.getJSON());
        const socket = socketRef.current;

        if (socket?.connected) {
          socket.emit("doc:update", {
            documentId,
            content,
            revision: revisionRef.current,
          });
          revisionRef.current += 1;
          setSaveStatus("saving");
          setTimeout(() => setSaveStatus("saved"), 900);
        } else {
          // Offline fallback: persist via the server action.
          setSaveStatus("saving");
          void updateDocumentContent(documentId, content).then(() => {
            setSaveStatus("saved");
          });
        }
      }, 600);
    };

    const handleSelectionUpdate = () => {
      const { from, to } = editor.state.selection;
      const prev = lastCursorRef.current;
      if (prev && prev.from === from && prev.to === to) return;
      lastCursorRef.current = { from, to };
      socketRef.current?.emit("presence:update", {
        documentId,
        cursor: { from, to },
        active: true,
      });
    };

    const handleFocus = () => {
      lastCursorRef.current = null;
      handleSelectionUpdate();
    };

    const handleBlur = () => {
      socketRef.current?.emit("presence:update", {
        documentId,
        cursor: null,
        active: false,
      });
    };

    editor.on("update", handleUpdate);
    editor.on("selectionUpdate", handleSelectionUpdate);
    editor.on("focus", handleFocus);
    editor.on("blur", handleBlur);

    return () => {
      clearTimeout(timer);
      editor.off("update", handleUpdate);
      editor.off("selectionUpdate", handleSelectionUpdate);
      editor.off("focus", handleFocus);
      editor.off("blur", handleBlur);
    };
  }, [editor, documentId, canEdit]);

  // ------------------------------------------------------------------
  // Outbound helpers exposed to the UI
  // ------------------------------------------------------------------
  const broadcastTitle = useCallback(
    (title: string) => {
      const currentEditor = editorRef.current;
      const socket = socketRef.current;
      if (!currentEditor || !socket?.connected) return;

      socket.emit("doc:update", {
        documentId,
        content: JSON.stringify(currentEditor.getJSON()),
        revision: revisionRef.current,
        title,
      });
      revisionRef.current += 1;
    },
    [documentId]
  );

  const emitFullContent = useCallback(() => {
    const currentEditor = editorRef.current;
    const socket = socketRef.current;
    if (!currentEditor || !socket?.connected) return;

    socket.emit("doc:update", {
      documentId,
      content: JSON.stringify(currentEditor.getJSON()),
      revision: revisionRef.current,
    });
    revisionRef.current += 1;
  }, [documentId]);

  return {
    presence,
    typingIds,
    saveStatus,
    connected,
    broadcastTitle,
    emitFullContent,
  };
}

export type Collaboration = ReturnType<typeof useCollaboration>;
