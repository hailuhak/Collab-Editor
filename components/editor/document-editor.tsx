"use client";

import {
   useEffect,
   useState,
   useTransition,
} from "react";

import {
   useEditor,
   EditorContent,
} from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

import {
   updateDocumentTitle,
   updateDocumentContent,
} from "@/app/actions/documents";

import EditorToolbar from "./editor-toolbar";

type DocumentEditorProps = {
   documentId: string;
   initialTitle: string;
   initialContent: string;
};

export default function DocumentEditor({
   documentId,
   initialTitle,
   initialContent,
}: DocumentEditorProps) {
   const [title, setTitle] =
      useState(initialTitle);

   const [isPending, startTransition] =
      useTransition();

   const editor = useEditor({
      extensions: [
         StarterKit,
      ],

      content: initialContent
         ? JSON.parse(initialContent)
         : "",

      immediatelyRender: false,
   });

   /*
    * ==============================
    * Tiptap Autosave
    * ==============================
    */

   useEffect(() => {
      if (!editor) return;

      let timeout: NodeJS.Timeout;

      const handleUpdate = () => {
         clearTimeout(timeout);

         timeout = setTimeout(() => {
            const content = JSON.stringify(
               editor.getJSON()
            );

            startTransition(async () => {
               await updateDocumentContent(
                  documentId,
                  content
               );
            });
         }, 1000);
      };

      editor.on(
         "update",
         handleUpdate
      );

      return () => {
         clearTimeout(timeout);

         editor.off(
            "update",
            handleUpdate
         );
      };
   }, [editor, documentId]);

   /*
    * ==============================
    * Title Change
    * ==============================
    */

   function handleTitleChange(
      event: React.ChangeEvent<HTMLInputElement>
   ) {
      const newTitle =
         event.target.value;

      setTitle(newTitle);

      startTransition(async () => {
         await updateDocumentTitle(
            documentId,
            newTitle
         );
      });
   }

   if (!editor) {
      return null;
   }

   return (
      <div className="min-h-screen bg-gray-100">

         {/* ================= HEADER ================= */}

         <header className="sticky top-0 z-50 border-b bg-white">

            <div className="flex h-16 items-center justify-between px-6">

               {/* Document title */}

               <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  className="w-80 rounded px-2 py-1 text-lg font-medium text-gray-800 outline-none transition hover:bg-gray-100 focus:bg-gray-100"
                  aria-label="Document title"
               />

               {/* Save status */}

               <span className="text-xs text-gray-400">

                  {isPending
                     ? "Saving..."
                     : "Saved"}

               </span>

            </div>

         </header>


         {/* ================= TOOLBAR ================= */}

         <div className="sticky top-16 z-40 border-b">

            <EditorToolbar
               editor={editor}
            />

         </div>


         {/* ================= DOCUMENT ================= */}

         <div className="py-8">

            <div className="mx-auto min-h-[1000px] w-full max-w-4xl bg-white px-16 py-14 shadow-sm">

               <EditorContent
                  editor={editor}
               />

            </div>

         </div>

      </div>
   );
}