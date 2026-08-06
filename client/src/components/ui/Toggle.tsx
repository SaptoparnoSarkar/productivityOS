// Dumb Component, Parent owns the state and API call.

import { cn } from "@/lib/utils";

type Props = {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
};

export function Toggle({ checked, onChange, disabled }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors cursor-pointer",
        checked ? "bg-purple-500" : "bg-slate-700",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
          checked ? "translate-x-0.5" : "-translate-x-5.5",
        )}
      />
    </button>
  );
}
