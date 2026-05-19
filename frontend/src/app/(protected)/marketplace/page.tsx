"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { API_PATHS, MARKETPLACE_LABELS } from "@/constants";
import { apiRequest, ApiError } from "@/lib/api-client";
import type { ApiItem, DashboardData } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { ApiCard } from "@/components/marketplace/ApiCard";
import { ApiFilters } from "@/components/marketplace/ApiFilters";
import { EmptyState } from "@/components/ui/EmptyState";

export default function MarketplacePage() {
  const [apis, setApis] = useState<ApiItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [subscribedIds, setSubscribedIds] = useState<string[]>([]);

  const load = useCallback(async () => {
    const data = await apiRequest<{ apis: ApiItem[] }>(API_PATHS.apis, {
      params: { search: search || undefined, category: category || undefined },
    });
    setApis(data.apis);
  }, [search, category]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  useEffect(() => {
    apiRequest<DashboardData>(API_PATHS.dashboard).then((data) => {
      setSubscribedIds(data.subscriptions.map((subscription) => subscription.api.id));
    });
  }, []);

  const categories = useMemo(
    () =>
      [...new Set(apis.map((a) => a.category).filter(Boolean))] as string[],
    [apis],
  );

  async function handleBuy(id: string) {
    setBuyingId(id);
    setMessage("");
    try {
      await apiRequest(API_PATHS.apiPurchase(id), { method: "POST" });
      setMessage("Purchase successful. Check your dashboard.");
      setSubscribedIds((prev) => [...new Set([...prev, id])]);
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Purchase failed");
    } finally {
      setBuyingId(null);
    }
  }

  return (
    <div>
      <PageHeader title={MARKETPLACE_LABELS.title} />
      <ApiFilters
        search={search}
        category={category}
        categories={categories}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
      />
      {message && <p className="mb-4 text-sm text-[var(--text-muted)]">{message}</p>}
      {apis.length === 0 ? (
        <EmptyState title={MARKETPLACE_LABELS.empty} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {apis.map((api) => (
            <ApiCard
              key={api.id}
              api={api}
              onBuy={handleBuy}
              buying={buyingId === api.id}
              subscribed={subscribedIds.includes(api.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
