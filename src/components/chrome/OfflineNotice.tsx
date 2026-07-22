"use client";

import { useSyncExternalStore } from "react";
import type { JSX } from "react";

/**
 * OfflineNotice (design.md §6.22) — slim 48px top banner below the safe
 * area, shown only while offline. Calm and non-blocking: 2px --warn left
 * border on glass, polite live region, never a modal. The library,
 * practices, Create and saved items keep working.
 */

export function OfflineNotice(): JSX.Element | null {
  const offline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!offline) return null;

  return (
    <div
      role="status"
      className={[
        "glass fixed inset-x-3 z-40 flex min-h-12 items-center gap-3 rounded-sm px-4 py-2",
        "border-l-2 border-l-warn",
      ].join(" ")}
      style={{ top: "calc(env(safe-area-inset-top) + 8px)" }}
    >
      <p className="t-body-sm text-ink">
        You&rsquo;re offline. The library, Create and your saved items still work.
      </p>
    </div>
  );
}

function subscribe(listener: () => void): () => void {
  window.addEventListener("online", listener);
  window.addEventListener("offline", listener);
  return () => {
    window.removeEventListener("online", listener);
    window.removeEventListener("offline", listener);
  };
}

function getSnapshot(): boolean {
  return !navigator.onLine;
}

function getServerSnapshot(): boolean {
  return false;
}
