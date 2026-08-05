/**
 * LauncherFeaturedCard — bottom-left overlay card for the Overview hero splash.
 *
 * In the ref: a single merged heading "League Classic Cinematic - Welcome Back,
 * Summoners" (no separate eyebrow label), body description, and an opaque dark-grey
 * "Watch Now" CTA button. Rendered as a child slot of LauncherOverviewHero — the
 * hero's left vignette scrim provides the dark canvas.
 *
 * Token source: packages/tokens/src/theme.css — --color-launcher-* set (issues #679, #681, #684, #732).
 */

"use client";

export interface LauncherFeaturedCardProps {
  /** Category label merged into the heading, e.g. "League Classic Cinematic". */
  categoryLabel: string;
  /** Main heading tail, e.g. "Welcome Back, Summoners". */
  title: string;
  /** Body description, 1–3 sentences. */
  description: string;
  /** CTA button label. Default "Watch Now". */
  ctaLabel?: string;
  /** Called when the CTA button is clicked. */
  onCta?: () => void;
}

/**
 * Cinematic/news overlay card for the launcher Overview hero.
 *
 * Layout (measured from lol-launcher-ref/image.png at ~1536px, ÷1.2):
 *   - max-width ≈ 360px; height auto; transparent bg (hero scrim provides dark canvas)
 *   - Single merged heading (white, ~19–20px/700): "{categoryLabel} - {title}", wraps 2 lines
 *   - No separate eyebrow — the ref shows one combined heading line group
 *   - Description (muted, 13px/400, line-clamped to 3)
 *   - "Watch Now" opaque dark-grey CTA (~129×39px, --color-launcher-cta-opaque-bg)
 */
export function LauncherFeaturedCard({
  categoryLabel,
  title,
  description,
  ctaLabel = "Watch Now",
  onCta,
}: LauncherFeaturedCardProps) {
  return (
    <div style={{ maxWidth: 360 }}>
      {/* Merged single heading — ref shows no eyebrow; category + title joined by " - ".
          Ref measured ~22px / line-height ~1.2 (cap-height ≈15.8px, line tops y490→y521 ref ÷1.2). */}
      <h2
        style={{
          color: "var(--color-launcher-ink)",
          fontFamily: "var(--font-launcher)",
          fontSize: 22,
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: 8,
          margin: "0 0 8px",
        }}
      >
        {categoryLabel} - {title}
      </h2>

      {/* Description */}
      <p
        style={{
          color: "var(--color-launcher-ink-muted)",
          fontSize: 13,
          fontWeight: 400,
          lineHeight: 1.5,
          marginBottom: 14,
          margin: "0 0 14px",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {description}
      </p>

      {/* CTA button — opaque dark-grey fill (~129×39px per ref measurement) */}
      <button
        type="button"
        onClick={onCta}
        style={{
          display: "inline-flex",
          alignItems: "center",
          height: 39,
          padding: "0 24px",
          borderRadius: 2,
          border: "none",
          background: "var(--color-launcher-cta-opaque-bg)",
          color: "var(--color-launcher-ink)",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "background 150ms ease",
          minWidth: 129,
          justifyContent: "center",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "var(--color-launcher-cta-opaque-hover)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "var(--color-launcher-cta-opaque-bg)";
        }}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
