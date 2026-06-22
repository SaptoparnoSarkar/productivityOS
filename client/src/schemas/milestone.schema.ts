import * as z from "zod";

const baseMilestoneFields = z.object({
    type: z.enum(["counter", "checklist"], {
        message: "Type must be either 'counter' or 'checklist'",
    }),
    title: z.string().trim().min(1, { message: "Title is required" }).max(100),
    description: z.string().max(2000).nullish(),
    daily_minimum: z.coerce.number().int().positive().optional(),
    daily_minimum_unit: z.string().optional(),
    weekly_minimum: z.coerce.number().int().min(1).max(7).optional(),
})

//Refine applied seperately for create and update
export const createMilestoneSchema = baseMilestoneFields.refine(
    (data) => {
        const hasMin = data.daily_minimum !== undefined;
        const hasUnit = data.daily_minimum_unit !== undefined;
        return hasMin === hasUnit;
    },
    { message: "daily_minimum and daily_minimum_unit must be provided together" },
)

export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;


export const updateMilestoneSchema = baseMilestoneFields
    .omit({ type: true })
    .partial()
    .refine(
        (data) => {
            const hasMin = data.daily_minimum !== undefined;
            const hasUnit = data.daily_minimum_unit !== undefined;
            return hasMin === hasUnit;
        },
        { message: "Daily Minimum and Daily Minumum Unit must be provided together." }
    )
    .refine(
        (data) => Object.keys(data).length > 0,
        { message: "Provide at least one field to update." }
    );

export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;