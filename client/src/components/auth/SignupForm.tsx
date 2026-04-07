'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, type SignupFormData } from '@/schemas/auth.schema'
import { FieldGroup } from '../ui/field'
import { CustomInputs } from './CustomInputs'

export function SignupForm() {
    const form = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(data: SignupFormData) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log(data)
    }

    return (
        <div className='signup-card'>
            <div className='signup-header'>
                <h1 className='signup-title'>Create Account</h1>
                <p className='signup-subtitle'>
                    Join the community and start tracking your progress today.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className='signup-form'>
                <FieldGroup>
                    <div className='signup-fields'>
                        <CustomInputs
                            control={form.control}
                            name='email'
                            label='Email'
                            type="email"
                            placeholder='you@example.com'
                            autocomplete='email'
                        />
                        <CustomInputs
                            control={form.control}
                            name='password'
                            label='Password'
                            type="password"
                            placeholder='Create a strong password'
                            autocomplete='new-password'
                        />
                        <CustomInputs
                            control={form.control}
                            name='confirmPassword'
                            label='Confirm Password'
                            type="password"
                            placeholder='Confirm your password'
                            autocomplete='new-password'
                        />
                    </div>
                </FieldGroup>

                <div className='signup-actions'>
                    <button
                        type='submit'
                        disabled={form.formState.isSubmitting}
                        className='signup-btn'
                    >
                        {form.formState.isSubmitting ? (
                            <span className='signup-btn-loading'>
                                <svg className='signup-spinner' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4" />
                                </svg>
                                Creating account…
                            </span>
                        ) : (
                            'Create account'
                        )}
                    </button>

                    <p className='signup-footer'>
                        Already have an account?{' '}
                        <a href='/signin' className='signup-link'>Sign in</a>
                    </p>
                </div>
            </form>
        </div>
    )
}
