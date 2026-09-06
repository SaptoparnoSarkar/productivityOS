import z from "zod";

export const createWeaknessSchema = z.object({
  subject_id: z.coerce.number().int().positive().nullable().optional(),
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Cannot exceed more than 100 characters" }),
  description: z
    .string()
    .max(300, { message: "Cannot exceed more than 300 characters" }),
});

export type CreateWeaknessInput = z.infer<typeof createWeaknessSchema>;

export const updateWeaknessSchema = z
  .object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(300).optional(),
    status: z.enum(["active", "resolved"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateWeaknessInput = z.infer<typeof updateWeaknessSchema>;

export const createWeaknessNoteSchema = z.object({
  content: z.string().trim().min(1, { message: "Note content is required" }),
});

export type CreateWeaknessNoteInput = z.infer<typeof createWeaknessNoteSchema>;
