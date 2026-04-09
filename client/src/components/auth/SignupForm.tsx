'use client'
import { useRouter } from 'next/navigation'
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

    const router = useRouter()

    async function onSubmit(data: SignupFormData) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log(data)

        //Redirect with email in URL
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
    }

    return (
        <div className='auth-card'>
            <div className='auth-header'>
                <h1 className='auth-title'>Create Account</h1>
                <p className='auth-subtitle'>
                    Join the community and start tracking your progress today.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className='auth-form'>
                <FieldGroup>
                    <div className='auth-fields'>
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

                <div className='auth-actions'>
                    <button
                        type='submit'
                        disabled={form.formState.isSubmitting}
                        className='auth-btn'
                    >
                        {form.formState.isSubmitting ? (
                            <span className='auth-btn-loading'>
                                <svg className='auth-spinner' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4" />
                                </svg>
                                Creating account…
                            </span>
                        ) : (
                            'Create account'
                        )}
                    </button>

                    <p className='auth-footer'>
                        Already have an account?{' '}
                        <a href='/signin' className='auth-link'>Sign in</a>
                    </p>
                </div>
            </form>
        </div>
    )
}
