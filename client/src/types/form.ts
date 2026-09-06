import {
  Control,
  FieldPath,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { Subject } from "./subject";

export interface CustomInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  autocomplete?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "tel" | "url" | "email" | "search" | "none";
  disabled?: boolean;
  isTextArea?: boolean;
  min?: number;
  max?: number;
}

export interface CustomSelectProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  name: Path<T>;
  label: string;
  subjects: Subject[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}
