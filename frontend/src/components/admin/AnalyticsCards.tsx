import { ADMIN_LABELS } from "@/constants";
import type { Analytics } from "@/types";
import { Card } from "@/components/ui/Card";

const adminPalette = ["#22d3ee", "#8b5cf6", "#10b981", "#f59e0b", "#f43f5e"];

function AdminMetric({
  label,
  value,
  icon,
  delta,
  tone,
}: {
  label: string;
  value: string | number;
  icon: string;
  delta: string;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1834]/80 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.22)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400">{label}</p>
          <p className="mt-2 font-mono text-2xl font-bold text-white">{value}</p>
        </div>
        <span className={`grid h-12 w-12 place-items-center rounded-2xl text-xl ${tone}`}>
          {icon}
        </span>
      </div>
      <p className="mt-4 text-xs text-emerald-300">{delta}</p>
    </div>
  );
}

export function AnalyticsCards({ data }: { data: Analytics }) {
  const topApis = data.topApis || [];
  const topUsers = data.topUsers || [];
  const recentUsers = data.recentUsers || [];
  const maxCalls = Math.max(...topApis.map((api) => Number(api.count || 0)), 1);
  const maxUserCalls = Math.max(...topUsers.map((user) => Number(user.count || 0)), 1);

  const stats = [
    {
      label: ADMIN_LABELS.totalUsers,
      value: data.totalUsers.toLocaleString(),
      icon: "◎",
      delta: "Users under management",
      tone: "bg-cyan-400/15 text-cyan-200",
    },
    {
      label: ADMIN_LABELS.totalApis,
      value: data.totalApis.toLocaleString(),
      icon: "</>",
      delta: "Published and pending catalog",
      tone: "bg-violet-500/20 text-violet-200",
    },
    {
      label: ADMIN_LABELS.revenue,
      value: `₹${Number(data.revenue || 0).toFixed(2)}`,
      icon: "₹",
      delta: "Marketplace gross revenue",
      tone: "bg-emerald-500/20 text-emerald-200",
    },
    {
      label: ADMIN_LABELS.callsToday,
      value: data.totalCallsToday.toLocaleString(),
      icon: "24",
      delta: "Calls processed today",
      tone: "bg-amber-500/20 text-amber-200",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <AdminMetric key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <Card title="Platform Traffic">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-xs text-slate-400">Live admin usage overview</p>
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-200">
              Today
            </span>
          </div>
          <div className="h-72 rounded-2xl border border-white/10 bg-[#081126]/85 p-5">
            <svg viewBox="0 0 552 180" className="h-full w-full overflow-visible">
              <defs>
                <linearGradient id="adminArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[35, 70, 105, 140].map((y) => (
                <line key={y} x1="0" x2="552" y1={y} y2={y} stroke="rgba(148,163,184,0.12)" />
              ))}
              <polygon points="0,132 90,116 180,136 276,72 368,88 460,42 552,64 552,180 0,180" fill="url(#adminArea)" />
              <polyline
                points="0,132 90,116 180,136 276,72 368,88 460,42 552,64"
                fill="none"
                stroke="#22d3ee"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
              />
              {[
                [0, 132],
                [90, 116],
                [180, 136],
                [276, 72],
                [368, 88],
                [460, 42],
                [552, 64],
              ].map(([x, y]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="#a78bfa" />
              ))}
            </svg>
          </div>
        </Card>

        <Card title={ADMIN_LABELS.topApis}>
          <div className="space-y-4">
            {(topApis.length
              ? topApis
              : [{ apiId: "empty", title: "No API traffic yet", count: 0 }]
            ).map((api, index) => (
              <div key={api.apiId || api.title} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{api.title}</p>
                    <p className="text-xs text-slate-500">Usage rank #{index + 1}</p>
                  </div>
                  <span className="font-mono text-xs text-slate-300">
                    {Number(api.count || 0).toLocaleString()} calls
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(8, (Number(api.count || 0) / maxCalls) * 100)}%`,
                      background: adminPalette[index % adminPalette.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card title={ADMIN_LABELS.topUsers}>
          <div className="space-y-4">
            {(topUsers.length
              ? topUsers
              : [{ id: "empty", email: "No consumer calls yet", count: 0 }]
            ).map((user, index) => (
              <div key={user.id || user.email || index} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-xs font-bold text-white">
                      {(user.email || "?").charAt(0).toUpperCase()}
                    </span>
                    <span className="truncate text-slate-200">{user.email || "Unknown user"}</span>
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    {Number(user.count || 0).toLocaleString()}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                    style={{ width: `${Math.max(8, (Number(user.count || 0) / maxUserCalls) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title={ADMIN_LABELS.recentUsers}>
          <div className="space-y-3">
            {(recentUsers.length ? recentUsers : []).map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cyan-400/10 text-xs font-semibold text-cyan-200">
                  {(user.email || "?").charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{user.email || "Unknown"}</p>
                  <p className="truncate text-xs text-slate-500">{user.name || "Consumer account"}</p>
                </div>
                <span className="ml-auto font-mono text-[11px] text-slate-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
            {!recentUsers.length && <p className="text-sm text-slate-500">No recent signups yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
