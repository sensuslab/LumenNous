import type { JSX, ReactNode } from "react";

/**
 * SectionHeading — eyebrow + serif title + optional description.
 * Use inside <section aria-labelledby={id}> with the returned heading id
 * (design.md §5.4: sections carry accessible names).
 */

export interface SectionHeadingProps {
  /** Mono uppercase eyebrow, e.g. "TODAY'S PRAYER" (§2.7 --t-eyebrow). */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Heading level — exactly one h1 per route (§5.4). Default 2. */
  level?: 1 | 2 | 3;
  /** id for aria-labelledby wiring. */
  id?: string;
  /** Eyebrow tint — gold default; violet for Create surfaces; blue for Listen. */
  eyebrowTone?: "gold" | "violet" | "blue" | "muted";
  align?: "left" | "center";
  className?: string;
}

const EYEBROW_TONES = {
  gold: "text-gold",
  violet: "text-violet",
  blue: "text-blue",
  muted: "text-ink-faint",
} as const;

export function SectionHeading({
  eyebrow,
  title,
  description,
  level = 2,
  id,
  eyebrowTone = "gold",
  align = "left",
  className = "",
}: SectionHeadingProps): JSX.Element {
  const Tag = (`h${level}`) as "h1" | "h2" | "h3";
  const titleClass = level === 1 ? "t-h1" : level === 2 ? "t-h2" : "t-h3";

  return (
    <header className={`${align === "center" ? "text-center" : ""} ${className}`}>
      {eyebrow ? (
        <p className={`t-eyebrow ${EYEBROW_TONES[eyebrowTone]} mb-3`}>{eyebrow}</p>
      ) : null}
      <Tag id={id} className={titleClass}>
        {title}
      </Tag>
      {description ? (
        <p
          className={`t-body-sm mt-3 measure-ui ${align === "center" ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}
