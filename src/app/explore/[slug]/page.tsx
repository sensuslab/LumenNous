import Link from "next/link";
import { notFound } from "next/navigation";
import type { JSX } from "react";
import type { Metadata } from "next";
import {
  getAudioById,
  getCategoryById,
  getCategoryBySlug,
  getRelatedContent,
  getSourcesByIds,
  listActiveCategories,
  listPrayers,
} from "@/lib/content";
import { getDailyItem } from "@/lib/daily";
import type { Prayer } from "@/lib/schemas";
import { CategoryCard, categoryIcon } from "@/components/prayer/CategoryCard";
import { DailyPrayerCard } from "@/components/prayer/DailyPrayerCard";
import { PrayerList } from "@/components/prayer/PrayerList";
import { AffirmationCard } from "@/components/prayer/AffirmationCard";
import { ReflectionPrompt } from "@/components/prayer/ReflectionPrompt";
import { SafetyNotice } from "@/components/prayer/SafetyNotice";
import { SourceBadge } from "@/components/prayer/SourceBadge";
import { AudioCard } from "@/components/media/AudioCard";
import { Icon } from "@/components/ui/Icon";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";
import type { Practice } from "@/lib/schemas";

/**
 * Category — `/explore/[slug]`. One intention, fully
 * furnished: prayers, affirmations, practices, reflection, listening,
 * teaching, and neighbouring rooms.
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return listActiveCategories().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.shortDescription,
    openGraph: { title: category.name, description: category.shortDescription },
  };
}

const GLOW_TONE: Record<string, "violet" | "gold" | "blue"> = {
  gold: "gold",
  amber: "gold",
  azure: "blue",
  teal: "blue",
  indigo: "violet",
  violet: "violet",
};

export default async function CategoryPage({ params }: PageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category || !category.isActive) notFound();

  const related = getRelatedContent(category.id);
  const daily = getDailyItem(new Date(), category.slug);
  const firstPractice = related.practices[0];

  const prayerItems = related.prayers.map((prayer: Prayer) => {
    const practice = related.practices.find((candidate) =>
      candidate.categoryIds.some((id) => prayer.categoryIds.includes(id)),
    );
    return { prayer, practiceHref: practice ? `/practice/${practice.slug}` : null };
  });

  /* Listening: audio referenced by this room's prayers, up to 3. */
  const audioIds = [...new Set(related.prayers.flatMap((prayer) => prayer.audioIds))];
  const listening = audioIds
    .map((id) => getAudioById(id))
    .filter((item): item is NonNullable<typeof item> => item !== undefined)
    .slice(0, 3);

  const teaching = related.teachings[0];
  const teachingSources = teaching ? getSourcesByIds(teaching.sourceIds) : [];

  const neighbours = category.relatedCategoryIds
    .map((id) => getCategoryById(id))
    .filter((item): item is NonNullable<typeof item> => item !== undefined && item.isActive)
    .slice(0, 3);

  return (
    <>
      <HorizonGlow tone={GLOW_TONE[category.theme] ?? "violet"} />
      <div className="relative mx-auto w-full max-w-[720px]">
        <Link
          href="/explore"
          className="t-body-sm inline-flex min-h-11 items-center gap-1 font-sans font-medium text-ink-muted hover:text-ink-strong"
        >
          <Icon name="chevron-left" className="h-4 w-4" aria-hidden="true" />
          Explore
        </Link>

        <header className="mt-6">
          <span
            aria-hidden="true"
            className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-sm border border-line-subtle text-gold"
          >
            <Icon name={categoryIcon(category.icon)} className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="t-h1 text-ink-strong">{category.name}</h1>
          <p className="t-body mt-3 max-w-[56ch] text-ink">{category.longDescription}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="t-meta rounded-full border border-line-subtle px-3 py-1 text-ink-faint">
              {related.prayers.length} prayers
            </span>
            <span className="t-meta rounded-full border border-line-subtle px-3 py-1 text-ink-faint">
              {related.affirmations.length} affirmations
            </span>
            <span className="t-meta rounded-full border border-line-subtle px-3 py-1 text-ink-faint">
              {related.practices.length} practices
            </span>
            <span className="t-meta rounded-full border border-line-subtle px-3 py-1 text-ink-faint">
              {related.prompts.length} reflections
            </span>
          </div>
        </header>

        <section aria-labelledby="come-as-you-are" className="mt-8">
          <p id="come-as-you-are" className="t-eyebrow text-ink-faint">
            Come as you are
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {category.intentions.map((intention) => (
              <li
                key={intention}
                className="t-label rounded-full border border-line-subtle px-3 py-1.5 text-ink-muted"
              >
                {intention}
              </li>
            ))}
          </ul>
        </section>

        <SafetyNotice flags={category.safetyFlags} className="mt-6" />

        {daily ? (
          <section aria-labelledby="today-in-room" className="mt-10">
            <p id="today-in-room" className="t-eyebrow mb-3 text-gold">
              Today in this room
            </p>
            <DailyPrayerCard
              initialPrayer={daily}
              category={category}
              practiceHref={firstPractice ? `/practice/${firstPractice.slug}` : null}
              poolSize={related.prayers.length || listPrayers().length}
              whyNote={`Curated for ${category.name.toLowerCase()} — ${category.shortDescription}`}
              headingLevel="h2"
            />
          </section>
        ) : null}

        {related.prayers.length > 0 ? (
          <section aria-labelledby="room-prayers" className="mt-12">
            <h2 id="room-prayers" className="t-eyebrow border-b border-line-subtle pb-3 text-ink-faint">
              Prayers · {related.prayers.length}
            </h2>
            <PrayerList items={prayerItems} categorySlug={category.slug} />
          </section>
        ) : null}

        {related.affirmations.length > 0 ? (
          <section aria-labelledby="room-affirmations" className="mt-12">
            <h2 id="room-affirmations" className="t-eyebrow border-b border-line-subtle pb-3 text-ink-faint">
              Affirmations · {related.affirmations.length}
            </h2>
            <div className="mt-6 space-y-4">
              {related.affirmations.slice(0, 3).map((affirmation) => (
                <AffirmationCard
                  key={affirmation.id}
                  affirmation={affirmation}
                  href={`/explore/${category.slug}`}
                />
              ))}
            </div>
          </section>
        ) : null}

        {related.practices.length > 0 ? (
          <section aria-labelledby="room-practices" className="mt-12">
            <h2 id="room-practices" className="t-eyebrow border-b border-line-subtle pb-3 text-ink-faint">
              Practices · {related.practices.length}
            </h2>
            <ul className="mt-2 divide-y divide-line-subtle">
              {related.practices.map((practice: Practice) => (
                <li key={practice.id}>
                  <Link
                    href={`/practice/${practice.slug}`}
                    className="group flex items-center justify-between gap-4 py-4"
                  >
                    <span className="min-w-0">
                      <span className="t-meta block uppercase tracking-wider text-ink-faint">
                        {practice.practiceType} · {practice.durationOptions.join(" / ")} min
                      </span>
                      <span className="t-h3 mt-1 block truncate text-ink-strong">{practice.title}</span>
                      <span className="t-body-sm mt-1 block truncate text-ink-muted">
                        {practice.preparation}
                      </span>
                    </span>
                    <Icon
                      name="arrow-up-right"
                      className="h-5 w-5 shrink-0 text-ink-faint transition-colors duration-200 ease-std group-hover:text-gold"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {related.prompts.length > 0 ? (
          <section aria-labelledby="room-reflection" className="mt-12">
            <h2 id="room-reflection" className="t-eyebrow border-b border-line-subtle pb-3 text-ink-faint">
              For reflection — no answer needed
            </h2>
            <div className="mt-6 space-y-4">
              {related.prompts.slice(0, 3).map((prompt) => (
                <ReflectionPrompt key={prompt.id} prompt={prompt} />
              ))}
            </div>
          </section>
        ) : null}

        {listening.length > 0 ? (
          <section aria-labelledby="room-listening" className="mt-12">
            <h2 id="room-listening" className="t-eyebrow border-b border-line-subtle pb-3 text-ink-faint">
              Listening
            </h2>
            <div className="mt-6 space-y-4">
              {listening.map((item) => (
                <AudioCard key={item.id} item={item} variant="compact" />
              ))}
            </div>
            <Link
              href="/listen"
              className="t-body-sm mt-4 inline-flex min-h-11 items-center gap-1 font-sans font-medium text-ink-muted underline-offset-4 hover:text-ink-strong hover:underline"
            >
              More in Listen
              <Icon name="arrow-up-right" className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </section>
        ) : null}

        {teaching ? (
          <section aria-labelledby="room-teaching" className="mt-12">
            <h2 id="room-teaching" className="t-eyebrow border-b border-line-subtle pb-3 text-ink-faint">
              The teaching behind this room
            </h2>
            <article className="glass mt-6 rounded-md p-5 md:p-6">
              <div className="flex items-start gap-3">
                <Icon name="book-open" className="mt-1 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                <div>
                  <h3 className="t-h3 text-ink-strong">{teaching.title}</h3>
                  <p className="t-body-sm mt-2 text-ink-muted">{teaching.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {teachingSources.slice(0, 3).map((source) => (
                      <SourceBadge key={source.id} source={source} />
                    ))}
                  </div>
                  <Link
                    href={`/learn/${teaching.slug}`}
                    className="t-body-sm mt-4 inline-flex min-h-11 items-center gap-1 font-sans font-medium text-ink-muted underline-offset-4 hover:text-ink-strong hover:underline"
                  >
                    Read the guide
                    <Icon name="arrow-up-right" className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          </section>
        ) : null}

        {neighbours.length > 0 ? (
          <section aria-labelledby="neighbouring-rooms" className="mt-12">
            <h2 id="neighbouring-rooms" className="t-eyebrow border-b border-line-subtle pb-3 text-ink-faint">
              Neighbouring rooms
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {neighbours.map((neighbour) => (
                <CategoryCard key={neighbour.slug} category={neighbour} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
