/**
 * LauncherMerchProductTile — compact dark product tile for the Launcher Merch tab.
 *
 * Replaces the white MerchProductCard in the launcher context. The launcher
 * Merch tab shows compact dark tiles — no franchise header, no badges, no heart,
 * no Add-to-Cart strip. Matches the reference dark compact tile in image-4.png.
 *
 * LAUNCHER COMPONENT — uses `--color-launcher-*` tokens exclusively.
 * Zero raw hex/rgba; zero default Tailwind palette.
 *
 * Props: slug, title, imageUrl, price, originalPrice?, onClick?
 *
 * Server-safe: no 'use client'. Stateful demos belong in a *.demo.tsx file.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LauncherMerchProductTileProps {
  /** Product slug — used as the key and passed to onClick. */
  slug: string;
  /** Product display title. Shown in the info strip, ~13px/600, 2-line clamp. */
  title: string;
  /**
   * Product image URL. Supplied by the page / showcase via fixtures helpers
   * (e.g. `product.imageUrl` from MERCH_PRODUCTS).
   */
  imageUrl: string;
  /** Formatted price string, e.g. "$34.99". */
  price: string;
  /** Optional original price for struck-through sale display, e.g. "$44.99". */
  originalPrice?: string;
  /** Called when the tile is clicked. Receives the product slug. */
  onClick?: (slug: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * LauncherMerchProductTile — compact dark launcher product tile.
 *
 * Layout (top → bottom):
 *   - Product thumbnail image: 100% wide × 100px tall, object-cover
 *   - Info strip (light bg): title 13px/600 (2-line clamp) + price 12px/400
 *
 * No franchise header row, no badge chips, no heart icon, no Add-to-Cart strip.
 * Tile bg: `--color-launcher-content-bg`; border: `--color-launcher-border`.
 */
export function LauncherMerchProductTile({
  slug,
  title,
  imageUrl,
  price,
  originalPrice,
  onClick,
}: LauncherMerchProductTileProps) {
  return (
    <article
      role="article"
      className="group flex flex-col overflow-hidden"
      style={{
        backgroundColor: "var(--color-launcher-content-bg)",
        border: "1px solid var(--color-launcher-border)",
        borderRadius: 2,
        cursor: onClick ? "pointer" : "default",
        minWidth: 0,
      }}
      {...(onClick ? { onClick: () => onClick(slug) } : {})}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Product image — 100% wide × 100px tall, object-cover               */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="relative overflow-hidden"
        style={{ height: 100, flexShrink: 0 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
          style={{ display: "block" }}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Info strip — title + price                                          */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="flex flex-col"
        style={{
          padding: "8px 10px",
          backgroundColor: "var(--color-launcher-tile-strip-bg)",
          gap: 3,
          flex: 1,
        }}
      >
        {/* Title — 13px/600, 2-line clamp */}
        <p
          className="line-clamp-2 font-semibold leading-tight"
          style={{
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.3,
            color: "var(--color-launcher-tile-strip-ink)",
          }}
        >
          {title}
        </p>

        {/* Price row */}
        <div
          className="flex items-baseline gap-1"
          style={{ marginTop: "auto" }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 400,
              color: "var(--color-launcher-tile-strip-ink)",
            }}
          >
            {price}
          </span>
          {originalPrice && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 400,
                color: "var(--color-launcher-tile-strip-ink-muted)",
                textDecoration: "line-through",
              }}
            >
              {originalPrice}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
