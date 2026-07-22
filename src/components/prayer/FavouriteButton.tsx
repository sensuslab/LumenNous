"use client";

import { useState, type JSX } from "react";
import {
  useFavourites,
  type FavouriteEntry,
} from "@/lib/favourites";
import { Icon } from "@/components/ui/Icon";

/**
 * FavouriteButton (design.md §6.16) — heart toggle with aria-pressed.
 * First-ever save opens a calm consent explanation: saved items live only in
 * this browser, no account, deletable any time; local storage is not a
 * cloud backup. No analytics attached.
 */

export function FavouriteButton({
  item,
  className = "",
}: {
  item: FavouriteEntry;
  className?: string;
}): JSX.Element {
  const { isFavourite, toggle, consentGiven, grantConsent, ready } = useFavourites();
  const [consentOpen, setConsentOpen] = useState(false);
  const saved = ready && isFavourite(item.id);

  function handlePress(): void {
    if (!ready) return;
    if (!consentGiven) {
      setConsentOpen(true);
      return;
    }
    toggle(item);
  }

  function handleConsent(): void {
    grantConsent();
    toggle(item);
    setConsentOpen(false);
  }

  return (
    <span className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={handlePress}
        aria-pressed={saved}
        aria-label={saved ? `Remove “${item.title}” from Saved` : `Save “${item.title}”`}
        className="glass inline-flex h-11 w-11 items-center justify-center rounded-full p-2.5 text-ink-muted transition-colors duration-200 ease-std hover:border-line hover:text-ink-strong"
      >
        <Icon name={saved ? "heart-fill" : "heart"} className="h-5 w-5" aria-hidden="true" />
      </button>

      {consentOpen ? (
        <span
          role="dialog"
          aria-label="About saved items"
          className="glass absolute right-0 top-12 z-40 block w-72 rounded-md border-line p-4 text-left shadow-none"
        >
          <span className="t-body-sm block text-ink">
            Saved items are stored only in this browser — no account, nothing
            uploaded, and you can delete them at any time. Local storage is
            not a cloud backup.
          </span>
          <span className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleConsent}
              className="rounded-sm bg-pearl-fill px-4 py-2 font-sans text-sm font-semibold text-bg-1 transition-colors duration-200 ease-std hover:bg-pearl-fill-hover"
            >
              Got it — save
            </button>
            <button
              type="button"
              onClick={() => setConsentOpen(false)}
              className="rounded-sm px-3 py-2 font-sans text-sm font-medium text-ink-muted hover:text-ink-strong"
            >
              Not now
            </button>
          </span>
        </span>
      ) : null}
    </span>
  );
}
