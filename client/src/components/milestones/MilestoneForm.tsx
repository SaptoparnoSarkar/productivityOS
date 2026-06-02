'use client';

import { FieldGroup } from "../ui/field";
import { CustomInputs } from "../ui/CustomInputs";
import Spinner from "../ui/spinner";
import { useForm } from "react-hook-form";
import { createMilestoneSchema, updateMilestoneSchema } from "@/schemas/milestone.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Milestone } from "@/types/milestone";
import z from "zod";

// Both modes use the SAME callback name: onSubmit.
// Parent decides what onSubmit DOES (POST vs PATCH + redirect).
type Props =
    | { mode: 'create'; onSubmit: (values: z.infer<typeof createMilestoneSchema>) => void | Promise<void> }
    | { mode: 'edit'; milestone: Milestone; onSubmit: (values: z.infer<typeof updateMilestoneSchema>) => void | Promise<void> };

export default function MilestoneForm(props: Props) {
    const isEdit = props.mode === 'edit';
    const schema = isEdit ? updateMilestoneSchema : createMilestoneSchema;

    const defaultValues = isEdit
        ? {
            title: props.milestone.title,
            description: props.milestone.description,
            due_date: props.milestone.due_date,
        }
        : { type: 'counter', title: '', description: '', due_date: '' };

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as any, // union of defaults; cast is acceptable here
    });

    return (
        <form onSubmit={form.handleSubmit(props.onSubmit as any)}>
            <FieldGroup>
                <div className="subject-fields">
                    <CustomInputs control={form.control} name="title" label="Title" placeholder="e.g DDIA book, Grokking SD course" />
                    <CustomInputs control={form.control} name="description" label="Description" />
                    <CustomInputs control={form.control} name="due_date" label="Due Date" type="date" />

                    {/* Type is chosen ONCE at create. Never editable. */}
                    {!isEdit && (
                        <fieldset>
                            <legend>Type</legend>
                            <label>
                                <input type="radio" value="counter" {...form.register('type' as any)} />
                                Counter
                            </label>
                            <label>
                                <input type="radio" value="checklist" {...form.register('type' as any)} />
                                Checklist
                            </label>
                        </fieldset>
                    )}
                </div>
            </FieldGroup>

            <button type="submit" className="subject-submit-btn" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                    <span className="subject-btn-loading"><Spinner />Saving...</span>
                ) : (isEdit ? 'Save' : 'Next')}
            </button>
        </form>
    );
}