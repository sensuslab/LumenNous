import Link from "next/link";
import type { JSX } from "react";
import type { Metadata } from "next";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";
import { MethodEvidenceNote } from "@/components/session/MethodEvidenceNote";
import { quantumPrayerMethod } from "@/data/quantum-prayer-method";
import { sessionTemplates } from "@/data/session-templates";

export const metadata: Metadata = {
  title: "Coherence Prayer Sessions",
  description:
    "Five reviewed, three-minute prayer sessions using breath, body awareness, honest intention, gratitude and release.",
};

export default function SessionsPage(): JSX.Element {
  return (
    <>
      <HorizonGlow tone="violet" />
      <div className="relative mx-auto w-full max-w-[820px]">
        <header className="mt-6 max-w-[680px]">
          <p className="t-eyebrow text-violet">Embodied coherence method</p>
          <h1 className="t-h1 mt-2 text-ink-strong">Five ways to return</h1>
          <p className="t-body mt-3 text-ink-muted">
            Each session keeps the source method&apos;s five-stage sequence and
            three-minute timed adaptation: regulate, embody, evoke, articulate
            and release.
            The language is adapted for different moments of the day without
            promising an outcome you cannot control.
          </p>
        </header>

        <ol className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-5">
          {quantumPrayerMethod.stages.map((stage, index) => (
            <li
              key={stage.id}
              className="rounded-sm border border-line-subtle bg-[rgba(230,225,211,0.025)] p-3"
            >
              <p className="t-meta text-gold">{index + 1}</p>
              <p className="t-label mt-1 font-sans text-ink-strong">
                {stage.title}
              </p>
              <p className="t-meta mt-1 text-ink-faint">{stage.seconds}s</p>
            </li>
          ))}
        </ol>

        <section aria-labelledby="session-choices" className="mt-10">
          <h2 id="session-choices" className="t-eyebrow text-ink-faint">
            Choose the moment you are in
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {sessionTemplates.map((session) => (
              <Link
                key={session.id}
                href={`/sessions/${session.slug}`}
                className="group rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet"
              >
                <GlassCard
                  interactive
                  className="h-full border-t border-t-[rgba(167,155,232,0.36)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="t-h3 text-ink-strong">{session.title}</h3>
                      <p className="t-body-sm mt-2 text-ink-muted">
                        {session.summary}
                      </p>
                    </div>
                    <Icon
                      name="arrow-up-right"
                      className="mt-1 h-4 w-4 shrink-0 text-ink-faint transition-colors group-hover:text-violet"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="t-meta mt-4 uppercase tracking-wider text-ink-faint">
                    3 minutes · sound optional
                  </p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </section>

        <MethodEvidenceNote className="mt-10" />
      </div>
    </>
  );
}
