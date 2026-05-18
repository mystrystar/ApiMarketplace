"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { API_PATHS, MARKETPLACE_LABELS } from "@/constants";
import { apiRequest, ApiError } from "@/lib/api-client";
import type { ApiItem } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { ApiCard } from "@/components/marketplace/ApiCard";
import { ApiFilters } from "@/components/marketplace/ApiFilters";

export default function MarketplacePage() {
  const [apis, setApis] = useState<ApiItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

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
      {message && <p className="mb-4 text-sm text-gray-700">{message}</p>}
      {apis.length === 0 ? (
        <p className="text-sm text-gray-500">{MARKETPLACE_LABELS.empty}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {apis.map((api) => (
            <ApiCard
              key={api.id}
              api={api}
              onBuy={handleBuy}
              buying={buyingId === api.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
