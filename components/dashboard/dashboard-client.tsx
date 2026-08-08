"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Copy,
  Trash2,
  Share2,
  FolderOpen,
  FileText,
  Users,
  Clock,
  Loader2,
  X,
} from "lucide-react";

import { createDocument, duplicateDocument, deleteDocument, updateDocumentTitle } from "@/app/actions/documents";
import { roleLabel } from "@/lib/permissions";

type Doc = {
  id: string;
  title: string;
  ownerId: string;
  accessRole: string;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt: string | null;
  owner: { id: string; name: string; email: string | null; image: string | null };
  commentCount: number;
  lastModifiedById: string | null;
};

type DashboardClientProps = {
  user: { id: string; name: string | null; email: string | null; image: string | null };
  owned: Doc[];
  shared: Doc[];
  recent: Doc[];
};

type Tab = "recent" | "owned" | "shared";

function timeAgo(iso: string) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function DocIcon({ color }: { color?: string }) {
  return (
    <div
      className="flex h-12 w-10 items-center justify-center rounded-t-sm"
      style={{
        backgroundColor: color ?? "#1a73e8",
        clipPath: "polygon(0 0, 100% 0, 100% 82%, 75% 100%, 0 100%)",
      }}
    >
      <FileText className="h-5 w-5 text-white/90" />
    </div>
  );
}

export default function DashboardClient({
  user,
  owned,
  shared,
  recent,
}: DashboardClientProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("recent");
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // rename state
  const [renaming, setRenaming] = useState<Doc | null>(null);
  const [renameValue, setRenameValue] = useState("");
  // delete state
  const [deleting, setDeleting] = useState<Doc | null>(null);

  const docs = tab === "owned" ? owned : tab === "shared" ? shared : recent;
  const filtered = docs.filter((d) =>
    d.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleCreate = () => {
    startTransition(async () => {
      await createDocument();
      router.refresh();
    });
  };

  const handleDuplicate = (id: string) => {
    startTransition(async () => {
      await duplicateDocument(id);
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!deleting) return;
    startTransition(async () => {
      await deleteDocument(deleting.id);
      setDeleting(null);
      router.refresh();
    });
  };

  const handleRename = () => {
    if (!renaming || !renameValue.trim()) return;
    startTransition(async () => {
      await updateDocumentTitle(renaming.id, renameValue);
      setRenaming(null);
      router.refresh();
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800/60">
          {(
            [
              { key: "recent", label: "Recent", icon: Clock },
              { key: "owned", label: "My documents", icon: FolderOpen },
              { key: "shared", label: "Shared with me", icon: Users },
            ] as const
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                tab === key
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-gray-100"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
              <span className="ml-0.5 text-xs text-gray-400 dark:text-gray-500">
                {key === "owned" ? owned.length : key === "shared" ? shared.length : recent.length}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documents"
              className="w-56 rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>
          <button
            type="button"
            onClick={handleCreate}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-md bg-[#1a73e8] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1765cc] disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            New document
          </button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-16 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-200 dark:text-gray-700" />
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            {query
              ? `No documents match “${query}”`
              : tab === "shared"
                ? "No documents have been shared with you yet."
                : tab === "owned"
                  ? "You don't have any documents yet."
                  : "No recent documents."}
          </p>
          <button
            type="button"
            onClick={handleCreate}
            className="mt-4 rounded-md bg-[#1a73e8] px-4 py-2 text-sm font-medium text-white hover:bg-[#1765cc]"
          >
            Create a document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {tab === "owned" && (
            <button
              type="button"
              onClick={handleCreate}
              className="group flex aspect-[4/5] flex-col rounded-lg border border-gray-200 bg-white transition hover:border-blue-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="flex flex-1 items-center justify-center rounded-t-lg bg-gray-50 transition group-hover:bg-blue-50 dark:bg-gray-800 dark:group-hover:bg-blue-950/40">
                <Plus className="h-10 w-10 text-gray-300 group-hover:text-blue-500 dark:text-gray-600" />
              </div>
              <div className="border-t border-gray-100 p-3 text-sm font-medium text-gray-600 dark:border-gray-700 dark:text-gray-400">
                Blank document
              </div>
            </button>
          )}

          {filtered.map((doc) => (
            <DocCard
              key={doc.id}
              doc={doc}
              currentUserId={user.id}
              isOwner={doc.ownerId === user.id}
              onRename={() => {
                setRenaming(doc);
                setRenameValue(doc.title);
              }}
              onDuplicate={() => handleDuplicate(doc.id)}
              onDelete={() => setDeleting(doc)}
            />
          ))}
        </div>
      )}

      {/* Rename modal */}
      {renaming && (
        <Modal onClose={() => setRenaming(null)} title="Rename document">
          <input
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setRenaming(null)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRename}
              disabled={!renameValue.trim() || isPending}
              className="rounded-md bg-[#1a73e8] px-4 py-2 text-sm font-medium text-white hover:bg-[#1765cc] disabled:opacity-50"
            >
              {isPending ? "Saving…" : "Save"}
            </button>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleting && (
        <Modal onClose={() => setDeleting(null)} title="Delete document?">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            “{deleting.title}” will be permanently deleted. This action cannot be
            undone.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeleting(null)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DocCard({
  doc,
  currentUserId,
  isOwner,
  onRename,
  onDuplicate,
  onDelete,
}: {
  doc: Doc;
  currentUserId: string;
  isOwner: boolean;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:border-blue-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
      <Link
        href={`/documents/${doc.id}`}
        className="flex flex-1 items-center justify-center bg-gray-50 transition group-hover:bg-blue-50 dark:bg-gray-800 dark:group-hover:bg-blue-950/40"
      >
        <DocIcon />
      </Link>

      {/* Menu */}
      <div className="absolute right-1.5 top-1.5" ref={menuRef}>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setMenuOpen((o) => !o);
          }}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-gray-500 opacity-0 shadow-sm transition hover:bg-white group-hover:opacity-100 dark:bg-gray-800/80 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-8 z-20 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
            <MenuAction
              icon={<FolderOpen className="h-3.5 w-3.5" />}
              label="Open"
              onClick={() => {
                setMenuOpen(false);
              }}
            >
              <Link href={`/documents/${doc.id}`} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm">
                <FolderOpen className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                Open
              </Link>
            </MenuAction>
            {isOwner && (
              <MenuAction
                icon={<Share2 className="h-3.5 w-3.5" />}
                label="Share"
                onClick={() => setMenuOpen(false)}
              >
                <Link href={`/documents/${doc.id}`} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm">
                  <Share2 className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                  Share
                </Link>
              </MenuAction>
            )}
            <MenuAction
              icon={<Pencil className="h-3.5 w-3.5" />}
              label="Rename"
              onClick={() => {
                setMenuOpen(false);
                onRename();
              }}
            />
            <MenuAction
              icon={<Copy className="h-3.5 w-3.5" />}
              label="Duplicate"
              onClick={() => {
                setMenuOpen(false);
                onDuplicate();
              }}
            />
            {isOwner && (
              <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
            )}
            {isOwner && (
              <MenuAction
                icon={<Trash2 className="h-3.5 w-3.5 text-red-500" />}
                label="Delete"
                danger
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="border-t border-gray-100 p-3 dark:border-gray-700">
        <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">{doc.title}</p>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-xs text-gray-400 dark:text-gray-500">{timeAgo(doc.updatedAt)}</p>
          {doc.accessRole !== "OWNER" && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              {roleLabel(doc.accessRole as never)}
            </span>
          )}
        </div>
        {doc.ownerId !== currentUserId && (
          <p className="mt-0.5 truncate text-[11px] text-gray-400 dark:text-gray-500">
            Owner: {doc.owner.name}
          </p>
        )}
      </div>
    </div>
  );
}

function MenuAction({
  icon,
  label,
  danger = false,
  onClick,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}) {
  if (children) {
    return <div onClick={onClick}>{children}</div>;
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition ${
        danger
          ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      }`}
    >
      <span className={danger ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}>{icon}</span>
      {label}
    </button>
  );
}
