"use client";

import { ADMIN_LABELS } from "@/constants";
import type { ApiItem } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export type ApiFormData = {
  title: string;
  slug: string;
  description: string;
  baseUrl: string;
  category: string;
  pricePerCall: string;
  defaultQuota: string;
  dummyResponse: string;
  status: string;
};

export const emptyApiForm = (): ApiFormData => ({
  title: "",
  slug: "",
  description: "",
  baseUrl: "",
  category: "",
  pricePerCall: "0",
  defaultQuota: "100",
  dummyResponse: '{\n  "message": "Dummy API response"\n}',
  status: "APPROVED",
});

export const apiToForm = (api: ApiItem): ApiFormData => ({
  title: api.title,
  slug: api.slug,
  description: api.description || "",
  baseUrl: api.baseUrl,
  category: api.category || "",
  pricePerCall: String(api.pricePerCall),
  defaultQuota: String(api.defaultQuota),
  dummyResponse: api.dummyResponse
    ? JSON.stringify(api.dummyResponse, null, 2)
    : '{\n  "message": "Dummy API response"\n}',
  status: api.status,
});

type Props = {
  form: ApiFormData;
  onChange: (form: ApiFormData) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  loading?: boolean;
};

export function ApiForm({ form, onChange, onSubmit, onCancel, loading }: Props) {
  const set = (key: keyof ApiFormData, value: string) =>
    onChange({ ...form, [key]: value });

  return (
    <form
      className="grid gap-3 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Input label={ADMIN_LABELS.titleField} value={form.title} onChange={(e) => set("title", e.target.value)} required />
      <Input label={ADMIN_LABELS.slug} value={form.slug} onChange={(e) => set("slug", e.target.value)} />
      <Input label={ADMIN_LABELS.description} value={form.description} onChange={(e) => set("description", e.target.value)} className="sm:col-span-2" />
      <Input label={ADMIN_LABELS.baseUrl} value={form.baseUrl} onChange={(e) => set("baseUrl", e.target.value)} required className="sm:col-span-2" />
      <Input label={ADMIN_LABELS.category} value={form.category} onChange={(e) => set("category", e.target.value)} />
      <Input label={ADMIN_LABELS.pricePerCall} type="number" step="0.0001" value={form.pricePerCall} onChange={(e) => set("pricePerCall", e.target.value)} />
      <Input label={ADMIN_LABELS.defaultQuota} type="number" value={form.defaultQuota} onChange={(e) => set("defaultQuota", e.target.value)} />
      <label className="block text-sm sm:col-span-2">
        <span className="mb-1 block text-gray-600">{ADMIN_LABELS.dummyResponse}</span>
        <textarea
          className="min-h-32 w-full rounded border border-gray-300 px-3 py-2 font-mono text-sm"
          value={form.dummyResponse}
          onChange={(e) => set("dummyResponse", e.target.value)}
        />
      </label>
      <Select
        label={ADMIN_LABELS.status}
        value={form.status}
        onChange={(e) => set("status", e.target.value)}
        options={[
          { value: "APPROVED", label: "APPROVED" },
          { value: "PENDING", label: "PENDING" },
          { value: "REJECTED", label: "REJECTED" },
        ]}
      />
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit" disabled={loading}>{ADMIN_LABELS.save}</Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            {ADMIN_LABELS.cancel}
          </Button>
        )}
      </div>
    </form>
  );
}
