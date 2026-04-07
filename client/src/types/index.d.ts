import { Control, FieldPath } from 'react-hook-form'
import { signupSchema } from '@/schemas/auth.schema'
import { z } from 'zod'

export interface CustomInputProps {
    control: Control<z.infer<typeof signupSchema>>
    name: FieldPath<z.infer<typeof signupSchema>>
    label: string
    placeholder?: string
    autocomplete?: string
    type?: string
}
}

