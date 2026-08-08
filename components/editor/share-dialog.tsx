"use client";

import { useState, useTransition, useEffect } from "react";
import { X, Mail, Copy, Check, Shield, Trash2, Loader2 } from "lucide-react";

import {
  shareDocument,
  updatePermissionRole,
  removeCollaborator,
  getDocumentCollaborators,
} from "@/app/actions/documents";
import { roleLabel } from "@/lib/permissions";

type ShareDialogProps = {
  open: boolean;
  onClose: () => void;
  documentId: string;
};

type Collaborator = {
  id: string;
  name: string;
  email: string | null;
  image: string | null;
  role: string;
};

type Role = "EDITOR" | "COMMENTER" | "VIEWER";

const ROLE_OPTIONS: { value: Role; label: string; hint: string }[] = [
  { value: "EDITOR", label: "Editor", hint: "Can edit" },
  { value: "COMMENTER", label: "Commenter", hint: "Can comment and view" },
  { value: "VIEWER", label: "Viewer", hint: "Can view" },
];

export default function ShareDialog({
  open,
  onClose,
  documentId,
}: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [currentRole, setCurrentRole] = useState<string>("");
  const [email, setEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>("VIEWER");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadCollaborators = () => {
    startTransition(async () => {
      const data = await getDocumentCollaborators(documentId);
      if (data) {
        setCollaborators(data.collaborators);
        setCurrentRole(data.role);
      }
    });
  };

  // Load when the dialog opens.
  useEffect(() => {
    if (open) {
      let cancelled = false;
      startTransition(async () => {
        setError("");
        const data = await getDocumentCollaborators(documentId);
        if (!cancelled && data) {
          setCollaborators(data.collaborators);
          setCurrentRole(data.role);
        }
      });
      return () => {
        cancelled = true;
      };
    }
  }, [open, documentId]);

  const canManage = currentRole === "OWNER";

  if (!open) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await shareDocument(documentId, email, newRole);
      if (result?.error) {
        setError(result.error);
      } else {
        setEmail("");
        loadCollaborators();
      }
    });
  };

  const handleRoleChange = (userId: string, role: Role) => {
    startTransition(async () => {
      await updatePermissionRole(documentId, userId, role);
      loadCollaborators();
    });
  };

  const handleRemove = (userId: string) => {
    startTransition(async () => {
      await removeCollaborator(documentId, userId);
      loadCollaborators();
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white shadow-2xl dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-gray-800">
          <h2 className="text-base font-medium text-[#202124] dark:text-gray-100">Share document</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          {/* Add people */}
          <form onSubmit={handleAdd} className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
              Add people
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                  className="w-full rounded border border-gray-300 py-2 pl-8 pr-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
                />
              </div>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as Role)}
                className="rounded border border-gray-300 px-2 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={isPending}
                className="rounded bg-[#1a73e8] px-4 py-2 text-sm font-medium text-white hover:bg-[#1765cc] disabled:opacity-50"
              >
                Send
              </button>
            </div>
            {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
          </form>

          {/* Access list */}
          <div className="max-h-60 space-y-1 overflow-y-auto">
            {collaborators.map((c) => {
              const isSelfOwner = c.role === "OWNER";
              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    {c.image ? (
                      <img
                        src={c.image}
                        alt={c.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                        {c.name}
                        {isSelfOwner && (
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">(you)</span>
                        )}
                      </p>
                      {c.email && (
                        <p className="truncate text-xs text-gray-400 dark:text-gray-500">{c.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {isSelfOwner ? (
                      <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        <Shield className="h-3 w-3" />
                        Owner
                      </span>
                    ) : (
                      <>
                        {canManage ? (
                          <select
                            value={c.role}
                            onChange={(e) =>
                              handleRoleChange(c.id, e.target.value as Role)
                            }
                            className="rounded border border-gray-200 bg-white px-2 py-1 text-xs outline-none hover:border-gray-300 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200"
                          >
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r.value} value={r.value}>
                                {r.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {roleLabel(c.role as never)}
                          </span>
                        )}
                        {canManage && (
                          <button
                            type="button"
                            onClick={() => handleRemove(c.id)}
                            className="flex h-7 w-7 items-center justify-center rounded text-gray-400 hover:bg-red-50 hover:text-red-500 dark:text-gray-500 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                            title={`Remove ${c.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Copy link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Link copied" : "Copy link"}
          </button>

          {isPending && (
            <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Loader2 className="h-3 w-3 animate-spin" />
              Updating…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
