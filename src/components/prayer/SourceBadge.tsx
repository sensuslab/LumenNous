import type { JSX } from "react";
import type { ClaimClassification, Source } from "@/lib/schemas";
import { Chip, type ChipClassification } from "@/components/ui/Chip";

/**
 * SourceBadge (design.md §6.13) — compact provenance chip for a Source.
 * Classification prefixes: HIST historical text · MOD modern interpretation ·
 * PRAC practitioner tradition · RES research · EXP experiential claim ·
 * EDIT LumenNous editorial.
 */

const CLAIM_TO_CHIP: Record<ClaimClassification, { classification: ChipClassification; text: string }> = {
  "historical-teaching": { classification: "HIST", text: "Historical text" },
  "modern-interpretation": { classification: "MOD", text: "Modern interpretation" },
  symbolic: { classification: "MOD", text: "Symbolic" },
  "traditional-symbolic-use": { classification: "PRAC", text: "Traditional / symbolic use" },
  "experiential-claim": { classification: "EXP", text: "Experiential claim" },
  "preliminary-research": { classification: "RES", text: "Preliminary research" },
  "no-established-clinical-evidence": { classification: "EXP", text: "No established clinical evidence" },
};

export function classificationChip(claim: ClaimClassification): {
  classification: ChipClassification;
  text: string;
} {
  return CLAIM_TO_CHIP[claim];
}

export function SourceBadge({
  source,
  className = "",
}: {
  source: Source;
  className?: string;
}): JSX.Element {
  const mapped = CLAIM_TO_CHIP[source.claimClassification];
  const label = `${mapped.classification} · ${source.title}`;
  const chip = (
    <Chip kind="source" classification={mapped.classification} className={className}>
      {label}
    </Chip>
  );
  if (source.url) {
    return (
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex rounded-xs focus-visible:outline-none"
        aria-label={`Source: ${source.title} (${mapped.text}) — opens in a new tab`}
      >
        {chip}
      </a>
    );
  }
  return chip;
}
