"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { passwordSchema } from "@/lib/validations/auth";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordReset(email: string) {
  const normalized = email.trim().toLowerCase();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);

  // Do not reveal whether the email exists or was throttled.
  if (!validEmail) {
    return { success: true };
  }

  const limited = rateLimit(`reset:${normalized}`, {
    limit: 3,
    windowMs: 60 * 60 * 1000,
    blockMs: 60 * 60 * 1000,
  });
  if (limited.blocked) {
    return { success: true };
  }

  const user = await prisma.user.findFirst({
    where: { email: { equals: normalized, mode: "insensitive" } },
  });

  if (!user) {
    return { success: true };
  }

  // OAuth accounts have no password to reset, but do not reveal that.
  if (!user.password) {
    return { success: true };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
    prisma.passwordResetToken.create({
      data: { token: hashToken(token), userId: user.id, expires },
    }),
  ]);

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  if (!user.email) {
    return { success: true };
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER ?? "CollabDocs <noreply@collabdocs.app>",
      to: user.email,
      subject: "Reset your password",
      html: `
         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
            <h2>Password Reset</h2>
            <p>You requested to reset your password.</p>
            <p>Click the button below to create a new password.</p>
            <a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#7c3aed;color:white;text-decoration:none;border-radius:6px;">
               Reset Password
            </a>
            <p style="margin-top: 20px;">This link expires in 1 hour.</p>
            <p>If you did not request a password reset, you can safely ignore this email.</p>
         </div>
      `,
    });
  } catch {
    return { success: true };
  }

  return { success: true };
}

const resetSchema = passwordSchema;

export async function resetPassword(token: string, password: string) {
   const parsed = resetSchema.safeParse({ password });
   if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid password" };
   }

   const record = await prisma.passwordResetToken.findUnique({
      where: { token: hashToken(token) },
      include: { user: true },
   });

   if (!record) {
      return { error: "Invalid or expired reset link" };
   }

   if (record.expires < new Date()) {
      return { error: "This reset link has expired" };
   }

   const hashed = await bcrypt.hash(parsed.data.password, 12);

   await prisma.$transaction([
      prisma.user.update({
         where: { id: record.userId },
         data: { password: hashed },
      }),
      prisma.passwordResetToken.delete({ where: { id: record.id } }),
   ]);

   return { success: true };
}
