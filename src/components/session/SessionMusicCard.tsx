import type { JSX } from "react";
import type { MusicRegisterItem } from "@/data/music-register";
import { Chip } from "@/components/ui/Chip";
import { EmbedGate } from "@/components/media/EmbedGate";

const EVIDENCE_LABEL: Record<MusicRegisterItem["evidenceLabel"], string> = {
  TRADITIONAL_PRACTICE: "Traditional practice",
  EXPERIENTIAL_CLAIM: "Experiential use",
  SCIENTIFIC_EVIDENCE: "Research-aligned format",
  PRELIMINARY_EVIDENCE: "Preliminary evidence",
  COMMERCIALLY_POPULAR_BUT_UNSUBSTANTIATED: "Unsubstantiated claim",
  CONTRADICTED_OR_MISLEADING: "Contradicted or misleading claim",
};

export function SessionMusicCard({
  item,
}: {
  item: MusicRegisterItem;
}): JSX.Element {
  return (
    <article className="glass rounded-md p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="t-h3 text-ink-strong">{item.title}</h3>
          <p className="t-body-sm mt-1 text-ink-muted">
            {item.channel} · {item.traditionGenre}
          </p>
        </div>
        <Chip
          kind="source"
          classification={
            item.evidenceLabel === "TRADITIONAL_PRACTICE" ? "PRAC" : "RES"
          }
        >
          {EVIDENCE_LABEL[item.evidenceLabel]}
        </Chip>
      </div>
      <p className="t-body-sm mt-3 text-ink-muted">
        {item.descriptionSummary}
      </p>
      <EmbedGate
        embedUrl={`https://www.youtube-nocookie.com/embed/${item.youtubeId}`}
        externalUrl={item.url}
        title={item.title}
        platform="YouTube"
        className="mt-4"
      />
      <p className="t-meta mt-3 text-ink-faint">
        Evidence describes the listening format or tradition, not a proven
        therapeutic effect of this particular video.
      </p>
    </article>
  );
}
