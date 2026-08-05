"use client";

/**
 * FeaturedGamePromoHero — full-width promotional hero banner on the Riot
 * launcher Home page.
 *
 * Full-bleed background splash art with a dark gradient overlay on the left
 * half. Game logo, tagline, body copy, and a CTA button are anchored to the
 * lower-left of the overlay column.
 *
 * Token source: packages/tokens/src/theme.css — --color-launcher-* set.
 * No hardcoded hex outside packages/tokens. Server-safe.
 *
 * Closes #680.
 */

import { useId } from "react";
import type { FeaturedPromoData } from "@low/fixtures";

export interface FeaturedGamePromoHeroProps extends FeaturedPromoData {
  /** Optional click handler for the CTA button. */
  onCta?: () => void;
  className?: string;
}

/**
 * Full-bleed hero banner: splash art background, left-half dark gradient
 * overlay, game logo + tagline + description + CTA button in overlay column.
 *
 * ~380 px tall, 100% wide, border-radius 8 px per spec.
 */
/** Strip non-alphanumeric characters so useId values are valid CSS class suffixes. */
function safeCssId(id: string) {
  return id.replace(/[^a-zA-Z0-9]/g, "");
}

export function FeaturedGamePromoHero({
  gameKey,
  gameLogo,
  tagline,
  description,
  ctaLabel,
  splashUrl,
  onCta,
  className,
}: FeaturedGamePromoHeroProps) {
  const uid = useId();
  const safeUid = safeCssId(uid);
  const heroId = `fgph-${safeUid}`;

  return (
    <>
      {/*
       * Hover style for the CTA button: brightens the frosted-glass fill.
       * Scoped via a generated id class so multiple heroes on the same page
       * don't collide.
       */}
      <style>{`
        .fgph-cta-${safeUid}:hover {
          background-color: var(--color-launcher-cta-hover-bg) !important;
        }
      `}</style>

      <div
        id={heroId}
        role="region"
        aria-label={`${gameKey} promotion`}
        className={className}
        style={{
          position: "relative",
          width: "100%",
          height: 380,
          borderRadius: 8,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Full-bleed splash art */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={splashUrl}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
          }}
        />

        {/* Left-half dark gradient overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, color-mix(in srgb, var(--color-launcher-scrim-side) 92%, transparent) 0%, color-mix(in srgb, var(--color-launcher-scrim-side) 80%, transparent) 40%, color-mix(in srgb, var(--color-launcher-scrim-side) 30%, transparent) 65%, transparent 100%)",
          }}
        />

        {/* Overlay content column — logo, tagline, description, CTA */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "0 40px 36px 40px",
            maxWidth: "50%",
          }}
        >
          {/* Game logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gameLogo}
            alt={gameKey}
            style={{
              height: 120,
              width: "auto",
              objectFit: "contain",
              objectPosition: "left center",
              marginBottom: 16,
              flexShrink: 0,
            }}
          />

          {/* Tagline */}
          <h2
            style={{
              fontFamily: "var(--font-display, var(--font-launcher))",
              fontSize: 26,
              fontWeight: 700,
              lineHeight: 1.2,
              color: "var(--color-launcher-text-primary)",
              margin: "0 0 8px 0",
            }}
          >
            {tagline}
          </h2>

          {/* Body copy */}
          <p
            style={{
              fontFamily: "var(--font-launcher)",
              fontSize: 14,
              lineHeight: 1.5,
              color: "var(--color-launcher-text-muted)",
              maxWidth: 460,
              margin: "0 0 20px 0",
            }}
          >
            {description}
          </p>

          {/* CTA button */}
          <button
            type="button"
            aria-label={ctaLabel}
            onClick={onCta}
            className={`fgph-cta-${safeUid}`}
            style={{
              alignSelf: "flex-start",
              height: 40,
              minWidth: 140,
              paddingLeft: 20,
              paddingRight: 20,
              backgroundColor: "var(--color-launcher-cta-bg)",
              border: "1px solid var(--color-launcher-cta-border)",
              borderRadius: 4,
              fontFamily: "var(--font-launcher)",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--color-launcher-text-primary)",
              cursor: "pointer",
              letterSpacing: "0.04em",
              transition: "background-color 150ms ease",
            }}
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </>
  );
}
