import type { JSX } from "react";
import type { ReflectionPrompt as ReflectionPromptType } from "@/lib/schemas";
import { Icon } from "@/components/ui/Icon";

/**
 * ReflectionPrompt (design.md §6.9) — an open question to sit with.
 * Never requires a written answer; there is deliberately no input field
 * (brief: the app does not ask users to record their thoughts).
 */

export function ReflectionPrompt({
  prompt,
  className = "",
}: {
  prompt: ReflectionPromptType;
  className?: string;
}): JSX.Element {
  return (
    <figure
      className={`rounded-md border border-line-subtle bg-[rgba(230,225,211,0.02)] p-5 ${className}`}
    >
      <figcaption className="t-eyebrow flex items-center gap-2 text-ink-faint">
        <Icon name="eye" className="h-4 w-4" aria-hidden="true" />
        To sit with — nothing to write down
      </figcaption>
      <blockquote className="t-prayer-sm mt-3 text-ink">{prompt.text}</blockquote>
    </figure>
  );
}
