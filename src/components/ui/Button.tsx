import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, JSX, ReactNode } from "react";

/**
 * Button (design.md §6.2).
 *
 * primary   — pearl fill, ink text, Inter 600; the single strong action per
 *             viewport section. min-height 48px.
 * secondary — glass + hairline; hover warms to a gold hairline + gold tint.
 * ghost     — quiet text action, min-height 44px.
 * destructive-quiet — dim terracotta text + hairline; always labelled, never
 *             colour alone.
 * icon      — 44px circular hit area (40px visual); requires `label`.
 *
 * Press feedback: scale(0.98) + brightness lift, 120ms (§4.2). No ripples.
 * Renders a Next <Link> when `href` is given, otherwise a <button>.
 */

type Variant = "primary" | "secondary" | "ghost" | "destructive-quiet" | "icon";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: [
    "rounded-sm bg-pearl-fill text-bg-1",
    "font-sans font-semibold text-[0.9375rem] leading-none",
    "px-6 py-3.5 min-h-12",
    "hover:bg-pearl-fill-hover",
  ].join(" "),
  secondary: [
    "glass rounded-sm text-ink-strong",
    "font-sans font-semibold text-[0.9375rem] leading-none",
    "px-6 py-3.5 min-h-12",
    "hover:border-line-strong hover:text-gold",
  ].join(" "),
  ghost: [
    "rounded-sm text-ink-muted",
    "font-sans font-medium text-[0.9375rem]",
    "px-3 py-2 min-h-11",
    "hover:text-ink-strong hover:underline underline-offset-4",
  ].join(" "),
  "destructive-quiet": [
    "glass rounded-sm border-[rgba(201,138,138,0.35)] text-danger-quiet",
    "font-sans font-semibold text-[0.9375rem] leading-none",
    "px-6 py-3.5 min-h-12",
    "hover:border-[rgba(201,138,138,0.55)]",
  ].join(" "),
  icon: [
    "glass rounded-full text-ink-muted",
    "h-11 w-11 p-2.5", // 44px hit area; ~40px visual circle
    "hover:text-ink-strong hover:border-line",
  ].join(" "),
};

const PRESS =
  "active:scale-[0.98] active:brightness-[1.08] transition-[transform,filter,background-color,border-color,color] duration-[120ms] ease-std";

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  /** Required for variant="icon" — the accessible name. */
  label?: string;
}

export type ButtonProps = CommonProps &
  (
    | (Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & { href?: undefined })
    | (Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href"> & { href: string })
  );

export function Button(props: ButtonProps): JSX.Element {
  const { variant = "primary", className = "", children, label } = props;
  const classes = [
    "inline-flex items-center justify-center gap-2 select-none cursor-pointer",
    VARIANT_CLASSES[variant],
    PRESS,
    className,
  ].join(" ");
  const ariaLabel = variant === "icon" ? label : undefined;

  if ("href" in props && typeof props.href === "string") {
    const { href, variant: _v, className: _c, children: _ch, label: _l, ...rest } = props;
    return (
      <Link href={href} className={classes} aria-label={ariaLabel} {...rest}>
        {children}
      </Link>
    );
  }

  const {
    variant: _v,
    className: _c,
    children: _ch,
    label: _l,
    href: _h,
    type = "button",
    ...rest
  } = props;
  return (
    <button type={type} className={classes} aria-label={ariaLabel} {...rest}>
      {children}
    </button>
  );
}
