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

  const fetchAnalytics = useCallback(async () => {
    if (user?.role !== "ADMIN") return;
    const res = await apiRequest<Analytics>(API_PATHS.adminAnalytics);
    return {
      ...res,
      totalUsers: Number(res.totalUsers || 0),
      totalApis: Number(res.totalApis || 0),
      totalCallsToday: Number(res.totalCallsToday || 0),
      revenue: Number(res.revenue || 0),
      topApis: res.topApis || [],
      topUsers: res.topUsers || [],
      recentUsers: res.recentUsers || [],
    };
  }, [user]);

  useEffect(() => {
    if (!loading && user?.role !== "ADMIN") {
      router.replace(ROUTES.marketplace);
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user?.role !== "ADMIN") return;

    let active = true;
    let timer: number | undefined;

    async function refresh() {
      if (!active || document.hidden) return;
      const nextAnalytics = await fetchAnalytics();
      if (active && nextAnalytics) setAnalytics(nextAnalytics);
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
  }, [user, fetchAnalytics]);

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
