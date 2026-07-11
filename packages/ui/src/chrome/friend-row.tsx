"use client";

import type { Summoner, Availability } from "@low/fixtures";

export interface FriendRowProps {
  /** The summoner to display in this row. */
  summoner: Summoner;
  /**
   * Optional status line text below the name (e.g. "League of Legends",
   * "Ranked Solo/Duo"). When absent the status line is omitted.
   */
  statusText?: string;
  /**
   * Resolved URL for the profile icon image.
   * Caller derives this from summoner.profileIconId, e.g.:
   *   import { profileIconUrl } from "@low/fixtures";
   *   profileIconUrl(summoner.profileIconId)
   */
  profileIconSrc: string;
  /** When provided the row renders as a <button>; absent renders as a div. */
  onClick?: () => void;
}

/** Text color for the status line, keyed by availability. */
const statusTextColor: Record<Availability, string> = {
  online: "text-status-online",
  away: "text-gold-3",
  "in-game": "text-blue-2",
  "in-queue": "text-blue-3",
  offline: "text-grey-2",
};

/** Name text color, keyed by availability. Online/active statuses use grey-1; offline uses grey-2. */
const nameTextColor: Record<Availability, string> = {
  online: "text-grey-1",
  away: "text-grey-1",
  "in-game": "text-grey-1",
  "in-queue": "text-grey-1",
  offline: "text-grey-2",
};

/** Whether the avatar should be visually dimmed (offline-only treatment). */
const avatarDimmed: Record<Availability, boolean> = {
  online: false,
  away: false,
  "in-game": false,
  "in-queue": false,
  offline: true,
};

/**
 * FriendRow — single row in the social sidebar friends list.
 *
 * Shows a 36px circular profile icon with a thin gold ring, the summoner's
 * gameName, and an optional status line whose color maps to the availability
 * state. Offline friends get a dimmed avatar (brightness-50 + grayscale-[0.4]).
 *
 * When `onClick` is provided the row renders as a focusable <button> with an
 * aria-label; otherwise it renders as a plain div. Presentational only — no
 * data fetching.
 */
export function FriendRow({
  summoner,
  statusText,
  profileIconSrc,
  onClick,
}: FriendRowProps) {
  const { gameName, availability } = summoner;
  const dimmed = avatarDimmed[availability];

  const inner = (
    <div className="flex w-full items-center gap-2 px-3 py-1.5">
      {/* Circular avatar with thin gold ring */}
      <div className="shrink-0">
        <img
          src={profileIconSrc}
          alt={gameName}
          width={36}
          height={36}
          className={[
            "h-9 w-9 rounded-full border border-gold-5 object-cover",
            dimmed ? "brightness-50 grayscale-[0.4]" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </div>

      {/* Name + status text */}
      <div className="min-w-0 flex-1">
        <p className={`truncate font-body text-sm leading-tight ${nameTextColor[availability]}`}>
          {gameName}
        </p>
        {statusText != null && (
          <p className={`truncate font-body text-xs leading-tight ${statusTextColor[availability]}`}>
            {statusText}
          </p>
        )}
      </div>
    </div>
  );

  const baseClass = "group flex w-full items-center transition-colors duration-100 hover:bg-grey-cool";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`${gameName} — ${availability}`}
        className={`${baseClass} cursor-pointer text-left`}
      >
        {inner}
      </button>
    );
  }

  return <div className={baseClass}>{inner}</div>;
}
