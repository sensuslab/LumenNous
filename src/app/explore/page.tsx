import Link from "next/link";
import { Suspense, type JSX } from "react";
import type { Metadata } from "next";
import {
  getAffirmationsByCategory,
  getPracticesByCategory,
  getPrayersByCategory,
  listActiveCategories,
} from "@/lib/content";
import { ExploreClient, type CategoryWithCounts } from "@/components/prayer/ExploreClient";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";

/**
 * Explore — `/explore` (explore.md). A quiet index of doors, not a feed.
 * All 26 cards render server-side; filtering is a client island over
 * serialized data.
 */

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Browse the LumenNous library: 26 grounded categories of prayers, affirmations, practices and listening.",
};

export default function ExplorePage(): JSX.Element {
  const categories: CategoryWithCounts[] = listActiveCategories().map((category) => ({
    ...category,
    counts: `${getPrayersByCategory(category.id).length} prayers · ${
      getAffirmationsByCategory(category.id).length
    } affirmations · ${getPracticesByCategory(category.id).length} practices`,
  }));

  return (
    <>
      <HorizonGlow tone="violet" />
      <div className="relative mx-auto w-full max-w-[720px]">
        <section aria-labelledby="explore-title" className="mt-6">
          <p className="t-eyebrow text-ink-faint">The library</p>
          <h1 id="explore-title" className="t-h1 mt-2 text-ink-strong">
            Explore
          </h1>
          <p className="t-body mt-3 max-w-[52ch] text-ink-muted">
            Twenty-six intentions, each holding prayers, affirmations, practices and
            listening for a different weight or longing. Enter wherever you are.
          </p>
        </section>

        <Suspense fallback={null}>
          <ExploreClient categories={categories} />
        </Suspense>

        <section aria-label="Not sure where to begin" className="mt-16 border-y border-line-subtle py-10 text-center">
          <p className="t-h3 italic text-ink-strong">Not sure where to begin?</p>
          <div className="mt-4 flex flex-col items-center gap-1">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center px-3 font-sans text-[0.9375rem] font-medium text-ink-muted underline-offset-4 hover:text-ink-strong hover:underline"
            >
              Take me to today&apos;s prayer →
            </Link>
            <Link
              href="/create"
              className="inline-flex min-h-11 items-center px-3 font-sans text-[0.9375rem] font-medium text-ink-muted underline-offset-4 hover:text-ink-strong hover:underline"
            >
              Create a personal practice
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
