import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { CustomInputs } from "../ui/CustomInputs";
import Spinner from "../ui/spinner";
import { Input } from "../ui/input";

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

    const form = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: mode === 'edit' ? props.defaultValues : { target_value: 100, unit: '' },
    });


    return (
        <div className="form">
            <div className="form-header">
                <h1 className="form-title">{mode === 'edit' ? 'Edit Milestone Counter' : 'Create Milestone Counter'}</h1>
                <p className="form-subtitle">Set the target value and unit for your milestone counter.</p>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)}>

                <FieldGroup>
                    <div className="fields">
                        <>
                            <Controller
                                name='target_value'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Target {<span className="text-red-500">*</span>} </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            value={(field.value as number | undefined) ?? ""}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="100"
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
                                name='unit'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Unit {<span className="text-red-500">*</span>} </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="e.g pages, problems, hours"
                                            autoComplete="off"
                                            className="p-4 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/10 focus:outline-none focus:ring-offset-0 transition-colors bg-zinc-900 text-white"
                                        />
                                        {fieldState.invalid && (
                                            <p className="form-error">{fieldState.error?.message}</p>
                                        )}
                                    </Field>
                                )}
                            />
                        </>

                    </div>
                </FieldGroup>

                <button type="submit" className="submit-btn" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                        <span className="submit-btn-loading"><Spinner />Saving...</span>
                    ) : (props.mode === 'edit' ? 'Save Changes' : 'Create Counter')}
                </button>
            </form>
        </div>
    )
}
