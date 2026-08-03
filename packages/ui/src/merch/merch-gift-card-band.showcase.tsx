import { championSplashUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { MerchGiftCardBand } from "./merch-gift-card-band";
import type { MerchGiftCard } from "./merch-gift-card-band";

/** Placeholder card images — splash art from Data Dragon CDN. */
const CARD_JINX: MerchGiftCard = {
  imageUrl: championSplashUrl("Jinx", 0),
  label: "Riot merch gift card — Jinx edition",
};
const CARD_VALORANT: MerchGiftCard = {
  imageUrl: championSplashUrl("Vi", 0),
  label: "Riot merch gift card — VALORANT edition",
};

export const merchGiftCardBandShowcase: ShowcaseEntry = {
  slug: "merch-gift-card-band",
  name: "Merch Gift Card Band",
  area: "merch",
  description:
    "\"Give a Gift Card\" promo band rendered above the footer on the /merch homepage. ~447px tall, --color-merch-surface-alt (#f7f7f7) background. 2-col grid: text + CTA left, two overlapping gift card visuals right. Measured from merch.riotgames.com.",
  variants: [
    {
      name: "Default — two card images",
      notes:
        "Full band: heading, subcopy, CTA, and two overlapping card visuals. Matches the real store section near the footer.",
      backgrounds: ["light"],
      render: () => (
        <MerchGiftCardBand cards={[CARD_JINX, CARD_VALORANT]} />
      ),
    },
    {
      name: "No card images — SVG placeholder",
      notes:
        "When no cards prop is passed, renders a styled SVG placeholder card so the layout remains intact.",
      backgrounds: ["light"],
      render: () => <MerchGiftCardBand />,
    },
    {
      name: "Custom heading and subcopy",
      notes: "All text props overridden to verify prop pass-through.",
      backgrounds: ["light"],
      render: () => (
        <MerchGiftCardBand
          heading="THE PERFECT GIFT"
          subcopy="Can't decide? Let them choose. Riot gift cards work across all Riot titles."
          ctaLabel="Get a Gift Card"
          cards={[CARD_VALORANT, CARD_JINX]}
        />
      ),
    },
    {
      name: "Single card image",
      notes: "Only one card supplied — the second slot is empty.",
      backgrounds: ["light"],
      render: () => (
        <MerchGiftCardBand cards={[CARD_JINX]} />
      ),
    },
  ],
};
