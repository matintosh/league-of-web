"use client";

import { rpTopUpIconUrl } from "@low/fixtures";
import { RpTopUpButton } from "./rp-top-up-button";

/** Production config — all three real CommunityDragon states wired. */
export function RpTopUpButtonDefaultDemo() {
  return (
    <RpTopUpButton
      restingSrc={rpTopUpIconUrl("resting")}
      hoverSrc={rpTopUpIconUrl("hover")}
      pressedSrc={rpTopUpIconUrl("pressed")}
      onClick={() => console.log("rp top-up")}
    />
  );
}

/** Resting-only — no hover/pressed URLs, so the disc never swaps. */
export function RpTopUpButtonRestingOnlyDemo() {
  return (
    <RpTopUpButton
      restingSrc={rpTopUpIconUrl("resting")}
      onClick={() => console.log("rp top-up")}
    />
  );
}

/** Larger disc (28px) to confirm the size prop scales the art. */
export function RpTopUpButtonLargeDemo() {
  return (
    <RpTopUpButton
      restingSrc={rpTopUpIconUrl("resting")}
      hoverSrc={rpTopUpIconUrl("hover")}
      pressedSrc={rpTopUpIconUrl("pressed")}
      size={28}
      onClick={() => console.log("rp top-up")}
    />
  );
}
