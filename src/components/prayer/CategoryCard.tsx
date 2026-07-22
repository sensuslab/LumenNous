import Link from "next/link";
import type { JSX } from "react";
import type { Category } from "@/lib/schemas";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * CategoryCard (design.md §6.5) — theme-tinted icon, name, short
 * description, hairline top accent on hover.
 */

/** Map the content layer's lucide-style icon names onto the Nocturne icon set. */
const ICON_MAP: Record<string, IconName> = {
  CloudRain: "drop",
  Compass: "compass",
  Eye: "eye",
  Flame: "flame",
  Heart: "heart",
  HeartHandshake: "hand",
  HeartPulse: "heart-fill",
  Layers: "circle",
  MoonStar: "moon",
  Mountain: "mountain",
  Orbit: "orbit",
  Palette: "spiral",
  Scale: "anchor",
  Shield: "shield",
  Sprout: "seed",
  Sun: "sun",
  Sunrise: "sunrise",
  Telescope: "star",
  Waves: "wave",
  Waypoints: "orbit-dot",
  Wheat: "leaf",
  Wind: "breath",
};

const THEME_TEXT: Record<string, string> = {
  gold: "text-gold",
  violet: "text-violet",
  azure: "text-blue",
  pearl: "text-pearl",
  rose: "text-safety",
  sage: "text-ok",
  amber: "text-warn",
  indigo: "text-violet",
  teal: "text-blue",
  ember: "text-warn",
  moonlight: "text-pearl",
  terra: "text-safety",
};

export function categoryIcon(name: string): IconName {
  return ICON_MAP[name] ?? "star";
}

export function CategoryCard({
  category,
  counts,
  className = "",
}: {
  category: Category;
  /** Optional mono count footer, e.g. "3 prayers · 4 affirmations · 2 practices". */
  counts?: string;
  className?: string;
}): JSX.Element {
  return (
    <GlassCard
      as="article"
      interactive
      className={`relative overflow-hidden ${className}`}
    >
      <Link
        href={`/explore/${category.slug}`}
        className="group block focus-visible:outline-none"
        aria-label={`${category.name} — ${category.shortDescription}`}
      >
        <span
          aria-hidden="true"
          className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-sm border border-line-subtle ${THEME_TEXT[category.theme] ?? "text-ink"}`}
        >
          <Icon name={categoryIcon(category.icon)} className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="t-h3 text-ink-strong">{category.name}</h3>
        <p className="t-body-sm mt-2 text-ink-muted">{category.shortDescription}</p>
        {counts ? <p className="t-meta mt-3 text-ink-faint">{counts}</p> : null}
        <span className="t-meta mt-4 inline-flex items-center gap-1 text-ink-faint transition-colors duration-200 ease-std group-hover:text-gold">
          Open
          <Icon name="arrow-up-right" className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </Link>
    </GlassCard>
  );
}
