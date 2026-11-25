"use client";
import { Controller, FieldValues } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "./field";
import { Input } from "./input";
import { CustomInputProps } from "@/types/form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

//Gonna reuse this everywhere

export function CustomInputs<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  autocomplete,
  type = "text",
  inputMode = "none",
  disabled = false,
  min,
  max,
}: CustomInputProps<T>) {

  // TODO: Add eye that reveal and hide passwords
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password"
  const inputType = isPassword && showPassword ? "text" : type


  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <div className="relative">
            <Input
              {...field}
              value={(field.value as string | number | readonly string[] | undefined) ?? ""}
              id={field.name}
              type={inputType}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              autoComplete={autocomplete}
              disabled={disabled}
              style={{ padding: "20px" }}
              inputMode={inputMode}
              min={min}
              max={max}
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                aria-label={showPassword ? "Hide Password" : "Show Password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}

          </div>
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} style={{ color: "red" }} />
          )}
        </Field>
      )}
    />
  );
}
