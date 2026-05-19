import { ADMIN_LABELS, TABLE_COLS } from "@/constants";
import type { ApiItem } from "@/types";
import { Button } from "@/components/ui/Button";
import { MethodBadge } from "@/components/ui/Badges";

type Props = {
  apis: ApiItem[];
  onEdit: (api: ApiItem) => void;
  onDelete: (id: string) => void;
};

export function ApiTable({ apis, onEdit, onDelete }: Props) {
  return (
    <div className="console-panel overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-[var(--border)] bg-[var(--bg-elevated)] text-[10px] uppercase tracking-[1.5px] text-[var(--muted)]">
          <tr>
            <th className="px-3 py-2">{TABLE_COLS.api}</th>
            <th className="px-3 py-2">{TABLE_COLS.endpoint}</th>
            <th className="px-3 py-2">Method</th>
            <th className="px-3 py-2">Price</th>
            <th className="px-3 py-2">{ADMIN_LABELS.status}</th>
            <th className="px-3 py-2">{TABLE_COLS.actions}</th>
          </tr>
        </thead>
        <tbody>
          {apis.map((api) => (
            <tr key={api.id} className="border-b border-[var(--border)] transition hover:bg-[rgba(79,142,255,0.04)]">
              <td className="px-4 py-[14px]">{api.title}</td>
              <td className="px-3 py-2 font-mono text-xs text-[#7eb8ff]">/v1/{api.slug}</td>
              <td className="px-3 py-2"><MethodBadge /></td>
              <td className="px-3 py-2 font-mono">
                {"\u20b9"}
                {api.pricePerCall.toFixed(4)}
              </td>
              <td className="px-3 py-2 text-[var(--muted)]">{api.status}</td>
              <td className="px-3 py-2 space-x-2">
                <Button variant="secondary" onClick={() => onEdit(api)}>
                  {ADMIN_LABELS.editApi}
                </Button>
                <Button variant="danger" onClick={() => onDelete(api.id)}>
                  {ADMIN_LABELS.deleteApi}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
