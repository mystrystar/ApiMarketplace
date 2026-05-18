import { ADMIN_LABELS, TABLE_COLS } from "@/constants";
import type { ApiItem } from "@/types";
import { Button } from "@/components/ui/Button";

type Props = {
  apis: ApiItem[];
  onEdit: (api: ApiItem) => void;
  onDelete: (id: string) => void;
};

export function ApiTable({ apis, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-3 py-2">{TABLE_COLS.api}</th>
            <th className="px-3 py-2">{ADMIN_LABELS.slug}</th>
            <th className="px-3 py-2">{ADMIN_LABELS.status}</th>
            <th className="px-3 py-2">{TABLE_COLS.actions}</th>
          </tr>
        </thead>
        <tbody>
          {apis.map((api) => (
            <tr key={api.id} className="border-b">
              <td className="px-3 py-2">{api.title}</td>
              <td className="px-3 py-2 font-mono text-xs">{api.slug}</td>
              <td className="px-3 py-2">{api.status}</td>
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
