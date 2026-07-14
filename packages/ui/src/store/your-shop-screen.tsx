"use client";

import { useId } from "react";
import { YourShopIcon } from "./your-shop-icon";
import type { YourShopIconVideoSources } from "./your-shop-icon";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * One card in the Your Shop personalised sale overlay.
 *
 * 2024-era (October 2024): six discounted skin/champion offers per player,
 * delivered as a periodic personalised sale via the chest icon in the top nav.
 */
export interface YourShopCard {
  /** Stable offer id. */
  id: string;
  /** When false: renders a mystery hexagonal locked tile. When true: shows skin art + badge + price. */
  revealed: boolean;
  /** Skin splash art URL — required when revealed=true. */
  artSrc?: string;
  /** Discount percentage, e.g. 50 for "-50%". */
  discountPct?: number;
  /** Original RP price before discount (shown struck-through). */
  originalRpPrice?: number;
  /** Final RP price after discount. */
  rpPrice?: number;
  /** Skin display name used for aria-label. */
  skinName?: string;
  /** Called when the mystery card is clicked to reveal it. */
  onReveal?: () => void;
  /** Called when the "buy" button is clicked on a revealed card. */
  onPurchase?: () => void;
}

export interface YourShopScreenProps {
  /**
   * Exactly 6 cards. Each may be revealed or unrevealed.
   * Shell owns which are revealed; pass `onReveal` to handle transitions.
   */
  cards: YourShopCard[];
  /** Footer expiry text, e.g. "Offers expire October 30 at 18:00 EET". */
  expiryLabel: string;
  /**
   * When true renders "Offers include Champion if unowned." note.
   * @default true
   */
  includesChampionNote?: boolean;
  /** Called when the × close button is pressed. */
  onClose?: () => void;
  /** Called when "Reveal All" button is pressed (if provided, the button is rendered). */
  onRevealAll?: () => void;
  /** Optional RP coin icon URL (CDragon or DDragon). */
  rpIconSrc?: string;
  /**
   * Real-client Your Shop navbar-icon CTA videos (issue #317). When provided,
   * the header renders the animated `YourShopIcon` entry-point badge — its
   * `ctaIntro` plays once, then `ctaLoop` idles as an attention loop; a `click`
   * burst plays on activation. Omit to render the static glyph only.
   *
   * Live-client entry-point gap: the app has no navbar/store trigger that opens
   * this overlay (it is showcase-only), so per issue #317 the CTA icon lives in
   * the store screen header. Pages supply these from `@low/fixtures`
   * (`yourShopIconVideoUrl`).
   */
  iconVideoSources?: YourShopIconVideoSources;
  /** Called when the header Your Shop CTA icon is activated. */
  onIconActivate?: () => void;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

/** × close glyph. */
function CloseIcon() {
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
        d="M1 1l12 12M13 1L1 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** RP coin fallback icon when no rpIconSrc is provided. */
function RpCoinIcon() {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1" />
      <text
        x="6"
        y="9"
        textAnchor="middle"
        fill="currentColor"
        fontSize="6"
        fontWeight="bold"
      >
        RP
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Mystery (unrevealed) card
// ---------------------------------------------------------------------------

/**
 * Dark hexagonal locked tile shown before a card is revealed.
 * Clicking fires onReveal.
 */
function MysteryCard({
  card,
  patternId,
}: {
  card: YourShopCard;
  patternId: string;
}) {
  const isClickable = !!card.onReveal;

  return (
    <button
      type="button"
      aria-label={`Reveal mystery offer${isClickable ? "" : " (not yet available)"}`}
      onClick={isClickable ? card.onReveal : undefined}
      disabled={!isClickable}
      className={[
        "relative flex flex-col overflow-hidden",
        "border-2 border-gold-5",
        "transition-all duration-200",
        isClickable
          ? "cursor-pointer hover:border-gold-3 hover:shadow-lg"
          : "cursor-default",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
      ].join(" ")}
      style={{ width: "100%", aspectRatio: "3/4", minWidth: 120 }}
    >
      {/* Dark teal-navy background */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "var(--color-blue-5)" }}
        aria-hidden="true"
      />

      {/* Hexagonal tile pattern overlay */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width="34"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            {/* Two-row hex tile pattern: offset hex grid */}
            <polygon
              points="17,2 30,9.5 30,24.5 17,32 4,24.5 4,9.5"
              fill="none"
              stroke="var(--color-blue-3)"
              strokeWidth="1"
            />
            <polygon
              points="34,22 47,29.5 47,44.5 34,52 21,44.5 21,29.5"
              fill="none"
              stroke="var(--color-blue-3)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      {/* Center glowing hexagon accent */}
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <svg
          width="80"
          height="92"
          viewBox="0 0 80 92"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer glow hex */}
          <polygon
            points="40,4 76,23 76,69 40,88 4,69 4,23"
            fill="none"
            stroke="var(--color-blue-3)"
            strokeWidth="1.5"
            opacity="0.6"
          />
          {/* Inner filled hex — teal shimmer */}
          <polygon
            points="40,16 68,30.5 68,61.5 40,76 12,61.5 12,30.5"
            fill="var(--color-blue-4)"
            opacity="0.9"
          />
          {/* Center vertical accent bar — blue glow */}
          <rect
            x="36"
            y="26"
            width="8"
            height="40"
            rx="2"
            fill="var(--color-blue-2)"
            opacity="0.75"
          />
        </svg>
      </div>

      {/* Top and bottom border decoration lines (Hextech frame) */}
      <div
        className="absolute top-0 inset-x-0 h-[2px]"
        style={{ backgroundColor: "var(--color-gold-4)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 inset-x-0 h-[2px]"
        style={{ backgroundColor: "var(--color-gold-4)" }}
        aria-hidden="true"
      />

      {/* Corner accent dots */}
      <div className="absolute top-1.5 left-1.5 h-1.5 w-1.5 rounded-full bg-gold-4" aria-hidden="true" />
      <div className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-gold-4" aria-hidden="true" />
      <div className="absolute bottom-1.5 left-1.5 h-1.5 w-1.5 rounded-full bg-gold-4" aria-hidden="true" />
      <div className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-gold-4" aria-hidden="true" />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Revealed skin card
// ---------------------------------------------------------------------------

function RevealedCard({
  card,
  rpIconSrc,
}: {
  card: YourShopCard;
  rpIconSrc?: string;
}) {
  return (
    <div
      className="relative flex flex-col overflow-hidden border-2 border-gold-5"
      style={{ width: "100%", aspectRatio: "3/4", minWidth: 120 }}
      aria-label={card.skinName ?? "Skin offer"}
    >
      {/* Art fills full card */}
      <img
        src={card.artSrc ?? ""}
        alt={card.skinName ?? "Skin splash art"}
        className="absolute inset-0 h-full w-full object-cover object-top"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.opacity = "0";
        }}
      />

      {/* Gradient overlay so price bar is readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, color-mix(in srgb, var(--color-hextech-black) 95%, transparent) 0%, color-mix(in srgb, var(--color-hextech-black) 50%, transparent) 35%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      {/* Discount badge — top-left */}
      {card.discountPct !== undefined && (
        <div className="absolute top-2 left-2 z-10">
          <span
            className="flex items-center justify-center px-2 py-0.5 font-display text-xs font-bold text-hextech-black"
            style={{ backgroundColor: "var(--color-gold-2)" }}
          >
            -{card.discountPct}%
          </span>
          {/* Small triangle pointer below badge */}
          <div
            className="mx-auto"
            style={{
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid var(--color-gold-2)",
            }}
          />
        </div>
      )}

      {/* Bottom price zone */}
      <div className="absolute bottom-0 inset-x-0 z-10 px-2 pb-2 pt-3">
        {/* Skin name */}
        {card.skinName && (
          <p className="font-display text-[11px] uppercase tracking-wide text-gold-1 text-center line-clamp-2 leading-tight mb-1">
            {card.skinName}
          </p>
        )}

        {/* Original price (struck-through) */}
        {card.originalRpPrice !== undefined && (
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <span className="font-body text-[10px] text-grey-1 line-through">
              {card.originalRpPrice.toLocaleString("en-US")} RP
            </span>
          </div>
        )}

        {/* Final price row */}
        {card.rpPrice !== undefined && (
          <div className="flex items-center justify-center gap-1">
            {rpIconSrc ? (
              <img
                src={rpIconSrc}
                alt="RP"
                width={12}
                height={12}
                aria-hidden="true"
              />
            ) : (
              <span className="text-gold-2">
                <RpCoinIcon />
              </span>
            )}
            <span className="font-display text-[13px] text-gold-2">
              {card.rpPrice.toLocaleString("en-US")}
            </span>
          </div>
        )}

        {/* Purchase button */}
        {card.onPurchase && (
          <button
            type="button"
            onClick={card.onPurchase}
            className="mt-2 w-full cursor-pointer font-display text-[10px] uppercase tracking-wider text-hextech-black py-1 transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--color-gold-2)" }}
          >
            Purchase
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// YourShopScreen — public component
// ---------------------------------------------------------------------------

/**
 * YourShopScreen — full-screen overlay for the personalised skin sale.
 *
 * 2024-era (October 2024): accessed via chest/bag icon in the top navigation bar.
 * Shows 6 personalised discounted skin/champion offers. Cards start as mystery hexagons
 * and flip to skin art + discount badge on reveal.
 *
 * Shell owns the `cards` array and which cards have `revealed: true`.
 * `onReveal` on each card fires when a mystery card is clicked.
 * `onRevealAll` fires when the "Reveal All" button is clicked (shell flips all cards).
 */
export function YourShopScreen({
  cards,
  expiryLabel,
  includesChampionNote = true,
  onClose,
  onRevealAll,
  rpIconSrc,
  iconVideoSources,
  onIconActivate,
}: YourShopScreenProps) {
  const uid = useId();

  const patternIds = [0, 1, 2, 3, 4, 5].map((i) => `${uid}-hex-${i}`);

  const allRevealed = cards.every((c) => c.revealed);
  const hasAnyUnrevealed = cards.some((c) => !c.revealed);

  return (
    <div
      className="relative flex flex-col w-full h-full min-h-0 overflow-hidden"
      style={{ backgroundColor: "var(--color-hextech-black)" }}
      aria-label="Your Shop — personalised skin sale"
    >
      {/* Subtle teal ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 60%, color-mix(in srgb, var(--color-blue-3) 6%, transparent) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* ------------------------------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------------------------------ */}
      <header className="relative z-10 flex items-center justify-center pt-6 pb-4 shrink-0">
        {/* Decorative horizontal rule — left arm */}
        <div
          className="flex-1 mx-4"
          style={{ height: 1, background: "linear-gradient(to right, transparent, var(--color-gold-5))" }}
          aria-hidden="true"
        />

        {/* Title cluster: entry-point CTA icon + heading. The icon is the store
            screen's Your Shop entry point (live-client navbar trigger gap, issue
            #317) — it carries the intro→loop attention CTA and the click burst. */}
        <div className="flex items-center gap-3 mx-4">
          <YourShopIcon
            label="Your Shop"
            videoSources={iconVideoSources}
            onActivate={onIconActivate}
          />
          <h1 className="font-display text-xl uppercase tracking-[0.25em] text-gold-cream">
            Your Shop
          </h1>
        </div>

        {/* Decorative horizontal rule — right arm */}
        <div
          className="flex-1 mx-4"
          style={{ height: 1, background: "linear-gradient(to left, transparent, var(--color-gold-5))" }}
          aria-hidden="true"
        />

        {/* Close button */}
        {onClose && (
          <button
            type="button"
            aria-label="Close Your Shop"
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center h-7 w-7 text-grey-1 hover:text-gold-1 cursor-pointer transition-colors duration-150"
          >
            <CloseIcon />
          </button>
        )}
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Card row */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 min-h-0">
        <div className="w-full flex gap-3 justify-center">
          {cards.slice(0, 6).map((card, i) => (
            <div key={card.id} className="flex-1" style={{ maxWidth: 210 }}>
              {card.revealed ? (
                <RevealedCard card={card} rpIconSrc={rpIconSrc} />
              ) : (
                <MysteryCard card={card} patternId={patternIds[i]!} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Footer */}
      {/* ------------------------------------------------------------------ */}
      <footer className="relative z-10 shrink-0 flex flex-col items-center px-8 py-4 gap-1">
        {/* Reveal All button — only shown when there are unrevealed cards */}
        {onRevealAll && hasAnyUnrevealed && (
          <button
            type="button"
            onClick={onRevealAll}
            className="mb-3 cursor-pointer font-display text-xs uppercase tracking-wider text-hextech-black px-6 py-1.5 transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--color-gold-2)" }}
          >
            Reveal All
          </button>
        )}

        <p className="font-body text-[11px] text-grey-1">{expiryLabel}</p>

        {includesChampionNote && (
          <p className="font-body text-[11px] text-grey-2">
            Offers include Champion if unowned.
          </p>
        )}

        <p className="font-body text-[10px] text-grey-2 text-center max-w-xl leading-relaxed mt-0.5">
          Reveal mystery discounts on skins &amp; champions. See something you
          like? Be sure to pick it up before time runs out! These discounts are
          only available here.
        </p>
      </footer>
    </div>
  );
}
