'use client';

import { useId } from "react";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SkinThumbnail {
  name: string;
  imageSrc: string;
  owned: boolean;
}

export interface SkinPreviewProps {
  /** Skin display name, e.g. "Silver Kayle" */
  skinName: string;
  /** Flavor text / lore description */
  description?: string;
  /** Acquisition date label, e.g. "25/11/2010" */
  acquiredDate?: string;
  /** Whether the skin is owned */
  owned: boolean;
  /** Full-bleed splash image src — use championSplashUrl(id, skinNum) */
  splashSrc: string;
  /** Thumbnail strip: ordered list of skin thumbnails for this champion */
  thumbnails: SkinThumbnail[];
  /** Index of the currently displayed skin in the thumbnails array */
  selectedIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onThumbnailSelect: (index: number) => void;
  onClose: () => void;
  onInspect?: () => void;
  onLore?: () => void;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Ornate circular close button — gold-bordered frame, top-right. */
function CloseButton({ onClick, titleId }: { onClick: () => void; titleId: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close skin preview"
      className={[
        "relative flex items-center justify-center",
        "w-11 h-11 rounded-full",
        "border-2 border-gold-3 bg-hextech-black/80",
        "text-gold-1 hover:text-gold-2 hover:border-gold-2 hover:bg-hextech-black",
        "transition-colors duration-150",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
      ].join(" ")}
    >
      {/* Decorative outer ring */}
      <span
        aria-hidden="true"
        className="absolute inset-0.5 rounded-full border border-gold-5 pointer-events-none"
      />
      {/* X glyph */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id={titleId}>Close</title>
        <path
          d="M2 2L12 12M12 2L2 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
        />
      </svg>
    </button>
  );
}

/** Chevron nav button — gold, ~19px wide at 1280×720. */
function ChevronButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous skin" : "Next skin"}
      className={[
        "flex items-center justify-center",
        "w-8 h-10 shrink-0",
        "text-gold-3 hover:text-gold-2",
        "transition-colors duration-150",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
      ].join(" ")}
    >
      <svg
        width="10"
        height="18"
        viewBox="0 0 10 18"
        fill="none"
        aria-hidden="true"
      >
        {direction === "prev" ? (
          <path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
        ) : (
          <path d="M1 1L9 9L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
        )}
      </svg>
    </button>
  );
}

/** Lock badge for unowned thumbnail — small diamond outline with lock. */
function ThumbLockBadge() {
  return (
    <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 pointer-events-none">
      <svg width="16" height="16" viewBox="0 0 22 22" aria-hidden="true">
        <rect
          x="4" y="4" width="14" height="14"
          fill="none"
          stroke="var(--color-gold-3)"
          strokeWidth="1.5"
          transform="rotate(45, 11, 11)"
        />
        <rect x="8" y="12" width="6" height="4" rx="0.5" fill="var(--color-gold-3)" />
        <path d="M9 12 V10 A2 2 0 0 1 13 10 V12" fill="none" stroke="var(--color-gold-3)" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

/** Mask/inspect icon — stylized mask outline, gold-cream tint */
function MaskIcon() {
  return (
    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 2C5.5 2 1 6 1 10c0 2 1 4 3 5.5L5 17h3l1-2h4l1 2h3l1-1.5C19 14 21 12 21 10c0-4-4.5-8-10-8z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      <ellipse cx="7.5" cy="10" rx="2" ry="2.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="14.5" cy="10" rx="2" ry="2.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** Eye/lore icon — simple eye outline */
function EyeIcon() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 8C3.5 3 7 1 11 1s7.5 2 10 7c-2.5 5-6 7-10 7S3.5 13 1 8z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SkinPreview
// ---------------------------------------------------------------------------

/**
 * SkinPreview — full-bleed detail overlay for a champion skin.
 *
 * Renders inside `absolute inset-0 z-20` in the collection content area,
 * covering the sidebar+grid layout entirely. Shows splash art, skin name,
 * flavor text, acquired date, OWNED badge, thumbnail strip, and chevron nav.
 *
 * Presentational only — props in, callbacks out. No data fetching.
 * Import only TYPES from @low/fixtures; fixture values come from page-level.
 */
export function SkinPreview({
  skinName,
  description,
  acquiredDate,
  owned,
  splashSrc,
  thumbnails,
  selectedIndex,
  onPrev,
  onNext,
  onThumbnailSelect,
  onClose,
  onInspect,
  onLore,
}: SkinPreviewProps) {
  const closeTitleId = useId();

  return (
    <div className="relative w-full h-full overflow-hidden bg-hextech-black">
      {/* ---------------------------------------------------------------- */}
      {/* Full-bleed splash art                                             */}
      {/* ---------------------------------------------------------------- */}
      <img
        src={splashSrc}
        alt={skinName}
        className="absolute inset-0 w-full h-full object-cover object-top"
        aria-hidden="true"
      />

      {/* Gradient vignette — left side to make text readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, color-mix(in srgb, var(--color-hextech-black) 70%, transparent) 0%, color-mix(in srgb, var(--color-hextech-black) 30%, transparent) 40%, transparent 70%)",
        }}
      />

      {/* Bottom vignette — makes bottom strip readable */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, var(--color-hextech-black) 0%, transparent 100%)",
        }}
      />

      {/* ---------------------------------------------------------------- */}
      {/* Top-left — skin name + description                               */}
      {/* ---------------------------------------------------------------- */}
      <div className="absolute top-0 left-0 p-8 max-w-xs">
        <h2 className="font-display text-3xl uppercase tracking-wider text-gold-1 leading-tight drop-shadow-md">
          {skinName}
        </h2>
        {description && (
          <p className="mt-3 font-body text-sm text-grey-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Top-right — close button                                         */}
      {/* ---------------------------------------------------------------- */}
      <div className="absolute top-5 right-5">
        <CloseButton onClick={onClose} titleId={closeTitleId} />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Bottom strip                                                      */}
      {/* ---------------------------------------------------------------- */}
      <div className="absolute inset-x-0 bottom-0 h-[90px] flex items-center px-6 gap-4">
        {/* Acquired date */}
        <div className="flex flex-col gap-1 min-w-[110px] shrink-0">
          {acquiredDate && (
            <p className="font-body text-xs text-grey-1">
              Acquired date:{" "}
              <span className="font-semibold text-gold-1">{acquiredDate}</span>
            </p>
          )}
          {/* OWNED badge */}
          <div
            className={[
              "inline-flex items-center justify-center",
              "h-9 px-4 border",
              "font-display uppercase tracking-widest text-xs",
              owned
                ? "border-grey-3 text-grey-1 bg-hextech-black/60"
                : "border-grey-2 text-grey-2 bg-hextech-black/40",
            ].join(" ")}
            aria-label={owned ? "Owned" : "Not owned"}
          >
            {owned ? "Owned" : "Not Owned"}
          </div>
        </div>

        {/* Prev chevron */}
        <ChevronButton direction="prev" onClick={onPrev} />

        {/* Thumbnail strip */}
        <div className="flex gap-1.5 items-center">
          {thumbnails.map((thumb, i) => {
            const isSelected = i === selectedIndex;
            return (
              <button
                key={thumb.name}
                type="button"
                onClick={() => onThumbnailSelect(i)}
                aria-label={thumb.name}
                aria-pressed={isSelected}
                className={[
                  "relative shrink-0 overflow-hidden",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
                  "transition-all duration-150",
                  isSelected
                    ? "border-2 border-gold-3"
                    : "border border-grey-3 hover:border-gold-5",
                ].join(" ")}
                style={{ width: 72, height: 54 }}
              >
                <img
                  src={thumb.imageSrc}
                  alt={thumb.name}
                  width={72}
                  height={54}
                  className={[
                    "object-cover w-full h-full",
                    !thumb.owned && "brightness-50",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
                {!thumb.owned && <ThumbLockBadge />}
              </button>
            );
          })}
        </div>

        {/* Next chevron */}
        <ChevronButton direction="next" onClick={onNext} />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Icon buttons — inspect/lore */}
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={onInspect}
            aria-label="Inspect skin"
            className={[
              "flex items-center justify-center w-10 h-10",
              "border border-grey-3 text-gold-cream",
              "hover:border-gold-3 hover:text-gold-2",
              "transition-colors duration-150",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
            ].join(" ")}
          >
            <MaskIcon />
          </button>
          <button
            type="button"
            onClick={onLore}
            aria-label="View lore"
            className={[
              "flex items-center justify-center w-10 h-10",
              "border border-grey-3 text-gold-cream",
              "hover:border-gold-3 hover:text-gold-2",
              "transition-colors duration-150",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
            ].join(" ")}
          >
            <EyeIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
