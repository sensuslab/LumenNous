"use client";

import { useEffect, useState } from "react";
import type { JSX } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

/**
 * InstallAppPrompt (design.md §6.21) — one-time dismissible strip above the
 * bottom nav inviting home-screen install. Never nags:
 *   · not shown during the first 2 sessions
 *   · "Not now" dismisses forever (localStorage flag)
 *   · never blocks content, never a modal
 *   · hidden when the app is already installed (standalone display-mode)
 */

const DISMISS_KEY = "lumennous-install-dismissed";
const SESSIONS_KEY = "lumennous-sessions";
const SESSION_MARK = "lumennous-session-marked";

/* beforeinstallprompt is not yet in lib.dom — minimal local typing. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function sessionCount(): number {
  try {
    if (!sessionStorage.getItem(SESSION_MARK)) {
      const n = Number(localStorage.getItem(SESSIONS_KEY) ?? localStorage.getItem("pe-sessions") ?? "0") + 1;
      localStorage.setItem(SESSIONS_KEY, String(n));
      sessionStorage.setItem(SESSION_MARK, "1");
    }
    return Number(localStorage.getItem(SESSIONS_KEY) ?? "1");
  } catch {
    return 0; // storage unavailable — treat as first session, stay quiet
  }
}

export function InstallAppPrompt(): JSX.Element | null {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

  useEffect(() => {
    let eligible = false;
    try {
      const dismissed =
        (localStorage.getItem(DISMISS_KEY) ?? localStorage.getItem("pe-install-dismissed")) === "1";
      const installed = window.matchMedia("(display-mode: standalone)").matches;
      eligible = !dismissed && !installed && sessionCount() > 2;
    } catch {
      eligible = false;
    }
    if (!eligible) return;

    const onBeforeInstall = (e: Event): void => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const dismiss = (): void => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* private mode — dismissal lasts this session only */
    }
    setVisible(false);
  };

  const install = async (): Promise<void> => {
    if (deferred) {
      await deferred.prompt().catch(() => undefined);
      const choice = await deferred.userChoice.catch(() => null);
      if (choice?.outcome === "accepted") dismiss();
      setDeferred(null);
    } else {
      /* No native prompt available — show brief manual guidance instead. */
      setShowHowTo(true);
    }
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Install LumenNous"
      className={[
        "glass fixed inset-x-4 z-40 mx-auto max-w-md rounded-md p-4",
        "flex items-start gap-3 shadow-pop",
      ].join(" ")}
      style={{ bottom: "calc(64px + env(safe-area-inset-bottom) + 12px)" }}
    >
      <span className="mt-0.5 text-gold">
        <Icon name="download" size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="t-body-sm text-ink">
          Add LumenNous to your home screen — works offline.
        </p>
        {showHowTo ? (
          <p className="t-meta mt-2 text-ink-faint">
            Open your browser&rsquo;s share menu and choose &ldquo;Add to Home Screen&rdquo;.
          </p>
        ) : null}
        <div className="mt-3 flex items-center gap-2">
          <Button variant="secondary" className="min-h-11 px-4 py-2 text-sm" onClick={install}>
            How to install
          </Button>
          <Button variant="ghost" className="min-h-11" onClick={dismiss}>
            Not now
          </Button>
        </div>
      </div>
    </aside>
  );
}
