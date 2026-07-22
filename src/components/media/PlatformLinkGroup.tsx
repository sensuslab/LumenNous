import type { JSX } from "react";
import type { AudioItem } from "@/lib/schemas";
import { Icon } from "@/components/ui/Icon";

/**
 * PlatformLinkGroup (design.md §6.12) — platform-branded external link
 * buttons. Curated platform records only; never scraped or proxied audio.
 */

const PLATFORM_LABEL: Record<AudioItem["platform"], string> = {
  youtube: "YouTube",
  spotify: "Spotify",
  "apple-music": "Apple Music",
  web: "Web",
};

const ACCESS_LABEL: Record<AudioItem["accessType"], string> = {
  free: "Free",
  subscription: "Subscription",
  "account-dependent": "Account needed",
};

export function platformLabel(platform: AudioItem["platform"]): string {
  return PLATFORM_LABEL[platform];
}

export function PlatformLinkGroup({
  item,
  className = "",
}: {
  item: AudioItem;
  className?: string;
}): JSX.Element | null {
  if (!item.url) return null;
  return (
    <span className={`inline-flex flex-wrap items-center gap-2 ${className}`}>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="glass inline-flex min-h-11 items-center gap-2 rounded-sm px-4 py-2 font-sans text-sm font-semibold text-ink-strong transition-colors duration-200 ease-std hover:border-line"
        aria-label={`Open “${item.title}” on ${PLATFORM_LABEL[item.platform]} in a new tab`}
      >
        <Icon name="note-music" className="h-4 w-4 text-blue" aria-hidden="true" />
        {PLATFORM_LABEL[item.platform]}
        <Icon name="arrow-up-right" className="h-3.5 w-3.5 text-ink-faint" aria-hidden="true" />
      </a>
      <span className="t-meta text-ink-faint">{ACCESS_LABEL[item.accessType]}</span>
    </span>
  );
}
