"use client";

import { useEffect } from "react";
import type { JSX } from "react";

/**
 * ServiceWorkerRegister — registers /sw.js (app-shell + seed-content
 * cache-first worker) in production only. Silent by design: offline support
 * is infrastructure, not a feature to announce.
 */
export function ServiceWorkerRegister(): JSX.Element | null {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const onLoad = (): void => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* Offline support is progressive enhancement — fail quietly. */
      });
    };

    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
