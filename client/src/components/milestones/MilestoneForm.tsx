"use client";

import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import Spinner from "../ui/spinner";
import { Controller, useForm } from "react-hook-form";
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
import { Input } from "../ui/input";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "../ui/input-group";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";


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
            <>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Milestone Title<span className="text-red-500">*</span> </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder='e.g DDIA book, Grokking SD course'
                      className="p-4 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/10 focus:outline-none focus:ring-offset-0 transition-colors bg-zinc-900 text-white"
                    />
                    {fieldState.invalid && (
                      <p className="form-error">{fieldState.error?.message}</p>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Description <span className="text-slate-400">(optional)</span></FieldLabel>
                    <InputGroup className="border border-zinc-700 transition-colors bg-zinc-900 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/10">
                      <InputGroupTextarea
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder='Enter description'
                        rows={6}
                        maxLength={2000}
                        className="min-h-24 resize-none p-4"
                      />
                      <InputGroupAddon align="block-end" className="p-3">
                        <InputGroupText className={`tabular-nums text-xs transition-colors ${(field.value?.length || 0) >= 2000 ?
                          'text-red-400 font-medium' :
                          (field.value?.length || 0) >= 1800
                            ? "text-amber-400"
                            : "text-slate-400"
                          }  `}>
                          {field.value?.length || 0} / 2000
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>

                    {fieldState.invalid && (
                      <p className="form-error">{fieldState.error?.message}</p>
                    )}

                  </Field>
                )}
              />


              <div className="grid grid-cols-[2fr_1fr] gap-3">
                <Controller
                  name="daily_minimum"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Daily Minimum <span className="text-slate-400">(optional)</span></FieldLabel>
                      <Input
                        {...field}
                        value={(field.value as number | undefined) ?? ""}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="3"
                        type="number"
                        className="p-4 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/10 focus:outline-none focus:ring-offset-0 transition-colors bg-zinc-900 text-white"
                      />

                      <FieldDescription className="text-zinc-400">Recommended. Set to gain daily xp.</FieldDescription>

                      {fieldState.invalid && (
                        <p className="form-error">{fieldState.error?.message}</p>
                      )}

                    </Field>
                  )}
                />
                <Controller
                  name="daily_minimum_unit"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Unit <span className="text-slate-400">(optional)</span></FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="e.g: Chapters, Pages"
                        className="p-4 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/10 focus:outline-none focus:ring-offset-0 transition-colors bg-zinc-900 text-white"
                      />

                      {fieldState.invalid && (
                        <p className="form-error">{fieldState.error?.message}</p>
                      )}

                    </Field>
                  )}
                />
              </div>

              <Controller
                name="weekly_minimum"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Weekly Minimum <span className="text-slate-400">(optional)</span></FieldLabel>
                    <Input
                      {...field}
                      value={(field.value as number | undefined) ?? ""}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="5"
                      type="number"
                      className="p-4 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/10 focus:outline-none focus:ring-offset-0 transition-colors bg-zinc-900 text-white"
                    />

                    <FieldDescription className="text-zinc-400">Recommended. Set to gain weekly xp.</FieldDescription>

                    {fieldState.invalid && (
                      <p className="form-error">{fieldState.error?.message}</p>
                    )}

                  </Field>
                )}
              />

            </>

            {/* Type is chosen ONCE at create. Never editable. */}
            {mode === "create" && (
              <Controller
                name="type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Milestone Type <span className="text-red-500">*</span></FieldLabel>
                    <RadioGroup name={field.name} value={field.value} onValueChange={field.onChange} onBlur={field.onBlur}>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="counter" id="option-1" />
                        <Label htmlFor="option-1" className="m-1">Counter</Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="checklist" id="option-2" />
                        <Label htmlFor="option-2" className="m-1">Checklist</Label>
                      </div>
                    </RadioGroup>

                    {fieldState.invalid && (
                      <p className="form-error">{fieldState.error?.message}</p>
                    )}

                  </Field>

                )}
              />
            )}

          </div>
        </FieldGroup>

        {formError && <p className="form-error">{formError}</p>}

        <button
          type="submit"
          className="submit-btn"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <span className="submit-btn-loading">
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
