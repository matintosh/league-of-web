"use client";

import type { Wallet } from "@low/fixtures";

export interface CurrencyDisplayProps {
  /** The player's current wallet balances (RP + Blue Essence). */
  wallet: Wallet;
  /** Called when the user clicks the RP "+" (buy) button. */
  onBuyRp: () => void;
  /** Called when the user clicks the BE "+" (buy) button. */
  onBuyBe: () => void;
  /**
   * When true, renders RP and BE as two right-aligned stacked rows instead
   * of a single inline row. Default false (back-compat — existing call sites
   * are unaffected). Use in the navbar for the reference two-row currency block.
   */
  stacked?: boolean;
}

/** Formats an integer with thousands separators, e.g. 34500 → "34,500". */
function formatAmount(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

/** Small inline SVG: circular RP coin glyph — rendered with currentColor */
function RpIcon() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 4h2.5a2 2 0 0 1 0 4H5V4Z"
        fill="currentColor"
      />
      <line x1="5" y1="8" x2="5" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="8" x2="9" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Small inline SVG: hexagonal BE essence swirl glyph — rendered with currentColor */
function BeIcon() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points="7,1 12.2,4 12.2,10 7,13 1.8,10 1.8,4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M7 4.5 C 5 5.5, 5 8.5, 7 9.5 C 9 8.5, 9 5.5, 7 4.5Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

const buyButtonClass =
  "inline-flex cursor-pointer items-center justify-center border border-grey-3 px-1 text-xs text-grey-1 transition-colors duration-150 hover:border-gold-4 hover:text-gold-2 leading-none h-4 w-4";

/**
 * CurrencyDisplay shows RP and BE balances in the top-right navbar.
 * Each currency has an icon, a formatted amount, and a "+" buy button.
 * Presentational only — buy actions are wired via callbacks.
 *
 * `stacked` (default false): when true renders two right-aligned rows
 * (RP on top, BE below) to match the reference top-bar two-row layout.
 * Back-compat: existing call sites omitting stacked see no change.
 */
export function CurrencyDisplay({ wallet, onBuyRp, onBuyBe, stacked = false }: CurrencyDisplayProps) {
  const rpRow = (
    <div className={["flex items-center gap-1.5", stacked ? "justify-end" : ""].join(" ")}>
      <span className="text-blue-2">
        <RpIcon />
      </span>
      <span className="font-body text-xs tabular-nums text-gold-2">
        {formatAmount(wallet.rp)}
      </span>
      <button
        type="button"
        aria-label="Buy Riot Points"
        onClick={onBuyRp}
        className={buyButtonClass}
      >
        +
      </button>
    </div>
  );

  const beRow = (
    <div className={["flex items-center gap-1.5", stacked ? "justify-end" : ""].join(" ")}>
      <span className="text-blue-3">
        <BeIcon />
      </span>
      <span className="font-body text-xs tabular-nums text-gold-2">
        {formatAmount(wallet.blueEssence)}
      </span>
      <button
        type="button"
        aria-label="Buy Blue Essence"
        onClick={onBuyBe}
        className={buyButtonClass}
      >
        +
      </button>
    </div>
  );

  if (stacked) {
    return (
      <div className="flex flex-col items-end gap-0.5">
        {rpRow}
        {beRow}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {rpRow}
      {beRow}
    </div>
  );
}
