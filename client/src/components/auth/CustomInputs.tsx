'use client'
import { Controller } from 'react-hook-form'
import { Field, FieldLabel, FieldError } from '../ui/field'
import { Input } from '../ui/input'
import { CustomInputProps } from '@/types/index'


export function CustomInputs({ control, name, label, placeholder, autocomplete, type = 'text' }: CustomInputProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                    <Input
                        {...field}
                        id={field.name}
                        type={type}
                        aria-invalid={fieldState.invalid}
                        placeholder={placeholder}
                        autoComplete={autocomplete}
                        style={{ paddingLeft: '15px' }}
                    />
                    {fieldState.invalid && (<FieldError errors={[fieldState.error]} style={{ color: 'red' }} />
                    )}
                </Field>
            )}
        />
    )
}

