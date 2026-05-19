import { DASHBOARD_LABELS } from "@/constants";
import { Card } from "@/components/ui/Card";

export function StatsCards({
  subscriptionCount,
  totalCalls,
  callsToday,
  quotaHealth,
}: {
  subscriptionCount: number;
  totalCalls: number;
  callsToday: number;
  quotaHealth: number;
}) {
  const items = [
    {
      label: DASHBOARD_LABELS.subscriptions,
      value: subscriptionCount,
      suffix: "",
      icon: "AP",
      tone: "text-[var(--accent)] bg-[var(--accent-dim)]",
    },
    {
      label: DASHBOARD_LABELS.totalCalls,
      value: totalCalls,
      suffix: "",
      icon: "IO",
      tone: "text-[#a78bfa] bg-[rgba(124,58,237,0.12)]",
    },
    {
      label: DASHBOARD_LABELS.callsToday,
      value: callsToday,
      suffix: "",
      icon: "24",
      tone: "text-[var(--amber)] bg-[var(--amber-dim)]",
    },
    {
      label: DASHBOARD_LABELS.quotaHealth,
      value: quotaHealth,
      suffix: "%",
      icon: "%",
      tone:
        quotaHealth > 50
          ? "text-[var(--green)] bg-[var(--green-dim)]"
          : quotaHealth > 20
            ? "text-[var(--amber)] bg-[var(--amber-dim)]"
            : "text-[var(--red)] bg-[var(--red-dim)]",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <div>
            <span
              className={`grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] font-mono text-xs font-bold ${item.tone}`}
            >
              {item.icon}
            </span>
            <p className="mt-3 font-mono text-[28px] font-bold">
              {item.value}
              {item.suffix}
            </p>
            <p className="text-[11px] uppercase tracking-[1px] text-[var(--muted)]">
              {item.label}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
