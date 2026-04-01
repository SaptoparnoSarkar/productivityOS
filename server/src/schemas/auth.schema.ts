import * as z from "zod";

export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).max(128, { message: "Password must not be more than 128 characters." }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character." })
})

export type SignupInput = z.infer<typeof signupSchema>


export const verifyEmailSchema = z.object({
    email: z.string().email(),
    code: z.string().length(6)
})

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>

export const signinSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export type SigninInput = z.infer<typeof signinSchema>

export const resendCodeSchema = z.object({
    email: z.string().email()
})

export type ResendCodeInput = z.infer<typeof resendCodeSchema>

