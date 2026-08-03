export type Rank = {
  name: string;
  minXp: number;
};

export type Progress = {
  percent: number;
  text: string;
};

export type Summary = {
  totalXp: number;
  rank: Rank;
  progress: Progress;
};

export type XpSummaryResponse = {
  message: string;
  summary: Summary;
};

// Single XP Event
export type XpEvent = {
  id: number;
  amount: number;
  type: string;
  milestone_title: string | null;
  created_at: string;
  multiplier_applied: boolean;
};

// the paginated envelope
export type XpLogResponse = {
  message: string;
  log: {
    events: XpEvent[];
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    multiplier_applied: boolean;
  };
};
