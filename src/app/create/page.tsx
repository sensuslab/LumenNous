import type { JSX } from "react";
import type { Metadata } from "next";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";
import { CreateClient } from "@/components/create/CreateClient";
import {
  getContemplativeConceptBySlug,
  getConceptEngineFrameByConceptId,
  listActiveCategories,
  listAffirmations,
  listConceptEngineFrames,
  listContemplativeConcepts,
  listPractices,
  listPrayers,
  listPassageAnchors,
  listReflectionPrompts,
  listSources,
} from "@/lib/content";
import type { EngineRequest } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Create",
  description:
    "Create a personal prayer or meditation from your words or a chosen LumenNous intention.",
};

interface PageProps {
  searchParams: Promise<{ concept?: string | string[] }>;
}

export default async function CreatePage({ searchParams }: PageProps): Promise<JSX.Element> {
  const requestedSlugValue = (await searchParams).concept;
  const requestedSlug = Array.isArray(requestedSlugValue)
    ? requestedSlugValue[0]
    : requestedSlugValue;
  const initialConcept = requestedSlug
    ? getContemplativeConceptBySlug(requestedSlug)
    : undefined;
  const initialFrame = initialConcept
    ? getConceptEngineFrameByConceptId(initialConcept.id)
    : undefined;
  const initialWorldviewProfile: EngineRequest["worldviewProfile"] | undefined =
    initialFrame?.compatibleWorldviews.includes("open-universal")
      ? "open-universal"
      : initialFrame?.compatibleWorldviews[0];
  const sourcesById = Object.fromEntries(
    listSources().map((source) => [source.id, source]),
  );
  const passageAnchorsById = Object.fromEntries(
    listPassageAnchors().map((anchor) => [anchor.id, anchor]),
  );
  const conceptsById = Object.fromEntries(
    listContemplativeConcepts().map((concept) => [concept.id, concept]),
  );

  return (
    <>
      <HorizonGlow tone="violet" />
      <div className="relative mx-auto w-full max-w-[720px]">
        <header className="mt-6">
          <p className="t-eyebrow text-violet">Made for this moment</p>
          <h1 className="t-h1 mt-2 text-ink-strong">Create</h1>
          <p className="t-body mt-3 max-w-[54ch] text-ink-muted">
            Write your own words for a custom AI-assisted request, or choose a
            specific intention to use the on-board LumenNous library system.
          </p>
        </header>

        {initialConcept && initialFrame ? (
          <aside className="mt-5 rounded-md border border-[rgba(167,155,232,0.3)] bg-[rgba(167,155,232,0.055)] p-4">
            <p className="t-label font-sans text-ink-strong">
              Concept lens selected · {initialConcept.name}
            </p>
            <p className="t-body-sm mt-1 text-ink-muted">
              Its source-aware language and care boundary are ready below. You can change or remove the lens before composing.
            </p>
          </aside>
        ) : null}

        <CreateClient
          categories={listActiveCategories()}
          prayers={listPrayers()}
          affirmations={listAffirmations()}
          practices={listPractices()}
          prompts={listReflectionPrompts()}
          conceptFrames={listConceptEngineFrames()}
          conceptsById={conceptsById}
          sourcesById={sourcesById}
          passageAnchorsById={passageAnchorsById}
          initialConceptId={initialFrame?.conceptId}
          initialWorldviewProfile={initialWorldviewProfile}
        />
      </div>
    </>
  );
}
