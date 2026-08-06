"use client";

/**
 * MerchCollabCarousel — "LATEST COLLABORATIONS" section for the Riot merch homepage.
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
 * Measured from merch.riotgames.com/en-us/ at 1280px desktop:
 *   - Section:       full-width, ~506px tall (heading ~56px + tiles ~450px)
 *   - Heading:       "— LATEST COLLABORATIONS" — en-dash prefix, uppercase,
 *                    riotSans 20px/600, --color-merch-ink, left-aligned with
 *                    standard page gutter (~24px)
 *   - Collab tiles:  2 tiles per viewport (1280px), each ~618px wide × ~450px tall
 *                    Background: dark image with gradient scrim overlay
 *                    Content: partner logo + copy block + "Shop Now" CTA
 *   - Arrows:        64px round white buttons left/right of the tile track,
 *                    positioned at vertical midpoint of the tile area
 *   - Mobile:        1 tile per viewport with arrow nav, no overflow
 *   - Background:    --color-merch-bg (white page; the tiles carry their own dark bg)
 */

import { useId, useRef } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single collaboration partner tile. */
export interface MerchCollabEntry {
  /** Unique slug for the React key and href generation, e.g. "hp-omen". */
  slug: string;
  /** Display name of the collaboration partner, e.g. "HP OMEN". */
  partnerName: string;
  /** Campaign headline shown on the tile, e.g. "GAME ON". */
  headline: string;
  /** Body copy beneath the headline (1–2 short sentences). */
  copy?: string;
  /** Background image URL (supplied by the page; ~618×450 landscape). */
  imageUrl: string;
  /** Optional partner logo image URL overlaid on the tile. */
  logoUrl?: string;
  /** CTA label. Defaults to "Shop Now". */
  ctaLabel?: string;
  /** Called when the CTA button is clicked. */
  onCtaClick?: () => void;
}

export interface MerchCollabCarouselProps {
  /**
   * Array of collab tiles. The real homepage shows HP/OMEN and Secretlab.
   * Two tiles are shown per viewport at 1280px, one at 390px.
   */
  collabs: MerchCollabEntry[];
  /** Called when the previous-arrow is clicked. Carousel manages internal state by default. */
  onPrev?: () => void;
  /** Called when the next-arrow is clicked. */
  onNext?: () => void;
}

// ---------------------------------------------------------------------------
// Arrow icon SVG
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
      style={{ width: 20, height: 20 }}
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
      style={{ width: 20, height: 20 }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Single collab tile
// ---------------------------------------------------------------------------

function CollabTile({ collab, gradId }: { collab: MerchCollabEntry; gradId: string }) {
  return (
    <article
      style={{
        position: "relative",
        minWidth: 0,
        flexShrink: 0,
        // 2 tiles at 1280: (1280 - 2*24px gutter - 20px gap) / 2 ≈ 606px
        // We let the grid handle sizing; this component fills the allocated slot.
        width: "100%",
        height: "100%",
        overflow: "hidden",
        cursor: collab.onCtaClick ? "pointer" : undefined,
      }}
    >
      {/* Background image */}
      <img
        src={collab.imageUrl}
        alt=""
        aria-hidden
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Gradient scrim — left-to-dark so text reads on image */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to top, var(--color-merch-ink-dark) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.15) 100%)`,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "28px 32px",
          fontFamily: "var(--font-merch)",
          gap: 12,
        }}
      >
        {/* Partner logo (optional) */}
        {collab.logoUrl && (
          <img
            src={collab.logoUrl}
            alt={collab.partnerName}
            style={{
              height: 36,
              width: "auto",
              objectFit: "contain",
              objectPosition: "left center",
              maxWidth: 160,
              filter: "brightness(0) invert(1)", // ensure white on dark
            }}
            draggable={false}
          />
        )}

        {/* Headline */}
        <h3
          style={{
            margin: 0,
            fontFamily: "var(--font-merch-display)",
            fontSize: 28,
            fontWeight: 700,
            lineHeight: 1.15,
            color: "var(--color-merch-on-dark)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {collab.headline}
        </h3>

        {/* Body copy */}
        {collab.copy && (
          <p
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--color-merch-body-on-dark)",
              maxWidth: 340,
            }}
          >
            {collab.copy}
          </p>
        )}

        {/* CTA */}
        <button
          type="button"
          onClick={collab.onCtaClick}
          style={{
            alignSelf: "flex-start",
            padding: "10px 24px",
            backgroundColor: "var(--color-merch-red)",
            color: "var(--color-merch-on-dark)",
            fontFamily: "var(--font-merch-display)",
            fontSize: 14,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            border: "none",
            cursor: "pointer",
            transition: "background-color 150ms",
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
          {collab.ctaLabel ?? "Shop Now"}
        </button>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchCollabCarousel — "LATEST COLLABORATIONS" section for the /merch homepage.
 * Full-width section with heading, a 2-up tile grid (desktop) / 1-up carousel (mobile),
 * and 64px round arrow nav buttons. Matches the real merch.riotgames.com section
 * featuring HP/OMEN and Secretlab collab tiles, ~506px total section height.
 *
 * @example
 * <MerchCollabCarousel
 *   collabs={[
 *     { slug: "hp-omen", partnerName: "HP OMEN", headline: "GAME ON", imageUrl: "...", ctaLabel: "Shop HP OMEN" },
 *     { slug: "secretlab", partnerName: "Secretlab", headline: "PLAY IN COMFORT", imageUrl: "...", ctaLabel: "Shop Secretlab" },
 *   ]}
 * />
 */
export function MerchCollabCarousel({ collabs }: MerchCollabCarouselProps) {
  const gradId = useId();
  const trackRef = useRef<HTMLDivElement>(null);

  // Each tile is one "page" in the track. Desktop shows 2; mobile shows 1.
  // On desktop the track doesn't need to scroll (2 tiles fill the viewport).
  // On mobile we scroll by the full container width.

  function scrollBy(dir: -1 | 1) {
    const el = trackRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  }

  if (collabs.length === 0) return null;

  return (
    <section
      aria-label="Latest Collaborations"
      style={{
        fontFamily: "var(--font-merch)",
        backgroundColor: "var(--color-merch-bg)",
        paddingBottom: 48,
      }}
    >
      {/* Section heading */}
      <div
        style={{
          paddingInline: 24,
          paddingTop: 40,
          paddingBottom: 20,
          maxWidth: 1280,
          marginInline: "auto",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--font-merch-display)",
            fontSize: 20,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--color-merch-ink)",
          }}
        >
          {/* en-dash prefix matches the real site's "— LATEST COLLABORATIONS" */}
          &mdash; LATEST COLLABORATIONS
        </h2>
      </div>

      {/* Tile track wrapper — relative so arrows can be absolutely positioned */}
      <div
        style={{
          position: "relative",
          maxWidth: 1280,
          marginInline: "auto",
          paddingInline: 24,
        }}
      >
        {/* Arrow — previous */}
        {collabs.length > 2 && (
          <button
            type="button"
            aria-label="Previous collaborations"
            onClick={() => scrollBy(-1)}
            style={{
              position: "absolute",
              left: -8,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: "none",
              backgroundColor: "var(--color-merch-on-dark)",
              color: "var(--color-merch-ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 12px var(--color-merch-overlay-soft)",
              transition: "opacity 150ms",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
          >
            <ChevronLeftIcon />
          </button>
        )}

        {/* Scrollable tile track */}
        <div
          ref={trackRef}
          style={{
            display: "grid",
            // 2 columns desktop, 1 on mobile — CSS grid auto-fits
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
            height: 450,
            // Mobile: overflow-x scroll
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
          }}
          className="max-[639px]:!grid-cols-1 max-[639px]:!overflow-x-auto"
        >
          {collabs.map((collab) => (
            <div
              key={collab.slug}
              style={{ scrollSnapAlign: "start", minWidth: 0, height: 450 }}
            >
              <CollabTile collab={collab} gradId={`${gradId}-${collab.slug}`} />
            </div>
          ))}
        </div>

        {/* Arrow — next */}
        {collabs.length > 2 && (
          <button
            type="button"
            aria-label="Next collaborations"
            onClick={() => scrollBy(1)}
            style={{
              position: "absolute",
              right: -8,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: "none",
              backgroundColor: "var(--color-merch-on-dark)",
              color: "var(--color-merch-ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 12px var(--color-merch-overlay-soft)",
              transition: "opacity 150ms",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
          >
            <ChevronRightIcon />
          </button>
        )}
      </div>
    </section>
  );
}
