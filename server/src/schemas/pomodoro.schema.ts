import z from "zod";
import { PRESET_SECONDS } from "../utils/pomodoro.utils.js";

export const startSessionSchema = z.object({
  subject_id: z.number().int().positive(),
  milestone_id: z.number().int().positive().nullable(),
  planned_seconds: z.union(PRESET_SECONDS.map((s) => z.literal(s))),
});

export type startSessionSchemaInput = z.infer<typeof startSessionSchema>;
