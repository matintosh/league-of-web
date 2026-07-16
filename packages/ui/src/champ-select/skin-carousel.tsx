'use client';

import { useId } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SkinOption {
  /** Display name of the skin. */
  name: string;
  /** URL for the thumbnail shown in the strip (~90×50 unselected, ~118×66 selected). */
  thumbSrc: string;
  /** URL for the large splash shown in the circular/rectangular frame. */
  splashSrc: string;
  /** When true: thumb is dimmed + locked badge; clicking the thumb no-ops. */
  locked?: boolean;
}

export interface SkinCarouselProps {
  /** Ordered list of skins. */
  skins: SkinOption[];
  /** Index into `skins` of the currently selected skin. Controlled. */
  selectedIndex: number;
  /**
   * Called with the new index when the user selects a skin.
   * Locked skins never call onSelect.
   * Chevron arrows skip locked skins in the chosen direction; if no unlocked
   * skin exists in that direction the selection stays (clamped — no wrap).
   */
  onSelect: (i: number) => void;
  /**
   * When false the thumb strip (chevrons + thumbnail row) is hidden.
   * Use this when the parent places the thumb strip elsewhere in the layout
   * (e.g. the loadout screen's bottom bar) and renders `SkinThumbStrip`
   * directly. Defaults to true.
   */
  showThumbStrip?: boolean;
  /**
   * Ring radius in pixels (inner circular clip radius).
   * Drives the SVG frame size: total SVG = 2 × ringRadius + 48.
   * Defaults to 130. Override to fit tighter containers.
   */
  ringRadius?: number;
}

/**
 * SkinThumbStripProps — same controlled props as SkinCarouselProps but just
 * for the chevron + thumbnail row. Used when the loadout screen renders the
 * thumb strip separately in the bottom bar.
 */
export interface SkinThumbStripProps {
  skins: SkinOption[];
  selectedIndex: number;
  onSelect: (i: number) => void;
}

// ---------------------------------------------------------------------------
// Thumb geometry
// ---------------------------------------------------------------------------

/**
 * Thumb art-tile dimensions.
 *
 * Measured from the reference loadout strip (docs/reference/
 * client-loadout-skin-thumb-strip-detail.png, native scale): the SELECTED
 * thumb renders in a bright double-gold frame ~171×98px while an unselected
 * art tile is ~108×73px — the selected tile grows ≈1.6× wide and ≈1.35× tall
 * and pops forward. We keep our unselected base at 90×50 and scale the selected
 * tile proportionally, capped so the framed footprint fits the loadout tray's
 * 77px strip row (bottom bar height 130 − 52px action bar − 1px rule).
 */
const THUMB_SIZE = {
  default: { w: 90, h: 50 },
  selected: { w: 118, h: 66 },
} as const;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Gold padlock badge for locked thumbs — shackle arc + body silhouette,
 * bottom-centre of the tile. Replaces the earlier rotated-diamond badge to
 * match the reference (a plain gold padlock at each locked thumb's lower edge).
 */
function LockBadge() {
  return (
    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 pointer-events-none">
      <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true">
        {/* Shackle: rounded arc rising from the body */}
        <path
          d="M4.5 8 V5.5 A3.5 3.5 0 0 1 11.5 5.5 V8"
          fill="none"
          stroke="var(--color-gold-2)"
          strokeWidth="1.6"
        />
        {/* Body: rounded rectangle */}
        <rect
          x="2.5" y="8" width="11" height="8" rx="1.5"
          fill="var(--color-gold-3)"
          stroke="var(--color-gold-2)"
          strokeWidth="0.75"
        />
        {/* Keyhole */}
        <circle cx="8" cy="11.5" r="1.1" fill="var(--color-gold-5)" />
        <rect x="7.4" y="11.5" width="1.2" height="2.6" rx="0.4" fill="var(--color-gold-5)" />
      </svg>
      <span className="sr-only">locked</span>
    </div>
  );
}

/**
 * SkinThumb — a single thumbnail button in the strip. Shared by SkinCarousel's
 * inline strip and the standalone SkinThumbStrip so both stay identical.
 *
 * Selected: enlarged tile + heavy double-gold frame (bright gold-2 outer ring
 * with a darker gold-4 inner rule). Locked: dimmed (art stays readable) + gold
 * padlock badge; click no-ops. The button footprint reserves the selected width
 * always so the row does not reflow when selection moves.
 */
function SkinThumb({
  skin,
  isSelected,
  onSelect,
}: {
  skin: SkinOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const isLocked = !!skin.locked;
  const size = isSelected ? THUMB_SIZE.selected : THUMB_SIZE.default;

  return (
    <button
      type="button"
      onClick={() => { if (!isLocked) onSelect(); }}
      aria-label={skin.name}
      aria-pressed={isSelected}
      aria-disabled={isLocked}
      className={[
        "relative shrink-0 flex items-center justify-center",
        "transition-transform duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
        isLocked ? "cursor-default" : "cursor-pointer",
      ].join(" ")}
      // Reserve the selected footprint width so neighbours don't shift on select.
      style={{ width: THUMB_SIZE.selected.w, height: THUMB_SIZE.selected.h }}
    >
      <span
        className={[
          "relative block overflow-hidden transition-[width,height] duration-150",
          isSelected
            // Heavy double-gold frame: bright outer border + darker inner rule.
            ? "border-2 border-gold-2 ring-1 ring-inset ring-gold-4 shadow-[0_0_6px_rgba(0,0,0,0.6)]"
            : "border-2 border-transparent",
        ].join(" ")}
        style={{ width: size.w, height: size.h }}
      >
        <img
          src={skin.thumbSrc}
          alt={skin.name}
          width={size.w}
          height={size.h}
          className={[
            "object-cover w-full h-full transition-[filter] duration-150",
            isLocked
              ? "brightness-[0.65]"
              : isSelected ? "" : "hover:brightness-110",
          ].join(" ")}
          draggable={false}
        />
        {isLocked && <LockBadge />}
      </span>
    </button>
  );
}

/** Left chevron SVG */
function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none">
      <path d="M13 4 L7 10 L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Right chevron SVG */
function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none">
      <path d="M7 4 L13 10 L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SkinCarousel
// ---------------------------------------------------------------------------

/**
 * SkinCarousel — the skin picker in the champ-select loadout panel.
 *
 * Selected skin is displayed in an ornate circular frame (double gold SVG ring
 * + dashed tick circle, circular-clipped splash). Skin name appears below in
 * font-display italic gold-1. Pagination dots (6px, active=blue-2,
 * inactive=grey-3) sit below the name. A horizontal thumb strip lets the user
 * browse; the selected thumb is enlarged with a heavy double-gold frame; locked
 * thumbs are dimmed (art stays readable) with a gold padlock badge.
 *
 * Chevron arrows (<, >) navigate to the next UNLOCKED skin in that direction,
 * skipping over any locked entries. Navigation is clamped — no wrap-around.
 * When already at the first/last unlocked skin in a direction, the arrow is
 * still rendered but has no effect (aria-disabled for semantics).
 *
 * Controlled: parent owns `selectedIndex`; `onSelect` is called with the new
 * index. Clicking a locked thumb calls nothing.
 *
 * `showThumbStrip` (default true): when false, the chevron + thumbnail row is
 * omitted. Use this when the loadout screen places the thumb strip in the
 * bottom bar for layout reasons.
 *
 * `ringRadius` (default 130): inner clip radius in px. The SVG frame outer
 * size is 2×ringRadius + 48px (24px ornament margin each side).
 */
export function SkinCarousel({
  skins,
  selectedIndex,
  onSelect,
  showThumbStrip = true,
  ringRadius = 130,
}: SkinCarouselProps) {
  const uid = useId();
  const clipId = `${uid}-clip`;
  const outerRingId = `${uid}-outer-ring`;

  const selected = skins[selectedIndex];

  // Find next unlocked index in a direction; returns undefined if none found.
  function nextUnlocked(direction: -1 | 1): number | undefined {
    let i = selectedIndex + direction;
    while (i >= 0 && i < skins.length) {
      const skin = skins[i];
      if (skin && !skin.locked) return i;
      i += direction;
    }
    return undefined;
  }

  const prevIndex = nextUnlocked(-1);
  const nextIndex = nextUnlocked(1);

  function handlePrev() {
    if (prevIndex !== undefined) onSelect(prevIndex);
  }
  function handleNext() {
    if (nextIndex !== undefined) onSelect(nextIndex);
  }

  // Circular frame dimensions — driven by ringRadius prop (default 130).
  const FRAME_R = ringRadius;
  const FRAME_SIZE = FRAME_R * 2;

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {/* ── Circular splash frame ── */}
      <div className="relative" style={{ width: FRAME_SIZE + 48, height: FRAME_SIZE + 48 }}>
        {/* Outer decorative gold ring SVG (double ring + dashed tick circle) */}
        <svg
          id={outerRingId}
          width={FRAME_SIZE + 48}
          height={FRAME_SIZE + 48}
          viewBox={`0 0 ${FRAME_SIZE + 48} ${FRAME_SIZE + 48}`}
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          {/* Clip path for circular splash */}
          <defs>
            <clipPath id={clipId}>
              <circle
                cx={(FRAME_SIZE + 48) / 2}
                cy={(FRAME_SIZE + 48) / 2}
                r={FRAME_R}
              />
            </clipPath>
          </defs>

          {/* Outer gold ring (thick) */}
          <circle
            cx={(FRAME_SIZE + 48) / 2}
            cy={(FRAME_SIZE + 48) / 2}
            r={FRAME_R + 18}
            fill="none"
            stroke="var(--color-gold-3)"
            strokeWidth="3"
          />
          {/* Inner gold ring (thin, just outside clip) */}
          <circle
            cx={(FRAME_SIZE + 48) / 2}
            cy={(FRAME_SIZE + 48) / 2}
            r={FRAME_R + 8}
            fill="none"
            stroke="var(--color-gold-4)"
            strokeWidth="1.5"
          />
          {/* Dashed tick circle between the two rings */}
          <circle
            cx={(FRAME_SIZE + 48) / 2}
            cy={(FRAME_SIZE + 48) / 2}
            r={FRAME_R + 13}
            fill="none"
            stroke="var(--color-gold-4)"
            strokeWidth="1"
            strokeDasharray="2 6"
            strokeLinecap="round"
          />
        </svg>

        {/* Circular-clipped splash image */}
        {selected && (
          <svg
            width={FRAME_SIZE + 48}
            height={FRAME_SIZE + 48}
            viewBox={`0 0 ${FRAME_SIZE + 48} ${FRAME_SIZE + 48}`}
            className="absolute inset-0"
            aria-label={selected.name}
          >
            <defs>
              <clipPath id={`${clipId}-img`}>
                <circle
                  cx={(FRAME_SIZE + 48) / 2}
                  cy={(FRAME_SIZE + 48) / 2}
                  r={FRAME_R}
                />
              </clipPath>
            </defs>
            <image
              href={selected.splashSrc}
              x="0"
              y="-30"
              width={FRAME_SIZE + 48}
              height={FRAME_SIZE + 72}
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipId}-img)`}
            />
          </svg>
        )}
      </div>

      {/* ── Skin name ── */}
      {selected && (
        <p className="font-display italic text-xl text-gold-1 tracking-wide">
          {selected.name}
        </p>
      )}

      {/* ── Pagination dots ── */}
      <div className="flex items-center gap-2" role="tablist" aria-label="Skin pages">
        {skins.map((skin, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === selectedIndex}
            aria-label={skin.name}
            onClick={() => !skin.locked && onSelect(i)}
            aria-disabled={skin.locked}
            className="rounded-full transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3"
            style={{
              width: 6,
              height: 6,
              backgroundColor:
                i === selectedIndex
                  ? "var(--color-blue-2)"
                  : "var(--color-grey-3)",
            }}
          />
        ))}
      </div>

      {/* ── Thumb strip with chevrons — hidden when showThumbStrip=false ── */}
      {showThumbStrip && (
        <div className="flex items-center gap-3">
          {/* Left chevron */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous skin"
            aria-disabled={prevIndex === undefined}
            className={[
              "transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
              prevIndex === undefined
                ? "text-grey-2 cursor-default"
                : "text-gold-2 hover:text-gold-1 cursor-pointer",
            ].join(" ")}
          >
            <ChevronLeft />
          </button>

          {/* Thumbnails */}
          <div className="flex items-center gap-2">
            {skins.map((skin, i) => (
              <SkinThumb
                key={i}
                skin={skin}
                isSelected={i === selectedIndex}
                onSelect={() => onSelect(i)}
              />
            ))}
          </div>

          {/* Right chevron */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next skin"
            aria-disabled={nextIndex === undefined}
            className={[
              "transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
              nextIndex === undefined
                ? "text-grey-2 cursor-default"
                : "text-gold-2 hover:text-gold-1 cursor-pointer",
            ].join(" ")}
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SkinThumbStrip — standalone chevron + thumbnail row
// ---------------------------------------------------------------------------

/**
 * SkinThumbStrip — the chevron-flanked thumbnail row from SkinCarousel,
 * extracted as a standalone component for layouts (like the loadout screen
 * bottom bar) that need to place it separately from the circular frame.
 *
 * Shares all interaction semantics AND the SkinThumb renderer with SkinCarousel:
 * the selected thumb is enlarged with a double-gold frame; locked thumbs are
 * dimmed + gold padlock badge; chevrons skip locked skins; navigation is clamped.
 *
 * Controlled: parent owns `selectedIndex`; `onSelect` is called with new index.
 */
export function SkinThumbStrip({ skins, selectedIndex, onSelect }: SkinThumbStripProps) {
  function nextUnlocked(direction: -1 | 1): number | undefined {
    let i = selectedIndex + direction;
    while (i >= 0 && i < skins.length) {
      if (skins[i] && !skins[i]!.locked) return i;
      i += direction;
    }
    return undefined;
  }

  const prevIndex = nextUnlocked(-1);
  const nextIndex = nextUnlocked(1);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => { if (prevIndex !== undefined) onSelect(prevIndex); }}
        aria-label="Previous skin"
        aria-disabled={prevIndex === undefined}
        className={[
          "transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
          prevIndex === undefined
            ? "text-grey-2 cursor-default"
            : "text-gold-2 hover:text-gold-1 cursor-pointer",
        ].join(" ")}
      >
        <ChevronLeft />
      </button>

      <div className="flex items-center gap-2">
        {skins.map((skin, i) => (
          <SkinThumb
            key={i}
            skin={skin}
            isSelected={i === selectedIndex}
            onSelect={() => onSelect(i)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => { if (nextIndex !== undefined) onSelect(nextIndex); }}
        aria-label="Next skin"
        aria-disabled={nextIndex === undefined}
        className={[
          "transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
          nextIndex === undefined
            ? "text-grey-2 cursor-default"
            : "text-gold-2 hover:text-gold-1 cursor-pointer",
        ].join(" ")}
      >
        <ChevronRight />
      </button>
    </div>
  );
}
