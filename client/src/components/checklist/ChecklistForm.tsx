'use client'

import Spinner from "../ui/spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldGroup } from "../ui/field";
import { CustomInputs } from "../ui/CustomInputs";
import { createChecklistItemsSchema, ChecklistFormValues, ChecklistFormOutput } from "@/schemas/checklist.schema";
import z from "zod";




type Props = {
    onSubmit: (values: ChecklistFormOutput) => void | Promise<void>;
}

export function ChecklistForm({ onSubmit }: Props) {

    const form = useForm<z.input<typeof createChecklistItemsSchema>, any, z.output<typeof createChecklistItemsSchema>>({
        resolver: zodResolver(createChecklistItemsSchema),
        defaultValues: {
            label: '',
            target_count: 1,
        }
    })

    return (
        <div className="form">
            <div className="form-header">
                <h1 className="form-title">Checklist</h1>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)}>

                <FieldGroup>
                    <div className="fields">
                        <CustomInputs control={form.control} name='label' label='First item' />
                        <CustomInputs control={form.control} name='target_count' type="number" label='How many items are you aiming for?' min={1} max={100} />
                    </div>
                </FieldGroup>

                <button type='submit' className="subject-submit-btn" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                        <span className="subject-btn-loading"><Spinner /> Saving...</span>
                    ) : 'Create Checklist'}
                </button>
            </form>
        </div>
    )
}
