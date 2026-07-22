import Link from "next/link";
import type { JSX } from "react";
import type { Playlist } from "@/lib/schemas";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";

/**
 * PlaylistCard (design.md §6.11) — purpose-based listening grouping with a
 * generative cover and item count.
 */

export function PlaylistCard({
  playlist,
  itemCount,
  className = "",
}: {
  playlist: Playlist;
  itemCount: number;
  className?: string;
}): JSX.Element {
  return (
    <GlassCard as="article" interactive className={className}>
      <Link
        href={`/listen/${playlist.slug}`}
        className="group block focus-visible:outline-none"
        aria-label={`${playlist.title} — ${itemCount} items, about ${playlist.duration} minutes`}
      >
        <span
          aria-hidden="true"
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-sm border border-line-subtle bg-bg-2"
        >
          <Icon name="note-music" className="h-6 w-6 text-blue" aria-hidden="true" />
        </span>
        <h3 className="t-h3 text-ink-strong">{playlist.title}</h3>
        <p className="t-body-sm mt-2 line-clamp-2 text-ink-muted">{playlist.description}</p>
        <span className="t-meta mt-4 inline-flex items-center gap-2 text-ink-faint">
          {itemCount} items · about {playlist.duration} min
          <Icon
            name="arrow-up-right"
            className="h-3.5 w-3.5 transition-colors duration-200 ease-std group-hover:text-blue"
            aria-hidden="true"
          />
        </span>
      </Link>
    </GlassCard>
  );
}
