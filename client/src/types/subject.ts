export type SubjectType = "ongoing" | "completable";

export type Subject = {
  id: number;
  user_id: number;
  type: SubjectType;
  title: string;
  description: string | null;
  has_pomodoro: boolean;
  daily_minimum: number | null;
  daily_minimum_unit: string | null;
  weekly_minimum: number | null;
  created_at: string;
  updated_at: string;
};

export type CreateSubjectInput = {
  type: SubjectType;
  title: string;
  description?: string;
  has_pomodoro?: boolean;
  daily_minimum?: number;
  daily_minimum_unit?: string;
  weekly_minimum?: number;
};

export type UpdateSubjectInput = Partial<
  Omit<CreateSubjectInput, "type" | "has_pomodoro">>;
