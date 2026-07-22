import type { JSX } from "react";
import type { Metadata } from "next";
import { listAudioItems, listPlaylists } from "@/lib/content";
import { PlaylistCard } from "@/components/media/PlaylistCard";
import { ListenClient } from "@/components/media/ListenClient";
import { MusicRegisterExplorer } from "@/components/media/MusicRegisterExplorer";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";
import { musicRegister, musicRegisterFrequencies } from "@/data/music-register";

/**
 * Listen — `/listen` (listen.md). Curated music, sacred audio and playlists.
 * Third-party players load only after explicit user action.
 */

export const metadata: Metadata = {
  title: "Listen",
  description:
    "Curated sacred music, recitation and quiet sound — organised by purpose, with honest evidence labels.",
};

export default function ListenPage(): JSX.Element {
  const playlists = listPlaylists();
  const audio = listAudioItems();
  const purposes = playlists.map((playlist) => playlist.title);

  return (
    <>
      <HorizonGlow tone="blue" />
      <div className="relative mx-auto w-full max-w-[720px]">
        <section aria-labelledby="listen-title" className="mt-6">
          <p className="t-eyebrow text-blue">Sound &amp; silence</p>
          <h1 id="listen-title" className="t-h1 mt-2 text-ink-strong">
            Listen
          </h1>
          <p className="t-body mt-3 max-w-[52ch] text-ink-muted">
            Curated sacred music, recitation and quiet sound. Eligible YouTube
            selections play here, and no third-party player loads until you ask.
          </p>
        </section>

        <MusicRegisterExplorer
          items={musicRegister}
          frequencies={musicRegisterFrequencies}
        />

        <section aria-labelledby="playlist-groupings" className="mt-10">
          <h2 id="playlist-groupings" className="t-eyebrow border-b border-line-subtle pb-3 text-ink-faint">
            By purpose · {playlists.length} groupings
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.slug}
                playlist={playlist}
                itemCount={playlist.itemIds.length}
              />
            ))}
          </div>
        </section>

        <div className="mt-10">
          <h2 className="t-eyebrow border-b border-line-subtle pb-3 text-ink-faint">
            Individual listening · {audio.length} records
          </h2>
          <ListenClient items={audio} purposes={purposes} />
        </div>

        <section aria-labelledby="evidence-note" className="mt-12 rounded-md border border-line-subtle p-5">
          <h2 id="evidence-note" className="t-label font-sans text-ink-strong">
            A note on frequency claims
          </h2>
          <p className="t-body-sm mt-2 text-ink-muted">
            Some listening here references 432 Hz, 528 Hz, Solfeggio sets,
            binaural beats or chakra frequencies. These carry honest labels —
            traditional or symbolic use, experiential or practitioner claim,
            preliminary research, or no established clinical evidence. We
            never present a frequency as proven to heal organs, cleanse
            chakras, alter DNA or cure disease. Enjoy them as sound; hold the
            claims lightly.
          </p>
        </section>
      </div>
    </>
  );
}
