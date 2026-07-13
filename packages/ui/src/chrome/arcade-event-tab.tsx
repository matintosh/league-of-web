"use client";

import { useId } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A champion skin featured in the Arcade 2019 event skin grid. */
export interface EventSkinCard {
  /** Unique identifier for the skin card. */
  id: string;
  /** Champion name displayed on the card, e.g. "Yasuo". */
  championName: string;
  /** Skin name displayed as a sub-label, e.g. "Battle Boss". */
  skinName: string;
  /** RP price, e.g. 1350. */
  rpPrice: number;
  /** URL for the champion skin loading art or cinematic splash. */
  splashUrl: string;
  /** When true, renders the selected highlight border. */
  isSelected?: boolean;
}

export interface ArcadeEventTabProps {
  /** Four skin cards rendered in the horizontal grid strip. */
  skins: EventSkinCard[];
  /** ID of the currently selected skin card. */
  selectedSkinId?: string;
  /** Called when the user clicks a skin card. */
  onSkinSelect: (id: string) => void;
  /** Called when the LEARN MORE button is clicked. */
  onLearnMore: () => void;
  /** Called when the event trailer tile is clicked. */
  onTrailerClick: () => void;
  /** Called when the New Champion tile is clicked. */
  onNewChampionClick: () => void;
  /**
   * URL for the Qiyana splash used in the New Champion tile.
   * Supplied by the page so the component stays fixture-free.
   */
  newChampionSplashUrl: string;
}

// ---------------------------------------------------------------------------
// RP glyph — reusable inline icon (aria-hidden; label comes from context)
// ---------------------------------------------------------------------------

function RpGlyph({ size = 13 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-blue-2 shrink-0"
    >
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 4h2.5a2 2 0 0 1 0 4H5V4Z" fill="currentColor" />
      <line x1="5" y1="8" x2="5" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="8" x2="9" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SkinCard — individual skin tile in the 4-card grid strip
// ---------------------------------------------------------------------------

function SkinCard({
  card,
  isSelected,
  onSelect,
  labelId,
}: {
  card: EventSkinCard;
  isSelected: boolean;
  onSelect: () => void;
  labelId: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      aria-labelledby={labelId}
      onClick={onSelect}
      className={[
        "relative flex flex-col overflow-hidden shrink-0",
        "cursor-pointer border transition-colors duration-150",
        isSelected
          ? "border-2 border-gold-1"
          : "border border-gold-5 hover:border-gold-3",
      ].join(" ")}
      style={{ width: 170, height: 210 }}
    >
      {/* Splash art fill */}
      <img
        src={card.splashUrl}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />

      {/* Bottom overlay gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: 70,
          background:
            "linear-gradient(to top, rgba(1,10,19,0.95) 0%, rgba(1,10,19,0.6) 60%, transparent 100%)",
        }}
      />

      {/* Card info overlay */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 px-2 py-2">
        <span
          id={labelId}
          className="font-display text-white text-xs uppercase leading-tight"
        >
          {card.championName}
        </span>
        <span className="font-body text-gold-cream text-xs leading-tight opacity-80">
          {card.skinName}
        </span>
        {/* RP price row */}
        <div className="flex items-center gap-1 mt-0.5">
          <RpGlyph size={11} />
          <span className="font-body text-xs text-gold-1 tabular-nums">
            {card.rpPrice}
          </span>
        </div>
      </div>

      {/* Selected gold highlight ring — inner glow effect */}
      {isSelected && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow: "inset 0 0 0 2px var(--color-gold-1), inset 0 0 12px var(--color-gold-3)",
          }}
        />
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Arcade Pass unlock list — constant data (not a prop; fixed per the event)
// ---------------------------------------------------------------------------

interface UnlockItem {
  id: string;
  label: string;
}

const ARCADE_PASS_UNLOCKS: UnlockItem[] = [
  { id: "star-icon",    label: "Arcade Star Icon" },
  { id: "four-orbs",   label: "Four Arcade Orbs" },
  { id: "200-tokens",  label: "200 Arcade Tokens" },
  { id: "per-game",    label: "Additional tokens per game" },
];

// ---------------------------------------------------------------------------
// ArcadeEventTab
// ---------------------------------------------------------------------------

/**
 * ArcadeEventTab — the themed event landing page for the Arcade 2019 sub-tab.
 *
 * Two-column layout:
 * - Left (≈65%): Arcade branding + 4-skin horizontal grid + trailer tile + New Champion tile
 * - Right (≈35%): Arcade Pass panel with unlock list and LEARN MORE CTA
 *
 * Presentational only: all state (selected skin, callbacks) is owned by the parent.
 */
export function ArcadeEventTab({
  skins,
  selectedSkinId,
  onSkinSelect,
  onLearnMore,
  onTrailerClick,
  onNewChampionClick,
  newChampionSplashUrl,
}: ArcadeEventTabProps) {
  const uid = useId();
  const unlockListId = `${uid}-unlock-list`;
  const passHeadingId = `${uid}-pass-heading`;

  return (
    /* Root — full dark arcade bg with neon purple-blue gradient overlay */
    <div
      className="relative flex h-full w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--color-arcade-bg-dark) 0%, var(--color-blue-6) 40%, var(--color-blue-7) 70%, var(--color-arcade-bg-deep) 100%)",
      }}
    >
      {/* Scanline texture overlay — CSS only, no asset required */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,220,0.04) 2px, rgba(0,255,220,0.04) 4px)",
        }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* LEFT COLUMN — branding + skin grid + media tiles                    */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="relative z-10 flex flex-col gap-4 p-5"
        style={{ width: "65%" }}
      >
        {/* Event branding lockup */}
        <div className="flex flex-col gap-0.5" style={{ maxWidth: 220 }}>
          <span
            className="font-display italic uppercase leading-none text-gold-1"
            style={{ fontSize: 28, letterSpacing: "0.12em" }}
          >
            ARCADE 2019
          </span>
          <span
            className="font-display uppercase tracking-widest text-gold-3"
            style={{ fontSize: 11 }}
          >
            ULTRACOMBO
          </span>
        </div>

        {/* Thin gold rule under branding */}
        <div className="h-px w-48 bg-gold-5" aria-hidden="true" />

        {/* 4-skin horizontal strip */}
        <div
          role="list"
          aria-label="Arcade 2019 event skins"
          className="flex gap-3"
        >
          {skins.slice(0, 4).map((card) => {
            const labelId = `${uid}-skin-${card.id}`;
            return (
              <div key={card.id} role="listitem">
                <SkinCard
                  card={card}
                  isSelected={card.id === selectedSkinId}
                  onSelect={() => onSkinSelect(card.id)}
                  labelId={labelId}
                />
              </div>
            );
          })}
        </div>

        {/* Lower tile row — Trailer tile + New Champion tile */}
        <div className="flex gap-3">
          {/* EVENT TRAILER tile — static, no video */}
          <button
            type="button"
            aria-label="Play event trailer: Arcade 2019 Ultracombo"
            onClick={onTrailerClick}
            className={[
              "relative flex flex-col justify-end overflow-hidden shrink-0",
              "cursor-pointer border border-gold-5 transition-colors duration-150",
              "hover:border-gold-3",
            ].join(" ")}
            style={{ width: 350, height: 150 }}
          >
            {/* Dark video-thumbnail background.
                Gradient stops mapped to nearest tokens — deltas are imperceptible
                in this small dark tile:
                  #0a0518 → arcade-bg-dark (#0d0520, ΔE≈2),
                  #0d1a35 → blue-6 (#091428, marginal; both near-black navy),
                  #050e22 → arcade-bg-deep (#050e20, Δblue=2). */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-arcade-bg-dark) 0%, var(--color-blue-6) 50%, var(--color-arcade-bg-deep) 100%)",
              }}
            />
            {/* Pixel-art neon grid lines to suggest arcade video feel */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(10,200,185,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(10,200,185,0.4) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            {/* Play icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="flex items-center justify-center rounded-full border border-gold-4 bg-hextech-black/70"
                style={{ width: 44, height: 44 }}
              >
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gold-2 ml-0.5"
                >
                  <path d="M5 3l11 6-11 6V3Z" fill="currentColor" />
                </svg>
              </div>
            </div>
            {/* Label overlay at bottom */}
            <div
              className="relative flex flex-col gap-0.5 p-3"
              style={{
                background:
                  "linear-gradient(to top, rgba(1,10,19,0.95) 0%, transparent 100%)",
              }}
            >
              <span className="font-display text-xs uppercase tracking-widest text-grey-1">
                EVENT TRAILER
              </span>
              <span className="font-display text-sm uppercase tracking-wide text-gold-cream">
                ARCADE 2019: ULTRACOMBO
              </span>
            </div>
          </button>

          {/* NEW CHAMPION — Qiyana tile */}
          <button
            type="button"
            aria-label="View new champion: Qiyana"
            onClick={onNewChampionClick}
            className={[
              "relative flex flex-col justify-end overflow-hidden flex-1 min-w-0",
              "cursor-pointer border border-gold-5 transition-colors duration-150",
              "hover:border-gold-3",
            ].join(" ")}
            style={{ height: 150 }}
          >
            {/* Qiyana splash background */}
            <img
              src={newChampionSplashUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
            {/* Gradient scrim */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(1,10,19,0.9) 0%, rgba(1,10,19,0.4) 55%, transparent 100%)",
              }}
            />
            {/* Label */}
            <div className="relative flex flex-col gap-0.5 p-3">
              <span className="font-display text-xs uppercase tracking-widest text-blue-2">
                NEW CHAMPION
              </span>
              <span className="font-display text-base uppercase tracking-wide text-gold-1">
                QIYANA
              </span>
              <span className="font-body text-xs text-grey-1">
                6300 BE &nbsp;|&nbsp; 975 RP
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* RIGHT COLUMN — Arcade Pass panel                                    */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="relative z-10 flex flex-1 flex-col gap-4 border-l border-gold-5 p-5"
      >
        {/* Pass heading */}
        <h2
          id={passHeadingId}
          className="font-display text-lg uppercase tracking-widest text-gold-1"
        >
          ARCADE PASS
        </h2>

        {/* Pass icon placeholder — stylised pass ticket */}
        <div
          aria-label="Arcade Pass 2019 ticket icon"
          role="img"
          className="flex flex-col items-center justify-center border border-gold-5 bg-blue-7"
          style={{ width: "100%", height: 90 }}
        >
          {/* Arcade "A 2019" ticket graphic — inline CSS art */}
          <div className="flex flex-col items-center gap-0.5">
            <span
              className="font-display italic text-gold-1 leading-none"
              style={{ fontSize: 32, letterSpacing: "0.06em" }}
            >
              A
            </span>
            <span
              className="font-display uppercase tracking-widest text-gold-3"
              style={{ fontSize: 11 }}
            >
              2019
            </span>
          </div>
          {/* Dashed ticket perforation line */}
          <div
            aria-hidden="true"
            className="mt-2 w-full border-t border-dashed border-gold-5 opacity-50"
          />
        </div>

        {/* UNLOCKS section */}
        <div className="flex flex-col gap-2">
          <span className="font-display text-xs uppercase tracking-widest text-grey-1">
            UNLOCKS:
          </span>
          <ul
            id={unlockListId}
            aria-label="Arcade Pass unlocks"
            className="flex flex-col gap-1.5"
          >
            {ARCADE_PASS_UNLOCKS.map((unlock) => (
              <li
                key={unlock.id}
                className="flex items-start gap-2"
              >
                {/* Cyan bullet */}
                <span
                  aria-hidden="true"
                  className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-2"
                />
                {/* Unlock label styled as a dead cyan link */}
                <button
                  type="button"
                  aria-label={unlock.label}
                  aria-disabled="true"
                  disabled
                  className="cursor-default text-left font-body text-xs text-blue-2 opacity-90 transition-opacity duration-150 hover:opacity-100"
                >
                  {unlock.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Availability note */}
        <p className="font-body text-xs text-grey-1">
          Available until July 30, 2019, at 07:59 a.m. BST.
        </p>

        {/* Spacer — pushes CTA to bottom area */}
        <div className="flex-1" />

        {/* LEARN MORE CTA */}
        <button
          type="button"
          aria-label="Learn more about the Arcade Pass"
          onClick={onLearnMore}
          className={[
            "w-full py-2.5",
            "bg-arcade-aqua font-display text-sm uppercase tracking-widest text-blue-6",
            "border border-blue-5 transition-colors duration-150",
            "hover:bg-blue-1 cursor-pointer",
          ].join(" ")}
        >
          LEARN MORE
        </button>
      </div>
    </div>
  );
}
