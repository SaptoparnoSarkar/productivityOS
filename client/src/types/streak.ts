export type WeekResponse = {
  message: string;
  history: DayProgress[];
  streak: number;
};
export type DayProgress = {
  progress_date: string;
  qualified: boolean;
};

export type TodayContractStatus = {
  totalItems: number;
  completedItems: number;
  todayComplete: number;
};
