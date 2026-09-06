import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen ">
      <Sidebar />
      <main className="w-full">
        <Topbar />
        {children}
      </main>
    </div>
  );
}
