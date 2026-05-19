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

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  const load = useCallback(async () => {
    const res = await apiRequest<DashboardData>(API_PATHS.dashboard);
    setData(res);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
      <Card title={DASHBOARD_LABELS.subscriptions}>
        <SubscriptionList
          items={data.subscriptions}
          onRegenerateKey={regenerateSubscriptionKey}
        />
      </Card>
      <Card title={DASHBOARD_LABELS.purchaseHistory}>
        <PurchaseHistoryTable purchases={data.purchases} />
      </Card>
    </div>
  );
}
