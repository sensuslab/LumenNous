"use client";

import { useSyncExternalStore, type JSX } from "react";
import type { SessionTemplate } from "@/lib/schemas";
import {
  GROUNDING_REGULATION_INSTRUCTION,
  GROUNDING_REGULATION_PROMPT,
} from "@/lib/coherence";

type PreviewMode = "choice" | "default" | "grounding";

function subscribeToLocation(onChange: () => void): () => void {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

function getPreviewMode(): PreviewMode {
  return new URLSearchParams(window.location.search).get("regulation") ===
    "grounding"
    ? "grounding"
    : "default";
}

function getServerPreviewMode(): PreviewMode {
  return "choice";
}

export function SessionStagePreview({
  stages,
}: {
  stages: SessionTemplate["stages"];
}): JSX.Element {
  const mode = useSyncExternalStore(
    subscribeToLocation,
    getPreviewMode,
    getServerPreviewMode,
  );

  return (
    <ol className="mt-5 space-y-5">
      {stages.map((stage, index) => {
        const isRegulation = stage.id === "regulate";
        const instruction =
          isRegulation && mode === "grounding"
            ? GROUNDING_REGULATION_INSTRUCTION
            : isRegulation && mode === "choice"
              ? "Choose either the optional timed 4–2–6 guide or visual and contact-point grounding in the player. No counting or breath focus is required."
              : stage.instruction;
        const prompt =
          isRegulation && mode === "grounding"
            ? GROUNDING_REGULATION_PROMPT
            : stage.prompt;

        return (
          <li key={stage.id} className="flex gap-4">
            <span
              aria-hidden="true"
              className="t-meta flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-[rgba(167,155,232,0.4)] text-violet"
            >
              {index + 1}
            </span>
            <div>
              <div className="flex flex-wrap items-baseline gap-x-2">
                <h3 className="t-label font-sans text-ink-strong">
                  {stage.title}
                </h3>
                <span className="t-meta text-ink-faint">
                  {stage.seconds} seconds
                  {stage.skippable ? " · optional" : ""}
                </span>
              </div>
              <p className="t-body-sm mt-1 text-ink-muted">{instruction}</p>
              <p className="t-meta mt-1 text-ink-faint">{prompt}</p>
              {stage.repetitions ? (
                <p className="t-meta mt-1 text-violet">
                  Repeat {stage.repetitions} times.
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
