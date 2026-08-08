"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Eye, Loader2 } from "lucide-react";

import EditorToolbar from "./editor-toolbar";
import EditorHeader from "./editor-header";
import ShareDialog from "./share-dialog";
import CommentsPanel from "./comments-panel";
import VersionHistory from "./version-history";
import { useCollaboration } from "./use-collaboration";
import { buildEditorExtensions } from "@/lib/editor-config";
import { updateDocumentTitle } from "@/app/actions/documents";

type EditorUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

type DocumentEditorProps = {
  documentId: string;
  initialTitle: string;
  initialContent: string;
  role: string;
  ownerId: string;
  user: EditorUser;
};

export default function DocumentEditor({
  documentId,
  initialTitle,
  initialContent,
  role,
  ownerId,
  user,
}: DocumentEditorProps) {
  const canEdit = role === "OWNER" || role === "EDITOR";
  const [title, setTitle] = useState(initialTitle);
  const [selectedText, setSelectedText] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: buildEditorExtensions(),
    content: initialContent ? JSON.parse(initialContent) : "",
    editable: canEdit,
    immediatelyRender: false,
  });

  const collab = useCollaboration({ documentId, editor, canEdit });

  const typingNames = collab.presence
    .filter((p) => collab.typingIds.includes(p.id))
    .map((p) => p.name);

  // ------------------------------------------------------------------
  // Track the text currently selected in the editor (for comments)
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!editor) return;

    const update = () => {
      const { from, to } = editor.state.selection;
      if (from === to) {
        setSelectedText("");
        return;
      }
      const text = editor.state.doc.textBetween(from, to, " ");
      setSelectedText(text.length > 200 ? text.slice(0, 200) : text);
    };

    editor.on("selectionUpdate", update);
    return () => {
      editor.off("selectionUpdate", update);
    };
  }, [editor]);

  // ------------------------------------------------------------------
  // Title handling
  // ------------------------------------------------------------------
  const handleTitleChange = (value: string) => {
    setTitle(value);
    const clean = value.trim();
    if (!clean) return;

    startTransition(async () => {
      await updateDocumentTitle(documentId, clean);
    });
    collab.broadcastTitle(clean);
  };

  // ------------------------------------------------------------------
  // Export / Import
  // ------------------------------------------------------------------
  const handleExportMarkdown = () => {
    if (!editor) return;
    const md = (
      editor.storage as unknown as {
        markdown: { getMarkdown: () => string };
      }
    ).markdown.getMarkdown();
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "document"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportMarkdown = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = () => {
      const md = String(reader.result ?? "");
      editor.commands.setContent(md);
      collab.emitFullContent();
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handlePrint = () => {
    window.print();
  };

  // ------------------------------------------------------------------
  // Version restore: apply restored content and sync it to everyone
  // ------------------------------------------------------------------
  const handleRestore = (content: string) => {
    if (!editor) return;
    try {
      editor.commands.setContent(JSON.parse(content), { emitUpdate: false });
    } catch {
      editor.commands.setContent(content);
    }
    collab.emitFullContent();
    setHistoryOpen(false);
  };

  if (!editor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0A0E1A]">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] print:bg-white dark:bg-[#0A0E1A]">
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      <EditorHeader
        documentId={documentId}
        title={title}
        canEdit={canEdit}
        isOwner={role === "OWNER"}
        user={user}
        presence={collab.presence}
        typingNames={typingNames}
        saveStatus={collab.saveStatus}
        connected={collab.connected}
        onTitleChange={handleTitleChange}
        onShare={() => setShareOpen(true)}
        onToggleComments={() => setCommentsOpen((o) => !o)}
        onToggleHistory={() => setHistoryOpen((o) => !o)}
        onExportMarkdown={handleExportMarkdown}
        onImportMarkdown={handleImportMarkdown}
        onPrint={handlePrint}
      />

      {/* View-only notice */}
      {!canEdit && (
        <div className="flex items-center justify-center gap-2 bg-amber-50 py-1.5 text-xs text-amber-800 print:hidden dark:bg-amber-950/40 dark:text-amber-300">
          <Eye className="h-3.5 w-3.5" />
          {role === "COMMENTER"
            ? "You have comment access. You can comment but not edit this document."
            : "You have view-only access to this document."}
        </div>
      )}

      <EditorToolbar editor={editor} canEdit={canEdit} />

      {/* Document canvas */}
      <main className="py-6 print:py-0">
        <div className="mx-auto min-h-[1050px] w-full max-w-4xl bg-white px-8 py-10 shadow-sm sm:px-16 sm:py-14 print:max-w-none print:min-h-0 print:shadow-none dark:bg-gray-900">
          <EditorContent editor={editor} />
        </div>
      </main>

      {/* Panels */}
      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        documentId={documentId}
      />

      <CommentsPanel
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        documentId={documentId}
        canComment={canEdit || role === "COMMENTER"}
        currentUserId={user.id}
        ownerId={ownerId}
        selectedText={selectedText}
      />

      <VersionHistory
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        documentId={documentId}
        canEdit={canEdit}
        onRestore={handleRestore}
      />
    </div>
  );
}
