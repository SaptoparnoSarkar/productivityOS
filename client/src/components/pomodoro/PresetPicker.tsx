import { PRESETS } from "@/lib/pomodoro/pomodoro";
import { cn } from "@/lib/utils";
import { PresetSeconds } from "@/types/pomodoro";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type Props = {
  value: PresetSeconds;
  onChange: (seconds: PresetSeconds) => void;
  disabled: boolean;
};

const WINDOW = 4;
const STEP = 2;
const MAX_START = PRESETS.length - WINDOW;

export function PresetPicker({ value, onChange, disabled = false }: Props) {
  const [start, setStart] = useState(0);
  const shift = (dir: number) =>
    setStart((s) => Math.min(MAX_START, Math.max(0, s + dir * STEP)));
  const visible = PRESETS.slice(start, start + WINDOW);
  return (
    <div className="w-full whitespace-nowrap flex items-center justify-center pb-4">
      <button
        type="button"
        onClick={() => shift(-1)}
        disabled={disabled || start === 0}
        className="p-2 rounded-full text-white disabled:opacity-30"
      >
        <ChevronLeft size={18} />
      </button>

      {visible.map((p) => (
        <button
          key={p.seconds}
          type="button"
          onClick={() => onChange(p.seconds)}
          disabled={disabled}
          className={cn(
            " py-2 px-4 rounded-2xl transition duration-75 border border-gray-600 text-white disabled:cursor-not-allowed cursor-pointer mr-2",
            p.seconds === value
              ? "bg-purple-500 text-white"
              : "bg-transparent hover:scale-105 hover:bg-gray-600",
          )}
        >
          <p className="whitespace-nowrap">{p.minutes}m</p>
        </button>
      ))}
      <button
        type="button"
        onClick={() => shift(+1)}
        disabled={disabled || start === MAX_START}
        className="p-2 rounded-full text-white disabled:opacity-30"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
