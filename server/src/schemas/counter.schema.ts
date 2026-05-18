import * as z from "zod";

export const createCounterSchema = z.object({
  target_value: z.number().int().positive().max(1_000_000),
  unit: z.string().trim().min(1, { message: "Unit is required" }).max(50),
});

export type CreateCounterInput = z.infer<typeof createCounterSchema>;

export const updateCounterSchema = createCounterSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export type UpdateCounterInput = z.infer<typeof updateCounterSchema>;

export const incrementCounterSchema = z.object({
  delta: z
    .number()
    .int()
    .refine((n) => n !== 0, { message: "Delta cannot be zero" })
    .refine((n) => Math.abs(n) <= 1000, {
      message: "Delta must be between -1000 and 1000",
    }),
});

export type IncrementCounterInput = z.infer<typeof incrementCounterSchema>;
