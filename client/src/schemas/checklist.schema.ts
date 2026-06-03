import z from "zod";

export const createChecklistItemSchema = z.object({
    label: z.string().trim().min(1, { message: 'Label is required' }).max(200),
})

export type ChecklistFormValues = z.infer<typeof createChecklistItemSchema>