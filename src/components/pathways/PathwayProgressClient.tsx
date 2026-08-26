"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore, type JSX } from "react";
import type {
  ContemplativePathway,
  PathwayActivityType,
} from "@/lib/schemas";
import { Chip } from "@/components/ui/Chip";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon, type IconName } from "@/components/ui/Icon";

const STORAGE_PREFIX = "lumennous-pathway-progress-v1:";
const PROGRESS_EVENT = "lumennous-pathway-progress";

const ACTIVITY_META: Record<
  PathwayActivityType,
  { label: string; icon: IconName }
> = {
  orient: { label: "Orient", icon: "compass-line" },
  contemplate: { label: "Contemplate", icon: "eye" },
  reflect: { label: "Reflect", icon: "book" },
  integrate: { label: "Integrate", icon: "infinity" },
  serve: { label: "Serve", icon: "hand" },
};

function parseProgress(raw: string, validIds: Set<string>): string[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (value): value is string =>
        typeof value === "string" && validIds.has(value),
    );
  } catch {
    return [];
  }
}

function subscribeToProgress(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(PROGRESS_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(PROGRESS_EVENT, onStoreChange);
  };
}

export function PathwayProgressClient({
  pathway,
  conceptNamesById,
}: {
  pathway: ContemplativePathway;
  conceptNamesById: Record<string, string>;
}): JSX.Element {
  const validStageIds = useMemo(
    () => new Set(pathway.stages.map((stage) => stage.id)),
    [pathway.stages],
  );
  const storedProgress = useSyncExternalStore(
    subscribeToProgress,
    () => {
      try {
        return window.localStorage.getItem(
          `${STORAGE_PREFIX}${pathway.slug}`,
        ) ?? "[]";
      } catch {
        return "[]";
      }
    },
    () => "[]",
  );
  const completedIds = useMemo(
    () => parseProgress(storedProgress, validStageIds),
    [storedProgress, validStageIds],
  );

  const completed = new Set(completedIds);
  const progress = Math.round((completed.size / pathway.stages.length) * 100);

  function toggleStage(stageId: string): void {
    const next = completed.has(stageId)
      ? completedIds.filter((id) => id !== stageId)
      : [...completedIds, stageId];
    try {
      window.localStorage.setItem(
        `${STORAGE_PREFIX}${pathway.slug}`,
        JSON.stringify(next),
      );
      window.dispatchEvent(new Event(PROGRESS_EVENT));
    } catch {
      // The pathway remains fully usable when local storage is unavailable.
    }
  }

  return (
    <section aria-labelledby="pathway-journey" className="mt-10">
      <div className="glass rounded-md p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="t-eyebrow text-violet">Your journey</p>
            <h2 id="pathway-journey" className="t-h2 mt-1 text-ink-strong">
              {completed.size} of {pathway.stages.length} stages complete
            </h2>
          </div>
          <p className="t-meta text-ink-faint">
            Optional progress · this device only
          </p>
        </div>
        <div
          className="mt-4 h-1.5 overflow-hidden rounded-pill bg-[rgba(255,255,255,0.06)]"
          role="progressbar"
          aria-label="Pathway completion"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <span
            className="block h-full rounded-pill bg-violet transition-[width] duration-300 ease-std"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <ol className="mt-6 space-y-6">
        {pathway.stages.map((stage, index) => {
          const meta = ACTIVITY_META[stage.activity.activityType];
          const isComplete = completed.has(stage.id);
          return (
            <li key={stage.id}>
              <GlassCard
                as="article"
                className={
                  isComplete
                    ? "border-[rgba(111,196,160,0.34)]"
                    : "border-line-subtle"
                }
              >
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="t-meta flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(167,155,232,0.4)] text-violet"
                  >
                    {isComplete ? <Icon name="check" className="h-4 w-4" /> : index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Chip kind="filter" tone="violet">
                        <Icon name={meta.icon} className="mr-1 h-3.5 w-3.5" />
                        {meta.label}
                      </Chip>
                      <span className="t-meta inline-flex items-center gap-1 text-ink-faint">
                        <Icon name="timer" className="h-3.5 w-3.5" />
                        {stage.activity.minutes} min
                      </span>
                    </div>
                    <h3 className="t-h2 mt-3 text-ink-strong">{stage.title}</h3>
                  </div>
                </div>

                <p className="t-body mt-5 text-ink-muted">{stage.orientation}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {stage.conceptIds.map((conceptId) => (
                    <Chip key={conceptId} kind="source" classification="MOD">
                      {conceptNamesById[conceptId] ?? conceptId}
                    </Chip>
                  ))}
                </div>

                <section
                  aria-labelledby={`${stage.id}-activity`}
                  className="mt-6 rounded-md border border-line-subtle bg-[rgba(255,255,255,0.018)] p-4 md:p-5"
                >
                  <p className="t-eyebrow text-gold">Activity</p>
                  <h4 id={`${stage.id}-activity`} className="t-h3 mt-1 text-ink-strong">
                    {stage.activity.title}
                  </h4>
                  <p className="t-body-sm mt-2 text-ink-muted">
                    {stage.activity.purpose}
                  </p>
                  <ol className="mt-4 space-y-3">
                    {stage.activity.instructions.map((instruction, stepIndex) => (
                      <li key={instruction} className="flex gap-3">
                        <span className="t-meta mt-0.5 text-ink-faint">
                          {String(stepIndex + 1).padStart(2, "0")}
                        </span>
                        <p className="t-body-sm text-ink">{instruction}</p>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-5 border-l-2 border-[rgba(217,186,133,0.38)] pl-4">
                    <p className="t-label font-sans text-ink-strong">Reflect</p>
                    <p className="t-prayer-sm mt-1 italic text-ink-muted">
                      {stage.activity.reflectionPrompt}
                    </p>
                  </div>
                  <p className="t-body-sm mt-5 rounded-sm border border-line-subtle p-3 text-ink-muted">
                    <span className="font-semibold text-ink-strong">Keep agency: </span>
                    {stage.activity.safetyNotes}
                  </p>
                </section>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    aria-pressed={isComplete}
                    onClick={() => toggleStage(stage.id)}
                    className={[
                      "inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-4 font-sans text-sm font-semibold transition-colors duration-200",
                      isComplete
                        ? "border border-[rgba(111,196,160,0.42)] bg-[rgba(111,196,160,0.08)] text-ok"
                        : "bg-pearl-fill text-bg-1 hover:bg-pearl-fill-hover",
                    ].join(" ")}
                  >
                    <Icon name="check" className="h-4 w-4" />
                    {isComplete ? "Stage complete" : "Mark complete"}
                  </button>
                  {stage.relatedPracticeSlug ? (
                    <Link
                      href={`/practice/${stage.relatedPracticeSlug}`}
                      className="t-body-sm inline-flex min-h-11 items-center gap-1 font-sans font-medium text-ink-muted underline-offset-4 hover:text-violet hover:underline"
                    >
                      Open companion practice
                      <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
                    </Link>
                  ) : null}
                </div>
              </GlassCard>
            </li>
          );
        })}
      </ol>

      {completed.size === pathway.stages.length ? (
        <aside
          aria-live="polite"
          className="mt-6 rounded-md border border-[rgba(111,196,160,0.34)] bg-[rgba(111,196,160,0.06)] p-5"
        >
          <p className="t-eyebrow text-ok">Pathway complete</p>
          <p className="t-body mt-2 text-ink">
            Completion is not attainment or rank. Keep the part that makes
            ordinary life more honest, caring and free.
          </p>
        </aside>
      ) : null}
    </section>
  );
}
