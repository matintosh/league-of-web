"use client";

import { demoWallet, rpIconUrl, blueEssenceIconUrl, rpTopUpIconUrl } from "@low/fixtures";
import { CurrencyDisplay } from "./currency-display";
import { RpTopUpButton } from "./rp-top-up-button";

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

/**
 * Capsule (#464) — the 2025 nav configuration: the RP row is enclosed in a
 * rounded-full gold-4 capsule outline over a dark translucent fill, with the
 * RP top-up `＋` disc INSIDE the capsule at its right end (rpTrailingSlot). BE
 * stays unframed below.
 */
export function CurrencyDisplayCapsuleDemo() {
  return (
    <CurrencyDisplay
      wallet={demoWallet}
      onBuyRp={() => console.log("buy RP")}
      onBuyBe={() => console.log("buy BE")}
      stacked
      capsule
      showBuyButtons={false}
      rpIconSrc={rpIconUrl()}
      beIconSrc={blueEssenceIconUrl()}
      rpTrailingSlot={
        <RpTopUpButton
          restingSrc={rpTopUpIconUrl("resting")}
          hoverSrc={rpTopUpIconUrl("hover")}
          pressedSrc={rpTopUpIconUrl("pressed")}
          onClick={() => console.log("buy RP")}
        />
      }
    />
  );
}
