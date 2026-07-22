"use client";

import { useState, type JSX } from "react";
import { createBrowserEngineHistory } from "@/lib/engine";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/** Gives every user direct control over the Engine's device-local shuffle state. */
export function EngineHistoryControl(): JSX.Element {
  const [reset, setReset] = useState(false);

  function resetHistory(): void {
    createBrowserEngineHistory().clear();
    setReset(true);
  }

  return (
    <section
      aria-labelledby="engine-history-title"
      className="mt-12 border-t border-line-subtle pt-6"
    >
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:gap-8">
        <div>
          <h2 id="engine-history-title" className="t-h3 text-ink-strong">
            Create variety history
          </h2>
          <p className="t-body-sm mt-2 max-w-[52ch] text-ink-muted">
            LumenNous keeps selected content IDs and cycle counters in this
            browser so Create can avoid immediate repeats. Your request text is
            never included.
          </p>
        </div>
        <Button
          variant="ghost"
          className="min-w-[12rem] shrink-0"
          onClick={resetHistory}
          disabled={reset}
        >
          <Icon name={reset ? "check" : "trash"} className="h-4 w-4" aria-hidden="true" />
          {reset ? "History reset" : "Reset variety history"}
        </Button>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {reset ? "Create variety history has been reset." : ""}
      </p>
    </section>
  );
}
