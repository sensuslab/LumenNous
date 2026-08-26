"use client";

import { useEffect, useMemo, useState, type JSX } from "react";

/**
 * A slow breathing ring. The pattern is supplied by the practice: existing
 * practices retain 4–4–6 while the reviewed coherence method passes 4–2–6.
 * Meaning is available in text and never depends on animation or colour.
 */

export interface BreathPattern {
  inhaleSeconds: number;
  holdSeconds: number;
  exhaleSeconds: number;
}

export function BreathingGuide({
  running,
  pattern = { inhaleSeconds: 4, holdSeconds: 4, exhaleSeconds: 6 },
  className = "",
}: {
  running: boolean;
  pattern?: BreathPattern;
  className?: string;
}): JSX.Element {
  const [cycleSecond, setCycleSecond] = useState(0);
  const phases = useMemo(
    () =>
      [
        { label: "Breathe in", seconds: pattern.inhaleSeconds },
        ...(pattern.holdSeconds > 0
          ? [{ label: "Pause gently", seconds: pattern.holdSeconds }]
          : []),
        { label: "Breathe out", seconds: pattern.exhaleSeconds },
      ].filter((phase) => phase.seconds > 0),
    [pattern.holdSeconds, pattern.inhaleSeconds, pattern.exhaleSeconds],
  );
  const cycleLength = phases.reduce(
    (total, phase) => total + phase.seconds,
    0,
  );

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      setCycleSecond((current) =>
        cycleLength > 0 ? (current + 1) % cycleLength : 0,
      );
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running, phases, cycleLength]);

  const effectiveCycleSecond =
    cycleLength > 0 ? cycleSecond % cycleLength : 0;
  let elapsedBeforePhase = 0;
  const phase =
    phases.find((candidate) => {
      const contains =
        effectiveCycleSecond >= elapsedBeforePhase &&
        effectiveCycleSecond < elapsedBeforePhase + candidate.seconds;
      if (!contains) elapsedBeforePhase += candidate.seconds;
      return contains;
    }) ??
    phases[0] ?? {
      label: "Breathe naturally",
      seconds: 1,
    };
  const second = effectiveCycleSecond - elapsedBeforePhase + 1;

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 240 240"
        className="h-40 w-40 md:h-60 md:w-60"
      >
        <circle
          cx="120"
          cy="120"
          r="88"
          fill="none"
          stroke="rgba(230,225,211,0.1)"
          strokeWidth="1"
        />
        <circle
          cx="120"
          cy="120"
          r="88"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="553"
          className="breath-ring"
          data-phase={phase.label}
          style={{
            transformOrigin: "120px 120px",
            transition: `transform ${phase.seconds}s var(--ease-breath, ease-in-out), opacity 1s ease`,
            transform:
              phase.label === "Breathe in" || phase.label === "Pause gently"
                ? "scale(1.12)"
                : "scale(1)",
            opacity: running ? 0.9 : 0.4,
          }}
        />
        <circle cx="120" cy="120" r="2.5" fill="var(--gold)" opacity="0.8" />
      </svg>
      <p className="t-meta text-ink-faint" aria-live="off">
        {phase.label} · {second}
      </p>
      <span className="sr-only" aria-live="polite">
        {phase.label}
      </span>
    </div>
  );
}
