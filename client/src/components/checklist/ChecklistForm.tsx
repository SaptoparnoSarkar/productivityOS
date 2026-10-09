"use client";

import Spinner from "../ui/spinner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { CustomInputs } from "../ui/CustomInputs";
import {
  createChecklistItemsSchema,
  ChecklistFormOutput,
} from "@/schemas/checklist.schema";
import z from "zod";
import { Input } from "../ui/input";

type Props = {
  onSubmit: (values: ChecklistFormOutput) => void | Promise<void>;
};

export function ChecklistForm({ onSubmit }: Props) {
  const form = useForm<
    z.input<typeof createChecklistItemsSchema>,
    unknown,
    z.output<typeof createChecklistItemsSchema>
  >({
    resolver: zodResolver(createChecklistItemsSchema),
    defaultValues: {
      label: "",
      target_count: 1,
    },
  });

  return (
    <div className="form">
      <div className="form-header">
        <h1 className="form-title">Create Checklist Milestone</h1>
        <p className="form-subtitle">Create a checklist milestone to track your progress.</p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="fields">
            <>
              <Controller
                name="label"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>First Item <span className="text-red-500">*</span></FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Finish the chapter Load Balancing"
                      autoComplete="off"
                      className="p-4 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/10 focus:outline-none focus:ring-offset-0 transition-colors bg-zinc-900 text-white"
                    />
                    {fieldState.invalid && (
                      <p className="form-error">{fieldState.error?.message}</p>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="target_count"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Target Count <span className="text-red-500">*</span></FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      value={(field.value as number | undefined) ?? ""}
                      type="number"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. 100"
                      autoComplete="off"
                      className="p-4 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/10 focus:outline-none focus:ring-offset-0 transition-colors bg-zinc-900 text-white"
                    />
                    <FieldDescription className="text-zinc-400">
                      How many items are you aiming for?
                    </FieldDescription>
                    {fieldState.invalid && (
                      <p className="form-error">{fieldState.error?.message}</p>
                    )}
                    {fieldState.invalid && (
                      <p className="form-error">{fieldState.error?.message}</p>
                    )}
                  </Field>
                )}
              />
            </>
          </div>
        </FieldGroup>

        <button
          type="submit"
          className="submit-btn"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <span className="submit-btn-loading">
              <Spinner /> Saving...
            </span>
          ) : (
            "Create Checklist"
          )}
        </button>
      </form>
    </div>
  );
}
