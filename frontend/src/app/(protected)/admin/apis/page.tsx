"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_LABELS, API_PATHS, ROUTES } from "@/constants";
import { apiRequest, ApiError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import type { ApiItem } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  ApiForm,
  ApiFormData,
  apiToForm,
  emptyApiForm,
} from "@/components/admin/ApiForm";
import { ApiTable } from "@/components/admin/ApiTable";

export default function AdminApisPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [apis, setApis] = useState<ApiItem[]>([]);
  const [form, setForm] = useState<ApiFormData>(emptyApiForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user?.role !== "ADMIN") {
      router.replace(ROUTES.marketplace);
    }
  }, [loading, user, router]);

  const load = useCallback(async () => {
    const res = await apiRequest<{ apis: ApiItem[] }>(API_PATHS.adminApis);
    setApis(res.apis);
  }, []);

  useEffect(() => {
    if (user?.role === "ADMIN") load();
  }, [user, load]);

  async function handleSubmit() {
    setSaving(true);
    setError("");
    let dummyResponse: unknown;
    try {
      dummyResponse = form.dummyResponse.trim()
        ? JSON.parse(form.dummyResponse)
        : undefined;
    } catch {
      setSaving(false);
      setError("Dummy response must be valid JSON");
      return;
    }

    const body = {
      title: form.title,
      slug: form.slug || undefined,
      description: form.description,
      baseUrl: form.baseUrl,
      category: form.category,
      pricePerCall: parseFloat(form.pricePerCall),
      defaultQuota: parseInt(form.defaultQuota, 10),
      dummyResponse,
      status: form.status,
    };
    try {
      if (editingId) {
        await apiRequest(API_PATHS.adminApi(editingId), {
          method: "PATCH",
          body,
        });
      } else {
        await apiRequest(API_PATHS.adminApis, { method: "POST", body });
      }
      setForm(emptyApiForm());
      setEditingId(null);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(api: ApiItem) {
    setEditingId(api.id);
    setForm(apiToForm(api));
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this API?")) return;
    await apiRequest(API_PATHS.adminApi(id), { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={ADMIN_LABELS.createApi}
        action={
          editingId ? (
            <button
              type="button"
              className="text-sm underline"
              onClick={() => {
                setEditingId(null);
                setForm(emptyApiForm());
              }}
            >
              {ADMIN_LABELS.cancel}
            </button>
          ) : null
        }
      />
      <p className="-mt-4 text-[13px] text-[var(--muted)]">
        Add a new API to the marketplace catalog
      </p>
      <div className="console-panel max-w-[900px] rounded-[var(--radius-lg)] px-8 py-7">
        <div className="mb-4 border-b border-[var(--border)] pb-2 text-[11px] font-semibold uppercase tracking-[1.5px] text-[var(--muted)]">
          API Details
        </div>
        <ApiForm
          form={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          loading={saving}
        />
        {error && <p className="mt-2 text-sm text-[var(--danger)]">{error}</p>}
      </div>
      <ApiTable apis={apis} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
