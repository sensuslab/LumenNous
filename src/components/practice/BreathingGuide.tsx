"use client";

import { useEffect, useState, type JSX } from "react";

/**
 * BreathingGuide (design.md §3.6, practice.md STATE B) — a slow ring that
 * swells on the in-breath and settles on the out-breath (4s in / 4s hold /
 * 6s out tempo). Under reduced motion or low-stimulation it renders a
 * static ring with a mono phase line updating each second; meaning is never
 * carried by motion or colour alone.
 */

const PHASES = [
  { label: "Breathe in", seconds: 4 },
  { label: "Hold gently", seconds: 4 },
  { label: "Breathe out", seconds: 6 },
] as const;

export function BreathingGuide({
  running,
  className = "",
}: {
  running: boolean;
  className?: string;
}): JSX.Element {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [second, setSecond] = useState(1);

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      setSecond((current) => {
        const phase = PHASES[phaseIndex] ?? PHASES[0];
        if (current >= phase.seconds) {
          setPhaseIndex((index) => (index + 1) % PHASES.length);
          return 1;
        }
        return current + 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running, phaseIndex]);

  const phase = PHASES[phaseIndex] ?? PHASES[0];

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 240 240" className="h-40 w-40 md:h-60 md:w-60">
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
            transition: "transform 4s var(--ease-breath, ease-in-out), opacity 1s ease",
            transform:
              phase.label === "Breathe in"
                ? "scale(1.12)"
                : phase.label === "Hold gently"
                  ? "scale(1.12)"
                  : "scale(1)",
            opacity: running ? 0.9 : 0.4,
          }}
        />
        <circle cx="120" cy="120" r="2.5" fill="var(--gold)" opacity="0.8" />
      </svg>
      <p className="t-meta text-ink-faint">
        {phase.label} · {second}
      </p>
      <span className="sr-only" aria-live="polite">
        {phase.label}
      </span>
    </div>
  );
}
