"use client";

import type { Editor } from "@tiptap/react";

type EditorToolbarProps = {
   editor: Editor;
};

export default function EditorToolbar({
   editor,
}: EditorToolbarProps) {
   return (
      <div className="flex min-h-12 items-center gap-1 bg-white px-4 py-2">

         {/* Undo */}
         <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-30"
            title="Undo"
         >
            ↶
         </button>

         {/* Redo */}
         <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-30"
            title="Redo"
         >
            ↷
         </button>

         <div className="mx-2 h-6 w-px bg-gray-200" />

         {/* Bold */}
         <button
            type="button"
            onClick={() =>
               editor.chain().focus().toggleBold().run()
            }
            className={`rounded-md px-3 py-2 font-bold text-gray-700 hover:bg-gray-100 ${editor.isActive("bold")
                  ? "bg-gray-200"
                  : ""
               }`}
            title="Bold"
         >
            B
         </button>

         {/* Italic */}
         <button
            type="button"
            onClick={() =>
               editor.chain().focus().toggleItalic().run()
            }
            className={`rounded-md px-3 py-2 italic text-gray-700 hover:bg-gray-100 ${editor.isActive("italic")
                  ? "bg-gray-200"
                  : ""
               }`}
            title="Italic"
         >
            I
         </button>

         {/* Strike */}
         <button
            type="button"
            onClick={() =>
               editor.chain().focus().toggleStrike().run()
            }
            className={`rounded-md px-3 py-2 text-gray-700 line-through hover:bg-gray-100 ${editor.isActive("strike")
                  ? "bg-gray-200"
                  : ""
               }`}
            title="Strikethrough"
         >
            S
         </button>

         <div className="mx-2 h-6 w-px bg-gray-200" />

         {/* H1 */}
         <button
            type="button"
            onClick={() =>
               editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: 1 })
                  .run()
            }
            className={`rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 ${editor.isActive("heading", { level: 1 })
                  ? "bg-gray-200"
                  : ""
               }`}
            title="Heading 1"
         >
            H1
         </button>

         {/* H2 */}
         <button
            type="button"
            onClick={() =>
               editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: 2 })
                  .run()
            }
            className={`rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 ${editor.isActive("heading", { level: 2 })
                  ? "bg-gray-200"
                  : ""
               }`}
            title="Heading 2"
         >
            H2
         </button>

         <div className="mx-2 h-6 w-px bg-gray-200" />

         {/* Bullet list */}
         <button
            type="button"
            onClick={() =>
               editor.chain().focus().toggleBulletList().run()
            }
            className={`rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 ${editor.isActive("bulletList")
                  ? "bg-gray-200"
                  : ""
               }`}
            title="Bullet list"
         >
            •☰
         </button>

         {/* Numbered list */}
         <button
            type="button"
            onClick={() =>
               editor.chain().focus().toggleOrderedList().run()
            }
            className={`rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 ${editor.isActive("orderedList")
                  ? "bg-gray-200"
                  : ""
               }`}
            title="Numbered list"
         >
            1.
         </button>

         {/* Quote */}
         <button
            type="button"
            onClick={() =>
               editor.chain().focus().toggleBlockquote().run()
            }
            className={`rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 ${editor.isActive("blockquote")
                  ? "bg-gray-200"
                  : ""
               }`}
            title="Quote"
         >
            “
         </button>

         <div className="mx-2 h-6 w-px bg-gray-200" />

         {/* Clear formatting */}
         <button
            type="button"
            onClick={() =>
               editor
                  .chain()
                  .focus()
                  .clearNodes()
                  .unsetAllMarks()
                  .run()
            }
            className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
            title="Clear formatting"
         >
            Tx
         </button>

      </div>
   );
}