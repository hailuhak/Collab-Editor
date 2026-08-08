"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canEdit, canView } from "@/lib/permissions";

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
// LIST VERSIONS
// ========================================

export async function listVersions(documentId: string) {
  const user = await getAuthUser();
  if (!user) return [];

  const role = await getDocumentRole(documentId, user.id);
  if (!role) return [];

  const versions = await prisma.version.findMany({
    where: { documentId },
    include: {
      author: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { version: "desc" },
  });

  return versions.map((v) => ({
    id: v.id,
    version: v.version,
    createdAt: v.createdAt.toISOString(),
    author: {
      id: v.author.id,
      name: v.author.name ?? "Unnamed",
      image: v.author.image,
    },
  }));
}

// ========================================
// GET VERSION CONTENT (for preview)
// ========================================

export async function getVersionContent(documentId: string, versionId: string) {
  const user = await getAuthUser();
  if (!user) return null;

  const role = await getDocumentRole(documentId, user.id);
  if (!role) return null;
  if (!canView(role)) return null;

  const version = await prisma.version.findUnique({
    where: { id: versionId },
  });

  if (!version || version.documentId !== documentId) return null;

  return { content: version.content, version: version.version };
}

// ========================================
// RESTORE VERSION
// ========================================

export async function restoreVersion(documentId: string, versionId: string) {
  const user = await getAuthUser();
  if (!user) return { error: "Unauthorized" };

  const role = await getDocumentRole(documentId, user.id);
  if (!role) return { error: "Document not found" };
  if (!canEdit(role)) {
    return { error: "You do not have permission to restore this document" };
  }

  const version = await prisma.version.findUnique({
    where: { id: versionId },
  });

  if (!version || version.documentId !== documentId) {
    return { error: "Version not found" };
  }

  const current = await prisma.document.findUnique({
    where: { id: documentId },
    select: { content: true, title: true },
  });

  if (!current) return { error: "Document not found" };

  const lastVersion = await prisma.version.aggregate({
    where: { documentId },
    _max: { version: true },
  });
  const nextVersion = (lastVersion._max.version ?? 0) + 1;

  // Snapshot the current state so it can be restored again later.
  await prisma.$transaction([
    prisma.version.create({
      data: {
        documentId,
        content: current.content,
        authorId: user.id,
        version: nextVersion,
      },
    }),
    prisma.document.update({
      where: { id: documentId },
      data: {
        content: version.content,
        revision: { increment: 1 },
        lastModifiedById: user.id,
      },
    }),
  ]);

  revalidatePath(`/documents/${documentId}`);
  revalidatePath("/dashboard");
  return { success: true, version: version.version };
}
