"use client";

import { useEffect, useMemo, useRef } from "react";
import type { CSSProperties, JSX } from "react";

/**
 * Starfield (design.md §3.1) — global, behind all pages, aria-hidden always.
 *
 * Three layers of box-shadow stars whose positions come from a fixed-seed
 * PRNG (mulberry32), so server and client markup match exactly and the sky
 * is the same on every visit ("seeded once", deterministic).
 *
 *   Layer 1 · 1px stars, opacity .5, static
 *   Layer 2 · 1.5px stars, opacity .7, 3 sub-groups twinkling 5–8s (≤3
 *             simultaneous animated groups — the ambient-motion cap)
 *   Layer 3 · 2px stars + 2 gold cross-glints, slow 8s twinkle
 *
 * Total 110 stars ≤ 140 viewport cap. Parallax translates layers at
 * scroll × 0.015 / 0.04 / 0.07 via rAF and is fully disabled under
 * prefers-reduced-motion or [data-stim="low"] (static sky at rest).
 * `density="low"` drops opacity to 60% for content-heavy routes.
 */

/* Fixed seeds — do not change without re-tuning the sky. */
const SEEDS = [20260718, 451, 97] as const;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Star = { x: number; y: number; alpha: number; warm: boolean };

function makeStars(seed: number, count: number): Star[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => ({
    x: Math.round(rand() * 1000) / 10,
    y: Math.round(rand() * 1000) / 10,
    alpha: 0.3 + Math.round(rand() * 55) / 100,
    warm: rand() > 0.5,
  }));
}

function shadowList(stars: Star[]): string {
  return stars
    .map(
      (s) =>
        `${s.x}vw ${s.y}vh rgba(${s.warm ? "217,186,133" : "244,240,230"},${s.alpha.toFixed(2)})`,
    )
    .join(", ");
}

function split<T>(items: T[], parts: number): T[][] {
  return Array.from({ length: parts }, (_, i) => items.filter((_, n) => n % parts === i));
}

/* Layer 2 sub-group tempo: 5–8s durations, 0–6s delays (design.md §3.1) */
const TWINKLE_GROUPS = [
  { duration: "5.5s", delay: "0s" },
  { duration: "7s", delay: "2.4s" },
  { duration: "6.2s", delay: "4.8s"},
] as const;

const GLINTS = [
  { left: "22vw", top: "18vh", delay: "0s" },
  { left: "71vw", top: "64vh", delay: "3.6s" },
] as const;

export function Starfield({
  density = "normal",
  className = "",
}: {
  density?: "normal" | "low";
  className?: string;
}): JSX.Element {
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);

  const [layer1, layer2Groups, layer3] = useMemo(() => {
    const l1 = makeStars(SEEDS[0], 50);
    const l2 = split(makeStars(SEEDS[1], 45), 3);
    const l3 = makeStars(SEEDS[2], 15);
    return [shadowList(l1), l2.map(shadowList), shadowList(l3)];
  }, []);

  /* Scroll parallax — rAF-throttled, transform-only, disabled when the
     user prefers stillness (reduced motion or low-stimulation mode). */
  useEffect(() => {
    const factors = [0.015, 0.04, 0.07];
    let ticking = false;

    const still = (): boolean =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.dataset.stim === "low";

    const apply = (): void => {
      ticking = false;
      const y = still() ? 0 : window.scrollY;
      layerRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `translate3d(0, ${(y * factors[i]).toFixed(1)}px, 0)`;
      });
    };

    const onScroll = (): void => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(apply);
      }
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const star = (size: number, boxShadow: string): CSSProperties => ({
    width: size,
    height: size,
    boxShadow,
  });

  return (
    <div aria-hidden="true" className={`starfield ${className}`} data-density={density}>
      {/* Layer 1 — static */}
      <div ref={(el) => void (layerRefs.current[0] = el)} className="starfield__layer opacity-50">
        <span style={star(1, layer1)} />
      </div>

      {/* Layer 2 — three twinkling sub-groups */}
      <div ref={(el) => void (layerRefs.current[1] = el)} className="starfield__layer opacity-70">
        {layer2Groups.map((shadows, i) => (
          <span
            key={i}
            className="animate-twinkle"
            style={{
              ...star(1.5, shadows),
              animationDuration: TWINKLE_GROUPS[i].duration,
              animationDelay: TWINKLE_GROUPS[i].delay,
            }}
          />
        ))}
      </div>

      {/* Layer 3 — bright stars + gold cross-glints */}
      <div ref={(el) => void (layerRefs.current[2] = el)} className="starfield__layer">
        <span
          className="animate-twinkle-slow opacity-80"
          style={star(2, layer3)}
        />
        {GLINTS.map((g, i) => (
          <svg
            key={i}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            className="animate-twinkle-slow absolute"
            style={{ left: g.left, top: g.top, animationDelay: g.delay }}
            fill="none"
          >
            <path
              d="M6 0.8 7 5 11.2 6 7 7 6 11.2 5 7 0.8 6 5 5Z"
              fill="rgba(217,186,133,0.4)"
            />
          </svg>
        ))}
      </div>
    </div>
  );
}
