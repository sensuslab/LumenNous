"use client";

import { useState, type JSX } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * ShareButton (design.md §6.17) — Web Share API with a quiet clipboard
 * fallback. Copy variant included. Check feedback, never a toast storm.
 */

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function ShareButton({
  title,
  text,
  url,
  className = "",
}: {
  title: string;
  text: string;
  url?: string;
  className?: string;
}): JSX.Element {
  const [done, setDone] = useState(false);

  async function handleShare(): Promise<void> {
    const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch {
        /* user dismissed or share failed — fall through to copy */
      }
    }
    if (await copyText(`${text}\n\n— ${title}${shareUrl ? ` · ${shareUrl}` : ""}`)) {
      setDone(true);
      window.setTimeout(() => setDone(false), 1600);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Share “${title}”`}
      className={`glass inline-flex h-11 w-11 items-center justify-center rounded-full p-2.5 text-ink-muted transition-colors duration-200 ease-std hover:border-line hover:text-ink-strong ${className}`}
    >
      <Icon name={done ? "check" : "share"} className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

export function CopyButton({
  text,
  label = "Copy text",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}): JSX.Element {
  const [done, setDone] = useState(false);

  async function handleCopy(): Promise<void> {
    if (await copyText(text)) {
      setDone(true);
      window.setTimeout(() => setDone(false), 1600);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      className={`glass inline-flex h-11 w-11 items-center justify-center rounded-full p-2.5 text-ink-muted transition-colors duration-200 ease-std hover:border-line hover:text-ink-strong ${className}`}
    >
      <Icon name={done ? "check" : "copy"} className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
