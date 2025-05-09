// src/components/validated-input.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface ValidatedInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validate?: (value: string) => string | null;
  placeholder?: string;
  required?: boolean;
  // Optional additional styling
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

export function ValidatedInput({
  id,
  label,
  type,
  value,
  onChange,
  validate,
  placeholder,
  required = false,
  className = "space-y-2",
  labelClassName = "",
  inputClassName = "",
  errorClassName = "text-sm text-red-500",
}: ValidatedInputProps) {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  
  // Validate on value change, but only show error if field has been touched
  useEffect(() => {
    if (!touched) return;
    
    if (validate) {
      setError(validate(value));
    } else if (required && !value) {
      setError(`${label} is required`);
    } else {
      setError(null);
    }
  }, [value, validate, touched, required, label]);
  
  return (
    <div className={className}>
      <Label htmlFor={id} className={labelClassName}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${error ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-orange-500"} ${inputClassName}`}
        onBlur={() => setTouched(true)}
      />
      {error && <p className={errorClassName}>{error}</p>}
    </div>
  );
}