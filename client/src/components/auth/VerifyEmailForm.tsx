'use client'
import { verifyEmailSchema, VerifyEmailFormData } from "@/schemas/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CustomInputs } from "./CustomInputs"
import { FieldGroup } from "../ui/field"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { resendCode, verifyEmail } from "@/lib/api"


export function VerifyEmailForm() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const form = useForm<VerifyEmailFormData>({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: {
            email: searchParams.get('email') ?? '',
            code: '',
        }
    })

    const [resendCoolDown, setResendCoolDown] = useState(0)
    const [resendMessage, setResendMessage] = useState('')

    const [formError, setFormError] = useState<string>('')

    async function onSubmit(data: VerifyEmailFormData) {
        try {
            await verifyEmail(data.email, data.code)
            router.push('/dashboard')
        } catch (error) {
            if (error instanceof Error) {
                setFormError(error.message)
            }
            else {
                setFormError('An unexpected error occured. Please try again.')
            }
            setTimeout(() => {
                setFormError('')
            }, 3000)
        }
    }

    useEffect(() => {
        if (resendCoolDown <= 0) return

        const timer = setInterval(() => {
            setResendCoolDown((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [resendCoolDown])

    async function handleResend() {
        //validate email exists using form.trigger('email')
        const isValid = await form.trigger('email')
        if (!isValid) return

        //get email from form.getValues('email')
        const email = form.getValues('email')
        try {

            await resendCode(email)

            //set cooldown to 60
            setResendCoolDown(60)

            //set success/error message
            setResendMessage('Code sent successfully')
            setTimeout(() => {
                setResendMessage('')
            }, 3000)
        } catch (error) {
            setResendCoolDown(0)
            setResendMessage('Failed to send code. Please try again.')
            setTimeout(() => {
                setResendMessage('')
            }, 5000)
        }

    }

    return (
        <div className="auth-card">
            <div className="auth-header">
                <h1 className="auth-title">Verify Email</h1>
                <p className="auth-subtitle">
                    Enter the code sent to your email address.
                </p>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
                <FieldGroup>
                    <CustomInputs
                        control={form.control}
                        name='email'
                        label='Email'
                        type='email'
                        placeholder='Enter your email'
                        autocomplete='email'
                        disabled={!!searchParams.get('email')}
                    />
                    <CustomInputs
                        control={form.control}
                        name='code'
                        label='Code'
                        type='text'
                        inputMode='numeric'
                        placeholder='Enter your code'
                        autocomplete='off'
                    />
                </FieldGroup>

                <div className="auth-actions">
                    {formError && <p className="auth-error">{formError}</p>}
                    <button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="auth-btn"
                    >
                        {form.formState.isSubmitting ? (
                            <span className="auth-btn-loading">
                                <svg className='auth-spinner' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4" />
                                </svg>
                            </span>
                        ) : (
                            'Verify'
                        )}
                    </button>

                    <p className="auth-footer">
                        Didn't recieve the code? {' '}
                        <button
                            className="auth-link"
                            type="button"
                            onClick={handleResend}
                            disabled={resendCoolDown > 0}>{resendCoolDown > 0 ? `Resend code (${resendCoolDown}s)` : 'Resend code'}</button>
                        {resendMessage && (
                            <span className="auth-resend-message">{resendMessage}</span>
                        )}
                    </p>
                </div>
            </form>
        </div>
    )
}

