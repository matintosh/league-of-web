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
  /**
   * Called when a revealed card is clicked to purchase it.
   *
   * The real client has no per-card PURCHASE button (issue #368): the entire
   * revealed card is the click target and clicking it surfaces the standard
   * purchase modal. When provided, the revealed card renders as a `<button>`;
   * when omitted, it renders as a static, non-interactive tile.
   */
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
// Shared layout constants
// ---------------------------------------------------------------------------

/**
 * Card frame aspect (width / height). The real Your Shop cards are TALL narrow
 * frames — measured 206×513 px on the 2082-wide reference (issue #368), giving
 * w/h ≈ 0.40. Both revealed and unrevealed cards share this frame.
 */
const CARD_ASPECT = "206 / 513";

/**
 * Share of the revealed card's height occupied by the splash art; the remaining
 * ~27% is the dark price band housing the discount, struck price and RP price.
 * Measured from the reference: art collapses to the band at ~73% of frame height.
 */
const ART_HEIGHT_PCT = "73%";

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
 * Rectangular locked panel matching the real client's unrevealed mystery state.
 *
 * Measured from docs/reference/client-your-shop-unrevealed.png (issue #1074):
 *   - Two flanking vertical tech-line pairs at ~18% / ~82% from left (double-bar,
 *     ~10% card width wide each), running from ~12% to ~88% card height.
 *   - A single central glowing bar (~8% card width) with a teal/blue radial glow.
 *   - Gold L-bracket corner ornaments at all four corners (~10% wide × ~6% tall arms).
 *   - Background: very dark navy panel (hextech-black with a subtle blue-6 tint).
 *
 * Clicking fires onReveal. Same footprint as RevealedCard (CARD_ASPECT 206/513).
 */
function MysteryCard({
  card,
  glowId,
}: {
  card: YourShopCard;
  /** Stable SVG gradient id — supply from useId to avoid duplicate ids. */
  glowId: string;
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
        "border border-gold-5",
        "transition-all duration-200",
        isClickable
          ? "cursor-pointer hover:border-gold-3 hover:shadow-lg"
          : "cursor-default",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
      ].join(" ")}
      style={{ width: "100%", aspectRatio: CARD_ASPECT, minWidth: 90 }}
    >
      {/* Dark navy background — hextech-black with a subtle blue-6 inner tint */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, var(--color-blue-7) 0%, var(--color-hextech-black) 40%, var(--color-hextech-black) 60%, var(--color-blue-7) 100%)",
        }}
        aria-hidden="true"
      />

      {/* SVG layer: tech-lines + central glow bar */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 249"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Radial glow for the central bar */}
          <radialGradient id={glowId} cx="50%" cy="50%" r="50%" gradientUnits="userSpaceOnUse"
            gradientTransform="translate(50,124.5) scale(8,100) translate(-50,-124.5)">
            <stop offset="0%" stopColor="var(--color-blue-2)" stopOpacity="0.9" />
            <stop offset="60%" stopColor="var(--color-blue-3)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-blue-3)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Left flanking tech-line pair: two close parallel bars ── */}
        {/* Outer left line */}
        <rect x="15" y="30" width="1.5" height="189" fill="var(--color-gold-5)" opacity="0.7" />
        {/* Inner left line (closer to center) */}
        <rect x="20" y="30" width="1" height="189" fill="var(--color-gold-5)" opacity="0.5" />

        {/* ── Right flanking tech-line pair (mirror) ── */}
        {/* Inner right line */}
        <rect x="79" y="30" width="1" height="189" fill="var(--color-gold-5)" opacity="0.5" />
        {/* Outer right line */}
        <rect x="83.5" y="30" width="1.5" height="189" fill="var(--color-gold-5)" opacity="0.7" />

        {/* ── Central glowing bar ── */}
        {/* Glow halo behind the bar */}
        <rect x="44" y="50" width="12" height="149"
          fill={`url(#${glowId})`} />
        {/* Bar body */}
        <rect x="47.5" y="50" width="5" height="149" rx="1"
          fill="var(--color-blue-2)" opacity="0.85" />
        {/* Bright core line */}
        <rect x="49" y="50" width="2" height="149" rx="0.5"
          fill="var(--color-blue-1)" opacity="0.6" />

        {/* Small horizontal cross-connectors on the tech-lines (midpoint accent) */}
        <rect x="15" y="120" width="6.5" height="1" fill="var(--color-gold-5)" opacity="0.5" />
        <rect x="78.5" y="120" width="6.5" height="1" fill="var(--color-gold-5)" opacity="0.5" />
      </svg>

      {/* ── Gold L-bracket corner ornaments ── */}
      {/* Each bracket = two thin gold lines meeting at a right-angle corner.
          Arms: ~10px wide / tall at card scale (proportional to 90px minWidth).
          Rendered as a small SVG per corner for crisp rendering at any size. */}

      {/* Top-left */}
      <svg
        aria-hidden="true"
        className="absolute top-0 left-0 pointer-events-none"
        style={{ width: "22%", height: "11%" }}
        viewBox="0 0 22 14"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline
          points="22,2 2,2 2,14"
          fill="none"
          stroke="var(--color-gold-4)"
          strokeWidth="2"
          strokeLinecap="square"
        />
      </svg>

      {/* Top-right */}
      <svg
        aria-hidden="true"
        className="absolute top-0 right-0 pointer-events-none"
        style={{ width: "22%", height: "11%" }}
        viewBox="0 0 22 14"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline
          points="0,2 20,2 20,14"
          fill="none"
          stroke="var(--color-gold-4)"
          strokeWidth="2"
          strokeLinecap="square"
        />
      </svg>

      {/* Bottom-left */}
      <svg
        aria-hidden="true"
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{ width: "22%", height: "11%" }}
        viewBox="0 0 22 14"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline
          points="22,12 2,12 2,0"
          fill="none"
          stroke="var(--color-gold-4)"
          strokeWidth="2"
          strokeLinecap="square"
        />
      </svg>

      {/* Bottom-right */}
      <svg
        aria-hidden="true"
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{ width: "22%", height: "11%" }}
        viewBox="0 0 22 14"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline
          points="0,12 20,12 20,0"
          fill="none"
          stroke="var(--color-gold-4)"
          strokeWidth="2"
          strokeLinecap="square"
        />
      </svg>
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
  const isClickable = !!card.onPurchase;

  // The whole card is the purchase target (no per-card button, per issue #368).
  // Render as a <button> when purchasable, else a plain static tile.
  const Tag = isClickable ? "button" : "div";

  return (
    <Tag
      {...(isClickable
        ? {
            type: "button" as const,
            onClick: card.onPurchase,
            "aria-label": `Purchase ${card.skinName ?? "skin offer"}`,
          }
        : { "aria-label": card.skinName ?? "Skin offer" })}
      className={[
        "relative flex flex-col overflow-hidden border-2 border-gold-5 text-left",
        isClickable
          ? "cursor-pointer transition-[border-color,box-shadow] duration-150 hover:border-gold-3 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3"
          : "",
      ].join(" ")}
      style={{ width: "100%", aspectRatio: CARD_ASPECT, minWidth: 90 }}
    >
      {/* Art zone — top ~73% of the frame */}
      <div
        className="relative w-full shrink-0 overflow-hidden"
        style={{ height: ART_HEIGHT_PCT }}
      >
        <img
          src={card.artSrc ?? ""}
          alt={card.skinName ?? "Skin splash art"}
          className="absolute inset-0 h-full w-full object-cover object-top"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = "0";
          }}
        />
      </div>

      {/* Dark price band — bottom ~27%. Houses discount + struck price + RP. */}
      <div
        className="relative flex flex-1 flex-col items-center justify-center gap-0.5 px-1 py-1"
        style={{ backgroundColor: "var(--color-hextech-black)" }}
      >
        {/* Discount — large gold text with a small teal ▼ pointer below it. */}
        {card.discountPct !== undefined && (
          <div className="flex flex-col items-center leading-none">
            <span className="font-display text-base font-bold text-gold-3">
              -{card.discountPct}%
            </span>
            {/* Teal downward pointer (sampled ~#28bcc5 → blue-2). */}
            <div
              aria-hidden="true"
              style={{
                width: 0,
                height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: "5px solid var(--color-blue-2)",
                marginTop: 1,
              }}
            />
          </div>
        )}

        {/* Original price (struck-through, grey). */}
        {card.originalRpPrice !== undefined && (
          <span className="font-body text-[10px] text-grey-1 line-through leading-none">
            {card.originalRpPrice.toLocaleString("en-US")} RP
          </span>
        )}

        {/* Final RP price with coin icon, centered. */}
        {card.rpPrice !== undefined && (
          <div className="flex items-center justify-center gap-1 leading-none">
            {rpIconSrc ? (
              <img
                src={rpIconSrc}
                alt="RP"
                width={13}
                height={13}
                aria-hidden="true"
              />
            ) : (
              <span className="text-gold-2">
                <RpCoinIcon />
              </span>
            )}
            <span className="font-display text-sm text-gold-1">
              {card.rpPrice.toLocaleString("en-US")}
            </span>
          </div>
        )}
      </div>
    </Tag>
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

  const glowIds = [0, 1, 2, 3, 4, 5].map((i) => `${uid}-glow-${i}`);

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
      {/* Card row. Tall narrow cards (aspect ≈ 0.40): six across the 1280×720
          takeover fit within a ~1180px band (reference pitch 336/2082 ≈ 16% of
          width, gutter ≈ 68px at live scale). maxWidth caps each card so the
          6-wide row never overflows; the height cap keeps them clear of the
          header/footer in the 720px viewport. */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-8 min-h-0">
        <div className="flex w-full items-center justify-center gap-[3%]">
          {cards.slice(0, 6).map((card, i) => (
            <div
              key={card.id}
              className="flex-1"
              style={{ maxWidth: 140, maxHeight: "100%" }}
            >
              {card.revealed ? (
                <RevealedCard card={card} rpIconSrc={rpIconSrc} />
              ) : (
                <MysteryCard card={card} glowId={glowIds[i]!} />
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
