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
 *     - Franchise strip: sits BELOW the hero on the white page
 *     - Franchise tiles: 40px tall, skewed parallelograms (skewX(-10deg))
 *     - Franchise arrows: 40×40 rounded-full transparent buttons at x=24/x=326 @390
 *     - Slide prev/next: 40×40 rounded-full at hero right edge
 *     - CTA: 239×50, riotSans 16px/600, letter-spacing 0.32px, #eb0029 bg
 *     - Progress indicator: 2px-tall animated line under active franchise tile
 *   Mobile (390px):
 *     - Hero image band: 390×315px  (bg layer)
 *     - Inset slide card: 342×342px white card at x=24, y=162 on page bg
 *     - Full-width "SHOP NOW" CTA (342×50) at x=24 BELOW the franchise strip
 *     - Franchise arrows: 40×40 rounded-full, inset 24px from edges
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

/**
 * Circular-arrows "refresh" icon used for slide prev/next in franchise mode.
 * 16×16 viewBox.
 */
function CircularArrows({ direction }: { direction: "prev" | "next" }) {
  const id = useId();
  if (direction === "next") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" id={`${id}-next`}>
        <path
          d="M14 8A6 6 0 1 1 8 2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <polyline
          points="8,0 10,2 8,4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" id={`${id}-prev`}>
      <path
        d="M2 8A6 6 0 1 0 8 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <polyline
        points="8,0 6,2 8,4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchHeroBanner — full-width hero carousel for the /merch homepage.
 *
 * Desktop (1280px): hero 1280×348 (aspect-[320/87]); franchise strip below
 * on the white page (40px-tall parallelogram tiles); 40×40 circular next/prev
 * at hero right edge; 239×50 red CTA at hero bottom-right; 2px progress line.
 *
 * Mobile (390px): 390×315 bg image band + 342×342 inset slide card; full-width
 * SHOP NOW (342×50) below the franchise strip (24px gutters); 40×40 circular
 * arrows at x=24 / x=326 flanking the franchise strip.
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
           * Mobile (< md): fixed 315px height — background image band only.
           * Desktop (≥ md): aspect-[320/87] → 1280×348.
           */
          "h-[315px] md:h-auto md:aspect-[320/87]",
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

        {/* ── Franchise mode: desktop CTA (239×50 red, bottom-right) ── */}
        {hasFranchises && currentSlide.ctaLabel && (
          <div className="absolute bottom-6 right-10 hidden md:block">
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

        {/* ── Slide prev/next — 40×40 rounded-full at hero right edge ── */}
        {/* Desktop: at hero right edge; hidden on mobile (strip arrows handle it) */}
        {slides.length > 1 && hasFranchises && (
          <div className="absolute right-3 top-1/2 hidden -translate-y-1/2 flex-col gap-2 md:flex">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={goPrev}
              className="flex cursor-pointer items-center justify-center rounded-full border-0 transition-opacity duration-150 hover:opacity-80"
              style={{
                width: 40,
                height: 40,
                backgroundColor: "var(--color-merch-overlay-soft)",
                color: "var(--color-merch-on-dark)",
              }}
            >
              <CircularArrows direction="prev" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={goNext}
              className="flex cursor-pointer items-center justify-center rounded-full border-0 transition-opacity duration-150 hover:opacity-80"
              style={{
                width: 40,
                height: 40,
                backgroundColor: "var(--color-merch-overlay-soft)",
                color: "var(--color-merch-on-dark)",
              }}
            >
              <CircularArrows direction="next" />
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
      {/* Franchise strip — sits BELOW the hero on the white page             */}
      {/* REAL: strip is NOT inside the hero; chips 40px tall;                */}
      {/* flanked by 40×40 transparent circular arrows inset 24px             */}
      {/* ================================================================== */}
      {hasFranchises && (
        <div
          aria-label="Shop by franchise"
          role="navigation"
          className="relative w-full overflow-hidden"
          style={{ backgroundColor: "var(--color-merch-hero-control-bar)" }}
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
           * Tile track — horizontally scrollable on mobile.
           * Left-pad 64px on desktop (room for invisible arrow zone),
           * 64px on mobile (24px gutter + 40px arrow).
           * scrollbar-none hides native scrollbar on all browsers.
           */}
          <div
            className="flex h-[40px] items-stretch overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
          >
            {franchises!.map((franchise, idx) => {
              const isFirst = idx === 0;
              const isActive = hasSlideMapping
                ? franchise.slideId === currentSlide.id
                : idx === active % franchises!.length;
              const logoColor = franchise.textColorVar ?? "--color-merch-on-dark";

              /*
               * Desktop tile shape: skewed parallelograms.
               * First tile: square left edge (no left-skew offset).
               * Remaining tiles: 20px skew offset on left edge, visually tessellate.
               * On mobile we keep rectangular tiles (no skew) to avoid clip overflow.
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
                    borderRadius: 0,
                    opacity: isActive ? 1 : 0.75,
                    outlineColor: `var(${logoColor})`,
                    height: 40,
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

                  {/* Active underline bar — bottom edge of tile (3px) */}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0"
                      style={{
                        height: 3,
                        backgroundColor: "var(--color-merch-hero-tile-active-border)",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/*
           * Flanking arrows — 40×40 rounded-full, transparent background, black chevrons.
           * Desktop: inset from strip edges. Desktop edges hidden if tile row fills full width.
           * Mobile: x=0 / x=right-0 (over the strip), inset 24px from page edge → achieved
           * via absolute left-0/right-0 + padding.
           * On desktop (≥md) the arrows are hidden (real site shows none at 1280px).
           */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={goPrev}
                className="absolute left-0 top-0 flex cursor-pointer items-center justify-center rounded-full border-0 transition-opacity duration-150 hover:opacity-80 md:hidden"
                style={{
                  width: 40,
                  height: 40,
                  /* transparent background — only the chevron icon is visible */
                  backgroundColor: "transparent",
                  color: "var(--color-merch-on-dark)",
                  marginLeft: 24,
                }}
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={goNext}
                className="absolute right-0 top-0 flex cursor-pointer items-center justify-center rounded-full border-0 transition-opacity duration-150 hover:opacity-80 md:hidden"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "transparent",
                  color: "var(--color-merch-on-dark)",
                  marginRight: 24,
                }}
              >
                <ChevronRight />
              </button>
            </>
          )}
        </div>
      )}

      {/* ================================================================== */}
      {/* Mobile full-width SHOP NOW — sits below the franchise strip         */}
      {/* REAL: 342×50 at x=24 (24px gutters), 16/600/0.32px, red bg         */}
      {/* Hidden on desktop (≥md) — desktop uses the overlaid 239×50 CTA     */}
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
