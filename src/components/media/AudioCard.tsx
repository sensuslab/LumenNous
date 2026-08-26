import type { JSX } from "react";
import type { AudioItem } from "@/lib/schemas";
import { GlassCard } from "@/components/ui/GlassCard";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { PlatformLinkGroup, platformLabel } from "./PlatformLinkGroup";
import { EmbedGate } from "./EmbedGate";

/**
 * AudioCard (design.md §6.10) — curated listening record. Frequency-based
 * audio always carries its evidence classification chip; nothing autoplays;
 * embeds stay behind the EmbedGate.
 */

interface EvidenceChip {
  classification: "EXP" | "RES" | "PRAC";
  text: string;
}

const EVIDENCE_CHIP: Partial<Record<AudioItem["evidenceClassification"], EvidenceChip>> = {
  "experiential-claim": { classification: "EXP", text: "Experiential / practitioner claim" },
  "preliminary-research": { classification: "RES", text: "Preliminary research" },
  "research-synthesis": { classification: "RES", text: "Research synthesis" },
  "no-established-clinical-evidence": {
    classification: "EXP",
    text: "No established clinical evidence",
  },
  "traditional-symbolic-use": { classification: "PRAC", text: "Traditional / symbolic use" },
};

function formatDuration(seconds: number): string {
  if (!seconds) return "Length varies";
  const minutes = Math.round(seconds / 60);
  return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes} min`;
}

/** Generative cover: deterministic orbital geometry per item id (no raster). */
function CoverArt({ seed, className = "" }: { seed: string; className?: string }): JSX.Element {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const rotate = hash % 360;
  const radius = 8 + (hash % 10);
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-line-subtle bg-bg-2 ${className}`}
    >
      <svg viewBox="0 0 56 56" className="h-full w-full" style={{ transform: `rotate(${rotate}deg)` }}>
        <circle cx="28" cy="28" r="18" fill="none" stroke="rgba(143,176,234,0.35)" strokeWidth="0.75" />
        <circle cx="28" cy="28" r="11" fill="none" stroke="rgba(230,225,211,0.18)" strokeWidth="0.75" strokeDasharray="2 3" />
        <circle cx={28 + radius} cy="28" r="2" fill="#8FB0EA" opacity="0.8" />
        <circle cx="28" cy="28" r="1.4" fill="#E6E1D3" opacity="0.7" />
      </svg>
    </span>
  );
}

export function AudioCard({
  item,
  variant = "full",
  className = "",
}: {
  item: AudioItem;
  /** "compact" = single row for recommendations; "full" = listening library. */
  variant?: "compact" | "full";
  className?: string;
}): JSX.Element {
  const evidence = EVIDENCE_CHIP[item.evidenceClassification];

  if (variant === "compact") {
    return (
      <GlassCard interactive className={`flex items-center gap-4 p-4 ${className}`}>
        <CoverArt seed={item.id} />
        <div className="min-w-0 flex-1">
          <p className="t-body truncate font-sans font-medium text-ink-strong">{item.title}</p>
          <p className="t-meta mt-0.5 text-ink-faint">
            {item.creator} · {formatDuration(item.duration)} · {platformLabel(item.platform)}
          </p>
          {evidence ? (
            <Chip kind="source" classification={evidence.classification} className="mt-2">
              {evidence.text}
            </Chip>
          ) : null}
        </div>
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open “${item.title}” on ${platformLabel(item.platform)} in a new tab`}
            className="glass inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full p-2.5 text-ink-muted transition-colors duration-200 ease-std hover:border-line hover:text-ink-strong"
          >
            <Icon name="arrow-up-right" className="h-5 w-5" aria-hidden="true" />
          </a>
        ) : null}
      </GlassCard>
    );
  }

  return (
    <GlassCard as="article" className={`flex flex-col gap-4 ${className}`}>
      <div className="flex items-start gap-4">
        <CoverArt seed={item.id} />
        <div className="min-w-0 flex-1">
          <h3 className="t-h3 text-ink-strong">{item.title}</h3>
          <p className="t-body-sm mt-1 text-ink-muted">{item.creator}</p>
          <p className="t-meta mt-1 text-ink-faint">
            {item.genre} · {formatDuration(item.duration)} · {item.language}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Chip kind="source" classification="RES">
          {platformLabel(item.platform)}
        </Chip>
        {evidence ? (
          <Chip kind="source" classification={evidence.classification}>
            {evidence.text}
          </Chip>
        ) : null}
      </div>

      <p className="t-body-sm text-ink-muted">
        Intended for: {item.intendedUses.join(", ")}.
      </p>

      {item.embedUrl ? (
        <EmbedGate
          embedUrl={item.embedUrl}
          externalUrl={item.url}
          title={item.title}
          platform={platformLabel(item.platform)}
        />
      ) : (
        <PlatformLinkGroup item={item} />
      )}

      <p className="t-meta text-ink-faint">
        Link last verified {item.lastVerified}.
        {item.rightsNotes ? ` ${item.rightsNotes}` : ""}
      </p>
    </GlassCard>
  );
}
