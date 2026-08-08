"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

// Helper function to get authenticated user
async function getAuthUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  return user;
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

      permissions: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
    },
  });

  revalidatePath("/dashboard");
  redirect(`/documents/${document.id}`);
}

// ========================================
// UPDATE DOCUMENT TITLE
// ========================================
export async function updateDocumentTitle(
  documentId: string,
  title: string
) {
  const user = await getAuthUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const cleanTitle = title.trim();

  if (!cleanTitle) {
    return { error: "Title cannot be empty" };
  }

  // Check document existence & permissions
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document) {
    return { error: "Document not found" };
  }

  if (document.ownerId !== user.id) {
    return { error: "You do not have permission to edit this document" };
  }

  // Update PostgreSQL
  await prisma.document.update({
    where: { id: documentId },
    data: { title: cleanTitle },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/documents/${documentId}`);

  return { success: true };
}

// ========================================
// UPDATE DOCUMENT CONTENT
// ========================================
export async function updateDocumentContent(
  documentId: string,
  content: string
) {
  if (!documentId) {
    return { error: "Document ID is required" };
  }

  const user = await getAuthUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Verify ownership / permission before saving content
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document) {
    return { error: "Document not found" };
  }

  if (document.ownerId !== user.id) {
    return { error: "You do not have permission to edit this document" };
  }

  await prisma.document.update({
    where: { id: documentId },
    data: { content },
  });

  revalidatePath(`/documents/${documentId}`);

  return { success: true };
}