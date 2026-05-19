import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string };

export function Input({ label, className = "", id, ...props }: Props) {
  return (
    <label className="block text-sm">
      {label && (
        <span className="mb-1 block text-[11px] font-semibold uppercase text-[var(--text-muted)]">
          {label}
        </span>
      )}
      <input
        id={id}
        className={`w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-elevated)] px-[14px] py-[10px] text-[13px] text-[var(--text)] placeholder:text-[var(--muted)] transition focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(79,142,255,0.1)] focus:outline-none ${className}`}
        {...props}
      />
    </label>
  );
}
