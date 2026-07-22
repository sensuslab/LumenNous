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
    "Assemble a personal prayer or meditation on your device from the grounded LumenNous library.",
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
            Choose what you need and LumenNous will assemble a prayer or meditation from its reviewed library. No account, no external AI, and no request leaves this device.
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
