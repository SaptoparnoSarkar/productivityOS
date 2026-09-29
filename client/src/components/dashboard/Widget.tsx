"use client";
import { useRef } from "react";
import { LucideIcon } from "lucide-react";

type WidgetProps = {
  title: string;
  children: React.ReactNode;
  icon: LucideIcon;
};

export function Widget(props: WidgetProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (ev: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--x", String(ev.clientX - rect.left));
    card.style.setProperty("--y", String(ev.clientY - rect.top));
  };
  const Icon = props.icon;

  return (
    <div
      className="widget-card"
      ref={cardRef}
      onPointerMove={handlePointerMove}
    >
      <div className="flex flex-col text-white gap-4">
        <div className="bg-gray-400/20 h-2.5" />
        <div className="flex items-center gap-2 pl-4">
          <div className=" text-gray-400">
            <Icon size={18} />
          </div>
          <div className="font-bold text-lg text-blue-100">{props.title}</div>
        </div>

        <div className="flex flex-col px-4 pb-2">{props.children}</div>
      </div>
    </div>
  );
}
