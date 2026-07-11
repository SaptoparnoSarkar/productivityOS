'use client'
import { Controller } from 'react-hook-form'
import { Field, FieldLabel, FieldError } from './field'
import { Input } from './input'
import { CustomInputProps } from '@/types/index'


//Gonna reuse this everywhere

export function CustomInputs({ control, name, label, placeholder, autocomplete, type = 'text', inputMode = 'none', disabled = false, min, max }: CustomInputProps) {
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
                        disabled={disabled}
                        style={{ padding: '15px' }}
                        inputMode={inputMode}
                        min={min}
                        max={max}
                    />
                    {fieldState.invalid && (<FieldError errors={[fieldState.error]} style={{ color: 'red' }} />
                    )}
                </Field>
            )}
        />
    )
}

