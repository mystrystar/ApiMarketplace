import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

const styles = {
  primary:
    "border-0 bg-[linear-gradient(135deg,var(--accent),var(--purple))] text-white hover:opacity-90",
  secondary:
    "border border-[rgba(79,142,255,0.3)] bg-[var(--accent-dim)] text-[var(--accent)] hover:bg-[rgba(79,142,255,0.18)]",
  danger:
    "border border-[rgba(244,63,94,0.25)] bg-[var(--red-dim)] text-[var(--red)] hover:bg-[rgba(244,63,94,0.2)]",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: Props) {
  return (
    <button
      className={`rounded-[var(--radius-sm)] px-3 py-2 text-[13px] font-semibold transition disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
