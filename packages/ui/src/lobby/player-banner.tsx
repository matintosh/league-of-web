"use client";

import { useId, useState } from "react";
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

/**
 * Ranked tier for the 12-o'clock gem on the portrait ring.
 * Maps to real CommunityDragon ranked-mini-crests/ PNGs.
 * "unranked" shows the unranked mini crest (dark/empty).
 */
export type TierGem =
  | "iron"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "master"
  | "grandmaster"
  | "challenger"
  | "unranked";

/**
 * A single badge slot in the three-badge row at the bottom of each banner.
 * Empty slots (undefined in the badges tuple) render as dark circles.
 */
export interface BadgeSlot {
  /** Icon image URL — shown inside the circular slot. */
  iconSrc: string;
  /**
   * CSS color string for the outer ring of this badge slot.
   * Use var(--color-*) references to stay token-safe.
   * Defaults to gold-4 when omitted.
   */
  /**
   * TOKEN-ONLY: must be a `var(--color-*)` reference (CLAUDE.md rule 1 —
   * raw hex/rgb strings are a review-blocking violation at any call site).
   */
  ringColor?: string;
}

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
   * Superseded by `invited` when both are set (see `invited`).
   */
  empty?: boolean;
  /**
   * Summoner level shown in the badge overlapping the medallion bottom ring.
   * Defaults to 15 when omitted (preserves current visual appearance).
   */
  level?: number;
  /**
   * Queueing state presentation variant.
   * - On empty slots: dark banner with glowing blue outer ring (replaces the + circle).
   * - On the self banner: adds an asterisk glyph at the foot to mark the queued player.
   * Has no visual effect on filled teammate banners.
   */
  queueing?: boolean;
  /**
   * Ranked tier for the small circular gem placed at the 12-o'clock position of
   * the portrait ring. Omit to show no gem (unranked/casual players).
   * Maps to CommunityDragon ranked-mini-crests/ PNG assets.
   */
  tierGem?: TierGem;
  /**
   * Three circular badge slots rendered below the children zone at the banner foot.
   * Each entry is either a filled BadgeSlot (iconSrc + optional ringColor) or
   * undefined (renders as an empty dark circle with a subtle ring).
   * Tuple of exactly three optional entries — pass undefined for empty slots.
   * Example: [{ iconSrc: "..." }, undefined, { iconSrc: "...", ringColor: "var(--color-blue-2)" }]
   */
  badges?: [BadgeSlot?, BadgeSlot?, BadgeSlot?];
  /**
   * Optional real-client banner-sweep video (webm, straight alpha) — the one-shot
   * entrance flourish that sweeps over the flag as the member loads in. Pass
   * `bannerSweepVideoUrl("primary")` for the self slot / `("ally")` for others
   * (from @low/fixtures). The 272×620 clip fills the flag box and composites over
   * the static banner art, BELOW the avatar crest / text / badges so they stay
   * legible mid-flourish.
   *
   * Plays ONCE on mount then unmounts (an entrance flourish, not a loop), leaving
   * the static flag. Suppressed under `prefers-reduced-motion`; a load error drops
   * the layer — in both cases the static banner is unaffected. Only rendered on
   * filled banners (ignored on `empty` slots). No layout shift.
   */
  sweepVideoSrc?: string;
  /**
   * When true, renders the INVITED slot — a pending party member the captain has
   * invited who has not yet accepted. The real client shows an animated heraldic
   * flag here (dark panel, a glowing blue "summon" ring, rising blue mist) instead
   * of the plain empty `+` circle. Mutually exclusive with `empty`; when both are
   * set, `invited` wins.
   *
   * The flag box uses the teammate footprint (96px wide, art-ratio tall) so an
   * invited slot reads as a real flag in the banner row, not a placeholder circle.
   */
  invited?: boolean;
  /**
   * Optional invited-flag loop video (webm, straight alpha — the clip carries the
   * whole banner silhouette + gold trim in its alpha, so it fills the flag box
   * standalone). These clips are user-extracted (WAD) and NOT CommunityDragon-
   * mirrored — the parties plugin ships only the static `invited-banner.png` — so
   * pages supply a LOCAL `/media/...` URL (e.g. `/media/invited-banner/invited-banner-pulse.webm`).
   *
   * The clip LOOPS continuously (an idle "searching" pulse, not a one-shot). It is
   * suppressed under `prefers-reduced-motion` and dropped on a load error; in both
   * cases the static `invitedFallbackSrc` PNG remains. Only meaningful when
   * `invited` is true. No layout shift.
   */
  invitedVideoSrc?: string;
  /**
   * Static invited-flag PNG shown BENEATH `invitedVideoSrc` and used as the sole
   * visual under `prefers-reduced-motion` or on video load error. Pass
   * `partyBannerUrl("invited")` from @low/fixtures (the CommunityDragon
   * rcp-fe-lol-parties `invited-banner.png`, 178×550 — one resting frame of the
   * pulse). Defaults to the mirror of that URL baked into this component
   * (`BANNER_ART.invited`) when omitted. Only meaningful when `invited` is true.
   */
  invitedFallbackSrc?: string;
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
// Tier gem asset map — CommunityDragon ranked-mini-crests/
//
// Exploration findings (2026-07):
//   rcp-fe-lol-static-assets/global/default/ranked-mini-crests/ → REAL mini
//   crest PNGs confirmed (iron, bronze, silver, gold, platinum, diamond,
//   master, grandmaster, challenger, unranked). All return HTTP 200.
//   These small circular gems (approx 20×20px at native size) are the
//   standard indicator used in the V11 party lobby portrait ring at 12 o'clock.
//
// TierGem values map 1:1 to the filename slugs in that directory.
// ---------------------------------------------------------------------------

const CDRAGON_MINI_CRESTS =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests";

const TIER_GEM_SRC: Record<TierGem, string> = {
  unranked:     `${CDRAGON_MINI_CRESTS}/unranked.png`,
  iron:         `${CDRAGON_MINI_CRESTS}/iron.png`,
  bronze:       `${CDRAGON_MINI_CRESTS}/bronze.png`,
  silver:       `${CDRAGON_MINI_CRESTS}/silver.png`,  // silver.png returns 200 per directory listing
  gold:         `${CDRAGON_MINI_CRESTS}/gold.png`,
  platinum:     `${CDRAGON_MINI_CRESTS}/platinum.png`,
  diamond:      `${CDRAGON_MINI_CRESTS}/diamond.png`,
  master:       `${CDRAGON_MINI_CRESTS}/master.png`,
  grandmaster:  `${CDRAGON_MINI_CRESTS}/grandmaster.png`,
  challenger:   `${CDRAGON_MINI_CRESTS}/challenger.png`,
};

// ---------------------------------------------------------------------------
// Party-flag chrome art — CommunityDragon rcp-fe-lol-parties (issue #336)
//
// The live client paints each party member's flag from a single straight-alpha
// PNG that already carries the whole heraldic silhouette (scooped-neck top,
// ornate gold corner scrolls, double-V pointed bottom) AND its gold hairline
// trim. We drop that art in as one background <img> filling the flag box, so
// the component no longer needs a CSS clip-path shell or hand-painted border —
// the avatar crest / tier gem / badges / role row / footer composite ON TOP.
//
// Exploration findings (2026-07-14), rcp-fe-lol-parties/global/default/:
//   banner-filled.png         968×1400  navy fill + warm gold trim & corner
//                                       scrolls — a seated member (self+teammate)
//   banner-empty.png          968×1376  same silhouette, desaturated cool grey —
//                                       an unfilled slot (no gold)
//   current-player-banner.png 234×400   teal self flag with a gold medallion ring
//                                       BAKED at top-centre — unused here, since
//                                       our live AvatarCrest already draws that ring
//   invited-banner.png        178×550   dark panel + glowing blue summon ring —
//                                       the searching/invited (queueing) slot
// All four curl-verified HTTP 206 image/png (range request). The self slot reuses
// banner-filled (brightened via isSelf styling) so its baked ring isn't doubled.
// Mirror of `partyBannerUrl` in @low/fixtures (kept inline like WING_SRC above so
// the component owns no fetch — pages/demos may use the exported helper instead).
// ---------------------------------------------------------------------------

const CDRAGON_PARTIES =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-parties/global/default";

const BANNER_ART = {
  filled: `${CDRAGON_PARTIES}/banner-filled.png`,
  empty: `${CDRAGON_PARTIES}/banner-empty.png`,
  invited: `${CDRAGON_PARTIES}/invited-banner.png`,
} as const;

// Flag-box aspect from the real banner-filled art content bbox (963×1389 →
// h/w ≈ 1.44). Widths stay at the established 120 (self) / 96 (teammate); heights
// derive from the art ratio so the trim renders undistorted and the consumer's
// side-by-side layout keeps the same footprint.
const SELF_W = 120;
const TEAM_W = 96;
const ART_RATIO = 1389 / 963;

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
// Asterisk glyph — self-player queue marker at banner foot
// ---------------------------------------------------------------------------

function AsteriskGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="5" y1="1" x2="5" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="1" y1="3" x2="9" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="9" y1="3" x2="1" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
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
// Optionally renders a tier gem at the 12-o'clock position of the ring.
// ---------------------------------------------------------------------------

function AvatarCrest({
  avatarSrc,
  name,
  isSelf,
  uid,
  tierGemSrc,
}: {
  avatarSrc: string;
  name: string;
  isSelf: boolean;
  uid: string;
  /** Resolved URL to the ranked-mini-crests PNG, or undefined for no gem. */
  tierGemSrc?: string;
}) {
  // Medallion proportions sampled from party reference (client-lobby-party.png):
  // banner_width: ~178px in screenshot (scale 0.625) → 285px real
  // ring outer diameter: ~88px in screenshot → ratio 88/178 = 49.4%
  //
  // For our CSS sizes:
  //   Self   (120px banner): 120 × 0.494 ≈ 56px
  //   Teammate (96px banner):  96 × 0.469 ≈ 44px
  //
  // Previously 80px / 120px = 66.7%; now 56/120 = 46.7%, 44/96 = 45.8%.
  const size = isSelf ? 56 : 44;
  const cx = size / 2;
  const cy = size / 2;

  // Ring proportions adapted from ProfileChip/ProfileBanner ornate ring
  const outerR = size * 0.5 - 2;
  const innerR = outerR - (isSelf ? 4 : 3);
  const clipR  = innerR - 2;

  const clipId = `${uid}-ac`;
  const gradId = `${uid}-ag`;

  // Tick geometry — pairs flanking cardinal points
  const tickStart = outerR + 1.5;
  const tickEnd   = outerR + (isSelf ? 5 : 4);
  const cardinals = [0, 90, 180, 270];
  const tickOffsets = [-3, 3];

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
  const arcR = outerR + 3;
  const arcHalf = 6;
  const cornerArcs = diagonals.map((base) => {
    const start = toXY(base - arcHalf, arcR);
    const end   = toXY(base + arcHalf, arcR);
    return `M ${start.x} ${start.y} A ${arcR} ${arcR} 0 0 1 ${end.x} ${end.y}`;
  });

  // Gem size: ~20% of the ring diameter, clamped for legibility.
  // Self ring outer diameter = 2 * outerR ≈ size - 4. At size=56 → gemSize≈12, size=44 → gemSize≈10.
  const gemSize = isSelf ? 16 : 14;

  return (
    // Outer wrapper is slightly taller than `size` to leave vertical room for the gem above.
    <div className="relative" style={{ width: size, height: size + gemSize / 2 + 1 }}>
      {/* Tier gem — positioned at 12 o'clock, centred horizontally, overlapping the ring top */}
      {tierGemSrc && (
        <img
          src={tierGemSrc}
          alt=""
          aria-hidden="true"
          width={gemSize}
          height={gemSize}
          className="pointer-events-none absolute select-none"
          style={{
            width: gemSize,
            height: gemSize,
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            // Subtle drop shadow to lift the gem from the ring
            filter: "drop-shadow(0 0 2px var(--color-gold-4))",
          }}
        />
      )}

      {/* Avatar image — circular clip, offset down by gem overlap */}
      <img
        src={avatarSrc}
        alt={name}
        width={size}
        height={size}
        className="absolute h-full w-full object-cover"
        style={{
          width: size,
          height: size,
          top: gemSize / 2 + 1,
          left: 0,
          borderRadius: "50%",
          clipPath: `circle(${Math.round(clipR)}px at center)`,
        }}
      />

      {/* Ornate gold ring overlay — same offset as the avatar */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{ top: gemSize / 2 + 1, left: 0, zIndex: 1 }}
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
// BannerSweepLayer — real-client player-flag entrance sweep (issue #329)
//
// Overlays the animated banner-sweep webm (straight alpha, 272×620 — the exact
// flag-box aspect) over the static banner as an entrance flourish. Additive &
// non-regressing:
//   - Only mounts when a `src` is supplied; the static banner always renders
//     beneath, so an absent/broken clip leaves the exact static look.
//   - Plays ONCE (no loop) then unmounts on `onEnded` — the sweep is an entrance
//     flourish, not an idle loop, and unmounting avoids leaving the clip's faint
//     resting ring compositing over the real medallion.
//   - `onError` drops the layer (video 404/decode fail → static banner shows).
//   - pointer-events-none + aria-hidden: never interactive, never reaches AT.
//   - `motion-reduce:hidden` — suppressed entirely under prefers-reduced-motion
//     (pure CSS, SSR-safe, no first-frame flash); the static banner remains.
//
// z-order: the layer sits at z-[1] inside the flag box — ABOVE the static
// banner-art <img> (z-0) but BELOW the avatar crest (z-10), title, badges, and
// footer, so those stay legible through the flourish. objectFit:fill stretches
// the clip to the flag box so its ring/rails/notch register onto the real
// medallion/edges/notch.
// ---------------------------------------------------------------------------

function BannerSweepLayer({ src }: { src: string }) {
  const [done, setDone] = useState(false);
  if (done) return null;

  return (
    <video
      key={src}
      src={src}
      autoPlay
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      onEnded={() => setDone(true)}
      onError={() => setDone(true)}
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full motion-reduce:hidden"
      style={{ objectFit: "fill" }}
    />
  );
}

// ---------------------------------------------------------------------------
// InvitedBannerLayer — animated pending-invite flag (issue #347)
//
// Probe findings (2026-07-14) on the user-extracted (WAD) assets, none of which
// are CommunityDragon-mirrored (the parties plugin ships only invited-banner.png,
// confirmed webm → 404):
//   invited-banner{-1,-2}.webm  196×592  3s  VP9 alpha  — BYTE-IDENTICAL to each
//       other; a subtle blue summon-ring pulse with faint mist. Shipped as
//       invited-banner-loop.webm.
//   invited-banner.webm         178×550  5s  VP8 alpha  — the "classic pulse":
//       brighter ring + heavy rising blue smoke. Its 178×550 frame matches the
//       static invited-banner.png EXACTLY (the PNG is one resting frame of it).
//       Shipped as invited-banner-pulse.webm.
// Both clips are SEAMLESS CONTINUOUS LOOPS (first↔last frame diff ≈ 0), not
// intro→loop, and each carries the full banner silhouette + gold trim in its
// alpha — so the video fills the flag box standalone (no banner-filled behind it).
//
// State machine (idle loop, not a one-shot entrance like BannerSweepLayer):
//   - Loops for as long as the invite is pending (`loop`, no unmount).
//   - `motion-reduce:hidden` suppresses it under prefers-reduced-motion, leaving
//     the static invited PNG (rendered beneath) — the resting-frame look.
//   - `onError` drops the layer → the static PNG shows (video 404/decode fail).
//   - pointer-events-none + aria-hidden: never interactive, never reaches AT.
// The static PNG sits at z-0; the video at z-[1]. Both fill the flag box (their
// own silhouette registers, so objectFit:fill is exact).
// ---------------------------------------------------------------------------

function InvitedBannerLayer({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <video
      key={src}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      onError={() => setFailed(true)}
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full motion-reduce:hidden"
      style={{ objectFit: "fill" }}
    />
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
 * Invited banner (invited=true): animated heraldic flag for a pending (invited, not
 *   yet accepted) member — dark panel, glowing blue summon ring, rising blue mist,
 *   looping from `invitedVideoSrc` over the static `invitedFallbackSrc` PNG. Takes
 *   precedence over `empty`.
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
  level,
  queueing = false,
  tierGem,
  badges,
  sweepVideoSrc,
  invited = false,
  invitedVideoSrc,
  invitedFallbackSrc,
}: PlayerBannerProps) {
  const uid = useId();
  const showCrown = crownChip ?? isSelf;
  const tierGemSrc = tierGem ? TIER_GEM_SRC[tierGem] : undefined;

  // Width: self is wider (120px), teammates are narrower (96px)
  const wClass = isSelf ? "w-[120px]" : "w-[96px]";

  // Invited slot — a pending party member: an animated heraldic flag (dark panel,
  // glowing blue summon ring, rising blue mist) that replaces the plain empty `+`
  // circle. `invited` takes precedence over `empty` when both are set. The flag
  // box uses the teammate footprint so it reads as a real flag in the banner row.
  // The static invited PNG is the reduced-motion / video-error fallback beneath
  // the looping video, both filling the same flag box (each carries its own
  // silhouette + trim in alpha).
  if (invited) {
    const invBoxW = TEAM_W;
    const invBoxH = Math.round(invBoxW * ART_RATIO);
    const staticSrc = invitedFallbackSrc ?? BANNER_ART.invited;

    return (
      <div
        data-shot="player-banner-invited"
        className="flex flex-col items-center"
        aria-label="Invited party member — pending"
      >
        <div className="relative" style={{ width: invBoxW, height: invBoxH }}>
          {/* Static invited flag — resting-frame PNG; sole visual under
               reduced-motion or on video error. Fills the flag box. */}
          <img
            src={staticSrc}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none"
            style={{ objectFit: "fill" }}
          />
          {/* Looping animated pulse over the static frame. See InvitedBannerLayer. */}
          {invitedVideoSrc && <InvitedBannerLayer src={invitedVideoSrc} />}
        </div>
      </div>
    );
  }

  // Empty slot — idle: large circular + placeholder; queueing: dark banner with blue glow ring
  if (empty) {
    if (queueing) {
      // Queue treatment: dark banner rectangle with glowing blue outer ring
      return (
        <div
          data-shot="player-banner-empty-queuing"
          className="flex flex-col items-center justify-center"
          style={{ width: 90, height: 90 }}
          aria-label="Empty party slot — searching"
        >
          <div
            className="relative flex items-center justify-center rounded-full bg-blue-7"
            style={{
              width: 90,
              height: 90,
              border: "2px solid var(--color-blue-2)",
              boxShadow: "0 0 10px 2px var(--color-blue-3), inset 0 0 6px 1px var(--color-blue-6)",
            }}
          >
            {/* Inner ring — inset 4px */}
            <div
              className="absolute rounded-full"
              style={{
                inset: 4,
                border: "1px solid var(--color-blue-3)",
                opacity: 0.6,
              }}
            />
          </div>
        </div>
      );
    }

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

  // Flag box footprint: established widths, height from the real art aspect.
  const boxW = isSelf ? SELF_W : TEAM_W;
  const boxH = Math.round(boxW * ART_RATIO);
  // The pointed double-V bottom occupies the lowest ~21% of the art (corners of
  // the flat body sit at y≈1097/1389). Reserve that band as content padding so
  // the crest / badges / role row / footer stay inside the flat interior and
  // never spill over the decorative point.
  const pointPad = Math.round(boxH * 0.2);

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
          <span className="shrink-0 text-gold-2" aria-label="Captain">
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
      {/* HERALDIC FLAG — real client party-banner art (issue #336)         */}
      {/* The banner-filled PNG carries the silhouette + gold trim; content  */}
      {/* stacks over it. Self reuses the same art brightened (its baked     */}
      {/* medallion ring lives in current-player-banner, which we skip so    */}
      {/* the live AvatarCrest ring isn't doubled).                          */}
      {/* ---------------------------------------------------------------- */}
      <div
        className="relative flex flex-col items-center w-full"
        style={{ height: boxH }}
      >
        {/* Static flag art — fills the box, silhouette + trim baked into alpha */}
        <img
          src={BANNER_ART.filled}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none"
          style={{
            objectFit: "fill",
            // Self flag reads warmer/brighter than a teammate's in the client.
            filter: isSelf
              ? "brightness(1.12) saturate(1.15)"
              : "brightness(0.92)",
          }}
        />

        {/* Banner-sweep entrance flourish (issue #329/#330) — one-shot webm
             layered over the flag art but below the crest / text / badges
             (z-[1]). See BannerSweepLayer for the full contract. */}
        {sweepVideoSrc && <BannerSweepLayer src={sweepVideoSrc} />}

        {/* Content column sits above the art (z-10). Bottom padding reserves
             the pointed-bottom band so no content spills over the point. */}
        <div
          className="relative z-10 flex h-full w-full flex-col items-center gap-1 pt-3"
          style={{ paddingBottom: pointPad }}
        >
          {/* Wing crest + avatar medallion.
               Wing art is sized relative to the banner (not the avatar ring) so
               it continues to frame the full banner width at any ring size.
               The wing image renders at 110% of banner width so the spread
               extends naturally beyond the shaped edges. */}
          <div
            className="relative flex items-center justify-center mt-1"
            style={{ width: "100%", height: isSelf ? 110 : 90 }}
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
                tierGemSrc={tierGemSrc}
              />
              {/* Level badge — overlaps bottom of medallion ring.
                   minWidth grows to accommodate 3-digit levels. */}
              <div
                className="relative -mt-2 z-20 rounded-full border border-grey-2 bg-grey-4 px-1.5 py-px"
                style={{ minWidth: 20, textAlign: "center" }}
              >
                <span className="font-body text-[8px] leading-none text-grey-1 font-semibold">
                  {level ?? 15}
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

          {/* Badge slots — three circular slots from the reference V11 layout.
               Empty entries (undefined) render as dark circles with a muted ring.
               Filled entries show an icon image inside a colored ring. */}
          {badges && (
            <div className="flex items-center justify-center gap-1.5 mt-1.5">
              {(badges as (BadgeSlot | undefined)[]).map((badge, i) =>
                badge ? (
                  <div
                    key={i}
                    className="relative flex items-center justify-center rounded-full bg-grey-4"
                    style={{
                      width: isSelf ? 22 : 18,
                      height: isSelf ? 22 : 18,
                      border: `1.5px solid ${badge.ringColor ?? "var(--color-gold-4)"}`,
                      boxShadow: badge.ringColor
                        ? `0 0 4px 0 ${badge.ringColor}`
                        : undefined,
                    }}
                  >
                    <img
                      src={badge.iconSrc}
                      alt=""
                      aria-hidden="true"
                      width={isSelf ? 14 : 11}
                      height={isSelf ? 14 : 11}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div
                    key={i}
                    className="rounded-full bg-grey-4"
                    aria-hidden="true"
                    style={{
                      width: isSelf ? 22 : 18,
                      height: isSelf ? 22 : 18,
                      border: "1px solid var(--color-grey-3)",
                    }}
                  />
                ),
              )}
            </div>
          )}

          {/* Children slot */}
          {children && (
            <div className="flex w-full items-center justify-center px-1 mt-2">
              {children}
            </div>
          )}


          {/* Footer: autofill chip + foot glyph + optional queue asterisk on self */}
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
            {/* Asterisk glyph — marks self as the queued player */}
            {isSelf && queueing && (
              <span className="text-blue-2" aria-label="In queue">
                <AsteriskGlyph />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
