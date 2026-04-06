import * as z from 'zod';

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