import { SignupForm } from "@/components/auth/SignupForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Sign Up — ProductivityOS",
    description: "Create your ProductivityOS account and start tracking your progress.",
}

export default function SignupPage() {
    return (
        <main className="auth-page">
            <SignupForm />
        </main>
    )
}