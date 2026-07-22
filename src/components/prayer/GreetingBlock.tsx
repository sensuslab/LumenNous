"use client";

import { useSyncExternalStore, type JSX } from "react";

/**
 * GreetingBlock (today.md §2) — time-sensitive greeting that asks for no
 * personal data. Computed on the client after mount (server HTML shows a
 * neutral state, so there is never a hydration mismatch or flash of wrong
 * greeting). The subline rotates deterministically by day-of-year.
 */

const SUBLINES = [
  "No account. Nothing to track. Just this moment.",
  "One prayer, chosen quietly from the library.",
  "Sit for a breath. That's the whole assignment.",
  "Everything here works without telling us who you are.",
];

function greetingForHour(hour: number): string {
  if (hour >= 5 && hour < 12) return "Good morning.";
  if (hour >= 12 && hour < 17) return "Good afternoon.";
  if (hour >= 17 && hour < 22) return "Good evening.";
  return "The night is quiet.";
}

export function GreetingBlock(): JSX.Element {
  const now = useSyncExternalStore(subscribe, getClientNow, getServerNow);

  const dateLine = now
    ? now
        .toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })
        .toUpperCase()
    : "";
  const dayOfYear = now
    ? Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000)
    : 0;

  return (
    <section aria-label="Greeting" className="mt-6">
      <p className="t-eyebrow text-ink-faint" aria-hidden={!now}>
        {dateLine || " "}
      </p>
      <h2 className="t-h2 mt-2 text-ink-strong">
        {now ? greetingForHour(now.getHours()) : "Welcome."}
      </h2>
      <p className="t-body-sm mt-2 text-ink-muted">
        {SUBLINES[dayOfYear % SUBLINES.length]}
      </p>
    </section>
  );
}

const CLIENT_NOW = new Date();

function subscribe(): () => void {
  return () => undefined;
}

function getClientNow(): Date {
  return CLIENT_NOW;
}

function getServerNow(): null {
  return null;
}
