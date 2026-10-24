"use client";

import { createWeakness } from "@/lib/api/weakness";
import {
  CreateWeaknessInput,
  CreateWeaknessOutput,
  createWeaknessSchema,
} from "@/schemas/weakness.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { CustomInputs } from "../ui/CustomInputs";
import { Subject } from "@/types/subject";
import { listSubjects } from "@/lib/api/subjects";
import { useRouter } from "next/navigation";
import Spinner from "../ui/spinner";
import CustomSelect from "../ui/CustomSelect";
import { Input } from "../ui/input";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "../ui/input-group";

export default function WeaknessForm() {
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

  const defaultValues = {
    title: "",
    description: "",
    subject_id: null,
  };


  const form = useForm<CreateWeaknessInput, unknown, CreateWeaknessOutput>({
    resolver: zodResolver(createWeaknessSchema),
    defaultValues,
  });

  const [formError, setFormError] = useState<string>("");

  async function onSubmit(data: CreateWeaknessInput) {
    setFormError("");
    try {
      const result = await createWeakness(data);
      router.push(`/dashboard/weakness/${result.id}`);
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
        <h1 className="form-title">New Weakness</h1>
        <p className="form-subtitle">Create a weakness to track your work</p>
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
