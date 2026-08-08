import { z } from "zod";

export const commentSchema = z.object({
  content: z.string().trim().min(1, "Comment cannot be empty").max(5000),
  selection: z.string().trim().max(1000).nullable().optional(),
});
