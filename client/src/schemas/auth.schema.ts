import * as z from 'zod';
// Schema for Sign Up
export const signupSchema = z.object({
    email: z.string().email(),

    password: z.string().min(8, { message: "Password must be at least 8 characters long" })
        .max(128, { message: "Password must not be more than 128 characters." })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character." }),

    confirmPassword: z.string().min(8,
        { message: "Password must be at least 8 characters long" })
        .max(128, { message: "Password must not be more than 128 characters." })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character." })

}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export type SignupFormData = z.infer<typeof signupSchema>

// Schema for Sign in
export const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" })
        .max(128, { message: "Password must not be more than 128 characters." })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character." })
})

export type SigninFormData = z.infer<typeof signinSchema>

// Schema for Verify Email
export const verifyEmailSchema = z.object({
    email: z.string().email(),
    code: z.string().min(6, { message: "Code must be 6 digits" }).max(6, { message: "Code must be 6 digits" }).regex(/^[0-9]{6}$/, { message: "Code must be 6 digits" })
})

export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>