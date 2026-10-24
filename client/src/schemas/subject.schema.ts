import * as z from "zod";

export const createSubjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title cannot exceed 100 characters" }),
  description: z.string().max(200).optional(),
  type: z.enum(["completable", "ongoing"]),
  has_pomodoro: z.boolean().optional(),
  due_date: z.union([z.literal(""), z.iso.date()])
    .nullish()
    .transform((v) => (v === "" ? null : v)),
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
