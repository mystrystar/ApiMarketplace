"use client";

import { useState } from "react";
import { DASHBOARD_LABELS } from "@/constants";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Props = {
  apiKey: string;
  onRegenerate: () => Promise<void>;
};

export function ApiKeyPanel({ apiKey, onRegenerate }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleRegenerate() {
    setLoading(true);
    try {
      await onRegenerate();
    } finally {
      setLoading(false);
    }
  }

  function copyKey() {
    navigator.clipboard.writeText(apiKey);
  }

  return (
    <Card title={DASHBOARD_LABELS.apiKey}>
      <code className="block break-all rounded bg-gray-100 p-2 text-xs">{apiKey}</code>
      <div className="mt-3 flex gap-2">
        <Button variant="secondary" onClick={copyKey}>
          {DASHBOARD_LABELS.copy}
        </Button>
        <Button variant="secondary" onClick={handleRegenerate} disabled={loading}>
          {DASHBOARD_LABELS.regenerate}
        </Button>
      </div>
    </Card>
  );
}
