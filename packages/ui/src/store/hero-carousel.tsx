"use client";

import type { HeroSlide } from "@low/fixtures";

// Re-export for convenience in showcases and pages.
export type { HeroSlide };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HeroCarouselProps {
  /** Ordered list of slides (up to 5 in the real client). */
  slides: HeroSlide[];
  /** Index of the currently visible slide (0-based). */
  activeIndex: number;
  /** Called when a dot is clicked — parent owns state. */
  onSlideChange: (index: number) => void;
  /** URL for the RP coin icon (caller-supplied from cdragon helper). */
  rpIconSrc?: string;
}

// ---------------------------------------------------------------------------
// HeroCarousel
// ---------------------------------------------------------------------------

/**
 * HeroCarousel renders the large cinematic hero panel in the Store FEATURED tab.
 *
 * Structure:
 * - Full-bleed splash art background.
 * - Bottom-left overlay: "NEW EPIC SKINS" label, skin-line name (display/3xl),
 *   subtitle text, and RP price.
 * - Bottom-right: dot navigation (one dot per slide; active dot gold-3, inactive blue-5).
 *
 * Presentational only. Auto-advance is NOT built in — parent supplies `activeIndex`.
 * Dimensions: 460×300px (fixed, matching the real client featured hero panel).
 */
export function HeroCarousel({
  slides,
  activeIndex,
  onSlideChange,
  rpIconSrc,
}: HeroCarouselProps) {
  const slide = slides[activeIndex] ?? slides[0];

  if (!slide) {
    return (
      <div
        className="relative overflow-hidden bg-blue-7 border border-gold-5"
        style={{ width: 460, height: 300 }}
        aria-label="Featured hero"
      />
    );
  }

  return (
    <div
      className="relative overflow-hidden bg-blue-7"
      style={{ width: 460, height: 300 }}
      aria-label={`Featured: ${slide.skinLine}`}
      role="region"
    >
      {/* Splash art */}
      <img
        src={slide.splashUrl}
        alt={slide.skinLine}
        width={460}
        height={300}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
      />

      {/* Cinematic gradient — darkens bottom so text is legible, lighter at top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(1,10,19,0.95) 0%, rgba(1,10,19,0.7) 35%, rgba(1,10,19,0.1) 75%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Left-side vignette — subtle depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(1,10,19,0.7) 0%, transparent 50%)",
        }}
        aria-hidden="true"
      />

      {/* Bottom-left overlay: label + skin-line name + subtitle + price */}
      <div className="absolute bottom-0 left-0 z-10 px-4 pb-4 flex flex-col gap-0.5">
        {/* "NEW EPIC SKINS" eyebrow label */}
        <span className="font-display text-xs uppercase tracking-widest text-gold-3">
          New Epic Skins
        </span>

        {/* Skin-line name — large display text */}
        <span className="font-display text-3xl uppercase tracking-wide text-gold-1 leading-tight">
          {slide.skinLine}
        </span>

        {/* Subtitle */}
        <span className="font-body text-[11px] text-grey-1 leading-snug max-w-[280px] line-clamp-2">
          {slide.subtitle}
        </span>

        {/* RP price row */}
        <div className="mt-1 flex items-center gap-1">
          {rpIconSrc && (
            <img src={rpIconSrc} alt="RP" width={12} height={12} aria-hidden="true" />
          )}
          <span className="font-display text-xs text-gold-2">
            {slide.rpPrice.toLocaleString("en-US")} RP
          </span>
        </div>
      </div>

      {/* Bottom-right: carousel dot navigation */}
      <div
        className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5"
        role="tablist"
        aria-label="Slide navigation"
      >
        {slides.map((s, i) => (
          <button
            key={s.skinLine + i}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Slide ${i + 1}: ${s.skinLine}`}
            onClick={() => onSlideChange(i)}
            className={[
              "h-2 w-2 cursor-pointer rounded-full transition-colors duration-150",
              i === activeIndex
                ? "bg-gold-3"
                : "bg-blue-5 hover:bg-gold-4",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
