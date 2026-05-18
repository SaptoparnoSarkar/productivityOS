// src/lib/schemas/subject.schema.ts
import { z } from "zod";

export const createSubjectSchema = z.object({
  type: z.enum(["completable", "ongoing"]),
  title: z.string().trim().min(1, "Title is required").max(100),
  has_pomodoro: z.boolean(),
});

//Minimal Schema for test flow.
