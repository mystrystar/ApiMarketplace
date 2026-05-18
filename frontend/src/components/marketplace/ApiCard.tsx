"use client";

import { HTTP_METHOD, MARKETPLACE_LABELS } from "@/constants";
import type { ApiItem } from "@/types";
import { Button } from "@/components/ui/Button";

type Props = {
  api: ApiItem;
  onBuy: (id: string) => void;
  buying?: boolean;
};

export function ApiCard({ api, onBuy, buying }: Props) {
  return (
    <article className="flex flex-col rounded border border-gray-200 bg-white p-4">
      <h3 className="font-semibold text-gray-900">{api.title}</h3>
      <p className="mt-2 flex-1 text-sm text-gray-600">
        {api.description || "No description"}
      </p>
      <dl className="mt-3 space-y-1 text-xs text-gray-500">
        <div className="flex justify-between">
          <dt>{MARKETPLACE_LABELS.method}</dt>
          <dd className="font-mono">{HTTP_METHOD}</dd>
        </div>
        <div className="flex justify-between">
          <dt>{MARKETPLACE_LABELS.quotaPack}</dt>
          <dd>{api.defaultQuota} calls</dd>
        </div>
        <div className="flex justify-between">
          <dt>{MARKETPLACE_LABELS.price}</dt>
          <dd>${api.pricePerCall.toFixed(4)}/call</dd>
        </div>
      </dl>
      <Button className="mt-4 w-full" onClick={() => onBuy(api.id)} disabled={buying}>
        {MARKETPLACE_LABELS.buy}
      </Button>
    </article>
  );
}
