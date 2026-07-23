import Link from "next/link";
import type { JSX } from "react";
import type { EngineResult, Source } from "@/lib/schemas";
import { Chip } from "@/components/ui/Chip";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";
import { SourceBadge } from "@/components/prayer/SourceBadge";
import { CopyButton, ShareButton } from "@/components/prayer/ShareButton";
import { TraditionLabelGroup } from "@/components/prayer/TraditionLabel";

export function EngineResultCard({
  result,
  sources,
  categorySlug,
  coherenceSessionHref,
  onCreateAnother,
  onEditRequest,
}: {
  result: EngineResult;
  sources: readonly Source[];
  categorySlug: string;
  coherenceSessionHref: string | null;
  onCreateAnother: () => void;
  onEditRequest: () => void;
}): JSX.Element {
  const fullText = [
    result.opening,
    result.prayer,
    result.affirmation,
    ...result.practiceSteps,
    ...result.reflectionPrompts,
    result.closing,
  ]
    .filter(Boolean)
    .join("\n\n");

  return (
    <article id="engine-result" tabIndex={-1} className="mt-8 scroll-mt-24 focus:outline-none">
      <GlassCard hero className="border-[rgba(167,155,232,0.3)]">
        <p className="t-label flex items-center gap-2 font-sans text-ok">
          <Icon name="check" className="h-4 w-4" aria-hidden="true" />
          Your practice is ready
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Chip kind="source" classification="EDIT">ASSEMBLED ON THIS DEVICE</Chip>
          <TraditionLabelGroup labels={result.traditionLabels} />
        </div>
        <p className="t-meta mt-2 text-ink-faint">
          Corpus-grounded library cycle {result.recipe.cycle}
        </p>

        <h2 className="t-h1 mt-4 text-ink-strong">{result.title}</h2>
        <Link
          href={`/explore/${categorySlug}`}
          className="t-meta mt-1 inline-flex min-h-11 items-center uppercase tracking-wider text-ink-muted underline-offset-4 hover:text-ink-strong hover:underline"
        >
          {result.category}
        </Link>

        {result.opening || result.prayer ? (
          <div className="mt-4 border-t border-line pt-6">
            {result.opening ? <p className="t-prayer italic text-ink-strong">{result.opening}</p> : null}
            {result.prayer ? (
              <div className="t-prayer mt-4 space-y-4 text-ink-strong">
                {result.prayer.split(/\n{2,}/).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {result.affirmation ? (
          <p className="t-prayer-sm mt-6 border-l-2 border-violet bg-[rgba(167,155,232,0.055)] px-5 py-5 italic text-ink-strong">
            &ldquo;{result.affirmation}&rdquo;
          </p>
        ) : null}

        {result.practiceSteps.length > 0 ? (
          <section className="mt-6 border-t border-line pt-6" aria-labelledby="practice-steps-heading">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 id="practice-steps-heading" className="t-label font-sans text-ink-strong">Practice steps</h3>
              <p className="t-meta inline-flex items-center gap-1.5 rounded-xs border border-line px-2 py-1 text-ink-muted">
                <Icon name="timer" className="h-3.5 w-3.5" aria-hidden="true" />
                About {result.practiceDuration} minutes
              </p>
            </div>
            <ol className="mt-4 space-y-4">
              {result.practiceSteps.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span aria-hidden="true" className="t-meta flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-[rgba(167,155,232,0.38)] bg-[rgba(167,155,232,0.07)] text-violet">
                    {index + 1}
                  </span>
                  <p className="t-body-sm pt-1.5 text-ink">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {result.reflectionPrompts.length > 0 ? (
          <section className="mt-6 border-t border-line pt-6" aria-labelledby="reflection-heading">
            <h3 id="reflection-heading" className="t-label font-sans text-ink-strong">For quiet reflection</h3>
            <div className="mt-3 space-y-3 border-l-2 border-[rgba(217,186,133,0.38)] pl-4">
              {result.reflectionPrompts.map((prompt, index) => (
                <p key={index} className="t-prayer-sm italic text-ink">{prompt}</p>
              ))}
            </div>
          </section>
        ) : null}

        {result.closing ? (
          <p className="t-prayer mt-6 border-t border-line pt-6 text-ink-strong">{result.closing}</p>
        ) : null}

        {result.safetyNote ? (
          <aside className="mt-6 rounded-md border border-[rgba(232,180,160,0.3)] bg-[rgba(232,180,160,0.05)] p-4">
            <p className="t-label font-sans text-ink-strong">Care note</p>
            <p className="t-body-sm mt-1 text-ink-muted">{result.safetyNote}</p>
          </aside>
        ) : null}

        {sources.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-1.5 border-t border-line pt-6">
            {sources.map((source) => <SourceBadge key={source.id} source={source} />)}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-5">
          <ShareButton title={result.title} text={fullText} />
          <CopyButton text={fullText} label="Copy this composition" />
        </div>

        <div className="mt-5 border-t border-line pt-5">
          <p className="t-eyebrow text-ink-faint">What next</p>
          {coherenceSessionHref ? (
            <Link
              href={coherenceSessionHref}
              className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-sm border border-[rgba(167,155,232,0.44)] bg-[rgba(167,155,232,0.08)] px-5 font-sans text-sm font-semibold text-ink-strong hover:border-[rgba(167,155,232,0.68)]"
            >
              <Icon name="orbit" className="h-4 w-4 text-violet" aria-hidden="true" />
              Open the timed five-stage session
            </Link>
          ) : null}
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={onCreateAnother}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-pearl-fill px-5 font-sans text-sm font-semibold text-bg-1 transition-colors duration-200 hover:bg-pearl-fill-hover"
            >
              <Icon name="spark" className="h-4 w-4" aria-hidden="true" />
              Create another
            </button>
            <button
              type="button"
              onClick={onEditRequest}
              className="field-surface inline-flex min-h-12 items-center justify-center rounded-sm px-5 font-sans text-sm font-semibold text-ink-strong transition-colors duration-200 hover:border-line-strong"
            >
              Adjust request
            </button>
          </div>
        </div>
      </GlassCard>
    </article>
  );
}
