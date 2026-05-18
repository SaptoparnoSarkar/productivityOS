import * as z from "zod";

export const createChecklistSchema = z.object({
  label: z.string().trim().min(1, { message: "Label is required" }).max(100),
});
export type CreateChecklistInputType = z.infer<typeof createChecklistSchema>;

export const updateChecklistSchema = z
  .object({
    label: z
      .string()
      .trim()
      .min(1, { message: "Label is required" })
      .max(100)
      .optional(),
    is_done: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });
export type UpdateChecklistInputType = z.infer<typeof updateChecklistSchema>;
