import { z } from "zod";
import { PermissionRole } from "@prisma/client";

export const titleSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title is too long"),
});

export const shareSchema = z.object({
  email: z.string().email("Invalid email"),
  role: z.nativeEnum(PermissionRole).refine(
    (role) => role !== "OWNER",
    "Cannot assign the owner role"
  ),
});

export const contentSchema = z.object({
  content: z.string().max(2_000_000, "Document too large"),
});
