import Link from "next/link";
import type { JSX } from "react";
import type { Metadata } from "next";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";
import { EditorialWorkspaceClient } from "@/components/editorial/EditorialWorkspaceClient";
import { Icon } from "@/components/ui/Icon";
import { listEditorialReviewPackets } from "@/lib/editorial";

export const metadata: Metadata = {
  title: "Editorial Review Workspace",
  description:
    "Local review workflow for LumenNous source, safety and copy publication gates.",
  robots: { index: false, follow: false },
};

export default function EditorialPage(): JSX.Element {
  const packets = listEditorialReviewPackets();

  return (
    <>
      <HorizonGlow tone="violet" />
      <div className="relative mx-auto w-full max-w-[1180px]">
        <Link
          href="/learn"
          className="t-body-sm inline-flex min-h-11 items-center gap-1 font-sans font-medium text-ink-muted hover:text-ink-strong"
        >
          <Icon name="chevron-left" className="h-4 w-4" />
          Learn
        </Link>
        <header className="mt-6">
          <p className="t-eyebrow text-violet">Internal · local review tool</p>
          <h1 className="t-h1 mt-2 text-ink-strong">Editorial Review Workspace</h1>
          <p className="t-body mt-4 max-w-[70ch] text-ink-muted">
            Review source identity, rights, safety and copy before any contemplative
            concept, Create frame, pathway, prayer, affirmation, practice, prompt or
            teaching can be promoted from draft. Work stays in this browser until an
            attributable JSON record is exported.
          </p>
        </header>
        <aside className="mt-6 rounded-md border border-[rgba(232,180,160,0.28)] bg-[rgba(232,180,160,0.045)] p-5">
          <p className="t-label font-sans text-ink-strong">Fail-closed by design</p>
          <p className="t-body-sm mt-2 text-ink-muted">
            This console cannot publish the app or rewrite content files. A review record
            becomes effective only when it and the subject status are committed together
            and pass the content validator in code review.
          </p>
        </aside>

        <EditorialWorkspaceClient packets={packets} />
      </div>
    </>
  );
}
