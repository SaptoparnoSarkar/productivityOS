"use client";

import {
  createSubjectSchema,
  updateSubjectSchema,
} from "@/schemas/subject.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { createSubject, updateSubject } from "@/lib/api/subjects";
import { useState } from "react";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import type { CreateSubjectInput, Subject, UpdateSubjectInput } from "@/types/subject";
import Spinner from "../ui/spinner";
import { Input } from "../ui/input";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "../ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";



type Props =
  | { mode: "create"; onSuccess: () => void }
  | { mode: "edit"; subject: Subject; onSuccess: () => void };

export default function SubjectForm(props: Props) {

  const [formError, setFormError] = useState<string>("");
  const { mode, onSuccess } = props;

  const defaultValues =
    mode === "edit" ?
      {
        title: props.subject.title,
        due_date: props.subject.due_date ?? undefined,
        description: props.subject.description ?? undefined
      } : {
        type: "completable",
        title: "",
        has_pomodoro: false,
        description: "",
        due_date: undefined
      };

  const schema = props.mode === "edit" ? updateSubjectSchema : createSubjectSchema;

  type FormInput = z.input<typeof schema>;
  type FormOutput = z.output<typeof schema>;

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues,
  });



  async function onSubmit(data: FormOutput) {
    setFormError("");
    try {
      if (mode === "create") {
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
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Subject Title <span className="text-red-500">*</span></FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="e.g. System Design"
                        autoComplete="off"
                        className="p-4 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/10 focus:outline-none focus:ring-offset-0 transition-colors bg-zinc-900 text-white"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}

                    </Field>
                  )}
                />

                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Description <span className="text-slate-400">(optional)</span>
                      </FieldLabel>
                      <InputGroup className="border border-zinc-700 transition-colors bg-zinc-900 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/30">
                        <InputGroupTextarea
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter Description"
                          rows={6}
                          className="min-h-24 resize-none p-4  "
                          maxLength={200}
                        />
                        <InputGroupAddon align="block-end" className="p-3">
                          <InputGroupText className={`tabular-nums text-xs transition-colors ${(field.value?.length || 0) >= 200
                            ? 'text-red-400 font-medium'
                            : (field.value?.length || 0) >= 180
                              ? 'text-amber-400'
                              : 'text-zinc-400'
                            }`}>
                            {field.value?.length || 0}/200 characters
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field orientation="vertical" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Type</FieldLabel>

                      <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          className="w-full p-4 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/10 focus:outline-none focus:ring-offset-0 transition-colors bg-zinc-900 text-zinc-100 cursor-pointer"
                        >
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="bg-gray-300">
                          <SelectItem value="completable">Completable</SelectItem>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldDescription className="text-zinc-400">Completable subjects can be marked done.</FieldDescription>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="has_pomodoro"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>

                      <FieldLabel htmlFor={field.name}>Enable Pomodoro</FieldLabel>

                      <Switch
                        id={field.name}
                        name="Pomodoro"
                        aria-invalid={fieldState.invalid}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="cursor-pointer"
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}

                    </Field>
                  )}
                />

                <Field
                  data-invalid={!!form.formState.errors.due_date}
                >
                  <FieldLabel htmlFor="due_date">Due Date <span className="text-slate-400">(optional)</span></FieldLabel>
                  <Input
                    type="date"
                    id="due_date"
                    {...form.register("due_date")}
                    style={{ colorScheme: "dark" }}
                    className="w-full p-4 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/10 focus:outline-none focus:ring-offset-0 transition-colors bg-zinc-900 text-zinc-100 cursor-pointer"
                    aria-invalid={!!form.formState.errors.due_date}
                    min={new Date(new Date().setHours(0, 0, 0, 0) + (1000 * 60 * 60 * 24)).toISOString().split("T")[0]}

                  />
                  {form.formState.errors.due_date && (
                    <FieldError errors={[form.formState.errors.due_date]} />
                  )}
                </Field>

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
