"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canComment } from "@/lib/permissions";
import { commentSchema } from "@/lib/validations/comments";

async function getAuthUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  return user;
}

async function getDocumentRole(documentId: string, userId: string) {
  const permission = await prisma.permission.findUnique({
    where: {
      userId_documentId: { userId, documentId },
    },
  });
  return permission?.role ?? null;
}

// ========================================
// LIST COMMENTS
// ========================================

export async function getComments(documentId: string) {
  const user = await getAuthUser();
  if (!user) return [];

  const role = await getDocumentRole(documentId, user.id);
  if (!role) return [];

  const comments = await prisma.comment.findMany({
    where: { documentId, parentId: null },
    include: {
      author: { select: { id: true, name: true, email: true, image: true } },
      replies: {
        include: {
          author: { select: { id: true, name: true, email: true, image: true } },
        },
        orderBy: { createdAt: "asc" },
      },
      resolvedBy: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return comments.map((c) => ({
    id: c.id,
    content: c.content,
    selection: c.selection,
    resolved: c.resolved,
    resolvedAt: c.resolvedAt?.toISOString() ?? null,
    resolvedBy: c.resolvedBy
      ? { id: c.resolvedBy.id, name: c.resolvedBy.name ?? "Unknown" }
      : null,
    createdAt: c.createdAt.toISOString(),
    author: {
      id: c.author.id,
      name: c.author.name ?? "Unnamed",
      email: c.author.email,
      image: c.author.image,
    },
    replies: c.replies.map((r) => ({
      id: r.id,
      content: r.content,
      createdAt: r.createdAt.toISOString(),
      author: {
        id: r.author.id,
        name: r.author.name ?? "Unnamed",
        email: r.author.email,
        image: r.author.image,
      },
    })),
  }));
}

// ========================================
// ADD COMMENT
// ========================================

export async function addComment(
  documentId: string,
  content: string,
  selection?: string | null
) {
  const parsed = commentSchema.safeParse({ content, selection });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid comment" };
  }

  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  const role = await getDocumentRole(documentId, user.id);
  if (!role) return { error: "Document not found" };
  if (!canComment(role)) return { error: "You do not have permission to comment" };

  await prisma.comment.create({
    data: {
      content: parsed.data.content,
      selection: parsed.data.selection ?? null,
      userId: user.id,
      documentId,
    },
  });

  revalidatePath(`/documents/${documentId}`);
  return { success: true };
}

// ========================================
// REPLY TO COMMENT
// ========================================

export async function replyToComment(documentId: string, parentId: string, content: string) {
  const parsed = commentSchema.safeParse({ content });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid reply" };
  }

  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  const role = await getDocumentRole(documentId, user.id);
  if (!role) return { error: "Document not found" };
  if (!canComment(role)) return { error: "You do not have permission to comment" };

  const parent = await prisma.comment.findUnique({ where: { id: parentId } });
  if (!parent || parent.documentId !== documentId) {
    return { error: "Comment not found" };
  }

  await prisma.comment.create({
    data: {
      content: parsed.data.content,
      userId: user.id,
      documentId,
      parentId,
    },
  });

  revalidatePath(`/documents/${documentId}`);
  return { success: true };
}

// ========================================
// RESOLVE / UNRESOLVE COMMENT
// ========================================

export async function toggleCommentResolved(documentId: string, commentId: string) {
  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  const role = await getDocumentRole(documentId, user.id);
  if (!role) return { error: "Document not found" };
  if (!canComment(role)) return { error: "You do not have permission to resolve comments" };

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment || comment.documentId !== documentId) {
    return { error: "Comment not found" };
  }

  await prisma.comment.update({
    where: { id: commentId },
    data: {
      resolved: !comment.resolved,
      resolvedById: comment.resolved ? null : user.id,
      resolvedAt: comment.resolved ? null : new Date(),
    },
  });

  revalidatePath(`/documents/${documentId}`);
  return { success: true };
}

// ========================================
// DELETE COMMENT (own comments, or owner of document)
// ========================================

export async function deleteComment(documentId: string, commentId: string) {
  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { document: { select: { ownerId: true } } },
  });

  if (!comment || comment.documentId !== documentId) {
    return { error: "Comment not found" };
  }

  const isAuthor = comment.userId === user.id;
  const isOwner = comment.document.ownerId === user.id;

  if (!isAuthor && !isOwner) {
    return { error: "You can only delete your own comments" };
  }

  await prisma.comment.delete({ where: { id: commentId } });

  revalidatePath(`/documents/${documentId}`);
  return { success: true };
}
