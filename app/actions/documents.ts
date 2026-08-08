"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

export async function createDocument(formData: FormData) {
  const session = await getServerSession(authOptions);

  // User must be logged in
  if (!session?.user?.email) {
    redirect("/login");
  }

  // Find the logged-in user
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const titleValue = formData.get("title");

  const title =
    typeof titleValue === "string" && titleValue.trim()
      ? titleValue.trim()
      : "Untitled Document";

  // Create document
  const document = await prisma.document.create({
    data: {
      title,
      content: "",
      ownerId: user.id,

      // Owner automatically gets OWNER permission
      permissions: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
    },
  });

  // Open the new document
  redirect(`/documents/${document.id}`);
}