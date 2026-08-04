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
 *   - Hero: 1280×535px desktop (aspect-[64/27]), 390×544px mobile (aspect-[195/272])
 *   - Control bar: 64px tall, sitting INSIDE the hero with bottom-edge 40px
 *     above the hero's bottom. Gutter: 40px desktop, 24px mobile.
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
 *
 * Franchise control-bar measurements (Playwright, 1280px):
 *   - Strip height: 64px
 *   - Tile width: 170px each
 *   - Left gutter: 40px (hero content + control bar both inset 40px from edge)
 *   - Background image stays FULL-BLEED (no gutter on the <img>)
 *   - Clip-path angle offset: 20px
 *   - First tile clip-path: polygon(0px 0px, 100% 0px, calc(100%-20px) 100%, 0px 100%) — square left edge
 *   - Other tiles:          polygon(20px 0px, 100% 0px, calc(100%-20px) 100%, 0px 100%) — parallelogram
 *   - Tile overlap (negative margin): -8px so parallelograms tessellate seamlessly
 *   - Active tile: bottom white underline bar (3px), full opacity
 *   - Inactive tile: 0.6 opacity on hover
 *   - Progress bar: runs across top of active tile (white), auto-advances with slide
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

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

/**
 * A single franchise entry for the hero control bar.
 * When `slideId` matches a slide's `id`, clicking the tile activates that slide.
 * When `slideId` is omitted (or no slide matches), `onSelectFranchise` is called
 * so the parent can route to a collection page.
 */
export interface MerchHeroFranchise {
  /** URL-safe slug, e.g. "league-of-legends". Passed to `onSelectFranchise`. */
  slug: string;
  /** Accessible label for the tile button. */
  label: string;
  /**
   * Logo rendered inside the tile. Typically one of the components from
   * `franchise-logos.tsx`, but any ReactNode is accepted.
   */
  logo: ReactNode;
  /**
   * CSS custom property name for the tile background, e.g. `"--color-merch-cat-lol"`.
   * Must exist in packages/tokens/src/merch.css.
   */
  colorVar: string;
  /**
   * Optional CSS custom property for logo/text color inside the tile.
   * Defaults to `"--color-merch-on-dark"` (white).
   * Use `"--color-merch-ink"` for tiles with a light background (e.g. esports cyan, 2XKO lime).
   */
  textColorVar?: string;
  /**
   * Optional slide id this tile selects when clicked.
   * If missing or no slide matches, the click triggers `onSelectFranchise(slug)`.
   */
  slideId?: string;
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
  /**
   * Franchise tiles for the control bar.
   * When provided, the control bar replaces the dot-nav at the hero's bottom.
   * When absent, the original dot-nav + arrow controls render as before.
   */
  franchises?: MerchHeroFranchise[];
  /**
   * Called when a franchise tile is clicked AND no matching slide was found
   * (or when slideId is omitted). The parent can route to a collection page.
   */
  onSelectFranchise?: (slug: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchHeroBanner — full-width hero carousel for the /merch homepage.
 * Aspect ratio ~64/27 (≈2.37) matching 1280×535 from the real store.
 * Art-forward: text overlay is optional; CTA defaults to white pill + black text.
 * Multi-slide: dot nav + ‹ › arrow controls (no-franchise mode).
 * Franchise mode: franchise control bar replaces dot-nav; tiles select slides.
 */
export function MerchHeroBanner({
  slides,
  autoPlayMs = 5000,
  ariaLabel = "Featured products",
  franchises,
  onSelectFranchise,
}: MerchHeroBannerProps) {
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  // Progress bar width (0–100) for the active tile in franchise mode
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasFranchises = !!franchises && franchises.length > 0;

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

  // Progress bar for franchise mode — counts from 0→100 over autoPlayMs
  useEffect(() => {
    if (!hasFranchises || !autoPlayMs || slides.length <= 1) return;
    progressRef.current = 0;
    setProgress(0);
    const step = 50; // ms per tick
    progressTimerRef.current = setInterval(() => {
      if (!pausedRef.current) {
        progressRef.current = Math.min(progressRef.current + (step / autoPlayMs) * 100, 100);
        setProgress(progressRef.current);
      }
    }, step);
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [active, autoPlayMs, hasFranchises, slides.length]);

  const slide: MerchHeroSlide | undefined = slides[active];
  if (!slide) return null;

  const currentSlide = slide;
  const isCenter = currentSlide.align === "center";
  const ctaVariant = currentSlide.ctaVariant ?? "light";
  const ctaCorner = currentSlide.ctaCorner ?? "center-left";
  const isBottomRight = ctaCorner === "bottom-right";

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

  function handleFranchiseClick(franchise: MerchHeroFranchise) {
    // Try to find a matching slide by slideId
    if (franchise.slideId) {
      const idx = slides.findIndex((s) => s.id === franchise.slideId);
      if (idx !== -1) {
        setActive(idx);
        pausedRef.current = false;
        return;
      }
    }
    // No slide match — let parent route to collection
    onSelectFranchise?.(franchise.slug);
  }

  // Whether any text overlay content is present
  const hasOverlay =
    !!(currentSlide.eyebrow || currentSlide.headline || currentSlide.body || currentSlide.ctaLabel);

  // Overlay position classes — mobile defaults to bottom-center, desktop follows ctaCorner
  // In franchise mode, content is inset ~40px from sides (matching the real store)
  const overlayPositionCls = isBottomRight
    ? "absolute bottom-4 right-0 left-0 flex flex-col items-center text-center md:bottom-6 md:right-10 md:left-auto md:items-end md:text-right"
    : isCenter
      ? "absolute inset-0 flex flex-col justify-end items-center px-5 py-6 text-center md:justify-center md:py-8"
      : "absolute inset-0 flex flex-col justify-end items-center px-4 py-6 text-center md:justify-center md:items-start md:px-10 md:py-12 md:text-left";

  return (
    <section
      aria-label={ariaLabel}
      className="relative w-full overflow-hidden aspect-[195/272] md:aspect-[64/27]"
      style={{ fontFamily: "var(--font-merch)" }}
    >
      {/* Background image — always full-bleed, no gutter */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={currentSlide.imageUrl}
        alt={currentSlide.imageAlt}
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
        draggable={false}
      />

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

      {/* ── Franchise Control Bar (replaces dot-nav when franchises provided) ── */}
      {hasFranchises ? (
        <div
          aria-label="Shop by franchise"
          role="navigation"
          className="absolute bottom-10 left-0 right-0 overflow-x-auto"
          style={{
            height: 64,
            /* Dark bg fills any gap behind tiles */
            backgroundColor: "var(--color-merch-hero-control-bar)",
            /* Horizontal scroll on mobile — hide scrollbar */
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Tile row — left-inset 24px mobile / 40px desktop, tiles overlap via negative margin */}
          <div
            className="flex h-full items-stretch pl-6 md:pl-10"
          >
            {franchises!.map((franchise, idx) => {
              const isFirst = idx === 0;
              // Active: any franchise whose slideId matches the current slide,
              // or — if none have slideIds — the franchise at position `active`.
              const hasSlideMapping = franchises!.some((f) => !!f.slideId);
              const isActive = hasSlideMapping
                ? franchise.slideId === currentSlide.id
                : idx === active % franchises!.length;
              const logoColor = franchise.textColorVar ?? "--color-merch-on-dark";

              // Clip-path: first tile has square left edge (90°), rest are parallelogram
              const clipPath = isFirst
                ? "polygon(0px 0px, 100% 0px, calc(100% - 20px) 100%, 0px 100%)"
                : "polygon(20px 0px, 100% 0px, calc(100% - 20px) 100%, 0px 100%)";

              return (
                <div
                  key={franchise.slug}
                  className="relative flex shrink-0 items-stretch"
                  /* Negative margin makes parallelograms tessellate seamlessly */
                  style={{ marginInlineEnd: -8 }}
                >
                  <button
                    type="button"
                    aria-label={franchise.label}
                    aria-pressed={isActive}
                    onClick={() => handleFranchiseClick(franchise)}
                    className="group relative flex h-full cursor-pointer items-center justify-center border-0 transition-opacity duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                    style={{
                      clipPath,
                      backgroundColor: `var(${franchise.colorVar})`,
                      color: `var(${logoColor})`,
                      minWidth: 170,
                      paddingInline: 24,
                      borderRadius: 0,
                      opacity: isActive ? 1 : 0.75,
                      outlineColor: `var(${logoColor})`,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.opacity = "0.75";
                      }
                    }}
                  >
                    {/* Logo */}
                    <span className="pointer-events-none flex items-center justify-center">
                      {franchise.logo}
                    </span>

                    {/* Active underline bar — bottom edge of tile */}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-0 right-0"
                        style={{
                          height: 3,
                          backgroundColor: "var(--color-merch-hero-tile-active-border)",
                        }}
                      />
                    )}

                    {/* Progress bar — top edge of active tile, fills over autoPlayMs */}
                    {isActive && autoPlayMs > 0 && slides.length > 1 && (
                      <>
                        {/* Track */}
                        <span
                          className="absolute left-0 right-0 top-0"
                          style={{
                            height: 3,
                            backgroundColor: "var(--color-merch-hero-progress-bg)",
                          }}
                        />
                        {/* Fill */}
                        <span
                          className="absolute left-0 top-0"
                          style={{
                            height: 3,
                            width: `${progress}%`,
                            backgroundColor: "var(--color-merch-hero-progress-bar)",
                            transition: "width 50ms linear",
                          }}
                        />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ── Legacy dot-nav (shown when no franchises prop) ── */
        <>
          {/* Arrow controls — visible when more than one slide */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer border-0 p-2 transition-opacity duration-150 hover:opacity-80"
                style={{
                  background: "var(--color-merch-overlay-soft)",
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
                  background: "var(--color-merch-overlay-soft)",
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
                        : "var(--color-merch-dot-inactive)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (i !== active) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "var(--color-merch-dot-inactive-hover)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (i !== active) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "var(--color-merch-dot-inactive)";
                    }
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
