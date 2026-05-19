"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ADMIN_LABELS,
  API_PATHS,
  DASHBOARD_LABELS,
  ROUTES,
  TABLE_COLS,
} from "@/constants";
import { apiRequest } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import type { AdminUserDetails, User } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SubscriptionList } from "@/components/dashboard/SubscriptionList";
import { PurchaseHistoryTable } from "@/components/purchases/PurchaseHistoryTable";
import { LogsTable } from "@/components/logs/LogsTable";

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<AdminUserDetails | null>(null);

  useEffect(() => {
    if (!loading && user?.role !== "ADMIN") {
      router.replace(ROUTES.marketplace);
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      apiRequest<{ users: User[] }>(API_PATHS.adminUsers).then((r) =>
        setUsers(r.users),
      );
    }
  }, [user]);

  async function loadUserDetails(id: string) {
    const res = await apiRequest<AdminUserDetails>(API_PATHS.adminUser(id));
    setSelected(res);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={ADMIN_LABELS.users}
        action={
          <span className="rounded-full bg-[var(--accent-dim)] px-3 py-1 text-xs text-[var(--accent)]">
            {users.length} users
          </span>
        }
      />
      <div className="console-panel overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--bg-elevated)] text-[10px] uppercase tracking-[1.5px] text-[var(--muted)]">
            <tr>
              <th className="px-3 py-2">{TABLE_COLS.email}</th>
              <th className="px-3 py-2">{TABLE_COLS.role}</th>
              <th className="px-3 py-2">Subscriptions</th>
              <th className="px-3 py-2">Total Calls</th>
              <th className="px-3 py-2">{ADMIN_LABELS.purchases}</th>
              <th className="px-3 py-2">{TABLE_COLS.actions}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[var(--border)] transition hover:bg-[rgba(79,142,255,0.04)]">
                <td className="px-4 py-[14px]">
                  <button
                    type="button"
                    className="text-left font-medium text-[var(--accent)]"
                    onClick={() => loadUserDetails(u.id)}
                  >
                    {u.email}
                  </button>
                </td>
                <td className="px-4 py-[14px]">
                  <span
                    className={`rounded-full px-[10px] py-[3px] text-[10px] font-semibold ${
                      u.role === "ADMIN"
                        ? "bg-[rgba(124,58,237,0.12)] text-[#a78bfa]"
                        : "bg-[var(--accent-dim)] text-[var(--accent)]"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-[14px] font-mono">{u._count?.subscriptions || 0}</td>
                <td className="px-4 py-[14px] font-mono">{u._count?.apiCallLogs || 0}</td>
                <td className="px-4 py-[14px] font-mono">{u._count?.purchases || 0}</td>
                <td className="w-40 px-4 py-[14px]">
                  <Button variant="secondary" onClick={() => loadUserDetails(u.id)} className="px-3 py-1 text-[11px]">
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && (
        <div className="space-y-4">
          <Card title={`${ADMIN_LABELS.userDetails}: ${selected.user.email}`}>
            <div className="space-y-2 text-sm">
              <p className="text-[var(--text-muted)]">
                Click another email in the table to inspect that user.
              </p>
              <p className="inline-flex rounded-full bg-[rgba(79,142,255,0.12)] px-2 py-1 text-xs text-[#7eb8ff]">
                {selected.user.role}
              </p>
            </div>
          </Card>
          <Card title={DASHBOARD_LABELS.subscriptions}>
            <SubscriptionList items={selected.subscriptions} />
          </Card>
          <Card title={DASHBOARD_LABELS.purchaseHistory}>
            <PurchaseHistoryTable purchases={selected.purchases} />
          </Card>
          <Card title={DASHBOARD_LABELS.recentActivity}>
            <LogsTable logs={selected.recentLogs} />
          </Card>
        </div>
      )}
    </div>
  );
}
