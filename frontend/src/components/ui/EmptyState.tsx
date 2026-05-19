import { Button } from "./Button";

type Props = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, subtitle, actionLabel, onAction }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-12 text-center">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-[var(--radius-md)] bg-[var(--accent-dim)] text-2xl text-[var(--muted)]">
        +
      </div>
      <h3 className="text-sm font-medium text-[var(--text)]">{title}</h3>
      {subtitle && <p className="mt-1 max-w-sm text-xs text-[var(--muted)]">{subtitle}</p>}
      {actionLabel && onAction && (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
