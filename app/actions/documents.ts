"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canEdit, canManage, canView } from "@/lib/permissions";
import { titleSchema, shareSchema, contentSchema } from "@/lib/validations/documents";

// ========================================
// HELPERS
// ========================================

async function getAuthUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  return user;
}

/**
 * Returns the document together with the requesting user's role.
 * Returns null if the user has no access at all.
 */
async function getDocumentWithRole(documentId: string, userId: string) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: {
      permissions: {
        where: { userId },
      },
    },
  });

  if (!document) return null;

  const permission = document.permissions[0];
  if (!permission) return null;

  return { document, role: permission.role };
}

// ========================================
// CREATE DOCUMENT
// ========================================

export async function createDocument() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  const document = await prisma.document.create({
    data: {
      title: "Untitled document",
      content: "",
      ownerId: user.id,
      lastModifiedById: user.id,
      permissions: {
        create: {
          userId: user.id,
          role: "OWNER",
          lastOpenedAt: new Date(),
        },
      },
    },
  });

  revalidatePath("/dashboard");
  redirect(`/documents/${document.id}`);
}

// ========================================
// RENAME DOCUMENT
// ========================================

export async function updateDocumentTitle(documentId: string, title: string) {
  const parsed = titleSchema.safeParse({ title });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid title" };
  }

  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  const access = await getDocumentWithRole(documentId, user.id);
  if (!access) return { error: "Document not found" };
  if (!canEdit(access.role)) return { error: "You do not have permission to edit this document" };

  await prisma.document.update({
    where: { id: documentId },
    data: { title: parsed.data.title },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/documents/${documentId}`);
  return { success: true };
}

// ========================================
// UPDATE DOCUMENT CONTENT (fallback save)
// ========================================

export async function updateDocumentContent(documentId: string, content: string) {
  const parsed = contentSchema.safeParse({ content });
  if (!parsed.success) {
    return { error: "Invalid content" };
  }

  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  const access = await getDocumentWithRole(documentId, user.id);
  if (!access) return { error: "Document not found" };
  if (!canEdit(access.role)) return { error: "You do not have permission to edit this document" };

  await prisma.document.update({
    where: { id: documentId },
    data: {
      content: parsed.data.content,
      lastModifiedById: user.id,
      revision: { increment: 1 },
    },
  });

  revalidatePath(`/documents/${documentId}`);
  return { success: true };
}

// ========================================
// DELETE DOCUMENT
// ========================================

export async function deleteDocument(documentId: string) {
  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  const access = await getDocumentWithRole(documentId, user.id);
  if (!access) return { error: "Document not found" };
  if (!canManage(access.role)) return { error: "Only the owner can delete this document" };

  await prisma.document.delete({ where: { id: documentId } });

  revalidatePath("/dashboard");
  return { success: true };
}

// ========================================
// DUPLICATE DOCUMENT
// ========================================

export async function duplicateDocument(documentId: string) {
  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  const access = await getDocumentWithRole(documentId, user.id);
  if (!access) return { error: "Document not found" };
  if (!canView(access.role)) return { error: "You do not have access to this document" };

  const copy = await prisma.document.create({
    data: {
      title: `${access.document.title} (copy)`,
      content: access.document.content,
      ownerId: user.id,
      lastModifiedById: user.id,
      permissions: {
        create: {
          userId: user.id,
          role: "OWNER",
          lastOpenedAt: new Date(),
        },
      },
    },
  });

  revalidatePath("/dashboard");
  return { success: true, documentId: copy.id };
}

// ========================================
// SHARING
// ========================================

export async function shareDocument(
  documentId: string,
  email: string,
  role: "EDITOR" | "COMMENTER" | "VIEWER"
) {
  const parsed = shareSchema.safeParse({ email, role });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  const access = await getDocumentWithRole(documentId, user.id);
  if (!access) return { error: "Document not found" };
  if (!canManage(access.role)) return { error: "Only the owner can share this document" };

  const targetUser = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (!targetUser) return { error: "No user found with that email" };
  if (targetUser.id === user.id) return { error: "You already own this document" };

  await prisma.permission.upsert({
    where: {
      userId_documentId: {
        userId: targetUser.id,
        documentId,
      },
    },
    update: { role: parsed.data.role },
    create: {
      userId: targetUser.id,
      documentId,
      role: parsed.data.role,
    },
  });

  await prisma.notification.create({
    data: {
      userId: targetUser.id,
      type: "SHARE",
      message: `${user.name ?? user.email} shared "${access.document.title}" with you as ${role.toLowerCase()}`,
      href: `/documents/${documentId}`,
    },
  });

  revalidatePath(`/documents/${documentId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updatePermissionRole(
  documentId: string,
  userId: string,
  role: "EDITOR" | "COMMENTER" | "VIEWER"
) {
  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  const access = await getDocumentWithRole(documentId, user.id);
  if (!access) return { error: "Document not found" };
  if (!canManage(access.role)) return { error: "Only the owner can change permissions" };

  const permission = await prisma.permission.findUnique({
    where: {
      userId_documentId: { userId, documentId },
    },
  });

  if (!permission || permission.role === "OWNER") {
    return { error: "Cannot change this permission" };
  }

  await prisma.permission.update({
    where: { id: permission.id },
    data: { role },
  });

  revalidatePath(`/documents/${documentId}`);
  return { success: true };
}

export async function removeCollaborator(documentId: string, userId: string) {
  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  const access = await getDocumentWithRole(documentId, user.id);
  if (!access) return { error: "Document not found" };
  if (!canManage(access.role)) return { error: "Only the owner can remove collaborators" };

  const permission = await prisma.permission.findUnique({
    where: {
      userId_documentId: { userId, documentId },
    },
  });

  if (!permission || permission.role === "OWNER") {
    return { error: "Cannot remove this user" };
  }

  await prisma.permission.delete({ where: { id: permission.id } });

  revalidatePath(`/documents/${documentId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

// ========================================
// TRACK "RECENTLY OPENED"
// ========================================

export async function markDocumentOpened(documentId: string) {
  const user = await getAuthUser();
  if (!user) return;

  const permission = await prisma.permission.findUnique({
    where: {
      userId_documentId: { userId: user.id, documentId },
    },
  });

  if (permission) {
    await prisma.permission.update({
      where: { id: permission.id },
      data: { lastOpenedAt: new Date() },
    });
  }
}

// ========================================
// DOCUMENT DATA FOR THE EDITOR PAGE
// ========================================

export async function getDocumentForEditor(documentId: string) {
  const user = await getAuthUser();
  if (!user) return null;

  const access = await getDocumentWithRole(documentId, user.id);
  if (!access) return null;
  if (!canView(access.role)) return null;

  const collaborators = await prisma.permission.findMany({
    where: { documentId },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
    document: {
      id: access.document.id,
      title: access.document.title,
      content: access.document.content,
      revision: access.document.revision,
      ownerId: access.document.ownerId,
      lastModifiedById: access.document.lastModifiedById,
      createdAt: access.document.createdAt.toISOString(),
      updatedAt: access.document.updatedAt.toISOString(),
    },
    role: access.role,
    collaborators: collaborators.map((p) => ({
      id: p.user.id,
      name: p.user.name ?? "Unnamed",
      email: p.user.email,
      image: p.user.image,
      role: p.role,
    })),
  };
}

// ========================================
// COLLABORATORS (for the share dialog)
// ========================================

export async function getDocumentCollaborators(documentId: string) {
  const user = await getAuthUser();
  if (!user) return null;

  const access = await getDocumentWithRole(documentId, user.id);
  if (!access) return null;

  const collaborators = await prisma.permission.findMany({
    where: { documentId },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return {
    currentUser: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
    role: access.role,
    collaborators: collaborators.map((p) => ({
      id: p.user.id,
      name: p.user.name ?? "Unnamed",
      email: p.user.email,
      image: p.user.image,
      role: p.role,
      lastOpenedAt: p.lastOpenedAt?.toISOString() ?? null,
    })),
  };
}

// ========================================
// DASHBOARD DATA
// ========================================

export async function getDashboardDocuments() {
  const user = await getAuthUser();
  if (!user) return null;

  const owned = await prisma.document.findMany({
    where: { ownerId: user.id },
    include: {
      owner: { select: { id: true, name: true, email: true, image: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const sharedRows = await prisma.permission.findMany({
    where: {
      userId: user.id,
      role: { not: "OWNER" },
    },
    include: {
      document: {
        include: {
          owner: { select: { id: true, name: true, email: true, image: true } },
          _count: { select: { comments: true } },
        },
      },
    },
  });

  const shared = sharedRows.map((row) => ({
    ...row.document,
    accessRole: row.role,
    lastOpenedAt: row.lastOpenedAt,
  }));

  const ownList = owned.map((doc) => ({
    ...doc,
    accessRole: "OWNER" as const,
    lastOpenedAt: null,
  }));

  const recent = [...ownList, ...shared].sort((a, b) => {
    const aDate = a.lastOpenedAt ?? a.updatedAt;
    const bDate = b.lastOpenedAt ?? b.updatedAt;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
    owned: ownList.map((doc) => serializeDoc(doc)),
    shared: shared.map((doc) => serializeDoc(doc)),
    recent: recent.map((doc) => serializeDoc(doc)),
  };
}

type DashboardDoc = {
  id: string;
  title: string;
  content: string;
  revision: number;
  ownerId: string;
  lastModifiedById: string | null;
  createdAt: Date;
  updatedAt: Date;
  accessRole: string;
  lastOpenedAt: Date | null;
  owner: { id: string; name: string | null; email: string | null; image: string | null };
  _count: { comments: number };
};

function serializeDoc(doc: DashboardDoc) {
  return {
    id: doc.id,
    title: doc.title,
    ownerId: doc.ownerId,
    accessRole: doc.accessRole,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    lastOpenedAt: doc.lastOpenedAt?.toISOString() ?? null,
    owner: {
      id: doc.owner.id,
      name: doc.owner.name ?? "Unnamed",
      email: doc.owner.email,
      image: doc.owner.image,
    },
    commentCount: doc._count.comments,
    lastModifiedById: doc.lastModifiedById,
  };
}

export type DashboardData = NonNullable<
  Awaited<ReturnType<typeof getDashboardDocuments>>
>;
