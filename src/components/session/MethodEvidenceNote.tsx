import type { JSX } from "react";
import { quantumPrayerMethod } from "@/data/quantum-prayer-method";

export function MethodEvidenceNote({
  className = "",
}: {
  className?: string;
}): JSX.Element {
  return (
    <aside
      aria-labelledby="method-evidence-title"
      className={`rounded-md border border-[rgba(143,176,234,0.28)] bg-[rgba(143,176,234,0.045)] p-5 ${className}`}
    >
      <h2 id="method-evidence-title" className="t-label font-sans text-ink-strong">
        What “coherence” means here
      </h2>
      <p className="t-body-sm mt-2 text-ink-muted">
        In this app, coherence means bringing breath, body, felt quality, words
        and action into better alignment. Slow breathing can affect arousal and
        attention; it does not prove that consciousness controls quantum events.
      </p>
      <details className="mt-3">
        <summary className="inline-flex min-h-11 cursor-pointer items-center font-sans text-sm font-medium text-blue">
          Read the evidence boundary
        </summary>
        <p className="t-body-sm pb-1 text-ink-muted">
          {quantumPrayerMethod.evidenceBoundary}
        </p>
      </details>
    </aside>
  );
}
