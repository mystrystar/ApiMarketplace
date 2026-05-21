"use client";

import { useEffect, useState } from "react";
import { DASHBOARD_LABELS } from "@/constants";
import type { Subscription } from "@/types";
import { Button } from "@/components/ui/Button";
import { MethodBadge } from "@/components/ui/Badges";
import { EmptyState } from "@/components/ui/EmptyState";

export function SubscriptionList({
  items,
  onRegenerateKey,
  onRefill,
  refillingId,
}: {
  items: Subscription[];
  onRegenerateKey?: (subscriptionId: string) => Promise<void>;
  onRefill?: (apiId: string) => Promise<void>;
  refillingId?: string | null;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!copiedId) {
      return;
    }

    const timeoutId = window.setTimeout(() => setCopiedId(null), 1600);
    return () => window.clearTimeout(timeoutId);
  }, [copiedId]);

  if (!items.length) {
    return (
      <EmptyState
        title="No APIs subscribed yet"
        subtitle="Browse the marketplace and subscribe to start making calls."
      />
    );
  }

  async function copyKey(subscriptionId: string, apiKey: string) {
    await navigator.clipboard.writeText(apiKey);
    setCopiedId(subscriptionId);
  }

  return (
    <ul className="space-y-2">
      {items.map((sub) => {
        const exhausted = Number(sub.remainingQuota || 0) <= 0;
        const packSize = Number(sub.api.defaultQuota || sub.totalQuota || 0);
        const packCount = packSize
          ? Math.max(1, Math.round(Number(sub.totalQuota || 0) / packSize))
          : 1;

        return (
          <li
            key={sub.id}
            className="mb-3 space-y-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-sm transition hover:border-[var(--border-h)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-semibold">{sub.api.title}</span>
              <div className="flex flex-wrap items-center gap-3">
                <MethodBadge method={sub.api.method} />
                <span className="rounded-md bg-[rgba(0,0,0,0.3)] px-2 py-[3px] font-mono text-[11px] text-[#7eb8ff]">
                  /v1/{sub.api.slug}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              {sub.api.status && (
                <span
                  className={`rounded-full px-2 py-[3px] text-[10px] font-bold ${
                    exhausted
                      ? "bg-[var(--red-dim)] text-[var(--red)]"
                      : "bg-[var(--green-dim)] text-[var(--green)]"
                  }`}
                >
                  {exhausted ? "QUOTA EXHAUSTED" : sub.api.status}
                </span>
              )}
              <span className="font-mono text-[11px] text-[var(--muted)]">
                {sub.remainingQuota} calls available
              </span>
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.8px]">
              <span className="rounded-full bg-[rgba(79,142,255,0.12)] px-2 py-[3px] text-[#7eb8ff]">
                {packCount} {packCount === 1 ? "quota pack" : "quota packs"}
              </span>
              {packSize > 0 && (
                <span className="rounded-full bg-[rgba(255,255,255,0.06)] px-2 py-[3px] text-[var(--muted)]">
                  {packSize} calls per refill
                </span>
              )}
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
                    Math.min(
                      100,
                      (sub.remainingQuota / Math.max(sub.totalQuota, 1)) * 100,
                    ),
                  )}%`,
                }}
              />
            </div>
            <div className="space-y-2">
              <code className="block truncate rounded-[var(--radius-sm)] border border-[var(--border)] bg-[rgba(0,0,0,0.25)] px-[14px] py-[10px] font-mono text-[11px] text-[#7eb8ff]">
                {sub.apiKey}
              </code>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className={`inline-flex min-w-[92px] items-center justify-center gap-2 ${
                    copiedId === sub.id
                      ? "border-[rgba(16,217,160,0.35)] bg-[var(--green-dim)] text-[var(--green)] hover:bg-[rgba(16,217,160,0.16)]"
                      : ""
                  }`}
                  onClick={() => copyKey(sub.id, sub.apiKey)}
                >
                  {copiedId === sub.id && (
                    <span className="relative h-4 w-4 rounded-full border border-[currentColor]">
                      <span className="absolute left-[4px] top-[3px] h-[7px] w-[4px] rotate-45 border-b-2 border-r-2 border-[currentColor]" />
                    </span>
                  )}
                  {copiedId === sub.id ? "Copied" : DASHBOARD_LABELS.copy}
                </Button>
                {onRegenerateKey && (
                  <Button
                    variant="secondary"
                    onClick={() => onRegenerateKey(sub.id)}
                  >
                    {DASHBOARD_LABELS.regenerate}
                  </Button>
                )}
                {exhausted && onRefill && (
                  <Button
                    onClick={() => onRefill(sub.api.id)}
                    disabled={refillingId === sub.api.id}
                  >
                    {refillingId === sub.api.id
                      ? "Refilling..."
                      : "Refill quota"}
                  </Button>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
