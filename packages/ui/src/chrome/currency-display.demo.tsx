"use client";

import { demoWallet, rpIconUrl, blueEssenceIconUrl } from "@low/fixtures";
import { CurrencyDisplay } from "./currency-display";

/** Default demo — realistic wallet values, noop callbacks, inline SVG glyph fallback */
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

/** Stacked variant — two right-aligned rows (RP on top, BE below) matching the reference top-bar layout */
export function CurrencyDisplayStackedDemo() {
  return (
    <CurrencyDisplay
      wallet={demoWallet}
      onBuyRp={() => console.log("buy RP")}
      onBuyBe={() => console.log("buy BE")}
      stacked
    />
  );
}

/** Real icons variant — rpIconUrl() / blueEssenceIconUrl() from CommunityDragon */
export function CurrencyDisplayRealIconsDemo() {
  return (
    <CurrencyDisplay
      wallet={demoWallet}
      onBuyRp={() => console.log("buy RP")}
      onBuyBe={() => console.log("buy BE")}
      rpIconSrc={rpIconUrl()}
      beIconSrc={blueEssenceIconUrl()}
    />
  );
}

/** Real icons + stacked — the production navbar configuration */
export function CurrencyDisplayRealIconsStackedDemo() {
  return (
    <CurrencyDisplay
      wallet={demoWallet}
      onBuyRp={() => console.log("buy RP")}
      onBuyBe={() => console.log("buy BE")}
      stacked
      rpIconSrc={rpIconUrl()}
      beIconSrc={blueEssenceIconUrl()}
    />
  );
}
