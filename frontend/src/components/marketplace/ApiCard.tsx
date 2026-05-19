"use client";

import Link from "next/link";
import { MARKETPLACE_LABELS, ROUTES } from "@/constants";
import type { ApiItem } from "@/types";
import { Button } from "@/components/ui/Button";
import { MethodBadge } from "@/components/ui/Badges";

type Props = {
  api: ApiItem;
  onBuy: (id: string) => void;
  buying?: boolean;
  subscribed?: boolean;
  remainingQuota?: number;
};

export function ApiCard({
  api,
  onBuy,
  buying,
  subscribed,
  remainingQuota,
}: Props) {
  const hasActiveQuota = subscribed && Number(remainingQuota || 0) > 0;
  const isExhausted = subscribed && Number(remainingQuota || 0) <= 0;

  return (
    <article className="console-panel flex flex-col p-5 transition hover:-translate-y-0.5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-[var(--radius-sm)] bg-[var(--accent-dim)] text-lg font-semibold text-[var(--accent)]">
          {api.title.charAt(0).toUpperCase()}
        </span>
        <MethodBadge method={api.method} />
      </div>
      <h3 className="mt-3 text-base font-semibold text-[var(--text)]">
        {api.title}
      </h3>
      <p className="mt-1 min-h-8 flex-1 text-xs text-[var(--muted)]">
        {api.description || "No description"}
      </p>
      <div className="my-4 border-t border-[var(--border)]" />
      <dl className="space-y-2 text-xs text-[var(--muted)]">
        <div className="flex justify-between">
          <dt>{MARKETPLACE_LABELS.method}</dt>
          <dd className="font-mono">{api.method}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Endpoint</dt>
          <dd className="font-mono text-[11px] text-[var(--accent)]">
            /v1/{api.slug}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt>{MARKETPLACE_LABELS.quotaPack}</dt>
          <dd className="font-mono">{api.defaultQuota} calls</dd>
        </div>
        <div className="flex justify-between">
          <dt>{MARKETPLACE_LABELS.price}</dt>
          <dd className="font-mono font-semibold text-[var(--green)]">
            {"\u20b9"}
            {Number(api.pricePerCall || 0).toFixed(4)}/call
          </dd>
        </div>
      </dl>
      {hasActiveQuota ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            disabled
            className="rounded-[var(--radius-sm)] border border-[rgba(16,217,160,0.3)] bg-[var(--green-dim)] p-[10px] text-[13px] font-semibold text-[var(--green)]"
          >
            Subscribed
          </button>
          <Link
            href={ROUTES.apiDocs(api.id)}
            className="rounded-[var(--radius-sm)] border border-[rgba(79,142,255,0.3)] bg-[var(--accent-dim)] p-[10px] text-center text-[13px] font-semibold text-[var(--accent)] transition hover:bg-[rgba(79,142,255,0.18)]"
          >
            Docs
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Button
            className="p-[10px]"
            onClick={() => onBuy(api.id)}
            disabled={buying}
          >
            {buying ? "Processing..." : isExhausted ? "Refill quota" : "Subscribe"}
          </Button>
          <Link
            href={ROUTES.apiDocs(api.id)}
            className="rounded-[var(--radius-sm)] border border-[rgba(79,142,255,0.3)] bg-[var(--accent-dim)] p-[10px] text-center text-[13px] font-semibold text-[var(--accent)] transition hover:bg-[rgba(79,142,255,0.18)]"
          >
            Docs
          </Link>
        </div>
      )}
    </article>
  );
}
