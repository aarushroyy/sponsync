// A simpler MultiSelect implementation that uses checkboxes
// Create this as @/components/ui/simple-multi-select.tsx

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

type Option = {
  value: string;
  label: string;
};

interface SimpleMultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
  placeholder?: string;
}

export function SimpleMultiSelect({
  options,
  selected,
  onChange,
  className,
  placeholder = "Select options...",
}: SimpleMultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const toggleOption = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange(newSelected);
  };
  
  const removeOption = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((v) => v !== value));
  };
  
  return (
    <div className={`relative ${className}`}>
      <div
        className="border border-input rounded-md px-3 py-2 flex flex-wrap gap-1 min-h-10 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.length > 0 ? (
          selected.map((value) => {
            const option = options.find((o) => o.value === value);
            return option ? (
              <Badge key={value} variant="secondary" className="m-0.5">
                {option.label}
                <button
                  type="button"
                  className="ml-1 rounded-full outline-none"
                  onClick={(e) => removeOption(value, e)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ) : null;
          })
        ) : (
          <div className="text-muted-foreground text-sm">{placeholder}</div>
        )}
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full bg-background rounded-md border border-input shadow-md mt-1 p-2 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md cursor-pointer"
              onClick={() => toggleOption(option.value)}
            >
              <input
                type="checkbox"
                id={`option-${option.value}`}
                checked={selected.includes(option.value)}
                onChange={() => {}} // Handled by parent onClick
                className="h-4 w-4"
              />
              <label 
                htmlFor={`option-${option.value}`}
                className="cursor-pointer text-sm"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}