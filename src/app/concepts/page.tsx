import Link from "next/link";
import type { JSX } from "react";
import type { Metadata } from "next";
import { ConceptAtlasClient } from "@/components/concepts/ConceptAtlasClient";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";
import { Icon } from "@/components/ui/Icon";
import { listContemplativeConcepts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Concept Atlas",
  description:
    "Trace LumenNous contemplative concepts to their distinct historical and modern source strands.",
};

export default function ConceptAtlasPage(): JSX.Element {
  const concepts = listContemplativeConcepts();

  return (
    <>
      <HorizonGlow tone="violet" />
      <div className="relative mx-auto w-full max-w-[840px]">
        <Link
          href="/learn"
          className="t-body-sm inline-flex min-h-11 items-center gap-1 font-sans font-medium text-ink-muted hover:text-ink-strong"
        >
          <Icon name="chevron-left" className="h-4 w-4" aria-hidden="true" />
          Learn
        </Link>

        <header className="mt-6">
          <p className="t-eyebrow text-violet">Sources · ideas · applications</p>
          <h1 className="t-h1 mt-2 text-ink-strong">Concept Atlas</h1>
          <p className="t-body mt-4 max-w-[62ch] text-ink-muted">
            Explore the ideas that shape LumenNous, see which texts they come from,
            and follow how historical images become bounded modern practices.
          </p>
        </header>

        <aside className="mt-6 rounded-md border border-[rgba(167,155,232,0.28)] bg-[rgba(167,155,232,0.045)] p-5">
          <p className="t-label font-sans text-ink-strong">A map, not a creed</p>
          <p className="t-body-sm mt-2 text-ink-muted">
            These concepts preserve differences between ancient texts, modern esoteric
            interpretation and LumenNous editorial application. Symbolic language is not
            evidence that the universe is conscious, communicating privately or assigning a destiny.
          </p>
        </aside>

        <ConceptAtlasClient concepts={concepts} />
      </div>
    </>
  );
}
