"use client";

import { useState, useTransition, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { X, History, RotateCcw, Loader2, FileText } from "lucide-react";

import { listVersions, getVersionContent, restoreVersion } from "@/app/actions/versions";
import { buildEditorExtensions } from "@/lib/editor-config";

type Version = {
  id: string;
  version: number;
  createdAt: string;
  author: { id: string; name: string; image: string | null };
};

type VersionHistoryProps = {
  open: boolean;
  onClose: () => void;
  documentId: string;
  canEdit: boolean;
  onRestore: (content: string) => void;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function VersionHistory({
  open,
  onClose,
  documentId,
  canEdit,
  onRestore,
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [selected, setSelected] = useState<Version | null>(null);
  const [previewContent, setPreviewContent] = useState<string>("");
  const [previewVersion, setPreviewVersion] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (open) {
      startTransition(async () => {
        setSelected(null);
        setPreviewVersion(null);
        const data = await listVersions(documentId);
        setVersions(data);
      });
    }
  }, [open, documentId]);

  const handleSelect = (version: Version) => {
    setSelected(version);
    setPreviewVersion(null);
    startTransition(async () => {
      const data = await getVersionContent(documentId, version.id);
      if (data) {
        setPreviewContent(data.content);
        setPreviewVersion(String(data.version));
      }
    });
  };

  const handleRestore = () => {
    if (!selected) return;
    setError("");
    startTransition(async () => {
      const result = await restoreVersion(documentId, selected.id);
      if (result?.error) {
        setError(result.error);
      } else if (previewContent) {
        onRestore(previewContent);
      }
    });
  };

  if (!open) return null;

  return (
    <aside className="fixed inset-y-0 right-0 z-40 flex w-full max-w-2xl flex-col border-l border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <h2 className="text-sm font-medium text-[#202124] dark:text-gray-100">Version history</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Version list */}
        <div className="w-72 overflow-y-auto border-r border-gray-200 dark:border-gray-800">
          <p className="px-4 pb-1 pt-3 text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
            Earlier versions
          </p>
          {versions.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-400 dark:text-gray-500">
              No previous versions saved yet.
            </p>
          ) : (
            versions.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => handleSelect(v)}
                className={`flex w-full items-center gap-3 border-l-2 px-4 py-3 text-left transition ${
                  selected?.id === v.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/50"
                    : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {v.author.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Version {v.version}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {v.author.name} · {formatDate(v.createdAt)}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Preview */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {selected ? (
                <>
                  Version {selected.version} by {selected.author.name} ·{" "}
                  {formatDate(selected.createdAt)}
                </>
              ) : (
                "Select a version to preview"
              )}
            </p>
            {selected && canEdit && (
              <button
                type="button"
                onClick={handleRestore}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded bg-[#1a73e8] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1765cc] disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RotateCcw className="h-3 w-3" />
                )}
                Restore this version
              </button>
            )}
          </div>

          {error && (
            <p className="border-b border-red-100 bg-red-50 px-4 py-2 text-xs text-red-600 dark:border-red-950 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="flex-1 overflow-auto bg-gray-50 p-6 dark:bg-gray-950">
            {previewVersion ? (
              <div className="mx-auto max-w-xl rounded bg-white p-8 shadow-sm dark:bg-gray-900">
                <VersionPreview content={previewContent} key={selected?.id} />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-300 dark:text-gray-700">
                <FileText className="h-10 w-10" />
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

function VersionPreview({ content }: { content: string }) {
  const editor = useEditor({
    extensions: buildEditorExtensions(),
    content: content ? JSON.parse(content) : "",
    editable: false,
    immediatelyRender: false,
  });

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}
