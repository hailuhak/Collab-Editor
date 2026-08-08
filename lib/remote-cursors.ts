import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import type { RemoteUser } from "./socket";

/**
 * PluginKey shared between the plugin definition and the code that
 * (re)computes decorations from live presence updates.
 */
export const remoteCursorsKey = new PluginKey<DecorationSet>("remoteCursors");

/**
 * Tiptap extension exposing the remote-cursor decoration plugin. Presence
 * updates are applied by dispatching a transaction carrying a DecorationSet
 * via the shared PluginKey (see buildRemoteCursorDecorations).
 */
export function remoteCursorPlugin() {
  return Extension.create({
    name: "remoteCursors",
    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: remoteCursorsKey,
          state: {
            init: () => DecorationSet.empty,
            apply(tr, set) {
              const meta = tr.getMeta(remoteCursorsKey);
              if (meta) return meta;
              // Keep decorations valid as the document changes under us.
              return set.map(tr.mapping, tr.doc);
            },
          },
          props: {
            decorations(state) {
              return remoteCursorsKey.getState(state);
            },
          },
        }),
      ];
    },
  });
}

/**
 * Builds a DecorationSet from the live presence list. Each remote user with
 * a selection gets a translucent highlight plus a colored caret with their
 * name label.
 */
export function buildRemoteCursorDecorations(
  doc: Parameters<typeof DecorationSet.create>[0],
  users: RemoteUser[]
): DecorationSet {
  const decorations: Decoration[] = [];
  const max = doc.content.size;

  for (const user of users) {
    if (!user.cursor) continue;

    const rawFrom = user.cursor.from;
    const rawTo = user.cursor.to;
    if (rawFrom == null || rawTo == null) continue;

    const start = Math.max(0, Math.min(Math.min(rawFrom, rawTo), max));
    const end = Math.max(0, Math.min(Math.max(rawFrom, rawTo), max));

    if (start === end) {
      const caret = document.createElement("span");
      caret.className = "remote-cursor";
      caret.style.setProperty("--cursor-color", user.color);
      const label = document.createElement("span");
      label.className = "remote-cursor-label";
      label.textContent = user.name;
      caret.appendChild(label);
      decorations.push(Decoration.widget(start, caret, { key: user.id }));
    } else {
      decorations.push(
        Decoration.inline(start, end, {
          class: "remote-selection",
          style: `background-color: ${user.color}33;`,
        })
      );
    }
  }

  return DecorationSet.create(doc, decorations);
}
