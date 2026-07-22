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
  onCreateAnother,
  onEditRequest,
}: {
  result: EngineResult;
  sources: readonly Source[];
  categorySlug: string;
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
    <article className="mt-8">
      <GlassCard hero>
        <div className="flex flex-wrap items-center gap-2">
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
          <div className="mt-4 border-t border-line-subtle pt-6">
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
          <p className="t-prayer-sm mt-6 border-t border-line-subtle pt-6 text-center italic text-ink">
            &ldquo;{result.affirmation}&rdquo;
          </p>
        ) : null}

        {result.practiceSteps.length > 0 ? (
          <section className="mt-6 border-t border-line-subtle pt-6" aria-labelledby="practice-steps-heading">
            <p id="practice-steps-heading" className="t-meta inline-flex items-center gap-1.5 rounded-xs border border-line-subtle px-2 py-1 text-ink-faint">
              <Icon name="timer" className="h-3.5 w-3.5" aria-hidden="true" />
              About {result.practiceDuration} minutes
            </p>
            <ol className="mt-4 space-y-4">
              {result.practiceSteps.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span aria-hidden="true" className="t-meta flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-line-subtle text-ink-faint">
                    {index + 1}
                  </span>
                  <p className="t-body-sm pt-1.5 text-ink-muted">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {result.reflectionPrompts.length > 0 ? (
          <section className="mt-6 space-y-3 border-t border-line-subtle pt-6" aria-labelledby="reflection-heading">
            <p id="reflection-heading" className="t-eyebrow text-ink-faint">For quiet reflection</p>
            {result.reflectionPrompts.map((prompt, index) => (
              <p key={index} className="t-prayer-sm italic text-ink">{prompt}</p>
            ))}
          </section>
        ) : null}

        {result.closing ? (
          <p className="t-prayer mt-6 border-t border-line-subtle pt-6 text-ink-strong">{result.closing}</p>
        ) : null}

        {result.safetyNote ? (
          <aside className="mt-6 rounded-md border border-[rgba(232,180,160,0.3)] bg-[rgba(232,180,160,0.05)] p-4">
            <p className="t-label font-sans text-ink-strong">Care note</p>
            <p className="t-body-sm mt-1 text-ink-muted">{result.safetyNote}</p>
          </aside>
        ) : null}

        {sources.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-1.5 border-t border-line-subtle pt-6">
            {sources.map((source) => <SourceBadge key={source.id} source={source} />)}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line-subtle pt-4">
          <ShareButton title={result.title} text={fullText} />
          <CopyButton text={fullText} label="Copy this composition" />
          <div className="ml-auto flex flex-wrap items-center justify-end">
            <button
              type="button"
              onClick={onEditRequest}
              className="t-body-sm inline-flex min-h-11 items-center px-3 font-sans font-medium text-ink-muted underline-offset-4 hover:text-ink-strong hover:underline"
            >
              Adjust request
            </button>
            <button
              type="button"
              onClick={onCreateAnother}
              className="t-body-sm inline-flex min-h-11 items-center px-3 font-sans font-medium text-violet underline-offset-4 hover:text-ink-strong hover:underline"
            >
              Create another
            </button>
          </div>
        </div>
      </GlassCard>
    </article>
  );
}
