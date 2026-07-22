"use client";

import type { JSX } from "react";
import { Chip } from "@/components/ui/Chip";

/**
 * IntentionPicker (design.md §6.7) — intention chips ("I need…") that filter
 * content by the intentions declared in category data.
 */

export function IntentionPicker({
  intentions,
  selected,
  onSelect,
  className = "",
}: {
  intentions: readonly string[];
  selected: string | null;
  onSelect: (intention: string | null) => void;
  className?: string;
}): JSX.Element {
  return (
    <div
      role="group"
      aria-label="Filter by intention"
      className={`flex flex-wrap gap-2 ${className}`}
    >
      {intentions.map((intention) => (
        <button
          key={intention}
          type="button"
          onClick={() => onSelect(intention === selected ? null : intention)}
          aria-pressed={selected === intention}
        >
          <Chip kind="filter" tone="violet" selected={selected === intention}>
            {intention}
          </Chip>
        </button>
      ))}
    </div>
  );
}
