import { PRESETS } from "@/lib/pomodoro/pomodoro";
import { cn } from "@/lib/utils";
import { PresetSeconds } from "@/types/pomodoro";

type Props = {
  value: PresetSeconds;
  onChange: (seconds: PresetSeconds) => void;
  disabled: boolean;
};

export function PresetPicker({ value, onChange, disabled = false }: Props) {
  return (
    <div className="flex gap-2  ">
      {PRESETS.map((p) => (
        <button
          key={p.seconds}
          type="button"
          onClick={() => onChange(p.seconds)}
          disabled={disabled}
          className={cn(
            " py-2 px-4 rounded-2xl transition-colors text-white disabled:cursor-not-allowed cursor-pointer",
            p.seconds === value
              ? "bg-white text-black"
              : "bg-neutral-600/60  hover:scale-110",
          )}
        >
          {p.minutes}
        </button>
      ))}
    </div>
  );
}
