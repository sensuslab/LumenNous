import Link from "next/link";
import type { JSX } from "react";
import type { Prayer } from "@/lib/schemas";
import {
  getAudioById,
  getCategoryById,
  getPracticesByCategory,
  listPrayers,
} from "@/lib/content";
import { getDailyItem } from "@/lib/daily";
import { DailyPrayerCard } from "@/components/prayer/DailyPrayerCard";
import { GreetingBlock } from "@/components/prayer/GreetingBlock";
import { AudioCard } from "@/components/media/AudioCard";
import { Divider } from "@/components/ui/Divider";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";
import { LocalSessionSuggestion } from "@/components/session/LocalSessionSuggestion";

/**
 * Today — `/` (today.md). The heart of the app: a complete, beautiful prayer
 * within seconds. No account, no onboarding wall, no form.
 * Server-rendered deterministic daily selection; interactions are islands.
 */

/* Static fallback — the route can never render blank (today.md §behaviors). */
const FALLBACK_PRAYER: Prayer = {
  id: "fallback-be-still",
  title: "Be Still",
  categoryIds: [],
  traditionLabels: ["original-composition"],
  content:
    "Be still. Whatever this day holds, you meet it one breath at a time. Nothing is asked of you here except presence. So it is.",
  opening: "Be still.",
  body: "Whatever this day holds, you meet it one breath at a time. Nothing is asked of you here except presence.",
  closing: "So it is.",
  affirmation: "I am here, and that is enough for this moment.",
  practiceDuration: 3,
  practiceSteps: [
    "Sit comfortably and let your shoulders drop.",
    "Take three slow breaths, in through the nose, out through the mouth.",
    "Rest a moment in the quiet before continuing your day.",
  ],
  reflectionPromptIds: [],
  sourceIds: [],
  audioIds: [],
  tags: ["fallback", "offline"],
  timeOfDay: "any",
  editorialStatus: "draft",
  safetyNotes: "",
};

export default function TodayPage(): JSX.Element {
  const now = new Date();
  const daily = getDailyItem(now) ?? FALLBACK_PRAYER;
  const category = daily.categoryIds.length > 0 ? getCategoryById(daily.categoryIds[0] ?? "") : undefined;

  const practices = category ? getPracticesByCategory(category.id) : [];
  const practiceHref = practices.length > 0 ? `/practice/${practices[0]?.slug}` : null;

  const whyNote = category
    ? `This prayer was curated for ${category.name.toLowerCase()} — ${category.shortDescription} It pairs an opening address with a short, unhurried practice, and you are free to take only what serves you.`
    : "A universal, tradition-neutral prayer held in the app for moments when the fuller library is unavailable.";

  /* Only show an explicitly assigned, reviewed companion. Do not attach a
     generic fallback track merely because it is popular or calming. */
  const dailyAudio =
    daily.audioIds.length > 0
      ? getAudioById(daily.audioIds[0] ?? "")
      : undefined;

  /* Secondary pick: before 15:00 offer tonight's item, else tomorrow morning. */
  const hour = now.getHours();
  const secondary =
    hour < 15
      ? getDailyItem(now, "sleep-and-rest")
      : getDailyItem(new Date(now.getTime() + 86_400_000), "morning-orientation");
  const secondaryCategory =
    secondary && secondary.categoryIds.length > 0
      ? getCategoryById(secondary.categoryIds[0] ?? "")
      : undefined;

  return (
    <>
      <HorizonGlow tone={hour >= 5 && hour < 11 ? "gold" : "violet"} />
      <div className="relative mx-auto w-full max-w-[720px]">
        <GreetingBlock />

        <div className="mt-6">
          <DailyPrayerCard
            initialPrayer={daily}
            category={category}
            practiceHref={practiceHref}
            poolSize={listPrayers().length}
            whyNote={whyNote}
          />
        </div>

        <Divider className="my-10" />

        <LocalSessionSuggestion />

        <Divider className="my-10" />

        {dailyAudio ? (
          <section aria-labelledby="companion-listening">
            <p id="companion-listening" className="t-eyebrow text-blue">
              Companion listening
            </p>
            <AudioCard item={dailyAudio} variant="compact" className="mt-3" />
            <p className="t-meta mt-2 text-ink-faint">Pairs with today&apos;s prayer.</p>
            <Link
              href="/listen"
              className="t-body-sm mt-2 inline-flex min-h-11 items-center gap-1 font-sans font-medium text-ink-muted underline-offset-4 hover:text-ink-strong hover:underline"
            >
              More in Listen
              <Icon name="arrow-up-right" className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </section>
        ) : null}

        <GlassCard className="mt-6 border-t border-t-[rgba(167,155,232,0.4)]">
          <div className="flex items-start gap-3">
            <Icon name="spark" className="mt-1 h-5 w-5 shrink-0 text-violet" aria-hidden="true" />
            <div>
              <h2 className="t-h3 text-ink-strong">Need something more personal?</h2>
              <p className="t-body-sm mt-2 text-ink-muted">
                Describe what you&apos;re carrying, and LumenNous will assemble a
                prayer or practice from this library on your device.
              </p>
              <div className="mt-4">
                <Button variant="secondary" href="/create">
                  Create a personal practice
                </Button>
              </div>
              <p className="t-meta mt-3 text-ink-faint">No account. AI is routed through the server.</p>
            </div>
          </div>
        </GlassCard>

        {secondary ? (
          <section aria-labelledby="later-today" className="mt-6">
            <p id="later-today" className="t-eyebrow text-ink-faint">
              {hour < 15 ? "For tonight" : "For tomorrow morning"}
            </p>
            <Link
              href={secondaryCategory ? `/explore/${secondaryCategory.slug}` : "/explore"}
              className="group mt-2 block rounded-md focus-visible:outline-none"
            >
              <h3 className="t-h3 text-ink-strong">{secondary.title}</h3>
              <p className="t-meta mt-1 uppercase tracking-wider text-ink-muted">
                {secondaryCategory?.name ?? "Library"}
              </p>
              <p className="t-prayer-sm mt-2 line-clamp-2 text-ink-muted">{secondary.opening}</p>
            </Link>
          </section>
        ) : null}

        <footer className="mt-16 border-t border-line-subtle pt-6">
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/about" className="t-body-sm inline-flex min-h-11 items-center text-ink-muted hover:text-ink-strong">
              About
            </Link>
            <Link href="/privacy" className="t-body-sm inline-flex min-h-11 items-center text-ink-muted hover:text-ink-strong">
              Privacy
            </Link>
            <Link href="/saved" className="t-body-sm inline-flex min-h-11 items-center text-ink-muted hover:text-ink-strong">
              Saved
            </Link>
          </nav>
          <p className="t-meta mt-4 text-ink-faint">
            Seed content is draft editorial material pending final review.
          </p>
        </footer>
      </div>
    </>
  );
}
