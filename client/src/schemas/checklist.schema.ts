import z from "zod";

// export const createChecklistItemsSchema = z.object({
//     label: z.string().trim().min(1, { message: 'Label is required' }).max(200),
//     target_count: z.coerce.number().int().positive().max(100)

// })

// export type ChecklistFormValues = z.input<typeof createChecklistItemsSchema>
// export type ChecklistFormOutput = z.output<typeof createChecklistItemsSchema>




export const createChecklistTargetSchema = z.object({
    target_count: z.coerce.number().int().positive({ message: "Target count must be a positive integer" }).max(100, { message: "Target count cannot be more than 100" })
})
export type CreateChecklistTargetInput = z.infer<typeof createChecklistTargetSchema>;


export const createChecklistItemsSchema = z.object({
    label: z.string().trim().min(1, { message: "Label is required" }).max(100),
});
export type CreateChecklistItemsInput = z.infer<typeof createChecklistItemsSchema>;

export const updateChecklistItemsSchema = z
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
export type UpdateChecklistItemsInput = z.infer<typeof updateChecklistItemsSchema>;


export const checklistFormSchema = createChecklistItemsSchema.extend(createChecklistTargetSchema.shape)
export type ChecklistFormInput = z.input<typeof checklistFormSchema>
export type ChecklistFormOutput = z.output<typeof checklistFormSchema>