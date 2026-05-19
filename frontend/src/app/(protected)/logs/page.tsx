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
import { Button } from "@/components/ui/Button";

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

  const fetchLogs = useCallback(async () => {
    const path = isAdmin ? API_PATHS.adminLogs : API_PATHS.userLogs;
    return apiRequest<PaginatedLogs>(path, {
      params: {
        page,
        limit: DEFAULT_PAGE_SIZE,
        apiId: filters.apiId || undefined,
        status: filters.status || undefined,
        from: filters.from || undefined,
        to: filters.to ? `${filters.to}T23:59:59` : undefined,
      },
    });
  }, [isAdmin, page, filters]);

  useEffect(() => {
    let active = true;
    let timer: number | undefined;

    async function refresh() {
      if (!active || document.hidden) return;
      const nextData = await fetchLogs();
      if (active) setData(nextData);
    }

    function schedule() {
      timer = window.setTimeout(async () => {
        await refresh();
        if (active) schedule();
      }, 5000);
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
  }, [fetchLogs]);

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

  function exportCsv() {
    const rows = data?.logs || [];
    const header = ["Date", "API", "User", "Status", "Time ms", "IP"];
    const csv = [
      header,
      ...rows.map((log) => [
        new Date(log.createdAt).toISOString(),
        log.api?.title || log.apiName,
        log.user?.email || "",
        String(log.statusCode),
        String(log.responseTimeMs),
        log.ipAddress || "",
      ]),
    ]
      .map((row) =>
        row
          .map((value) => `"${value.replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "api-call-logs.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  const apiOptions = apis.map((a) => ({ value: a.id, label: a.title }));

  return (
    <div>
      <PageHeader
        title={LOGS_LABELS.title}
        action={
          <Button variant="secondary" onClick={exportCsv} disabled={!data?.logs.length}>
            Export CSV
          </Button>
        }
      />
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
