import * as z from "zod";

export const createMilestoneSchema = z.object({
  type: z.enum(["counter", "checklist"], {
    message: "Type must be either 'counter' or 'checklist'",
  }),
  title: z.string().trim().min(1, { message: "Title is required" }).max(100),
  description: z.string().max(2000).nullish(),
  due_date: z.string().date().nullish(),
});

export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;

export const updateMilestoneBase = createMilestoneSchema
  .omit({ type: true })
  .partial();

export type UpdateMilestoneInput = z.infer<typeof updateMilestoneBase>;

export const updateMilestoneSchema = updateMilestoneBase.refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Provide at least one field to update",
  },
);

//Seperated plain object schema and refined schema
