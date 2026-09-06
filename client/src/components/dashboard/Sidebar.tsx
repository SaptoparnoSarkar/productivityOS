"use client";
import { useState } from "react";
import { TooltipProvider } from "../ui/tooltip";
import { NavIcon } from "./NavIcon";
import {
  BookOpen,
  Flame,
  LayoutDashboard,
  PanelRightClose,
  PanelRightOpen,
  Timer,
  TriangleAlert,
  Trophy,
  Zap,
} from "lucide-react";
import { usePathname } from "next/navigation";

const NavItems = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Subjects", href: "/dashboard/subjects", icon: BookOpen },
  { label: "Milestones", href: "/dashboard/subjects/milestones", icon: Flame },
  { label: "XP", href: "/dashboard/xp", icon: Zap },
  { label: "Pomodoro", href: "/dashboard/pomodoro", icon: Timer },
  { label: "Weakness", href: "/dashboard/weakness", icon: TriangleAlert },
  { label: "Hall of Fame", href: "/dashboard/showcase", icon: Trophy },
];

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  const pathname = usePathname();

  function isRouteActive(pathname: string): string | undefined {
    const matchingItems = NavItems.filter((item) => {
      // Locked Items have no route.
      if (!item.href) return false;

      // For Home
      if (item.href === "/dashboard") {
        return pathname === "/dashboard";
      }

      // For other pages active on themselves or their nested pages
      return pathname === item.href || pathname.startsWith(`${item.href}/`);
    });
    matchingItems.sort(
      (first, second) => second.href!.length - first.href!.length,
    );
    return matchingItems[0]?.href;
  }
  const isActive = isRouteActive(pathname);

  return (
    <aside className={sidebarOpen ? "sidebar open" : "sidebar"}>
      <div>
        <button
          onClick={handleSidebar}
          className="text-white flex items-start align-top justify-start p-2 bg-white/10 rounded-2xl ml-1 cursor-pointer hover:bg-white/25 transition-all duration-200 ease-in-out"
        >
          {sidebarOpen ? <PanelRightClose /> : <PanelRightOpen />}
        </button>
      </div>

      <TooltipProvider delayDuration={150}>
        <nav>
          {NavItems.map((item) => {
            const active = item.href === isActive;
            return (
              <NavIcon
                key={item.label}
                {...item}
                sidebarOpen={sidebarOpen}
                active={active}
              />
            );
          })}
        </nav>
      </TooltipProvider>
    </aside>
  );
}
// TODOs: 1. Wire Paths. 2. Add Settings and Help.
