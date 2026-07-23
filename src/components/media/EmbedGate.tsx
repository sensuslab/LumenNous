"use client";

import { useEffect, useId, useState, type JSX } from "react";
import {
  MEDIA_EMBED_OPEN_EVENT,
  SESSION_MEDIA_STOP_EVENT,
  type MediaEmbedOpenDetail,
} from "@/lib/media-events";
import { Icon } from "@/components/ui/Icon";

/**
 * EmbedGate (brief: MUSIC AND PLAYLIST INTEGRATION) — third-party iframes
 * load ONLY after an explicit user action. No autoplay, no trackers before
 * interaction, and always a plain external link as fallback.
 */

export function EmbedGate({
  embedUrl,
  externalUrl,
  title,
  platform,
  className = "",
  exclusiveGroup = "media-embed",
}: {
  embedUrl: string;
  externalUrl: string;
  title: string;
  platform: string;
  className?: string;
  exclusiveGroup?: string;
}): JSX.Element {
  const [allowed, setAllowed] = useState(false);
  const gateId = useId();

  useEffect(() => {
    function handleEmbedOpen(event: Event): void {
      const detail = (event as CustomEvent<MediaEmbedOpenDetail>).detail;
      if (
        detail?.group === exclusiveGroup &&
        detail.id !== gateId
      ) {
        setAllowed(false);
      }
    }

    function handleSessionMediaStop(): void {
      setAllowed(false);
    }

    window.addEventListener(MEDIA_EMBED_OPEN_EVENT, handleEmbedOpen);
    window.addEventListener(
      SESSION_MEDIA_STOP_EVENT,
      handleSessionMediaStop,
    );
    return () => {
      window.removeEventListener(MEDIA_EMBED_OPEN_EVENT, handleEmbedOpen);
      window.removeEventListener(
        SESSION_MEDIA_STOP_EVENT,
        handleSessionMediaStop,
      );
    };
  }, [exclusiveGroup, gateId]);

  if (!allowed) {
    return (
      <div
        className={`flex flex-col items-start gap-3 rounded-md border border-line-subtle bg-[rgba(230,225,211,0.02)] p-5 ${className}`}
      >
        <p className="t-body-sm text-ink-muted">
          This player is hosted by {platform}. It loads only when you choose —
          nothing is sent to {platform} before then.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent<MediaEmbedOpenDetail>(
                  MEDIA_EMBED_OPEN_EVENT,
                  {
                    detail: { group: exclusiveGroup, id: gateId },
                  },
                ),
              );
              setAllowed(true);
            }}
            className="glass inline-flex min-h-11 items-center gap-2 rounded-sm px-4 py-2 font-sans text-sm font-semibold text-ink-strong transition-colors duration-200 ease-std hover:border-line"
          >
            <Icon name="play" className="h-4 w-4" aria-hidden="true" />
            Load {platform} player
          </button>
          {externalUrl ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 px-2 font-sans text-sm font-medium text-ink-muted underline-offset-4 hover:text-ink-strong hover:underline"
            >
              Open on {platform}
              <Icon name="arrow-up-right" className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-md border border-line-subtle ${className}`}>
      <iframe
        src={embedUrl}
        title={`${title} — ${platform} player`}
        className="h-40 w-full"
        loading="lazy"
        allow="encrypted-media; clipboard-write"
        sandbox="allow-scripts allow-same-origin allow-presentation"
      />
    </div>
  );
}
