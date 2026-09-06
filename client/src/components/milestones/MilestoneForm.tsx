"use client";

import { FieldGroup } from "../ui/field";
import { CustomInputs } from "../ui/CustomInputs";
import Spinner from "../ui/spinner";
import { useForm } from "react-hook-form";
import {
  createMilestoneSchema,
  updateMilestoneSchema,
} from "@/schemas/milestone.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Milestone } from "@/types/milestone";
import z from "zod";

// Both modes use the SAME callback name: onSubmit.
// Parent decides what onSubmit DOES (POST vs PATCH + redirect).
type Props =
  | {
      mode: "create";
      onSubmit: (
        values: z.infer<typeof createMilestoneSchema>,
      ) => void | Promise<void>;
    }
  | {
      mode: "edit";
      milestone: Milestone;
      onSubmit: (
        values: z.infer<typeof updateMilestoneSchema>,
      ) => void | Promise<void>;
    };

export default function MilestoneForm(props: Props) {
  const isEdit = props.mode === "edit";
  const schema = isEdit ? updateMilestoneSchema : createMilestoneSchema;

  const defaultValues = isEdit
    ? {
        title: props.milestone.title,
        description: props.milestone.description,
        daily_minimum: props.milestone.daily_minimum,
        daily_minimum_unit: props.milestone.daily_minimum_unit,
        weekly_minimum: props.milestone.weekly_minimum,
      }
    : {
        type: "counter",
        title: "",
        description: "",
        weekly_minimum: undefined,
        daily_minimum: undefined,
        daily_minimum_unit: "",
      };

  type FormInput = z.input<typeof schema>;
  type FormOutput = z.output<typeof schema>;

  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any, // union of defaults; cast is acceptable here
  });

  return (
    <div className="form">
      <div className="form-header">
        <h1 className="form-title">New Milestone</h1>
        <p className="form-subtitle">
          Create a milestone to track your progress.
        </p>
      </div>
      <form onSubmit={form.handleSubmit(props.onSubmit as any)}>
        <FieldGroup>
          <div className="fields">
            <CustomInputs
              control={form.control}
              name="title"
              label="Title"
              placeholder="e.g DDIA book, Grokking SD course"
            />
            <CustomInputs
              control={form.control}
              name="description"
              label="Description"
            />
            <div className="grid grid-cols-[2fr_1fr] gap-3">
              <CustomInputs
                control={form.control}
                name="daily_minimum"
                type="number"
                label="Daily Minimum For XP"
                placeholder="Enter daily minimum"
              />
              <CustomInputs
                control={form.control}
                name="daily_minimum_unit"
                label="Unit"
                placeholder="e.g: Chapters"
              />
            </div>
            <CustomInputs
              control={form.control}
              name="weekly_minimum"
              type="number"
              label="Weekly Minimum For XP"
              placeholder="e.g: 3"
            />

            {/* Type is chosen ONCE at create. Never editable. */}
            {!isEdit && (
              <fieldset>
                <legend>Type</legend>
                <label>
                  <input
                    type="radio"
                    value="counter"
                    {...form.register("type" as any)}
                  />
                  Counter
                </label>
                <label>
                  <input
                    type="radio"
                    value="checklist"
                    {...form.register("type" as any)}
                  />
                  Checklist
                </label>
              </fieldset>
            )}
          </div>
        </FieldGroup>

        <button
          type="submit"
          className="subject-submit-btn"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <span className="subject-btn-loading">
              <Spinner />
              Saving...
            </span>
          ) : isEdit ? (
            "Save"
          ) : (
            "Next"
          )}
        </button>
      </form>
    </div>
  );
}
