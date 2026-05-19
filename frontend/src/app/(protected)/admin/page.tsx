"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!loading && user?.role !== "ADMIN") {
      router.replace(ROUTES.marketplace);
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    apiRequest<Analytics>(API_PATHS.adminAnalytics).then(setAnalytics);
  }, [user]);

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
