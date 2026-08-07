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
 *     - Hero: 1280×348px → aspect-[1280/348]; inset on campaign purple page bg
 *     - Hero + franchise zone: y=130→619 (strip at y=579 → 83px below hero)
 *     - Franchise strip: 40px left inset (matches 40px page gutter)
 *     - Franchise tiles: 64px tall, parallelogram clip-path (20px skew)
 *     - First tile: square left edge polygon(0,0,100%,0,calc(100%-20px),100%,0,100%)
 *     - Rest: polygon(20px,0,100%,0,calc(100%-20px),100%,0,100%) — 10px overlap
 *     - Tile width: 147px fixed; pitch: 137px (10px overlap from skew)
 *     - "Shop All" end tile: 112×40 white, black Inter 16, pad 8px 8px 8px 16px
 *     - Franchise next-arrow: 40×40 circle, 1px --color-merch-border-light border,
 *       transparent bg, at right of tile track
 *     - CTA: 239×50, riotSans 16/600, lh 18px, 0.32px ls, #eb0029 bg, at (981,467)
 *       label: "SHOP NOW" (uppercase); bottom=0 flush with hero bottom
 *     - Active tile: red partial underline segment; inactive: white-wash overlay
 *   Mobile (390px):
 *     - Hero: TWO layers — full-bleed bg img 390×315.5 at y=130 PLUS inset
 *       packshot 342×342 at (24,162); art ends y≈504, 16px gap to strip at y=520
 *     - Franchise strip: white band, 24px inset, 147×64 parallelogram tiles,
 *       ONE 40×40 outline ring '>' arrow at (326,532); no left arrow at scroll start
 *     - Active tile: red partial underline segment; inactive: white-wash overlay
 *     - Shop Now CTA: 342×50 at x=24, uppercase, lh 18px, clip-path corner notches
 *
 * Responsive breakpoints use scoped <style> blocks (not arbitrary Tailwind
 * breakpoint classes like max-[639px]:hidden) — Tailwind's scanner may not emit
 * those classes. See merch-search-hero.tsx / merch-collab-carousel.tsx for
 * the same pattern.
 */

import React, { useEffect, useRef, useState, useId, type ReactNode } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single hero slide. */
export interface MerchHeroSlide {
  /** Unique key for the slide. */
  id: string;
  /** Full-bleed background image URL (desktop AND mobile bg layer). */
  imageUrl: string;
  /**
   * Optional mobile-specific background crop URL (390×315.5 band).
   * When provided, renders as the full-bleed bg layer on mobile instead of
   * `imageUrl`. Real site: tighter portrait/square crop of campaign art.
   */
  mobileImageUrl?: string;
  /**
   * Optional mobile inset packshot URL (342×342 square at x=24,y=162).
   * Real @390 composition: bg band + this square packshot layered on top.
   * When omitted, mobile falls back to a single object-cover crop of imageUrl.
   */
  mobilePackshotUrl?: string;
  /** Alt text for the background image. */
  imageAlt: string;
  /** Alt text for the mobile packshot (defaults to imageAlt). */
  mobilePackshotAlt?: string;
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
   * - "light" (default) — white bg + black text, radius 2px
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
 * Desktop (1280px): hero 1280×348 (aspect-[1280/348]); franchise strip sits
 * 83px below hero on white page (64px-tall 147px-wide parallelogram tiles at
 * 137px pitch); 40px strip left inset; single 40×40 outline circle next-arrow;
 * 239×50 red "SHOP NOW" (uppercase) CTA bottom=0 right=60; red partial underline
 * on active tile; inactive tiles white-washed. Hero inset on purple campaign bg.
 *
 * Mobile (390px): TWO hero layers — full-bleed bg 390×315.5 + inset 342×342
 * packshot at (24,162); 16px gap to white franchise strip at y=520; strip 24px
 * left inset; 147×64 parallelogram tiles (same clip-path as desktop); ONE 40×40
 * outline ring arrow at (326,532) — hidden at scroll start, shown after scroll;
 * 342×50 "SHOP NOW" (uppercase) CTA with clip-path corner notches.
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
  // Fixed scope attr — one MerchHeroBanner per page; fixed attr avoids useId casing issues
  const scopeAttr = "data-merch-hero-banner";
  // Track scroll offset to show/hide left arrow at scroll start
  const [trackScrollLeft, setTrackScrollLeft] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

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

  // Track scroll position to show/hide left arrow
  function handleTrackScroll() {
    if (trackRef.current) {
      setTrackScrollLeft(trackRef.current.scrollLeft);
    }
  }

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

  // Overlay position — desktop: follows ctaCorner
  const overlayPositionCls = isBottomRight
    ? "absolute bottom-4 right-0 left-0 flex flex-col items-center text-center md:bottom-6 md:right-10 md:left-auto md:items-end md:text-right"
    : isCenter
      ? "absolute inset-0 flex flex-col justify-end items-center px-5 py-6 text-center md:justify-center md:py-8"
      : "absolute inset-0 flex flex-col justify-end items-center px-4 py-6 text-center md:justify-center md:items-start md:px-10 md:py-12 md:text-left";

  // ── Franchise-mode active detection ──────────────────────────────────────
  const hasSlideMapping = hasFranchises && franchises!.some((f) => !!f.slideId);

  // ── CTA label (franchise mode: use slide ctaLabel; fallback "SHOP NOW") ──
  const mobileCTALabel = currentSlide.ctaLabel ?? "SHOP NOW";

  // ── Mobile packshot composition ──────────────────────────────────────────
  const hasMobilePackshot = hasFranchises && !!currentSlide.mobilePackshotUrl;

  return (
    /*
     * Outer wrapper groups hero + franchise strip so the strip sits BELOW
     * the hero image on the white page (not overlaid).
     *
     * Desktop: the hero sits on the campaign's purple page background
     * (--color-merch-hero-campaign-bg) which shows as inset side margins,
     * matching the real site's "purple checkered set" frame at 1280px.
     * Mobile: purple bg is below the art section — not visible.
     */
    <div style={{ fontFamily: "var(--font-merch)" }} data-merch-hero-banner="">
      {/*
       * Scoped responsive styles.
       * Using a <style> block + real @media queries avoids the Tailwind
       * arbitrary-breakpoint scanner issue (max-[639px]:hidden / min-[640px]:hidden
       * may not be emitted, causing double-render at certain viewports).
       *
       * Hero heights:
       *   Desktop (≥640): 348px (measured 1280×348 from real site)
       *   Mobile (<640):  315.5px (measured 390×315.5 bg band)
       *
       * Mobile hero composition: bg band + inset 342×342 packshot layer.
       * Desktop hero composition: single object-cover image.
       *
       * Strip left inset:
       *   Desktop (≥640): 40px (matches 40px page gutter)
       *   Mobile (<640):  24px (matches 24px mobile gutter)
       *
       * Tile width: 147px fixed at all viewports (parallelogram clip-path).
       *
       * Arrow visibility:
       *   Desktop: right outline arrow only (in strip flex row); no mobile arrows
       *   Mobile: single right 40×40 outline ring; left hidden at scroll start
       */}
      <style>{`
        [${scopeAttr}] .hero-frame {
          background-color: var(--color-merch-hero-campaign-bg);
        }
        [${scopeAttr}] .hero-section {
          position: relative;
          width: 100%;
          overflow: hidden;
          /* Mobile: 315.5px bg band height */
          height: 315.5px;
        }
        /* Mobile hero: bg fills full band; packshot is an inset layer */
        [${scopeAttr}] .hero-img-desktop { display: none; }
        [${scopeAttr}] .hero-img-mobile  { display: block; }
        [${scopeAttr}] .hero-packshot    { display: block; }
        [${scopeAttr}] .franchise-cta-desktop { display: none; }
        [${scopeAttr}] .franchise-cta-mobile  { display: block; }
        [${scopeAttr}] .strip-arrow-desktop   { display: none; }
        [${scopeAttr}] .strip-arrow-mobile    { display: flex; }
        [${scopeAttr}] .strip-arrow-mobile-left { display: flex; }
        [${scopeAttr}] .strip-shop-all       { display: none; }
        [${scopeAttr}] .strip-track {
          padding-left: 24px;
          /* right gutter for the 40px arrow */
          padding-right: 50px;
        }
        [${scopeAttr}] .franchise-tile {
          /* 147px fixed width at all viewports — matching measured real site */
          min-width: 147px;
          max-width: 147px;
          width: 147px;
          /* pitch 137px = 147 - 10px overlap from 20px skew; negative margin */
          margin-right: -10px;
        }
        [${scopeAttr}] .franchise-tile:last-of-type {
          margin-right: 0;
        }
        [${scopeAttr}] .tile-washout {
          /* White-wash overlay on inactive tiles — semi-transparent white scrim */
          position: absolute;
          inset: 0;
          background-color: var(--color-merch-tile-inactive-wash);
          pointer-events: none;
        }
        [${scopeAttr}] .tile-active-bar {
          /* Partial red underline — shorter than full width, centered */
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 3px;
          background-color: var(--color-merch-red);
        }

        @media (min-width: 640px) {
          [${scopeAttr}] .hero-section {
            height: auto;
            /* Desktop: 1280×348 — aspect-ratio enforces correct height */
            aspect-ratio: 1280 / 348;
          }
          [${scopeAttr}] .hero-img-desktop { display: block; }
          [${scopeAttr}] .hero-img-mobile  { display: none; }
          [${scopeAttr}] .hero-packshot    { display: none; }
          [${scopeAttr}] .franchise-cta-desktop { display: block; }
          [${scopeAttr}] .franchise-cta-mobile  { display: none; }
          [${scopeAttr}] .strip-arrow-desktop   { display: flex; }
          [${scopeAttr}] .strip-arrow-mobile    { display: none; }
          [${scopeAttr}] .strip-arrow-mobile-left { display: none; }
          [${scopeAttr}] .strip-shop-all       { display: flex; }
          [${scopeAttr}] .strip-track {
            /* Desktop: 40px left inset (matches 40px page gutter) */
            padding-left: 40px;
            padding-right: 0;
          }
          [${scopeAttr}] .franchise-tile {
            /* Desktop: same 147px fixed width */
            min-width: 147px;
            max-width: 147px;
            width: 147px;
          }
        }
      `}</style>

      {/* ================================================================== */}
      {/* Hero image section                                                  */}
      {/* ================================================================== */}
      {/*
       * Campaign frame — purple bg shows as side margin frame on desktop.
       * On mobile the image fills the full width so the bg isn't visible.
       */}
      <div className="hero-frame">
        <section
          aria-label={ariaLabel}
          className="hero-section"
        >

          {/*
           * Desktop background image — single object-cover.
           * Shown only on ≥640 (controlled by hero-img-desktop class).
           */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentSlide.imageUrl}
            alt={currentSlide.imageAlt}
            className="hero-img-desktop absolute inset-0 h-full w-full object-cover object-center"
            loading="eager"
            draggable={false}
          />

          {/*
           * Mobile background band — 390×315.5.
           * Full-bleed bg layer; the packshot is layered on top.
           * Uses mobileImageUrl when supplied (tighter portrait crop),
           * otherwise falls back to imageUrl.
           */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentSlide.mobileImageUrl ?? currentSlide.imageUrl}
            alt={currentSlide.imageAlt}
            className="hero-img-mobile absolute inset-0 h-full w-full object-cover object-center"
            loading="eager"
            draggable={false}
          />

          {/*
           * Mobile packshot inset — 342×342 square at (24, 32) within the band.
           * Real @390: inset square packshot sits on top of the bg band.
           * y=32 within the 315.5px band (162−130=32px from band top).
           * Only rendered when mobilePackshotUrl is supplied.
           */}
          {hasMobilePackshot && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={currentSlide.mobilePackshotUrl}
              alt={currentSlide.mobilePackshotAlt ?? currentSlide.imageAlt}
              className="hero-packshot absolute object-cover"
              style={{
                left: 24,
                top: 32,
                width: 342,
                height: 342,
              }}
              loading="eager"
              draggable={false}
            />
          )}

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
                        textTransform: "uppercase",
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
           * ── Franchise mode: desktop CTA (239×50 red, uppercase "SHOP NOW") ──
           * Real site: 239×50 at x=981, y=467 on a 1280px-wide hero.
           * x=981 → right = 1280-981-239 = 60px → right: 60px.
           * y=467, hero height=348, hero top=130 →
           *   CTA bottom = hero top + hero height - (y - hero top) - cta height
           *   = 130 + 348 - (467-130) - 50 = 478 - 337 - 50 = -9? No:
           *   bottom from hero bottom = hero_h - (y - hero_top) - cta_h = 348 - 337 - 50 = -39
           * Real measured: CTA bottom = 0 flush with hero bottom.
           * bottom=0 so the CTA box bottom sits flush with the hero bottom.
           * Shown only on ≥640 (franchise-cta-desktop class).
           */}
          {hasFranchises && currentSlide.ctaLabel && (
            <div
              className="franchise-cta-desktop absolute"
              style={{ bottom: 0, right: 60 }}
            >
              <button
                type="button"
                onClick={handleCtaClick}
                className="cursor-pointer border-0 transition-colors duration-150"
                style={{
                  backgroundColor: "var(--color-merch-red)",
                  color: "var(--color-merch-on-dark)",
                  width: 239,
                  height: 50,
                  fontSize: "16px",
                  fontWeight: 600,
                  lineHeight: "18px",
                  letterSpacing: "0.32px",
                  padding: "0 16px",
                  textTransform: "uppercase",
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
      </div>{/* /campaign frame */}

      {/* ================================================================== */}
      {/* Franchise strip — sits ~83px BELOW the hero on the white page       */}
      {/* Desktop: 40px left inset, 64px-tall parallelogram tiles (147×64),  */}
      {/* 10px overlap pitch (137px), red partial underline on active tile,  */}
      {/* inactive tiles white-washed, single 40×40 outline circle arrow.    */}
      {/* Mobile: 24px left inset, same 147×64 tiles, 40×40 outline arrow,  */}
      {/* left arrow hidden at scroll start (trackScrollLeft === 0).         */}
      {/* ================================================================== */}
      {hasFranchises && (
        <div
          aria-label="Shop by franchise"
          role="navigation"
          className="relative w-full"
          style={{
            backgroundColor: "var(--color-merch-bg)",
            /* ~83px gap below the hero before the strip (matches real 579-348-130=101? real: 519-388-130=1 → strip y=519 desktop) */
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
           * Strip layout: tile track + desktop next-arrow.
           * Desktop: flex row; arrow sits at right end.
           * Mobile: relative container; arrow is absolute-positioned at right.
           */}
          <div className="relative flex items-center">
            {/*
             * Tile track — horizontally scrollable.
             * scrollbar-none hides native scrollbar.
             * Left inset: 24px mobile, 40px desktop (via strip-track scoped class).
             * Right padding on mobile: 50px to leave room for the 40px arrow.
             */}
            <div
              ref={trackRef}
              id={`${stripId}-track`}
              className="strip-track flex flex-1 items-stretch overflow-x-auto"
              style={{
                height: 64,
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              } as React.CSSProperties}
              onScroll={handleTrackScroll}
            >
              {franchises!.map((franchise, idx) => {
                const isFirst = idx === 0;
                const isActive = hasSlideMapping
                  ? franchise.slideId === currentSlide.id
                  : idx === active % franchises!.length;
                const logoColor = franchise.textColorVar ?? "--color-merch-on-dark";

                /*
                 * Tile shape: parallelogram at ALL breakpoints.
                 * clip-path: first tile has square left edge;
                 *            all others have 20px skew on both edges.
                 *
                 * polygon points (first tile):
                 *   0,0 → 100%,0 → calc(100%-20px),100% → 0,100%
                 * polygon points (other tiles):
                 *   20px,0 → 100%,0 → calc(100%-20px),100% → 0,100%
                 *
                 * Note: clip-path replaces border-radius for the skew shape.
                 * No rounded corners on tiles.
                 */
                const clipPath = isFirst
                  ? "polygon(0px 0px, 100% 0px, calc(100% - 20px) 100%, 0px 100%)"
                  : "polygon(20px 0px, 100% 0px, calc(100% - 20px) 100%, 0px 100%)";

                return (
                  <button
                    key={franchise.slug}
                    type="button"
                    aria-label={franchise.label}
                    aria-pressed={isActive}
                    onClick={() => handleFranchiseClick(franchise)}
                    className={[
                      "franchise-tile group relative flex shrink-0 cursor-pointer items-center justify-center",
                      "border-0 transition-opacity duration-150 focus-visible:outline focus-visible:outline-2",
                      "focus-visible:outline-offset-[-2px]",
                    ].join(" ")}
                    style={{
                      backgroundColor: `var(${franchise.colorVar})`,
                      color: `var(${logoColor})`,
                      /* No border-radius — clip-path handles the shape */
                      paddingInline: 12,
                      clipPath,
                      outlineColor: `var(${logoColor})`,
                      height: 64,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                    }}
                  >
                    {/* Logo */}
                    <span className="pointer-events-none flex items-center justify-center">
                      {franchise.logo}
                    </span>

                    {/*
                     * White-wash overlay on inactive tiles.
                     * Real: non-active tiles desaturated/washed — rgba(255,255,255,0.3)
                     * scrim over the tile gives the grey-tan muted look.
                     * Active tile: no overlay (full color).
                     */}
                    {!isActive && (
                      <span className="tile-washout" aria-hidden="true" />
                    )}

                    {/*
                     * Active underline bar — red PARTIAL segment, centered.
                     * Real site: partial red segment (not full-width) on grey track.
                     * Rendered only on active tile.
                     */}
                    {isActive && (
                      <span className="tile-active-bar" aria-hidden="true" />
                    )}
                  </button>
                );
              })}

              {/*
               * "Shop All" end tile — 112×40 white bg, black text, 2px radius.
               * Inter 16px (not riotSans), pad 8px 8px 8px 16px.
               * Desktop only (strip-shop-all class controls display via scoped CSS).
               */}
              <button
                type="button"
                aria-label="Shop All"
                onClick={() => onSelectFranchise?.("all")}
                className="strip-shop-all shrink-0 cursor-pointer items-center border-0 transition-opacity duration-150 hover:opacity-80"
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
             * Desktop next-arrow — 40×40 circle, 1px border-light border,
             * transparent bg. Positioned at right end of the strip flex row.
             * Shown only on ≥640 (strip-arrow-desktop class).
             */}
            {slides.length > 1 && (
              <button
                type="button"
                aria-label="Next slide"
                onClick={goNext}
                className="strip-arrow-desktop shrink-0 cursor-pointer items-center justify-center rounded-full border transition-opacity duration-150 hover:opacity-80"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "transparent",
                  borderColor: "var(--color-merch-border-light)",
                  color: "var(--color-merch-ink)",
                  marginLeft: 8,
                }}
              >
                <ChevronRight />
              </button>
            )}
          </div>

          {/*
           * Mobile right arrow — 40×40 outline ring at x≈326 (track right edge).
           * Real @390: ONE right arrow only; no left arrow at scroll start.
           * Absolutely positioned at right of strip, vertically centered.
           * Hidden at all times on ≥640 (strip-arrow-mobile class).
           * Left arrow shown only after user has scrolled right (trackScrollLeft > 0).
           */}

          {/* Mobile left arrow — hidden at scroll start */}
          {slides.length > 1 && trackScrollLeft > 0 && (
            <div
              className="strip-arrow-mobile-left absolute inset-y-0 left-0 items-center"
              style={{ zIndex: 10 }}
            >
              <button
                type="button"
                aria-label="Scroll left"
                onClick={() => {
                  if (trackRef.current) {
                    trackRef.current.scrollBy({ left: -147, behavior: "smooth" });
                  }
                }}
                className="flex cursor-pointer items-center justify-center rounded-full transition-opacity duration-150 hover:opacity-80"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "transparent",
                  border: "1px solid var(--color-merch-border-light)",
                  color: "var(--color-merch-ink)",
                }}
              >
                <ChevronLeft />
              </button>
            </div>
          )}

          {/* Mobile right arrow — always shown (single arrow at right edge) */}
          {slides.length > 1 && (
            <div
              className="strip-arrow-mobile absolute inset-y-0 right-0 items-center"
              style={{ zIndex: 10, paddingRight: 4 }}
            >
              <button
                type="button"
                aria-label="Scroll right"
                onClick={() => {
                  if (trackRef.current) {
                    trackRef.current.scrollBy({ left: 147, behavior: "smooth" });
                  }
                }}
                className="flex cursor-pointer items-center justify-center rounded-full transition-opacity duration-150 hover:opacity-80"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "transparent",
                  border: "1px solid var(--color-merch-border-light)",
                  color: "var(--color-merch-ink)",
                }}
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================================================================== */}
      {/* Mobile full-width SHOP NOW — sits below the franchise strip         */}
      {/* REAL: 342×50 at x=24 (24px gutters), 16/600/0.32px, red bg,       */}
      {/* uppercase "SHOP NOW", clip-path corner notches: top-right +        */}
      {/* bottom-left (~20px cut). 16px gap between strip bottom and CTA.   */}
      {/* Shown only on <640 (franchise-cta-mobile class).                  */}
      {/* ================================================================== */}
      {hasFranchises && currentSlide.ctaLabel && (
        <div
          className="franchise-cta-mobile"
          style={{ paddingInline: 24, paddingTop: 16 }}
        >
          <button
            type="button"
            onClick={handleCtaClick}
            className="w-full cursor-pointer border-0 transition-colors duration-150"
            style={{
              backgroundColor: "var(--color-merch-red)",
              color: "var(--color-merch-on-dark)",
              height: 50,
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "18px",
              letterSpacing: "0.32px",
              textTransform: "uppercase",
              /*
               * Corner notches: top-right + bottom-left (~20px diagonal cut).
               * Real site uses an angled clip-path on mobile Shop Now button.
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
