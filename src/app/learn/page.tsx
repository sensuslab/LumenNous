import Link from "next/link";
import type { JSX } from "react";
import type { Metadata } from "next";
import {
  listContemplativeConcepts,
  listContemplativePathways,
  listTeachings,
} from "@/lib/content";
import { classificationChip } from "@/components/prayer/SourceBadge";
import { Chip } from "@/components/ui/Chip";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";

/**
 * Learn — `/learn` (learn.md). The teaching wing: concise guides with the
 * honesty architecture (historical vs modern vs evidence) made visible.
 */

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Short, honest guides to the ideas behind the practices — what the traditions said, what later teachers added, and what we find beautiful and useful.",
};

export default function LearnPage(): JSX.Element {
  const teachings = listTeachings();
  const pathways = listContemplativePathways();
  const concepts = listContemplativeConcepts();

  return (
    <>
      <HorizonGlow tone="violet" />
      <div className="relative mx-auto w-full max-w-[720px]">
        <section aria-labelledby="learn-title" className="mt-6">
          <p className="t-eyebrow text-ink-faint">Teachings &amp; sources</p>
          <h1 id="learn-title" className="t-h1 mt-2 text-ink-strong">
            Learn
          </h1>
          <p className="t-body mt-3 max-w-[52ch] text-ink-muted">
            Short, honest guides to the ideas behind the practices — what the
            traditions actually said, what later teachers added, and what we
            simply find beautiful and useful.
          </p>
        </section>

        <GlassCard className="mt-8 border-[rgba(167,155,232,0.3)]" interactive>
          <Link href="/concepts" className="group block">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Chip kind="source" classification="EDIT">Concept Atlas</Chip>
              <span className="t-meta text-ink-faint">{concepts.length} traced concepts</span>
            </div>
            <h2 className="t-h2 mt-3 text-ink-strong">Follow an idea to its sources</h2>
            <p className="t-body-sm mt-2 max-w-[60ch] text-ink-muted">
              Compare distinct ancient and modern strands, see the boundaries that
              travel with each idea, and find its pathways and Create applications.
            </p>
            <span className="t-meta mt-4 inline-flex items-center gap-1 text-ink-faint group-hover:text-violet">
              Open the Concept Atlas
              <Icon name="arrow-up-right" className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </Link>
        </GlassCard>

        <section aria-labelledby="legend" className="glass mt-8 rounded-md p-5">
          <h2 id="legend" className="t-label flex items-center gap-2 font-sans text-ink-strong">
            <Icon name="info" className="h-4 w-4 text-violet" aria-hidden="true" />
            How to read these guides
          </h2>
          <ul className="t-body-sm mt-3 space-y-2 text-ink-muted">
            <li className="flex items-baseline gap-2">
              <Chip kind="source" classification="HIST">HIST</Chip>
              Historical teaching — traceable to an early text or tradition.
            </li>
            <li className="flex items-baseline gap-2">
              <Chip kind="source" classification="MOD">MOD</Chip>
              Modern interpretation — a contemporary synthesis, honestly labelled.
            </li>
            <li className="flex items-baseline gap-2">
              <Chip kind="source" classification="RES">RES</Chip>
              Research &amp; evidence — what studies do and don&apos;t show.
            </li>
          </ul>
          <Link
            href="/about"
            className="t-body-sm mt-3 inline-flex min-h-11 items-center font-sans font-medium text-ink-muted underline-offset-4 hover:text-ink-strong hover:underline"
          >
            Our full label system →
          </Link>
        </section>

        <section aria-labelledby="pathways" className="mt-10">
          <div className="flex items-end justify-between gap-3 border-b border-line-subtle pb-3">
            <h2 id="pathways" className="t-eyebrow text-violet">
              Guided pathways · {pathways.length}
            </h2>
            <Link
              href="/pathways"
              className="t-meta inline-flex min-h-11 items-center text-ink-muted hover:text-violet"
            >
              View all
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4">
            {pathways.map((pathway) => (
              <GlassCard key={pathway.id} as="article" interactive>
                <Link href={`/pathways/${pathway.slug}`} className="group block">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Chip kind="source" classification="MOD">PATHWAY</Chip>
                    <span className="t-meta text-ink-faint">
                      {pathway.stages.length} stages · {pathway.estimatedMinutes} min
                    </span>
                  </div>
                  <h3 className="t-h3 mt-3 text-ink-strong">{pathway.title}</h3>
                  <p className="t-body-sm mt-2 text-ink-muted">{pathway.summary}</p>
                  <span className="t-meta mt-3 inline-flex items-center gap-1 text-ink-faint group-hover:text-violet">
                    Begin the pathway
                    <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </GlassCard>
            ))}
          </div>
        </section>

        <section aria-labelledby="guides" className="mt-10">
          <h2 id="guides" className="t-eyebrow border-b border-line-subtle pb-3 text-ink-faint">
            Guides · {teachings.length}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4">
            {teachings.map((teaching) => {
              const chip = classificationChip(teaching.classification);
              return (
                <GlassCard key={teaching.slug} as="article" interactive>
                  <Link
                    href={`/learn/${teaching.slug}`}
                    className="group block focus-visible:outline-none"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="t-h3 text-ink-strong">{teaching.title}</h3>
                      <Chip kind="source" classification={chip.classification}>
                        {chip.classification}
                      </Chip>
                    </div>
                    <p className="t-body-sm mt-2 text-ink-muted">{teaching.summary}</p>
                    <span className="t-meta mt-3 inline-flex items-center gap-1 text-ink-faint transition-colors duration-200 ease-std group-hover:text-violet">
                      Read the guide
                      <Icon name="arrow-up-right" className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                </GlassCard>
              );
            })}
          </div>
        </section>

        <GlassCard className="mt-12 border-t border-t-[rgba(167,155,232,0.4)]">
          <div className="flex items-start gap-3">
            <Icon name="spark" className="mt-1 h-5 w-5 shrink-0 text-violet" aria-hidden="true" />
            <div>
              <h2 className="t-h3 text-ink-strong">How LumenNous assembles content</h2>
              <p className="t-body-sm mt-2 text-ink-muted">
                Create selects and combines human-authored prayers, affirmations,
                practices and prompts on your device. It cycles through each
                compatible shelf before reshuffling, so the experience stays varied.
              </p>
              <Link
                href="/learn/how-lumennous-works"
                className="t-body-sm mt-3 inline-flex min-h-11 items-center font-sans font-medium text-ink-muted underline-offset-4 hover:text-ink-strong hover:underline"
              >
                Read the methodology
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
