import Link from "next/link";
import { notFound } from "next/navigation";
import type { JSX } from "react";
import type { Metadata } from "next";
import {
  getSessionBySlug,
  getSourcesByIds,
  listSessionTemplates,
} from "@/lib/content";
import { musicRegisterById } from "@/data/music-register";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";
import { Icon } from "@/components/ui/Icon";
import { SessionLauncher } from "@/components/session/SessionLauncher";
import { SessionMusicCard } from "@/components/session/SessionMusicCard";
import { SessionStagePreview } from "@/components/session/SessionStagePreview";
import { MethodEvidenceNote } from "@/components/session/MethodEvidenceNote";
import { SourceDrawer } from "@/components/prayer/SourceDrawer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return listSessionTemplates().map((session) => ({ slug: session.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const session = getSessionBySlug(slug);
  if (!session) return {};
  return {
    title: session.title,
    description: session.summary,
  };
}

export default async function SessionPage({
  params,
}: PageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const session = getSessionBySlug(slug);
  if (!session) notFound();

  const music = session.audioTrackIds
    .map((id) => musicRegisterById.get(id))
    .filter((item): item is NonNullable<typeof item> => item !== undefined);
  const sources = getSourcesByIds(session.sourceIds);

  return (
    <>
      <HorizonGlow tone="violet" />
      <div className="relative mx-auto w-full max-w-[760px]">
        <Link
          href="/sessions"
          className="t-body-sm inline-flex min-h-11 items-center gap-1 font-sans font-medium text-ink-muted hover:text-ink-strong"
        >
          <Icon name="chevron-left" className="h-4 w-4" aria-hidden="true" />
          All coherence sessions
        </Link>

        <header className="mt-5">
          <p className="t-eyebrow text-violet">Embodied coherence · version 1.0</p>
          <h1 className="t-h1 mt-2 text-ink-strong">{session.title}</h1>
          <p className="t-body mt-3 max-w-[58ch] text-ink-muted">
            {session.summary}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="t-meta inline-flex items-center gap-1.5 rounded-xs border border-line-subtle px-2 py-1 text-ink-faint">
              <Icon name="timer" className="h-3.5 w-3.5" aria-hidden="true" />
              3 minutes
            </span>
            <span className="t-meta rounded-xs border border-line-subtle px-2 py-1 text-ink-faint">
              five-stage sequence
            </span>
            <span className="t-meta rounded-xs border border-line-subtle px-2 py-1 text-ink-faint">
              works in silence
            </span>
          </div>
        </header>

        <section
          aria-labelledby="session-opening"
          className="glass mt-8 rounded-md border-l-2 border-l-gold p-5"
        >
          <h2 id="session-opening" className="t-eyebrow text-ink-faint">
            Opening
          </h2>
          <p className="t-prayer mt-3 italic text-ink-strong">
            {session.opening}
          </p>
        </section>

        <section aria-labelledby="session-preview" className="mt-10">
          <h2
            id="session-preview"
            className="t-eyebrow border-b border-line-subtle pb-3 text-ink-faint"
          >
            Read the whole practice before you begin
          </h2>
          <SessionStagePreview stages={session.stages} />
        </section>

        <section
          aria-labelledby="optional-sound"
          className="mt-10 border-t border-line-subtle pt-8"
        >
          <p className="t-eyebrow text-blue">Optional listening</p>
          <h2 id="optional-sound" className="t-h3 mt-2 text-ink-strong">
            Choose sound or silence before starting
          </h2>
          <p className="t-body-sm mt-2 text-ink-muted">
            {session.soundPurpose}
          </p>
          <p className="t-body-sm mt-2 text-ink-muted">{session.soundSetup}</p>
          <p className="t-meta mt-2 text-ink-faint">
            This is music-supported prayer, not professional music therapy.
            No player loads until you choose it. Only one in-page player can
            remain loaded; it can continue behind the timer and is unloaded
            when the session ends.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4">
            {music.map((item) => (
              <SessionMusicCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section
          aria-labelledby="session-accessibility"
          className="mt-10 border-t border-line-subtle pt-6"
        >
          <h2
            id="session-accessibility"
            className="t-label font-sans text-ink-strong"
          >
            Choice, access and care
          </h2>
          <p className="t-body-sm mt-2 text-ink-muted">
            {session.accessibilityNotes}
          </p>
          <p className="t-body-sm mt-3 text-ink-muted">
            {session.safetyNotes}
          </p>
        </section>

        <SessionLauncher session={session} />
        <MethodEvidenceNote className="mt-12" />
        <SourceDrawer sources={sources} className="mt-10" />
      </div>
    </>
  );
}
