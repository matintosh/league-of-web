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
    "\"GIVE A GIFT CARD\" promo band rendered above the footer on the /merch homepage. ~447px tall at 1280. Desktop: --color-merch-surface-alt (#f7f7f7) bg, 2-col grid: \"GIFT CARDS\" eyebrow (Inter 14/600 lh18 ls0.28px) + all-caps heading (riotSans 48/600 lh52, pure black, gap 16px below eyebrow) + arrow-notch Buy It Now CTA (239×50, ls0.32px lh18, gap 32px below heading) + two overlapping gift card visuals right. Mobile: 17px inset, full-width CTA below image. Measured from merch.riotgames.com.",
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
