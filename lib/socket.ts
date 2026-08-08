/**
 * Socket.IO protocol contract shared by the client and the custom server.
 *
 * The server is the source of truth: it holds the latest content of every
 * open document in memory, persists changes with a debounce, and broadcasts
 * the canonical state to every connected client in a document room.
 *
 * Events emitted by the CLIENT:
 *   - "doc:join"       { documentId }
 *   - "doc:update"     { documentId, content, revision, title? }
 *   - "presence:update"{ documentId, cursor: {from,to} | null, active: boolean }
 *   - "typing"         { documentId }
 *
 * Events emitted by the SERVER:
 *   - "doc:init"       { content, revision, title, users, serverRevision }
 *   - "doc:updated"    { content, revision, title?, userId, updatedAt }
 *   - "presence:list"  { users: RemoteUser[] }
 *   - "presence:update"{ user: RemoteUser }
 *   - "presence:left"  { userId }
 *   - "typing"         { userId, name }
 */

export type RemoteCursor = {
  from: number;
  to: number;
} | null;

export type RemoteUser = {
  id: string;
  name: string;
  email?: string | null;
  image?: string | null;
  color: string;
  cursor: RemoteCursor;
  active: boolean;
};

export type DocumentInitPayload = {
  content: string;
  revision: number;
  title: string;
  users: RemoteUser[];
};

export type DocumentUpdatedPayload = {
  content: string;
  revision: number;
  title?: string;
  userId: string;
  updatedAt: string;
};

export const SOCKET_EVENTS = {
  // client -> server
  DOC_JOIN: "doc:join",
  DOC_UPDATE: "doc:update",
  PRESENCE_UPDATE: "presence:update",
  TYPING: "typing",
  // server -> client
  DOC_INIT: "doc:init",
  DOC_UPDATED: "doc:updated",
  PRESENCE_LIST: "presence:list",
  PRESENCE_LEFT: "presence:left",
  TYPING_EVENT: "typing",
} as const;
