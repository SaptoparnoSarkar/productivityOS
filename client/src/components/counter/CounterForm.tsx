import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import Spinner from "../ui/spinner";
import { Input } from "../ui/input";
import { createCounterSchema, CounterSchemaInput, CounterSchemaOutput } from "@/schemas/counter.schema";


type Props =
    | { mode: 'create'; onSubmit: (values: CounterSchemaOutput) => void | Promise<void>; unit?: string }
    | {
        mode: 'edit';
        defaultValues: CounterSchemaOutput;
        onSubmit: (values: CounterSchemaOutput) => void | Promise<void>;
    };

export function CounterForm(props: Props) {
    const { onSubmit, mode } = props;

    const initialValues = mode === 'edit' ? (props.defaultValues) : undefined;

    const form = useForm<CounterSchemaInput, unknown, CounterSchemaOutput>({
        resolver: zodResolver(createCounterSchema),
        defaultValues: initialValues
            ? { target_value: initialValues.target_value, unit: initialValues.unit }
            : { target_value: 100, unit: props.mode === 'create' ? props.unit : "" },
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
                                            disabled={props.mode === "create"}
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
