import { Control, FieldPath } from 'react-hook-form'
import { signupSchema } from '@/schemas/auth.schema'
import { z } from 'zod'

export interface CustomInputProps {
    control: Control<T>
    name: Path<T>
    label: string
    placeholder?: string
    autocomplete?: string
    type?: string
    inputMode?: "text" | "numeric" | "tel" | "url" | "email" | "search" | "none"
    disabled?: boolean
}


