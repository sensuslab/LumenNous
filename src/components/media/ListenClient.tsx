"use client";

import { useState, type JSX } from "react";
import type { AudioItem } from "@/lib/schemas";
import { Chip } from "@/components/ui/Chip";
import { AudioCard } from "./AudioCard";

/**
 * ListenClient (listen.md §3+6) — filter deck over the curated audio
 * library. Filters combine AND across groups, OR within multi groups.
 * Results announced via polite live region. No autoplay anywhere.
 */

type DurationBucket = "under-10" | "10-30" | "30-60" | "over-60";
type Voice = "vocal" | "instrumental" | "spoken";

const DURATIONS: { id: DurationBucket; label: string; match: (seconds: number) => boolean }[] = [
  { id: "under-10", label: "Under 10 min", match: (s) => s > 0 && s < 600 },
  { id: "10-30", label: "10–30 min", match: (s) => s >= 600 && s < 1800 },
  { id: "30-60", label: "30–60 min", match: (s) => s >= 1800 && s < 3600 },
  { id: "over-60", label: "Over an hour", match: (s) => s >= 3600 },
];

const VOICES: { id: Voice; label: string; keywords: string[] }[] = [
  { id: "vocal", label: "Vocal", keywords: ["vocal", "chant", "choral", "hymn", "song"] },
  { id: "instrumental", label: "Instrumental", keywords: ["instrumental", "ambient", "drone", "piano", "strings", "bowls", "flute"] },
  { id: "spoken", label: "Spoken word", keywords: ["spoken", "recitation", "reading", "lectio", "psalm"] },
];

const PLATFORMS: { id: AudioItem["platform"]; label: string }[] = [
  { id: "spotify", label: "Spotify" },
  { id: "youtube", label: "YouTube" },
  { id: "apple-music", label: "Apple Music" },
  { id: "web", label: "Web" },
];

function voiceMatches(item: AudioItem, voice: Voice): boolean {
  const haystack = `${item.genre} ${item.title} ${item.intendedUses.join(" ")}`.toLowerCase();
  const entry = VOICES.find((v) => v.id === voice);
  return entry ? entry.keywords.some((keyword) => haystack.includes(keyword)) : true;
}

export function ListenClient({
  items,
  purposes,
}: {
  items: readonly AudioItem[];
  /** Purpose filter labels derived from playlist groupings. */
  purposes: readonly string[];
}): JSX.Element {
  const [purpose, setPurpose] = useState<string | null>(null);
  const [duration, setDuration] = useState<DurationBucket | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [platforms, setPlatforms] = useState<AudioItem["platform"][]>([]);

  const anyActive = purpose !== null || duration !== null || voices.length > 0 || platforms.length > 0;

  const filtered = items.filter((item) => {
    if (purpose) {
      const haystack = item.intendedUses.join(" ").toLowerCase();
      if (!haystack.includes(purpose.toLowerCase().replace(/-/g, " "))) return false;
    }
    if (duration) {
      const bucket = DURATIONS.find((d) => d.id === duration);
      if (bucket && !bucket.match(item.duration)) return false;
    }
    if (voices.length > 0 && !voices.some((voice) => voiceMatches(item, voice))) return false;
    if (platforms.length > 0 && !platforms.includes(item.platform)) return false;
    return true;
  });

  function toggleVoice(voice: Voice): void {
    setVoices((current) => (current.includes(voice) ? current.filter((v) => v !== voice) : [...current, voice]));
  }
  function togglePlatform(platform: AudioItem["platform"]): void {
    setPlatforms((current) =>
      current.includes(platform) ? current.filter((p) => p !== platform) : [...current, platform],
    );
  }
  function reset(): void {
    setPurpose(null);
    setDuration(null);
    setVoices([]);
    setPlatforms([]);
  }

  return (
    <>
      <section aria-label="Filter listening" className="glass mt-8 rounded-md p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="t-eyebrow text-ink-faint">Filters</p>
          <p aria-live="polite" className="t-meta text-ink-faint">
            {filtered.length} {filtered.length === 1 ? "result" : "results"}
            {anyActive ? (
              <button
                type="button"
                onClick={reset}
                className="ml-3 inline-flex min-h-11 items-center font-sans font-medium text-ink-muted underline-offset-4 hover:text-ink-strong hover:underline"
              >
                Reset all
              </button>
            ) : null}
          </p>
        </div>

        <div className="mt-4 space-y-5">
          <div>
            <p className="t-meta mb-2 uppercase tracking-wider text-ink-faint">Purpose</p>
            <div role="group" aria-label="Filter by purpose" className="flex flex-wrap gap-2">
              {purposes.map((label) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={purpose === label}
                  onClick={() => setPurpose((current) => (current === label ? null : label))}
                >
                  <Chip kind="filter" tone="blue" selected={purpose === label}>
                    {label}
                  </Chip>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-line-subtle pt-4">
            <p className="t-meta mb-2 uppercase tracking-wider text-ink-faint">Duration</p>
            <div role="group" aria-label="Filter by duration" className="flex flex-wrap gap-2">
              {DURATIONS.map((bucket) => (
                <button
                  key={bucket.id}
                  type="button"
                  aria-pressed={duration === bucket.id}
                  onClick={() => setDuration((current) => (current === bucket.id ? null : bucket.id))}
                >
                  <Chip kind="filter" tone="neutral" selected={duration === bucket.id}>
                    {bucket.label}
                  </Chip>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-line-subtle pt-4">
            <p className="t-meta mb-2 uppercase tracking-wider text-ink-faint">Voice</p>
            <div role="group" aria-label="Filter by voice type" className="flex flex-wrap gap-2">
              {VOICES.map((voice) => (
                <button
                  key={voice.id}
                  type="button"
                  aria-pressed={voices.includes(voice.id)}
                  onClick={() => toggleVoice(voice.id)}
                >
                  <Chip kind="filter" tone="neutral" selected={voices.includes(voice.id)}>
                    {voice.label}
                  </Chip>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-line-subtle pt-4">
            <p className="t-meta mb-2 uppercase tracking-wider text-ink-faint">Platform</p>
            <div role="group" aria-label="Filter by platform" className="flex flex-wrap gap-2">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  type="button"
                  aria-pressed={platforms.includes(platform.id)}
                  onClick={() => togglePlatform(platform.id)}
                >
                  <Chip kind="filter" tone="neutral" selected={platforms.includes(platform.id)}>
                    {platform.label}
                  </Chip>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Audio library" className="mt-8">
        <div className="space-y-4">
          {filtered.map((item) => (
            <AudioCard key={item.id} item={item} />
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="t-body mt-6 text-ink-muted">
            Nothing matches those filters yet — the library is still growing.
          </p>
        ) : null}
      </section>
    </>
  );
}
