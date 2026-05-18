"use client";

import { createSubjectSchema } from "@/schemas/subject.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { createSubject } from "@/lib/api/subjects";
import { useState } from "react";
import { FieldGroup } from "../ui/field";
import { CustomInputs } from "../ui/CustomInputs";

type Props = {
  onSuccess: () => void;
};
type CreateSubjectFormValues = z.infer<typeof createSubjectSchema>;

export default function CreateSubjectForm({ onSuccess }: Props) {
  const form = useForm<CreateSubjectFormValues>({
    resolver: zodResolver(createSubjectSchema),
    defaultValues: {
      type: "completable",
      title: "",
      has_pomodoro: false,
    },
  });
  const [formError, setFormError] = useState<string>("");

  async function onSubmit(data: CreateSubjectFormValues) {
    setFormError("");
    try {
      await createSubject(data);
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("An error occurred. Please try again.");
      }
    }
  }

  return (
    <div className="subject-card">
      <div className="subject-header">
        <h1 className="subject-title">New Subject</h1>
        <p className="subject-subtitle">Create a subject to track your work.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="subject-fields">
            <label htmlFor="type">Type</label>
            <select id="type" {...form.register("type")}>
              <option value="completable">Completable</option>
              <option value="ongoing">Ongoing</option>
            </select>

            <CustomInputs control={form.control} name="title" label="Title" />

            <label htmlFor="has_pomodoro">Has Pomodoro</label>
            <input
              type="checkbox"
              id="has_pomodoro"
              {...form.register("has_pomodoro")}
            />
          </div>
        </FieldGroup>

        {formError && <p className="form-error">{formError}</p>}

        <button
          type="submit"
          className="subject-submit-btn"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <span className="subject-btn-loading">
              <svg
                className="subject-spinner"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="31.4 31.4"
                />
              </svg>
              Creating Subject...
            </span>
          ) : (
            "Create Subject"
          )}
        </button>
      </form>
    </div>
  );
}
