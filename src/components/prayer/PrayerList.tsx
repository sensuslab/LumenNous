"use client";

import { useState, type JSX } from "react";
import type { Prayer } from "@/lib/schemas";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { FavouriteButton } from "./FavouriteButton";
import { CopyButton } from "./ShareButton";

/**
 * PrayerList (category.md §5a) — preview rows expanding inline into full
 * prayers, paginated six at a time without a route change.
 */

const PAGE_SIZE = 6;

export interface PrayerListItem {
  prayer: Prayer;
  practiceHref: string | null;
}

export function PrayerList({
  items,
  categorySlug,
  className = "",
}: {
  items: readonly PrayerListItem[];
  categorySlug: string;
  className?: string;
}): JSX.Element {
  const [openId, setOpenId] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE_SIZE);

  const visible = items.slice(0, shown);

  return (
    <div className={className}>
      <ul className="divide-y divide-line-subtle border-y border-line-subtle">
        {visible.map(({ prayer, practiceHref }) => {
          const open = openId === prayer.id;
          return (
            <li key={prayer.id}>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : prayer.id)}
                className="flex w-full items-baseline justify-between gap-4 py-4 text-left"
              >
                <span className="min-w-0">
                  <span className="t-h3 block truncate text-ink-strong">{prayer.title}</span>
                  <span className="t-body-sm mt-1 block truncate text-ink-muted">{prayer.opening}</span>
                </span>
                <span className="t-meta inline-flex shrink-0 items-center gap-1.5 text-ink-faint">
                  <Icon name="timer" className="h-3.5 w-3.5" aria-hidden="true" />
                  {prayer.practiceDuration} min
                  <Icon
                    name="chevron-down"
                    className={`h-4 w-4 transition-transform duration-200 ease-std ${open ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </span>
              </button>
              {open ? (
                <div className="pb-6 pl-1">
                  <div className="t-prayer-sm max-w-[38ch] text-ink">
                    <p className="italic">{prayer.opening}</p>
                    <p className="mt-3">{prayer.body}</p>
                    <p className="mt-3">{prayer.closing}</p>
                  </div>
                  <p className="t-body-sm mt-4 border-l-2 border-line-strong pl-3 italic text-ink-muted">
                    {prayer.affirmation}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {practiceHref ? (
                      <Button variant="secondary" href={practiceHref}>
                        Begin practice
                      </Button>
                    ) : null}
                    <FavouriteButton
                      item={{
                        id: prayer.id,
                        type: "prayer",
                        title: prayer.title,
                        href: `/explore/${categorySlug}`,
                        addedAt: new Date().toISOString(),
                      }}
                    />
                    <CopyButton
                      text={`${prayer.opening}\n\n${prayer.body}\n\n${prayer.closing}`}
                      label={`Copy “${prayer.title}”`}
                    />
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
      {shown < items.length ? (
        <Button
          variant="ghost"
          className="mt-3"
          onClick={() => setShown((n) => n + PAGE_SIZE)}
        >
          Show all {items.length} prayers
        </Button>
      ) : null}
    </div>
  );
}
