"use client";

import { useSyncExternalStore } from "react";
import type { JSX } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * LowStimulationToggle (design.md §4.3) — switches [data-stim="low"] on
 * <html>: glass goes solid, grain hides, horizon glows dim to 40%, the
 * starfield halves its opacity and all ambient motion stops (global CSS).
 *
 * Default honours prefers-reduced-motion when no stored choice exists;
 * an explicit toggle is persisted to localStorage. 44px icon-button hit
 * area with aria-pressed; the leaf-still icon tints gold while active.
 */

const STIM_KEY = "lumennous-stim";
const LEGACY_STIM_KEY = "pe-stim";
let lowSnapshot = false;
let initialised = false;
const listeners = new Set<() => void>();

function initialLow(): boolean {
  try {
    const stored = localStorage.getItem(STIM_KEY) ?? localStorage.getItem(LEGACY_STIM_KEY);
    if (stored === "low") return true;
    if (stored === "full") return false;
  } catch {
    /* storage unavailable — fall through to media query */
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function LowStimulationToggle({ className = "" }: { className?: string }): JSX.Element {
  const low = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = (): void => {
    const next = !low;
    lowSnapshot = next;
    if (next) {
      document.documentElement.dataset.stim = "low";
    } else {
      delete document.documentElement.dataset.stim;
    }
    try {
      localStorage.setItem(STIM_KEY, next ? "low" : "full");
    } catch {
      /* preference simply won't persist */
    }
    for (const listener of listeners) listener();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={low}
      aria-label={low ? "Low stimulation mode on — switch to full ambience" : "Low stimulation mode off — switch to low stimulation"}
      title="Low stimulation mode"
      className={[
        "glass flex h-11 w-11 items-center justify-center rounded-full p-2.5",
        "transition-colors duration-200 ease-std",
        low ? "text-gold border-line-strong" : "text-ink-muted hover:text-ink-strong hover:border-line",
        className,
      ].join(" ")}
    >
      <Icon name="leaf-still" size={20} />
    </button>
  );
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (!initialised) {
    initialised = true;
    lowSnapshot = initialLow();
    queueMicrotask(() => {
      for (const current of listeners) current();
    });
  }
  return () => listeners.delete(listener);
}

function getSnapshot(): boolean {
  return lowSnapshot;
}

function getServerSnapshot(): boolean {
  return false;
}
