"use client";

import { useId } from "react";
import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Wing art tier — controls which ranked-emblem wing PNG is used.
 * Maps to real CommunityDragon ranked-emblem/wings/ assets.
 * See WING_SRC_MAP below.
 */
export type WingTier = "default" | "bronze" | "gold" | "teal" | "green" | "blue";

export interface PlayerBannerProps {
  /** Summoner display name. Gold-cream, uppercase, truncated. */
  name: string;
  /** Optional player title shown below the name in italic grey. */
  title?: string;
  /** Resolved profile icon URL — pass `profileIconUrl(id)` from @low/fixtures. */
  avatarSrc: string;
  /**
   * Wing tier controls wing color art. Maps to ranked-emblem PNGs from
   * CommunityDragon (rcp-fe-lol-static-assets/ranked-emblem/wings/).
   * Defaults to "default" (iron wings).
   */
  wingTier?: WingTier;
  /**
   * When true: renders the self (local player) treatment — larger scale,
   * brighter avatar ring, gold crown chip above the crest.
   */
  isSelf?: boolean;
  /**
   * Show the gold crown chip above the avatar crest. Automatically true when
   * isSelf is true, but can be set independently for captain designation.
   */
  crownChip?: boolean;
  /**
   * Show the "Autofill Protected" pill chip at the banner foot.
   * Visible on self banner per reference.
   */
  autofillProtected?: boolean;
  /**
   * Slot for RoleSlotRow or other children rendered below the avatar area.
   * Compose in from the parent page/screen.
   */
  children?: ReactNode;
  /**
   * When true, renders an empty banner (dark panel, no avatar/name/wings).
   * Represents an unfilled lobby slot — dead visual, no invite affordance.
   */
  empty?: boolean;
}

// ---------------------------------------------------------------------------
// Wing asset map — CommunityDragon ranked-emblem wings
//
// Exploration findings (2026-07-12):
//   rcp-fe-lol-parties/parties/banner/ → only .webm videos, no PNGs
//   rcp-fe-lol-regalia plugin NOT present in /json/latest/plugins/ listing
//   rcp-fe-lol-static-assets/ranked-emblem/wings/ → REAL wing PNGs confirmed
//     (wings_iron, wings_bronze, wings_silver, wings_gold, wings_platinum,
//      wings_emerald, wings_diamond, wings_master, wings_grandmaster, wings_challenger)
//   All return HTTP 200 with content-type image/png.
//
// Decision: use these real assets via src prop, not SVG fallback.
// WingTier→file mapping chosen by visual color hue from reference screenshot:
//   default  → iron     (muted silver — empty/unranked)
//   bronze   → bronze   (warm brown)
//   gold     → gold     (gold — matches reference self banner)
//   teal     → platinum (teal-silver — matches reference teal flanker)
//   green    → emerald  (green — matches reference green flanker)
//   blue     → diamond  (blue-white — matches reference blue flanker)
// ---------------------------------------------------------------------------

const CDRAGON_WINGS =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-emblem/wings";

const WING_SRC: Record<WingTier, string> = {
  default: `${CDRAGON_WINGS}/wings_iron.png`,
  bronze:  `${CDRAGON_WINGS}/wings_bronze.png`,
  gold:    `${CDRAGON_WINGS}/wings_gold.png`,
  teal:    `${CDRAGON_WINGS}/wings_platinum.png`,
  green:   `${CDRAGON_WINGS}/wings_emerald.png`,
  blue:    `${CDRAGON_WINGS}/wings_diamond.png`,
};

// ---------------------------------------------------------------------------
// Heraldic banner clip-path — pointed double-V bottom silhouette.
//
// Outer border shell and inner fill both use this polygon;
// the 2px gap between them (via p-[2px] on the outer div) creates the
// gold-trim effect that follows the entire outline including the notch.
// Proportions sampled from client-lobby-solo.jpg reference.
// ---------------------------------------------------------------------------

const BANNER_CLIP =
  "polygon(0% 0%, 100% 0%, 100% 76%, 59% 76%, 50% 91%, 41% 76%, 0% 76%)";

// ---------------------------------------------------------------------------
// Crown chip icon — small gold crown SVG inline glyph
// ---------------------------------------------------------------------------

function CrownGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="10"
      viewBox="0 0 12 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 8.5 L1 9 L11 9 L11 8.5 L1 8.5Z"
        fill="currentColor"
      />
      <path
        d="M1 8 L3 3.5 L6 6 L9 2 L11 3.5 L11 8 L1 8Z"
        fill="currentColor"
        strokeLinejoin="round"
      />
      <circle cx="1.5" cy="3" r="1" fill="currentColor" />
      <circle cx="6" cy="1.5" r="1" fill="currentColor" />
      <circle cx="10.5" cy="3" r="1" fill="currentColor" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Shield glyph — autofill protection icon
// ---------------------------------------------------------------------------

function ShieldGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="10"
      height="11"
      viewBox="0 0 10 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 0.5 L9.5 2.5 L9.5 6 Q9.5 9.5 5 10.5 Q0.5 9.5 0.5 6 L0.5 2.5 Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M3 5.5 L4.5 7 L7 4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Banner foot glyph — decorative diamond/chevron mark
// ---------------------------------------------------------------------------

function FootGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="10"
      viewBox="0 0 16 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 1 L14 5 L8 9 L2 5 Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        strokeLinejoin="round"
      />
      <line x1="1" y1="5" x2="2" y2="5" stroke="currentColor" strokeWidth="1" />
      <line x1="14" y1="5" x2="15" y2="5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// AvatarCrest — circular avatar with ornate double-gold ring (scales w/ isSelf)
// ---------------------------------------------------------------------------

function AvatarCrest({
  avatarSrc,
  name,
  isSelf,
  uid,
}: {
  avatarSrc: string;
  name: string;
  isSelf: boolean;
  uid: string;
}) {
  const size = isSelf ? 80 : 64;
  const cx = size / 2;
  const cy = size / 2;

  // Ring proportions adapted from ProfileChip/ProfileBanner ornate ring
  const outerR = size * 0.5 - 2;
  const innerR = outerR - (isSelf ? 5 : 4);
  const clipR  = innerR - 2;

  const clipId = `${uid}-ac`;
  const gradId = `${uid}-ag`;

  // Tick geometry — pairs flanking cardinal points
  const tickStart = outerR + 1.5;
  const tickEnd   = outerR + (isSelf ? 6 : 5);
  const cardinals = [0, 90, 180, 270];
  const tickOffsets = [-4, 4];

  const toXY = (angleDeg: number, r: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
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

  // Diagonal corner arcs
  const diagonals = [45, 135, 225, 315];
  const arcR = outerR + 4;
  const arcHalf = 7;
  const cornerArcs = diagonals.map((base) => {
    const start = toXY(base - arcHalf, arcR);
    const end   = toXY(base + arcHalf, arcR);
    return `M ${start.x} ${start.y} A ${arcR} ${arcR} 0 0 1 ${end.x} ${end.y}`;
  });

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Avatar image — circular clip */}
      <img
        src={avatarSrc}
        alt={name}
        width={size}
        height={size}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ borderRadius: "50%", clipPath: `circle(${Math.round(clipR)}px at center)` }}
      />

      {/* Ornate gold ring overlay */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: 1 }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--color-gold-3)" stopOpacity={isSelf ? 1 : 0.75} />
            <stop offset="100%" stopColor="var(--color-gold-5)" stopOpacity={isSelf ? 1 : 0.65} />
          </linearGradient>
          <clipPath id={clipId}>
            <circle cx={cx} cy={cy} r={clipR} />
          </clipPath>
        </defs>

        {/* Outer ring */}
        <circle
          cx={cx} cy={cy} r={outerR}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={isSelf ? 2 : 1.5}
        />
        {/* Inner ring */}
        <circle
          cx={cx} cy={cy} r={innerR}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={1}
          strokeOpacity={0.6}
        />
        {/* Finial tick pairs */}
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
        {/* Diagonal corner arcs */}
        {cornerArcs.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={0.75}
            strokeOpacity={0.5}
          />
        ))}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PlayerBanner
// ---------------------------------------------------------------------------

/**
 * PlayerBanner — a single vertical banner card from the pre-game party lobby.
 *
 * Self banner (isSelf=true): wider, brighter, large avatar crest, gold crown glyph
 * + summoner name floating ABOVE the shaped banner, optional autofill-protected chip at foot.
 * Teammate banner: narrower, slightly dimmed, smaller avatar.
 * Empty banner (empty=true): dark panel with no content — represents an unfilled slot.
 *
 * Heraldic shape: clip-path polygon with double-V pointed bottom. Outer shell uses
 * gold-4 background; inner fill uses blue-7 (self) or grey-4 (teammate). The 2px
 * padding gap between shells creates the gold hairline trim at all edges including the notch.
 *
 * Wings: real CommunityDragon ranked-emblem PNGs (rcp-fe-lol-static-assets).
 * WingTier maps: default→iron, bronze→bronze, gold→gold, teal→platinum,
 *   green→emerald, blue→diamond. See WING_SRC_MAP in source for exploration notes.
 *
 * Avatar ring uses useId() — safe for multiple instances on one page.
 * Children slot accepts a RoleSlotRow composed in from the parent screen.
 */
export function PlayerBanner({
  name,
  title,
  avatarSrc,
  wingTier = "default",
  isSelf = false,
  crownChip,
  autofillProtected = false,
  children,
  empty = false,
}: PlayerBannerProps) {
  const uid = useId();
  const showCrown = crownChip ?? isSelf;

  // Width: self is wider (120px), teammates are narrower (96px)
  const wClass = isSelf ? "w-[120px]" : "w-[96px]";

  // Empty slot — large circular + placeholder
  if (empty) {
    return (
      <div
        data-shot="player-banner-empty"
        className="flex flex-col items-center justify-center"
        style={{ width: 90, height: 90 }}
        aria-label="Empty party slot"
      >
        {/* Outer ring */}
        <div
          className="relative flex items-center justify-center rounded-full border border-grey-3 bg-grey-4"
          style={{ width: 90, height: 90 }}
        >
          {/* Inner ring — inset 4px */}
          <div
            className="absolute rounded-full border border-grey-3"
            style={{ inset: 4 }}
          />
          {/* Plus glyph */}
          <span
            aria-hidden="true"
            className="relative z-10 text-grey-2 select-none"
            style={{ fontSize: 32, lineHeight: 1, fontWeight: 300 }}
          >
            +
          </span>
        </div>
      </div>
    );
  }

  const wingSrc = WING_SRC[wingTier];

  return (
    <div
      data-shot={isSelf ? "player-banner-self" : "player-banner-teammate"}
      className={["flex flex-col items-center", wClass].join(" ")}
    >
      {/* ---------------------------------------------------------------- */}
      {/* ABOVE-BANNER: crown glyph + summoner name                        */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex items-center gap-1.5 pb-1 min-w-0">
        {showCrown && (
          <span className="shrink-0 text-gold-2">
            <CrownGlyph />
          </span>
        )}
        <span
          className={[
            "truncate font-display uppercase tracking-wide",
            isSelf ? "text-sm text-gold-1" : "text-xs text-gold-cream",
          ].join(" ")}
        >
          {name}
        </span>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* HERALDIC SHAPE: gold border shell (outer) + dark fill (inner)    */}
      {/* ---------------------------------------------------------------- */}
      <div
        className={[
          // Outer border shell — gold-4 background, clipped to heraldic polygon
          isSelf ? "bg-gold-4" : "bg-gold-6",
          "p-[2px]",
          "w-full",
        ].join(" ")}
        style={{
          clipPath: BANNER_CLIP,
          // Height drives the shaped area; below the polygon is transparent
          height: isSelf ? 300 : 260,
        }}
      >
        {/* Inner surface — dark fill, same clip so fill matches silhouette */}
        <div
          className={[
            "relative flex flex-col items-center overflow-hidden w-full h-full",
            isSelf ? "bg-blue-7" : "bg-grey-4",
            "pt-3 pb-2 gap-1",
          ].join(" ")}
          style={{ clipPath: BANNER_CLIP }}
        >
          {/* Chevron texture band at top */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-5 pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(60deg, transparent, transparent 3px, var(--color-gold-5) 3px, var(--color-gold-5) 4px)",
              opacity: 0.18,
            }}
          />

          {/* Wing crest + avatar medallion */}
          <div
            className="relative flex items-center justify-center mt-1"
            style={{ width: "100%", height: isSelf ? 140 : 110 }}
          >
            <img
              src={wingSrc}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute select-none"
              style={{
                width: isSelf ? 260 : 210,
                height: "auto",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                opacity: isSelf ? 0.95 : 0.7,
                filter: isSelf
                  ? "drop-shadow(0 0 6px var(--color-gold-4)) brightness(1.05)"
                  : "drop-shadow(0 0 3px var(--color-gold-5)) brightness(0.8)",
              }}
            />
            <div className="relative z-10 flex flex-col items-center">
              <AvatarCrest
                avatarSrc={avatarSrc}
                name={name}
                isSelf={isSelf}
                uid={uid}
              />
              {/* Level badge — overlaps bottom of medallion ring */}
              <div
                className="relative -mt-3 z-20 rounded-full border border-grey-2 bg-grey-4 px-1.5 py-px"
                style={{ minWidth: 22, textAlign: "center" }}
              >
                <span className="font-body text-[9px] leading-none text-grey-1 font-semibold">
                  15
                </span>
              </div>
            </div>
          </div>

          {/* Player title (inside banner — only when present) */}
          {title && (
            <span
              className={[
                "w-full truncate text-center font-body italic px-2",
                isSelf ? "text-xs text-grey-1" : "text-[10px] text-grey-2",
              ].join(" ")}
            >
              {title}
            </span>
          )}

          {/* Children slot */}
          {children && (
            <div className="flex w-full items-center justify-center px-1 mt-auto">
              {children}
            </div>
          )}

          {/* Footer: autofill chip + foot glyph */}
          <div className="flex flex-col items-center gap-1 mt-auto">
            {autofillProtected && (
              <div className="flex items-center gap-0.5 rounded-full border border-grey-2 bg-grey-4 px-2 py-0.5 text-grey-1">
                <ShieldGlyph />
                <span className="font-body text-[9px] uppercase tracking-wide leading-none">
                  Autofill Protected
                </span>
              </div>
            )}
            <span className="text-grey-3">
              <FootGlyph />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
