import { ADMIN_LABELS } from "@/constants";
import type { Analytics } from "@/types";
import { Card } from "@/components/ui/Card";

export function AnalyticsCards({ data }: { data: Analytics }) {
  const topApis = data.topApis || [];
  const recentUsers = data.recentUsers || [];
  const maxCalls = Math.max(...topApis.map((api) => Number(api.count || 0)), 1);
  const stats = [
    {
      label: ADMIN_LABELS.totalUsers,
      value: data.totalUsers,
      icon: "US",
      tone: "bg-[var(--accent-dim)] text-[var(--accent)]",
    },
    {
      label: ADMIN_LABELS.totalApis,
      value: data.totalApis,
      icon: "API",
      tone: "bg-[rgba(124,58,237,0.12)] text-[#a78bfa]",
    },
    {
      label: ADMIN_LABELS.revenue,
      value: `\u20b9${Number(data.revenue || 0).toFixed(2)}`,
      icon: "RS",
      tone: "bg-[var(--green-dim)] text-[var(--green)]",
    },
    {
      label: ADMIN_LABELS.callsToday,
      value: data.totalCallsToday,
      icon: "24",
      tone: "bg-[var(--amber-dim)] text-[var(--amber)]",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <span
              className={`grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] font-mono text-xs font-bold ${stat.tone}`}
            >
              {stat.icon}
            </span>
            <p className="mt-3 font-mono text-[28px] font-bold">{stat.value}</p>
            <p className="text-[11px] uppercase tracking-[1px] text-[var(--muted)]">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title={ADMIN_LABELS.topApis}>
          <ul className="divide-y divide-[var(--border)] text-sm">
            {topApis.map((api) => (
              <li
                key={api.apiId || api.title}
                className="flex items-center justify-between gap-4 py-3"
              >
                <span className="font-medium">{api.title}</span>
                <span className="flex items-center gap-3">
                  <span className="h-1 w-20 overflow-hidden rounded bg-[var(--accent-dim)]">
                    <span
                      className="block h-full rounded bg-[var(--accent)]"
                      style={{ width: `${(Number(api.count || 0) / maxCalls) * 100}%` }}
                    />
                  </span>
                  <span className="w-8 text-right font-mono text-[var(--accent)]">
                    {Number(api.count || 0)}
                  </span>
                </span>
              </li>
            ))}
            {!topApis.length && <li className="py-3 text-[var(--muted)]">No data</li>}
          </ul>
        </Card>

        <Card title={ADMIN_LABELS.recentUsers}>
          <ul className="divide-y divide-[var(--border)] text-sm">
            {recentUsers.map((user) => (
              <li key={user.id} className="flex items-center gap-3 py-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--accent-dim)] text-xs font-semibold text-[var(--accent)]">
                  {(user.email || "?").charAt(0).toUpperCase()}
                </span>
                <span className="truncate text-[13px]">{user.email || "Unknown"}</span>
                <span className="ml-auto font-mono text-[11px] text-[var(--muted)]">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
            {!recentUsers.length && (
              <li className="py-3 text-[var(--muted)]">No data</li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
