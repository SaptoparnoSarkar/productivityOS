// Preset card + XP card

import { PresetPicker } from "./PresetPicker";
import { PomodoroSessionWire, PresetSeconds } from "@/types/pomodoro";
import { PRESETS } from "@/lib/pomodoro/pomodoro";
import { ArrowUp } from "lucide-react";

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
      <div className=" border p-6 rounded-2xl bg-white/5 flex flex-col gap-4 ">
        <h1 className="text-white font-bold">PRESETS</h1>
        <PresetPicker
          value={displayedPreset}
          onChange={setSelectedPreset}
          disabled={!!session}
        />
      </div>
      <div className="border p-6 rounded-2xl bg-white/5 flex flex-col gap-4">
        <h1 className="text-white font-bold">SESSION XP</h1>
        <p className="text-white text-5xl font-bold flex items-center justify-center">
          {PRESETS.find((p) => p.seconds === displayedPreset)?.xp}
          <span className="text-xl ml-2">XP </span>
          <span className="text-green-500 mb-5"><ArrowUp /></span>
        </p>
        {/* <p>{streakData!.streak > 3 ? "2x streak multiplier active" : ""}</p> */}
      </div>
    </div>
  );
}
