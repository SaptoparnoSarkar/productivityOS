'use client';

import { signout } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export function Topbar() {
  const router = useRouter();

  async function handleSignout() {
    try {
      await signout();
      router.push('/auth/signin')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    }

  }
  return (
    <header className="topbar">
      <input
        type="text"
        placeholder="Search for Tasks, Projects..."
        disabled
        className="topbar-search"
      />

      {/* Right Cluster */}
      <div className="topbar-actions">
        <div className="topbar-user">
          <span>DUMMY DUMB</span>
        </div>
        <button type="button" className="topbar-signout" onClick={handleSignout}>
          Logout
        </button>
      </div>
    </header>
  );
}
