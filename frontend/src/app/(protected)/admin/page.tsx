"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_LABELS, API_PATHS, ROUTES } from "@/constants";
import { apiRequest } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import type { Analytics } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { AnalyticsCards } from "@/components/admin/AnalyticsCards";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  const load = useCallback(async () => {
    if (user?.role !== "ADMIN") return;
    const res = await apiRequest<Analytics>(API_PATHS.adminAnalytics);
    setAnalytics({
      ...res,
      totalUsers: Number(res.totalUsers || 0),
      totalApis: Number(res.totalApis || 0),
      totalCallsToday: Number(res.totalCallsToday || 0),
      revenue: Number(res.revenue || 0),
      topApis: res.topApis || [],
      topUsers: res.topUsers || [],
      recentUsers: res.recentUsers || [],
    });
  }, [user]);

  useEffect(() => {
    if (!loading && user?.role !== "ADMIN") {
      router.replace(ROUTES.marketplace);
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user?.role !== "ADMIN") return;

    void Promise.resolve().then(load);

    const interval = window.setInterval(() => {
      if (!document.hidden) void load();
    }, 2000);

    function refreshOnFocus() {
      void load();
    }

    window.addEventListener("focus", refreshOnFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, [user, load]);

  if (!analytics) {
    return <p className="text-sm text-[var(--text-muted)]">Loading...</p>;
  }

  return (
    <div>
      <PageHeader
        title={ADMIN_LABELS.title}
        action={
          <button
            type="button"
            className="rounded-[var(--radius-sm)] bg-[linear-gradient(135deg,var(--accent),var(--purple))] px-3 py-2 text-sm font-medium text-white"
            onClick={() => router.push(ROUTES.adminApis)}
          >
            Add API
          </button>
        }
      />
      <AnalyticsCards data={analytics} />
    </div>
  );
}
