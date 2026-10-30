"use client";

import { createWeakness, updateWeakness } from "@/lib/api/weakness";
import {
  CreateWeaknessInput,
  createWeaknessSchema,
  updateWeaknessSchema,
} from "@/schemas/weakness.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Subject } from "@/types/subject";
import { listSubjects } from "@/lib/api/subjects";
import { useRouter } from "next/navigation";
import Spinner from "../ui/spinner";
import { Input } from "../ui/input";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "../ui/input-group";
import { Weakness } from "@/types/weakness";
import z from "zod";


type Props =
  | { mode: "create"; onSuccess: () => void }
  | { mode: "edit"; weakness: Weakness; onSuccess: () => void };


export default function WeaknessForm(props: Props) {

  const { mode, onSuccess } = props;


  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchSubjects() {
      setLoadingSubjects(true);
      setError("");
      try {
        const data = await listSubjects();
        setSubjects(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred. Please try again.",
        );
      } finally {
        setLoadingSubjects(false);
      }
    }
    fetchSubjects();
  }, []);

  const defaultValues =
    mode === "edit" ? {
      title: props.weakness.title,
      description: props.weakness.description ?? undefined
    } : {
      title: "",
      description: "",
      subject_id: null
    }

  const schema = props.mode === "edit" ? updateWeaknessSchema : createWeaknessSchema;

  type FormInput = z.input<typeof schema>
  type FormOutput = z.output<typeof schema>

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const [formError, setFormError] = useState<string>("");

  async function onSubmit(data: FormOutput) {
    setFormError("");
    try {
      if (mode === "create") {
        const result = await createWeakness(data as CreateWeaknessInput);
        router.push(`/dashboard/weakness/${result.id}`);
      } else {
        await updateWeakness(props.weakness.id, data)
      }
      onSuccess();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again.",
      );
    }
  }

  if (loadingSubjects) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="form">
      <div className="form-header">
        <h1 className="form-title">{mode === "edit" ? "Edit Weakness" : "Create Weakness"}</h1>
        <p className="form-subtitle">{mode === "edit" ? "Edit your weakness" : "Create a weakness to track your work"}</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="fields">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Weakness Title<span className="text-red-500">*</span></FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="LLMS, AI, Time Management, etc"
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

            {mode === "create" && (
              <Controller
                name="subject_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Subject<span className="text-slate-400">(optional)</span></FieldLabel>
                    <select
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      className="p-2 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/10 focus:outline-none focus:ring-offset-0 transition-colors bg-zinc-900 text-white cursor-pointer"
                    >
                      <option className=" text-gray-500 border-purple-500" value={""} disabled hidden>
                        Select Subject
                      </option>
                      {subjects.map((subject) => {
                        if (subject.status === "pending") {
                          return (
                            <option key={subject.id} value={subject.id}>
                              {subject.title}
                            </option>
                          )
                        }
                      })}
                    </select>
                    {fieldState.invalid && (
                      <p className="form-error">{fieldState.error?.message}</p>
                    )}
                  </Field>
                )}
              />
            )}




          </div>
        </FieldGroup>
        {formError && <p className="text-red-500">{formError}</p>}
        <button
          type="submit"
          className="submit-btn"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <span className="form-button-loading">
              <Spinner />
              Submitting...
            </span>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
}
