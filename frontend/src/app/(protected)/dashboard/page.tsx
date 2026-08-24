"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { API_PATHS, DASHBOARD_LABELS, ROUTES } from "@/constants";
import { apiRequest } from "@/lib/api-client";
import type { DashboardData } from "@/types";
import { Card } from "@/components/ui/Card";
import { SubscriptionList } from "@/components/dashboard/SubscriptionList";
import { PurchaseHistoryTable } from "@/components/purchases/PurchaseHistoryTable";
import { LogsTable } from "@/components/logs/LogsTable";

const chartPoints = "0,150 92,126 184,94 276,42 368,76 460,98 552,66";
const chartArea = "0,150 92,126 184,94 276,42 368,76 460,98 552,66 552,180 0,180";
const palette = ["#8b5cf6", "#2563eb", "#06b6d4", "#10b981", "#f59e0b"];

function MetricCard({
  label,
  value,
  delta,
  icon,
  tone,
}: {
  label: string;
  value: string | number;
  delta: string;
  icon: string;
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

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [refillingId, setRefillingId] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    const res = await apiRequest<DashboardData>(API_PATHS.dashboard);
    return {
      ...res,
      subscriptions: res.subscriptions || [],
      purchases: res.purchases || [],
      recentLogs: res.recentLogs || [],
      totalCalls: Number(res.totalCalls || 0),
      callsToday: Number(res.callsToday || 0),
      quotaHealth: Number(res.quotaHealth || 0),
    };
  }, []);

  useEffect(() => {
    let active = true;
    let timer: number | undefined;

    async function refresh() {
      if (!active || document.hidden) return;
      const nextData = await fetchDashboard();
      if (active) setData(nextData);
    }

    function schedule() {
      timer = window.setTimeout(async () => {
        await refresh();
        if (active) schedule();
      }, 3000);
    }

    void refresh().finally(schedule);

    function refreshOnFocus() {
      void refresh();
    }

    window.addEventListener("focus", refreshOnFocus);

    return () => {
      active = false;
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, [fetchDashboard]);

  async function regenerateSubscriptionKey(subscriptionId: string) {
    const res = await apiRequest<{ apiKey: string }>(
      API_PATHS.regenerateSubscriptionKey(subscriptionId),
      { method: "POST" },
    );
    setData((prev) =>
      prev
        ? {
            ...prev,
            subscriptions: prev.subscriptions.map((sub) =>
              sub.id === subscriptionId ? { ...sub, apiKey: res.apiKey } : sub,
            ),
          }
        : prev,
    );
  }

  async function refillQuota(apiId: string) {
    setRefillingId(apiId);
    try {
      await apiRequest(API_PATHS.apiPurchase(apiId), { method: "POST" });
      setData(await fetchDashboard());
    } finally {
      setRefillingId(null);
    }
  }

  const topApis = useMemo(() => {
    if (!data) return [];
    return data.subscriptions.slice(0, 5).map((sub, index) => {
      const matchingLogs = data.recentLogs.filter(
        (log) => log.api?.id === sub.api.id || log.apiName === sub.api.title,
      );
      const fallback = Math.max(0, Number(sub.totalQuota || 0) - Number(sub.remainingQuota || 0));
      return {
        title: sub.api.title,
        calls: matchingLogs.length || fallback,
        version: `/v1/${sub.api.slug}`,
        color: palette[index % palette.length],
      };
    });
  }, [data]);

  if (!data) {
    return <p className="text-sm text-[var(--text-muted)]">Loading...</p>;
  }

  const totalQuota = data.subscriptions.reduce((sum, sub) => sum + Number(sub.totalQuota || 0), 0);
  const remainingQuota = data.subscriptions.reduce(
    (sum, sub) => sum + Number(sub.remainingQuota || 0),
    0,
  );
  const usedQuota = Math.max(0, totalQuota - remainingQuota);
  const displayName = data.user.name || "Consumer";
  const maxTopCalls = Math.max(...topApis.map((api) => api.calls), 1);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-cyan-200/80">Consumer Portal</p>
          <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">
            Welcome back, {displayName} 👋
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Discover, connect, and monitor the APIs powering your apps.
          </p>
        </div>
        <Link
          href={ROUTES.marketplace}
          className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(37,99,235,0.25)]"
        >
          Browse APIs →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Subscribed APIs"
          value={data.subscriptions.length}
          delta="+2 this month ↗"
          icon="◈"
          tone="bg-violet-500/20 text-violet-200"
        />
        <MetricCard
          label={DASHBOARD_LABELS.totalCalls}
          value={data.totalCalls.toLocaleString()}
          delta={`${data.callsToday.toLocaleString()} calls today ↗`}
          icon="⌁"
          tone="bg-blue-500/20 text-blue-200"
        />
        <MetricCard
          label="Quota Health"
          value={`${data.quotaHealth}%`}
          delta={`${remainingQuota.toLocaleString()} calls remaining`}
          icon="◷"
          tone="bg-emerald-500/20 text-emerald-200"
        />
        <MetricCard
          label="Current Plan"
          value="Pro Plan"
          delta="Manage plan →"
          icon="▰"
          tone="bg-fuchsia-500/20 text-fuchsia-200"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Card className="overflow-hidden" title="API Usage Overview">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              {usedQuota.toLocaleString()} used of {Math.max(totalQuota, 0).toLocaleString()} purchased calls
            </p>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
              Last 7 days
            </span>
          </div>
          <div className="h-72 rounded-2xl border border-white/10 bg-[#081126]/85 p-5">
            <svg viewBox="0 0 552 180" className="h-full w-full overflow-visible">
              <defs>
                <linearGradient id="consumerArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[35, 70, 105, 140].map((y) => (
                <line key={y} x1="0" x2="552" y1={y} y2={y} stroke="rgba(148,163,184,0.12)" />
              ))}
              <polygon points={chartArea} fill="url(#consumerArea)" />
              <polyline
                points={chartPoints}
                fill="none"
                stroke="#c084fc"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
              />
              {[
                [0, 150],
                [92, 126],
                [184, 94],
                [276, 42],
                [368, 76],
                [460, 98],
                [552, 66],
              ].map(([x, y]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="#22d3ee" />
              ))}
            </svg>
          </div>
        </Card>

        <Card title="Top APIs by Usage">
          <div className="space-y-4">
            {(topApis.length ? topApis : [{ title: "No API usage yet", calls: 0, version: "Subscribe to begin", color: "#64748b" }]).map(
              (api) => (
                <div key={api.title} className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <div>
                      <p className="font-semibold text-white">{api.title}</p>
                      <p className="text-xs text-slate-500">{api.version}</p>
                    </div>
                    <span className="font-mono text-xs text-slate-300">
                      {api.calls.toLocaleString()} calls
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.max(8, (api.calls / maxTopCalls) * 100)}%`,
                        background: api.color,
                      }}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card title={DASHBOARD_LABELS.subscriptions}>
          <SubscriptionList
            items={data.subscriptions}
            onRegenerateKey={regenerateSubscriptionKey}
            onRefill={refillQuota}
            refillingId={refillingId}
          />
        </Card>

        <Card title="Usage Summary">
          <div className="grid items-center gap-6 sm:grid-cols-[190px_1fr] xl:grid-cols-1 2xl:grid-cols-[190px_1fr]">
            <div
              className="mx-auto grid h-44 w-44 place-items-center rounded-full"
              style={{
                background:
                  "conic-gradient(#8b5cf6 0 42%, #2563eb 42% 66%, #06b6d4 66% 82%, #10b981 82% 94%, #f59e0b 94% 100%)",
              }}
            >
              <div className="grid h-28 w-28 place-items-center rounded-full bg-[#0d1834] text-center">
                <div>
                  <p className="font-mono text-xl font-bold text-white">
                    {data.totalCalls.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400">Total Calls</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {(topApis.length ? topApis : [{ title: "Awaiting first API call", calls: 0, version: "", color: "#64748b" }]).map((api) => (
                <div key={api.title} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: api.color }} />
                    <span className="truncate text-slate-300">{api.title}</span>
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    {api.calls.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card title={DASHBOARD_LABELS.recentActivity}>
          <LogsTable logs={data.recentLogs} />
        </Card>
        <Card title={DASHBOARD_LABELS.purchaseHistory}>
          <PurchaseHistoryTable purchases={data.purchases} />
        </Card>
      </div>
    </div>
  );
}
