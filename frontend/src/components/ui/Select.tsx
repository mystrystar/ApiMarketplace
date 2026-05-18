import { SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: { value: string; label: string }[];
};

export function Select({ label, options, className = "", ...props }: Props) {
  return (
    <label className="block text-sm">
      {label && <span className="mb-1 block text-gray-600">{label}</span>}
      <select
        className={`w-full rounded border border-gray-300 px-3 py-2 text-sm ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
