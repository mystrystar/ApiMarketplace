import { DASHBOARD_LABELS, TABLE_COLS } from "@/constants";
import type { Purchase } from "@/types";

type Props = {
  purchases: Purchase[];
  showUser?: boolean;
  onUserClick?: (userId: string) => void;
};

export function PurchaseHistoryTable({ purchases, showUser, onUserClick }: Props) {
  if (!purchases.length) {
    return <p className="text-sm text-gray-500">{DASHBOARD_LABELS.noPurchases}</p>;
  }

  return (
    <div className="overflow-x-auto rounded border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
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
            <tr key={purchase.id} className="border-b last:border-0">
              <td className="px-3 py-2">
                {new Date(purchase.createdAt).toLocaleString()}
              </td>
              {showUser && (
                <td className="px-3 py-2">
                  {onUserClick ? (
                    <button
                      type="button"
                      className="text-left font-medium underline"
                      onClick={() => onUserClick(purchase.user.id)}
                    >
                      {purchase.user.email}
                    </button>
                  ) : (
                    purchase.user.email
                  )}
                </td>
              )}
              <td className="px-3 py-2">{purchase.api.title}</td>
              <td className="px-3 py-2 font-mono text-xs">
                /v1/{purchase.api.slug}
              </td>
              <td className="px-3 py-2">{purchase.quota}</td>
              <td className="px-3 py-2">${purchase.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
