"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, JSX } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * BottomNavigation (design.md §6.1) — persistent 5-tab wayfinding.
 *
 * Fixed bottom bar, 64px + safe-area; nav glass (20px blur) with a --line
 * top hairline and the only "sheet" shadow in the system. The active tab is
 * gold with a 24×2px indicator 1px from the top edge that slides between
 * tabs with a transform-only 240ms move. Create (center) carries the single
 * emphasis: a 40px circle with a 1px gold hairline ring, filled at gold 8%
 * when active — calm alignment, not a FAB.
 *
 * ≥1024px the bar becomes a 72px slim left rail (design.md §7) with the
 * indicator rotated to the left edge. Items keep ≥64×48px targets and
 * always-visible 11px labels; active route gets aria-current="page".
 */

const TABS: ReadonlyArray<{ href: string; label: string; icon: IconName }> = [
  { href: "/", label: "Today", icon: "sunrise" },
  { href: "/explore", label: "Explore", icon: "constellation" },
  { href: "/create", label: "Create", icon: "spark" },
  { href: "/listen", label: "Listen", icon: "waveform" },
  { href: "/learn", label: "Learn", icon: "book-open" },
];

function activeIndexFor(pathname: string): number {
  const ownedPath = pathname.startsWith("/practice/")
    ? "/explore"
    : pathname;
  const idx = TABS.findIndex((t) =>
    t.href === "/" ? ownedPath === "/" : ownedPath.startsWith(t.href),
  );
  return idx;
}

export function BottomNavigation(): JSX.Element {
  const pathname = usePathname() ?? "/";
  const activeIndex = activeIndexFor(pathname);

  return (
    <nav
      aria-label="Primary"
      className={[
        "glass fixed inset-x-0 bottom-0 z-50",
        "border-x-0 border-b-0 border-t border-line",
        "shadow-sheet",
        "lg:inset-y-0 lg:left-0 lg:right-auto lg:w-[72px]",
        "lg:border-t-0 lg:border-r lg:shadow-none",
      ].join(" ")}
      style={{ "--glass-blur": "blur(20px) saturate(140%)" } as CSSProperties}
    >
      <ul
        className="relative mx-auto flex h-16 max-w-lg items-stretch lg:h-full lg:max-w-none lg:flex-col lg:items-center lg:justify-start lg:gap-2 lg:pt-24"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
          "--tab-idx": Math.max(activeIndex, 0),
        } as CSSProperties}
      >
        {/* Active indicator — transform-only slide (mobile: top edge;
            desktop rail: left edge, rotated) */}
        <li aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-0.5 lg:inset-y-0 lg:left-0 lg:right-auto lg:top-0 lg:h-full lg:w-0.5 ${activeIndex < 0 ? "hidden" : ""}`}>
          <span
            className={[
              "block h-full w-1/5 transition-transform duration-[240ms] ease-out",
              "translate-x-[calc(var(--tab-idx)*100%)]",
              /* rail: 96px top padding + 72px per slot (64px item + 8px gap) */
              "lg:h-16 lg:w-full lg:translate-x-0 lg:translate-y-[calc(96px+var(--tab-idx)*72px)]",
            ].join(" ")}
          >
            <span className="mx-auto block h-0.5 w-6 rounded-pill bg-gold lg:mx-0 lg:h-6 lg:w-0.5 lg:translate-y-5" />
          </span>
        </li>

        {TABS.map((tab, i) => {
          const active = i === activeIndex;
          const isCreate = tab.href === "/create";
          return (
            <li key={tab.href} className="flex-1 lg:w-full lg:flex-none">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex h-16 min-w-16 flex-col items-center justify-center gap-1 lg:w-full",
                  "transition-colors duration-200 ease-std",
                  active ? "text-gold" : "text-ink-muted hover:text-ink",
                ].join(" ")}
              >
                {isCreate ? (
                  <span
                    className={[
                      "flex h-10 w-10 items-center justify-center rounded-full border border-line-strong",
                      active ? "bg-[rgba(217,186,133,0.08)]" : "",
                    ].join(" ")}
                  >
                    <Icon name={tab.icon} size={24} />
                  </span>
                ) : (
                  <Icon name={tab.icon} size={24} />
                )}
                <span className="text-[11px] font-medium leading-none tracking-[0.01em]">
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
