import * as z from "zod";

// Zod transform to turn empty form values into undefined/null while preserving input types as string | undefined
const nullableFormString = z
    .string()
    .max(2000)
    .transform((val) => (val === "" ? undefined : val))
    .optional();

const nullableFormDate = z
    .string()
    .date()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val))
    .optional();

export const createMilestoneSchema = z.object({
    type: z.enum(["counter", "checklist"], {
        message: "Type must be either 'counter' or 'checklist'",
    }),
    title: z.string().trim().min(1, { message: "Title is required" }).max(100),
    description: nullableFormString,
    due_date: nullableFormDate,
});
export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;

export const updateMilestoneSchema = z.object({
    title: z.string().trim().min(1, { message: "Title is required" }).max(100),
    description: nullableFormString,
    due_date: nullableFormDate,
});


export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;
