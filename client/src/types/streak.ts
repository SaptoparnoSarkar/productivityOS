export type StreakWeek = {
  message: string;
  history: {
    progress_date: string;
    qualified: boolean;
  }[];
  streak: number;
};
