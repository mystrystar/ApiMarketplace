"use client";

import { useCallback, useEffect, useState } from "react";
import { API_PATHS, DASHBOARD_LABELS } from "@/constants";
import { apiRequest } from "@/lib/api-client";
import type { DashboardData } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { SubscriptionList } from "@/components/dashboard/SubscriptionList";
import { ApiKeyPanel } from "@/components/dashboard/ApiKeyPanel";
import { LogsTable } from "@/components/logs/LogsTable";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  const load = useCallback(async () => {
    const res = await apiRequest<DashboardData>(API_PATHS.dashboard);
    setData(res);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function regenerateKey() {
    const res = await apiRequest<{ apiKey: string }>(API_PATHS.regenerateKey, {
      method: "POST",
    });
    setData((prev) =>
      prev ? { ...prev, user: { ...prev.user, apiKey: res.apiKey } } : prev,
    );
  }

  if (!data) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={DASHBOARD_LABELS.title} />
      <StatsCards
        subscriptionCount={data.subscriptions.length}
        totalCalls={data.totalCalls}
      />
      <ApiKeyPanel apiKey={data.user.apiKey || ""} onRegenerate={regenerateKey} />
      <Card title={DASHBOARD_LABELS.subscriptions}>
        <SubscriptionList items={data.subscriptions} />
      </Card>
      <Card title={DASHBOARD_LABELS.recentActivity}>
        <LogsTable logs={data.recentLogs} />
      </Card>
    </div>
  );
}
