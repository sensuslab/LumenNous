import { Children, type JSX, type ReactNode } from "react";

/**
 * Chip (design.md §6.6 CategoryPicker, §6.13 SourceBadge, §6.14 TraditionLabel,
 * §6.25 FilterChipGroup).
 *
 * kind="filter"  — pill (`--r-pill`) glass chip, `--t-label`; selected state
 *                  uses a tinted hairline + 6% tint fill + tinted text.
 * kind="source"  — mono 10px uppercase classification chip (`--r-xs`), the
 *                  SourceBadge contract. Meaning is carried by the prefix
 *                  text, never by colour alone (WCAG §5.7).
 *
 * Classification map (content layer prefixes):
 *   HIST historical text · MOD modern interpretation · PRAC practitioner
 *   tradition · RES research · EXP experiential/practitioner claim ·
 *   EDIT LumenNous editorial
 */

export type ChipTone = "neutral" | "gold" | "violet" | "blue" | "warn" | "pearl";
export type ChipClassification = "HIST" | "MOD" | "PRAC" | "RES" | "EXP" | "EDIT";

const CLASSIFICATION_TONE: Record<ChipClassification, ChipTone> = {
  HIST: "gold",
  MOD: "violet",
  PRAC: "pearl",
  RES: "blue",
  EXP: "warn",
  EDIT: "neutral",
};

/* Border + text tints per tone. Text tones all pass AA on --bg-1 (§2.3/§2.4). */
const TONE_CLASSES: Record<ChipTone, { base: string; selected: string }> = {
  neutral: {
    base: "border-line-subtle text-ink-muted",
    selected: "border-line text-ink-strong bg-[rgba(230,225,211,0.06)]",
  },
  gold: {
    base: "border-[rgba(217,186,133,0.3)] text-gold",
    selected: "border-line-strong text-gold bg-[rgba(217,186,133,0.06)]",
  },
  violet: {
    base: "border-[rgba(167,155,232,0.3)] text-violet",
    selected: "border-[rgba(167,155,232,0.45)] text-violet bg-[rgba(167,155,232,0.06)]",
  },
  blue: {
    base: "border-[rgba(143,176,234,0.3)] text-blue",
    selected: "border-[rgba(143,176,234,0.4)] text-blue bg-[rgba(143,176,234,0.06)]",
  },
  warn: {
    base: "border-[rgba(229,192,123,0.35)] text-warn",
    selected: "border-[rgba(229,192,123,0.5)] text-warn bg-[rgba(229,192,123,0.06)]",
  },
  pearl: {
    base: "border-line text-ink",
    selected: "border-[rgba(230,225,211,0.35)] text-ink-strong bg-[rgba(230,225,211,0.06)]",
  },
};

export interface ChipProps {
  children: ReactNode;
  /** Visual contract: interactive pill ("filter") or classification badge ("source"). */
  kind?: "filter" | "source";
  tone?: ChipTone;
  /** SourceBadge prefix — sets the tone automatically and uppercases. */
  classification?: ChipClassification;
  selected?: boolean;
  className?: string;
}

export function Chip({
  children,
  kind = "filter",
  tone,
  classification,
  selected = false,
  className = "",
}: ChipProps): JSX.Element {
  const resolvedTone = classification ? CLASSIFICATION_TONE[classification] : (tone ?? "neutral");
  const tones = TONE_CLASSES[resolvedTone];
  const childParts = classification ? Children.toArray(children) : [];
  const textBody =
    childParts.length > 0 &&
    childParts.every((part) => typeof part === "string" || typeof part === "number")
      ? childParts.join("").trim()
      : null;
  const classificationBody =
    classification && textBody !== null
      ? textBody
          .trim()
          .replace(new RegExp(`^${classification}(?:\\s*·\\s*)?`), "")
          .trim()
      : children;
  const hasClassificationBody =
    classificationBody !== null &&
    classificationBody !== undefined &&
    classificationBody !== false &&
    classificationBody !== "";

  const base =
    "inline-flex items-center gap-1.5 border whitespace-nowrap transition-colors duration-200 ease-std";
  const geometry =
    kind === "filter"
      ? "min-h-11 rounded-pill px-3.5 py-2 t-label"
      : "rounded-xs px-1.5 py-0.5 font-mono text-[0.625rem] leading-4 tracking-[0.08em] uppercase";
  /* Source badges rest at the tinted-hairline base state (TraditionLabel
     contract); filter chips gain the 6% fill only when selected. */
  const state = selected ? tones.selected : tones.base;

  return (
    <span className={`${base} ${geometry} ${state} ${className}`} data-tone={resolvedTone}>
      {classification ? <span>{classification}</span> : null}
      {classification && hasClassificationBody ? <span aria-hidden="true">·</span> : null}
      {hasClassificationBody ? classificationBody : null}
    </span>
  );
}
