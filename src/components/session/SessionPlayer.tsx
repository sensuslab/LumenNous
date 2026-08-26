"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type JSX,
} from "react";
import { createPortal } from "react-dom";
import type { SessionTemplate } from "@/lib/schemas";
import {
  GROUNDING_REGULATION_INSTRUCTION,
  GROUNDING_REGULATION_PROMPT,
} from "@/lib/coherence";
import { SESSION_MEDIA_STOP_EVENT } from "@/lib/media-events";
import { BreathingGuide } from "@/components/practice/BreathingGuide";
import { Icon } from "@/components/ui/Icon";
import { StageTimeline } from "./StageTimeline";

type WakeLockSentinelLike = { release: () => Promise<void> };

function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function trapTabKey(
  event: ReactKeyboardEvent<HTMLElement>,
  container: HTMLElement | null,
): void {
  if (event.key !== "Tab" || !container) return;
  const focusable = [
    ...container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ].filter((element) => !element.hasAttribute("inert"));
  if (focusable.length === 0) {
    event.preventDefault();
    container.focus();
    return;
  }
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest(
      "button, a, input, select, textarea, summary, [role='button'], [contenteditable='true']",
    ) !== null
  );
}

export function SessionPlayer({
  session,
  initialGrounding = false,
  onExit,
}: {
  session: SessionTemplate;
  initialGrounding?: boolean;
  onExit: () => void;
}): JSX.Element {
  const stages = session.stages;
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(stages[0]?.seconds ?? 60);
  const [paused, setPaused] = useState(false);
  const [complete, setComplete] = useState(false);
  const [confirmingExit, setConfirmingExit] = useState(false);
  const [groundingInstead, setGroundingInstead] = useState(initialGrounding);
  const [optionalMusicStopped, setOptionalMusicStopped] = useState(false);
  const [soundCue, setSoundCue] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const wakeLockRef = useRef<WakeLockSentinelLike | null>(null);
  const endButtonRef = useRef<HTMLButtonElement | null>(null);
  const playerDialogRef = useRef<HTMLDivElement | null>(null);
  const confirmationDialogRef = useRef<HTMLElement | null>(null);
  const confirmationContinueRef = useRef<HTMLButtonElement | null>(null);
  const confirmationReturnFocusRef = useRef<HTMLElement | null>(null);
  const completionHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const current = stages[index];

  const chime = useCallback((): void => {
    if (!soundCue || typeof window === "undefined") return;
    try {
      audioContextRef.current ??= new AudioContext();
      const context = audioContextRef.current;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      // An ordinary C5 interface cue; no therapeutic frequency is implied.
      oscillator.frequency.value = 523.25;
      gain.gain.setValueAtTime(0.045, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + 0.75,
      );
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.8);
    } catch {
      // The session remains complete in silence.
    }
  }, [soundCue]);

  const goTo = useCallback(
    (next: number): void => {
      const clamped = Math.min(Math.max(next, 0), stages.length - 1);
      setIndex(clamped);
      setRemaining(stages[clamped]?.seconds ?? 30);
    },
    [stages],
  );

  const advance = useCallback((): void => {
    if (index < stages.length - 1) {
      chime();
      goTo(index + 1);
    } else {
      chime();
      setComplete(true);
    }
  }, [chime, goTo, index, stages.length]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const appShell = document.getElementById("app-shell");
    const previousShellInert = appShell?.inert ?? false;
    const previousShellAriaHidden = appShell?.getAttribute("aria-hidden");
    document.body.style.overflow = "hidden";
    if (appShell) {
      appShell.inert = true;
      appShell.setAttribute("aria-hidden", "true");
    }
    const focusFrame = window.requestAnimationFrame(() =>
      endButtonRef.current?.focus(),
    );
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      if (appShell) {
        appShell.inert = previousShellInert;
        if (previousShellAriaHidden == null) {
          appShell.removeAttribute("aria-hidden");
        } else {
          appShell.setAttribute("aria-hidden", previousShellAriaHidden);
        }
      }
      void audioContextRef.current?.close().catch(() => undefined);
    };
  }, []);

  useEffect(() => {
    if (!confirmingExit) return;
    confirmationReturnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : endButtonRef.current;
    const frame = window.requestAnimationFrame(() =>
      confirmationContinueRef.current?.focus(),
    );
    return () => {
      window.cancelAnimationFrame(frame);
      confirmationReturnFocusRef.current?.focus();
    };
  }, [confirmingExit]);

  useEffect(() => {
    if (!complete) return;
    window.dispatchEvent(new Event(SESSION_MEDIA_STOP_EVENT));
    const frame = window.requestAnimationFrame(() =>
      completionHeadingRef.current?.focus(),
    );
    return () => window.cancelAnimationFrame(frame);
  }, [complete]);

  useEffect(() => {
    let cancelled = false;
    async function acquire(): Promise<void> {
      try {
        const nav = navigator as Navigator & {
          wakeLock?: {
            request: (type: string) => Promise<WakeLockSentinelLike>;
          };
        };
        if (!nav.wakeLock) return;
        const sentinel = await nav.wakeLock.request("screen");
        if (!cancelled) wakeLockRef.current = sentinel;
      } catch {
        // Wake lock is a progressive enhancement.
      }
    }
    void acquire();
    return () => {
      cancelled = true;
      void wakeLockRef.current?.release().catch(() => undefined);
      wakeLockRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (paused || complete || confirmingExit) return;
    const timer = window.setTimeout(() => {
      if (remaining > 1) {
        setRemaining(remaining - 1);
        return;
      }
      chime();
      if (index < stages.length - 1) {
        setIndex(index + 1);
        setRemaining(stages[index + 1]?.seconds ?? 30);
      } else {
        setRemaining(0);
        setComplete(true);
      }
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [
    chime,
    complete,
    confirmingExit,
    index,
    paused,
    remaining,
    stages,
  ]);

  useEffect(() => {
    function onVisibility(): void {
      if (document.hidden && !complete) setPaused(true);
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [complete]);

  useEffect(() => {
    function onKey(event: KeyboardEvent): void {
      if (event.defaultPrevented) return;
      if (confirmingExit) {
        if (event.key === "Escape") {
          event.preventDefault();
          setConfirmingExit(false);
        }
        return;
      }
      if (isInteractiveTarget(event.target) && event.key !== "Escape") return;
      if (event.key === " ") {
        event.preventDefault();
        setPaused((value) => !value);
      } else if (event.key === "ArrowRight" && !complete) {
        advance();
      } else if (event.key === "ArrowLeft" && !complete) {
        goTo(index - 1);
      } else if (event.key === "Escape") {
        event.preventDefault();
        setConfirmingExit(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, complete, confirmingExit, goTo, index]);

  const repetition =
    current?.id === "articulate"
      ? Math.min(
          current.repetitions ?? 3,
          Math.floor(
            (current.seconds - remaining) /
              (current.seconds / (current.repetitions ?? 3)),
          ) + 1,
        )
      : null;
  const currentInstruction =
    current?.id === "regulate" && groundingInstead
      ? GROUNDING_REGULATION_INSTRUCTION
      : current?.instruction;
  const currentPrompt =
    current?.id === "regulate" && groundingInstead
      ? GROUNDING_REGULATION_PROMPT
      : current?.prompt;

  return createPortal(
    <div
      ref={playerDialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Coherence prayer: ${session.title}`}
      tabIndex={-1}
      onKeyDown={(event) => {
        if (!confirmingExit) trapTabKey(event, playerDialogRef.current);
      }}
      className="fixed inset-0 z-[70] flex flex-col bg-bg-player"
    >
      <div
        className="flex min-h-0 flex-1 flex-col"
        inert={confirmingExit ? true : undefined}
        aria-hidden={confirmingExit ? true : undefined}
      >
      <div className="flex h-14 shrink-0 items-center justify-between px-4 pt-[env(safe-area-inset-top)]">
        <button
          ref={endButtonRef}
          type="button"
          onClick={() => setConfirmingExit(true)}
          className="inline-flex min-h-11 items-center gap-1.5 px-2 font-sans text-sm font-medium text-ink-muted hover:text-ink-strong"
        >
          <Icon name="x" className="h-4 w-4" aria-hidden="true" />
          End
        </button>
        <p className="t-meta max-w-[50%] truncate uppercase tracking-wider text-ink-muted">
          {session.title}
        </p>
        <button
          type="button"
          onClick={() => setSoundCue((value) => !value)}
          aria-pressed={soundCue}
          aria-label={soundCue ? "Turn stage cue off" : "Turn stage cue on"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-muted hover:text-ink-strong"
        >
          <Icon
            name="bell"
            className={`h-5 w-5 ${soundCue ? "text-gold" : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="flex shrink-0 justify-center px-5 pt-3">
        <StageTimeline
          stages={stages}
          currentIndex={index}
          complete={complete}
        />
      </div>

      {!complete && current ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 overflow-y-auto px-6 py-5 text-center">
          <div aria-live="polite">
            <p className="t-eyebrow text-violet">
              Stage {index + 1} of {stages.length}
            </p>
            <h1 className="t-h1 mt-2 text-ink-strong">{current.title}</h1>
          </div>

          {current.id === "regulate" && !groundingInstead ? (
            <BreathingGuide
              running={!paused && !confirmingExit}
              pattern={{
                inhaleSeconds: 4,
                holdSeconds: 2,
                exhaleSeconds: 6,
              }}
              className="scale-75 md:scale-90"
            />
          ) : null}

          <div className="max-w-[42ch]">
            <p className="t-prayer text-ink-strong">{currentInstruction}</p>
            <p className="t-body-sm mt-3 text-ink-muted">{currentPrompt}</p>
          </div>

          {repetition ? (
            <p
              className="t-label rounded-pill border border-[rgba(167,155,232,0.4)] px-4 py-2 font-sans text-violet"
              aria-live="polite"
            >
              Repetition {repetition} of {current.repetitions ?? 3}
            </p>
          ) : null}

          {current.id === "regulate" ? (
            <div>
              <button
                type="button"
                onClick={() => setGroundingInstead((value) => !value)}
                aria-pressed={groundingInstead}
                className="inline-flex min-h-11 items-center px-3 font-sans text-sm font-medium text-blue underline-offset-4 hover:underline"
              >
                {groundingInstead
                  ? "Use optional timed 4–2–6 pacing"
                  : "Use visual grounding instead"}
              </button>
              <p className="t-meta mx-auto max-w-[48ch] text-ink-faint">
                {groundingInstead
                  ? "The visual option does not ask you to notice or change breathing."
                  : "The app paces each count as about one second. Stop counting if you feel dizzy, air-hungry or panicky."}
              </p>
            </div>
          ) : null}

          <button
            type="button"
            disabled={optionalMusicStopped}
            onClick={() => {
              window.dispatchEvent(new Event(SESSION_MEDIA_STOP_EVENT));
              setOptionalMusicStopped(true);
            }}
            className="inline-flex min-h-11 items-center gap-2 px-3 font-sans text-sm font-medium text-ink-muted underline-offset-4 hover:text-ink-strong hover:underline disabled:no-underline disabled:opacity-60"
          >
            <Icon name="note-music" className="h-4 w-4" aria-hidden="true" />
            {optionalMusicStopped
              ? "Optional music stopped"
              : "Stop optional music"}
          </button>

          {current.skippable ? (
            <button
              type="button"
              onClick={advance}
              className="inline-flex min-h-11 items-center px-3 font-sans text-sm font-medium text-ink-muted underline-offset-4 hover:text-ink-strong hover:underline"
            >
              Skip this optional stage
            </button>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
          <p className="t-eyebrow text-gold">Session complete</p>
          <h1
            ref={completionHeadingRef}
            tabIndex={-1}
            className="t-h1 text-ink-strong focus:outline-none"
          >
            Return gently
          </h1>
          <p className="t-prayer max-w-[36ch] text-ink-strong">
            {session.closing}
          </p>
          <p className="t-body-sm text-ink-muted">
            Nothing was recorded. The prayer remains yours.
          </p>
        </div>
      )}

      <div className="flex shrink-0 items-center justify-center gap-5 border-t border-line-subtle px-4 pb-[calc(env(safe-area-inset-bottom)+18px)] pt-4">
        {!complete ? (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label="Previous stage"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line-subtle text-ink-muted disabled:opacity-30"
            >
              <Icon name="chevron-left" className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? "Resume session" : "Pause session"}
              className="inline-flex min-h-12 min-w-36 items-center justify-center gap-2 rounded-pill bg-pearl-fill px-5 font-sans text-sm font-semibold text-bg-1"
            >
              <Icon
                name={paused ? "play" : "pause"}
                className="h-4 w-4"
                aria-hidden="true"
              />
              {paused ? "Resume" : formatClock(remaining)}
            </button>
            <button
              type="button"
              onClick={advance}
              aria-label={
                index === stages.length - 1
                  ? "Complete session"
                  : "Next stage"
              }
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line-subtle text-ink-muted hover:text-ink-strong"
            >
              <Icon name="skip-forward" className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onExit}
            className="inline-flex min-h-12 min-w-48 items-center justify-center rounded-sm bg-pearl-fill px-6 font-sans text-sm font-semibold text-bg-1"
          >
            Return to session page
          </button>
        )}
      </div>
      </div>

      {confirmingExit ? (
        <div className="absolute inset-0 z-10 flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <section
            ref={confirmationDialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="end-session-title"
            tabIndex={-1}
            onKeyDown={(event) =>
              trapTabKey(event, confirmationDialogRef.current)
            }
            className="glass w-full max-w-md rounded-md p-6"
          >
            <h2 id="end-session-title" className="t-h3 text-ink-strong">
              End this session?
            </h2>
            <p className="t-body-sm mt-2 text-ink-muted">
              Stopping is allowed. A partial practice is still a complete act
              of care.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                ref={confirmationContinueRef}
                type="button"
                onClick={() => setConfirmingExit(false)}
                className="field-surface min-h-12 rounded-sm px-4 font-sans text-sm font-semibold text-ink-strong"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={onExit}
                className="min-h-12 rounded-sm bg-pearl-fill px-4 font-sans text-sm font-semibold text-bg-1"
              >
                End session
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
