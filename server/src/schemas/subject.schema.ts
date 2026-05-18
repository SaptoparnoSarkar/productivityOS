import * as z from "zod";

// Base shape — no refine, stays ZodObject
const baseSubjectFields = z.object({
  type: z.enum(["completable", "ongoing"]),
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title cannot exceed 100 characters" }),
  description: z.string().optional(),
  has_pomodoro: z.boolean().optional(),
  daily_minimum: z.number().int().positive().optional(),
  daily_minimum_unit: z.string().optional(),
  weekly_minimum: z.number().int().min(1).max(7).optional(),
});

//Refine applied seperately for create and update
export const createSubjectSchema = baseSubjectFields.refine(
  (data) => {
    const hasMin = data.daily_minimum !== undefined;
    const hasUnit = data.daily_minimum_unit !== undefined;
    return hasMin === hasUnit;
  },
  { message: "daily_minimum and daily_minimum_unit must be provided together" },
);

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;

export const updateSubjectSchema = baseSubjectFields
  .omit({ type: true, has_pomodoro: true })
  .partial()
  .refine(
    (data) => {
      const hasMin = data.daily_minimum !== undefined;
      const hasUnit = data.daily_minimum_unit !== undefined;
      return hasMin === hasUnit;
    },
    {
      message: "daily_minimum and daily_minimum_unit must be provided together",
    },
  );

export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
