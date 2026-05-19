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
      apiRequest<{ purchases: Purchase[] }>(API_PATHS.adminPurchases).then(
        (r) => setPurchases(r.purchases || []),
      );
    }
  }, [user]);

  async function loadUserDetails(id: string) {
    const res = await apiRequest<AdminUserDetails>(API_PATHS.adminUser(id));
    setSelected(res);
  }
  const revenue = purchases.reduce(
    (sum, purchase) => sum + Number(purchase.amount || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={ADMIN_LABELS.purchases}
        action={
          <span className="rounded-full bg-[var(--green-dim)] px-[14px] py-1 font-mono text-xs text-[var(--green)]">
            {"\u20b9"}
            {Number(revenue || 0).toFixed(2)}
          </span>
        }
      />
      <PurchaseHistoryTable
        purchases={purchases}
        showUser
        onUserClick={loadUserDetails}
      />
      {selected && (
        <div className="space-y-4">
          <Card title={`${ADMIN_LABELS.userDetails}: ${selected.user.email}`}>
            <div className="space-y-2 text-sm">
              <p className="text-[var(--text-muted)]">
                Selected from purchase history. Their subscriptions and recent
                calls are shown below.
              </p>
              <p className="inline-flex rounded-full bg-[rgba(79,142,255,0.12)] px-2 py-1 text-xs text-[#7eb8ff]">
                {selected.user.role}
              </p>
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
