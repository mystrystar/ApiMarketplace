"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { API_BASE, API_PATHS, ROUTES } from "@/constants";
import { apiRequest } from "@/lib/api-client";
import type { ApiItem } from "@/types";
import { Card } from "@/components/ui/Card";
import { MethodBadge } from "@/components/ui/Badges";
import { PageHeader } from "@/components/ui/PageHeader";

export default function ApiDocsPage() {
  const params = useParams<{ id: string }>();
  const [api, setApi] = useState<ApiItem | null>(null);

  useEffect(() => {
    void Promise.resolve()
      .then(() => apiRequest<{ api: ApiItem }>(API_PATHS.api(params.id)))
      .then((res) => setApi(res.api));
  }, [params.id]);

  if (!api) {
    return <p className="text-sm text-[var(--text-muted)]">Loading...</p>;
  }

  const origin =
    typeof window === "undefined"
      ? ""
      : new URL(API_BASE, window.location.origin).origin;
  const sampleBody =
    api.method === "GET"
      ? ""
      : ` \\
  -H "Content-Type: application/json" \\
  -d '{"sample": true}'`;
  const sampleResponse = JSON.stringify(
    api.dummyResponse || { message: "Dummy API response" },
    null,
    2,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${api.title} Docs`}
        action={
          <Link
            href={ROUTES.marketplace}
            className="rounded-[var(--radius-sm)] border border-[rgba(79,142,255,0.3)] bg-[var(--accent-dim)] px-3 py-2 text-[13px] font-semibold text-[var(--accent)] transition hover:bg-[rgba(79,142,255,0.18)]"
          >
            Back to Marketplace
          </Link>
        }
      />
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <MethodBadge method={api.method} />
          <code className="rounded bg-[rgba(0,0,0,0.3)] px-2 py-1 text-xs text-[#7eb8ff]">
            /v1/{api.slug}
          </code>
        </div>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {api.description || "No description provided."}
        </p>
      </Card>
      <Card title="Sample request">
        <pre className="overflow-x-auto rounded-[var(--radius-sm)] bg-[rgba(0,0,0,0.28)] p-4 text-xs text-[var(--text)]">
          <code>{`curl -X ${api.method} "${origin}/v1/${api.slug}" \\
  -H "x-api-key: YOUR_API_KEY"${sampleBody}`}</code>
        </pre>
      </Card>
      <Card title="Sample response">
        <pre className="overflow-x-auto rounded-[var(--radius-sm)] bg-[rgba(0,0,0,0.28)] p-4 text-xs text-[var(--text)]">
          <code>{sampleResponse}</code>
        </pre>
      </Card>
    </div>
  );
}
