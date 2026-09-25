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
      className="text-white border border-slate-500/20 p-2 pr-2 rounded-2xl cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-0 "
    >
      <option className="bg-gray-900 text-gray-500" value={""} disabled hidden>
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
