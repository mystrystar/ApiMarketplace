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
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
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

  async function changeRole(id: string, role: string) {
    await apiRequest(API_PATHS.adminUserRole(id), {
      method: "PATCH",
      body: { role },
    });
    const res = await apiRequest<{ users: User[] }>(API_PATHS.adminUsers);
    setUsers(res.users);
    if (selected?.user.id === id) {
      await loadUserDetails(id);
    }
  }

  async function loadUserDetails(id: string) {
    const res = await apiRequest<AdminUserDetails>(API_PATHS.adminUser(id));
    setSelected(res);
  }

  return (
    <div className="space-y-6">
      <PageHeader title={ADMIN_LABELS.users} />
      <div className="overflow-x-auto rounded border border-gray-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2">{TABLE_COLS.email}</th>
              <th className="px-3 py-2">{TABLE_COLS.role}</th>
              <th className="px-3 py-2">{ADMIN_LABELS.purchases}</th>
              <th className="px-3 py-2">{TABLE_COLS.actions}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="px-3 py-2">
                  <button
                    type="button"
                    className="text-left font-medium underline"
                    onClick={() => loadUserDetails(u.id)}
                  >
                    {u.email}
                  </button>
                </td>
                <td className="px-3 py-2">{u.role}</td>
                <td className="px-3 py-2">{u._count?.purchases || 0}</td>
                <td className="px-3 py-2 w-40">
                  <Select
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    options={[
                      { value: "USER", label: "USER" },
                      { value: "ADMIN", label: "ADMIN" },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
