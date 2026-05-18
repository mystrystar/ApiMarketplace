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
    <div className={`rounded border border-gray-200 bg-white p-4 ${className}`}>
      {title && <h3 className="mb-3 text-sm font-semibold text-gray-800">{title}</h3>}
      {children}
    </div>
  );
}
