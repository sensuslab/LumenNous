import Link from "next/link";
import { notFound } from "next/navigation";
import type { JSX } from "react";
import type { Metadata } from "next";
import type { ConceptSafetyTag, WorldviewProfile } from "@/lib/schemas";
import {
  getConceptEngineFrameByConceptId,
  getContemplativeConceptBySlug,
  getPassageAnchorsByIds,
  getSourcesByIds,
  listContemplativeConcepts,
  listContemplativePathways,
  listTeachings,
} from "@/lib/content";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";
import { SourceDrawer } from "@/components/prayer/SourceDrawer";
import { classificationChip } from "@/components/prayer/SourceBadge";
import { TraditionLabelGroup } from "@/components/prayer/TraditionLabel";
import { Chip } from "@/components/ui/Chip";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const WORLDVIEW_LABELS: Record<WorldviewProfile, string> = {
  "open-universal": "Open universal",
  gnostic: "Gnostic",
  "esoteric-christian": "Esoteric Christian",
  neutral: "Neutral",
};

const SAFETY_NOTES: Record<ConceptSafetyTag, string> = {
  "non-oracular": "Inner impressions are reflection material, not messages, commands or predictions.",
  "reality-test-inner-knowing": "Private meaning stays in conversation with observable facts, consequences and trusted people.",
  "metaphor-only": "Mythic and healing language is used as metaphor, not medical, scientific or literal cosmology.",
  "no-supernormal-practice": "No psychic faculty, vision, entity contact or paranormal result is trained or promised.",
  "ground-after-practice": "The practice returns attention to body, place, relationship and an ordinary next action.",
  "non-clerical": "Spiritual rank and institutional authority are not claimed; participation and service remain freely chosen.",
  "source-specific": "Distinct texts remain distinct; comparison does not turn them into one hidden universal doctrine.",
};

export function generateStaticParams(): { slug: string }[] {
  return listContemplativeConcepts().map((concept) => ({ slug: concept.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const concept = getContemplativeConceptBySlug(slug);
  if (!concept) return {};
  return { title: concept.name, description: concept.summary };
}

export default async function ConceptPage({ params }: PageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const concept = getContemplativeConceptBySlug(slug);
  if (!concept) notFound();

  const anchors = getPassageAnchorsByIds(concept.sourceAnchorIds);
  const sourceIds = [...new Set(anchors.map((anchor) => anchor.sourceId))];
  const sources = getSourcesByIds(sourceIds);
  const sourcesById = new Map(sources.map((source) => [source.id, source]));
  const pathways = listContemplativePathways().filter((pathway) =>
    pathway.conceptIds.includes(concept.id),
  );
  const teachings = listTeachings()
    .filter((teaching) => teaching.sourceIds.some((sourceId) => sourceIds.includes(sourceId)))
    .slice(0, 3);
  const frame = getConceptEngineFrameByConceptId(concept.id);
  const conceptChip = classificationChip(concept.classification);

  return (
    <>
      <HorizonGlow tone="violet" />
      <div className="relative mx-auto w-full max-w-[780px]">
        <Link
          href="/concepts"
          className="t-body-sm inline-flex min-h-11 items-center gap-1 font-sans font-medium text-ink-muted hover:text-ink-strong"
        >
          <Icon name="chevron-left" className="h-4 w-4" aria-hidden="true" />
          Concept Atlas
        </Link>

        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <Chip kind="source" classification={conceptChip.classification}>
              {conceptChip.text}
            </Chip>
            <Chip kind="source" classification="EDIT">Draft editorial concept</Chip>
          </div>
          <h1 className="t-h1 mt-4 text-ink-strong">{concept.name}</h1>
          <p className="t-body mt-4 max-w-[64ch] text-ink-muted">{concept.summary}</p>
          <div className="mt-5">
            <TraditionLabelGroup labels={concept.traditionLabels} />
          </div>
        </header>

        <section aria-labelledby="concept-fit" className="mt-8 border-t border-line-subtle pt-6">
          <h2 id="concept-fit" className="t-eyebrow text-ink-faint">Editorial fit</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {concept.worldviewProfiles.map((profile) => (
              <Chip key={profile} tone="violet">{WORLDVIEW_LABELS[profile]}</Chip>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {concept.applications.map((application) => (
              <Chip key={application} tone="gold">
                {application[0].toUpperCase() + application.slice(1)}
              </Chip>
            ))}
          </div>
        </section>

        <section aria-labelledby="concept-boundaries" className="mt-8">
          <h2 id="concept-boundaries" className="t-h2 text-ink-strong">
            How LumenNous holds this idea
          </h2>
          <p className="t-body-sm mt-2 max-w-[64ch] text-ink-muted">
            The boundaries below travel with this concept wherever it appears in prayer,
            practice, reflection or a guided pathway.
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {concept.safetyTags.map((tag) => (
              <li key={tag} className="rounded-sm border border-line-subtle p-4">
                <p className="t-label font-sans capitalize text-ink-strong">
                  {tag.replaceAll("-", " ")}
                </p>
                <p className="t-body-sm mt-1 text-ink-muted">{SAFETY_NOTES[tag]}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="source-strands" className="mt-10">
          <div className="border-b border-line-subtle pb-3">
            <h2 id="source-strands" className="t-h2 text-ink-strong">Source strands</h2>
            <p className="t-body-sm mt-2 text-ink-muted">
              Each strand keeps its own work, historical setting and editorial relation.
              Similarity is shown without claiming all sources teach the same doctrine.
            </p>
          </div>
          <div className="mt-5 space-y-4">
            {anchors.map((anchor) => {
              const source = sourcesById.get(anchor.sourceId);
              if (!source) return null;
              const chip = classificationChip(source.claimClassification);
              return (
                <GlassCard key={anchor.id} as="article">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Chip kind="source" classification={chip.classification}>{chip.text}</Chip>
                    <span className="t-meta text-ink-faint">
                      {anchor.verification.replaceAll("-", " ")}
                    </span>
                  </div>
                  <h3 className="t-h3 mt-3 text-ink-strong">{anchor.workTitle}</h3>
                  <p className="t-label mt-1 font-sans text-violet">{anchor.sectionTitle}</p>
                  <p className="t-meta mt-2 text-ink-faint">{anchor.locator}</p>
                  <p className="t-body-sm mt-3 text-ink-muted">{anchor.notes}</p>
                  <p className="t-meta mt-3 border-t border-line-subtle pt-3 text-ink-faint">
                    Source · {source.title}{source.author ? ` — ${source.author}` : ""}
                  </p>
                </GlassCard>
              );
            })}
          </div>
          <SourceDrawer
            sources={sources}
            anchors={anchors}
            heading="Full citations and passage map"
            className="mt-4"
          />
        </section>

        {frame ? (
          <section aria-labelledby="create-lens" className="mt-10">
            <GlassCard hero className="border-[rgba(167,155,232,0.3)]">
              <p className="t-eyebrow text-violet">Create lens</p>
              <h2 id="create-lens" className="t-h2 mt-2 text-ink-strong">
                Bring this concept into a composition
              </h2>
              <p className="t-body-sm mt-3 text-ink-muted">{frame.description}</p>
              <blockquote className="t-prayer-sm mt-5 border-l-2 border-violet pl-4 italic text-ink-strong">
                {frame.affirmation}
              </blockquote>
              <p className="t-body-sm mt-4 text-ink-muted">{frame.practiceStep}</p>
              <p className="t-meta mt-4 text-ink-faint">Care note · {frame.safetyNote}</p>
              <Link
                href={`/create?concept=${concept.slug}`}
                className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-[rgba(167,155,232,0.44)] bg-[rgba(167,155,232,0.08)] px-5 font-sans text-sm font-semibold text-ink-strong hover:border-[rgba(167,155,232,0.68)]"
              >
                Open Create and choose this lens
                <Icon name="arrow-up-right" className="h-4 w-4 text-violet" aria-hidden="true" />
              </Link>
            </GlassCard>
          </section>
        ) : null}

        {pathways.length > 0 ? (
          <section aria-labelledby="related-pathways" className="mt-10">
            <h2 id="related-pathways" className="t-eyebrow border-b border-line-subtle pb-3 text-ink-faint">
              Related pathways
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {pathways.map((pathway) => (
                <GlassCard key={pathway.id} as="article" interactive>
                  <Link href={`/pathways/${pathway.slug}`} className="group block">
                    <h3 className="t-h3 text-ink-strong">{pathway.title}</h3>
                    <p className="t-body-sm mt-2 text-ink-muted">{pathway.summary}</p>
                    <span className="t-meta mt-3 inline-flex items-center gap-1 text-ink-faint group-hover:text-violet">
                      Follow the pathway <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </GlassCard>
              ))}
            </div>
          </section>
        ) : null}

        {teachings.length > 0 ? (
          <section aria-labelledby="related-guides" className="mt-10">
            <h2 id="related-guides" className="t-eyebrow border-b border-line-subtle pb-3 text-ink-faint">
              Read alongside
            </h2>
            <ul className="mt-3 divide-y divide-line-subtle">
              {teachings.map((teaching) => (
                <li key={teaching.id}>
                  <Link
                    href={`/learn/${teaching.slug}`}
                    className="group flex min-h-16 items-center justify-between gap-4 py-3"
                  >
                    <span>
                      <span className="t-label block font-sans text-ink-strong">{teaching.title}</span>
                      <span className="t-meta mt-1 block text-ink-faint">{teaching.summary}</span>
                    </span>
                    <Icon name="arrow-up-right" className="h-4 w-4 shrink-0 text-ink-faint group-hover:text-violet" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
