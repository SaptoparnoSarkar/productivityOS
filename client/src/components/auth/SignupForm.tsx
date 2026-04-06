'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signupSchema, type SignupFormData } from '@/schemas/auth.schema'
import { FieldGroup, FieldLabel, Field, FieldError } from '../ui/field'
import { Input } from '../ui/input'
import { Controller } from 'react-hook-form'
import { Card } from '../ui/card'


export function SignupForm() {
    //Initialize the form
    const form = useForm<SignupFormData>({
        //Hook up our resolver
        resolver: zodResolver(signupSchema),
        //Write the Default values
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    function onSubmit(data: SignupFormData) {
        console.log(data)
    }

    return (
        <Card className='w-full max-w-md'>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='flex flex-col gap-6'>
                    <FieldGroup>
                        <div className='grid gap-2'>
                            {/* Email */}
                            <Controller
                                name='email'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type='email'
                                            aria-invalid={fieldState.invalid}
                                            placeholder="example123@gmail.com"
                                            autoComplete='email'
                                        />
                                        {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
                                    </Field>
                                )}
                            />
                            {/* Password */}
                            <Controller
                                name='password'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type='password'
                                            aria-invalid={fieldState.invalid}
                                            placeholder='Create a strong password'
                                            autoComplete='new-password'
                                        />
                                        {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
                                    </Field>
                                )}
                            />
                            {/* Confirm Password */}
                            <Controller
                                name='confirmPassword'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type='password'
                                            aria-invalid={fieldState.invalid}
                                            placeholder='Confirm your Password'
                                            autoComplete='new-password'
                                        />
                                        {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
                                    </Field>
                                )}
                            />
                        </div>
                    </FieldGroup>
                </div>

            </form>
        </Card>
    )
}