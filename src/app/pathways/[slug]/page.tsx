import Link from "next/link";
import { notFound } from "next/navigation";
import type { JSX } from "react";
import type { Metadata } from "next";
import {
  getContemplativePathwayBySlug,
  getPassageAnchorsByIds,
  getSourcesByIds,
  listContemplativeConcepts,
  listContemplativePathways,
} from "@/lib/content";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";
import { PathwayProgressClient } from "@/components/pathways/PathwayProgressClient";
import { SourceDrawer } from "@/components/prayer/SourceDrawer";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { TraditionLabelGroup } from "@/components/prayer/TraditionLabel";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return listContemplativePathways().map((pathway) => ({ slug: pathway.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pathway = getContemplativePathwayBySlug(slug);
  if (!pathway) return {};
  return { title: pathway.title, description: pathway.summary };
}

export default async function PathwayPage({ params }: PageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const pathway = getContemplativePathwayBySlug(slug);
  if (!pathway) notFound();

  const concepts = listContemplativeConcepts().filter((concept) =>
    pathway.conceptIds.includes(concept.id),
  );
  const conceptNamesById = Object.fromEntries(
    concepts.map((concept) => [concept.id, concept.name]),
  );
  const sources = getSourcesByIds(pathway.sourceIds);
  const anchorIds = pathway.stages.flatMap((stage) =>
    stage.activity.sourceUses.map((use) => use.anchorId),
  );
  const anchors = getPassageAnchorsByIds(anchorIds);

  return (
    <>
      <HorizonGlow tone="violet" />
      <div className="relative mx-auto w-full max-w-[760px]">
        <Link
          href="/pathways"
          className="t-body-sm inline-flex min-h-11 items-center gap-1 font-sans font-medium text-ink-muted hover:text-ink-strong"
        >
          <Icon name="chevron-left" className="h-4 w-4" />
          All pathways
        </Link>

        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <Chip kind="source" classification="MOD">
              Modern contemplative pathway
            </Chip>
            <Chip kind="source" classification="EDIT">
              Draft editorial content
            </Chip>
          </div>
          <h1 className="t-h1 mt-4 text-ink-strong">{pathway.title}</h1>
          <p className="t-h3 mt-2 text-violet">{pathway.subtitle}</p>
          <p className="t-body mt-4 max-w-[62ch] text-ink-muted">
            {pathway.summary}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="t-meta inline-flex items-center gap-1.5 rounded-xs border border-line-subtle px-2 py-1 text-ink-faint">
              <Icon name="timer" className="h-3.5 w-3.5" />
              About {pathway.estimatedMinutes} minutes total
            </span>
            <span className="t-meta rounded-xs border border-line-subtle px-2 py-1 text-ink-faint">
              {pathway.stages.length} stages · take them at your own pace
            </span>
          </div>
          <div className="mt-4">
            <TraditionLabelGroup labels={pathway.traditionLabels} />
          </div>
        </header>

        <section aria-labelledby="pathway-ideas" className="mt-8 border-t border-line-subtle pt-6">
          <h2 id="pathway-ideas" className="t-eyebrow text-ink-faint">
            Ideas held in this pathway
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {concepts.map((concept) => (
              <Link
                key={concept.id}
                href={`/concepts/${concept.slug}`}
                className="group rounded-sm border border-line-subtle p-4 transition-colors hover:border-line"
              >
                <p className="t-label font-sans text-ink-strong">{concept.name}</p>
                <p className="t-body-sm mt-1 text-ink-muted">{concept.summary}</p>
                <span className="t-meta mt-2 inline-flex items-center gap-1 text-ink-faint group-hover:text-violet">
                  Trace the idea <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <aside className="mt-6 rounded-md border border-[rgba(232,180,160,0.28)] bg-[rgba(232,180,160,0.045)] p-5">
          <p className="t-label font-sans text-ink-strong">Before you begin</p>
          <p className="t-body-sm mt-2 text-ink-muted">{pathway.safetyNotes}</p>
          <p className="t-body-sm mt-2 text-ink-muted">{pathway.accessibilityNotes}</p>
        </aside>

        <PathwayProgressClient
          pathway={pathway}
          conceptNamesById={conceptNamesById}
        />

        <SourceDrawer
          sources={sources}
          anchors={anchors}
          heading="Sources behind this pathway"
          className="mt-10"
        />
      </div>
    </>
  );
}
