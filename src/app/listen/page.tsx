import type { JSX } from "react";
import type { Metadata } from "next";
import { MusicRegisterExplorer } from "@/components/media/MusicRegisterExplorer";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";
import { musicFrequenciesFor } from "@/data/music-register";
import { publicMusicRegister } from "@/data/music-selections";

/**
 * Listen — `/listen` (listen.md). Curated music, sacred audio and playlists.
 * Third-party players load only after explicit user action.
 */

export const metadata: Metadata = {
  title: "Listen",
  description:
    "Reviewed contemplative listening with clear evidence labels and consent-gated playback.",
};

export default function ListenPage(): JSX.Element {
  return (
    <>
      <HorizonGlow tone="blue" />
      <div className="relative mx-auto w-full max-w-[720px]">
        <section aria-labelledby="listen-title" className="mt-6">
          <p className="t-eyebrow text-blue">Reviewed listening</p>
          <h1 id="listen-title" className="t-h1 mt-2 text-ink-strong">
            Listen
          </h1>
          <p className="t-body mt-3 max-w-[52ch] text-ink-muted">
            A small, deliberately reviewed collection of nature sound, quiet
            instrumental music, sacred chant and singing bowls. Choose sound
            as an optional companion to prayer or stillness; no third-party
            player loads until you ask.
          </p>
        </section>

        <MusicRegisterExplorer
          items={publicMusicRegister}
          frequencies={musicFrequenciesFor(publicMusicRegister)}
        />

        <section aria-labelledby="listening-boundary" className="mt-12 rounded-md border border-line-subtle p-5">
          <h2 id="listening-boundary" className="t-label font-sans text-ink-strong">
            Listening, not treatment
          </h2>
          <p className="t-body-sm mt-2 text-ink-muted">
            These selections support reflective listening; they are not music
            therapy, medical care or a promised route to a particular outcome.
            Keep the volume comfortable, and continue in silence whenever
            sound stops helping.
          </p>
        </section>
      </div>
    </>
  );
}
