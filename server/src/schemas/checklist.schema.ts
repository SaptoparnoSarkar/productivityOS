import z from "zod";


export const createChecklistTargetSchema = z.object({
    target_count: z.number().int().positive({ message: "Target count must be a positive integer" }).max(100, { message: "Target count cannot be more than 100" })
})


export type CreateChecklistTargetInput = z.infer<typeof createChecklistTargetSchema>;

