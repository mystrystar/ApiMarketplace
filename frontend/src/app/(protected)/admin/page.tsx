"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_LABELS, API_PATHS, ROUTES } from "@/constants";
import { apiRequest } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import type { Analytics } from "@/types";
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
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d1834]/80 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-cyan-200/80">Admin Portal</p>
            <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">
              {ADMIN_LABELS.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Review API supply, monitor demand, track consumers, and keep marketplace usage healthy.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-3 text-sm font-bold text-cyan-100"
              onClick={() => router.push(ROUTES.adminUsers)}
            >
              View Users
            </button>
            <button
              type="button"
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(37,99,235,0.25)]"
              onClick={() => router.push(ROUTES.adminApis)}
            >
              Add API
            </button>
          </div>
        </div>
      </div>
      <AnalyticsCards data={analytics} />
    </div>
  );
}
