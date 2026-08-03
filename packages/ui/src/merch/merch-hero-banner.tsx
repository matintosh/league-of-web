"use client";

/**
 * MerchHeroBanner — full-width homepage hero for the Riot merch store.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens
 * (add a token to @low/tokens if one is missing, sampled from the real store)
 * and a modern e-commerce layout. This is NOT the Hextech client — IGNORE the
 * client Hextech-only / no-default-Tailwind-palette guidance; still tokens-only
 * (no raw hex outside packages/tokens; NO hardcoded hex fallbacks in
 * var(--color-merch-*)), presentational (props in/callbacks out, NO fetching
 * in @low/ui, types from @low/fixtures — reuse the existing MerchProduct type;
 * product image URLs via championSplashUrl from the page, never fetched in
 * @low/ui), showcase server-safe (no 'use client'), SVG/gradient ids from useId.
 *
 * Measured from merch.riotgames.com (~1280px desktop):
 *   - Source images: 1280×535 px → aspect-ratio ~64/27 (≈2.37)
 *   - Background: full-bleed object-fit cover, no letter-box, no side padding
 *   - Text overlay: optional — art-forward slides carry branding in the image
 *   - Eyebrow: 13px, font-weight 600, letter-spacing 0.15em, uppercase, red
 *   - Headline: 40–48px, font-weight 800, line-height 1.1, uppercase, white
 *   - Body: 15px, font-weight 400, white at 0.85 opacity
 *   - CTA light (default): white bg (#fff = --color-merch-on-dark), black text
 *     (--color-merch-ink), border-radius 2px, padding 8px 8px 8px 16px,
 *     font-weight 400, font-size 16px, no text-transform
 *   - CTA red (alternate): red bg (--color-merch-red), white text, uppercase
 *   - Dots: 8px circles, gap 8px, red = active, faded white = inactive
 *   - Dots position: absolute bottom-center, bottom: 16px
 *   - Arrows: ‹ › side controls for multi-slide
 *   - Scrim: ~0.25 max opacity; art is typically pre-composed
 */

import { useEffect, useId, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single hero slide. */
export interface MerchHeroSlide {
  /** Unique key for the slide. */
  id: string;
  /** Full-bleed background image URL. */
  imageUrl: string;
  /** Alt text for the background image. */
  imageAlt: string;
  /** Optional eyebrow line above the headline. */
  eyebrow?: string;
  /**
   * Main headline text. When undefined the text overlay is suppressed and the
   * baked-in artwork carries the branding (art-forward mode).
   */
  headline?: string;
  /** Short body copy below the headline. */
  body?: string;
  /** CTA button label. */
  ctaLabel?: string;
  /** Called when the CTA button is clicked. */
  onCtaClick?: () => void;
  /** Text alignment for overlay: "left" | "center". Default "left". */
  align?: "left" | "center";
  /**
   * CTA visual style.
   * - "light" (default) — white bg + black text, radius 2px, sentence-case
   * - "red" — red bg + white text, uppercase, bold (legacy Riot red CTA)
   */
  ctaVariant?: "light" | "red";
  /**
   * Which corner the CTA block anchors to.
   * - "bottom-right" — bottom-right (MSI / featured slides)
   * - "center-left" (default) — vertically centered, left-aligned
   */
  ctaCorner?: "bottom-right" | "center-left";
}

export interface MerchHeroBannerProps {
  /** One or more slides. */
  slides: MerchHeroSlide[];
  /**
   * Auto-advance interval in ms; 0 = no auto-advance.
   * @default 5000
   */
  autoPlayMs?: number;
  /** Accessible label for the carousel landmark. */
  ariaLabel?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchHeroBanner — full-width hero carousel for the /merch homepage.
 * Aspect ratio ~64/27 (≈2.37) matching 1280×535 from the real store.
 * Art-forward: text overlay is optional; CTA defaults to white pill + black text.
 * Multi-slide: dot nav + ‹ › arrow controls.
 */
export function MerchHeroBanner({
  slides,
  autoPlayMs = 5000,
  ariaLabel = "Featured products",
}: MerchHeroBannerProps) {
  const [active, setActive] = useState(0);
  const gradId = useId();
  const pausedRef = useRef(false);

  // Auto-advance
  useEffect(() => {
    if (!autoPlayMs || slides.length <= 1) return;
    const timer = setInterval(() => {
      if (!pausedRef.current) {
        setActive((prev) => (prev + 1) % slides.length);
      }
    }, autoPlayMs);
    return () => clearInterval(timer);
  }, [autoPlayMs, slides.length]);

  const slide: MerchHeroSlide | undefined = slides[active];
  if (!slide) return null;

  const currentSlide = slide;
  const isCenter = currentSlide.align === "center";
  const ctaVariant = currentSlide.ctaVariant ?? "light";
  const ctaCorner = currentSlide.ctaCorner ?? "center-left";
  const isBottomRight = ctaCorner === "bottom-right";

  // Softened scrim — art is pre-composed; max ~0.25 opacity
  const scrimStyle: React.CSSProperties = isCenter
    ? {
        background: `radial-gradient(ellipse at center, rgba(0,0,0,0.22) 0%, transparent 70%)`,
      }
    : {
        background: `linear-gradient(to right, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.08) 60%, transparent 100%)`,
      };

  function handleCtaClick() {
    pausedRef.current = true;
    currentSlide.onCtaClick?.();
  }

  function goPrev() {
    setActive((prev) => (prev - 1 + slides.length) % slides.length);
    pausedRef.current = false;
  }

  function goNext() {
    setActive((prev) => (prev + 1) % slides.length);
    pausedRef.current = false;
  }

  // Whether any text overlay content is present
  const hasOverlay =
    !!(currentSlide.eyebrow || currentSlide.headline || currentSlide.body || currentSlide.ctaLabel);

  // Overlay position classes — mobile defaults to bottom-center, desktop follows ctaCorner
  const overlayPositionCls = isBottomRight
    ? "absolute bottom-4 right-0 left-0 flex flex-col items-center text-center md:bottom-6 md:right-8 md:left-auto md:items-end md:text-right"
    : isCenter
      ? "absolute inset-0 flex flex-col justify-end items-center px-5 py-6 text-center md:justify-center md:py-8"
      : "absolute inset-0 flex flex-col justify-end items-center px-4 py-6 text-center md:justify-center md:items-start md:px-10 md:py-12 md:text-left";

  return (
    <section
      aria-label={ariaLabel}
      className="relative w-full overflow-hidden aspect-[3/4] md:aspect-[64/27]"
      style={{ fontFamily: "var(--font-merch)" }}
    >
      {/* Hidden gradient def for SVG-based gradient ids if needed */}
      <svg width="0" height="0" aria-hidden className="absolute">
        <defs>
          <linearGradient id={`${gradId}-left`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(0,0,0,0.25)" />
            <stop offset="60%" stopColor="rgba(0,0,0,0.08)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={currentSlide.imageUrl}
        alt={currentSlide.imageAlt}
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
        draggable={false}
      />

      {/* Scrim overlay */}
      <div className="absolute inset-0" style={scrimStyle} aria-hidden />

      {/* Text / CTA overlay — suppressed when slide is art-forward (no text) */}
      {hasOverlay && (
        <div className={overlayPositionCls}>
          <div className={isCenter ? "max-w-xl" : isBottomRight ? "" : "max-w-xl"}>
            {currentSlide.eyebrow && (
              <p
                className="mb-2 text-[13px] font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--color-merch-red)" }}
              >
                {currentSlide.eyebrow}
              </p>
            )}
            {currentSlide.headline && (
              <h2
                className="text-4xl font-extrabold uppercase leading-[1.1] md:text-5xl"
                style={{ color: "var(--color-merch-on-dark)" }}
              >
                {currentSlide.headline}
              </h2>
            )}
            {currentSlide.body && (
              <p
                className="mt-3 text-[15px] font-normal"
                style={{ color: "var(--color-merch-on-dark)", opacity: 0.85 }}
              >
                {currentSlide.body}
              </p>
            )}
            {currentSlide.ctaLabel && (
              ctaVariant === "light" ? (
                /* Light CTA — white pill, black text, radius 2px, sentence-case */
                <button
                  type="button"
                  onClick={handleCtaClick}
                  className="mt-6 cursor-pointer border-0 text-[16px] font-normal transition-opacity duration-150 hover:opacity-80"
                  style={{
                    backgroundColor: "var(--color-merch-on-dark)",
                    color: "var(--color-merch-ink)",
                    padding: "8px 8px 8px 16px",
                    borderRadius: "2px",
                  }}
                >
                  {currentSlide.ctaLabel}
                </button>
              ) : (
                /* Red CTA — legacy Riot red, uppercase, bold */
                <button
                  type="button"
                  onClick={handleCtaClick}
                  className="mt-6 cursor-pointer border-0 text-[13px] font-bold uppercase tracking-[0.1em] transition-colors duration-150"
                  style={{
                    backgroundColor: "var(--color-merch-red)",
                    color: "var(--color-merch-on-dark)",
                    padding: "10px 28px",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "var(--color-merch-red-dark)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "var(--color-merch-red)";
                  }}
                >
                  {currentSlide.ctaLabel}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Arrow controls — visible when more than one slide */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer border-0 p-2 transition-opacity duration-150 hover:opacity-80"
            style={{
              background: "rgba(0,0,0,0.35)",
              color: "var(--color-merch-on-dark)",
              borderRadius: "2px",
              fontSize: "20px",
              lineHeight: 1,
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-0 p-2 transition-opacity duration-150 hover:opacity-80"
            style={{
              background: "rgba(0,0,0,0.35)",
              color: "var(--color-merch-on-dark)",
              borderRadius: "2px",
              fontSize: "20px",
              lineHeight: 1,
            }}
          >
            ›
          </button>
        </>
      )}

      {/* Carousel dot nav — hidden when only one slide */}
      {slides.length > 1 && (
        <div
          className="absolute bottom-4 left-0 right-0 flex justify-center gap-2"
          role="tablist"
          aria-label="Slide navigation"
        >
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Slide ${i + 1}`}
              onClick={() => {
                setActive(i);
                pausedRef.current = false;
              }}
              className="rounded-full border-0 p-0 transition-colors duration-150"
              style={{
                width: 8,
                height: 8,
                backgroundColor:
                  i === active
                    ? "var(--color-merch-red)"
                    : "rgba(255,255,255,0.35)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (i !== active) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "rgba(255,255,255,0.65)";
                }
              }}
              onMouseLeave={(e) => {
                if (i !== active) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "rgba(255,255,255,0.35)";
                }
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
