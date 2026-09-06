import { CustomSelectProps } from "@/types/form";
import { FieldValues } from "react-hook-form";

export default function CustomSelect<T extends FieldValues>({
  register,
  name,
  label,
  subjects,
  placeholder,
  disabled = false,
  error,
}: CustomSelectProps<T>) {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <select
        {...register(name, { valueAsNumber: true })}
        disabled={disabled}
        defaultValue=""
        aria-invalid={!!error}
        className="border border-slate-500/20 p-2 pr-2 rounded-xl cursor-pointer disabled:cursor-not-allowed "
      >
        <option value="" disabled>
          Select Subject
        </option>
        {subjects
          .filter((s) => s.status === "pending")
          .map((subject) => (
            <option key={subject.id} value={subject.id} className="">
              {subject.title}
            </option>
          ))}
      </select>
    </div>
  );
}
