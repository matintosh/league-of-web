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

/**
 * Text color for the status line, keyed by availability. Tones matched to the
 * current-era reference (client-current-home-2025-mf.png): "Online" renders
 * green, "In Game" / "In Queue" a bright cyan — the reference measures
 * rgb(21,194,221), so we use blue-2 (#0ac8b9 = rgb(10,200,185)), the closest
 * in-palette token; blue-3 (#0397ab = rgb(3,151,171)) read noticeably duller
 * and darker (issue #459). Away/busy gold, offline grey.
 */
const statusTextColor: Record<Availability, string> = {
  online: "text-status-online",
  away: "text-gold-3",
  "in-game": "text-blue-2",
  "in-queue": "text-blue-2",
  offline: "text-grey-2",
};

/**
 * Presence RING color for the avatar, keyed by availability. Mirrors the same
 * availability→token mapping as {@link statusTextColor} so the ring reads the
 * status at a glance: online → status-online green, in-game/in-queue → blue-2
 * cyan, away → gold-3 amber. Offline gets a neutral grey-2 ring (dimmed avatar
 * carries the offline read). Matches the current-era reference (#513).
 */
const ringColor: Record<Availability, string> = {
  online: "border-status-online",
  away: "border-gold-3",
  "in-game": "border-blue-2",
  "in-queue": "border-blue-2",
  offline: "border-grey-2",
};

/**
 * Presence PIP (status-dot) color, keyed by availability. Same mapping as the
 * ring, rendered as a filled dot overlapping the avatar's bottom-right edge.
 * Offline renders no pip (null) — the dimmed grey avatar is the offline signal.
 */
const pipColor: Record<Availability, string | null> = {
  online: "bg-status-online",
  away: "bg-gold-3",
  "in-game": "bg-blue-2",
  "in-queue": "bg-blue-2",
  offline: null,
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
 * Shows a 28px circular profile icon with a thin gold ring, the summoner's
 * gameName, and an optional status line whose color maps to the availability
 * state. Offline friends get a dimmed avatar (brightness-50 + grayscale-[0.4]).
 * Row metrics (28px avatar, 5px vertical padding → ~48px pitch, 13/11px text)
 * are PIL-measured from the current-era reference — the slim modern rail.
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
  const pip = pipColor[availability];

  const inner = (
    <div className="flex w-full items-center gap-2 px-3 py-[5px]">
      {/* Circular 30px avatar with a presence-colored ring + status pip.
          Ring + pip color come from the same availability→token mapping as the
          status text (online green / in-game cyan / away amber / offline grey),
          so who's online reads straight off the avatar (#513). */}
      <div className="relative shrink-0">
        <img
          src={profileIconSrc}
          alt={gameName}
          width={30}
          height={30}
          className={[
            `h-[30px] w-[30px] rounded-full border-2 object-cover ${ringColor[availability]}`,
            dimmed ? "brightness-50 grayscale-[0.4]" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
        {/* Presence pip — filled dot on the avatar's bottom-right edge, ringed
            in the panel bg so it reads as a separate badge. Omitted offline. */}
        {pip != null && (
          <span
            aria-hidden="true"
            className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-hextech-black ${pip}`}
          />
        )}
      </div>

      {/* Name + status text */}
      <div className="min-w-0 flex-1">
        <p className={`truncate font-body text-[13px] leading-tight ${nameTextColor[availability]}`}>
          {gameName}
        </p>
        {statusText != null && (
          <p className={`truncate font-body text-[11px] leading-tight ${statusTextColor[availability]}`}>
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
