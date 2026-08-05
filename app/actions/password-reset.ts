"use server";

import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/email";

export async function requestPasswordReset(email: string) {
   const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
   });

   // Do not reveal whether the email exists.
   if (!user) {
      return { success: true };
   }

   const token = crypto.randomBytes(32).toString("hex");
   const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

   // Remove any previous reset tokens for this user before issuing a new one.
   await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

   await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expires },
   });

   const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

   await transporter.sendMail({
      from: process.env.EMAIL_USER,
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

   return { success: true };
}