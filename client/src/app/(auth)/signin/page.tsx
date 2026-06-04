import { AuthShell } from "@/components/auth/AuthShell"
import { SigninForm } from "@/components/auth/SigninForm"

export default function SigninPage() {
    return (
        <AuthShell>
            <SigninForm />
        </AuthShell>

    )
}