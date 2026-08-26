"use client";

import { useCallback, useEffect, useRef, useState, type JSX } from "react";
import Link from "next/link";
import type { Practice } from "@/lib/schemas";
import { BreathingGuide } from "./BreathingGuide";
import { FavouriteButton } from "@/components/prayer/FavouriteButton";
import { Icon } from "@/components/ui/Icon";

/**
 * PracticePlayer (practice.md STATE B) — distraction-minimised full-screen
 * takeover. Pause/resume, prev/next, optional timer, optional gentle sound
 * cue (off by default), wake-lock where available, non-shaming exit sheet,
 * completion state with closing + reflection. Never asks the user to write
 * anything. Keyboard: Space = pause/resume, ← → = steps, Esc = exit flow.
 */

interface PlayerProps {
  practice: Practice;
  /** Chosen duration in minutes; step timings are scaled to fit. */
  minutes: number;
  /** One reflection prompt for the closing state. */
  reflectionPrompt: string | null;
  /** First companion listening url, if any. */
  listeningHref: string | null;
  onExit: () => void;
}

type WakeLockSentinelLike = { release: () => Promise<void> };

function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function PracticePlayer({
  practice,
  minutes,
  reflectionPrompt,
  listeningHref,
  onExit,
}: PlayerProps): JSX.Element {
  const steps = practice.steps;
  const totalRawSeconds = steps.reduce((sum, step) => sum + step.seconds, 0);
  const scale = (minutes * 60) / Math.max(totalRawSeconds, 1);
  const stepSeconds = steps.map((step) => Math.max(5, Math.round(step.seconds * scale)));

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [remaining, setRemaining] = useState(stepSeconds[0] ?? 60);
  const [confirmingExit, setConfirmingExit] = useState(false);
  const [complete, setComplete] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [awayPaused, setAwayPaused] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const wakeLockRef = useRef<WakeLockSentinelLike | null>(null);
  const endButtonRef = useRef<HTMLButtonElement | null>(null);

  const current = steps[index];
  const isBreath = practice.practiceType === "breath";
  const progress = (index + 1) / steps.length;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    endButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  /* ---- gentle sound cue: soft sine chime, off by default ---- */
  const chime = useCallback((): void => {
    if (!soundOn || typeof window === "undefined") return;
    try {
      audioContextRef.current ??= new AudioContext();
      const context = audioContextRef.current;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      // An ordinary C5 interface cue, with no therapeutic-frequency claim.
      oscillator.frequency.value = 523.25;
      gain.gain.setValueAtTime(0.06, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.9);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 1);
    } catch {
      /* audio unavailable — stay silent */
    }
  }, [soundOn]);

  /* ---- wake lock: silent failure, simply omitted ---- */
  useEffect(() => {
    let cancelled = false;
    async function acquire(): Promise<void> {
      try {
        const nav = navigator as Navigator & {
          wakeLock?: { request: (type: string) => Promise<WakeLockSentinelLike> };
        };
        if (nav.wakeLock) {
          const sentinel = await nav.wakeLock.request("screen");
          if (!cancelled) wakeLockRef.current = sentinel;
        }
      } catch {
        /* wake lock unavailable — no error surfaced, per contract */
      }
    }
    void acquire();
    return () => {
      cancelled = true;
      void wakeLockRef.current?.release().catch(() => undefined);
      wakeLockRef.current = null;
    };
  }, []);

  /* ---- step countdown + auto-advance ---- */
  useEffect(() => {
    if (paused || complete) return;
    const interval = window.setInterval(() => {
      setRemaining((current) => {
        if (current > 1) return current - 1;
        if (index < steps.length - 1) {
          chime();
          setIndex(index + 1);
          return stepSeconds[index + 1] ?? 60;
        }
        setComplete(true);
        chime();
        return 0;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [paused, complete, index, steps.length, stepSeconds, chime]);

  /* ---- tab hidden → auto-pause; resume requires a tap ---- */
  useEffect(() => {
    function onVisibility(): void {
      if (document.hidden && !paused && !complete) {
        setPaused(true);
        setAwayPaused(true);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [paused, complete]);

  const goTo = useCallback(
    (next: number): void => {
      const clamped = Math.min(Math.max(next, 0), steps.length - 1);
      setIndex(clamped);
      setRemaining(stepSeconds[clamped] ?? 60);
    },
    [steps.length, stepSeconds],
  );

  const requestExit = useCallback((): void => setConfirmingExit(true), []);

  /* ---- keyboard bindings ---- */
  useEffect(() => {
    function onKey(event: KeyboardEvent): void {
      if (event.key === " ") {
        event.preventDefault();
        setPaused((value) => !value);
        setAwayPaused(false);
      } else if (event.key === "ArrowRight") {
        if (index === steps.length - 1) setComplete(true);
        else goTo(index + 1);
      } else if (event.key === "ArrowLeft") {
        goTo(index - 1);
      } else if (event.key === "Escape") {
        requestExit();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, steps.length, goTo, requestExit]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Practice player: ${practice.title}`}
      className="fixed inset-0 z-[70] flex flex-col bg-bg-player"
    >
      <h1 className="sr-only">Guided practice: {practice.title}</h1>

      {/* top bar */}
      <div className="flex h-14 shrink-0 items-center justify-between px-4 pt-[env(safe-area-inset-top)]">
        <button
          ref={endButtonRef}
          type="button"
          onClick={requestExit}
          className="inline-flex min-h-11 items-center gap-1.5 px-2 font-sans text-sm font-medium text-ink-muted hover:text-ink-strong"
        >
          <Icon name="x" className="h-4 w-4" aria-hidden="true" />
          End
        </button>
        <p className="t-meta max-w-[50%] truncate uppercase tracking-wider text-ink-muted">
          {practice.title}
        </p>
        <button
          type="button"
          onClick={() => setSoundOn((value) => !value)}
          aria-pressed={soundOn}
          aria-label={soundOn ? "Turn sound cue off" : "Turn gentle sound cue on"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-muted hover:text-ink-strong"
        >
          <Icon name="bell" className={`h-5 w-5 ${soundOn ? "text-gold" : ""}`} aria-hidden="true" />
        </button>
      </div>

      {/* main */}
      {!complete ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
          <p className="t-meta text-ink-faint" aria-live="polite">
            Step {index + 1} of {steps.length}
          </p>

          <div aria-live="polite" className="max-w-[34ch] text-center">
            <p className="t-label font-sans text-ink-muted">{current?.title}</p>
            <p className="t-prayer mt-3 text-ink-strong">{current?.instruction}</p>
          </div>

          {isBreath ? <BreathingGuide running={!paused} /> : null}

          <p className="t-meta text-ink-faint">
            {awayPaused ? "Paused while you were away — tap resume when ready." : "Advances on its own — pause anytime."}
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
          <p className="t-prayer max-w-[34ch] text-ink-strong">{practice.closing}</p>
          {reflectionPrompt ? (
            <div className="mt-2 max-w-[36ch]">
              <p className="t-eyebrow text-ink-faint">For reflection — no answer needed</p>
              <p className="t-prayer-sm mt-3 italic text-ink">{reflectionPrompt}</p>
            </div>
          ) : null}
          <p className="t-meta mt-2 text-ink-faint">Nothing was recorded. This moment stayed with you.</p>
        </div>
      )}

      {/* progress dashes */}
      <div className="flex shrink-0 items-center justify-center gap-1.5 py-4" aria-hidden="true">
        {steps.map((step, dashIndex) => (
          <span
            key={step.title}
            className={`h-0.5 w-6 rounded-full transition-colors duration-300 ${
              dashIndex < index || complete ? "bg-gold" : dashIndex === index ? "animate-pulse bg-gold/70" : "bg-line"
            }`}
          />
        ))}
      </div>

      {/* controls */}
      {!complete ? (
        <div className="flex shrink-0 items-center justify-center gap-6 pb-[calc(env(safe-area-inset-bottom)+24px)]">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous step"
            className="glass inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-colors duration-200 hover:text-ink-strong disabled:opacity-40"
          >
            <Icon name="skip-back" className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              setPaused((value) => !value);
              setAwayPaused(false);
            }}
            aria-label={paused ? "Resume" : "Pause"}
            className="glass inline-flex h-14 w-14 items-center justify-center rounded-full border-line-strong text-ink-strong"
          >
            <Icon name={paused ? "play" : "pause"} className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => (index === steps.length - 1 ? setComplete(true) : goTo(index + 1))}
            aria-label={index === steps.length - 1 ? "Complete practice" : "Next step"}
            className="glass inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-colors duration-200 hover:text-ink-strong"
          >
            <Icon name={index === steps.length - 1 ? "check" : "skip-forward"} className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div className="flex shrink-0 flex-col items-center gap-3 px-6 pb-[calc(env(safe-area-inset-bottom)+24px)]">
          <Link
            href="/"
            className="inline-flex min-h-12 min-w-60 items-center justify-center rounded-sm bg-pearl-fill px-6 font-sans text-[0.9375rem] font-semibold text-bg-1 transition-colors duration-200 hover:bg-pearl-fill-hover"
          >
            Return to Today
          </Link>
          <div className="flex items-center gap-3">
            <FavouriteButton
              item={{
                id: practice.id,
                type: "practice",
                title: practice.title,
                href: `/practice/${practice.slug}`,
                addedAt: new Date().toISOString(),
              }}
            />
            {listeningHref ? (
              <a
                href={listeningHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 px-3 font-sans text-sm font-medium text-ink-muted underline-offset-4 hover:text-ink-strong hover:underline"
              >
                Companion listening
                <Icon name="arrow-up-right" className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>
      )}

      {/* timer readout */}
      {!complete ? (
        <p
          className={`pointer-events-none absolute bottom-[calc(env(safe-area-inset-bottom)+88px)] left-1/2 -translate-x-1/2 font-mono text-sm tabular-nums ${
            paused ? "text-ink-faint" : "text-ink-muted"
          }`}
          aria-hidden="true"
        >
          {formatClock(remaining)}
          {paused ? " · paused" : ""}
        </p>
      ) : null}

      {/* exit confirmation — never guilt copy */}
      {confirmingExit ? (
        <div
          role="alertdialog"
          aria-label="Pause here?"
          className="absolute inset-x-0 bottom-0 z-10 rounded-t-lg border-t border-line bg-bg-3 p-6 pb-[calc(env(safe-area-inset-bottom)+24px)]"
        >
          <p className="t-h3 text-ink-strong">Pause here?</p>
          <p className="t-body-sm mt-2 text-ink-muted">
            {progress >= 0.8
              ? "You're nearly at the close — but stopping now is still a complete practice."
              : "You can stop at any time. Even a moment of quiet is enough."}
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setConfirmingExit(false)}
              className="inline-flex min-h-12 items-center justify-center rounded-sm bg-pearl-fill px-6 font-sans text-[0.9375rem] font-semibold text-bg-1 transition-colors duration-200 hover:bg-pearl-fill-hover"
            >
              Keep practicing
            </button>
            <button
              type="button"
              onClick={onExit}
              className="inline-flex min-h-12 items-center justify-center rounded-sm px-6 font-sans text-[0.9375rem] font-medium text-ink-muted hover:text-ink-strong"
            >
              End for now
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
