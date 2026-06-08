import { Milestone } from "@/types/milestone";

export function MilestoneListView({ milestones }: { milestones: Milestone[] }) {
  if (milestones.length === 0) return <div>Nothing due soon.</div>;
  return (
    <ul>
      {milestones.map((m) => (
        <li key={m.id}>
          <strong>{m.title}</strong>
          <small>{m.due_date}</small>
          <small>{m.type}</small>
        </li>
      ))}
    </ul>
  );
}
