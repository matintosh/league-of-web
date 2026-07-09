"use client";

import { demoWallet } from "@low/fixtures";
import { CurrencyDisplay } from "./currency-display";

/** Default demo — realistic wallet values, noop callbacks */
export function CurrencyDisplayDefaultDemo() {
  return (
    <CurrencyDisplay
      wallet={demoWallet}
      onBuyRp={() => console.log("buy RP")}
      onBuyBe={() => console.log("buy BE")}
    />
  );
}

/** Zero amounts — both currencies at 0 */
export function CurrencyDisplayZeroDemo() {
  return (
    <CurrencyDisplay
      wallet={{ rp: 0, blueEssence: 0 }}
      onBuyRp={() => {}}
      onBuyBe={() => {}}
    />
  );
}

/** Large numbers — verifies thousands separator rendering */
export function CurrencyDisplayLargeDemo() {
  return (
    <CurrencyDisplay
      wallet={{ rp: 12345, blueEssence: 1234567 }}
      onBuyRp={() => {}}
      onBuyBe={() => {}}
    />
  );
}
