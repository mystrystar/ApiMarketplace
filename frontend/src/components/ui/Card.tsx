import { ReactNode } from "react";

export function Card({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`console-panel p-5 ${className}`}>
      {title && (
        <h3 className="mb-4 border-b border-[var(--border)] pb-2 text-[11px] font-semibold uppercase tracking-[1.5px] text-[var(--muted)]">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
