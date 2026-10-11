"use client";

import { ChecklistForm } from "@/components/checklist/ChecklistForm";
import {
  CounterForm,
} from "@/components/counter/CounterForm";
import MilestoneForm from "@/components/milestones/MilestoneForm";
import { createMilestone } from "@/lib/api/milestones";
import { ChecklistFormOutput } from "@/schemas/checklist.schema";
import { CounterSchemaOutput } from "@/schemas/counter.schema";
import { CreateMilestoneInput, milestoneCreationSchema } from "@/schemas/milestone.schema";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

//Renders <MilestoneForm onSuccess={setCreatedMilestone} /> when null. Renders <CounterForm /> or <ChecklistForm /> when set.

export default function NewMilestonePage() {
  const params = useParams();
  const subjectId = Number(params.id);

  const router = useRouter();

  const [milestoneDraft, setMilestoneDraft] = useState<CreateMilestoneInput | null>(null);

  const [formError, setFormError] = useState<string>("");



  //Handles second stage form submission for checklist milestones.
  async function handleChecklistSubmit(values: ChecklistFormOutput) {
    if (!milestoneDraft || milestoneDraft.type !== "checklist") return;
    setFormError("");
    try {
      const payload = milestoneCreationSchema.parse({
        milestone: milestoneDraft,
        setup: values
      })
      const milestone = await createMilestone(subjectId, payload)
      router.push(`/dashboard/subjects/${subjectId}/milestones/${milestone.id}`)
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("An error occurred. Please try again.");
      }
    }
  }
  //Handles second stage form submission for counter milestones.
  async function handleCounterSubmit(values: CounterSchemaOutput) {
    if (!milestoneDraft || milestoneDraft.type !== "counter") return;
    setFormError("");
    try {
      const payload = milestoneCreationSchema.parse({
        milestone: milestoneDraft,
        setup: values
      })
      const milestone = await createMilestone(subjectId, payload)
      router.push(`/dashboard/subjects/${subjectId}/milestones/${milestone.id}`)
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("An error occurred. Please try again.");
      }
    }
  }

  return (
    <main className="mt-10">
      {formError && <p className="form-error">{formError}</p>}

      {milestoneDraft === null ? (
        //If no milestone is created yet, render the milestone form.
        <MilestoneForm mode="create" subjectId={subjectId} onNext={setMilestoneDraft} />
      ) : milestoneDraft.type === "checklist" ? (
        //If the milestone type is a checklist, render the checklist form.
        <ChecklistForm onSubmit={handleChecklistSubmit} />
      ) : (
        //If the milestone type is a counter, render the counter form.
        <CounterForm mode="create" onSubmit={handleCounterSubmit} />
      )}
    </main>
  );
}
