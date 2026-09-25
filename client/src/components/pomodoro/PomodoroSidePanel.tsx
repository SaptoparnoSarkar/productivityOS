// Preset card + XP card

import { PresetPicker } from "./PresetPicker";
import { WeekResponse } from "@/types/streak";
import { PomodoroSessionWire, PresetSeconds } from "@/types/pomodoro";
import { PRESETS } from "@/lib/pomodoro/pomodoro";

type PomodoroSidePanelProps = {
  displayedPreset: PresetSeconds;
  setSelectedPreset: (seconds: PresetSeconds) => void;
  session: PomodoroSessionWire | null;
};

export default function PomodoroSidePanel({
  setSelectedPreset,
  displayedPreset,
  session,
}: PomodoroSidePanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className=" border p-6 rounded-2xl bg-gray-500/20 flex flex-col gap-4 ">
        <h1 className="text-slate-400">PRESETS</h1>
        <PresetPicker
          value={displayedPreset}
          onChange={setSelectedPreset}
          disabled={!!session}
        />
      </div>
      <div className="border p-6 rounded-2xl bg-gray-500/20 flex flex-col gap-4">
        <h1 className="text-slate-400">SESSION XP</h1>
        <p className="text-white text-5xl font-bold flex items-center justify-center">
          {PRESETS.find((p) => p.seconds === displayedPreset)?.xp}
          <span className="text-xl ml-2">XP</span>
        </p>
        {/* <p>{streakData!.streak > 3 ? "2x streak multiplier active" : ""}</p> */}
      </div>
    </div>
  );
}
