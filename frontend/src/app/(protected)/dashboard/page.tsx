"use client";

import { useCallback, useEffect, useState } from "react";
import { API_PATHS, DASHBOARD_LABELS } from "@/constants";
import { apiRequest } from "@/lib/api-client";
import type { DashboardData } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { SubscriptionList } from "@/components/dashboard/SubscriptionList";
import { PurchaseHistoryTable } from "@/components/purchases/PurchaseHistoryTable";
import { LogsTable } from "@/components/logs/LogsTable";

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

  if (!data) {
    return <p className="text-sm text-[var(--text-muted)]">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={DASHBOARD_LABELS.title} />
      <StatsCards
        subscriptionCount={data.subscriptions.length}
        totalCalls={data.totalCalls}
        callsToday={data.callsToday}
        quotaHealth={data.quotaHealth}
      />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card title={DASHBOARD_LABELS.subscriptions}>
          <SubscriptionList
            items={data.subscriptions}
            onRegenerateKey={regenerateSubscriptionKey}
            onRefill={refillQuota}
            refillingId={refillingId}
          />
        </Card>
        <Card title={DASHBOARD_LABELS.recentActivity}>
          <LogsTable logs={data.recentLogs} />
        </Card>
      </div>
      <Card title={DASHBOARD_LABELS.purchaseHistory}>
        <PurchaseHistoryTable purchases={data.purchases} />
      </Card>
    </div>
  );
}
