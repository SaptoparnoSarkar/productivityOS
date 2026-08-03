// Helper - takes ordered hisotry rows, returns current streak count.
export function deriveStreakCount(
  history: { progress_date: string; qualified: boolean }[],
): number {
  let streakCount = 0;
  //most recent first
  for (let i = history.length - 1; i >= 0; i--) {
    const row = history[i]!;
    if (row.qualified) {
      streakCount++;
    } else {
      // current day not qualified break immediately
      break;
    }
  }

  return streakCount;
}
