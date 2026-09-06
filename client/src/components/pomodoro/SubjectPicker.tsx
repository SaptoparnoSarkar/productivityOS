import { Subject } from "@/types/subject";

type Props = {
  subjects: Subject[];
  value: number | null;
  onChange: (id: number) => void;
  disabled?: boolean;
};

export function SubjectPicker({
  subjects,
  value,
  onChange,
  disabled = false,
}: Props) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={disabled}
      className="relative top-8 border border-slate-500/20 p-2 pr-2 rounded-2xl cursor-pointer disabled:cursor-not-allowed "
    >
      <option className="bg-gray-900" value={""} disabled={true}>
        Select Subject
      </option>
      {subjects.map((s) => {
        if (s.status === "pending") {
          return (
            <option className="bg-gray-900 text-white" key={s.id} value={s.id}>
              {s.title}
            </option>
          );
        }
        return null;
      })}
    </select>
  );
}
