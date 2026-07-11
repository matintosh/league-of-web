'use client';

import { useId } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SkinOption {
  /** Display name of the skin. */
  name: string;
  /** URL for the small thumbnail shown in the strip (~90×50). */
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
}

// ---------------------------------------------------------------------------
// Style maps
// ---------------------------------------------------------------------------

/** Thumb border: selected = gold-3, default = transparent */
const THUMB_BORDER: Record<"selected" | "default", string> = {
  selected: "border-2 border-gold-3",
  default: "border-2 border-transparent",
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Diamond lock badge for locked thumbs — inlined from SkinCard's LockBadge. */
function LockBadge() {
  return (
    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 pointer-events-none">
      <svg width="18" height="18" viewBox="0 0 22 22" aria-hidden="true">
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
      <span className="sr-only">locked</span>
    </div>
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
 * browse; selected thumb has a gold-3 border; locked thumbs are dimmed with a
 * diamond lock badge.
 *
 * Chevron arrows (<, >) navigate to the next UNLOCKED skin in that direction,
 * skipping over any locked entries. Navigation is clamped — no wrap-around.
 * When already at the first/last unlocked skin in a direction, the arrow is
 * still rendered but has no effect (aria-disabled for semantics).
 *
 * Controlled: parent owns `selectedIndex`; `onSelect` is called with the new
 * index. Clicking a locked thumb calls nothing.
 */
export function SkinCarousel({ skins, selectedIndex, onSelect }: SkinCarouselProps) {
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

  // Circular frame dimensions
  const FRAME_R = 160; // radius of inner circular clip
  const FRAME_SIZE = FRAME_R * 2; // 320px

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

      {/* ── Thumb strip with chevrons ── */}
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
          {skins.map((skin, i) => {
            const isSelected = i === selectedIndex;
            const isLocked = !!skin.locked;

            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (!isLocked) onSelect(i);
                }}
                aria-label={skin.name}
                aria-pressed={isSelected}
                aria-disabled={isLocked}
                className={[
                  "relative overflow-hidden transition-[border-color,filter] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
                  isSelected ? THUMB_BORDER.selected : THUMB_BORDER.default,
                  isLocked ? "brightness-50 cursor-default" : "cursor-pointer hover:brightness-110",
                ].join(" ")}
                style={{ width: 90, height: 50 }}
              >
                <img
                  src={skin.thumbSrc}
                  alt={skin.name}
                  width={90}
                  height={50}
                  className="object-cover w-full h-full"
                  draggable={false}
                />
                {isLocked && <LockBadge />}
              </button>
            );
          })}
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
    </div>
  );
}
