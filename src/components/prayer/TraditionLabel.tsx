import type { JSX } from "react";
import type { TraditionLabel as TraditionLabelValue } from "@/lib/schemas";
import { Chip, type ChipClassification } from "@/components/ui/Chip";

/**
 * TraditionLabel (design.md §6.14) — distinguishes historical teaching from
 * modern interpretation and original composition (brief principle 8).
 * Meaning is carried by the prefix text, never by colour alone.
 */

const LABEL_MAP: Record<TraditionLabelValue, { classification: ChipClassification; text: string }> = {
  "historical-teaching": { classification: "HIST", text: "Historical teaching" },
  "modern-interpretation": { classification: "MOD", text: "Modern interpretation" },
  "symbolic-language": { classification: "MOD", text: "Symbolic language" },
  "shared-tradition": { classification: "PRAC", text: "Shared tradition" },
  "original-composition": { classification: "EDIT", text: "Original composition" },
};

export function TraditionLabel({
  label,
  className = "",
}: {
  label: TraditionLabelValue;
  className?: string;
}): JSX.Element {
  const mapped = LABEL_MAP[label];
  return (
    <Chip kind="source" classification={mapped.classification} className={className}>
      {mapped.classification} · {mapped.text}
    </Chip>
  );
}

export function TraditionLabelGroup({
  labels,
  className = "",
}: {
  labels: readonly TraditionLabelValue[];
  className?: string;
}): JSX.Element {
  return (
    <span className={`inline-flex flex-wrap items-center gap-1.5 ${className}`}>
      {labels.map((label) => (
        <TraditionLabel key={label} label={label} />
      ))}
    </span>
  );
}
