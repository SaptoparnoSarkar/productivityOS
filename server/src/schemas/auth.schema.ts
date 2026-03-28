import * as z from "zod";

const signupSchema = z.object({

    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).max(128, { message: "Password must not be more than 128 characters." }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character." })

})

type SignupInput = z.infer<typeof signupSchema>

export { signupSchema }
export type { SignupInput }

const verifyEmailSchema = z.object({
    email: z.string().email(),
    code: z.string().length(6)
})

type VerifyEmailInput = z.infer<typeof verifyEmailSchema>

export { verifyEmailSchema }
export type { VerifyEmailInput }
