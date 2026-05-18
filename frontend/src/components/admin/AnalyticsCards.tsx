import { ADMIN_LABELS } from "@/constants";
import type { Analytics } from "@/types";
import { Card } from "@/components/ui/Card";

export function AnalyticsCards({ data }: { data: Analytics }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card title={ADMIN_LABELS.callsToday}>
          <p className="text-2xl font-semibold">{data.totalCallsToday}</p>
        </Card>
        <Card title={ADMIN_LABELS.revenue}>
          <p className="text-2xl font-semibold">${data.revenue.toFixed(2)}</p>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card title={ADMIN_LABELS.topApis}>
          <ul className="space-y-1 text-sm">
            {data.topApis.map((a) => (
              <li key={a.apiId} className="flex justify-between">
                <span>{a.title}</span>
                <span>{a.count}</span>
              </li>
            ))}
            {!data.topApis.length && <li className="text-gray-500">No data</li>}
          </ul>
        </Card>
        <Card title={ADMIN_LABELS.topUsers}>
          <ul className="space-y-1 text-sm">
            {data.topUsers.map((u) => (
              <li key={u.id || u.email} className="flex justify-between">
                <span>{u.email || u.id}</span>
                <span>{u.count}</span>
              </li>
            ))}
            {!data.topUsers.length && <li className="text-gray-500">No data</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
}
