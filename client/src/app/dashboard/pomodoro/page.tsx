import { PomodoroHero } from "@/components/pomodoro/PomodoroHero";

export default function PomodoroPage() {
  return (
    <div className="ml-14 mt-15 mr-12">
      <div className="mb-10">
        <h1 className="header-text">Pomodoro</h1>
        <p className="subheading-text">
          Pomodoro allows you to work in focused bursts of time, separated by
          short breaks. This technique is proven to increase productivity and
          prevent burnout.
        </p>
      </div>
      <div className="flex flex-col justify-center items-center mt-20">
        <PomodoroHero />
        <div>{/* Spotify Integration */}</div>
      </div>
    </div>
  );
}
