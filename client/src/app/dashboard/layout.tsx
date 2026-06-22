import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex w-full min-h-screen bg-[url(/assets/background.png)] bg-cover bg-center ">
            <Sidebar />
            <main className="dashboard">
                <Topbar />
                {children}
            </main>
        </div>
    );
}

