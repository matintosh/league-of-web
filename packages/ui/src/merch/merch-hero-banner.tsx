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
 *   - Source images: 3296×1030 px → aspect-ratio ~16/5 (≈3296/1030)
 *   - Background: full-bleed object-fit cover, no letter-box, no side padding
 *   - Text overlay: left or center; semi-transparent dark scrim behind text
 *   - Eyebrow: 13px, font-weight 600, letter-spacing 0.15em, uppercase, red
 *   - Headline: 40–48px, font-weight 800, line-height 1.1, uppercase, white
 *   - Body: 15px, font-weight 400, white at 0.85 opacity
 *   - CTA: red bg, white text, 10px 28px, 13px, 700 weight, uppercase
 *   - Dots: 8px circles, gap 8px, red = active, faded white = inactive
 *   - Dots position: absolute bottom-center, bottom: 16px
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
  /** Main headline text. */
  headline?: string;
  /** Short body copy below the headline. */
  body?: string;
  /** CTA button label. */
  ctaLabel?: string;
  /** Called when the CTA button is clicked. */
  onCtaClick?: () => void;
  /** Text alignment for overlay: "left" | "center". Default "left". */
  align?: "left" | "center";
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
 * Aspect ratio ~16/5 matching the 3296×1030 source images from the real store.
 * Auto-advances through slides; CTA click pauses auto-advance.
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

  // slide is narrowed to MerchHeroSlide from here on
  const currentSlide = slide;
  const isCenter = currentSlide.align === "center";

  // Scrim gradient per alignment
  const scrimStyle: React.CSSProperties = isCenter
    ? {
        background: `radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, transparent 70%)`,
      }
    : {
        background: `linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)`,
      };

  function handleCtaClick() {
    pausedRef.current = true;
    currentSlide.onCtaClick?.();
  }

  return (
    <section
      aria-label={ariaLabel}
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: "16 / 5", fontFamily: "var(--font-merch)" }}
    >
      {/* Hidden gradient def for SVG-based gradient ids if needed */}
      <svg width="0" height="0" aria-hidden className="absolute">
        <defs>
          <linearGradient id={`${gradId}-left`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
            <stop offset="60%" stopColor="rgba(0,0,0,0.2)" />
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

      {/* Text overlay */}
      {(currentSlide.eyebrow || currentSlide.headline || currentSlide.body || currentSlide.ctaLabel) && (
        <div
          className={`absolute inset-0 flex flex-col justify-center ${
            isCenter ? "items-center px-5 py-8 text-center" : "items-start px-10 py-12"
          }`}
        >
          <div className="max-w-xl">
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
            )}
          </div>
        </div>
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
