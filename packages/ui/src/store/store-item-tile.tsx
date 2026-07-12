"use client";

// useId removed — wishlist labels are self-contained via aria-label
import type { StoreItem } from "@low/fixtures";

// Re-export so consumers can import the type from this component module.
export type { StoreItem };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StoreItemTileProps {
  /** Item data to render. */
  item: StoreItem;
  /**
   * Visual size variant:
   * - `"grid"` — 230×130px featured-grid tile (icon top-left, quantity badge top-right)
   * - `"strip"` — 105px-wide top-sellers strip card (tall portrait thumbnail, price pill below)
   */
  size?: "grid" | "strip";
  /** Called when the tile body is clicked. */
  onClick?: (id: string) => void;
  /** Called when the wishlist heart icon is clicked. */
  onWishlist?: (id: string) => void;
  /** URL for the RP coin icon (caller-supplied from cdragon helper). */
  rpIconSrc?: string;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Format an RP price with no decimals. */
function fmtRp(n: number): string {
  return n.toLocaleString("en-US");
}

/** Heart icon — filled (wishlisted) or outline. */
function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {filled ? (
        <path
          d="M6.5 11.5C6.5 11.5 1 7.8 1 4.5a2.5 2.5 0 0 1 5-.5 2.5 2.5 0 0 1 5 .5c0 3.3-5.5 7-5.5 7Z"
          fill="currentColor"
        />
      ) : (
        <path
          d="M6.5 11.5C6.5 11.5 1 7.8 1 4.5a2.5 2.5 0 0 1 5-.5 2.5 2.5 0 0 1 5 .5c0 3.3-5.5 7-5.5 7Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
      )}
    </svg>
  );
}

/** Wishlist badge button — shown at bottom-right of tiles. */
function WishlistButton({
  wishlisted,
  itemName,
  onWishlist,
}: {
  wishlisted: boolean;
  itemName: string;
  onWishlist?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`Toggle wishlist: ${itemName}`}
      aria-pressed={wishlisted}
      onClick={(e) => {
        e.stopPropagation();
        onWishlist?.();
      }}
      className={[
        "flex items-center justify-center cursor-pointer transition-colors duration-150",
        wishlisted ? "text-gold-3" : "text-grey-1 hover:text-gold-1",
      ].join(" ")}
    >
      <HeartIcon filled={wishlisted} />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Grid tile — 230×130px featured-grid layout
// ---------------------------------------------------------------------------

function GridTile({
  item,
  onClick,
  onWishlist,
  rpIconSrc,
}: Omit<StoreItemTileProps, "size">) {
  return (
    <button
      type="button"
      aria-label={item.name}
      onClick={() => onClick?.(item.id)}
      className={[
        "group relative flex flex-col overflow-hidden cursor-pointer",
        "border border-gold-5 bg-blue-7",
        "hover:border-gold-4 transition-colors duration-150",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
      ].join(" ")}
      style={{ width: 230, height: 130 }}
    >
      {/* Background art */}
      <img
        src={item.imageUrl}
        alt=""
        aria-hidden="true"
        width={230}
        height={130}
        className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-150"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
      />

      {/* Dark gradient overlay so text is legible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(1,10,19,0.92) 0%, rgba(1,10,19,0.4) 60%, rgba(1,10,19,0.15) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Top-left: wishlist / type-icon placeholder */}
      <div className="absolute top-1.5 left-1.5 z-10">
        {/* Red "selected" marker badge (circular) — present on bundled/pass types */}
        {(item.type === "bundle" || item.type === "pass") && (
          <span
            aria-hidden="true"
            className="flex h-5 w-5 items-center justify-center rounded-full bg-riot-red text-[9px] font-bold text-white"
          >
            !
          </span>
        )}
      </div>

      {/* Top-right: quantity badge */}
      {item.quantity !== undefined && (
        <div className="absolute top-1.5 right-1.5 z-10">
          <span className="flex items-center gap-0.5 rounded-sm bg-riot-red px-1 py-0.5 text-[10px] font-bold text-white leading-none">
            {item.quantity}
            <span className="text-[8px]">x</span>
          </span>
        </div>
      )}

      {/* Bottom content */}
      <div className="absolute bottom-0 inset-x-0 z-10 flex flex-col px-2 pb-2 pt-4">
        {/* Item name */}
        <span
          className="font-display text-xs uppercase tracking-wide text-gold-1 line-clamp-2 text-center leading-tight"
        >
          {item.name}
        </span>

        {/* Price row */}
        <div className="mt-1 flex items-center justify-center gap-1">
          {rpIconSrc && (
            <img src={rpIconSrc} alt="RP" width={12} height={12} aria-hidden="true" />
          )}
          <span className="font-display text-[11px] text-gold-2">
            {fmtRp(item.rpPrice)}
          </span>
        </div>

        {/* Insufficient RP label */}
        {item.insufficientRP && (
          <span className="mt-0.5 text-center text-[10px] font-body text-warning">
            * Not enough RP
          </span>
        )}

        {/* Wishlist — bottom right corner */}
        <div className="absolute bottom-1.5 right-2">
          <WishlistButton
            wishlisted={item.isWishlisted ?? false}
            itemName={item.name}
            onWishlist={() => onWishlist?.(item.id)}
          />
        </div>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Strip tile — 105px wide top-sellers card
// ---------------------------------------------------------------------------

function StripTile({
  item,
  onClick,
  onWishlist,
  rpIconSrc,
}: Omit<StoreItemTileProps, "size">) {
  return (
    <button
      type="button"
      aria-label={item.name}
      onClick={() => onClick?.(item.id)}
      className={[
        "group relative flex flex-col overflow-hidden cursor-pointer shrink-0",
        "border border-gold-5 bg-blue-7",
        "hover:border-gold-4 transition-colors duration-150",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
      ].join(" ")}
      style={{ width: 105, height: 120 }}
    >
      {/* Splash thumbnail — fills top portion */}
      <div className="relative flex-1 overflow-hidden">
        <img
          src={item.imageUrl}
          alt=""
          aria-hidden="true"
          width={105}
          height={84}
          className="h-full w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-150"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
        />

        {/* New/sale badge — top-left */}
        <div className="absolute top-1 left-1">
          <span
            aria-hidden="true"
            className="flex h-4 w-4 items-center justify-center rounded-full bg-riot-red text-[8px] font-bold text-white"
          >
            !
          </span>
        </div>

        {/* Wishlist */}
        <div className="absolute bottom-1 right-1">
          <WishlistButton
            wishlisted={item.isWishlisted ?? false}
            itemName={item.name}
            onWishlist={() => onWishlist?.(item.id)}
          />
        </div>
      </div>

      {/* Price pill at bottom */}
      <div
        className="flex items-center justify-center gap-1 px-1 py-1 shrink-0"
        style={{ background: "rgba(1,10,19,0.88)" }}
      >
        {rpIconSrc && (
          <img src={rpIconSrc} alt="RP" width={10} height={10} aria-hidden="true" />
        )}
        <span
          className="font-display text-[10px] text-gold-2 truncate"
        >
          {fmtRp(item.rpPrice)}
        </span>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// StoreItemTile — public component
// ---------------------------------------------------------------------------

/**
 * StoreItemTile renders a single purchasable item in the Store.
 *
 * Two size variants:
 * - `"grid"` (default) — 230×130px tile for the 2×2 featured grid. Shows name, RP price,
 *   wishlist button, optional quantity badge, and "Not enough RP" warning.
 * - `"strip"` — 105px-wide card for the horizontal TOP SELLERS strip.
 *
 * Presentational only. Parent owns wishlist state and fires callbacks.
 */
export function StoreItemTile({
  item,
  size = "grid",
  onClick,
  onWishlist,
  rpIconSrc,
}: StoreItemTileProps) {
  if (size === "strip") {
    return (
      <StripTile
        item={item}
        onClick={onClick}
        onWishlist={onWishlist}
        rpIconSrc={rpIconSrc}
      />
    );
  }
  return (
    <GridTile
      item={item}
      onClick={onClick}
      onWishlist={onWishlist}
      rpIconSrc={rpIconSrc}
    />
  );
}
