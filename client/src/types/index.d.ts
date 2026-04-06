import { Control, FieldPath } from 'react-hook-form'
import { signupSchema } from '@/schemas/auth.schema'
import { z } from 'zod'

declare global {
    interface CustomInput {
        control: Control<z.infer<typeof signupSchema>>
        name: 'email' | 'password' | 'confirmPassoword'
        label: string
        placeholder: string
        type?: string
    }
}
