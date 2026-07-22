"use client";

import type { JSX } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function ReplayIntroductionButton(): JSX.Element {
  return (
    <Button
      variant="secondary"
      onClick={() => window.dispatchEvent(new Event("lumennous:intro:replay"))}
    >
      <Icon name="play" size={18} />
      Replay introduction
    </Button>
  );
}
