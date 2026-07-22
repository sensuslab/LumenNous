import type { ElementType, JSX, ReactNode } from "react";

/**
 * GlassCard — the shared card geometry of Nocturne (design.md §6).
 * `.glass` surface + 1px --line-subtle hairline; hover (pointer:fine only)
 * shifts the border and lifts 2px — never a shadow. Pressed state returns
 * to rest with a slight brightness lift. All transitions are instant under
 * reduced motion / low-stimulation via the global override.
 */

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** Element type — use "article"/"section"/"li" for semantics. Default "div". */
  as?: ElementType;
  /** Larger radius + padding for hero cards (DailyPrayerCard geometry). */
  hero?: boolean;
  /** Enable hover lift + border shift (only for interactive cards). */
  interactive?: boolean;
  id?: string;
  ariaLabelledby?: string;
}

export function GlassCard({
  children,
  className = "",
  as: Tag = "div",
  hero = false,
  interactive = false,
  id,
  ariaLabelledby,
}: GlassCardProps): JSX.Element {
  const classes = [
    "glass content-surface",
    hero ? "rounded-lg p-6 md:p-8" : "rounded-md p-5 md:p-6",
    interactive
      ? [
          /* Tailwind v4 `hover:` is already gated behind @media (hover:hover) */
          "transition-[border-color,transform,filter] duration-200 ease-std",
          "hover:border-line hover:-translate-y-0.5",
          "active:translate-y-0 active:brightness-[1.06]",
        ].join(" ")
      : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag id={id} aria-labelledby={ariaLabelledby} className={classes}>
      {children}
    </Tag>
  );
}
