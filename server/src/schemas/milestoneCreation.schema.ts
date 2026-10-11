import z from "zod";
import { createMilestoneSchema } from "./milestone.schema.js";
import { createCounterSchema } from "./counter.schema.js";
import { createChecklistTargetSchema } from "./checklist.schema.js";
import { createChecklistItemsSchema } from "./checklistItem.schema.js";



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