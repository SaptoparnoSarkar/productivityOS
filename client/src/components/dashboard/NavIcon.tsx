import React from "react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type NavIconProps = {
  href?: string;
  label: string;
  icon: React.ElementType;
  locked?: boolean;
  active: boolean;
  sidebarOpen: boolean;
};

export function NavIcon({
  href,
  label,
  icon: Icon,
  locked,
  active,
  sidebarOpen,
}: NavIconProps) {
  const inner = (
    <span
      className={`nav-item ${active ? "bg-purple-500 " : ""} ${locked ? "nav-locked" : ""}`}
    >
      <Icon size={22} className="shrink-0" />
      <p className="transition-all duration-300 whitespace-nowrap">
        {sidebarOpen && label}
      </p>
    </span>
  );

  if (sidebarOpen) return locked ? inner : <Link href={href!}>{inner}</Link>;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {locked ? inner : <Link href={href!}>{inner}</Link>}
      </TooltipTrigger>
      <TooltipContent
        side="right"
        className="border border-purple-400 bg-[#17151f] text-white shadow-[0_0_24px_rgba(168,85,247,0.35)]"
      >
        {label}
        {locked ? " 🔒" : ""}
      </TooltipContent>
    </Tooltip>
  );
}
