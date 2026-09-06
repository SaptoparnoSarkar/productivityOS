"use client";

import { signout } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function Topbar() {
  const router = useRouter();

  async function handleSignout() {
    try {
      await signout();
      router.push("/auth/signin");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  }
  return (
    <header className="flex items-center justify-between gap-4 px-4 py-4 border-b border-gray-600/30">
      <input
        type="text"
        placeholder="Search for Tasks, Projects  ..."
        disabled
        className="topbar-search"
      />

      {/* Right Cluster */}
      <div className="topbar-actions">
        <div className="topbar-user">
          <span>{}</span>
          {/* TODO: Link the session user's name to display on topbar */}
        </div>
        <button
          type="button"
          className="px-2.5 py-2.5 rounded-lg bg-purple-700 hover:bg-purple-800 hover:border-purple-600 text-white cursor-pointer"
          onClick={handleSignout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
