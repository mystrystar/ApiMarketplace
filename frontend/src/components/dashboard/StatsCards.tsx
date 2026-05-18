import { DASHBOARD_LABELS } from "@/constants";
import { Card } from "@/components/ui/Card";

export function StatsCards({
  subscriptionCount,
  totalCalls,
}: {
  subscriptionCount: number;
  totalCalls: number;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card title={DASHBOARD_LABELS.subscriptions}>
        <p className="text-2xl font-semibold">{subscriptionCount}</p>
      </Card>
      <Card title={DASHBOARD_LABELS.totalCalls}>
        <p className="text-2xl font-semibold">{totalCalls}</p>
      </Card>
    </div>
  );
}
