export type DayProgress = {
  progress_date: string;
  qualified: boolean;
};

export type StreakWeek = {
  message: string;
  history: DayProgress[];
  streak: number;
};

// pulled the inline object out into its own named type.
