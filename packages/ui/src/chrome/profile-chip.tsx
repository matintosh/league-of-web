"use client";

import { useId } from "react";
import type { ReactNode } from "react";
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
   * Resolved URL for the notification bell mask glyph — supply
   * `notificationBellUrl()` from `@low/fixtures`. The 72×72 monochrome-on-
   * transparent raster is rendered via CSS `mask-image` over a token-colored
   * box so the bell inherits the button's grey-1 → gold-1 color states. When
   * omitted, the chip falls back to a hand-drawn inline SVG bell (back-compat).
   */
  notificationBellSrc?: string;
  /**
   * Resolved URL for the real themed-border avatar frame — supply
   * `avatarBorderUrl(theme)` from `@low/fixtures` (theme 1..21). When provided,
   * the ornate ring around the avatar renders from this 512×512 PNG frame (a
   * gold ring with tier-tinted flourishes + integrated level-plate) instead of
   * the hand-drawn {@link OrnateRing}. The frame's ART occupies only the centre
   * ~57% of its canvas with a transparent inner circle (~35% of canvas); the
   * chip sizes the border box to `avatarSize / 0.35` and centres it so the
   * avatar seats exactly inside the ring while the wings/plate overflow the
   * avatar box (pointer-events-none, aria-hidden). Only ever downscaled from
   * 512px, so it stays crisp at both navband (34px) and rail (48px). Omit to
   * fall back to the drawn OrnateRing (back-compat).
   */
  avatarBorderSrc?: string;
  /**
   * Called when the identity area (avatar + name block) is clicked. In the
   * real client the profile screen has NO main-nav tab — it opens from this
   * chip (issue #425). When provided, the identity area renders as a button
   * with pointer/hover affordance; the bell keeps its own separate handler
   * and never double-fires. Omit for a non-interactive chip (back-compat).
   */
  onOpenProfile?: () => void;
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
// AvatarBorder — the REAL client themed-border frame (raster) around the avatar
// ---------------------------------------------------------------------------

/**
 * Fraction of a themed-border PNG's 512px canvas taken up by the ring's
 * transparent inner circle (where the avatar shows through). Measured as
 * ~180/512 ≈ 0.352 and consistent across all 21 frames — see
 * `avatarBorderUrl`'s JSDoc in `@low/fixtures`.
 */
const BORDER_INNER_RATIO = 180 / 512;

/**
 * Fraction of the 512px canvas taken up by the ring's OUTER gold band diameter
 * (the visible ring, excluding the small clasps/wings that flare past it).
 * Measured on theme-3 as 324/512 ≈ 0.633 and stable across the compact frames.
 *
 * The compact navband render (#509) sizes the border box to
 * `ringOuter / BORDER_RING_RATIO` so the *visible ring* lands at a chosen pixel
 * diameter (≈48–56px in the reference) instead of blowing the box up to
 * `avatar / BORDER_INNER_RATIO` (≈2.85×, the #492 overflow that broke the band).
 * The frame's wing-tips still flare ~25.65px past each side of the 34px avatar
 * box, so the navband clips the frame's painted footprint to ±28px from the
 * avatar centre (AvatarBorder `clipHalfWidth`) — keeping the full ring but
 * trimming the wing-tips off both the name (right) and currency (left). See the
 * ringOuter comment in ProfileChip (#521).
 */
const BORDER_RING_RATIO = 324 / 512;

/**
 * Renders the real client themed-border frame over the avatar (issue #489/#509).
 *
 * The 512×512 PNG's ring is centred on its canvas with a transparent inner
 * circle. Two sizing modes:
 *
 * - `ringOuter` supplied (compact navband, #509) — the box is sized so the
 *   visible gold ring lands at `ringOuter` px (`ringOuter / BORDER_RING_RATIO`).
 *   The avatar seats just inside; only the small clasps overflow the avatar box
 *   by a few px. Absolutely centred + pointer-events-none, so the wider box
 *   NEVER pushes layout — the chip's footprint stays the avatar size.
 * - otherwise (rail, back-compat) — the box is sized to `size /
 *   BORDER_INNER_RATIO` (≈2.85× the avatar) so the inner circle equals the
 *   avatar and the wings/plate overflow generously.
 *
 * `clipHalfWidth` (navband, #521) horizontally clips the painted footprint to
 * ±`clipHalfWidth` px from the avatar centre via `clip-path: inset()`. The box
 * is 85.3px for a 54px ring, so its side wing-tips flare ±25.65px past the 34px
 * avatar and paint over BOTH siblings (name right, currency left). Clipping to
 * ~±28px keeps the full ring (needs ±27px), the bottom crescent/gem and the
 * level plate, and trims only the outer wing-tips (which aren't in the reference
 * frame). Vertical extent is left unclipped (top/bottom = 0).
 *
 * object-contain so the frame never distorts; only ever downscaled from 512px so
 * it stays crisp. aria-hidden — purely decorative.
 */
function AvatarBorder({
  size,
  src,
  ringOuter,
  clipHalfWidth,
}: {
  size: number;
  src: string;
  ringOuter?: number;
  clipHalfWidth?: number;
}) {
  const box = ringOuter ? ringOuter / BORDER_RING_RATIO : size / BORDER_INNER_RATIO;
  const offset = (box - size) / 2;
  // Trim per horizontal side = box half-width − requested half-width. The img is
  // `box` wide and centred on the avatar centre (left: -offset), so trimming
  // this much off each side leaves a ±clipHalfWidth painted band around centre.
  const sideTrim =
    clipHalfWidth !== undefined ? Math.max(0, box / 2 - clipHalfWidth) : 0;
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className="absolute max-w-none object-contain pointer-events-none"
      style={{
        width: box,
        height: box,
        left: -offset,
        top: -offset,
        zIndex: 1,
        clipPath: sideTrim > 0 ? `inset(0 ${sideTrim}px)` : undefined,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// BellIcon — notification bell
// ---------------------------------------------------------------------------

/**
 * Notification bell glyph.
 *
 * When `src` is supplied (the real client's `notifications_button_icon.png`
 * located at #399 — a 72×72 monochrome-on-transparent raster), the bell renders
 * as a CSS `mask-image` on a `bg-current` box so it inherits the button's token
 * text color and its grey-1 → gold-1 hover transition — no baked color. This
 * matches the friend-finder mask-glyph pattern (SocialHeader / #434) and is more
 * faithful than a hand-drawn outline (the client glyph is a FILLED bell).
 *
 * Without `src`, falls back to the hand-drawn inline SVG (currentColor) that
 * predated the located asset — kept for back-compat with call sites that don't
 * pass a bell URL. `size` lets the navband variant render a slightly smaller
 * bell (15px) than the rail header (16px).
 */
function BellIcon({ size = 16, src }: { size?: number; src?: string }) {
  if (src) {
    return (
      <span
        aria-hidden="true"
        className="block bg-current"
        style={{
          width: size,
          height: size,
          maskImage: `url(${src})`,
          WebkitMaskImage: `url(${src})`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
    );
  }
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
// IdentityArea — avatar + name wrapper; <button> only when interactive so
// non-interactive chips keep plain-div semantics (no phantom tab stop).
// ---------------------------------------------------------------------------

function IdentityArea({ interactive, onClick, className, children }: {
  interactive: boolean;
  onClick?: () => void;
  className: string;
  children: ReactNode;
}) {
  if (!interactive) return <div className={className}>{children}</div>;
  return (
    <button type="button" aria-label="Open profile" onClick={onClick} className={className}>
      {children}
    </button>
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
  notificationBellSrc,
  avatarBorderSrc,
  onOpenProfile,
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
  // navband: render the themed border COMPACT — the visible gold ring lands at
  // ~54px (measured off the reference: ring outer ≈55–57px around the ~34px
  // avatar) via AvatarBorder's ringOuter path. The border box is 85.3px
  // (54/BORDER_RING_RATIO), so its side wing-tips flare ~25.65px past each side
  // of the 34px avatar box and — since the frame is an absolutely-centred z-1
  // element — paint over BOTH siblings (name on the right, currency on the
  // left). We clip the frame's painted footprint to ±28px from the avatar centre
  // (clipHalfWidth) so the wing-tips can't reach either sibling, while keeping
  // the full ~54px ring (needs ±27px) + bottom crescent/gem + level plate. The
  // name block is also offset (ml-[18px]) for extra clearance on the right. This
  // fixes the #492/#499 occlusion class on both sides (#521). rail keeps the
  // generous inner-hole sizing (undefined ringOuter, no clip).
  const ringOuter = isNavband ? 54 : undefined;
  // Half-width of the frame's allowed painted band, measured from the avatar
  // centre. 28px > the ring's 27px radius (ring stays intact) but < the 42.66px
  // box half-width, so only the outer wing-tips get trimmed.
  const frameClipHalfWidth = isNavband ? 28 : undefined;
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
      {/* Identity area — avatar + name block. Renders as a button when       */}
      {/* onOpenProfile is provided: the real client opens the profile screen */}
      {/* from this chip, not from a main-nav tab (#425). The bell below stays */}
      {/* outside so notification clicks never double-fire.                   */}
      {/* ------------------------------------------------------------------ */}
      <IdentityArea
        interactive={!!onOpenProfile}
        onClick={onOpenProfile}
        className={[
          isNavband
            ? "flex min-w-0 items-center gap-2 text-left"
            : "flex min-w-0 flex-1 items-center gap-2.5 text-left",
          onOpenProfile
            ? "cursor-pointer transition-[filter] duration-150 hover:brightness-110"
            : "",
        ].join(" ")}
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

        {/* Avatar frame — the real client themed-border raster when a src is    */}
        {/* supplied (#489), else the hand-drawn ornate double ring (back-compat) */}
        {avatarBorderSrc ? (
          <AvatarBorder
            size={AVATAR_SIZE}
            src={avatarBorderSrc}
            ringOuter={ringOuter}
            clipHalfWidth={frameClipHalfWidth}
          />
        ) : (
          <OrnateRing size={AVATAR_SIZE} uid={uid} />
        )}

        {/* Level badge plate — dark angular plate with gold trim, seated at the  */}
        {/* bottom-centre of the avatar (matches the reference's "371" plate). In */}
        {/* the navband it sits a touch lower so it clears the compact ring's     */}
        {/* bottom band; the plate is the chip's own element (NOT part of the     */}
        {/* border art), so it renders identically whichever frame is chosen.     */}
        <span
          className={[
            "absolute left-1/2 -translate-x-1/2 rounded-[3px] border border-gold-4 bg-grey-4 font-body leading-none text-gold-1 tabular-nums whitespace-nowrap shadow-sm",
            isNavband ? "text-[9px] px-1 py-[0.5px] bottom-0 translate-y-[35%]" : "text-[10px] px-1 bottom-0 translate-y-1/2",
          ].join(" ")}
          style={{ zIndex: 2 }}
        >
          {level}
        </span>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Name + availability row                                             */}
      {/*                                                                     */}
      {/* navband: the compact themed frame's visible ring lands at ~54px,    */}
      {/* but its right clasp/wing art flares ~25.65px past the 34px avatar    */}
      {/* box ((85.3−34)/2). The IdentityArea gap-2 (8px) alone left ~17.7px   */}
      {/* of clasp painting over the name start (the #492/#499 regression,     */}
      {/* #521). We clear the name by pushing it a further 18px right, so the  */}
      {/* name origin sits 26px (8px gap + 18px) from the avatar edge — just   */}
      {/* past the ~25.65px overhang, landing the clasp in empty space. The    */}
      {/* frame stays untouched (reference-matched ring), only the name moves. */}
      {/* ------------------------------------------------------------------ */}
      <div className={isNavband ? "ml-[18px] min-w-0" : "min-w-0 flex-1"}>
        {/* Summoner name — navband uses the Marcellus display serif (matches the
            reference, which renders the name in the client's serif face, not the
            body sans) at a compact 13px cream, sized so the name cap-height is
            ~⅕ of the ring diameter. rail keeps its 14px body treatment. */}
        <p className={`truncate ${isNavband ? "font-display text-[13px] leading-none" : "font-body text-sm leading-tight"} ${nameClass}`}>
          {gameName}
        </p>
        {/* Availability row: status dot + label (or custom statusText). navband
            tightens the dot + label to an 11px line tucked directly under the
            name (matches the reference's compact stack). */}
        <div className={`flex min-w-0 items-center ${isNavband ? "mt-0.5 gap-1" : "mt-0.5 gap-1.5"}`}>
          <span
            aria-label={statusLabel}
            className={`inline-block shrink-0 rounded-full transition-colors duration-150 ${isNavband ? "h-1.5 w-1.5" : "h-2 w-2"} ${dotClass}`}
          />
          <span className={`min-w-0 truncate font-body leading-tight ${isNavband ? "text-[11px]" : "text-xs"} ${statusClass}`}>
            {displayLabel}
          </span>
        </div>
      </div>
      </IdentityArea>

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
        <BellIcon size={isNavband ? 15 : 16} src={notificationBellSrc} />
      </button>
    </div>
  );
}
