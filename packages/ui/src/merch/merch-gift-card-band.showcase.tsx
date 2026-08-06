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
    "\"Give a Gift Card\" promo band rendered above the footer on the /merch homepage. ~447px tall. Desktop: --color-merch-surface-alt (#f7f7f7) bg, 2-col grid: \"GIFT CARDS\" eyebrow + heading at x=137, riotSans 48/600, no subcopy, skewed 239×50 Buy It Now CTA + two overlapping near-square gift card visuals. Mobile: dark (#000) band, white heading, centered CTA. Measured from merch.riotgames.com.",
  variants: [
    {
      name: "Default — two card images",
      notes:
        "Full band: GIFT CARDS eyebrow, heading, skewed Buy It Now CTA, two overlapping near-square card visuals. No subcopy. Matches the real store gift-card section near the footer.",
      backgrounds: ["light"],
      render: () => (
        <MerchGiftCardBand cards={[CARD_JINX, CARD_VALORANT]} />
      ),
    },
    {
      name: "No card images — SVG placeholder",
      notes:
        "When no cards prop is passed, renders styled SVG placeholder cards so the layout stays intact.",
      backgrounds: ["light"],
      render: () => <MerchGiftCardBand />,
    },
    {
      name: "Custom heading and CTA label",
      notes: "Heading and CTA label overridden to verify prop pass-through.",
      backgrounds: ["light"],
      render: () => (
        <MerchGiftCardBand
          heading="THE PERFECT GIFT"
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
