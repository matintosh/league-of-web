"use client";

import type { Summoner, Availability } from "@low/fixtures";

export interface PlayerHovercardProps {
  /** The summoner whose identity is displayed. */
  summoner: Summoner;
  /**
   * Resolved URL for the profile icon image.
   * Caller derives this from summoner.profileIconId, e.g.:
   *   import { profileIconUrl } from "@low/fixtures";
   *   profileIconUrl(summoner.profileIconId)
   */
  profileIconSrc: string;
  /** Optional click handler (e.g. open profile panel). When provided the component renders with button semantics. */
  onClick?: () => void;
}

/** Maps each availability status to the appropriate Tailwind token class. */
const availabilityDot: Record<Availability, string> = {
  online: "bg-status-online",
  away: "bg-gold-3",
  "in-game": "bg-blue-2",
  "in-queue": "bg-blue-3",
  offline: "bg-grey-2",
};

/** Maps each availability status to an accessible label. */
const availabilityLabel: Record<Availability, string> = {
  online: "Online",
  away: "Away",
  "in-game": "In Game",
  "in-queue": "In Queue",
  offline: "Offline",
};

/**
 * PlayerHovercard — compact summoner identity card.
 * Shows a profile icon with level badge, gameName#tagLine, and a colored
 * availability dot. Used in the top-right navbar and the friends-list panel.
 * Presentational only: props in, callbacks out. No data fetching.
 */
export function PlayerHovercard({
  summoner,
  profileIconSrc,
  onClick,
}: PlayerHovercardProps) {
  const { gameName, tagLine, level, availability } = summoner;
  const dotClass = availabilityDot[availability];
  const statusLabel = availabilityLabel[availability];

  const inner = (
    <div className="flex items-center gap-2">
      {/* Profile icon with level badge */}
      <div className="relative shrink-0">
        <img
          src={profileIconSrc}
          alt={gameName}
          width={32}
          height={32}
          className="h-8 w-8 border border-gold-5 object-cover"
        />
        {/* Level badge — centered on bottom edge of icon */}
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 border border-gold-5 bg-hextech-black px-1 font-body text-xs leading-[14px] text-gold-1 rounded-sm">
          {level}
        </span>
      </div>

      {/* Availability dot + summoner name */}
      <div className="flex min-w-0 items-center gap-1.5">
        {/* Availability dot */}
        <span
          aria-label={statusLabel}
          className={`inline-block h-2 w-2 shrink-0 rounded-full transition-colors duration-150 ${dotClass}`}
        />

        {/* gameName#tagLine — truncate on overflow */}
        <span className="truncate font-body text-sm text-gold-1">
          {gameName}
          <span className="text-grey-1">#{tagLine}</span>
        </span>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer rounded-sm transition-colors duration-150 hover:bg-grey-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-4"
      >
        {inner}
      </button>
    );
  }

  return <div>{inner}</div>;
}
