import z from "zod";

export const createCounterSchema = z.object({
    target_value: z.coerce.number().int().positive({ message: "Target must be a positive number" }),
    unit: z.string().trim().min(1, { message: 'Unit is required' })
})

export type CounterSchemaInput = z.input<typeof createCounterSchema>;
export type CounterSchemaOutput = z.output<typeof createCounterSchema>;