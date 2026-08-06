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
 * Measured from merch.riotgames.com (Playwright, 2026-08):
 *   Desktop (1280px):
 *     - Hero: 1280×348px  → aspect-[320/87]  (~3.68:1)
 *     - Franchise strip: sits ~83px BELOW the hero on the white page (white bg)
 *     - Franchise tiles: 64px tall, skewed parallelograms (skewX(-10deg))
 *     - Franchise tile radius: 2px (outer corners only)
 *     - "Shop All" end tile: 112×40 white, black Inter 16, pad 8px 8px 8px 16px
 *     - Franchise next-arrow: 40×40 circle, 1px --color-merch-strip-arrow-border
 *       transparent bg, at right of tile track
 *     - CTA: 239×50, riotSans 16px/600, 0.32px ls, #eb0029 bg, at (981,467)
 *     - Active tile: red underline at bottom edge
 *   Mobile (390px):
 *     - Hero image band: 390×374px (grew from 315; no caption panel below)
 *     - Franchise strip: white band, 24px inset, slanted parallelogram edges,
 *       white 62px circle '>' button overlapping right edge
 *     - Active tile: red underline segment
 *     - SHOP NOW CTA: 342×50 at x=24, clip-path corner notches top-right + bottom-left
 */

import React, { useEffect, useRef, useState, useId, type ReactNode } from "react";

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
   * - "red" — red bg + white text, uppercase, 16/600, 0.32px ls (239×50 desktop)
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
   * When provided, the control bar renders BELOW the hero image on the white page.
   * When absent, the original dot-nav + arrow controls render inside the hero.
   */
  franchises?: MerchHeroFranchise[];
  /**
   * Called when a franchise tile is clicked AND no matching slide was found
   * (or when slideId is omitted). The parent can route to a collection page.
   */
  onSelectFranchise?: (slug: string) => void;
}

// ---------------------------------------------------------------------------
// SVG icons (inline, ids from useId to avoid collisions)
// ---------------------------------------------------------------------------

/** Chevron pointing left, 10×16 (stroke). */
function ChevronLeft() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true">
      <path d="M8 2L2 8L8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Chevron pointing right, 10×16 (stroke). */
function ChevronRight() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true">
      <path d="M2 2L8 8L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchHeroBanner — full-width hero carousel for the /merch homepage.
 *
 * Desktop (1280px): hero 1280×348 (aspect-[320/87]); franchise strip sits ~83px
 * below hero on white page (64px-tall parallelogram tiles); single 40×40 circle
 * next-arrow at right of tile track; 239×50 red CTA at hero bottom-right (981,467);
 * red underline on active tile.
 *
 * Mobile (390px): 390×374 bg image band (no caption panel below); white franchise
 * band with 24px inset, slanted parallelogram tiles, white 62px circle '>' button;
 * 342×50 SHOP NOW with corner notches (clip-path).
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
  // Progress (0–100) for the active franchise tile's animated line
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stripId = useId();

  const hasFranchises = !!franchises && franchises.length > 0;

  // Auto-advance slides
  useEffect(() => {
    if (!autoPlayMs || slides.length <= 1) return;
    const timer = setInterval(() => {
      if (!pausedRef.current) {
        setActive((prev) => (prev + 1) % slides.length);
      }
    }, autoPlayMs);
    return () => clearInterval(timer);
  }, [autoPlayMs, slides.length]);

  // Progress indicator — resets on each slide change, counts 0→100 over autoPlayMs
  useEffect(() => {
    if (!hasFranchises || !autoPlayMs || slides.length <= 1) return;
    progressRef.current = 0;
    setProgress(0);
    const step = 50; // ms per tick
    progressTimerRef.current = setInterval(() => {
      if (!pausedRef.current) {
        progressRef.current = Math.min(
          progressRef.current + (step / autoPlayMs) * 100,
          100,
        );
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
    if (franchise.slideId) {
      const idx = slides.findIndex((s) => s.id === franchise.slideId);
      if (idx !== -1) {
        setActive(idx);
        pausedRef.current = false;
        return;
      }
    }
    onSelectFranchise?.(franchise.slug);
  }

  // Whether any text overlay content is present
  const hasOverlay = !!(
    currentSlide.eyebrow ||
    currentSlide.headline ||
    currentSlide.body ||
    currentSlide.ctaLabel
  );

  // Overlay position — desktop: follows ctaCorner; mobile: hidden (CTA moves below strip)
  const overlayPositionCls = isBottomRight
    ? "absolute bottom-4 right-0 left-0 flex flex-col items-center text-center md:bottom-6 md:right-10 md:left-auto md:items-end md:text-right"
    : isCenter
      ? "absolute inset-0 flex flex-col justify-end items-center px-5 py-6 text-center md:justify-center md:py-8"
      : "absolute inset-0 flex flex-col justify-end items-center px-4 py-6 text-center md:justify-center md:items-start md:px-10 md:py-12 md:text-left";

  // ── Franchise-mode active detection ──────────────────────────────────────
  const hasSlideMapping = hasFranchises && franchises!.some((f) => !!f.slideId);

  // ── Red CTA label (franchise mode always uses slide ctaLabel or "SHOP NOW") ──
  const mobileCTALabel = currentSlide.ctaLabel ?? "SHOP NOW";

  return (
    /*
     * Outer wrapper groups hero + franchise strip so the strip sits BELOW
     * the hero image on the white page (not overlaid).
     */
    <div style={{ fontFamily: "var(--font-merch)" }}>
      {/* ================================================================== */}
      {/* Hero image section                                                  */}
      {/* ================================================================== */}
      <section
        aria-label={ariaLabel}
        className={[
          "relative w-full overflow-hidden",
          /*
           * Mobile (< md): 374px height — full photo band, no caption below.
           * Desktop (≥ md): aspect-[320/87] → 1280×348.
           */
          "h-[374px] md:h-auto md:aspect-[320/87]",
        ].join(" ")}
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

        {/* ── Desktop text / CTA overlay (hidden on mobile in franchise mode) ── */}
        {hasOverlay && !hasFranchises && (
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
                  <button
                    type="button"
                    onClick={handleCtaClick}
                    className="mt-6 cursor-pointer border-0 uppercase transition-colors duration-150"
                    style={{
                      backgroundColor: "var(--color-merch-red)",
                      color: "var(--color-merch-on-dark)",
                      width: 239,
                      height: 50,
                      fontSize: "16px",
                      fontWeight: 600,
                      letterSpacing: "0.32px",
                      padding: "0 16px",
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

        {/*
         * ── Franchise mode: desktop CTA (239×50 red) ──
         * Real site: 239×50 at (981,467) on a 1280px-wide, 348px-tall hero.
         * x=981 → right = 1280-981-239 = 60px from right edge → right-[60px].
         * y=467 from page top; hero bottom ~478 → 11px from hero bottom → bottom-[11px].
         * Hidden on mobile — mobile CTA renders below the franchise strip.
         */}
        {hasFranchises && currentSlide.ctaLabel && (
          <div
            className="absolute hidden md:block"
            style={{ bottom: 11, right: 60 }}
          >
            <button
              type="button"
              onClick={handleCtaClick}
              className="cursor-pointer border-0 uppercase transition-colors duration-150"
              style={{
                backgroundColor: "var(--color-merch-red)",
                color: "var(--color-merch-on-dark)",
                width: 239,
                height: 50,
                fontSize: "16px",
                fontWeight: 600,
                letterSpacing: "0.32px",
                padding: "0 16px",
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
              {mobileCTALabel}
            </button>
          </div>
        )}

        {/* ── Legacy dot-nav (shown when no franchises prop) ── */}
        {!hasFranchises && slides.length > 1 && (
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
          </>
        )}
      </section>

      {/* ================================================================== */}
      {/* Franchise strip — sits ~83px BELOW the hero on the white page       */}
      {/* REAL: white bg, 64px-tall parallelogram tiles (2px radius corners), */}
      {/* red underline on active tile, single 40×40 circle next-arrow        */}
      {/* Mobile: white band, 24px inset, slanted tiles, 62px circle '>'      */}
      {/* ================================================================== */}
      {hasFranchises && (
        <div
          aria-label="Shop by franchise"
          role="navigation"
          className="relative w-full"
          style={{
            backgroundColor: "var(--color-merch-bg)",
            /* ~83px gap below the hero before the strip */
            marginTop: 83,
          }}
        >
          {/*
           * Progress line — 2px animated fill above the franchise strip.
           * Tracks auto-advance of the active tile. Full-width track; fill
           * grows left→right over autoPlayMs.
           */}
          {autoPlayMs > 0 && slides.length > 1 && (
            <div
              className="absolute left-0 right-0 top-0"
              style={{ height: 2, backgroundColor: "var(--color-merch-hero-progress-bg)" }}
            >
              <div
                style={{
                  height: 2,
                  width: `${progress}%`,
                  backgroundColor: "var(--color-merch-hero-progress-bar)",
                  transition: "width 50ms linear",
                }}
              />
            </div>
          )}

          {/*
           * Strip layout: tile track + next-arrow on desktop.
           * Mobile: white band with 24px side padding, tiles inset,
           *         62px white circle '>' button overlaps right edge.
           */}
          <div className="relative flex items-center">
            {/*
             * Tile track — horizontally scrollable on mobile.
             * Desktop: flex row of 64px parallelogram tiles.
             * Mobile: 24px left padding, scrollable tiles, 62px right gutter
             *         for the circle arrow.
             * scrollbar-none hides native scrollbar.
             */}
            <div
              id={`${stripId}-track`}
              className="flex flex-1 items-stretch overflow-x-auto"
              style={{
                height: 64,
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                /* Mobile: 24px left inset, 86px right for circle arrow */
                paddingLeft: 0,
              } as React.CSSProperties}
            >
              {franchises!.map((franchise, idx) => {
                const isFirst = idx === 0;
                const isActive = hasSlideMapping
                  ? franchise.slideId === currentSlide.id
                  : idx === active % franchises!.length;
                const logoColor = franchise.textColorVar ?? "--color-merch-on-dark";

                /*
                 * Desktop tile shape: skewed parallelograms, 64px tall, 2px radius.
                 * First tile: square left edge (no left-skew offset).
                 * Remaining tiles: 20px skew offset on left edge, tessellate.
                 * Mobile: rectangular tiles (no skew) to avoid clip overflow.
                 *
                 * Note: clip-path and border-radius interact — radius applied via
                 * a wrapping approach; clip-path overrides radius on most browsers.
                 * We keep radius on the first/last tile fallback and use clip-path
                 * for the inner skew shape.
                 */
                return (
                  <button
                    key={franchise.slug}
                    type="button"
                    aria-label={franchise.label}
                    aria-pressed={isActive}
                    onClick={() => handleFranchiseClick(franchise)}
                    className={[
                      "group relative flex shrink-0 cursor-pointer items-center justify-center",
                      "border-0 transition-opacity duration-150 focus-visible:outline focus-visible:outline-2",
                      "focus-visible:outline-offset-[-2px]",
                      /* Skewed parallelogram on desktop, straight on mobile */
                      isFirst
                        ? "md:[clip-path:polygon(0px_0px,100%_0px,calc(100%-20px)_100%,0px_100%)]"
                        : "md:[clip-path:polygon(20px_0px,100%_0px,calc(100%-20px)_100%,0px_100%)]",
                    ].join(" ")}
                    style={{
                      backgroundColor: `var(${franchise.colorVar})`,
                      color: `var(${logoColor})`,
                      /* 147px mobile, 170px desktop — matches real measurements */
                      minWidth: "clamp(100px, 30vw, 170px)",
                      paddingInline: 24,
                      borderRadius: 2,
                      opacity: isActive ? 1 : 0.75,
                      outlineColor: `var(${logoColor})`,
                      height: 64,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLButtonElement).style.opacity = "0.75";
                    }}
                  >
                    {/* Logo */}
                    <span className="pointer-events-none flex items-center justify-center">
                      {franchise.logo}
                    </span>

                    {/* Active underline bar — red, bottom edge of tile (3px) */}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-0 right-0"
                        style={{
                          height: 3,
                          backgroundColor: "var(--color-merch-red)",
                        }}
                      />
                    )}
                  </button>
                );
              })}

              {/*
               * "Shop All" end tile — 112px wide, white bg, black text, 2px radius.
               * Inter 16px (not riotSans), pad 8px 8px 8px 16px.
               * Desktop only (hidden on mobile to avoid scroll overflow).
               */}
              <button
                type="button"
                aria-label="Shop All"
                onClick={() => onSelectFranchise?.("all")}
                className="hidden shrink-0 cursor-pointer items-center border-0 transition-opacity duration-150 hover:opacity-80 md:flex"
                style={{
                  backgroundColor: "var(--color-merch-bg)",
                  color: "var(--color-merch-ink)",
                  width: 112,
                  height: 40,
                  fontSize: 16,
                  fontFamily: "var(--font-merch)",
                  fontWeight: 400,
                  padding: "8px 8px 8px 16px",
                  borderRadius: 2,
                  alignSelf: "center",
                  marginLeft: 8,
                }}
              >
                Shop All
              </button>
            </div>

            {/*
             * Desktop next-arrow — 40×40 circle, 1px --color-merch-strip-arrow-border
             * border, transparent bg. Positioned at right of the tile track.
             * Hidden on mobile (mobile uses the white circle '>' button below).
             */}
            {slides.length > 1 && (
              <button
                type="button"
                aria-label="Next slide"
                onClick={goNext}
                className="hidden shrink-0 cursor-pointer items-center justify-center rounded-full border transition-opacity duration-150 hover:opacity-80 md:flex"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "transparent",
                  borderColor: "var(--color-merch-strip-arrow-border)",
                  color: "var(--color-merch-ink)",
                  marginLeft: 8,
                }}
              >
                <ChevronRight />
              </button>
            )}
          </div>

          {/*
           * Mobile flanking arrows — white 62px circles with chevrons.
           * Real @390: white circle '>' button overlapping right edge of white strip.
           * Left arrow at x=24 inset; right arrow at x≈304 (overlaps strip right).
           * Hidden on desktop.
           */}
          {slides.length > 1 && (
            <div className="absolute inset-y-0 right-0 flex items-center md:hidden">
              <button
                type="button"
                aria-label="Next slide"
                onClick={goNext}
                className="flex cursor-pointer items-center justify-center rounded-full border-0 transition-opacity duration-150 hover:opacity-80"
                style={{
                  width: 62,
                  height: 62,
                  backgroundColor: "var(--color-merch-on-dark)",
                  color: "var(--color-merch-ink)",
                  /*
                   * No negative margin — the 62px circle sits flush with the
                   * strip's right edge. A negative margin would push the button
                   * outside the document width, causing scrollWidth > viewport
                   * (8px overflow at 390). The right-0 position already gives
                   * the intended "overlapping right edge" look.
                   */
                  boxShadow: "0 2px 8px var(--color-merch-overlay-soft)",
                }}
              >
                <ChevronRight />
              </button>
            </div>
          )}
          {slides.length > 1 && (
            <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={goPrev}
                className="flex cursor-pointer items-center justify-center rounded-full border-0 transition-opacity duration-150 hover:opacity-80"
                style={{
                  width: 62,
                  height: 62,
                  backgroundColor: "var(--color-merch-on-dark)",
                  color: "var(--color-merch-ink)",
                  marginLeft: -8,
                  boxShadow: "0 2px 8px var(--color-merch-overlay-soft)",
                }}
              >
                <ChevronLeft />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================================================================== */}
      {/* Mobile full-width SHOP NOW — sits below the franchise strip         */}
      {/* REAL: 342×50 at x=24 (24px gutters), 16/600/0.32px, red bg,       */}
      {/* clip-path corner notches: top-right + bottom-left (~20px cut).     */}
      {/* Hidden on desktop (≥md) — desktop uses the overlaid 239×50 CTA.   */}
      {/* ================================================================== */}
      {hasFranchises && currentSlide.ctaLabel && (
        <div className="block px-6 pt-3 md:hidden">
          <button
            type="button"
            onClick={handleCtaClick}
            className="w-full cursor-pointer border-0 uppercase transition-colors duration-150"
            style={{
              backgroundColor: "var(--color-merch-red)",
              color: "var(--color-merch-on-dark)",
              height: 50,
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: "0.32px",
              /*
               * Corner notches: top-right + bottom-left (~20px diagonal cut).
               * Real site uses an angled clip-path on mobile SHOP NOW button.
               */
              clipPath:
                "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
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
            {mobileCTALabel}
          </button>
        </div>
      )}
    </div>
  );
}
