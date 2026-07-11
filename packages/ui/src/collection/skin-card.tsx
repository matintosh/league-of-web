'use client';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface SkinCardProps {
  /** Skin name used for alt text and aria-label. */
  name: string;
  /** Loading-art portrait URL, e.g. from loadingArtUrl(id, skinNum). */
  imageSrc: string;
  /** Whether the skin is owned. Defaults to true. */
  owned?: boolean;
  /** Called when card is clicked. When provided, root renders as <button>. */
  onSelect?: () => void;
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
 * Presentational only — props in, callbacks out. No data fetching.
 */
export function SkinCard({ name, imageSrc, owned = true, onSelect }: SkinCardProps) {
  const rootStyle = { width: CARD_W, height: CARD_H };

  const content = (
    <>
      <img
        src={imageSrc}
        alt={name}
        width={CARD_W}
        height={CARD_H}
        className={[
          "object-cover w-full h-full transition-all duration-150",
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
    </>
  );

  const sharedClass = owned
    ? "group relative overflow-hidden border border-gold-3 group-hover:border-gold-2 transition-colors duration-150"
    : "group relative overflow-hidden";

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
