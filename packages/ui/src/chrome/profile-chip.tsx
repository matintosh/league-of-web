"use client";

import { useId } from "react";
import type { Summoner, Availability } from "@low/fixtures";

/**
 * Placement variant for ProfileChip.
 *
 * - `"rail"` (default) — the original social-rail header chip (#146): 48px
 *   avatar, gold-2 name, grey status label, bordered blue-7 strip that heads
 *   the docked rail column.
 * - `"navband"` — the current-era compact chip that lives at the top-right of
 *   the TopNavbar band (era shift #384 / #387). Smaller 34px avatar, cream
 *   (gold-1) name, availability-tinted status text, and a transparent
 *   background so it blends into the nav band. Sits BELOW the floating window
 *   controls (?─⚙✕) per the reference — see TopNavbar's playerSlot placement.
 */
export type ProfileChipVariant = "rail" | "navband";

export interface ProfileChipProps {
  /** The local player's summoner data. */
  summoner: Summoner;
  /** Summoner level displayed in the badge pill. */
  level: number;
  /** Resolved URL for the circular avatar image. */
  profileIconSrc: string;
  /** Called when the bell icon is clicked. Optional; no-op when absent. */
  onNotifications?: () => void;
  /**
   * Optional override for the availability label text. When provided, replaces
   * the default availability label (e.g. "Online") with this string, truncated
   * with ellipsis if it overflows the chip width. The status dot color continues
   * to reflect summoner.availability. Omit to preserve current rendering.
   */
  statusText?: string;
  /**
   * Placement variant — `"rail"` (default) for the social-rail header, or
   * `"navband"` for the compact current-era chip in the TopNavbar band.
   * Defaults to `"rail"` for back-compat with existing call sites.
   */
  variant?: ProfileChipVariant;
}

// ---------------------------------------------------------------------------
// Availability maps — exhaustive Record, mirrors FriendRow/PlayerHovercard pattern
// ---------------------------------------------------------------------------

/** Status dot background token class per availability state. */
const availabilityDot: Record<Availability, string> = {
  online: "bg-status-online",
  away: "bg-gold-3",
  "in-game": "bg-blue-2",
  "in-queue": "bg-blue-3",
  offline: "bg-grey-2",
};

/** Human-readable availability label per state. */
const availabilityLabel: Record<Availability, string> = {
  online: "Online",
  away: "Away",
  "in-game": "In Game",
  "in-queue": "In Queue",
  offline: "Offline",
};

/**
 * Status-text color token per availability — used by the `"navband"` variant,
 * where the status line is tinted to match its dot (green "Online" in the
 * current-era reference) rather than the muted grey label of the rail variant.
 */
const availabilityText: Record<Availability, string> = {
  online: "text-status-online",
  away: "text-gold-3",
  "in-game": "text-blue-2",
  "in-queue": "text-blue-3",
  offline: "text-grey-2",
};

// ---------------------------------------------------------------------------
// OrnateRing — double gold ring with finial ticks at cardinal points (SVG)
// ---------------------------------------------------------------------------

/**
 * Renders the ornate double-ring avatar border that frames the ProfileChip
 * circular avatar. Two concentric stroked circles plus eight short tick marks
 * at the top, right, bottom, and left cardinal mid-points (pairs of ticks
 * flanking each cardinal).
 *
 * Tick geometry (reference-sampled): outer ring r=24 · inner ring r=21 ·
 * ticks are ~3px radial lines just outside the outer ring, 4px apart in pairs.
 *
 * All IDs are namespaced with a useId() prefix to be safe when multiple chips
 * appear on the same page.
 */
function OrnateRing({ size, uid }: { size: number; uid: string }) {
  const cx = size / 2;
  const cy = size / 2;
  // Ring radii — proportional to 48px design size
  const outerR = size * 0.5 - 1;           // just inside viewBox edge
  const innerR = outerR - 3;               // 3px gap between rings
  const clipR  = innerR - 1.5;             // clip circle for avatar (inside inner ring)
  const clipId = `${uid}-rc`;
  const gradId = `${uid}-rg`;

  // Finial tick geometry: short radial lines just beyond outerR
  const tickStart = outerR + 1.5;
  const tickEnd   = outerR + 4.5;

  // Tick angle offsets (degrees) — pairs 6° apart flanking each cardinal
  const cardinals = [0, 90, 180, 270]; // top, right, bottom, left
  const tickOffsets = [-3, 3];

  const toXY = (angleDeg: number, r: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180; // -90 so 0° = top
    return { x: cx + Math.cos(rad) * r, y: cy + Math.sin(rad) * r };
  };

  const ticks = cardinals.flatMap((base) =>
    tickOffsets.map((offset) => {
      const angle = base + offset;
      const s = toXY(angle, tickStart);
      const e = toXY(angle, tickEnd);
      return { x1: s.x, y1: s.y, x2: e.x, y2: e.y };
    }),
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <defs>
        {/* Gold gradient for rings — top: gold-3 → bottom: gold-5 */}
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="var(--color-gold-3)" />
          <stop offset="100%" stopColor="var(--color-gold-5)" />
        </linearGradient>
        {/* Clip to inner circle so avatar image stays circular */}
        <clipPath id={clipId}>
          <circle cx={cx} cy={cy} r={clipR} />
        </clipPath>
      </defs>

      {/* Outer ring */}
      <circle
        cx={cx} cy={cy} r={outerR}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={1.5}
      />
      {/* Inner ring */}
      <circle
        cx={cx} cy={cy} r={innerR}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={1}
        strokeOpacity={0.7}
      />
      {/* Finial tick pairs at each cardinal */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1} y1={t.y1}
          x2={t.x2} y2={t.y2}
          stroke={`url(#${gradId})`}
          strokeWidth={1}
          strokeLinecap="round"
        />
      ))}
      {/* Clip path is used on the img below, exposed via clipId */}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// BellIcon — notification bell
// ---------------------------------------------------------------------------

/**
 * Notification bell glyph.
 *
 * Drawn inline in tokens (currentColor) because there is NO standalone bell
 * asset on the CommunityDragon CDN — the nearest asset,
 * `top-nav-updates-eat-icon.svg`, is a player-bust "updates" badge, not a bell
 * (ICON-SOURCES.md, #389/#386 asset hunt). This hand-drawn glyph is the agreed
 * placeholder for the current-era chip's bell (follow-up #399: swap for a
 * literal CDN bell if one is ever located). `size` lets the navband variant
 * render a slightly smaller bell than the rail header.
 */
function BellIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 1.5a4.5 4.5 0 0 0-4.5 4.5v3l-1 1.5h11l-1-1.5V6A4.5 4.5 0 0 0 8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 10.5a1.5 1.5 0 0 0 3 0"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// ProfileChip
// ---------------------------------------------------------------------------

/**
 * ProfileChip — local player identity: avatar (ornate double gold ring + finial
 * ticks + level badge), summoner name, availability row, and a notification
 * bell button.
 *
 * Two placement variants (see {@link ProfileChipVariant}):
 *
 * - `"rail"` (default) — the social-rail header chip (#146): 48px avatar,
 *   gold-2 name, muted grey status label, bordered blue-7 strip. Used when the
 *   chip heads the docked social rail column.
 * - `"navband"` — the current-era compact chip that lives at the top-right of
 *   the TopNavbar band (era shift #384 / #387). 34px avatar, cream (gold-1)
 *   name, availability-tinted status text (green "Online" per reference), and a
 *   transparent background so it composites into the nav band. Measured from
 *   docs/reference/client-current-home-activity-center.jpg: avatar ≈34px at the
 *   far top-right, name + green status to its right, bell at the far edge; the
 *   whole chip sits BELOW the floating window controls (?─⚙✕), which TopNavbar's
 *   playerSlot placement (`items-end`, lower half of the band) guarantees.
 *
 * Identity lives in ONE place (#211): the current-era shell mounts the
 * `"navband"` chip and the social rail no longer repeats identity.
 *
 * Ornate ring uses useId() for SVG gradient/clip IDs — safe for multiple
 * instances. Availability mapping mirrors the exhaustive Record pattern from
 * FriendRow and PlayerHovercard.
 *
 * Passes 'use client' because onNotifications is an event handler prop. Follows
 * the WindowFrame precedent: 'use client' is needed when the component accepts
 * callbacks that may be wired to client-side state in the shell.
 */
export function ProfileChip({
  summoner,
  level,
  profileIconSrc,
  onNotifications,
  statusText,
  variant = "rail",
}: ProfileChipProps) {
  const uid = useId();
  const { gameName, availability } = summoner;
  const dotClass = availabilityDot[availability];
  const statusLabel = availabilityLabel[availability];
  // When statusText is provided it replaces the label; the dot aria-label still
  // names the true availability state so screen readers get accurate status.
  const displayLabel = statusText ?? statusLabel;

  const isNavband = variant === "navband";

  // Per-variant geometry / typography.
  const AVATAR_SIZE = isNavband ? 34 : 48;
  // Inner clip radius matches OrnateRing's clipR (outerR - gap - 1.5).
  const clipR = AVATAR_SIZE * 0.5 - 1 - 3 - 1.5;
  // navband: cream name (matches reference), status tinted to its dot. rail:
  // gold-2 name, muted grey status (unchanged #146 treatment).
  const nameClass = isNavband ? "text-gold-1" : "text-gold-2";
  const statusClass = isNavband ? availabilityText[availability] : "text-grey-1";

  return (
    <div
      data-shot="profile-chip"
      data-variant={variant}
      className={
        isNavband
          ? "flex items-center gap-2 shrink-0"
          : "flex w-full items-center gap-2.5 border-b border-gold-5 bg-blue-7 px-3 py-2 shrink-0"
      }
    >
      {/* ------------------------------------------------------------------ */}
      {/* Avatar — circular image with ornate gold ring overlay               */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="relative shrink-0"
        style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
      >
        {/* Avatar image — clipped to circle via inline clip-path */}
        <img
          src={profileIconSrc}
          alt={gameName}
          width={AVATAR_SIZE}
          height={AVATAR_SIZE}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ borderRadius: "50%", clipPath: `circle(${Math.round(clipR)}px at center)` }}
        />

        {/* Ornate double ring + finial ticks */}
        <OrnateRing size={AVATAR_SIZE} uid={uid} />

        {/* Level badge pill — overlaps bottom-center of avatar */}
        <span
          className={[
            "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-sm border border-gold-4 bg-grey-4 px-1 font-body leading-none text-gold-1 tabular-nums whitespace-nowrap",
            isNavband ? "text-[9px]" : "text-[10px]",
          ].join(" ")}
          style={{ zIndex: 2 }}
        >
          {level}
        </span>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Name + availability row                                             */}
      {/* ------------------------------------------------------------------ */}
      <div className={isNavband ? "min-w-0" : "min-w-0 flex-1"}>
        {/* Summoner name */}
        <p className={`truncate font-body leading-tight ${isNavband ? "text-sm" : "text-sm"} ${nameClass}`}>
          {gameName}
        </p>
        {/* Availability row: status dot + label (or custom statusText) */}
        <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
          <span
            aria-label={statusLabel}
            className={`inline-block h-2 w-2 shrink-0 rounded-full transition-colors duration-150 ${dotClass}`}
          />
          <span className={`min-w-0 truncate font-body text-xs leading-tight ${statusClass}`}>
            {displayLabel}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Bell icon button — notifications                                    */}
      {/* ------------------------------------------------------------------ */}
      <button
        type="button"
        aria-label="Notifications"
        onClick={onNotifications}
        className={[
          "flex shrink-0 cursor-pointer items-center justify-center text-grey-1 transition-colors duration-150 hover:text-gold-1",
          isNavband ? "self-start pt-0.5" : "",
        ].join(" ")}
      >
        <BellIcon size={isNavband ? 15 : 16} />
      </button>
    </div>
  );
}
