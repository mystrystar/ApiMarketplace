import { LOGS_LABELS, TABLE_COLS } from "@/constants";
import type { ApiCallLog } from "@/types";
import { StatusBadge } from "@/components/ui/Badges";
import { EmptyState } from "@/components/ui/EmptyState";

export function LogsTable({
  logs,
  showUser,
}: {
  logs: ApiCallLog[];
  showUser?: boolean;
}) {
  if (!logs.length) {
    return <EmptyState title={LOGS_LABELS.empty} />;
  }

  return (
    <div className="console-panel overflow-hidden">
      <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-[var(--border)] bg-[var(--bg-elevated)] text-[10px] uppercase tracking-[1.5px] text-[var(--muted)]">
          <tr>
            <th className="px-3 py-2">{TABLE_COLS.date}</th>
            <th className="px-3 py-2">{TABLE_COLS.api}</th>
            {showUser && <th className="px-3 py-2">{TABLE_COLS.user}</th>}
            <th className="px-3 py-2">{TABLE_COLS.status}</th>
            <th className="px-3 py-2">{TABLE_COLS.responseTime}</th>
            <th className="px-3 py-2">{TABLE_COLS.ipAddress}</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr
              key={log.id}
              className="border-b border-[var(--border)] transition hover:bg-[rgba(79,142,255,0.04)] last:border-0"
            >
              <td className="px-3 py-2 font-mono text-[11px] text-[var(--muted)]">
                {new Date(log.createdAt).toLocaleString()}
              </td>
              <td className="px-3 py-2">{log.api?.title || log.apiName}</td>
              {showUser && (
                <td className="px-3 py-2">{log.user?.email || "-"}</td>
              )}
              <td className="px-3 py-2"><StatusBadge status={log.statusCode} /></td>
              <td className="px-3 py-2 font-mono text-[11px] text-[var(--muted)]">{log.responseTimeMs} ms</td>
              <td className="px-3 py-2 font-mono text-[10px] text-[var(--muted)]">{log.ipAddress || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
