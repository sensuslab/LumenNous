"use client";

import { useMemo, useState, type JSX } from "react";
import type { MusicFamily, MusicRegisterItem } from "@/data/music-register";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";

const FAMILY_LABELS: Record<MusicFamily, string> = {
  CHANT: "Sacred chant",
  AMBIENT: "Ambient & piano",
  NATURE: "Nature",
  HZ: "Tuned frequencies",
  BINAURAL: "Binaural",
  SINGING: "Singing bowls",
  CHAKRA: "Chakra-labelled",
  DNA: "DNA-labelled",
  SOLFEGGIO: "Solfeggio",
  GUIDED: "Guided prayer",
};

const EVIDENCE_LABELS: Record<MusicRegisterItem["evidenceLabel"], string> = {
  TRADITIONAL_PRACTICE: "Traditional practice",
  EXPERIENTIAL_CLAIM: "Experiential claim",
  SCIENTIFIC_EVIDENCE: "Research-aligned format",
  PRELIMINARY_EVIDENCE: "Preliminary evidence",
  COMMERCIALLY_POPULAR_BUT_UNSUBSTANTIATED: "Unsubstantiated claim",
  CONTRADICTED_OR_MISLEADING: "Contradicted or misleading",
};

function formatDuration(seconds: number | null): string {
  if (seconds === null) return "Length unavailable";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = seconds % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`
    : `${minutes}:${String(remaining).padStart(2, "0")}`;
}

function canPlay(item: MusicRegisterItem): boolean {
  return (
    item.playbackMode === "embed" &&
    item.readinessState !== "blocked" &&
    item.claimRisk !== "blocked"
  );
}

function reviewLabel(item: MusicRegisterItem): string {
  if (item.readinessState === "ready_for_editorial_review") return "Reviewed";
  return item.readinessState
    .replace(/^needs_/, "Needs ")
    .replaceAll("_", " ");
}

export function MusicRegisterExplorer({
  items,
  frequencies,
}: {
  items: readonly MusicRegisterItem[];
  frequencies: readonly number[];
}): JSX.Element {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<MusicFamily | null>(null);
  const [frequency, setFrequency] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const reviewedItems = useMemo(
    () =>
      items.filter(
        (item) => item.readinessState !== "blocked" && item.claimRisk !== "blocked",
      ),
    [items],
  );
  const families = useMemo(
    () => [...new Set(reviewedItems.map((item) => item.family))],
    [reviewedItems],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return reviewedItems.filter((item) => {
      if (family && item.family !== family) return false;
      if (frequency && !item.frequenciesHz.includes(frequency)) return false;
      if (!needle) return true;
      const haystack = [
        item.id,
        item.title,
        item.channel,
        item.traditionGenre,
        item.playlistFit,
        item.language,
        item.intendedCategories.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [family, frequency, query, reviewedItems]);

  const playableCount = reviewedItems.filter(canPlay).length;
  const minFrequency = frequencies[0] ?? 0;
  const maxFrequency = frequencies.at(-1) ?? 1;
  const logMin = Math.log(minFrequency || 1);
  const logSpan = Math.log(maxFrequency || 1) - logMin || 1;

  function reset(): void {
    setQuery("");
    setFamily(null);
    setFrequency(null);
  }

  return (
    <section aria-labelledby="full-register-title" className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line-subtle pb-4">
        <div>
          <p className="t-eyebrow text-blue">Public review complete</p>
          <h2 id="full-register-title" className="t-h2 mt-2 text-ink-strong">
            Reviewed listening
          </h2>
        </div>
        <p className="t-meta text-ink-faint">
          {reviewedItems.length} selections · {playableCount} playable here
        </p>
      </div>

      <div className="mt-6 border-b border-line-subtle pb-7">
        <div className="relative">
          <Icon
            name="search"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
            aria-hidden="true"
          />
          <label htmlFor="music-search" className="sr-only">
            Search reviewed listening
          </label>
          <input
            id="music-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, channel, genre or category"
            className="min-h-12 w-full rounded-sm border border-line-subtle bg-[rgba(230,225,211,0.03)] py-3 pl-11 pr-4 font-sans text-base text-ink-strong outline-none placeholder:text-ink-faint focus:border-blue"
          />
        </div>

        <div className="mt-5">
          <p className="t-meta mb-2 uppercase text-ink-faint">Family</p>
          <div role="group" aria-label="Filter by music family" className="flex flex-wrap gap-2">
            {families.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={family === value}
                onClick={() => setFamily((current) => (current === value ? null : value))}
              >
                <Chip selected={family === value} tone="blue">
                  {FAMILY_LABELS[value]}
                </Chip>
              </button>
            ))}
          </div>
        </div>

        {frequencies.length > 0 ? (
          <div className="mt-6 border-t border-line-subtle pt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="t-meta uppercase text-ink-faint">Pitch labels</p>
              <p className="t-meta text-ink-faint">Register labels, not health claims</p>
            </div>
            <div className="relative mt-4 h-8" aria-hidden="true">
              <div className="absolute left-0 right-0 top-1/2 h-px bg-line" />
              {frequencies.map((value) => {
                const left = ((Math.log(value) - logMin) / logSpan) * 100;
                return (
                  <span
                    key={value}
                    className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue bg-bg-1"
                    style={{ left: `${left}%` }}
                  />
                );
              })}
            </div>
            <div role="group" aria-label="Filter by pitch label" className="flex flex-wrap gap-2">
              {frequencies.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={frequency === value}
                  onClick={() => setFrequency((current) => (current === value ? null : value))}
                >
                  <Chip selected={frequency === value} tone="violet">
                    {value} Hz
                  </Chip>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center justify-end gap-3 border-t border-line-subtle pt-5">
          <p aria-live="polite" className="t-meta text-ink-faint">
            {filtered.length} {filtered.length === 1 ? "result" : "results"}
            {query || family || frequency ? (
              <button
                type="button"
                onClick={reset}
                className="ml-3 min-h-11 font-sans font-medium text-ink-muted underline-offset-4 hover:text-ink-strong hover:underline"
              >
                Reset
              </button>
            ) : null}
          </p>
        </div>
      </div>

      <div aria-label="Reviewed music selections">
        {filtered.map((item) => {
          const playable = canPlay(item);
          const active = activeId === item.id;
          return (
            <article key={item.id} className="border-b border-line-subtle py-6">
              <div className="flex items-start gap-4">
                <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-subtle text-blue sm:flex">
                  <Icon name={item.family === "GUIDED" ? "breath" : "waveform"} className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-mono text-[0.6875rem] text-ink-faint">{item.id}</span>
                    <span className="text-ink-faint" aria-hidden="true">·</span>
                    <span className="t-meta text-ink-muted">{FAMILY_LABELS[item.family]}</span>
                    <span className="text-ink-faint" aria-hidden="true">·</span>
                    <span className="t-meta text-ink-muted">
                      {formatDuration(item.durationSeconds)}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-lg leading-snug text-ink-strong">{item.title}</h3>
                  <p className="t-body-sm mt-1 text-ink-muted">{item.channel}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Chip kind="source" tone="blue">{reviewLabel(item)}</Chip>
                    <Chip kind="source" tone="neutral">
                      {EVIDENCE_LABELS[item.evidenceLabel]}
                    </Chip>
                    {item.frequenciesHz.map((value) => (
                      <Chip key={value} kind="source" tone="violet">
                        {value} Hz
                      </Chip>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {playable ? (
                      <button
                        type="button"
                        aria-expanded={active}
                        onClick={() => setActiveId((current) => (current === item.id ? null : item.id))}
                        className="glass inline-flex min-h-11 items-center gap-2 rounded-sm px-4 py-2 font-sans text-sm font-semibold text-ink-strong hover:border-line"
                      >
                        <Icon name={active ? "x" : "play"} className="h-4 w-4" aria-hidden="true" />
                        {active ? "Close player" : "Play here"}
                      </button>
                    ) : item.playbackMode === "link" ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="glass inline-flex min-h-11 items-center gap-2 rounded-sm px-4 py-2 font-sans text-sm font-semibold text-ink-strong hover:border-line"
                      >
                        <Icon name="arrow-up-right" className="h-4 w-4" aria-hidden="true" />
                        Open on YouTube
                      </a>
                    ) : (
                      <span className="inline-flex min-h-11 items-center font-sans text-sm text-ink-faint">
                        Playback unavailable
                      </span>
                    )}
                    <span className="t-meta text-ink-faint">{item.playlistFit}</span>
                  </div>
                </div>
              </div>

              {active && playable ? (
                <div className="mt-5 overflow-hidden rounded-sm border border-line-subtle bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=1&playsinline=1&rel=0`}
                    title={`${item.title} — YouTube player`}
                    className="aspect-video min-h-[200px] w-full"
                    loading="lazy"
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write"
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="t-body py-8 text-ink-muted">No reviewed selections match those filters.</p>
      ) : null}
    </section>
  );
}
