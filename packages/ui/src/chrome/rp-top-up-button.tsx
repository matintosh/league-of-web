"use client";

import { useState } from "react";

export interface RpTopUpButtonProps {
  /**
   * Resting-state icon URL — the circular disc with a gold `+`.
   * Pass `rpTopUpIconUrl("resting")` from `@low/fixtures`.
   */
  restingSrc: string;
  /**
   * Hover-state icon URL. Pass `rpTopUpIconUrl("hover")` from `@low/fixtures`.
   * Optional — falls back to `restingSrc` when omitted.
   */
  hoverSrc?: string;
  /**
   * Pressed-state icon URL. Pass `rpTopUpIconUrl("pressed")` from `@low/fixtures`.
   * Optional — falls back to `hoverSrc`/`restingSrc` when omitted.
   */
  pressedSrc?: string;
  /** Rendered pixel size of the disc (square). Default 20 (reference size). */
  size?: number;
  /** Called when the button is activated (add-RP / top-up). */
  onClick: () => void;
}

/**
 * RpTopUpButton is the circular "add RP" disc that sits at the right end of the
 * RP capsule in the current-era top bar (era shift #386). It swaps between three
 * real CommunityDragon states — resting / hover / pressed — as a 1:1 image state
 * machine, matching the live client's `rp-top-up-nav-*.svg` assets.
 *
 * Purely presentational: the disc art is supplied as URLs (from `@low/fixtures`)
 * and the top-up action is emitted via `onClick`. Only local hover/press visual
 * state lives here.
 */
export function RpTopUpButton({
  restingSrc,
  hoverSrc,
  pressedSrc,
  size = 20,
  onClick,
}: RpTopUpButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const src = pressed
    ? pressedSrc ?? hoverSrc ?? restingSrc
    : hovered
    ? hoverSrc ?? restingSrc
    : restingSrc;

  return (
    <button
      type="button"
      aria-label="Buy Riot Points"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      className="inline-flex shrink-0 cursor-pointer items-center justify-center"
      style={{ width: size, height: size }}
    >
      <img src={src} alt="" aria-hidden="true" width={size} height={size} />
    </button>
  );
}
