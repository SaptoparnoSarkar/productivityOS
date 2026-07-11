import z from "zod";

export const createChecklistItemsSchema = z.object({
    label: z.string().trim().min(1, { message: 'Label is required' }).max(200),
    target_count: z.coerce.number().int().positive().max(100)

})

export type ChecklistFormValues = z.input<typeof createChecklistItemsSchema>
export type ChecklistFormOutput = z.output<typeof createChecklistItemsSchema>