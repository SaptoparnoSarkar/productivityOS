"use client";

import { FieldGroup } from "../ui/field";
import { CustomInputs } from "../ui/CustomInputs";
import Spinner from "../ui/spinner";
import { useForm } from "react-hook-form";
import {
  CreateMilestoneInput,
  createMilestoneSchema,
  UpdateMilestoneInput,
  updateMilestoneSchema,
} from "@/schemas/milestone.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Milestone } from "@/types/milestone";
import z from "zod";
import { createMilestone, updateMilestone } from "@/lib/api/milestones";
import { useState } from "react";


type Props =
  | { mode: "create"; subjectId: number; onSuccess: (data: Milestone) => void; }
  | { mode: "edit"; subjectId: number, milestone: Milestone; onSuccess: (data: Milestone) => void };

export default function MilestoneForm(props: Props) {
  const { mode, onSuccess } = props;
  const subjectId = props.subjectId;
  const schema = mode === "edit" ? updateMilestoneSchema : createMilestoneSchema;

  const [formError, setFormError] = useState<string>("")

  const defaultValues = mode === "edit"
    ? {
      title: props.milestone.title,
      description: props.milestone.description ?? undefined,
      daily_minimum: props.milestone.daily_minimum ?? undefined,
      daily_minimum_unit: props.milestone.daily_minimum_unit ?? undefined,
      weekly_minimum: props.milestone.weekly_minimum ?? undefined,
    }
    : {
      type: "counter",
      title: "",
      description: "",
      weekly_minimum: "",
      daily_minimum: "",
      daily_minimum_unit: "",
    };

  type FormInput = z.input<typeof schema>;
  type FormOutput = z.output<typeof schema>;

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues,
  });


  async function onSubmit(data: FormOutput) {
    setFormError("")
    try {
      if (mode === "create") {
        const milestone = await createMilestone(subjectId, data as CreateMilestoneInput)
        onSuccess(milestone);
      } else {
        const milestone = await updateMilestone(subjectId, props.milestone.id, data as UpdateMilestoneInput)
        onSuccess(milestone);
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "An error occurred. Please try again.")
    }
  }



  return (
    <div className="form">
      <div className="form-header">
        <h1 className="form-title">{mode === "create" ? "Create Milestone" : "Edit Milestone"}</h1>
        <p className="form-subtitle">
          {mode === "create" ? "Create a milestone to track your progress." : "Edit your milestone."}
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
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
            {mode === "create" && (
              <fieldset>
                <legend>Type</legend>
                <label>
                  <input
                    type="radio"
                    value="counter"
                    {...form.register("type")}
                  />
                  Counter
                </label>
                <label>
                  <input
                    type="radio"
                    value="checklist"
                    {...form.register("type")}
                  />
                  Checklist
                </label>
              </fieldset>
            )}
            {formError && <p className="form-error">{formError}</p>}
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
          ) : mode === "edit" ? (
            "Save"
          ) : (
            "Next"
          )}
        </button>
      </form>
    </div>
  );
}
