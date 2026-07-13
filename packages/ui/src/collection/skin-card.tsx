'use client';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
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
   * Skin tier label shown in the hover tooltip badge, e.g. "Legacy", "Epic".
   * When provided, a small tier badge row appears below the skin name in the tooltip.
   * Typically supplied for unowned skins only.
   */
  tierLabel?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const CARD_W = 150;
const CARD_H = 220;

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
 * Hover tooltip overlay — appears at the bottom of the card on group-hover.
 * Shows the skin name in display font and an optional tier badge row.
 * pointer-events-none so it never blocks clicks on the card beneath.
 */
function HoverTooltip({ name, tierLabel }: { name: string; tierLabel?: string }) {
  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none",
        "absolute inset-x-0 bottom-0",
        "bg-blue-7/90",
        "px-3 py-2",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-150",
        "flex flex-col gap-1",
      ].join(" ")}
    >
      <span className="font-display text-xs uppercase tracking-wider text-gold-cream leading-tight line-clamp-2">
        {name}
      </span>
      {tierLabel && (
        <div className="flex items-center gap-1">
          {/* Small diamond dot acting as tier icon */}
          <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true" className="shrink-0 text-gold-3">
            <rect x="1" y="1" width="6" height="6" fill="currentColor" transform="rotate(45, 4, 4)" />
          </svg>
          <span className="font-body text-[10px] text-gold-2 leading-none">{tierLabel}</span>
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
 * On hover, a dark panel tooltip appears at the card bottom showing the skin name
 * and optional tier badge. `tierLabel` drives the badge row; omit for owned skins.
 *
 * Presentational only — props in, callbacks out. No data fetching.
 */
export function SkinCard({ name, imageSrc, owned = true, onSelect, tierLabel }: SkinCardProps) {
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
      <HoverTooltip name={name} tierLabel={tierLabel} />
    </>
  );

  // NOTE: no overflow-hidden on the root — the owned finials straddle the
  // border (translated 50% outside) and must not be clipped. Nothing else
  // overflows: hover brightens only, never zooms.
  const sharedClass = owned
    ? "group relative border border-gold-3 hover:border-gold-2 transition-colors duration-150"
    : "group relative";

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
