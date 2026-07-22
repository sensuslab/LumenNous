"use client";

import Link from "next/link";
import { useState, type JSX } from "react";
import { useFavourites, type FavouriteType } from "@/lib/favourites";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * Saved items - grouped list by type, export as JSON,
 * delete-all with a calm confirm, consent gate, empty state. No analytics.
 */

const TYPE_META: Record<FavouriteType, { label: string; icon: IconName }> = {
  prayer: { label: "Prayers", icon: "book-open" },
  affirmation: { label: "Affirmations", icon: "spark" },
  practice: { label: "Practices", icon: "breath" },
  playlist: { label: "Playlists", icon: "note-music" },
  teaching: { label: "Teachings", icon: "book" },
};

const TYPE_ORDER: FavouriteType[] = ["prayer", "affirmation", "practice", "playlist", "teaching"];

export function FavouritesClient(): JSX.Element {
  const {
    favourites,
    consentGiven,
    grantConsent,
    clearAll,
    exportJson,
    toggle,
    ready,
  } = useFavourites();
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [exported, setExported] = useState(false);

  function handleExport(): void {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "lumennous-saved-items.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setExported(true);
    window.setTimeout(() => setExported(false), 1600);
  }

  if (!ready) {
    return <div className="mt-10 h-40 animate-pulse rounded-md bg-[rgba(230,225,211,0.04)]" aria-hidden="true" />;
  }

  if (!consentGiven) {
    return (
      <section aria-labelledby="fav-consent" className="glass mt-8 rounded-md p-6">
        <h2 id="fav-consent" className="t-h3 text-ink-strong">
          Saving is off until you say so
        </h2>
        <p className="t-body-sm mt-3 text-ink-muted">
          Saved items are stored only in this browser. Nothing is uploaded, no
          account is created, and you can delete everything at any time. Local
          storage is not a cloud backup.
        </p>
        <div className="mt-5">
          <Button variant="primary" onClick={grantConsent}>
            Enable saved items on this device
          </Button>
        </div>
      </section>
    );
  }

  if (favourites.length === 0) {
    return (
      <section aria-label="No saved items yet" className="mt-12 text-center">
        <Icon name="heart" className="mx-auto h-8 w-8 text-ink-ghost" aria-hidden="true" />
        <p className="t-h3 mt-4 text-ink-strong">Nothing saved yet</p>
        <p className="t-body-sm mx-auto mt-2 max-w-[40ch] text-ink-muted">
          When a prayer, practice or playlist speaks to you, tap the heart to
          keep it here.
        </p>
        <div className="mt-6">
          <Button variant="secondary" href="/">
            Back to today&apos;s prayer
          </Button>
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="mt-8 space-y-10">
        {TYPE_ORDER.map((type) => {
          const items = favourites.filter((entry) => entry.type === type);
          if (items.length === 0) return null;
          const meta = TYPE_META[type];
          return (
            <section key={type} aria-labelledby={`fav-${type}`}>
              <h2 id={`fav-${type}`} className="t-eyebrow flex items-center gap-2 border-b border-line-subtle pb-3 text-ink-faint">
                <Icon name={meta.icon} className="h-4 w-4" aria-hidden="true" />
                {meta.label} · {items.length}
              </h2>
              <ul className="divide-y divide-line-subtle">
                {items.map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between gap-4 py-3">
                    <Link
                      href={entry.href}
                      className="t-body min-w-0 truncate font-sans text-ink-strong underline-offset-4 hover:underline"
                    >
                      {entry.title}
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggle(entry)}
                      aria-label={`Remove “${entry.title}” from saved items`}
                      className="glass inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full p-2.5 text-ink-muted transition-colors duration-200 ease-std hover:border-line hover:text-ink-strong"
                    >
                      <Icon name="x" className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <section aria-label="Manage local data" className="mt-12 border-t border-line-subtle pt-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" onClick={handleExport}>
            <Icon name="download" className="h-4 w-4" aria-hidden="true" />
            {exported ? "Exported" : "Export as JSON"}
          </Button>
          {confirmingClear ? (
            <>
              <Button
                variant="destructive-quiet"
                onClick={() => {
                  clearAll();
                  setConfirmingClear(false);
                }}
              >
                Yes, delete saved items
              </Button>
              <Button variant="ghost" onClick={() => setConfirmingClear(false)}>
                Keep them
              </Button>
            </>
          ) : (
            <Button variant="ghost" onClick={() => setConfirmingClear(true)}>
              <Icon name="trash" className="h-4 w-4" aria-hidden="true" />
              Delete all saved items
            </Button>
          )}
        </div>
        <p className="t-meta mt-3 text-ink-faint">
          Deleting clears saved items from this browser. There is nothing to
          delete on our side because nothing was sent.
        </p>
      </section>
    </>
  );
}
