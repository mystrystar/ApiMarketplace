"use client";

import { HTTP_METHOD, MARKETPLACE_LABELS } from "@/constants";
import type { ApiItem } from "@/types";
import { Button } from "@/components/ui/Button";
import { MethodBadge } from "@/components/ui/Badges";

type Props = {
  api: ApiItem;
  onBuy: (id: string) => void;
  buying?: boolean;
  subscribed?: boolean;
};

export function ApiCard({ api, onBuy, buying, subscribed }: Props) {
  return (
    <article className="console-panel flex flex-col p-5 transition hover:-translate-y-0.5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-[var(--radius-sm)] bg-[var(--accent-dim)] text-lg font-semibold text-[var(--accent)]">
          {api.title.charAt(0).toUpperCase()}
        </span>
        <MethodBadge method={HTTP_METHOD} />
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
      {subscribed ? (
        <button
          type="button"
          disabled
          className="mt-4 w-full rounded-[var(--radius-sm)] border border-[rgba(16,217,160,0.3)] bg-[var(--green-dim)] p-[10px] text-[13px] font-semibold text-[var(--green)]"
        >
          Subscribed
        </button>
      ) : (
        <Button
          className="mt-4 w-full p-[10px]"
          onClick={() => onBuy(api.id)}
          disabled={buying}
        >
          Subscribe
        </Button>
      )}
    </article>
  );
}
