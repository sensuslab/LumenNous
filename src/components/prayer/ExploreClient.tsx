"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type JSX } from "react";
import type { Category } from "@/lib/schemas";
import { CategoryCard } from "./CategoryCard";
import { IntentionPicker } from "./IntentionPicker";

/**
 * ExploreClient - intention filtering over the 26 Corpus categories.
 * Filter state lives in the URL (?need=) so a filtered view is shareable;
 * changes are announced via a polite live region.
 */

export interface CategoryWithCounts extends Category {
  counts: string;
}

/** First-person intention chips → matching category slugs (explore.md §3). */
const INTENTION_MAP: Record<string, string[]> = {
  "I need grounding": ["grounding-and-stillness", "deep-restoration"],
  "I can't sleep": ["sleep-and-rest", "grounding-and-stillness"],
  "I'm carrying grief": ["grief-and-lament", "ancestral-remembrance"],
  "I need courage": ["courage-and-resilience", "protection-and-spiritual-boundaries"],
  "I want to forgive": ["forgiveness-and-reconciliation", "love-and-relationships"],
  "I'm anxious": ["grounding-and-stillness", "deep-restoration"],
  "I need direction": ["purpose-and-calling", "clarity-and-discernment"],
  "I'm grateful": ["provision-and-gratitude", "celebration-and-thanksgiving"],
  "I'm in transition": ["change-and-transition", "release-and-unburdening"],
  "I want stillness": ["grounding-and-stillness", "planetary-and-cosmic-contemplation"],
  "I'm holding someone in care": ["community-and-intercession", "love-and-relationships"],
};

const GROUPS: { eyebrow: string; slugs: string[] }[] = [
  {
    eyebrow: "Stillness & Presence",
    slugs: ["grounding-and-stillness", "deep-restoration", "sleep-and-rest", "morning-orientation"],
  },
  {
    eyebrow: "Source & Cosmos",
    slugs: ["connection-to-source", "gnosis-and-inner-knowing", "planetary-and-cosmic-contemplation", "subtle-energy-contemplation"],
  },
  {
    eyebrow: "Heart & Repair",
    slugs: ["grief-and-lament", "forgiveness-and-reconciliation", "love-and-relationships", "healing-and-restoration", "ancestral-remembrance"],
  },
  {
    eyebrow: "Strength & Direction",
    slugs: ["courage-and-resilience", "protection-and-spiritual-boundaries", "purpose-and-calling", "clarity-and-discernment", "confidence-and-self-worth"],
  },
  {
    eyebrow: "Life & Work",
    slugs: ["creativity-and-inspired-work", "provision-and-gratitude", "change-and-transition", "justice-and-ethical-action", "release-and-unburdening", "community-and-intercession", "celebration-and-thanksgiving"],
  },
  {
    eyebrow: "Deeper Reflection",
    slugs: ["shadow-reflection"],
  },
];

export function ExploreClient({
  categories,
}: {
  categories: readonly CategoryWithCounts[];
}): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedNeed = searchParams.get("need");
  const selected = selectedNeed && INTENTION_MAP[selectedNeed] ? selectedNeed : null;
  const [announcement, setAnnouncement] = useState("");

  function handleSelect(intention: string | null): void {
    if (intention) {
      const count = (INTENTION_MAP[intention] ?? []).length;
      setAnnouncement(`Showing ${count} ${count === 1 ? "category" : "categories"}`);
      router.replace(`/explore?need=${encodeURIComponent(intention)}`, { scroll: false });
    } else {
      setAnnouncement("Showing all categories");
      router.replace("/explore", { scroll: false });
    }
  }

  const visibleSlugs = selected ? new Set(INTENTION_MAP[selected] ?? []) : null;
  const bySlug = new Map(categories.map((category) => [category.slug, category]));

  return (
    <>
      <section aria-labelledby="need-label" className="mt-8">
        <p id="need-label" className="t-eyebrow text-ink-faint">
          What do you need?
        </p>
        <IntentionPicker
          intentions={Object.keys(INTENTION_MAP)}
          selected={selected}
          onSelect={handleSelect}
          className="mt-3"
        />
        <p aria-live="polite" className="t-meta mt-3 text-ink-faint">
          {announcement || " "}
        </p>
      </section>

      <div className="mt-10 space-y-12">
        {GROUPS.map((group) => {
          const visible = group.slugs
            .map((slug) => bySlug.get(slug))
            .filter(
              (category): category is CategoryWithCounts =>
                category !== undefined && (visibleSlugs === null || visibleSlugs.has(category.slug)),
            );
          if (visible.length === 0) return null;
          return (
            <section key={group.eyebrow} aria-label={group.eyebrow}>
              <h2 className="t-eyebrow flex items-center gap-3 text-ink-faint">
                {group.eyebrow}
                <span aria-hidden="true" className="h-px w-6 bg-line-subtle" />
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {visible.map((category) => (
                  <CategoryCard key={category.slug} category={category} counts={category.counts} />
                ))}
              </div>
            </section>
          );
        })}
        {visibleSlugs !== null && GROUPS.every((group) => group.slugs.every((slug) => !visibleSlugs.has(slug))) ? (
          <p className="t-body text-ink-muted">
            Nothing here yet — the library is still growing.
          </p>
        ) : null}
      </div>
    </>
  );
}
