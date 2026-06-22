'use client';
import { useRef } from "react";

type WidgetProps =
  | { state: "real"; title: string; children: React.ReactNode }
  | { state: "locked"; title: string; phase: number };


export function Widget(props: WidgetProps) {
  const cardRef = useRef<(HTMLDivElement | null)>(null);

  const handlePointerMove = (ev: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--x', String(ev.clientX - rect.left));
    card.style.setProperty('--y', String(ev.clientY - rect.top))

  }


  return (
    <div className="widget-card" ref={cardRef} onPointerMove={handlePointerMove}>
      <div className="widget-header">
        <span className="widget-title">{props.title}</span>

        <div className="widget-body">
          {props.state === "locked" ? (
            <div className="widget-locked">
              🔒 <span>Coming in Phase {props.phase}</span>
            </div>
          ) : (
            props.children
          )}
        </div>
      </div>
    </div>
  );
}
