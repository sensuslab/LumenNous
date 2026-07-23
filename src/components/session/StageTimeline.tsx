import type { JSX } from "react";
import type { SessionStage } from "@/lib/schemas";

export function StageTimeline({
  stages,
  currentIndex,
  complete = false,
}: {
  stages: readonly SessionStage[];
  currentIndex: number;
  complete?: boolean;
}): JSX.Element {
  return (
    <ol
      aria-label="Session stages"
      className="grid w-full max-w-[680px] grid-cols-5 gap-1.5"
    >
      {stages.map((stage, index) => {
        const current = !complete && index === currentIndex;
        const done = complete || index < currentIndex;
        return (
          <li key={stage.id} aria-current={current ? "step" : undefined}>
            <span
              aria-hidden="true"
              className={`block h-1 rounded-full ${
                done
                  ? "bg-gold"
                  : current
                    ? "bg-violet"
                    : "bg-line-subtle"
              }`}
            />
            <span className="sr-only">
              {stage.title}
              {current ? ", current stage" : done ? ", complete" : ""}
            </span>
            <span
              aria-hidden="true"
              className={`t-meta mt-1.5 hidden text-center sm:block ${
                current ? "text-ink-strong" : "text-ink-faint"
              }`}
            >
              {stage.title}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
