import { DASHBOARD_LABELS } from "@/constants";
import type { Subscription } from "@/types";
import { Button } from "@/components/ui/Button";
import { MethodBadge } from "@/components/ui/Badges";
import { EmptyState } from "@/components/ui/EmptyState";

export function SubscriptionList({
  items,
  onRegenerateKey,
}: {
  items: Subscription[];
  onRegenerateKey?: (subscriptionId: string) => Promise<void>;
}) {
  if (!items.length) {
    return (
      <EmptyState
        title="No APIs subscribed yet"
        subtitle="Browse the marketplace and subscribe to start making calls."
      />
    );
  }

  function copyKey(apiKey: string) {
    navigator.clipboard.writeText(apiKey);
  }

  return (
    <ul className="space-y-2">
      {items.map((sub) => (
        <li key={sub.id} className="mb-3 space-y-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-sm transition hover:border-[var(--border-h)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-semibold">{sub.api.title}</span>
            <div className="flex flex-wrap items-center gap-3">
              <MethodBadge />
              <span className="rounded-md bg-[rgba(0,0,0,0.3)] px-2 py-[3px] font-mono text-[11px] text-[#7eb8ff]">/v1/{sub.api.slug}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            {sub.api.status && (
              <span className="rounded-full bg-[var(--green-dim)] px-2 py-[3px] text-[10px] font-bold text-[var(--green)]">
                {sub.api.status}
              </span>
            )}
            <span className="font-mono text-[11px] text-[var(--muted)]">
              {sub.remainingQuota} / {sub.totalQuota} calls remaining
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                sub.remainingQuota / Math.max(sub.totalQuota, 1) > 0.5
                  ? "bg-[var(--green)]"
                  : sub.remainingQuota / Math.max(sub.totalQuota, 1) > 0.2
                    ? "bg-[var(--amber)]"
                    : "bg-[var(--red)]"
              }`}
              style={{
                width: `${Math.max(
                  0,
                  Math.min(100, (sub.remainingQuota / Math.max(sub.totalQuota, 1)) * 100),
                )}%`,
              }}
            />
          </div>
          <div className="space-y-2">
            <code className="block truncate rounded-[var(--radius-sm)] border border-[var(--border)] bg-[rgba(0,0,0,0.25)] px-[14px] py-[10px] font-mono text-[11px] text-[#7eb8ff]">
              {sub.apiKey}
            </code>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => copyKey(sub.apiKey)}>
                {DASHBOARD_LABELS.copy}
              </Button>
              {onRegenerateKey && (
                <Button
                  variant="secondary"
                  onClick={() => onRegenerateKey(sub.id)}
                >
                  {DASHBOARD_LABELS.regenerate}
                </Button>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
