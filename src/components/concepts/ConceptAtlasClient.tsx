"use client";

import Link from "next/link";
import { useMemo, useState, type JSX } from "react";
import type {
  ContemplativeApplication,
  ContemplativeConcept,
  WorldviewProfile,
} from "@/lib/schemas";
import { classificationChip } from "@/components/prayer/SourceBadge";
import { Chip } from "@/components/ui/Chip";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";

type WorldviewFilter = "all" | WorldviewProfile;
type ApplicationFilter = "all" | ContemplativeApplication;

const WORLDVIEWS: ReadonlyArray<{ value: WorldviewFilter; label: string }> = [
  { value: "all", label: "Every worldview" },
  { value: "open-universal", label: "Open universal" },
  { value: "gnostic", label: "Gnostic" },
  { value: "esoteric-christian", label: "Esoteric Christian" },
  { value: "neutral", label: "Neutral" },
];

const APPLICATIONS: ReadonlyArray<{ value: ApplicationFilter; label: string }> = [
  { value: "all", label: "Every use" },
  { value: "learn", label: "Learn" },
  { value: "prayer", label: "Prayer" },
  { value: "practice", label: "Practice" },
  { value: "reflection", label: "Reflection" },
  { value: "pathway", label: "Pathway" },
];

export function ConceptAtlasClient({
  concepts,
}: {
  concepts: readonly ContemplativeConcept[];
}): JSX.Element {
  const [worldview, setWorldview] = useState<WorldviewFilter>("all");
  const [application, setApplication] = useState<ApplicationFilter>("all");
  const visibleConcepts = useMemo(
    () =>
      concepts.filter(
        (concept) =>
          (worldview === "all" || concept.worldviewProfiles.includes(worldview)) &&
          (application === "all" || concept.applications.includes(application)),
      ),
    [application, concepts, worldview],
  );

  return (
    <>
      <section aria-labelledby="worldview-filter" className="mt-8">
        <h2 id="worldview-filter" className="t-eyebrow text-ink-faint">
          Worldview lens
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {WORLDVIEWS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={worldview === option.value}
              onClick={() => setWorldview(option.value)}
              className="rounded-pill focus-visible:outline-none"
            >
              <Chip selected={worldview === option.value} tone="violet">
                {option.label}
              </Chip>
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="application-filter" className="mt-6">
        <h2 id="application-filter" className="t-eyebrow text-ink-faint">
          Application
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {APPLICATIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={application === option.value}
              onClick={() => setApplication(option.value)}
              className="rounded-pill focus-visible:outline-none"
            >
              <Chip selected={application === option.value} tone="gold">
                {option.label}
              </Chip>
            </button>
          ))}
        </div>
      </section>

      <p className="t-meta mt-7 border-b border-line-subtle pb-3 text-ink-faint" aria-live="polite">
        Showing {visibleConcepts.length} of {concepts.length} concepts
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {visibleConcepts.map((concept) => {
          const chip = classificationChip(concept.classification);
          return (
            <GlassCard key={concept.id} as="article" interactive>
              <Link href={`/concepts/${concept.slug}`} className="group block h-full">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Chip kind="source" classification={chip.classification}>
                    {chip.text}
                  </Chip>
                  <span className="t-meta text-ink-faint">
                    {concept.sourceAnchorIds.length} source {concept.sourceAnchorIds.length === 1 ? "strand" : "strands"}
                  </span>
                </div>
                <h2 className="t-h3 mt-4 text-ink-strong">{concept.name}</h2>
                <p className="t-body-sm mt-2 text-ink-muted">{concept.summary}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {concept.applications.map((item) => (
                    <span
                      key={item}
                      className="t-meta rounded-xs border border-line-subtle px-2 py-1 capitalize text-ink-faint"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <span className="t-meta mt-4 inline-flex items-center gap-1 text-ink-faint group-hover:text-violet">
                  Trace this concept
                  <Icon name="arrow-up-right" className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            </GlassCard>
          );
        })}
      </div>

      {visibleConcepts.length === 0 ? (
        <GlassCard className="mt-5 text-center">
          <p className="t-body-sm text-ink-muted">
            No concepts use both of those editorial lenses. Try a broader worldview or application.
          </p>
        </GlassCard>
      ) : null}
    </>
  );
}
