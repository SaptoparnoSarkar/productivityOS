'use client'
import { useForm } from 'react-hook-form'
import { SigninFormData, signinSchema } from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'


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
        <form onSubmit={form.handleSubmit(onSubmit)}>


        </form>
    )
}