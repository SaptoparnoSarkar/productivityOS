import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { AuthShell } from "@/components/auth/AuthShell"
import { Suspense } from "react";

export default function VerifyEmailPage() {
    return (
        <AuthShell>
            <Suspense fallback={null}>
                <VerifyEmailForm />
            </Suspense>
        </AuthShell>
    )
}