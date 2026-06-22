import * as z from "zod";

// Base shape — no refine, stays ZodObject
export const createSubjectSchema = z.object({
  type: z.enum(["completable", "ongoing"]),
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title cannot exceed 100 characters" }),
  description: z.string().nullish(),
  has_pomodoro: z.boolean().optional(),
  due_date: z.string().date().nullish(),
});

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;

export const updateSubjectSchema = createSubjectSchema
  .omit({ type: true, has_pomodoro: true })
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "Provide at least one field to update." }
  )

export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
