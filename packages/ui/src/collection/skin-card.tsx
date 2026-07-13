'use client';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

/** Skin tier label — union of known Riot tier names. */
export type SkinTier = "Legacy" | "Epic" | "Ultimate" | "Mythic" | "Prestige";

export interface SkinCardProps {
  /** Skin name used for alt text, aria-label, and hover tooltip. */
  name: string;
  /** Loading-art portrait URL, e.g. from loadingArtUrl(id, skinNum). */
  imageSrc: string;
  /** Whether the skin is owned. Defaults to true. */
  owned?: boolean;
  /** Called when card is clicked. When provided, root renders as <button>. */
  onSelect?: () => void;
  /**
   * Skin tier label shown in the hover tooltip badge.
   * When provided, a tier badge row appears below the skin name.
   * Typically supplied for unowned skins only.
   */
  tierLabel?: SkinTier;
  /**
   * Which side of the card the floating tooltip panel opens toward.
   * Use "left" for cards in the last grid column to prevent viewport overflow.
   * Defaults to "right".
   */
  tooltipSide?: "right" | "left";
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const CARD_W = 150;
const CARD_H = 220;
/** Tooltip panel width in px — matches ~213px reference at 1280×720. */
const TOOLTIP_W = 213;

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

/** Small diamond finial rendered as an absolutely-positioned SVG. */
function Finial({ position }: { position: "top" | "bottom" }) {
  const posClass =
    position === "top"
      ? "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold-3 group-hover:text-gold-2 transition-colors duration-150"
      : "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-gold-3 group-hover:text-gold-2 transition-colors duration-150";

  return (
    <svg
      width={10}
      height={10}
      viewBox="0 0 10 10"
      aria-hidden="true"
      className={posClass}
    >
      <rect
        x={2}
        y={2}
        width={6}
        height={6}
        fill="currentColor"
        transform="rotate(45, 5, 5)"
      />
    </svg>
  );
}

/** Lock badge for unowned skins — diamond outline with a lock icon inside. */
function LockBadge() {
  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none">
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        {/* Gold outline diamond */}
        <rect
          x="4" y="4" width="14" height="14"
          fill="none"
          stroke="var(--color-gold-3)"
          strokeWidth="1.5"
          transform="rotate(45, 11, 11)"
        />
        {/* Lock body */}
        <rect x="8" y="12" width="6" height="4" rx="0.5" fill="var(--color-gold-3)" />
        {/* Lock shackle */}
        <path d="M9 12 V10 A2 2 0 0 1 13 10 V12" fill="none" stroke="var(--color-gold-3)" strokeWidth="1.2" />
      </svg>
      <span className="sr-only">not owned</span>
    </div>
  );
}

/**
 * Hover tooltip panel — floats to the right (or left) of the card on group-hover,
 * overlapping adjacent cards. Anchored at the card's vertical midpoint.
 *
 * Matches the reference: dark navy panel (~213×87px at 1280×720), skin name in
 * uppercase display font, optional tier badge row below.
 *
 * pointer-events-none so it never intercepts clicks on the card or its neighbors.
 */
function HoverTooltip({
  name,
  tierLabel,
  side,
}: {
  name: string;
  tierLabel?: SkinTier;
  side: "right" | "left";
}) {
  const positionClass =
    side === "right"
      ? "left-full top-1/2 -translate-y-1/2 ml-1"
      : "right-full top-1/2 -translate-y-1/2 mr-1";

  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none",
        "absolute z-10",
        positionClass,
        "bg-blue-7/90",
        "px-4 py-3",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-150",
        "flex flex-col gap-2",
      ].join(" ")}
      style={{ width: TOOLTIP_W, minHeight: 87 }}
    >
      <span className="font-display text-sm uppercase tracking-wider text-gold-cream leading-snug">
        {name}
      </span>
      {tierLabel && (
        <div className="flex items-center gap-1.5">
          {/* Diamond tier icon */}
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="shrink-0 text-gold-3">
            <rect x="2" y="2" width="6" height="6" fill="currentColor" transform="rotate(45, 5, 5)" />
          </svg>
          <span className="font-body text-xs text-gold-2 leading-none">{tierLabel}</span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SkinCard
// ---------------------------------------------------------------------------

/**
 * SkinCard — portrait tile for a champion skin in the collection browser.
 *
 * Owned: 1px gold-3 border + small diamond finials at top-center and bottom-center.
 * Unowned: brightness-50 art, no gold border, diamond lock badge at bottom-center.
 * NOTE: Hover brightens art only — no zoom. Reference shows brighten, not zoom.
 *
 * On hover, a floating dark panel appears to the right of the card (or left when
 * `tooltipSide="left"`) showing the skin name and optional tier badge. The panel
 * overlaps adjacent cards intentionally — matches the reference screenshot.
 *
 * Presentational only — props in, callbacks out. No data fetching.
 */
export function SkinCard({
  name,
  imageSrc,
  owned = true,
  onSelect,
  tierLabel,
  tooltipSide = "right",
}: SkinCardProps) {
  const rootStyle = { width: CARD_W, height: CARD_H };

  const content = (
    <>
      <img
        src={imageSrc}
        alt={name}
        width={CARD_W}
        height={CARD_H}
        className={[
          "object-cover w-full h-full transition-[filter] duration-150",
          owned
            ? ""
            : "brightness-50 group-hover:brightness-75",
        ]
          .join(" ")
          .trim()}
      />
      {owned && (
        <>
          <Finial position="top" />
          <Finial position="bottom" />
        </>
      )}
      {!owned && <LockBadge />}
      <HoverTooltip name={name} tierLabel={tierLabel} side={tooltipSide} />
    </>
  );

  // NOTE: no overflow-hidden on the root — the owned finials straddle the border
  // (translated 50% outside) and must not be clipped. The tooltip floats outside
  // via absolute+left-full; it needs z-10 on hover to rise above sibling cards.
  const sharedClass = owned
    ? "group relative hover:z-10 border border-gold-3 hover:border-gold-2 transition-colors duration-150"
    : "group relative hover:z-10";

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        aria-label={name}
        className={`${sharedClass} cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3`}
        style={rootStyle}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={sharedClass}
      style={rootStyle}
    >
      {content}
    </div>
  );
}
