import { DASHBOARD_LABELS } from "@/constants";
import type { Subscription } from "@/types";
import { Card } from "@/components/ui/Card";

export function SubscriptionList({ items }: { items: Subscription[] }) {
  if (!items.length) {
    return <p className="text-sm text-gray-500">{DASHBOARD_LABELS.noSubs}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((sub) => (
        <li
          key={sub.id}
          className="flex flex-wrap items-center justify-between rounded border border-gray-100 p-3 text-sm"
        >
          <span className="font-medium">{sub.api.title}</span>
          <span className="text-gray-600">
            {DASHBOARD_LABELS.remainingQuota}: {sub.remainingQuota} / {sub.totalQuota}
          </span>
        </li>
      ))}
    </ul>
  );
}
