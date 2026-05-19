"use client";

import { LOGS_LABELS } from "@/constants";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

type Props = {
  apiId: string;
  method: string;
  status: string;
  from: string;
  to: string;
  apiOptions: { value: string; label: string }[];
  onChange: (field: string, value: string) => void;
};

export function LogsFilters({
  apiId,
  method,
  status,
  from,
  to,
  apiOptions,
  onChange,
}: Props) {
  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <Select
        label={LOGS_LABELS.api}
        value={apiId}
        onChange={(e) => onChange("apiId", e.target.value)}
        options={[{ value: "", label: LOGS_LABELS.allApis }, ...apiOptions]}
      />
      <Select
        label={LOGS_LABELS.method}
        value={method}
        onChange={(e) => onChange("method", e.target.value)}
        options={[
          { value: "", label: LOGS_LABELS.allMethods },
          { value: "GET", label: "GET" },
          { value: "POST", label: "POST" },
        ]}
      />
      <Select
        label={LOGS_LABELS.status}
        value={status}
        onChange={(e) => onChange("status", e.target.value)}
        options={[
          { value: "", label: LOGS_LABELS.allStatuses },
          { value: "200", label: "200" },
          { value: "401", label: "401" },
          { value: "403", label: "403" },
          { value: "429", label: "429" },
        ]}
      />
      <Input
        label={LOGS_LABELS.from}
        type="date"
        value={from}
        onChange={(e) => onChange("from", e.target.value)}
      />
      <Input
        label={LOGS_LABELS.to}
        type="date"
        value={to}
        onChange={(e) => onChange("to", e.target.value)}
      />
    </div>
  );
}
