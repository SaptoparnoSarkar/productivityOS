

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { FieldGroup } from "../ui/field";
import { CustomInputs } from "../ui/CustomInputs";
import Spinner from "../ui/spinner";

const schema = z.object({
    target_value: z.coerce.number().int().positive({ message: "Target must be a positive number" }),
    unit: z.string().trim().min(1, { message: 'Unit is required' })
})

export type CounterFormValues = z.output<typeof schema>;

type Props =
    | { mode: 'create'; onSubmit: (v: CounterFormValues) => void | Promise<void> }
    | { mode: 'edit'; defaultValues: CounterFormValues; onSubmit: (v: CounterFormValues) => void | Promise<void> };

export function CounterForm(props: Props) {
    const { onSubmit, mode } = props;

    const form = useForm<z.input<typeof schema>, any, z.output<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: mode === 'edit' ? props.defaultValues : { target_value: 100, unit: '' },
    });


    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <CustomInputs control={form.control} name='target_value' label='Target' type="number" />
                <CustomInputs control={form.control} name='unit' label='Unit' />
            </FieldGroup>

            <button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                    <span><Spinner />Saving...</span>
                ) : (props.mode === 'edit' ? 'Save Changes' : 'Create Counter')}
            </button>
        </form>
    )
}
