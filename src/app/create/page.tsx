import type { JSX } from "react";
import type { Metadata } from "next";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";
import { CreateClient } from "@/components/create/CreateClient";
import {
  listActiveCategories,
  listAffirmations,
  listPractices,
  listPrayers,
  listReflectionPrompts,
  listSources,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Create",
  description:
    "Create a personal prayer or meditation from your words or a chosen LumenNous intention.",
};

export default function CreatePage(): JSX.Element {
  const sourcesById = Object.fromEntries(
    listSources().map((source) => [source.id, source]),
  );

  return (
    <>
      <HorizonGlow tone="violet" />
      <div className="relative mx-auto w-full max-w-[720px]">
        <header className="mt-6">
          <p className="t-eyebrow text-violet">Made for this moment</p>
          <h1 className="t-h1 mt-2 text-ink-strong">Create</h1>
          <p className="t-body mt-3 max-w-[54ch] text-ink-muted">
            Write a sentence or choose an intention. LumenNous matches it to
            the on-board library and assembles a bounded practice in this browser.
          </p>
        </header>

        <CreateClient
          categories={listActiveCategories()}
          prayers={listPrayers()}
          affirmations={listAffirmations()}
          practices={listPractices()}
          prompts={listReflectionPrompts()}
          sourcesById={sourcesById}
        />
      </div>
    </>
  );
}
