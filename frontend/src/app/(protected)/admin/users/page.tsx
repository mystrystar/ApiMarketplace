"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_LABELS, API_PATHS, ROUTES, TABLE_COLS } from "@/constants";
import { apiRequest } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import type { User } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

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
  }

  return (
    <div>
      <PageHeader title={ADMIN_LABELS.users} />
      <div className="overflow-x-auto rounded border border-gray-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2">{TABLE_COLS.email}</th>
              <th className="px-3 py-2">{TABLE_COLS.role}</th>
              <th className="px-3 py-2">{TABLE_COLS.actions}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="px-3 py-2">{u.email}</td>
                <td className="px-3 py-2">{u.role}</td>
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
    </div>
  );
}
