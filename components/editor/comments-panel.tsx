"use client";

import { useState, useTransition, useEffect } from "react";
import { X, Send, MessageSquare, CheckCheck, Trash2, RotateCcw } from "lucide-react";

import {
  getComments,
  addComment,
  replyToComment,
  toggleCommentResolved,
  deleteComment,
} from "@/app/actions/comments";

type CommentAuthor = {
  id: string;
  name: string;
  email: string | null;
  image: string | null;
};

type Reply = {
  id: string;
  content: string;
  createdAt: string;
  author: CommentAuthor;
};

type CommentThread = {
  id: string;
  content: string;
  selection: string | null;
  resolved: boolean;
  resolvedAt: string | null;
  resolvedBy: { id: string; name: string } | null;
  createdAt: string;
  author: CommentAuthor;
  replies: Reply[];
};

type CommentsPanelProps = {
  open: boolean;
  onClose: () => void;
  documentId: string;
  canComment: boolean;
  currentUserId: string;
  ownerId: string;
  selectedText: string;
};

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CommentsPanel({
  open,
  onClose,
  documentId,
  canComment,
  currentUserId,
  ownerId,
  selectedText,
}: CommentsPanelProps) {
  const [comments, setComments] = useState<CommentThread[]>([]);
  const [draft, setDraft] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const loadComments = () => {
    startTransition(async () => {
      const data = await getComments(documentId);
      setComments(data);
    });
  };

  useEffect(() => {
    if (open) {
      loadComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, documentId]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const selection = selectedText.trim() ? selectedText.trim().slice(0, 200) : null;
      const result = await addComment(documentId, draft, selection);
      if (result?.error) {
        setError(result.error);
      } else {
        setDraft("");
        loadComments();
      }
    });
  };

  const handleReply = (threadId: string, content: string) => {
    startTransition(async () => {
      await replyToComment(documentId, threadId, content);
      setReplyDrafts((prev) => ({ ...prev, [threadId]: "" }));
      loadComments();
    });
  };

  const handleResolve = (threadId: string) => {
    startTransition(async () => {
      await toggleCommentResolved(documentId, threadId);
      loadComments();
    });
  };

  const handleDelete = (commentId: string) => {
    startTransition(async () => {
      await deleteComment(documentId, commentId);
      loadComments();
    });
  };

  const openCount = comments.filter((c) => !c.resolved).length;

  if (!open) return null;

  return (
    <aside className="fixed inset-y-0 right-0 z-40 flex w-full max-w-sm flex-col border-l border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <h2 className="text-sm font-medium text-[#202124] dark:text-gray-100">
            Comments
            {openCount > 0 && (
              <span className="ml-1.5 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                {openCount}
              </span>
            )}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Compose */}
      {canComment && (
        <form onSubmit={handleAdd} className="border-b border-gray-200 p-4 dark:border-gray-800">
          {selectedText.trim() && (
            <div className="mb-2 rounded bg-amber-50 p-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
              <p className="mb-0.5 font-medium">Commenting on:</p>
              <p className="line-clamp-2">“{selectedText.trim().slice(0, 200)}”</p>
            </div>
          )}
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a comment…"
            rows={2}
            className="w-full resize-none rounded border border-gray-300 p-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={!draft.trim() || isPending}
              className="flex items-center gap-1.5 rounded bg-[#1a73e8] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1765cc] disabled:opacity-50"
            >
              <Send className="h-3 w-3" />
              Comment
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {comments.length === 0 ? (
          <div className="py-10 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-gray-200 dark:text-gray-700" />
            <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">No comments yet</p>
          </div>
        ) : (
          comments.map((thread) => (
            <CommentThread
              key={thread.id}
              thread={thread}
              currentUserId={currentUserId}
              ownerId={ownerId}
              canComment={canComment}
              replyDraft={replyDrafts[thread.id] ?? ""}
              onReplyDraftChange={(value) =>
                setReplyDrafts((prev) => ({ ...prev, [thread.id]: value }))
              }
              onReply={(content) => handleReply(thread.id, content)}
              onResolve={() => handleResolve(thread.id)}
              onDelete={() => handleDelete(thread.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}

function CommentThread({
  thread,
  currentUserId,
  ownerId,
  canComment,
  replyDraft,
  onReplyDraftChange,
  onReply,
  onResolve,
  onDelete,
}: {
  thread: CommentThread;
  currentUserId: string;
  ownerId: string;
  canComment: boolean;
  replyDraft: string;
  onReplyDraftChange: (value: string) => void;
  onReply: (content: string) => void;
  onResolve: () => void;
  onDelete: () => void;
}) {
  const [replying, setReplying] = useState(false);
  const canDelete = thread.author.id === currentUserId || ownerId === currentUserId;

  return (
    <div
      className={`rounded-lg border p-3 ${
        thread.resolved
          ? "border-gray-100 bg-gray-50 opacity-70 dark:border-gray-800 dark:bg-gray-800/50"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      {/* Author row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {thread.author.image ? (
            <img
              src={thread.author.image}
              alt={thread.author.name}
              className="h-6 w-6 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              {thread.author.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{thread.author.name}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">{timeAgo(thread.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          {thread.resolved && (
            <span className="mr-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-950/60 dark:text-green-400">
              Resolved
            </span>
          )}
          {canComment && (
            <button
              type="button"
              onClick={onResolve}
              className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-green-600 dark:text-gray-500 dark:hover:bg-gray-800"
              title={thread.resolved ? "Reopen" : "Resolve"}
            >
              {thread.resolved ? (
                <RotateCcw className="h-3.5 w-3.5" />
              ) : (
                <CheckCheck className="h-3.5 w-3.5" />
              )}
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-red-50 hover:text-red-500 dark:text-gray-500 dark:hover:bg-red-950/50 dark:hover:text-red-400"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Selection context */}
      {thread.selection && (
        <blockquote className="mt-2 border-l-2 border-amber-300 bg-amber-50 px-2 py-1 text-xs italic text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
          “{thread.selection}”
        </blockquote>
      )}

      {/* Content */}
      <p
        className={`mt-2 text-sm leading-relaxed ${
          thread.resolved ? "text-gray-500 line-through" : "text-gray-700 dark:text-gray-300"
        }`}
      >
        {thread.content}
      </p>

      {/* Replies */}
      {thread.replies.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-gray-100 pt-2 dark:border-gray-700">
          {thread.replies.map((reply) => (
            <div key={reply.id} className="flex gap-2">
              {reply.author.image ? (
                <img
                  src={reply.author.image}
                  alt={reply.author.name}
                  className="h-5 w-5 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-200 text-[9px] font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {reply.author.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="rounded bg-gray-50 px-2 py-1 dark:bg-gray-800">
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                  {reply.author.name} · {timeAgo(reply.createdAt)}
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-300">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply */}
      {canComment && (
        <div className="mt-2">
          {replying ? (
            <div className="flex items-end gap-1.5">
              <input
                type="text"
                value={replyDraft}
                onChange={(e) => onReplyDraftChange(e.target.value)}
                placeholder="Reply…"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && replyDraft.trim()) {
                    onReply(replyDraft.trim());
                    setReplying(false);
                  }
                }}
                className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-950 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={() => {
                  if (replyDraft.trim()) {
                    onReply(replyDraft.trim());
                    setReplying(false);
                  }
                }}
                className="flex h-6 w-6 items-center justify-center rounded bg-[#1a73e8] text-white hover:bg-[#1765cc]"
              >
                <Send className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setReplying(true)}
              className="mt-1 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Reply
            </button>
          )}
        </div>
      )}
    </div>
  );
}
