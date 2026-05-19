"use client";

import { useCallback, useEffect, useState } from "react";
import { API_PATHS, DEFAULT_PAGE_SIZE, LOGS_LABELS } from "@/constants";
import { apiRequest } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import type { ApiItem, PaginatedLogs } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { LogsFilters } from "@/components/logs/LogsFilters";
import { LogsTable } from "@/components/logs/LogsTable";
import { LogsPagination } from "@/components/logs/LogsPagination";

export default function LogsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [filters, setFilters] = useState({
    apiId: "",
    status: "",
    from: "",
    to: "",
  });
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PaginatedLogs | null>(null);
  const [apis, setApis] = useState<ApiItem[]>([]);

  const load = useCallback(async () => {
    const path = isAdmin ? API_PATHS.adminLogs : API_PATHS.userLogs;
    const res = await apiRequest<PaginatedLogs>(path, {
      params: {
        page,
        limit: DEFAULT_PAGE_SIZE,
        apiId: filters.apiId || undefined,
        status: filters.status || undefined,
        from: filters.from || undefined,
        to: filters.to ? `${filters.to}T23:59:59` : undefined,
      },
    });
    setData(res);
  }, [isAdmin, page, filters]);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  useEffect(() => {
    async function loadApis() {
      const path = isAdmin ? API_PATHS.adminApis : API_PATHS.apis;
      const res = await apiRequest<{ apis: ApiItem[] }>(path);
      setApis(res.apis || []);
    }
    loadApis();
  }, [isAdmin]);

  function updateFilter(field: string, value: string) {
    setFilters((f) => ({ ...f, [field]: value }));
    setPage(1);
  }

  const apiOptions = apis.map((a) => ({ value: a.id, label: a.title }));

  return (
    <div>
      <PageHeader title={LOGS_LABELS.title} />
      <LogsFilters
        apiId={filters.apiId}
        status={filters.status}
        from={filters.from}
        to={filters.to}
        apiOptions={apiOptions}
        onChange={updateFilter}
      />
      <LogsTable logs={data?.logs || []} showUser={isAdmin} />
      {data && (
        <LogsPagination
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
