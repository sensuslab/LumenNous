"use client";

import { useEffect, useRef, useState, type JSX } from "react";
import type { SessionTemplate } from "@/lib/schemas";
import { SESSION_MEDIA_STOP_EVENT } from "@/lib/media-events";
import { SessionPlayer } from "./SessionPlayer";

export function SessionLauncher({
  session,
}: {
  session: SessionTemplate;
}): JSX.Element {
  const [playing, setPlaying] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [initialGrounding, setInitialGrounding] = useState(false);
  const beginButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!playing && hasOpened) beginButtonRef.current?.focus();
  }, [hasOpened, playing]);

  if (playing) {
    return (
      <SessionPlayer
        session={session}
        initialGrounding={initialGrounding}
        onExit={() => {
          window.dispatchEvent(new Event(SESSION_MEDIA_STOP_EVENT));
          setPlaying(false);
        }}
      />
    );
  }

  return (
    <section
      aria-labelledby="begin-coherence-session"
      className="mt-10 text-center"
    >
      <h2 id="begin-coherence-session" className="t-eyebrow text-gold">
        Three minutes · five-stage sequence
      </h2>
      <button
        ref={beginButtonRef}
        type="button"
        onClick={() => {
          setInitialGrounding(
            new URLSearchParams(window.location.search).get("regulation") ===
              "grounding",
          );
          setHasOpened(true);
          setPlaying(true);
        }}
        className="mt-4 inline-flex min-h-12 min-w-60 items-center justify-center rounded-sm bg-pearl-fill px-6 font-sans text-[0.9375rem] font-semibold text-bg-1 transition-[transform,background-color] duration-[120ms] ease-std hover:bg-pearl-fill-hover active:scale-[0.98]"
      >
        Begin coherence prayer
      </button>
      <p className="t-body-sm mx-auto mt-3 max-w-[52ch] text-ink-muted">
        Sound is optional. A player loaded above can continue behind the timer
        and will be unloaded when the session ends. Nothing is recorded.
      </p>
    </section>
  );
}
