import { LOGS_LABELS, TABLE_COLS } from "@/constants";
import type { ApiCallLog } from "@/types";

export function LogsTable({
  logs,
  showUser,
}: {
  logs: ApiCallLog[];
  showUser?: boolean;
}) {
  if (!logs.length) {
    return <p className="text-sm text-gray-500">{LOGS_LABELS.empty}</p>;
  }

  return (
    <div className="overflow-x-auto rounded border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
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
            <tr key={log.id} className="border-b last:border-0">
              <td className="px-3 py-2">{new Date(log.createdAt).toLocaleString()}</td>
              <td className="px-3 py-2">{log.api?.title || log.apiName}</td>
              {showUser && (
                <td className="px-3 py-2">{log.user?.email || "-"}</td>
              )}
              <td className="px-3 py-2">{log.statusCode}</td>
              <td className="px-3 py-2">{log.responseTimeMs} ms</td>
              <td className="px-3 py-2 font-mono text-xs">{log.ipAddress || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
