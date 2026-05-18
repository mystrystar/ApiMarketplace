import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string };

export function Input({ label, className = "", id, ...props }: Props) {
  return (
    <label className="block text-sm">
      {label && <span className="mb-1 block text-gray-600">{label}</span>}
      <input
        id={id}
        className={`w-full rounded border border-gray-300 px-3 py-2 text-sm ${className}`}
        {...props}
      />
    </label>
  );
}
