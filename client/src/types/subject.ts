export type SubjectType = "ongoing" | "completable";
export type SubjectStatus = 'pending' | 'completed';

export type Subject = {
  id: number;
  user_id: number;
  type: SubjectType;
  title: string;
  description: string | null;
  has_pomodoro: boolean;
  status: SubjectStatus;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateSubjectInput = {
  type: SubjectType;
  title: string;
  description?: string;
  due_date?: string | null;
  has_pomodoro?: boolean;

};

export type UpdateSubjectInput = Partial<
  Omit<CreateSubjectInput, "type" | "has_pomodoro">>;

