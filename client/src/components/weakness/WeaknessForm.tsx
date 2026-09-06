"use client";

import { createWeakness } from "@/lib/api/weakness";
import {
  CreateWeaknessInput,
  createWeaknessSchema,
} from "@/schemas/weakness.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { FieldGroup } from "../ui/field";
import { CustomInputs } from "../ui/CustomInputs";
import { Subject } from "@/types/subject";
import { listSubjects } from "@/lib/api/subjects";
import { useRouter } from "next/navigation";
import Spinner from "../ui/spinner";
import CustomSelect from "../ui/CustomSelect";

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
    subject_id: null,
    title: "",
    description: "",
  };

  const schema = createWeaknessSchema;

  type FromInput = z.input<typeof schema>;
  type FromOutput = z.output<typeof schema>;

  const form = useForm<FromInput, any, FromOutput>({
    resolver: zodResolver(schema),
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
            <CustomInputs
              control={form.control}
              name="title"
              label="Title"
              placeholder="Enter weakness title"
            />
            <CustomInputs
              control={form.control}
              name="description"
              label="Description"
              placeholder="Enter weakness description"
            />
            <CustomSelect
              register={form.register}
              name="subject_id"
              label="Subject"
              subjects={subjects}
              placeholder="Select Subject"
              error={error}
            />
          </div>
        </FieldGroup>
        {formError && <p className="text-red-500">{formError}</p>}
        <button
          type="submit"
          className="subject-submit-btn"
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
