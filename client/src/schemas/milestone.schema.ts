import * as z from "zod";
import { createCounterSchema } from "./counter.schema";
import { createChecklistItemsSchema, createChecklistTargetSchema } from "./checklist.schema";

const baseMilestoneFields = z.object({
    type: z.enum(["counter", "checklist"], {
        message: "Type must be either 'counter' or 'checklist'",
    }),
    title: z.string().trim().min(1, { message: "Title is required" }).max(100),
    description: z.string().max(2000).optional(),
    daily_minimum: z.union([z.literal(""), z.coerce.number().int().min(1, { message: "Cannot be less than 1" }).max(50, { message: "Cannot be more than 50" })]).optional()
        .transform((val) => {
            return val === "" ? undefined : val
        }),
    daily_minimum_unit: z.union([z.literal(""), z.string().max(50, { message: "Unit cannot be more than 50 characters" })]).optional()
        .transform((val) => {
            return val === "" ? undefined : val
        }),
    weekly_minimum: z.union([z.literal(""), z.coerce.number().int().min(1, { message: "Cannot be less than 1" }).max(7, { message: "Cannot be more than 7" })]).optional()
        .transform((val) => {
            return val === "" ? undefined : val
        }),
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

const counterCreationSchema = z.object({
    milestone: z.intersection(
        createMilestoneSchema,
        z.object({ type: z.literal('counter') })
    ),
    setup: createCounterSchema
})

const checklistCreationSchema = z.object({
    milestone: z.intersection(
        createMilestoneSchema,
        z.object({ type: z.literal('checklist') })
    ),
    setup: createChecklistTargetSchema.extend(createChecklistItemsSchema.shape)
})

export const milestoneCreationSchema = z.union([counterCreationSchema, checklistCreationSchema])
export type MilestoneCreationInput = z.infer<typeof milestoneCreationSchema>