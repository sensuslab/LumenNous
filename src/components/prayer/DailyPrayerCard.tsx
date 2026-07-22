"use client";

import { useState, type JSX } from "react";
import type { Category, Prayer } from "@/lib/schemas";
import { getAnotherItem } from "@/lib/daily";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { OrbitMark } from "@/components/celestial/OrbitMark";
import { TraditionLabelGroup } from "./TraditionLabel";
import { FavouriteButton } from "./FavouriteButton";
import { ShareButton, CopyButton } from "./ShareButton";

/**
 * DailyPrayerCard (design.md §6.3 + today.md §3) — the hero of the Today
 * screen. Server hands in the deterministic daily prayer; "Another from the
 * Library" swaps client-side without ever immediately repeating, and always
 * carries the honest "not divination" microcopy.
 */

const TIME_OF_DAY_LABEL: Record<Prayer["timeOfDay"], string> = {
  morning: "Morning",
  evening: "Evening",
  any: "Any time",
  "seasonal-aware": "Seasonal",
};

export function DailyPrayerCard({
  initialPrayer,
  category,
  practiceHref,
  poolSize,
  whyNote,
  headingLevel = "h1",
  className = "",
}: {
  initialPrayer: Prayer;
  category: Category | undefined;
  practiceHref: string | null;
  poolSize: number;
  /** Editorial "Why this practice?" note assembled on the server. */
  whyNote: string;
  headingLevel?: "h1" | "h2";
  className?: string;
}): JSX.Element {
  const [prayer, setPrayer] = useState(initialPrayer);
  const [expanded, setExpanded] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [swapping, setSwapping] = useState(false);

  const isLong = prayer.body.length > 480;
  const shownBody = expanded || !isLong ? prayer.body : `${prayer.body.slice(0, 480).trimEnd()}…`;

  function handleAnother(): void {
    if (swapping) return;
    setSwapping(true);
    window.setTimeout(() => {
      const next = getAnotherItem(prayer.id);
      if (next) setPrayer(next);
      setExpanded(false);
      setSwapping(false);
    }, 180);
  }

  const fullText = `${prayer.opening}\n\n${prayer.body}\n\n${prayer.closing}`;
  const Title = headingLevel;

  return (
    <GlassCard hero className={`relative overflow-hidden ${className}`}>
      <OrbitMark
        size={280}
        className="pointer-events-none absolute -right-20 -top-20 opacity-[0.06]"
      />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="t-eyebrow text-gold">Today&apos;s prayer</p>
          <TraditionLabelGroup labels={prayer.traditionLabels} />
        </div>

        {category ? (
          <p className="t-meta mt-3 uppercase tracking-wider text-ink-muted">{category.name}</p>
        ) : null}

        <Title className="t-h1 mt-2 text-ink-strong">{prayer.title}</Title>

        <div className="t-prayer mt-6 max-w-[34ch] text-ink-strong">
          <p className="italic">{prayer.opening}</p>
          <p className="mt-4">{shownBody}</p>
          {isLong ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="t-body-sm mt-3 font-sans font-medium text-ink-muted underline-offset-4 hover:text-ink-strong hover:underline"
            >
              {expanded ? "Show less" : "Read in full"}
            </button>
          ) : null}
          <p className="mt-4">{prayer.closing}</p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="t-meta inline-flex items-center gap-1.5 rounded-xs border border-line-subtle px-2 py-1 text-ink-faint">
            <Icon name="timer" className="h-3.5 w-3.5" aria-hidden="true" />
            About {prayer.practiceDuration} minutes
          </span>
          <span className="t-meta inline-flex items-center gap-1.5 rounded-xs border border-line-subtle px-2 py-1 text-ink-faint">
            <Icon name="sun-arc" className="h-3.5 w-3.5" aria-hidden="true" />
            {TIME_OF_DAY_LABEL[prayer.timeOfDay]}
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          {practiceHref ? (
            <Button variant="primary" href={practiceHref}>
              Begin practice
            </Button>
          ) : null}
          <Button variant="secondary" onClick={handleAnother} disabled={swapping}>
            Another from the library
          </Button>
          <div className="flex items-center gap-1.5 sm:ml-auto">
            <FavouriteButton
              item={{
                id: prayer.id,
                type: "prayer",
                title: prayer.title,
                href: category ? `/explore/${category.slug}` : "/",
                addedAt: new Date().toISOString(),
              }}
            />
            <ShareButton title={prayer.title} text={fullText} />
            <CopyButton text={fullText} label="Copy prayer text" />
          </div>
        </div>

        <p className="t-meta mt-3 text-ink-faint" aria-live="polite">
          Drawn from {poolSize} library prayers — not divination, just variety.
        </p>

        <div className="mt-6 border-t border-line-subtle pt-4">
          <button
            type="button"
            aria-expanded={whyOpen}
            onClick={() => setWhyOpen((v) => !v)}
            className="inline-flex min-h-11 items-center gap-2 font-sans text-[0.9375rem] font-medium text-ink-muted transition-colors duration-200 ease-std hover:text-ink-strong"
          >
            Why this practice?
            <Icon
              name="chevron-down"
              className={`h-4 w-4 transition-transform duration-200 ease-std ${whyOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
          {whyOpen ? (
            <p className="t-body-sm mt-1 max-w-[52ch] text-ink-muted">{whyNote}</p>
          ) : null}
        </div>

        <p className="t-meta mt-4 text-[10px] text-ink-faint">
          Chosen from the curated library for today&apos;s date. Not a message
          from beyond — just a good prayer, steadily offered.
        </p>
      </div>
    </GlassCard>
  );
}
