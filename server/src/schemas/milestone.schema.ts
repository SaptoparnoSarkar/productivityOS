import * as z from 'zod';

export const createMilestoneSchema = z.object({
    type: z.string().min(1, {message: 'Type is required'}),
    title: z.string().min(1, {message: 'Title is required'}),
    description: z.string().max(2000).nullish(),
    due_date: z.string().date().nullish()
});

export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>

export const updateMilestoneSchema = createMilestoneSchema
    .omit({type: true})
    .partial()
    .refine((data) => {
        return data.title !== undefined || data.description !== undefined || data.due_date !== undefined;
    }, {
        message: "Provide at least one field to update"
    })

export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>

//TODO Tighten z.enum for type
