/**
 * LauncherFeaturedCard — bottom-left overlay card for the Overview hero splash.
 *
 * In the ref: category label "League Classic Cinematic", title "Welcome Back, Summoners",
 * body description, and a "Watch Now" CTA button. Rendered as a child slot of
 * LauncherOverviewHero — the hero scrim provides the dark canvas.
 *
 * Token source: packages/tokens/src/theme.css — --color-launcher-* set (issues #679, #681, #684).
 */

"use client";

export interface LauncherFeaturedCardProps {
  /** Small category label above the title. E.g. "League Classic Cinematic". */
  categoryLabel: string;
  /** Main heading. E.g. "Welcome Back, Summoners". */
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
 * Layout (measured from lol-launcher-ref/image.png at ~1536px):
 *   - max-width ≈ 420px; height auto; transparent bg (hero scrim provides dark canvas)
 *   - Category label (muted, 11px/600, uppercase, tracking-wide)
 *   - Title (white, 22px/700, display font, max 2 lines)
 *   - Description (muted, 13px/400, line-clamped to 3)
 *   - "Watch Now" frosted-glass CTA button (32px, fit-content, hover state)
 */
export function LauncherFeaturedCard({
  categoryLabel,
  title,
  description,
  ctaLabel = "Watch Now",
  onCta,
}: LauncherFeaturedCardProps) {
  return (
    <div style={{ maxWidth: 420 }}>
      {/* Category label */}
      <p
        style={{
          color: "var(--color-launcher-ink-muted)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 6,
          margin: "0 0 6px",
        }}
      >
        {categoryLabel}
      </p>

      {/* Title */}
      <h2
        style={{
          color: "var(--color-launcher-ink)",
          fontFamily: "var(--font-display)",
          fontSize: 22,
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: 8,
          margin: "0 0 8px",
        }}
      >
        {title}
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

      {/* "Watch Now" CTA button */}
      <button
        type="button"
        onClick={onCta}
        style={{
          display: "inline-flex",
          alignItems: "center",
          height: 32,
          padding: "0 16px",
          borderRadius: 2,
          border: "1px solid var(--color-launcher-cta-border)",
          background: "var(--color-launcher-cta-bg)",
          color: "var(--color-launcher-ink)",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "background 150ms ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "var(--color-launcher-cta-hover-bg)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "var(--color-launcher-cta-bg)";
        }}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
