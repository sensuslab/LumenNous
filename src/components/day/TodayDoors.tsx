import Link from "next/link";
import type { JSX, ReactNode } from "react";
import type { AudioItem } from "@/lib/schemas";
import type { DailyRuleOfLife } from "@/lib/rule-of-life";
import { AudioCard } from "@/components/media/AudioCard";
import { Icon } from "@/components/ui/Icon";

function Door({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <details className="group border-b border-line-subtle last:border-b-0">
      <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 focus-visible:outline-none">
        <span>
          <span className="t-eyebrow block text-ink-faint">{label}</span>
          <span className="t-h3 mt-1 block text-ink-strong">{title}</span>
        </span>
        <Icon
          name="chevron-down"
          className="h-4 w-4 shrink-0 text-ink-muted transition-transform duration-200 group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  );
}

export function TodayDoors({
  rule,
  audio,
}: {
  rule: DailyRuleOfLife;
  audio: AudioItem | undefined;
}): JSX.Element {
  return (
    <section aria-labelledby="optional-doors-heading" className="content-surface rounded-md px-5 md:px-6">
      <header className="border-b border-line-subtle py-5">
        <p className="t-eyebrow text-violet">Five optional doors</p>
        <h2 id="optional-doors-heading" className="t-h2 mt-2 text-ink-strong">
          The prayer is already complete.
        </h2>
        <p className="t-body-sm mt-2 max-w-[58ch] text-ink-muted">
          Open only what helps. Nothing here is tracked, and leaving every door closed does not make the day incomplete.
        </p>
      </header>

      <Door label="01 · Word" title="A believable line with a next act">
        {rule.affirmation ? (
          <>
            <p className="t-prayer-sm text-ink-strong">{rule.affirmation.text}</p>
            <div className="mt-4 border-l-2 border-violet pl-4">
              <p className="t-eyebrow text-ink-faint">Back it with</p>
              <p className="t-body-sm mt-2 text-ink">{rule.affirmation.backingActHint}</p>
            </div>
          </>
        ) : (
          <p className="t-body-sm text-ink-muted">No line is required today.</p>
        )}
      </Door>

      <Door label="02 · Inner reading" title="One idea, not a verdict">
        {rule.teaching ? (
          <>
            <p className="t-label font-sans text-ink-strong">{rule.teaching.title}</p>
            <p className="t-body-sm mt-2 text-ink-muted">{rule.teaching.summary}</p>
            <Link
              href={`/learn/${rule.teaching.slug}`}
              className="t-body-sm mt-3 inline-flex min-h-11 items-center text-violet underline-offset-4 hover:underline"
            >
              Read the labelled guide
            </Link>
          </>
        ) : (
          <p className="t-body-sm text-ink-muted">Keep only the words that remain honest under reflection.</p>
        )}
        <p className="t-prayer-sm mt-4 border-t border-line-subtle pt-4 italic text-ink">
          {rule.prompt?.text ?? "What does this name in your life today?"}
        </p>
      </Door>

      <Door label="03 · Listening" title="Sound is optional; silence is complete">
        {audio ? (
          <AudioCard item={audio} variant="compact" />
        ) : (
          <p className="t-body-sm text-ink-muted">
            No track is assigned to today&apos;s prayer. Silence is not a missing condition.
          </p>
        )}
        <Link
          href="/listen"
          className="t-body-sm mt-3 inline-flex min-h-11 items-center gap-1 text-ink-muted underline-offset-4 hover:text-ink-strong hover:underline"
        >
          Browse reviewed listening
          <Icon name="arrow-up-right" className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </Door>

      <Door label="04 · Close a tap" title="Spend less attention on one leak">
        <p className="t-body text-ink">{rule.closePrompt}</p>
        <p className="t-meta mt-3 text-ink-faint">This is a choice, not a purity score.</p>
      </Door>

      <Door label="05 · When lit" title="Reduce the demand and find company">
        <p className="t-body-sm text-ink-muted">
          If everything feels amplified, you do not need a stronger practice. Use a fixed companion path that asks for ordinary facts, postpones avoidable major decisions and points toward trusted human support.
        </p>
        <Link
          href="/when-lit"
          className="t-body-sm mt-3 inline-flex min-h-11 items-center font-sans font-medium text-safety underline-offset-4 hover:underline"
        >
          Open When lit support
        </Link>
      </Door>
    </section>
  );
}
