import type { JSX } from "react";
import type { Metadata } from "next";
import { FavouritesClient } from "@/components/prayer/FavouritesClient";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";
import { EngineHistoryControl } from "@/components/settings/EngineHistoryControl";

/**
 * Saved — `/saved`. Local-only saved items with
 * consent, JSON export and delete-all. No account, no cloud sync.
 */

export const metadata: Metadata = {
  title: "Saved",
  description:
    "Your saved prayers, affirmations, practices, playlists and teachings — stored only in this browser.",
};

export default function SavedPage(): JSX.Element {
  return (
    <>
      <HorizonGlow tone="violet" />
      <div className="relative mx-auto w-full max-w-[720px]">
        <section aria-labelledby="saved-title" className="mt-6">
          <p className="t-eyebrow text-ink-faint">Kept on this device</p>
          <h1 id="saved-title" className="t-h1 mt-2 text-ink-strong">
            Saved
          </h1>
          <p className="t-body mt-3 max-w-[52ch] text-ink-muted">
            Everything here lives only in this browser&apos;s storage — no
            account, nothing uploaded. Local storage is not a cloud backup;
            clearing your browser data removes it.
          </p>
        </section>
        <FavouritesClient />
        <EngineHistoryControl />
      </div>
    </>
  );
}
