"use client";

import Link from "next/link";
import {
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
  type JSX,
} from "react";
import type {
  ConceptEngineFrame,
  ContemplativeConcept,
  PassageAnchor,
  Source,
  WorldviewProfile,
} from "@/lib/schemas";
import {
  getDailyConceptFrame,
  localISODate,
} from "@/lib/daily";
import { SourceDrawer } from "@/components/prayer/SourceDrawer";
import { TraditionLabelGroup } from "@/components/prayer/TraditionLabel";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";

const COMPLETION_PREFIX = "lumennous-daily-inner-practice-v1:";
const COMPLETION_EVENT = "lumennous-daily-inner-practice";

const WORLDVIEWS: ReadonlyArray<{
  id: WorldviewProfile;
  label: string;
}> = [
  { id: "open-universal", label: "Open universal" },
  { id: "gnostic", label: "Gnostic" },
  { id: "esoteric-christian", label: "Esoteric Christian" },
  { id: "neutral", label: "Neutral" },
];

function subscribeToDate(onStoreChange: () => void): () => void {
  const interval = window.setInterval(onStoreChange, 60_000);
  window.addEventListener("focus", onStoreChange);
  window.addEventListener("visibilitychange", onStoreChange);
  return () => {
    window.clearInterval(interval);
    window.removeEventListener("focus", onStoreChange);
    window.removeEventListener("visibilitychange", onStoreChange);
  };
}

function getLocalDateSnapshot(): string {
  return localISODate(new Date());
}

function subscribeToCompletion(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(COMPLETION_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(COMPLETION_EVENT, onStoreChange);
  };
}

export function DailyInnerPracticeCard({
  frames,
  conceptsById,
  sourcesById,
  anchorsById,
}: {
  frames: readonly ConceptEngineFrame[];
  conceptsById: Record<string, ContemplativeConcept>;
  sourcesById: Record<string, Source>;
  anchorsById: Record<string, PassageAnchor>;
}): JSX.Element {
  const [worldview, setWorldview] =
    useState<WorldviewProfile>("open-universal");
  const [open, setOpen] = useState(false);
  const localDate = useSyncExternalStore(
    subscribeToDate,
    getLocalDateSnapshot,
    () => "",
  );
  const frame = useMemo(
    () =>
      localDate
        ? getDailyConceptFrame(localDate, worldview, frames)
        : undefined,
    [frames, localDate, worldview],
  );
  const concept = frame ? conceptsById[frame.conceptId] : undefined;
  const completionKey = frame
    ? `${COMPLETION_PREFIX}${localDate}:${frame.conceptId}`
    : "";
  const getCompletionSnapshot = useCallback(() => {
    if (!completionKey) return "0";
    try {
      return window.localStorage.getItem(completionKey) === "complete"
        ? "1"
        : "0";
    } catch {
      return "0";
    }
  }, [completionKey]);
  const completionSnapshot = useSyncExternalStore(
    subscribeToCompletion,
    getCompletionSnapshot,
    () => "0",
  );
  const isComplete = completionSnapshot === "1";

  const sources = useMemo(
    () =>
      frame
        ? frame.sourceIds
            .map((id) => sourcesById[id])
            .filter((source): source is Source => source !== undefined)
        : [],
    [frame, sourcesById],
  );
  const anchors = useMemo(
    () =>
      frame
        ? frame.sourceUses
            .map((use) => anchorsById[use.anchorId])
            .filter((anchor): anchor is PassageAnchor => anchor !== undefined)
        : [],
    [anchorsById, frame],
  );

  function markComplete(): void {
    if (!completionKey) return;
    try {
      window.localStorage.setItem(completionKey, "complete");
      window.dispatchEvent(new Event(COMPLETION_EVENT));
    } catch {
      // The practice remains usable when storage is blocked or unavailable.
    }
  }

  if (!frame || !concept) {
    return (
      <GlassCard ariaLabelledby="inner-practice-title">
        <p className="t-eyebrow text-violet">Inner practice</p>
        <h2 id="inner-practice-title" className="t-h2 mt-2 text-ink-strong">
          Preparing today&apos;s practice
        </h2>
        <p className="t-body-sm mt-2 text-ink-muted">
          The local calendar selects a stable practice after this page opens.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard
      hero
      ariaLabelledby="inner-practice-title"
      className={
        isComplete
          ? "border-[rgba(111,196,160,0.34)]"
          : "border-[rgba(167,155,232,0.3)]"
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="t-eyebrow text-violet">Today&apos;s inner practice</p>
        <span className="t-meta inline-flex items-center gap-1.5 text-ink-faint">
          <Icon name={isComplete ? "check" : "timer"} className="h-3.5 w-3.5" />
          {isComplete ? "Complete on this device" : "About 4 minutes"}
        </span>
      </div>

      <h2 id="inner-practice-title" className="t-h2 mt-3 text-ink-strong">
        {frame.title}
      </h2>
      <p className="t-body-sm mt-2 max-w-[62ch] text-ink-muted">
        {frame.description}
      </p>
      <div className="mt-4">
        <TraditionLabelGroup labels={frame.traditionLabels} />
      </div>

      <fieldset className="mt-6 border-t border-line-subtle pt-5">
        <legend className="t-label px-1 font-sans text-ink-strong">
          Framing for today · not saved
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {WORLDVIEWS.map((option) => {
            const available = frames.some((candidate) =>
              candidate.compatibleWorldviews.includes(option.id),
            );
            return (
              <button
                key={option.id}
                type="button"
                disabled={!available}
                aria-pressed={worldview === option.id}
                onClick={() => {
                  setWorldview(option.id);
                  setOpen(false);
                }}
                className="rounded-pill disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none"
              >
                <Chip selected={worldview === option.id} tone="violet">
                  {option.label}
                </Chip>
              </button>
            );
          })}
        </div>
      </fieldset>

      {!open ? (
        <div className="mt-6">
          <Button variant="primary" onClick={() => setOpen(true)}>
            <Icon name="spark" className="h-4 w-4" aria-hidden="true" />
            Begin inner practice
          </Button>
          <p className="t-meta mt-3 text-ink-faint">
            Selected by local date and framing from the editorial library—not a sign, message or prediction.
          </p>
        </div>
      ) : (
        <div className="mt-7 border-t border-line pt-6">
          <ol className="space-y-6">
            <li className="flex gap-4">
              <span className="t-meta flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(167,155,232,0.4)] text-violet">1</span>
              <div>
                <p className="t-label font-sans text-ink-strong">Arrive · about 45 seconds</p>
                <p className="t-body-sm mt-1 text-ink-muted">
                  Feel the support beneath you. Name where you are, the time of day, and one ordinary thing you will do when this practice ends.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="t-meta flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(167,155,232,0.4)] text-violet">2</span>
              <div>
                <p className="t-label font-sans text-ink-strong">Receive · about 1 minute</p>
                <p className="t-prayer-sm mt-2 italic text-ink-strong">{frame.prayerLine}</p>
                <blockquote className="t-prayer-sm mt-3 border-l-2 border-violet pl-4 text-ink-muted">
                  {frame.affirmation}
                </blockquote>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="t-meta flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(167,155,232,0.4)] text-violet">3</span>
              <div>
                <p className="t-label font-sans text-ink-strong">Embody · about 2 minutes</p>
                <p className="t-body-sm mt-1 text-ink-muted">{frame.practiceStep}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="t-meta flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(167,155,232,0.4)] text-violet">4</span>
              <div>
                <p className="t-label font-sans text-ink-strong">Reflect and return · about 1 minute</p>
                <p className="t-prayer-sm mt-2 italic text-ink-strong">{frame.reflectionPrompt}</p>
                <p className="t-body-sm mt-3 text-ink-muted">
                  Keep only what supports honest, caring action. Look around the room and return to the ordinary next thing you named.
                </p>
              </div>
            </li>
          </ol>

          <aside className="mt-6 rounded-sm border border-[rgba(232,180,160,0.28)] bg-[rgba(232,180,160,0.045)] p-4">
            <p className="t-label font-sans text-ink-strong">Keep agency</p>
            <p className="t-body-sm mt-1 text-ink-muted">{frame.safetyNote}</p>
          </aside>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              variant={isComplete ? "secondary" : "primary"}
              onClick={markComplete}
              disabled={isComplete}
            >
              <Icon name="check" className="h-4 w-4" aria-hidden="true" />
              {isComplete ? "Practice complete" : "Mark practice complete"}
            </Button>
            <Link
              href={`/concepts/${concept.slug}`}
              className="t-body-sm inline-flex min-h-11 items-center gap-1 font-sans font-medium text-ink-muted underline-offset-4 hover:text-violet hover:underline"
            >
              Explore {concept.name}
              <Icon name="arrow-up-right" className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <p className="t-meta mt-3 text-ink-faint">
            Completion stores only this date and concept ID on this device. No response text or worldview choice is saved.
          </p>
        </div>
      )}

      <SourceDrawer
        sources={sources}
        anchors={anchors}
        heading="Sources behind this practice"
        className="mt-5 border-t border-line-subtle pt-3"
      />
    </GlassCard>
  );
}
