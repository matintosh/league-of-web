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
 * Reworked (issue #855) to match the real merch.riotgames.com "Latest Collaborations" swiper:
 *
 * @1280px:
 *   - Section:   full-width #f7f7f7 band (--color-merch-surface-alt)
 *   - Eyebrow:   short rule + "Latest Collaborations" 18px/600, lh 22px,
 *                ls normal, --color-merch-ink-dark (#000000), x=32
 *   - Slide:     full-width single-slide snap; text zone LEFT (~435px),
 *                landscape image RIGHT; next slide peeking ~56px at right edge
 *   - Index:     plain "01"…"06" — 14px/600, --color-merch-franchise-label
 *   - Headline:  riotSans 48px/600, lh 52px, NO text-transform (mixed-case)
 *   - Body:      Inter 16px/400, lh 22px, --color-merch-franchise-label
 *   - Arrows:    48px circles below text zone, NO CTA anywhere
 *
 * @390px:
 *   - Same #f7f7f7 band, same eyebrow
 *   - Slide: full-bleed image on top (100vw), text block below
 *   - 48px circular arrow buttons beneath text, centered, NO CTA
 *   - NO horizontal overflow (scrollWidth = viewport width)
 *
 * NO-OVERFLOW GUARANTEE:
 *   overflowX:clip on the section prevents the peeking next-slide from
 *   pushing scrollWidth beyond the viewport. clip does not create a scroll
 *   container (unlike hidden) so sticky ancestors remain unaffected.
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
   * Mixed case — e.g. "HyperX OMEN 16 VALORANT Edition". NO text-transform applied.
   */
  headline: string;
  /** Body copy beneath the headline (1–2 short sentences). */
  copy?: string;
  /**
   * Landscape product/campaign image URL (supplied by the page).
   * Ideal size: ~648×324 (2:1 ratio). Rendered object-cover on the right half.
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
      style={{ width: 18, height: 18 }}
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
      style={{ width: 18, height: 18 }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Arrow button — 48px circle, white bg, bordered
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
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: "1.5px solid var(--color-merch-border)",
        backgroundColor: "var(--color-merch-bg)",
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
        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
          "var(--color-merch-bg)";
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
// TextBlock — shared text content for desktop and mobile slides
// ---------------------------------------------------------------------------

interface TextBlockProps {
  collab: MerchCollabEntry;
  index: number;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  /** Center the arrow buttons (mobile). Desktop keeps them left-aligned. */
  centerArrows?: boolean;
}

function TextBlock({ collab, index, onPrev, onNext, hasPrev, hasNext, centerArrows }: TextBlockProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Plain slide index: "01" */}
      <span
        style={{
          fontFamily: "var(--font-merch-display)",
          fontSize: 14,
          fontWeight: 600,
          color: "var(--color-merch-franchise-label)",
          lineHeight: 1,
          marginBottom: 12,
        }}
      >
        {padIndex(index)}
      </span>

      {/* Headline: 48px/600, mixed-case (NO text-transform), lh 52px */}
      <h3
        style={{
          margin: 0,
          fontFamily: "var(--font-merch-display)",
          fontSize: 48,
          fontWeight: 600,
          lineHeight: "52px",
          color: "var(--color-merch-ink)",
          letterSpacing: 0,
          textTransform: "none",
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
            marginBottom: 0,
          }}
        >
          {collab.copy}
        </p>
      )}

      {/* 48px arrow buttons — no CTA */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 32,
          justifyContent: centerArrows ? "center" : "flex-start",
        }}
      >
        <ArrowButton label="Previous collaboration" onClick={onPrev} disabled={!hasPrev}>
          <ChevronLeftIcon />
        </ArrowButton>
        <ArrowButton label="Next collaboration" onClick={onNext} disabled={!hasNext}>
          <ChevronRightIcon />
        </ArrowButton>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MerchCollabCarousel
// ---------------------------------------------------------------------------

export function MerchCollabCarousel({ collabs, onPrev, onNext }: MerchCollabCarouselProps) {
  const ruleId = useId();
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

  return (
    <section
      aria-label="Latest Collaborations"
      style={{
        fontFamily: "var(--font-merch)",
        backgroundColor: "var(--color-merch-surface-alt)",
        paddingBottom: 48,
        /*
         * overflow-x:clip contains the peeking next slide at desktop without
         * creating a scroll container. scrollWidth stays = viewport width at
         * both 1280 and 390.
         */
        overflowX: "clip",
      }}
    >
      {/* ── Eyebrow heading ── */}
      <div
        style={{
          paddingInline: 32,
          paddingTop: 40,
          paddingBottom: 24,
          maxWidth: 1280,
          marginInline: "auto",
        }}
      >
        <h2
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
          }}
        >
          <EyebrowRule id={`${ruleId}-rule`} />
          Latest Collaborations
        </h2>
      </div>

      {/*
       * ── Scroll track ──
       * A single horizontal scroll container for both viewports.
       * Desktop: slides are calc(100% - 64px) wide with 32px left margin,
       *          leaving ~64px of the next slide peeking at the right edge.
       * Mobile:  slides are 100% wide (no peek, full-bleed).
       *
       * scrollIntoView(inline:"start") snaps each slide to its natural start.
       * overflowX:clip on the section clips the peek without scroll.
       */}
      <div
        className="[&::-webkit-scrollbar]:hidden"
        style={{
          display: "flex",
          overflowX: "scroll",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
        }}
      >
        {collabs.map((collab, i) => (
          <article
            key={collab.slug}
            aria-label={collab.partnerName}
            ref={(el) => { slideRefs.current[i] = el; }}
            style={{
              scrollSnapAlign: "start",
              flexShrink: 0,
              backgroundColor: "var(--color-merch-surface-alt)",
            }}
            // Desktop: calc(100% - 64px) wide with left indent; Mobile: 100%
            className="
              w-[calc(100%-64px)] ml-8
              max-[639px]:w-full max-[639px]:ml-0
            "
          >
            {/* Desktop layout (≥640px): text LEFT + image RIGHT */}
            <div
              className="max-[639px]:hidden"
              style={{
                display: "flex",
                flexDirection: "row",
                minHeight: 324,
              }}
            >
              {/* Text zone — LEFT, 435px */}
              <div
                style={{
                  flex: "0 0 435px",
                  paddingRight: 40,
                }}
              >
                <TextBlock
                  collab={collab}
                  index={i + 1}
                  onPrev={goPrev}
                  onNext={goNext}
                  hasPrev={hasPrev}
                  hasNext={hasNext}
                />
              </div>

              {/* Image — RIGHT, landscape 2:1 object-cover */}
              <div
                style={{
                  flex: 1,
                  position: "relative",
                  overflow: "hidden",
                  minHeight: 324,
                }}
              >
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
            </div>

            {/* Mobile layout (<640px): image TOP + text BOTTOM */}
            <div
              className="min-[640px]:hidden"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Full-bleed image */}
              <div style={{ position: "relative", width: "100%", aspectRatio: "2 / 1" }}>
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
              </div>

              {/* Text block below image */}
              <div
                style={{
                  padding: "20px 20px 24px",
                  backgroundColor: "var(--color-merch-surface-alt)",
                }}
              >
                <TextBlock
                  collab={collab}
                  index={i + 1}
                  onPrev={goPrev}
                  onNext={goNext}
                  hasPrev={hasPrev}
                  hasNext={hasNext}
                  centerArrows
                />
              </div>
            </div>
          </article>
        ))}

        {/* Trailing spacer (desktop only) so the last slide's text zone isn't clipped */}
        <div aria-hidden className="max-[639px]:hidden" style={{ flex: "0 0 32px" }} />
      </div>
    </section>
  );
}
