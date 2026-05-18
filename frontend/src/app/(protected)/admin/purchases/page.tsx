"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_LABELS, API_PATHS, ROUTES, TABLE_COLS } from "@/constants";
import { apiRequest } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import type { Purchase } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";

export default function AdminPurchasesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);

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

  return (
    <div>
      <PageHeader title={ADMIN_LABELS.purchases} />
      <div className="overflow-x-auto rounded border border-gray-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2">{TABLE_COLS.date}</th>
              <th className="px-3 py-2">{TABLE_COLS.user}</th>
              <th className="px-3 py-2">{TABLE_COLS.api}</th>
              <th className="px-3 py-2">{TABLE_COLS.quota}</th>
              <th className="px-3 py-2">{TABLE_COLS.amount}</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="px-3 py-2">
                  {new Date(p.createdAt).toLocaleString()}
                </td>
                <td className="px-3 py-2">{p.user.email}</td>
                <td className="px-3 py-2">{p.api.title}</td>
                <td className="px-3 py-2">{p.quota}</td>
                <td className="px-3 py-2">${p.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
