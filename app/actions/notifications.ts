"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

async function getAuthUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  return user;
}

// ========================================
// LIST NOTIFICATIONS
// ========================================

export async function getNotifications() {
  const user = await getAuthUser();
  if (!user) return [];

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return notifications.map((n) => ({
    id: n.id,
    type: n.type,
    message: n.message,
    href: n.href,
    read: n.read,
    createdAt: n.createdAt.toISOString(),
  }));
}

export type NotificationItem = Awaited<
  ReturnType<typeof getNotifications>
>[number];

// ========================================
// MARK AS READ
// ========================================

export async function markNotificationsRead(ids?: string[]) {
  const user = await getAuthUser();
  if (!user) return;

  await prisma.notification.updateMany({
    where: {
      userId: user.id,
      ...(ids && ids.length > 0 ? { id: { in: ids } } : { read: false }),
    },
    data: { read: true },
  });

  revalidatePath("/dashboard");
}
