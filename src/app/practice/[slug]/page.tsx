import Link from "next/link";
import { notFound } from "next/navigation";
import type { JSX } from "react";
import type { Metadata } from "next";
import {
  getAudioById,
  getCategoryById,
  getPracticeBySlug,
  getPromptsByCategory,
  getSourcesByIds,
  listPractices,
} from "@/lib/content";
import { PracticeLauncher } from "@/components/practice/PracticeLauncher";
import { FavouriteButton } from "@/components/prayer/FavouriteButton";
import { ShareButton } from "@/components/prayer/ShareButton";
import { SafetyNotice } from "@/components/prayer/SafetyNotice";
import { SourceDrawer } from "@/components/prayer/SourceDrawer";
import { AudioCard } from "@/components/media/AudioCard";
import { Icon } from "@/components/ui/Icon";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";

/**
 * Practice — `/practice/[slug]` (practice.md STATE A). Detail/preparation
 * screen: everything about the practice is readable before starting —
 * nothing is a surprise; that is a trust requirement.
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return listPractices().map((practice) => ({ slug: practice.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const practice = getPracticeBySlug(slug);
  if (!practice) return {};
  return { title: practice.title, description: practice.preparation };
}

export default async function PracticePage({ params }: PageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const practice = getPracticeBySlug(slug);
  if (!practice) notFound();

  const category = practice.categoryIds.length > 0 ? getCategoryById(practice.categoryIds[0] ?? "") : undefined;
  const sources = getSourcesByIds(practice.sourceIds);
  const audio = practice.audioIds
    .map((id) => getAudioById(id))
    .filter((item): item is NonNullable<typeof item> => item !== undefined)
    .slice(0, 2);
  const prompt = category ? getPromptsByCategory(category.id)[0] : undefined;

  return (
    <>
      <HorizonGlow tone="violet" />
      <div className="relative mx-auto w-full max-w-[720px]">
        <div className="flex items-center justify-between gap-3">
          <Link
            href={category ? `/explore/${category.slug}` : "/explore"}
            className="t-body-sm inline-flex min-h-11 items-center gap-1 font-sans font-medium text-ink-muted hover:text-ink-strong"
          >
            <Icon name="chevron-left" className="h-4 w-4" aria-hidden="true" />
            {category ? category.name : "Explore"}
          </Link>
          <div className="flex items-center gap-1.5">
            <FavouriteButton
              item={{
                id: practice.id,
                type: "practice",
                title: practice.title,
                href: `/practice/${practice.slug}`,
                addedAt: new Date().toISOString(),
              }}
            />
            <ShareButton title={practice.title} text={practice.preparation} />
          </div>
        </div>

        <header className="mt-6">
          <p className="t-eyebrow uppercase tracking-wider text-gold">
            {practice.practiceType} practice
          </p>
          <h1 className="t-h1 mt-2 text-ink-strong">{practice.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="t-meta inline-flex items-center gap-1.5 rounded-xs border border-line-subtle px-2 py-1 text-ink-faint">
              <Icon name="timer" className="h-3.5 w-3.5" aria-hidden="true" />
              {practice.durationOptions.join(" · ")} min
            </span>
            <span className="t-meta rounded-xs border border-line-subtle px-2 py-1 text-ink-faint">
              {practice.steps.length} steps
            </span>
          </div>
        </header>

        <section aria-labelledby="preparation" className="glass mt-8 rounded-md p-5">
          <h2 id="preparation" className="t-eyebrow text-ink-faint">
            Before you begin
          </h2>
          <p className="t-body mt-3 text-ink">{practice.preparation}</p>
        </section>

        <section aria-labelledby="steps-preview" className="mt-10">
          <h2 id="steps-preview" className="t-eyebrow border-b border-line-subtle pb-3 text-ink-faint">
            The practice, step by step — read it all first if you like
          </h2>
          <ol className="mt-4 space-y-5">
            {practice.steps.map((step, stepIndex) => (
              <li key={step.title} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="t-meta flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-line-subtle text-ink-faint"
                >
                  {stepIndex + 1}
                </span>
                <div>
                  <h3 className="t-label font-sans text-ink-strong">{step.title}</h3>
                  <p className="t-body-sm mt-1 text-ink-muted">{step.instruction}</p>
                  <p className="t-meta mt-1 text-ink-faint">about {step.seconds} seconds</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="accessibility" className="mt-10 border-t border-line-subtle pt-6">
          <h2 id="accessibility" className="t-label font-sans text-ink-strong">
            Accessibility
          </h2>
          <p className="t-body-sm mt-2 text-ink-muted">{practice.accessibilityNotes}</p>
        </section>

        <SafetyNotice
          flags={category?.safetyFlags ?? ["none"]}
          note={practice.safetyNotes}
          className="mt-6"
        />

        <PracticeLauncher
          practice={practice}
          reflectionPrompt={prompt?.text ?? null}
          listeningHref={audio[0]?.url ? audio[0].url : null}
        />

        {audio.length > 0 ? (
          <section aria-labelledby="companion-listening" className="mt-12">
            <h2 id="companion-listening" className="t-eyebrow text-blue">
              Companion listening — optional
            </h2>
            <div className="mt-4 space-y-4">
              {audio.map((item) => (
                <AudioCard key={item.id} item={item} variant="compact" />
              ))}
            </div>
          </section>
        ) : null}

        <SourceDrawer sources={sources} className="mt-10" />
      </div>
    </>
  );
}
