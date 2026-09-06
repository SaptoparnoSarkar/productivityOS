export type Weakness = {
  id: number;
  user_id: number;
  subject_id: number | null;
  title: string;
  description: string | null;
  status: "active" | "resolved";
  created_at: string;
  resolved_at: string | null;
  updated_at: string;
};

export type WeaknessNote = {
  id: number;
  weakness_item_id: number;
  content: string;
  created_at: string;
};
