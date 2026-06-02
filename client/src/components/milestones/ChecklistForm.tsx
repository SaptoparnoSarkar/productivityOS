'use client'

import Spinner from "../ui/spinner";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldGroup } from "../ui/field";
import { CustomInputs } from "../ui/CustomInputs";

const schema = z.object({
    label: z.string().trim().min(1, { message: 'Label is required' }).max(200),
})

export type ChecklistFormValues = z.infer<typeof schema>

type Props = {
    onSubmit: (values: ChecklistFormValues) => void | Promise<void>;
}

export function ChecklistForm({ onSubmit }: Props) {

    const form = useForm<ChecklistFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            label: '',
        }
    })

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <CustomInputs control={form.control} name='label' label='First item' />
            </FieldGroup>

            <button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                    <span><Spinner /> Saving...</span>
                ) : 'Create Checklist'}
            </button>
        </form>
    )

}