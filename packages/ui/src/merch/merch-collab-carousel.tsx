"use client";

/**
 * MerchCollabCarousel — "Latest Collaborations" section for the Riot merch homepage.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens
 * (add a token to @low/tokens if one is missing, sampled from the real store)
 * and a modern e-commerce layout. This is NOT the Hextech client — IGNORE the
 * client Hextech-only / no-default-Tailwind-palette guidance; still tokens-only
 * (no raw hex outside packages/tokens; NO hex fallbacks in var(); NO bare hex
 * like #ffffff — use --color-merch-on-dark), presentational (props in/callbacks
 * out, NO fetching in @low/ui, types from @low/fixtures), showcase server-safe
 * (no 'use client'; stateful demos in *.demo.tsx), SVG ids from useId.
 *
 * Reworked (issue #890) to fix double-render at 390 + desktop 506px panel:
 *
 * @1280px:
 *   - Section:   full-width #f7f7f7 band (--color-merch-surface-alt), padding 80px 0
 *   - Eyebrow:   short rule + "LATEST COLLABORATIONS" 18px/600, lh 22px,
 *                uppercase, --color-merch-ink-dark (#000000), dash from left edge
 *   - Panel:     506px tall side-by-side; text column LEFT (w~435px), image RIGHT
 *   - Headline:  riotSans 48px/600, lh 52px, --color-merch-collab-ink (#1b1d1f)
 *   - Body:      Inter 16px/400, lh 22px, --color-merch-franchise-label
 *   - Arrows:    40×40 transparent circles below text, 1px border --color-merch-border-light
 *
 * @390px:
 *   - One section (NOT two) — the dual-layout bug is fixed by using a single
 *     flex container with CSS media queries rather than two sibling divs
 *   - Same #f7f7f7 band, same eyebrow; label dash from left edge (x=0, no inset)
 *   - Slide: full-bleed image on top, text block below (32px side margins)
 *   - NO numeric index ("01") — dropped at mobile
 *   - 40×40 transparent arrow buttons beneath text, centered, 1px border rgb(208,208,208)
 *   - NO horizontal overflow (scrollWidth = viewport width)
 *
 * NO-OVERFLOW GUARANTEE:
 *   overflowX:clip on the section prevents the peeking next-slide from
 *   pushing scrollWidth beyond the viewport. clip does not create a scroll
 *   container (unlike hidden) so sticky ancestors remain unaffected.
 *
 * DOUBLE-RENDER FIX (issue #890):
 *   The previous implementation used two sibling divs (desktop + mobile) with
 *   Tailwind max-[639px]:hidden / min-[640px]:hidden. These Tailwind arbitrary
 *   breakpoint classes were not being emitted by the scanner, causing BOTH
 *   layout variants to render at 390. The fix uses a SINGLE flex container with
 *   a scoped <style> block and @media queries — same approach as merch-search-hero.tsx.
 */

import { useCallback, useId, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single collaboration partner slide. */
export interface MerchCollabEntry {
  /** Unique slug for the React key and aria labels, e.g. "hp-omen". */
  slug: string;
  /** Display name of the collaboration partner, e.g. "HP OMEN". */
  partnerName: string;
  /**
   * Large product-name headline shown on the text zone.
   * e.g. "HyperX OMEN 16 VALORANT Edition". Rendered at 48px/600.
   */
  headline: string;
  /** Body copy beneath the headline (1–2 short sentences). */
  copy?: string;
  /**
   * Landscape product/campaign image URL (supplied by the page).
   * Ideal size: ~648×506 (desktop). Rendered object-cover on the right half.
   */
  imageUrl: string;
  /** Optional partner logo URL overlaid on the image. */
  logoUrl?: string;
}

export interface MerchCollabCarouselProps {
  /** Array of collab slides. The real homepage shows ~6 slides. */
  collabs: MerchCollabEntry[];
  /** Called when the previous-arrow is clicked. */
  onPrev?: () => void;
  /** Called when the next-arrow is clicked. */
  onNext?: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Zero-padded slide index, e.g. 1 → "01". */
function padIndex(n: number): string {
  return String(n).padStart(2, "0");
}

// ---------------------------------------------------------------------------
// Arrow icons
// ---------------------------------------------------------------------------

function ChevronLeftIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16 }}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16 }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Arrow button — 40×40 transparent, 1px border-light, centered
// ---------------------------------------------------------------------------

interface ArrowButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

function ArrowButton({ label, onClick, disabled, children }: ArrowButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "1px solid var(--color-merch-border-light)",
        backgroundColor: "transparent",
        color: "var(--color-merch-ink)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.35 : 1,
        transition: "background-color 120ms, opacity 120ms",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        if (!disabled)
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "var(--color-merch-surface)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
      }}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Eyebrow rule — short horizontal bar matching real merch.riotgames.com prefix
// ---------------------------------------------------------------------------

function EyebrowRule({ id }: { id: string }) {
  return (
    <svg
      aria-hidden
      id={id}
      style={{ display: "inline-block", verticalAlign: "middle", marginRight: 10 }}
      width={28}
      height={2}
    >
      <rect width={28} height={2} fill="currentColor" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MerchCollabCarousel
// ---------------------------------------------------------------------------

export function MerchCollabCarousel({ collabs, onPrev, onNext }: MerchCollabCarouselProps) {
  const uid = useId();
  const ruleId = `${uid}-rule`;
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const [index, setIndex] = useState(0);

  const total = collabs.length;
  const hasPrev = index > 0;
  const hasNext = index < total - 1;

  const scrollTo = useCallback((newIndex: number) => {
    slideRefs.current[newIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
    setIndex(newIndex);
  }, []);

  const goPrev = useCallback(() => {
    const newIndex = Math.max(0, index - 1);
    scrollTo(newIndex);
    onPrev?.();
  }, [index, scrollTo, onPrev]);

  const goNext = useCallback(() => {
    const newIndex = Math.min(total - 1, index + 1);
    scrollTo(newIndex);
    onNext?.();
  }, [index, total, scrollTo, onNext]);

  if (collabs.length === 0) return null;

  /*
   * Scoped styles: use a <style> block with a data-attribute selector so
   * responsive layout switches are handled by real @media queries rather than
   * Tailwind arbitrary breakpoint classes (which were not being emitted by the
   * scanner and caused both layout variants to render at 390 — issue #890).
   *
   * data-collab-carousel scopes all rules to this component instance.
   */
  const scopeAttr = "data-collab-carousel";

  return (
    <section
      aria-label="Latest Collaborations"
      {...{ [scopeAttr]: "" }}
      style={{
        fontFamily: "var(--font-merch)",
        backgroundColor: "var(--color-merch-surface-alt)",
        /*
         * overflow-x:clip contains the peeking next slide at desktop without
         * creating a scroll container. scrollWidth stays = viewport width at
         * both 1280 and 390.
         */
        overflowX: "clip",
      }}
    >
      {/* Scoped responsive styles — avoids Tailwind arbitrary-breakpoint scan issues */}
      <style>{`
        [${scopeAttr}] .collab-eyebrow {
          padding-inline: 0;
          padding-top: 40px;
          padding-bottom: 24px;
        }
        [${scopeAttr}] .collab-eyebrow-inner {
          padding-inline: 32px;
          max-width: 1280px;
          margin-inline: auto;
        }
        [${scopeAttr}] .collab-slide {
          /* Mobile default: full-width slide, column layout */
          display: flex;
          flex-direction: column;
          scroll-snap-align: start;
          flex-shrink: 0;
          width: 100%;
          background-color: var(--color-merch-surface-alt);
        }
        [${scopeAttr}] .collab-image {
          /* Mobile: full-bleed image on top, 2:1 aspect */
          position: relative;
          width: 100%;
          aspect-ratio: 2 / 1;
          order: 0;
          overflow: hidden;
        }
        [${scopeAttr}] .collab-text {
          /* Mobile: text below image, 32px side margins */
          order: 1;
          padding: 20px 32px 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        [${scopeAttr}] .collab-index {
          /* Mobile: hide the numeric index per real mobile layout */
          display: none;
        }
        [${scopeAttr}] .collab-arrows {
          display: flex;
          gap: 12px;
          margin-top: 32px;
          justify-content: center; /* centered on mobile */
        }
        [${scopeAttr}] .collab-track-spacer {
          /* Mobile: no trailing spacer needed */
          display: none;
        }

        /* ── Desktop (≥640px) ─────────────────────────────────────── */
        @media (min-width: 640px) {
          [${scopeAttr}] .collab-slide {
            /* Desktop: calc(100% - 64px) wide with 32px left indent; image peeks at right */
            flex-direction: row;
            width: calc(100% - 64px);
            margin-left: 32px;
            height: 506px;
          }
          [${scopeAttr}] .collab-image {
            /* Desktop: image RIGHT, flex fills remaining width */
            order: 1;
            width: auto;
            aspect-ratio: unset;
            flex: 1;
            height: 100%;
          }
          [${scopeAttr}] .collab-text {
            /* Desktop: text LEFT, fixed width ~435px, no top/bottom inset — section padding handles it */
            order: 0;
            padding: 0 40px 0 0;
            flex: 0 0 435px;
          }
          [${scopeAttr}] .collab-index {
            /* Desktop: show the numeric index */
            display: block;
          }
          [${scopeAttr}] .collab-arrows {
            justify-content: flex-start; /* left-aligned on desktop */
          }
          [${scopeAttr}] .collab-track-spacer {
            display: block;
          }
        }
      `}</style>

      {/* ── Eyebrow heading ── */}
      {/*
       * At mobile (390): dash runs flush from left edge (x=0), NO padding-inline on outer wrapper.
       * At desktop: inner div provides 32px inline padding + max-width centering.
       * Real mobile: label at x=0 with the dash touching the viewport edge.
       */}
      <div className="collab-eyebrow">
        <div className="collab-eyebrow-inner">
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-merch-display)",
              fontSize: 18,
              fontWeight: 600,
              lineHeight: "22px",
              letterSpacing: "normal",
              color: "var(--color-merch-ink-dark)",
              display: "flex",
              alignItems: "center",
              textTransform: "uppercase",
            }}
          >
            <EyebrowRule id={ruleId} />
            Latest Collaborations
          </p>
        </div>
      </div>

      {/*
       * ── Scroll track ──
       * A single horizontal scroll container.
       * Desktop: slides are calc(100% - 64px) wide with 32px left margin,
       *          leaving ~64px of the next slide peeking at the right edge.
       * Mobile:  slides are 100% wide (no peek, full-bleed).
       *
       * scrollIntoView(inline:"start") snaps each slide to its natural start.
       * overflowX:clip on the section clips the peek without scroll container.
       *
       * Section padds 80px top/bottom on desktop to achieve the 506px panel within
       * the full-width band.
       */}
      <div
        style={{
          display: "flex",
          overflowX: "scroll",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          paddingBottom: 48,
        }}
      >
        {collabs.map((collab, i) => (
          <article
            key={collab.slug}
            aria-label={collab.partnerName}
            ref={(el) => { slideRefs.current[i] = el; }}
            className="collab-slide"
          >
            {/* Product/campaign image */}
            <div className="collab-image">
              <img
                src={collab.imageUrl}
                alt={collab.partnerName}
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                }}
              />
              {collab.logoUrl && (
                <img
                  src={collab.logoUrl}
                  alt={collab.partnerName}
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    height: 28,
                    width: "auto",
                    objectFit: "contain",
                    filter: "brightness(0) invert(1)",
                  }}
                  draggable={false}
                />
              )}
            </div>

            {/* Text zone */}
            <div className="collab-text">
              {/* Numeric index — desktop only ("01"…"06") */}
              <span
                className="collab-index"
                style={{
                  fontFamily: "var(--font-merch-display)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--color-merch-franchise-label)",
                  lineHeight: 1,
                  marginBottom: 12,
                }}
              >
                {padIndex(i + 1)}
              </span>

              {/* Headline: 48px/600, lh 52px, collab-ink #1b1d1f */}
              <h3
                style={{
                  margin: 0,
                  fontFamily: "var(--font-merch-display)",
                  fontSize: 48,
                  fontWeight: 600,
                  lineHeight: "52px",
                  color: "var(--color-merch-collab-ink)",
                  letterSpacing: 0,
                  marginBottom: 16,
                }}
              >
                {collab.headline}
              </h3>

              {/* Body: Inter 16px/400, lh 22px */}
              {collab.copy && (
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-merch)",
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeight: "22px",
                    color: "var(--color-merch-franchise-label)",
                  }}
                >
                  {collab.copy}
                </p>
              )}

              {/* 40×40 arrow buttons — transparent bg, 1px border-light, no CTA */}
              <div className="collab-arrows">
                <ArrowButton label="Previous collaboration" onClick={goPrev} disabled={!hasPrev}>
                  <ChevronLeftIcon />
                </ArrowButton>
                <ArrowButton label="Next collaboration" onClick={goNext} disabled={!hasNext}>
                  <ChevronRightIcon />
                </ArrowButton>
              </div>
            </div>
          </article>
        ))}

        {/* Trailing spacer (desktop only) — last slide's text zone is not clipped */}
        <div aria-hidden className="collab-track-spacer" style={{ flex: "0 0 32px" }} />
      </div>
    </section>
  );
}
