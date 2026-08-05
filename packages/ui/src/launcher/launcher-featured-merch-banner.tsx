/**
 * LauncherFeaturedMerchBanner — large featured merch product banner for the
 * Launcher Merch tab (ref: lol-launcher-ref/image-4.png).
 *
 * LAUNCHER COMPONENT — uses `--color-launcher-*` tokens exclusively.
 * Layout: horizontal flex, text-left (~45%) / image-right (~55%).
 * Accepts a `MerchProduct` type from @low/fixtures; image URLs are supplied
 * by the caller (page / showcase).
 *
 * Server-safe: no 'use client'. Stateful demos belong in a *.demo.tsx file.
 */

import type { MerchProduct } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LauncherFeaturedMerchBannerProps {
  /** Product data — type from @low/fixtures; values supplied by the page. */
  product: MerchProduct;
  /**
   * Optional override for the category chip label.
   * Defaults to "Merch".
   */
  categoryLabel?: string;
  /**
   * Optional description text. Falls back to a generic excerpt.
   * Supply this to show the real product description line from the ref.
   */
  description?: string;
  /** Called when the banner is clicked. Receives the product slug. */
  onClick?: (slug: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * LauncherFeaturedMerchBanner — horizontal dark-themed merch hero card.
 *
 * - Left ~45%: category chip + title (display font, 20px/700) + description
 * - Right ~55%: product lifestyle image, object-fit cover, hover scale 1.03
 * - Background: `--color-launcher-surface` (#111111); border: `--color-launcher-border`
 */
export function LauncherFeaturedMerchBanner({
  product,
  categoryLabel = "Merch",
  description,
  onClick,
}: LauncherFeaturedMerchBannerProps) {
  const desc =
    description ??
    "Dust off your rune pages with the League of Legends Classic Yearbook Tee.";

  return (
    <article
      role="article"
      className="group flex w-full flex-row overflow-hidden"
      style={{
        height: 200,
        backgroundColor: "var(--color-launcher-content-bg)",
        border: "1px solid var(--color-launcher-border)",
        borderRadius: 2,
        cursor: onClick ? "pointer" : "default",
      }}
      {...(onClick ? { onClick: () => onClick(product.slug) } : {})}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Left — text area (~45%)                                              */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="flex flex-col justify-center gap-2"
        style={{
          width: "45%",
          flexShrink: 0,
          padding: "24px 28px",
        }}
      >
        {/* Category chip */}
        <span
          className="inline-block self-start text-[10px] font-bold uppercase tracking-[0.1em]"
          style={{
            padding: "3px 8px",
            backgroundColor: "var(--color-launcher-chip-bg)",
            border: "1px solid var(--color-launcher-chip-border)",
            borderRadius: 2,
            color: "var(--color-launcher-ink)",
            letterSpacing: "0.1em",
          }}
        >
          {categoryLabel}
        </span>

        {/* Product title — display font, 20px/700, line-clamp 2 */}
        <p
          className="line-clamp-2 font-bold leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            lineHeight: 1.2,
            color: "var(--color-launcher-ink)",
          }}
        >
          {product.title}
        </p>

        {/* Description — 12px/400, muted, line-clamp 3 */}
        <p
          className="line-clamp-3 leading-relaxed"
          style={{
            fontSize: 12,
            fontWeight: 400,
            lineHeight: 1.5,
            color: "var(--color-launcher-ink-muted)",
          }}
        >
          {desc}
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Right — image area (~55%)                                            */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="relative overflow-hidden"
        style={{ flex: 1 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
          style={{ display: "block" }}
        />
      </div>
    </article>
  );
}
