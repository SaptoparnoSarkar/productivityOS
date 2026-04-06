'use client'

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="auth-layout">
            <div className="auth-container">
                {children}
            </div>
        </main>
    )
}