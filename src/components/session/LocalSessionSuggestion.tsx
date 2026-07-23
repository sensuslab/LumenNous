"use client";

import Link from "next/link";
import { useEffect, useState, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";

interface SessionSuggestion {
  href: string;
  label: string;
}

const MIDDAY: SessionSuggestion = {
  href: "/sessions/midday-recenter",
  label: "Midday Recenter",
};

function suggestionForHour(hour: number): SessionSuggestion {
  if (hour >= 5 && hour < 11) {
    return { href: "/sessions/morning-setting", label: "Morning Coherence" };
  }
  if (hour >= 20 || hour < 5) {
    return { href: "/sessions/before-sleep", label: "Before Sleep" };
  }
  if (hour >= 16) {
    return {
      href: "/sessions/evening-integration",
      label: "Evening Integration",
    };
  }
  return MIDDAY;
}

export function LocalSessionSuggestion(): JSX.Element {
  const [suggestion, setSuggestion] = useState<SessionSuggestion>(MIDDAY);

  useEffect(() => {
    function updateFromLocalClock(): void {
      setSuggestion(suggestionForHour(new Date().getHours()));
    }
    updateFromLocalClock();
    const timer = window.setInterval(updateFromLocalClock, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <GlassCard className="border-t border-t-[rgba(167,155,232,0.45)]">
      <div className="flex items-start gap-3">
        <Icon
          name="orbit"
          className="mt-1 h-5 w-5 shrink-0 text-violet"
          aria-hidden="true"
        />
        <div>
          <p className="t-eyebrow text-violet">Three-minute method</p>
          <h2 className="t-h3 mt-1 text-ink-strong" aria-live="polite">
            {suggestion.label}
          </h2>
          <p className="t-body-sm mt-2 text-ink-muted">
            Regulate or ground, arrive in the body, name one honest intention,
            and release the outcome. Sound is optional.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="secondary" href={suggestion.href}>
              Begin coherence prayer
            </Button>
            <Link
              href="/sessions"
              className="t-body-sm inline-flex min-h-11 items-center px-2 font-sans font-medium text-ink-muted hover:text-ink-strong"
            >
              See all five sessions
            </Link>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
