export type DashboardMetrics = {
  totalSubjects: number;
  activeMilestones: number;
  completedDailies: number;
  xpToday: number;
};

export type Dashboard = {
  message: string;
  metrics: DashboardMetrics;
};
