import z from "zod";

export const StartSessionSchema = z.object({
  subject_id: z.coerce.number().positive(),
  milestone_id: z.coerce.number().positive().nullish(),
  planned_seconds: z.coerce.number(),
});

export type StartSessionInput = z.infer<typeof StartSessionSchema>;
