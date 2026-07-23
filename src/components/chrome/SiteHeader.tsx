"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { JSX } from "react";
import { Icon } from "@/components/ui/Icon";
import { LowStimulationToggle } from "@/components/settings/LowStimulationToggle";

/**
 * SiteHeader (design.md §7) — 56px + safe-area, transparent at rest and
 * gaining the glass surface after 24px of scroll (200ms transition).
 * Root routes show the aperture mark + Cormorant wordmark; sub-routes show
 * a back chevron to the parent segment. Context actions on the right are
 * route-aware (Today: low-stimulation toggle + Saved shortcut).
 */

const ROOT_ROUTES = ["/", "/explore", "/create", "/listen", "/learn"];

function parentFor(pathname: string): string {
  if (pathname.startsWith("/explore/")) return "/explore";
  if (pathname.startsWith("/practice/")) return "/explore";
  if (pathname.startsWith("/listen/")) return "/listen";
  if (pathname.startsWith("/learn/")) return "/learn";
  if (pathname.startsWith("/sessions/")) return "/sessions";
  if (pathname === "/sessions") return "/create";
  if (pathname === "/saved" || pathname === "/about" || pathname === "/privacy") return "/";
  return "/";
}

export function SiteHeader(): JSX.Element {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isRoot = ROOT_ROUTES.includes(pathname);
  const parentHref = parentFor(pathname);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-200 ease-std lg:left-[72px]",
        scrolled ? "glass border-x-0 border-t-0 border-b border-line" : "border-b border-transparent",
      ].join(" ")}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex h-14 w-full max-w-[720px] items-center justify-between px-5 md:px-8 lg:max-w-none lg:px-8">
        {isRoot ? (
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-xs text-ink-strong"
            aria-label="LumenNous - Today"
          >
            <Icon name="aperture" size={24} className="text-ink" />
            <span className="font-serif text-[1.125rem] font-medium leading-none">
              LumenNous
            </span>
          </Link>
        ) : (
          <Link
            href={parentHref}
            className="flex min-h-11 items-center gap-1 rounded-xs text-ink-muted transition-colors duration-200 ease-std hover:text-ink"
          >
            <Icon name="chevron-left" size={20} />
            <span className="t-label">Back</span>
          </Link>
        )}

        <div className="flex items-center gap-2">
          {isRoot ? (
            <>
              {pathname === "/" ? <LowStimulationToggle /> : null}
              <Link
                href="/saved"
                aria-label="Saved"
                className="glass flex h-11 w-11 items-center justify-center rounded-full p-2.5 text-ink-muted transition-colors duration-200 ease-std hover:border-line hover:text-ink-strong"
              >
                <Icon name="heart" size={20} />
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
