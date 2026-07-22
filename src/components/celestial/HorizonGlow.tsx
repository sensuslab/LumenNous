import type { JSX } from "react";

/**
 * HorizonGlow (design.md §3.3) — page-top ambient radial glow.
 * violet (default) · gold (Today, morning hours 5:00–11:00 local) · blue
 * (Listen). Pure CSS via the .horizon utilities; sits at 40% opacity in
 * low-stimulation mode and never animates. aria-hidden always.
 */

export function HorizonGlow({
  tone = "violet",
  className = "",
}: {
  tone?: "violet" | "gold" | "blue";
  className?: string;
}): JSX.Element {
  const variant = tone === "gold" ? "horizon--gold" : tone === "blue" ? "horizon--blue" : "";
  return <div aria-hidden="true" className={`horizon ${variant} ${className}`} />;
}
