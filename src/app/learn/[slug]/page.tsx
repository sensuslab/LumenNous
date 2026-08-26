import Link from "next/link";
import { notFound } from "next/navigation";
import type { JSX } from "react";
import type { Metadata } from "next";
import {
  getCategoryById,
  getPassageAnchorsByIds,
  getSourcesByIds,
  getTeachingBySlug,
  listTeachings,
} from "@/lib/content";
import { Markdown } from "@/components/media/Markdown";
import { classificationChip } from "@/components/prayer/SourceBadge";
import { SourceDrawer } from "@/components/prayer/SourceDrawer";
import { FavouriteButton } from "@/components/prayer/FavouriteButton";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";

/**
 * Teaching — `/learn/[slug]` (article.md). A single guide: concise body,
 * classification, related rooms, sources, further reading.
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return listTeachings().map((teaching) => ({ slug: teaching.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const teaching = getTeachingBySlug(slug);
  if (!teaching) return {};
  return { title: teaching.title, description: teaching.summary };
}

export default async function TeachingPage({ params }: PageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const teaching = getTeachingBySlug(slug);
  if (!teaching) notFound();

  const chip = classificationChip(teaching.classification);
  const sources = getSourcesByIds(teaching.sourceIds);
  const anchors = getPassageAnchorsByIds(
    teaching.sourceUses?.map((use) => use.anchorId) ?? [],
  );
  const relatedCategories = teaching.relatedCategoryIds
    .map((id) => getCategoryById(id))
    .filter((category): category is NonNullable<typeof category> => category !== undefined && category.isActive);

  return (
    <>
      <HorizonGlow tone="violet" />
      <div className="relative mx-auto w-full max-w-[720px]">
        <Link
          href="/learn"
          className="t-body-sm inline-flex min-h-11 items-center gap-1 font-sans font-medium text-ink-muted hover:text-ink-strong"
        >
          <Icon name="chevron-left" className="h-4 w-4" aria-hidden="true" />
          Learn
        </Link>

        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <Chip kind="source" classification={chip.classification}>
              {chip.classification} · {chip.text}
            </Chip>
            {teaching.editorialStatus === "draft" ? (
              <Chip kind="source" classification="EDIT">
                Draft editorial content
              </Chip>
            ) : null}
          </div>
          <h1 className="t-h1 mt-3 text-ink-strong">{teaching.title}</h1>
          <p className="t-body mt-3 max-w-[56ch] text-ink-muted">{teaching.summary}</p>
          <div className="mt-4">
            <FavouriteButton
              item={{
                id: teaching.id,
                type: "teaching",
                title: teaching.title,
                href: `/learn/${teaching.slug}`,
                addedAt: new Date().toISOString(),
              }}
            />
          </div>
        </header>

        <Markdown body={teaching.body} className="mt-8" />

        {relatedCategories.length > 0 ? (
          <section aria-labelledby="related-rooms" className="mt-10">
            <h2 id="related-rooms" className="t-eyebrow border-b border-line-subtle pb-3 text-ink-faint">
              Related rooms
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {relatedCategories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/explore/${category.slug}`}>
                    <Chip kind="filter" tone="neutral">
                      {category.name}
                    </Chip>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <SourceDrawer sources={sources} anchors={anchors} className="mt-10" />

        {teaching.furtherReading.length > 0 ? (
          <section aria-labelledby="further-reading" className="mt-10">
            <h2 id="further-reading" className="t-eyebrow border-b border-line-subtle pb-3 text-ink-faint">
              Further reading
            </h2>
            <ul className="mt-4 space-y-3">
              {teaching.furtherReading.map((entry) => (
                <li key={entry.title} className="t-body-sm text-ink-muted">
                  {entry.url ? (
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet underline-offset-4 hover:underline"
                    >
                      {entry.title}
                    </a>
                  ) : (
                    <span className="text-ink">{entry.title}</span>
                  )}
                  {entry.author ? <span> — {entry.author}</span> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
