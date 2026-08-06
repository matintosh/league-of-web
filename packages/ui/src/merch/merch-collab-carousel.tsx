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
 * Measured from merch.riotgames.com/en-us/ at 1280px desktop and 390px mobile:
 *
 * @1280px:
 *   - Section:       full-width, ~506px tall (heading ~56px + panels ~450px)
 *   - Heading:       "— LATEST COLLABORATIONS" — en-dash prefix, uppercase,
 *                    riotSans 20px/600, --color-merch-ink, left-aligned
 *   - Panels:        2 white-bg product panels side-by-side, each ~618×450px
 *                    White background (#ffffff) — NOT dark gradient tiles
 *                    Product image fills the panel (left or right half),
 *                    text block on the white side with large black product-name
 *                    heading (~34–40px/700), gray body copy, and a slide index
 *                    number "01" / "02" in the panel corner (riotSans 14px/600, ink)
 *   - Arrows:        64px round white-bg bordered arrow buttons, always visible
 *                    (even with 2 tiles), positioned at vertical midpoint
 *
 * @390px:
 *   - Full-bleed product image on top (100vw, ~260–300px tall)
 *   - Below image on white: black product-name heading (~34px), gray body copy
 *   - Centered round ‹ › arrow buttons beneath the text — no CTA button
 *   - NO 390 overflow (no horizontal scroll leaking)
 *   - Slide indicator: 01 / 02 still shown beneath heading
 */

import { useCallback, useId, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single collaboration partner panel. */
export interface MerchCollabEntry {
  /** Unique slug for the React key and href generation, e.g. "hp-omen". */
  slug: string;
  /** Display name of the collaboration partner, e.g. "HP OMEN". */
  partnerName: string;
  /**
   * Large product-name headline shown on the white panel.
   * Real example: "HyperX OMEN 16 VALORANT Edition".
   * For marketing-style data, this is also the main heading.
   */
  headline: string;
  /** Body copy beneath the headline (1–2 short sentences). */
  copy?: string;
  /** Background/product image URL (supplied by the page; ~618×450 landscape). */
  imageUrl: string;
  /** Optional partner logo image URL overlaid on the image side. */
  logoUrl?: string;
  /** CTA label (desktop-only). Defaults to "Shop Now". */
  ctaLabel?: string;
  /** Called when the CTA button is clicked (desktop-only). */
  onCtaClick?: () => void;
}

export interface MerchCollabCarouselProps {
  /**
   * Array of collab panels. The real homepage shows HP/OMEN and Secretlab.
   * Desktop shows 2-up; mobile shows 1-up with arrow nav.
   */
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
// Arrow icon SVGs
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
// Arrow button (shared style for desktop surrounding arrows + mobile centered)
// ---------------------------------------------------------------------------

interface ArrowButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

function ArrowButton({ label, onClick, disabled, style, children }: ArrowButtonProps) {
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
        ...style,
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
// Desktop panel (white-bg product panel, image + text side-by-side)
// ---------------------------------------------------------------------------

interface DesktopPanelProps {
  collab: MerchCollabEntry;
  index: number;   // 1-based, for the "01" / "02" corner badge
  total: number;
}

function DesktopPanel({ collab, index, total }: DesktopPanelProps) {
  return (
    <article
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "var(--color-merch-bg)",
        // Thin border to delineate the white panel on a white page
        outline: "1px solid var(--color-merch-border)",
      }}
    >
      {/* Left: product image (fills ~55% of panel width) */}
      <div
        style={{
          position: "relative",
          flex: "0 0 55%",
          overflow: "hidden",
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
        {/* Partner logo overlay on image (top-left) */}
        {collab.logoUrl && (
          <img
            src={collab.logoUrl}
            alt={collab.partnerName}
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              height: 28,
              width: "auto",
              objectFit: "contain",
              filter: "brightness(0) invert(1)",
            }}
            draggable={false}
          />
        )}
      </div>

      {/* Right: white text block */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "24px 28px 28px",
          gap: 10,
          backgroundColor: "var(--color-merch-bg)",
          fontFamily: "var(--font-merch)",
        }}
      >
        {/* Slide index number — top of text block */}
        <span
          style={{
            fontFamily: "var(--font-merch-display)",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.06em",
            color: "var(--color-merch-muted)",
            lineHeight: 1,
            marginBottom: 4,
          }}
        >
          {padIndex(index)}
          <span
            aria-hidden
            style={{ color: "var(--color-merch-border)", margin: "0 6px" }}
          >
            /
          </span>
          {padIndex(total)}
        </span>

        {/* Large product-name headline */}
        <h3
          style={{
            margin: 0,
            fontFamily: "var(--font-merch-display)",
            fontSize: 28,
            fontWeight: 700,
            lineHeight: 1.15,
            color: "var(--color-merch-ink)",
            letterSpacing: "0.01em",
            textTransform: "uppercase",
          }}
        >
          {collab.headline}
        </h3>

        {/* Body copy */}
        {collab.copy && (
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-merch)",
              fontSize: 13,
              lineHeight: 1.6,
              color: "var(--color-merch-muted)",
            }}
          >
            {collab.copy}
          </p>
        )}

        {/* CTA — desktop only */}
        {collab.ctaLabel && (
          <button
            type="button"
            onClick={collab.onCtaClick}
            style={{
              alignSelf: "flex-start",
              marginTop: 8,
              padding: "10px 24px",
              backgroundColor: "var(--color-merch-red)",
              color: "var(--color-merch-on-dark)",
              fontFamily: "var(--font-merch-display)",
              fontSize: 13,
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
            {collab.ctaLabel}
          </button>
        )}
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Mobile panel (image-then-text stack, no CTA)
// ---------------------------------------------------------------------------

interface MobilePanelProps {
  collab: MerchCollabEntry;
  index: number;   // 1-based
  total: number;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

function MobilePanel({ collab, index, total, onPrev, onNext, hasPrev, hasNext }: MobilePanelProps) {
  return (
    <article
      style={{
        width: "100%",
        flexShrink: 0,
        scrollSnapAlign: "start",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--color-merch-bg)",
      }}
    >
      {/* Full-bleed product image on top */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3" }}>
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

      {/* White text block below the image */}
      <div
        style={{
          padding: "20px 20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          backgroundColor: "var(--color-merch-bg)",
          fontFamily: "var(--font-merch)",
        }}
      >
        {/* Slide index */}
        <span
          style={{
            fontFamily: "var(--font-merch-display)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
            color: "var(--color-merch-muted)",
            lineHeight: 1,
          }}
        >
          {padIndex(index)}
          <span
            aria-hidden
            style={{ color: "var(--color-merch-border)", margin: "0 5px" }}
          >
            /
          </span>
          {padIndex(total)}
        </span>

        {/* Large black product-name heading */}
        <h3
          style={{
            margin: 0,
            fontFamily: "var(--font-merch-display)",
            fontSize: 26,
            fontWeight: 700,
            lineHeight: 1.15,
            color: "var(--color-merch-ink)",
            letterSpacing: "0.01em",
            textTransform: "uppercase",
          }}
        >
          {collab.headline}
        </h3>

        {/* Gray body copy */}
        {collab.copy && (
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-merch)",
              fontSize: 13,
              lineHeight: 1.6,
              color: "var(--color-merch-muted)",
            }}
          >
            {collab.copy}
          </p>
        )}

        {/* Centered round arrow buttons — no CTA on mobile */}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            marginTop: 12,
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
    </article>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchCollabCarousel — "LATEST COLLABORATIONS" section for the /merch homepage.
 *
 * Desktop (≥640px): 2-up white product panels side-by-side with 01/02 slide
 * index numbers, large black uppercase product-name headings, and 64px round
 * bordered arrow buttons on the sides.
 *
 * Mobile (<640px): image-then-text stack — full-bleed product image on top,
 * then white section below with black heading, gray body copy, and centered
 * round arrow buttons. No CTA button on mobile. No horizontal overflow.
 *
 * @example
 * <MerchCollabCarousel
 *   collabs={[
 *     { slug: "hp-omen", partnerName: "HP OMEN", headline: "HyperX OMEN 16 VALORANT Edition",
 *       copy: "Performance laptops built for the Rift.", imageUrl: "...", ctaLabel: "Shop HP OMEN" },
 *     { slug: "secretlab", partnerName: "Secretlab", headline: "Secretlab TITAN Evo",
 *       copy: "The official gaming chair of Riot esports.", imageUrl: "...", ctaLabel: "Shop Secretlab" },
 *   ]}
 * />
 */
export function MerchCollabCarousel({ collabs, onPrev, onNext }: MerchCollabCarouselProps) {
  useId(); // reserved for future SVG id needs
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const [mobileIndex, setMobileIndex] = useState(0);

  const total = collabs.length;

  // Desktop: offset index for showing panels in groups of 2
  const [desktopOffset, setDesktopOffset] = useState(0);

  const goDesktopPrev = useCallback(() => {
    setDesktopOffset((i) => Math.max(0, i - 2));
    onPrev?.();
  }, [onPrev]);

  const goDesktopNext = useCallback(() => {
    setDesktopOffset((i) => Math.min(total - 2, i + 2));
    onNext?.();
  }, [onNext, total]);

  // Mobile prev/next — scroll the snap track by one full width
  const goMobilePrev = useCallback(() => {
    const el = mobileTrackRef.current;
    if (!el) return;
    const newIndex = Math.max(0, mobileIndex - 1);
    el.scrollTo({ left: newIndex * el.offsetWidth, behavior: "smooth" });
    setMobileIndex(newIndex);
    onPrev?.();
  }, [mobileIndex, onPrev]);

  const goMobileNext = useCallback(() => {
    const el = mobileTrackRef.current;
    if (!el) return;
    const newIndex = Math.min(total - 1, mobileIndex + 1);
    el.scrollTo({ left: newIndex * el.offsetWidth, behavior: "smooth" });
    setMobileIndex(newIndex);
    onNext?.();
  }, [mobileIndex, onNext, total]);

  if (collabs.length === 0) return null;

  // Desktop: which 2 collabs are visible
  const desktopVisible = collabs.slice(desktopOffset, desktopOffset + 2);
  const desktopHasPrev = desktopOffset > 0;
  const desktopHasNext = desktopOffset + 2 < total;

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

      {/* ── DESKTOP LAYOUT (≥640px) — 2-up white panels + side arrows ── */}
      <div
        aria-hidden={false}
        style={{
          position: "relative",
          maxWidth: 1280,
          marginInline: "auto",
          paddingInline: 24,
        }}
        // Hide on mobile via inline media approach: we use a companion
        // className that sets display:none below 640px
        className="max-[639px]:hidden"
      >
        {/* Arrow — previous */}
        <ArrowButton
          label="Previous collaborations"
          onClick={goDesktopPrev}
          disabled={!desktopHasPrev}
          style={{
            position: "absolute",
            left: -40,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            width: 64,
            height: 64,
          }}
        >
          <ChevronLeftIcon />
        </ArrowButton>

        {/* 2-up panel grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
            height: 450,
          }}
        >
          {desktopVisible.map((collab, i) => (
            <DesktopPanel
              key={collab.slug}
              collab={collab}
              index={desktopOffset + i + 1}
              total={total}
            />
          ))}
          {/* Fill empty slot if only 1 collab visible */}
          {desktopVisible.length < 2 && (
            <div
              aria-hidden
              style={{
                backgroundColor: "var(--color-merch-surface)",
                outline: "1px solid var(--color-merch-border)",
              }}
            />
          )}
        </div>

        {/* Arrow — next */}
        <ArrowButton
          label="Next collaborations"
          onClick={goDesktopNext}
          disabled={!desktopHasNext}
          style={{
            position: "absolute",
            right: -40,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            width: 64,
            height: 64,
          }}
        >
          <ChevronRightIcon />
        </ArrowButton>
      </div>

      {/* ── MOBILE LAYOUT (<640px) — 1-up snap track, image-then-text ── */}
      <div
        className="min-[640px]:hidden"
        style={{ overflow: "hidden" }}
      >
        {/* Snap track — each MobilePanel fills 100vw */}
        <div
          ref={mobileTrackRef}
          style={{
            display: "flex",
            overflowX: "hidden",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            // Prevent any child from leaking outside
            width: "100%",
          }}
        >
          {collabs.map((collab, i) => (
            <MobilePanel
              key={collab.slug}
              collab={collab}
              index={i + 1}
              total={total}
              onPrev={goMobilePrev}
              onNext={goMobileNext}
              hasPrev={mobileIndex > 0}
              hasNext={mobileIndex < total - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
