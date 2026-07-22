"use client";

import type { JSX } from "react";
import type { Category } from "@/lib/schemas";
import { Chip } from "@/components/ui/Chip";

/**
 * CategoryPicker (design.md §6.6) — horizontal pill group for filtering by
 * category. Single-select with an implicit "All" state (null).
 */

export function CategoryPicker({
  categories,
  selected,
  onSelect,
  className = "",
}: {
  categories: readonly Category[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
  className?: string;
}): JSX.Element {
  return (
    <div
      role="group"
      aria-label="Filter by category"
      className={`flex flex-wrap gap-2 ${className}`}
    >
      <button type="button" onClick={() => onSelect(null)} aria-pressed={selected === null}>
        <Chip kind="filter" tone="gold" selected={selected === null}>
          All
        </Chip>
      </button>
      {categories.map((category) => (
        <button
          key={category.slug}
          type="button"
          onClick={() => onSelect(category.slug === selected ? null : category.slug)}
          aria-pressed={selected === category.slug}
        >
          <Chip kind="filter" tone="neutral" selected={selected === category.slug}>
            {category.name}
          </Chip>
        </button>
      ))}
    </div>
  );
}
