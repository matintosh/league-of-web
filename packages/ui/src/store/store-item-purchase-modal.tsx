"use client";

import { useRef } from "react";
import type { MouseEvent } from "react";
import type { PurchaseItem } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StoreItemPurchaseModalProps {
  /** Whether the modal is visible. When false, renders nothing. */
  open: boolean;
  /** Full-bleed set art shown in Zone 1 (left portrait tile). */
  setArtUrl: string;
  /** Bundle / set display name, e.g. "Arcade Caitlyn Border Set". */
  setName: string;
  /**
   * Bullet list items for the center breakdown,
   * e.g. ["1 Champion", "1 Skin", "1 Ward Skin", "1 Icon"].
   */
  breakdown: string[];
  /** Original (pre-discount) RP price. Null means no discount — only finalPrice shown. */
  originalPrice: number | null;
  /** Discount percentage 0–100. Null means no discount. */
  discountPct: number | null;
  /** Final RP price shown on the purchase button. */
  finalPrice: number;
  /** When false the button is greyed-out and "Not enough RP" labels appear. */
  canAfford: boolean;
  /** 2×2 preview tiles shown in Zone 3. 1-item bundles: single large tile. */
  items: PurchaseItem[];
  /** URL for the RP coin icon (from rpIconUrl() helper). */
  rpIconSrc: string;
  /** Called when the purchase button is clicked (only fires when canAfford). */
  onPurchase: () => void;
  /** Called when the wishlist heart on the purchase button is clicked. */
  onWishlist: () => void;
  /** Called when the × button or backdrop is clicked. */
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function fmtRp(n: number): string {
  return n.toLocaleString("en-US");
}

/** Heart icon outline (wishlist). */
function HeartIcon() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 12C7 12 1 7.9 1 4.5a3 3 0 0 1 6-.4 3 3 0 0 1 6 .4C13 7.9 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// StoreItemPurchaseModal
// ---------------------------------------------------------------------------

/**
 * StoreItemPurchaseModal — full-screen overlay shown when the user clicks a
 * purchasable item in the Store.
 *
 * Layout: dark backdrop (fixed inset) + centered panel (~940×430px) with a
 * `border-gold-5` Hextech frame. Three horizontal zones inside the panel:
 *
 *   Zone 1 (left  ~160px) — portrait set art with gold border
 *   Zone 2 (center ~340px) — breakdown list, price row, purchase button
 *   Zone 3 (right  ~320px) — 2×2 preview tile grid (1×1 for single items)
 *
 * Zone 4: × close button floats in the top-right corner of the panel.
 *
 * ModalFrame decision: built standalone rather than composing ModalFrame.
 * ModalFrame provides a title bar, clip-path cut corners, and a crest ornament
 * that differ from this panel's rectangular-border, floating-× design. Forcing
 * ModalFrame would require hiding most of its chrome while duplicating the
 * three-zone flex body — net code is simpler standalone.
 *
 * Purely presentational — no data fetching, no internal routing state.
 * Backdrop click and × button both call onClose.
 */
export function StoreItemPurchaseModal({
  open,
  setArtUrl,
  setName,
  breakdown,
  originalPrice,
  discountPct,
  finalPrice,
  canAfford,
  items,
  rpIconSrc,
  onPurchase,
  onWishlist,
  onClose,
}: StoreItemPurchaseModalProps) {
  const mousedownTargetRef = useRef<EventTarget | null>(null);

  if (!open) return null;

  const handleBackdropMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    mousedownTargetRef.current = e.target;
  };

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (
      mousedownTargetRef.current === e.currentTarget &&
      e.target === e.currentTarget
    ) {
      onClose();
    }
    mousedownTargetRef.current = null;
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-hextech-black/70"
      onMouseDown={handleBackdropMouseDown}
      onClick={handleBackdropClick}
    >
      {/* Panel — stops propagation so clicks inside don't close */}
      <div
        className="relative flex bg-blue-7 border border-gold-5"
        style={{ width: 940, minHeight: 430 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={setName}
      >
        {/* ---------------------------------------------------------------- */}
        {/* Zone 4 — Close button (top-right corner of panel)                */}
        {/* ---------------------------------------------------------------- */}
        <button
          type="button"
          aria-label="Close purchase modal"
          onClick={onClose}
          className={[
            "absolute -top-4 -right-4 z-10",
            "flex h-8 w-8 items-center justify-center rounded-full",
            "bg-gold-5/40 border border-gold-5 text-gold-1",
            "hover:bg-gold-4/60 hover:border-gold-4 transition-colors duration-150 cursor-pointer",
            "font-display text-base",
          ].join(" ")}
        >
          ×
        </button>

        {/* ---------------------------------------------------------------- */}
        {/* Zone 1 — Left: set art portrait                                  */}
        {/* ---------------------------------------------------------------- */}
        <div
          className="shrink-0 border-r border-gold-5 overflow-hidden"
          style={{ width: 170 }}
        >
          <img
            src={setArtUrl}
            alt={setName}
            width={170}
            height={430}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = "0";
            }}
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Zone 2 — Center: breakdown + purchase controls                   */}
        {/* ---------------------------------------------------------------- */}
        <div
          className="flex flex-col justify-start px-8 py-6 border-r border-gold-5"
          style={{ width: 340 }}
        >
          {/* Set name */}
          <h2 className="font-display text-2xl text-gold-1 leading-tight mb-4">
            {setName}
          </h2>

          {/* Bullet breakdown list */}
          <ul className="flex flex-col gap-1 mb-4" aria-label="Bundle contents">
            {breakdown.map((line) => (
              <li key={line} className="flex items-center gap-2 font-body text-sm text-grey-1">
                <span aria-hidden="true" className="text-grey-2">•</span>
                {line}
              </li>
            ))}
          </ul>

          {/* Separator */}
          <div className="border-t border-gold-5 mb-4" />

          {/* Insufficient RP — top error label */}
          {!canAfford && (
            <p className="font-body text-xs text-riot-red mb-3">
              * Not enough RP
            </p>
          )}

          {/* Price row */}
          {originalPrice !== null && discountPct !== null ? (
            <div className="flex items-center gap-2 mb-3">
              <span className="font-body text-sm text-grey-1">
                -{discountPct}%
              </span>
              <span className="font-display text-sm text-grey-2 line-through">
                {fmtRp(originalPrice)}
              </span>
            </div>
          ) : null}

          {/* Purchase button */}
          <button
            type="button"
            aria-label={`Purchase for ${fmtRp(finalPrice)} RP`}
            disabled={!canAfford}
            onClick={() => {
              if (canAfford) onPurchase();
            }}
            className={[
              "flex items-center gap-2 px-5 py-2.5 border transition-colors duration-150 cursor-pointer",
              canAfford
                ? "bg-gold-5/30 border-gold-5 text-gold-1 hover:bg-gold-4/40 hover:border-gold-4"
                : "bg-grey-3 border-gold-5 text-grey-2 opacity-70 cursor-not-allowed",
            ].join(" ")}
            style={{ width: "fit-content" }}
          >
            <span className="text-grey-2">
              <HeartIcon />
            </span>
            {rpIconSrc && (
              <img src={rpIconSrc} alt="RP" width={14} height={14} aria-hidden="true" />
            )}
            <span className="font-display text-base">{fmtRp(finalPrice)}</span>
          </button>

          {/* Insufficient RP — bottom caption */}
          {!canAfford && (
            <p className="font-body text-xs text-riot-red mt-2">
              Not enough RP
            </p>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Zone 3 — Right: 2×2 preview tile grid                           */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex flex-1 items-center justify-center p-6">
          {items.length === 1 ? (
            /* Single item: one large tile */
            <PreviewTile item={items[0]!} size="lg" />
          ) : (
            /* Multi-item: 2-column grid */
            <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {items.slice(0, 4).map((item) => (
                <PreviewTile key={item.id} item={item} size="sm" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PreviewTile — item preview in Zone 3
// ---------------------------------------------------------------------------

function PreviewTile({
  item,
  size,
}: {
  item: PurchaseItem;
  size: "sm" | "lg";
}) {
  const tileW = size === "lg" ? 240 : 150;
  const tileH = size === "lg" ? 200 : 140;

  return (
    <div
      className="flex flex-col border border-gold-4 overflow-hidden bg-blue-6"
      style={{ width: tileW, height: tileH }}
    >
      {/* Art */}
      <div className="relative flex-1 overflow-hidden">
        <img
          src={item.artUrl}
          alt={item.name}
          width={tileW}
          height={tileH - 40}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = "0";
          }}
        />
      </div>

      {/* Name + category label */}
      <div className="flex flex-col items-center justify-center px-1 py-1.5 shrink-0 bg-blue-7/80">
        <span className="font-display text-xs uppercase tracking-wide text-gold-1 text-center leading-tight line-clamp-1">
          {item.name}
        </span>
        <span className="font-body text-xs uppercase text-grey-2 mt-0.5">
          {item.category}
        </span>
      </div>
    </div>
  );
}
