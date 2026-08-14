export type DashboardMetrics = {
  totalSubjects: number;
  activeMilestones: number;
  completedDailies: number;
  streak: number;
};

export type Dashboard = {
  message: String;
  metrics: DashboardMetrics;
};
