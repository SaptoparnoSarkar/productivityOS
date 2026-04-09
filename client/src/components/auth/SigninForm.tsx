'use client'
import { useForm } from 'react-hook-form'
import { SigninFormData, signinSchema } from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldGroup } from '../ui/field'
import { CustomInputs } from './CustomInputs'


export function SigninForm() {
    const form = useForm<SigninFormData>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    async function onSubmit(data: SigninFormData) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log(data)
    }

    return (
        <div className='auth-card'>
            <div className='auth-header'>
                <h1 className='auth-title'>Welcome Back</h1>
                <p className='auth-subtitle'>
                    Sign in to your account to continue.
                </p>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <div className='auth-fields'>
                        <CustomInputs
                            control={form.control}
                            name='email'
                            label='Email'
                            type='email'
                            placeholder='Enter your email'
                            autocomplete='email'
                        />

                        <CustomInputs
                            control={form.control}
                            name='password'
                            label='Password'
                            type='password'
                            placeholder='Enter your password'
                            autocomplete='current-password'
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
                                Signing in...
                            </span>
                        ) : (
                            'Sign in'
                        )}
                    </button>

                    <p className='auth-footer'>
                        Don't have an Account?{' '}
                        <a href="/signup" className='auth-link'>Sign up</a>
                    </p>
                </div>
            </form>
        </div>
    )
}


