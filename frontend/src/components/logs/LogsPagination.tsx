"use client";

import { LOGS_LABELS } from "@/constants";
import { Button } from "@/components/ui/Button";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function LogsPagination({ page, totalPages, onPageChange }: Props) {
  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <span>
        Page {page} of {totalPages || 1}
      </span>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          {LOGS_LABELS.prev}
        </Button>
        <Button
          variant="secondary"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          {LOGS_LABELS.next}
        </Button>
      </div>
    </div>
  );
}
