import { resend } from "../config/resend.js";

// Will swap later after purchasing domain
const FROM = "onboarding@resend.dev";

export async function sendVerificationEmail(to: string, code: number) {
    const { data, error } = await resend.emails.send({ from: FROM, to: to, subject: "Email Verification", html: `<p>Your verification code is: ${code}</p>` })

    if (error) {
        console.error("Resend failed:", error.name, error.message)
        throw new Error("Failed to send verification email")
    }
    return data;
}