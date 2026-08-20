import type { JSX } from "react";
import type { Affirmation } from "@/lib/schemas";
import { GlassCard } from "@/components/ui/GlassCard";
import { Chip } from "@/components/ui/Chip";
import { FavouriteButton } from "./FavouriteButton";
import { CopyButton } from "./ShareButton";

/**
 * AffirmationCard (design.md §6.4) — serif affirmation text, type chip,
 * quiet save/copy actions. Affirmations never promise outcomes.
 */

const TYPE_LABEL: Record<Affirmation["affirmationType"], string> = {
  grounding: "Grounding",
  devotional: "Devotional",
  contemplative: "Contemplative",
  releasing: "Releasing",
  resilience: "Resilience",
  gratitude: "Gratitude",
};

export function AffirmationCard({
  affirmation,
  href,
  className = "",
}: {
  affirmation: Affirmation;
  /** Where the favourite entry should point back to. */
  href: string;
  className?: string;
}): JSX.Element {
  const copyText = `${affirmation.text}\n\nBack it with: ${affirmation.backingActHint}`;

  return (
    <GlassCard as="article" className={`flex flex-col gap-4 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <Chip kind="source" classification="EDIT">
          {TYPE_LABEL[affirmation.affirmationType]}
        </Chip>
        <div className="flex items-center gap-1.5">
          <FavouriteButton
            item={{
              id: affirmation.id,
              type: "affirmation",
              title: affirmation.text.slice(0, 80),
              href,
              addedAt: new Date().toISOString(),
            }}
          />
          <CopyButton text={copyText} label="Copy affirmation and next act" />
        </div>
      </div>
      <p className="t-prayer-sm text-ink-strong">{affirmation.text}</p>
      <div className="border-t border-line-subtle pt-4">
        <p className="t-eyebrow text-ink-faint">Back it with</p>
        <p className="t-body-sm mt-2 text-ink">{affirmation.backingActHint}</p>
      </div>
    </GlassCard>
  );
}
