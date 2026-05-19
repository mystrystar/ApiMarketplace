"use client";

import { MARKETPLACE_LABELS } from "@/constants";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

type Props = {
  search: string;
  category: string;
  categories: string[];
  onSearchChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
};

export function ApiFilters({
  search,
  category,
  categories,
  onSearchChange,
  onCategoryChange,
}: Props) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <Input
        label={MARKETPLACE_LABELS.search}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by name..."
        className="sm:flex-1"
      />
      <div className="sm:w-[200px]">
      <Select
        label={MARKETPLACE_LABELS.category}
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        options={[
          { value: "", label: MARKETPLACE_LABELS.allCategories },
          ...categories.map((c) => ({ value: c, label: c })),
        ]}
      />
      </div>
    </div>
  );
}
