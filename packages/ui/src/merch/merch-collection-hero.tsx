"use client";

/**
 * MerchCollectionHero — collection/category page banner for the Riot merch store.
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
 * Measured from merch.riotgames.com collection & category pages (~1280px desktop):
 *   - Banner: min-height ~160–200px, vertically centered content
 *   - Background (no image): --color-merch-ink (dark) / --color-merch-surface (light)
 *   - Background scrim (image): linear-gradient top→bottom var(--color-merch-hero-scrim-top) → var(--color-merch-hero-scrim-bottom)
 *   - Breadcrumb: 12px, uppercase, letter-spacing 0.05em, "/" separator
 *   - Breadcrumb links (dark bg): var(--color-merch-breadcrumb-on-dark) → white on hover
 *   - Breadcrumb links (light bg): --color-merch-muted → --color-merch-body on hover
 *   - Breadcrumb current crumb: font-weight 600, on-dark / ink
 *   - Heading: text-4xl (36px), font-weight 800, uppercase, letter-spacing 0.04em
 *   - Item count: 14px, font-weight 400, --color-merch-muted, inline ml-2
 *   - Description: mt-2, text-sm, max-w-lg
 *   - Container: max-w-7xl mx-auto px-6
 *   - PDP collection band SHOP NOW: gold (#f9c824) button, uppercase 13px/700, px-6 py-2
 *   - PDP collection band heading: decorative h2 (not h1 — PDP already has its own h1)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single breadcrumb crumb. */
export interface MerchBreadcrumb {
  /** Display label. */
  label: string;
  /** href — omit for the current (last) crumb. */
  href?: string;
  /** Called when this crumb link is clicked. */
  onClick?: () => void;
}

export interface MerchCollectionHeroProps {
  /**
   * Breadcrumb trail.
   * @example [{label:"Home",href:"/"},{label:"Collections",href:"/collection"},{label:"League Classic"}]
   */
  breadcrumbs?: MerchBreadcrumb[];
  /**
   * Collection or category name — the main heading.
   * Rendered as an `<h2>` (decorative) because the component is also used
   * as a sub-band on the PDP page which already has its own `<h1>`.
   * Override the heading level with `headingAs` when the component is the
   * primary landmark on the page.
   */
  heading: string;
  /**
   * Override the semantic heading element.
   * Defaults to "h2". Pass "h1" only when this is the page's primary heading
   * (i.e. on stand-alone category / collection pages that have no other h1).
   * @default "h2"
   */
  headingAs?: "h1" | "h2";
  /** Optional product count shown inline after the heading, e.g. 7 → "(7)". */
  itemCount?: number;
  /** Optional short description below the heading. */
  description?: string;
  /** Background image URL (full-bleed with dark scrim). Omit for solid background. */
  backgroundImageUrl?: string;
  /** Alt text for the background image. */
  backgroundImageAlt?: string;
  /**
   * Theme — controls text and background colors.
   * "dark" = white text on dark/image background (default).
   * "light" = dark text on light background.
   */
  theme?: "light" | "dark";
  /**
   * Label for the gold SHOP NOW CTA button.
   * Pass a non-empty string to show the button; omit or pass undefined to hide it.
   * Measured from the real PDP collection band: gold (#f9c824) fill, black text,
   * uppercase 13px/700, px-6 py-2, no border-radius (square corners like real site).
   * @default "SHOP NOW"
   */
  ctaLabel?: string;
  /**
   * Called when the gold CTA button is clicked.
   * If undefined and ctaLabel is set, the button renders but does nothing.
   */
  onCtaClick?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchCollectionHero — compact banner for collection/category pages and
 * the PDP "SHOP NOW" franchise band.
 *
 * @example — category page (h1, no CTA)
 * <MerchCollectionHero
 *   headingAs="h1"
 *   heading="League Classic"
 *   itemCount={7}
 *   breadcrumbs={[{label:"Home",href:"/"},{label:"Collections",href:"/collection"},{label:"League Classic"}]}
 * />
 *
 * @example — PDP collection band (h2, gold SHOP NOW, franchise splash)
 * <MerchCollectionHero
 *   heading="League of Legends"
 *   description="Explore the full collection."
 *   backgroundImageUrl={franchiseSplashUrl}
 *   ctaLabel="SHOP NOW"
 *   onCtaClick={() => router.push("/merch/shop-all")}
 *   theme="dark"
 * />
 */
export function MerchCollectionHero({
  breadcrumbs,
  heading,
  headingAs,
  itemCount,
  description,
  backgroundImageUrl,
  backgroundImageAlt,
  theme = "dark",
  ctaLabel,
  onCtaClick,
}: MerchCollectionHeroProps) {
  const isDark = theme === "dark";
  const HeadingTag = headingAs ?? "h2";

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        minHeight: 160,
        backgroundColor: isDark
          ? "var(--color-merch-ink)"
          : "var(--color-merch-surface)",
        fontFamily: "var(--font-merch)",
      }}
    >
      {/* Background image + scrim */}
      {backgroundImageUrl && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundImageUrl}
            alt={backgroundImageAlt ?? heading}
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="eager"
            draggable={false}
          />
          {/* Scrim */}
          <div
            className="absolute inset-0"
            aria-hidden
            style={{
              background:
                "linear-gradient(to bottom, var(--color-merch-hero-scrim-top) 0%, var(--color-merch-hero-scrim-bottom) 100%)",
            }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-6 py-10">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex flex-wrap items-center gap-0 text-[12px] uppercase tracking-[0.05em]">
              {breadcrumbs.map((crumb, i) => {
                const isLast = i === breadcrumbs.length - 1;
                return (
                  <li key={`${crumb.label}-${i}`} className="flex items-center">
                    {/* Separator (not before first crumb) */}
                    {i > 0 && (
                      <span
                        className="mx-1.5"
                        aria-hidden
                        style={{ color: "var(--color-merch-muted)" }}
                      >
                        /
                      </span>
                    )}

                    {/* Last crumb: non-linked, current */}
                    {isLast || !crumb.href ? (
                      <span
                        className="font-semibold"
                        aria-current={isLast ? "page" : undefined}
                        style={{
                          color: isDark
                            ? "var(--color-merch-on-dark)"
                            : "var(--color-merch-ink)",
                        }}
                      >
                        {crumb.label}
                      </span>
                    ) : (
                      <a
                        href={crumb.href}
                        onClick={
                          crumb.onClick
                            ? (e) => {
                                e.preventDefault();
                                crumb.onClick?.();
                              }
                            : undefined
                        }
                        className="transition-colors duration-100"
                        style={
                          isDark
                            ? {
                                color: "var(--color-merch-breadcrumb-on-dark)",
                              }
                            : {
                                color: "var(--color-merch-muted)",
                              }
                        }
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.color =
                            isDark
                              ? "var(--color-merch-on-dark)"
                              : "var(--color-merch-body)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.color =
                            isDark
                              ? "var(--color-merch-breadcrumb-on-dark)"
                              : "var(--color-merch-muted)";
                        }}
                      >
                        {crumb.label}
                      </a>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        {/* Heading + item count */}
        <HeadingTag
          className="text-4xl font-extrabold uppercase tracking-[0.04em] leading-tight"
          style={{
            color: isDark
              ? "var(--color-merch-on-dark)"
              : "var(--color-merch-ink)",
          }}
        >
          {heading}
          {itemCount !== undefined && (
            <span
              className="ml-2 text-sm font-normal"
              style={{ color: "var(--color-merch-muted)" }}
            >
              ({itemCount})
            </span>
          )}
        </HeadingTag>

        {/* Optional description */}
        {description && (
          <p
            className="mt-2 max-w-lg text-sm"
            style={{
              color: isDark
                ? "var(--color-merch-body-on-dark)"
                : "var(--color-merch-body)",
            }}
          >
            {description}
          </p>
        )}

        {/* Gold SHOP NOW CTA — PDP collection band only */}
        {ctaLabel && (
          <div className="mt-5">
            <button
              type="button"
              onClick={onCtaClick}
              className="inline-block cursor-pointer border-0 px-6 py-2 text-[13px] font-bold uppercase tracking-[0.08em] transition-opacity duration-150 hover:opacity-90"
              style={{
                backgroundColor: "var(--color-merch-gold)",
                color: "var(--color-merch-ink)",
              }}
            >
              {ctaLabel}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
