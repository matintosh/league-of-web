"use client";

import type { ReactNode } from "react";
import type { Summoner } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface LobbyPlayerCardProps {
  /** The summoner to display. When undefined, renders an empty invite slot. */
  summoner?: Summoner;
  /**
   * Resolved URL for the profile icon image.
   * Derive with `profileIconUrl(summoner.profileIconId)` from `@low/fixtures`.
   * Ignored when `summoner` is undefined.
   */
  profileIconSrc?: string;
  /**
   * Slot for a RoleSelector or role badge row.
   * The card does NOT import RoleSelector — compose it in from the parent screen.
   * Ignored when `summoner` is undefined.
   */
  roleSlot?: ReactNode;
  /**
   * When true, renders with a brighter gold border to indicate the local player
   * or party leader.
   */
  emphasized?: boolean;
  /** Called when the user clicks the empty-slot invite button. */
  onInvite?: () => void;
}

// ---------------------------------------------------------------------------
// LobbyPlayerCard
// ---------------------------------------------------------------------------

/**
 * LobbyPlayerCard — vertical player card in the pre-game lobby.
 *
 * Filled: name at top, circular ~120px profile icon with gold ring + level pill,
 * and an optional role-picker slot at the bottom.
 * Empty: circular ~120px button with a + glyph only; calls `onInvite`.
 *
 * Presentational only — props in, callbacks out. No data fetching.
 */
export function LobbyPlayerCard({
  summoner,
  profileIconSrc,
  roleSlot,
  emphasized = false,
  onInvite,
}: LobbyPlayerCardProps) {
  // ------------------------------------------------------------------
  // Empty slot — #1006: circular ~120px button, + glyph only, no "INVITE" text
  // ------------------------------------------------------------------
  if (!summoner) {
    return (
      <button
        type="button"
        aria-label="Invite player"
        onClick={onInvite}
        className={[
          // Size — circular
          "flex h-[120px] w-[120px] rounded-full items-center justify-center",
          // Border — dashed, muted
          "border border-dashed border-grey-3",
          // Background
          "bg-blue-7",
          // Hover / focus states
          "cursor-pointer transition-colors duration-150",
          "hover:border-grey-1 hover:bg-blue-6",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
        ].join(" ")}
      >
        {/* + glyph */}
        <span className="text-3xl leading-none text-grey-2 select-none" aria-hidden="true">
          +
        </span>
      </button>
    );
  }

  // ------------------------------------------------------------------
  // Filled slot
  // ------------------------------------------------------------------
  const borderClass = emphasized ? "border-gold-4" : "border-gold-5";

  return (
    <div
      className={[
        // Size
        "flex w-[180px] h-[260px] flex-col items-center",
        // Surface + border
        "bg-blue-7 border",
        borderClass,
        // Padding
        "pt-4 pb-4 px-3 gap-2",
      ].join(" ")}
    >
      {/* #1005: Name area at the TOP, above the icon */}
      <div className="flex w-full min-w-0 flex-col items-center gap-0.5 shrink-0">
        {/* gameName */}
        <span className="w-full truncate text-center font-display text-sm uppercase tracking-wide text-gold-1">
          {summoner.gameName}
        </span>
        {/* #tagLine */}
        <span className="font-body text-xs text-grey-1">
          #{summoner.tagLine}
        </span>
      </div>

      {/* #1004: Profile icon — circular ~120px with gold ring + level pill */}
      <div className="relative shrink-0 mt-1">
        <img
          src={profileIconSrc}
          alt={summoner.gameName}
          width={120}
          height={120}
          className="h-[120px] w-[120px] rounded-full border-2 border-gold-4 object-cover"
        />
        {/* Level pill — overlaps the bottom edge of the icon */}
        <span
          className={[
            "absolute -bottom-3 left-1/2 -translate-x-1/2",
            "border border-gold-5 bg-hextech-black",
            "px-2 font-body text-xs leading-[18px] text-gold-1 rounded-sm",
            "whitespace-nowrap",
          ].join(" ")}
        >
          {summoner.level}
        </span>
      </div>

      {/* Spacer pushes role slot to bottom */}
      <div className="flex-1" />

      {/* Role slot — injected by the parent screen, e.g. <RoleSelector /> */}
      {roleSlot && (
        <div className="flex w-full items-center justify-center">
          {roleSlot}
        </div>
      )}
    </div>
  );
}
