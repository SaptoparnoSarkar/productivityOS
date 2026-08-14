import { Subject } from "@/types/subject";

// Helper function to get Month Name and Date from TimeStampz
export default function formatDate(s: Subject) {
  const raw = s.status === "completed" ? s.updated_at : s.due_date;
  if (!raw) return "No Due Date";

  const word = s.status === "completed" ? "Completed" : "Due";

  const pretty = new Date(raw).toLocaleDateString("en-In", {
    month: "short",
    day: "numeric",
  });

  return `${word} ${pretty}`;
}
