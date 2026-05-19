import { SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: { value: string; label: string }[];
};

export function Select({ label, options, className = "", ...props }: Props) {
  return (
    <label className="block text-sm">
      {label && (
        <span className="mb-1 block text-[11px] font-semibold uppercase text-[var(--text-muted)]">
          {label}
        </span>
      )}
      <select
        className={`w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-elevated)] px-[14px] py-[10px] text-[13px] text-[var(--text)] transition focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(79,142,255,0.1)] focus:outline-none ${className}`}
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
