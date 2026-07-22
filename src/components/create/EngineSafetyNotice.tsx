import type { JSX } from "react";
import type { EngineResult } from "@/lib/schemas";
import { Icon } from "@/components/ui/Icon";

export function EngineSafetyNotice({
  result,
  onReset,
}: {
  result: EngineResult;
  onReset: () => void;
}): JSX.Element {
  return (
    <section
      aria-labelledby="safety-heading"
      className="mt-8 rounded-md border border-[rgba(232,180,160,0.4)] bg-[rgba(232,180,160,0.06)] p-6"
    >
      <p className="flex items-center gap-2 font-sans text-sm font-semibold text-safety">
        <Icon name="shield-quiet" className="h-4 w-4" aria-hidden="true" />
        Before anything else
      </p>
      <h2 id="safety-heading" className="t-h2 mt-3 text-ink-strong">{result.title}</h2>
      {result.safetyLevel === "crisis" ? (
        <div aria-label="Crisis support lines" className="mt-4 grid gap-2 sm:grid-cols-2">
            <a
              href="tel:116123"
              className="inline-flex min-h-14 flex-col items-center justify-center rounded-sm bg-pearl-fill px-4 py-2 text-center font-sans font-semibold text-bg-1 transition-colors duration-200 hover:bg-pearl-fill-hover"
            >
              <span>Call Samaritans</span>
              <span className="text-xs font-medium">UK &amp; Ireland · 116 123</span>
            </a>
            <a
              href="tel:988"
              className="glass inline-flex min-h-14 flex-col items-center justify-center rounded-sm px-4 py-2 text-center font-sans font-semibold text-ink-strong transition-colors duration-200 hover:border-line-strong"
            >
              <span>Call 988 Lifeline</span>
              <span className="text-xs font-medium text-ink-muted">United States · 988</span>
            </a>
        </div>
      ) : null}
      <div className="t-body mt-4 space-y-4 whitespace-pre-line text-ink">
        <p className="italic">{result.opening}</p>
        <p>{result.prayer}</p>
        <p>{result.closing}</p>
      </div>
      <p className="t-body-sm mt-5 border-t border-[rgba(232,180,160,0.25)] pt-4 text-ink-muted">
        {result.safetyNote}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="t-body-sm mt-5 inline-flex min-h-11 items-center px-3 font-sans font-medium text-ink-muted underline-offset-4 hover:text-ink-strong hover:underline"
      >
        Return to Create
      </button>
    </section>
  );
}
