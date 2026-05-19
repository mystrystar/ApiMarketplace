"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_LABELS, API_PATHS, DASHBOARD_LABELS, ROUTES } from "@/constants";
import { apiRequest } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import type { AdminUserDetails, Purchase } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { SubscriptionList } from "@/components/dashboard/SubscriptionList";
import { LogsTable } from "@/components/logs/LogsTable";
import { PurchaseHistoryTable } from "@/components/purchases/PurchaseHistoryTable";

export default function AdminPurchasesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [selected, setSelected] = useState<AdminUserDetails | null>(null);

  useEffect(() => {
    if (!loading && user?.role !== "ADMIN") {
      router.replace(ROUTES.marketplace);
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      apiRequest<{ purchases: Purchase[] }>(API_PATHS.adminPurchases).then((r) =>
        setPurchases(r.purchases),
      );
    }
  }, [user]);

  async function loadUserDetails(id: string) {
    const res = await apiRequest<AdminUserDetails>(API_PATHS.adminUser(id));
    setSelected(res);
  }

  return (
    <div className="space-y-6">
      <PageHeader title={ADMIN_LABELS.purchases} />
      <PurchaseHistoryTable
        purchases={purchases}
        showUser
        onUserClick={loadUserDetails}
      />
      {selected && (
        <div className="space-y-4">
          <Card title={ADMIN_LABELS.userDetails}>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{selected.user.email}</p>
              <p>{selected.user.role}</p>
            </div>
          </Card>
          <Card title={DASHBOARD_LABELS.subscriptions}>
            <SubscriptionList items={selected.subscriptions} />
          </Card>
          <Card title={DASHBOARD_LABELS.recentActivity}>
            <LogsTable logs={selected.recentLogs} />
          </Card>
        </div>
      )}
    </div>
  );
}
