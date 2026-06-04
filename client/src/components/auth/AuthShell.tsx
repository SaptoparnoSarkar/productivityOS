type AuthShellProps = {
    children: React.ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
    return (
        <>
            <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover -z-10">
                <source src="/assets/auth-bg.mp4" type="video/mp4" />
            </video>


            <div className="absolute inset-0 bg-black/60 -z-10" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="auth-glass-card">
                    {children}
                </div>
            </div>
        </>

    )
} 