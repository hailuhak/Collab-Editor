"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Share2,
  MoreVertical,
  FileText,
  Star,
  Download,
  Upload,
  Printer,
  Clock,
  MessageSquare,
  Trash2,
  FilePlus2,
  Loader2,
} from "lucide-react";

import { deleteDocument } from "@/app/actions/documents";
import { ThemeToggle } from "@/components/theme-toggle";
import type { RemoteUser } from "@/lib/socket";

type EditorHeaderProps = {
  documentId: string;
  title: string;
  canEdit: boolean;
  isOwner: boolean;
  user: { id: string; name: string | null; email: string | null; image: string | null };
  presence: RemoteUser[];
  typingNames: string[];
  saveStatus: "saved" | "saving";
  connected: boolean;
  onTitleChange: (title: string) => void;
  onShare: () => void;
  onToggleComments: () => void;
  onToggleHistory: () => void;
  onExportMarkdown: () => void;
  onImportMarkdown: () => void;
  onPrint: () => void;
};

function Avatar({
  name,
  color,
  image,
  online = false,
  size = 32,
}: {
  name: string;
  color?: string;
  image?: string | null;
  online?: boolean;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {image ? (
        <img
          src={image}
          alt={name}
          className="rounded-full border border-white object-cover dark:border-gray-800"
          style={{ width: size, height: size }}
        />
      ) : (
        <div
          className="flex items-center justify-center rounded-full border border-white text-xs font-medium text-white dark:border-gray-800"
          style={{
            width: size,
            height: size,
            backgroundColor: color ?? "#4285F4",
          }}
          title={name}
        >
          {initials}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500 dark:border-gray-800" />
      )}
    </div>
  );
}

function colorFromId(id: string) {
  const palette = [
    "#4285F4", "#EA4335", "#FBBC04", "#34A853",
    "#F06292", "#8E24AA", "#00ACC1", "#6D4C41",
    "#5C6BC0", "#D81B60", "#039BE5", "#7CB342",
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return palette[hash % palette.length];
}

export default function EditorHeader({
  documentId,
  title,
  canEdit,
  isOwner,
  user,
  presence,
  typingNames,
  saveStatus,
  connected,
  onTitleChange,
  onShare,
  onToggleComments,
  onToggleHistory,
  onExportMarkdown,
  onImportMarkdown,
  onPrint,
}: EditorHeaderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localTitle, setLocalTitle] = useState(title);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [starred, setStarred] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const titleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setConfirmDelete(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const otherPresence = presence.filter((p) => p.id !== user.id);

  const handleTitleChange = (value: string) => {
    setLocalTitle(value);
    if (titleTimer.current) clearTimeout(titleTimer.current);
    titleTimer.current = setTimeout(() => {
      onTitleChange(value);
    }, 800);
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteDocument(documentId);
      if (result?.success) {
        router.push("/dashboard");
      } else {
        setConfirmDelete(false);
      }
    });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex h-14 items-center justify-between gap-2 px-2 sm:px-4">
        {/* Left: back + title */}
        <div className="flex min-w-0 items-center gap-1">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            title="Back to dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <FileText className="hidden h-4 w-4 text-gray-400 sm:block dark:text-gray-500" />
            <input
              type="text"
              value={localTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              disabled={!canEdit}
              aria-label="Document title"
              className="w-36 truncate rounded bg-transparent px-2 py-1 text-sm font-medium text-[#202124] outline-none transition hover:bg-gray-100 focus:bg-gray-100 focus:ring-1 focus:ring-blue-200 disabled:opacity-60 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800 sm:w-56 md:w-72"
            />
          </div>

          <button
            type="button"
            onClick={() => setStarred((s) => !s)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded text-gray-400 transition hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-800"
            title="Star"
          >
            <Star
              className={`h-4 w-4 ${starred ? "fill-amber-400 text-amber-400" : ""}`}
            />
          </button>
        </div>

        {/* Right: status, avatars, share, menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden text-right md:block">
            {typingNames.length > 0 && (
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {typingNames.length === 1
                  ? `${typingNames[0]} is typing…`
                  : `${typingNames.length} people typing…`}
              </p>
            )}
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              {!connected
                ? "Offline"
                : saveStatus === "saving"
                  ? "Saving…"
                  : "All changes saved"}
            </p>
          </div>

          {/* Avatars: current user + presence */}
          <div className="flex items-center">
            <div className="flex -space-x-2">
              <Avatar
                name={user.name ?? "You"}
                color={colorFromId(user.id)}
                image={user.image}
                online
              />
              {otherPresence.slice(0, 4).map((p) => (
                <Avatar
                  key={p.id}
                  name={p.name}
                  color={p.color}
                  image={p.image}
                  online={p.active}
                />
              ))}
            </div>
            {otherPresence.length > 4 && (
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                +{otherPresence.length - 4}
              </span>
            )}
          </div>

          <ThemeToggle />

          <button
            type="button"
            onClick={onShare}
            className="flex h-9 items-center gap-1.5 rounded border border-gray-300 bg-white px-3 text-sm font-medium text-[#1a73e8] transition hover:bg-[#f0f6ff] dark:border-gray-700 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>

          <button
            type="button"
            onClick={onToggleComments}
            className="flex h-9 w-9 items-center justify-center rounded text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            title="Comments"
          >
            <MessageSquare className="h-5 w-5" />
          </button>

          {/* Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              title="Document menu"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-11 z-50 w-60 rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                <MenuItem
                  icon={<FilePlus2 className="h-4 w-4" />}
                  label="New document"
                  onClick={() => router.push("/dashboard")}
                />
                <MenuItem
                  icon={<Clock className="h-4 w-4" />}
                  label="Version history"
                  onClick={onToggleHistory}
                />
                <MenuItem
                  icon={<MessageSquare className="h-4 w-4" />}
                  label="Comments"
                  onClick={onToggleComments}
                />
                <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
                <MenuItem
                  icon={<Download className="h-4 w-4" />}
                  label="Download as Markdown"
                  onClick={onExportMarkdown}
                />
                <MenuItem
                  icon={<Upload className="h-4 w-4" />}
                  label="Import Markdown"
                  onClick={onImportMarkdown}
                />
                <MenuItem
                  icon={<Printer className="h-4 w-4" />}
                  label="Print / Save as PDF"
                  onClick={onPrint}
                />
                {isOwner && (
                  <>
                    <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
                    {confirmDelete ? (
                      <div className="px-3 py-1.5">
                        <p className="mb-1.5 text-xs text-gray-500 dark:text-gray-400">
                          Delete this document?
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isPending}
                            className="flex flex-1 items-center justify-center gap-1 rounded bg-red-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            {isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(false)}
                            className="flex-1 rounded border border-gray-300 px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <MenuItem
                        icon={<Trash2 className="h-4 w-4 text-red-500" />}
                        label="Delete document"
                        onClick={() => setConfirmDelete(true)}
                        danger
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
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
