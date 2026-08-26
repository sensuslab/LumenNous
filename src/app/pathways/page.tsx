import Link from "next/link";
import type { JSX } from "react";
import type { Metadata } from "next";
import { listContemplativePathways } from "@/lib/content";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";
import { Chip } from "@/components/ui/Chip";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Contemplative pathways",
  description:
    "Source-grounded journeys through fullness, inner light, discernment and purpose—without accounts, streaks or spiritual rank.",
};

export default function PathwaysPage(): JSX.Element {
  const pathways = listContemplativePathways();

  return (
    <>
      <HorizonGlow tone="violet" />
      <div className="relative mx-auto w-full max-w-[720px]">
        <Link
          href="/learn"
          className="t-body-sm inline-flex min-h-11 items-center gap-1 font-sans font-medium text-ink-muted hover:text-ink-strong"
        >
          <Icon name="chevron-left" className="h-4 w-4" />
          Learn
        </Link>

        <header className="mt-6">
          <p className="t-eyebrow text-violet">Teaching becomes practice</p>
          <h1 className="t-h1 mt-2 text-ink-strong">Contemplative pathways</h1>
          <p className="t-body mt-3 max-w-[56ch] text-ink-muted">
            Move through a source-grounded idea over several short activities.
            There are no streaks and no attainment levels. Optional progress
            stays in this browser.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-5">
          {pathways.map((pathway) => (
            <GlassCard key={pathway.id} as="article" interactive>
              <Link href={`/pathways/${pathway.slug}`} className="group block">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Chip kind="source" classification="MOD">
                    Guided pathway
                  </Chip>
                  <span className="t-meta inline-flex items-center gap-1 text-ink-faint">
                    <Icon name="timer" className="h-3.5 w-3.5" />
                    About {pathway.estimatedMinutes} min total
                  </span>
                </div>
                <h2 className="t-h2 mt-4 text-ink-strong">{pathway.title}</h2>
                <p className="t-label mt-1 font-sans text-violet">
                  {pathway.subtitle}
                </p>
                <p className="t-body-sm mt-3 text-ink-muted">{pathway.summary}</p>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-line-subtle pt-4">
                  <span className="t-meta text-ink-faint">
                    {pathway.stages.length} stages · draft editorial content
                  </span>
                  <span className="t-body-sm inline-flex items-center gap-1 font-sans font-medium text-ink-muted group-hover:text-violet">
                    Open pathway
                    <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </GlassCard>
          ))}
        </div>

        <p className="t-body-sm mt-8 rounded-md border border-line-subtle p-4 text-ink-muted">
          These pathways use historical and symbolic literature as material for
          contemplation. They do not prove cosmic consciousness, transmit hidden
          commands or confer spiritual authority.
        </p>
      </div>
    </>
  );
}
