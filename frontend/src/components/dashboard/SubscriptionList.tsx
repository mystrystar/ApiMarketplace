import { DASHBOARD_LABELS } from "@/constants";
import type { Subscription } from "@/types";
import { Button } from "@/components/ui/Button";

export function SubscriptionList({
  items,
  onRegenerateKey,
}: {
  items: Subscription[];
  onRegenerateKey?: (subscriptionId: string) => Promise<void>;
}) {
  if (!items.length) {
    return <p className="text-sm text-gray-500">{DASHBOARD_LABELS.noSubs}</p>;
  }

  function copyKey(apiKey: string) {
    navigator.clipboard.writeText(apiKey);
  }

  return (
    <ul className="space-y-2">
      {items.map((sub) => (
        <li key={sub.id} className="space-y-3 rounded border border-gray-100 p-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-medium">{sub.api.title}</span>
            <div className="flex flex-wrap items-center gap-3 text-gray-600">
              <span className="font-mono text-xs">/v1/{sub.api.slug}</span>
              {sub.api.status && <span>{sub.api.status}</span>}
              <span>
                {DASHBOARD_LABELS.remainingQuota}: {sub.remainingQuota} / {sub.totalQuota}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <code className="block break-all rounded bg-gray-100 p-2 text-xs">
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
