"use client";

import {
  createSubjectSchema,
  updateSubjectSchema,
} from "@/schemas/subject.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { createSubject, updateSubject } from "@/lib/api/subjects";
import { useState } from "react";
import { FieldGroup } from "../ui/field";
import { CustomInputs } from "../ui/CustomInputs";
import type { CreateSubjectInput, Subject, UpdateSubjectInput } from "@/types/subject";
import Spinner from "../ui/spinner";

type Props =
  | { mode: "create"; onSuccess: () => void }
  | { mode: "edit"; subject: Subject; onSuccess: () => void };

export default function SubjectForm(props: Props) {
  const { mode, onSuccess } = props;

  const defaultValues =
    mode === "edit" ?
      {
        title: props.subject.title,
        due_date: props.subject.due_date,
        description: props.subject.description
      } : {
        type: "completable" as const,
        title: "",
        has_pomodoro: false,
        description: '',
        due_date: ''
      };

  const schema = props.mode === "edit" ? updateSubjectSchema : createSubjectSchema;

  type FormInput = z.input<typeof schema>;
  type FormOutput = z.output<typeof schema>;

  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const [formError, setFormError] = useState<string>("");

  type FormValues =
    | z.infer<typeof createSubjectSchema>
    | z.infer<typeof updateSubjectSchema>;


  async function onSubmit(data: FormValues) {
    setFormError("");
    try {
      if (mode === "create") { // safe: mode === "create" guarantees data matches createSubjectSchema shape
        await createSubject(data as CreateSubjectInput);
      } else {
        await updateSubject(props.subject.id, data as UpdateSubjectInput);
      }
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
    <div className="form">
      <div className="form-header">
        <h1 className="form-title">
          {mode === "create" ? "New Subject" : "Edit Subject"}
        </h1>
        <p className="form-subtitle">
          {mode === "create"
            ? "Create a subject to track your work."
            : "Update the subject to track your work."}
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="fields">
            {mode === "create" && (
              <>
                <CustomInputs control={form.control} name="title" label="Title" placeholder="Enter subject title" />
                <CustomInputs control={form.control} name='description' label="Description" placeholder="Enter subject description" />

                <label htmlFor="type">Type</label>
                <select id="type" {...form.register("type")}>
                  <option value="completable">Completable</option>
                  <option value="ongoing">Ongoing</option>
                </select>
                <label htmlFor="has_pomodoro">Has Pomodoro <input type="checkbox" id="has_pomodoro" {...form.register("has_pomodoro")} /></label>
                <CustomInputs control={form.control} name='due_date' label='Due Date' type="date" />
              </>
            )}
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
              <Spinner />
              {mode === "create"
                ? "Creating Subject..."
                : "Updating Subject..."}
            </span>
          ) : mode === "create" ? (
            "Create Subject"
          ) : (
            "Update Subject"
          )}
        </button>
      </form>
    </div>
  );
}
