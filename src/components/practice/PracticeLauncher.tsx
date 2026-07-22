"use client";

import { useState, type JSX } from "react";
import type { Practice } from "@/lib/schemas";
import { PracticePlayer } from "./PracticePlayer";

/**
 * PracticeLauncher (practice.md §A5 + A7) — duration selector (segmented
 * control, selection persisted for the session) and the Begin block that
 * enters player mode. Rendered as an island inside the server-rendered
 * practice detail page.
 */

export function PracticeLauncher({
  practice,
  reflectionPrompt,
  listeningHref,
}: {
  practice: Practice;
  reflectionPrompt: string | null;
  listeningHref: string | null;
}): JSX.Element {
  const defaultMinutes =
    practice.durationOptions[Math.min(1, practice.durationOptions.length - 1)] ??
    practice.durationOptions[0] ??
    5;
  const [minutes, setMinutes] = useState(defaultMinutes);
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <PracticePlayer
        practice={practice}
        minutes={minutes}
        reflectionPrompt={reflectionPrompt}
        listeningHref={listeningHref}
        onExit={() => setPlaying(false)}
      />
    );
  }

  return (
    <section aria-labelledby="duration-label" className="mt-10 text-center">
      <p id="duration-label" className="t-eyebrow text-ink-faint">
        How long do you have?
      </p>
      <div
        role="group"
        aria-label="Choose practice duration"
        className="mt-3 inline-flex overflow-hidden rounded-sm border border-line-subtle"
      >
        {practice.durationOptions.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={minutes === option}
            onClick={() => setMinutes(option)}
            className={`min-h-12 min-w-20 px-4 font-sans text-sm font-semibold transition-colors duration-200 ease-std ${
              minutes === option
                ? "bg-[rgba(217,186,133,0.08)] text-ink-strong"
                : "text-ink-muted hover:text-ink-strong"
            }`}
          >
            {option} min
          </button>
        ))}
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="inline-flex min-h-12 min-w-60 items-center justify-center rounded-sm bg-pearl-fill px-6 font-sans text-[0.9375rem] font-semibold text-bg-1 transition-[transform,filter,background-color] duration-[120ms] ease-std hover:bg-pearl-fill-hover active:scale-[0.98]"
        >
          Begin practice — about {minutes} min
        </button>
        <p className="t-body-sm mt-3 text-ink-muted">
          Or read through it quietly above, at your own pace.
        </p>
      </div>
    </section>
  );
}
