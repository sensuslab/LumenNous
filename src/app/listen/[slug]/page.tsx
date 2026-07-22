import Link from "next/link";
import { notFound } from "next/navigation";
import type { JSX } from "react";
import type { Metadata } from "next";
import { getPlaylistWithItems, listPlaylists } from "@/lib/content";
import { AudioCard } from "@/components/media/AudioCard";
import { FavouriteButton } from "@/components/prayer/FavouriteButton";
import { ShareButton } from "@/components/prayer/ShareButton";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";

/**
 * Playlist — `/listen/[slug]`. Purpose-based listening
 * grouping: curated records, platform links, evidence labels, click-to-load
 * embeds only.
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return listPlaylists().map((playlist) => ({ slug: playlist.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = getPlaylistWithItems(slug);
  if (!result) return {};
  return { title: result.playlist.title, description: result.playlist.description };
}

export default async function PlaylistPage({ params }: PageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const result = getPlaylistWithItems(slug);
  if (!result) notFound();

  const { playlist, items } = result;
  const hasFrequencyItems = items.some(
    (item) =>
      item.evidenceClassification === "experiential-claim" ||
      item.evidenceClassification === "no-established-clinical-evidence",
  );

  return (
    <>
      <HorizonGlow tone="blue" />
      <div className="relative mx-auto w-full max-w-[720px]">
        <Link
          href="/listen"
          className="t-body-sm inline-flex min-h-11 items-center gap-1 font-sans font-medium text-ink-muted hover:text-ink-strong"
        >
          <Icon name="chevron-left" className="h-4 w-4" aria-hidden="true" />
          Listen
        </Link>

        <header className="mt-6">
          <p className="t-eyebrow text-blue">Playlist · {playlist.intendedUse}</p>
          <h1 className="t-h1 mt-2 text-ink-strong">{playlist.title}</h1>
          <p className="t-body mt-3 max-w-[56ch] text-ink">{playlist.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="t-meta rounded-full border border-line-subtle px-3 py-1 text-ink-faint">
              {items.length} items
            </span>
            <span className="t-meta rounded-full border border-line-subtle px-3 py-1 text-ink-faint">
              About {playlist.duration} min
            </span>
            {playlist.editorialStatus === "draft" ? (
              <Chip kind="source" classification="EDIT">
                Draft editorial content
              </Chip>
            ) : null}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <FavouriteButton
              item={{
                id: playlist.id,
                type: "playlist",
                title: playlist.title,
                href: `/listen/${playlist.slug}`,
                addedAt: new Date().toISOString(),
              }}
            />
            <ShareButton title={playlist.title} text={playlist.description} />
          </div>
        </header>

        {playlist.externalLinks.length > 0 ? (
          <section aria-labelledby="hear-it-on" className="mt-8">
            <h2 id="hear-it-on" className="t-eyebrow text-ink-faint">
              Hear it on
            </h2>
            <ul className="mt-3 flex flex-wrap gap-3">
              {playlist.externalLinks
                .filter((link) => link.url)
                .map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass inline-flex min-h-11 items-center gap-2 rounded-sm px-4 py-2 font-sans text-sm font-semibold text-ink-strong transition-colors duration-200 ease-std hover:border-line"
                    >
                      {link.label}
                      <Icon name="arrow-up-right" className="h-3.5 w-3.5 text-ink-faint" aria-hidden="true" />
                    </a>
                  </li>
                ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="track-list" className="mt-10">
          <h2 id="track-list" className="t-eyebrow border-b border-line-subtle pb-3 text-ink-faint">
            In this grouping
          </h2>
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <AudioCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {hasFrequencyItems ? (
          <aside
            aria-label="Evidence note"
            className="mt-10 rounded-md border border-[rgba(229,192,123,0.3)] bg-[rgba(229,192,123,0.04)] p-5"
          >
            <p className="t-label font-sans text-warn">Evidence note</p>
            <p className="t-body-sm mt-2 text-ink-muted">
              This grouping includes frequency-based audio (such as Solfeggio
              or binaural recordings). Their labels reflect the honest state
              of evidence — nothing here is presented as proven to heal,
              cleanse or cure.
            </p>
          </aside>
        ) : null}

        <p className="t-meta mt-10 text-ink-faint">
          Playlist curation by LumenNous. Audio belongs to its creators and
          plays on their platforms.
        </p>
      </div>
    </>
  );
}
