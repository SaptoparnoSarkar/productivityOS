'use client';
import { useState } from "react";
import { TooltipProvider } from "../ui/tooltip";
import { NavIcon } from "./NavIcon";
import { BookOpen, LayoutDashboard, PanelRightClose, PanelRightOpen, Target, Timer, TriangleAlert, Trophy, Zap } from "lucide-react";

const Nav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Subjects", href: "/dashboard/subjects", icon: BookOpen },
  { label: "XP", locked: true, phase: 6, icon: Zap },
  { label: "Pomodoro", locked: true, phase: 7, icon: Timer },
  { label: "Weakness", locked: true, phase: 8, icon: TriangleAlert },
  { label: "Hall of Fame", locked: true, phase: 8, icon: Trophy },
];

export function Sidebar() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <aside className={sidebarOpen ? 'sidebar open' : 'sidebar'}>
      <div>
        <button onClick={handleSidebar} className="sidebar-toggle-btn">{sidebarOpen ? <PanelRightClose /> : <PanelRightOpen />}</button>
      </div>

      <TooltipProvider delayDuration={150}>
        <nav>
          {Nav.map((item) => <NavIcon key={item.label} {...item} sidebarOpen={sidebarOpen} />)}
        </nav>
      </TooltipProvider>
    </aside>
  );
}
// TODOs: 1. Wire Paths. 2. Add Settings and Help.
