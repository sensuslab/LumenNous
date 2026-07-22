import type { JSX } from "react";

/**
 * Divider — the Constellation Divider (design.md §3.5): a 1px --line-subtle
 * hairline parted by a centered 13×13 four-point star in --gold-deep.
 * Vertical margin --s-10. Decorative (aria-hidden); use between major
 * sections, not as a semantic <hr>.
 */

export function Divider({ className = "" }: { className?: string }): JSX.Element {
  return (
    <div aria-hidden="true" className={`my-10 flex items-center gap-3 ${className}`}>
      <div className="h-px flex-1 bg-line-subtle" />
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path
          d="M6.5 0.8 7.7 5.3 12.2 6.5 7.7 7.7 6.5 12.2 5.3 7.7 0.8 6.5 5.3 5.3Z"
          stroke="var(--gold-deep)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
      <div className="h-px flex-1 bg-line-subtle" />
    </div>
  );
}
