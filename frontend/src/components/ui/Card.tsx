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
    <div className={`console-panel rounded-2xl p-5 ${className}`}>
      {title && (
        <h3 className="mb-4 flex items-center justify-between border-b border-white/10 pb-3 text-[12px] font-semibold text-slate-200">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
