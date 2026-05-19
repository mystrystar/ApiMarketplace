import { DASHBOARD_LABELS, TABLE_COLS } from "@/constants";
import type { Purchase } from "@/types";
import { EmptyState } from "@/components/ui/EmptyState";

type Props = {
  purchases: Purchase[];
  showUser?: boolean;
  onUserClick?: (userId: string) => void;
};

export function PurchaseHistoryTable({
  purchases,
  showUser,
  onUserClick,
}: Props) {
  if (!purchases.length) {
    return <EmptyState title={DASHBOARD_LABELS.noPurchases} />;
  }

  return (
    <div className="console-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--bg-elevated)] text-[10px] uppercase tracking-[1.5px] text-[var(--muted)]">
            <tr>
              <th className="px-3 py-2">{TABLE_COLS.date}</th>
              {showUser && <th className="px-3 py-2">{TABLE_COLS.user}</th>}
              <th className="px-3 py-2">{TABLE_COLS.api}</th>
              <th className="px-3 py-2">{TABLE_COLS.endpoint}</th>
              <th className="px-3 py-2">{TABLE_COLS.quota}</th>
              <th className="px-3 py-2">{TABLE_COLS.amount}</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr
                key={purchase.id}
                className="border-b border-[var(--border)] transition hover:bg-[rgba(79,142,255,0.04)] last:border-0"
              >
                <td className="px-4 py-[14px] font-mono text-xs text-[var(--muted)]">
                  {new Date(purchase.createdAt).toLocaleString()}
                </td>
                {showUser && (
                  <td className="px-4 py-[14px]">
                    {onUserClick ? (
                      <button
                        type="button"
                        className="text-left font-medium text-[var(--accent)]"
                        onClick={() => onUserClick(purchase.user.id)}
                      >
                        {purchase.user.email}
                      </button>
                    ) : (
                      purchase.user.email
                    )}
                  </td>
                )}
                <td className="px-4 py-[14px] font-medium">
                  {purchase.api.title}
                </td>
                <td className="px-4 py-[14px]">
                  <span className="rounded-md bg-[rgba(0,0,0,0.3)] px-2 py-[3px] font-mono text-[11px] text-[#7eb8ff]">
                    /v1/{purchase.api.slug}
                  </span>
                </td>
                <td className="px-4 py-[14px] font-mono">{purchase.quota}</td>
                <td
                  className={`px-4 py-[14px] font-mono font-semibold ${
                    Number(purchase.amount || 0) === 0
                      ? "text-[var(--muted)]"
                      : "text-[var(--green)]"
                  }`}
                >
                  {"\u20b9"}
                  {Number(purchase.amount || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
