import { championSplashUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { MerchCollabCarousel } from "./merch-collab-carousel";
import type { MerchCollabEntry } from "./merch-collab-carousel";

// ---------------------------------------------------------------------------
// Fixture data
// ---------------------------------------------------------------------------

const REAL_COLLABS: MerchCollabEntry[] = [
  {
    slug: "hp-omen",
    partnerName: "HP OMEN",
    headline: "GAME ON",
    copy: "HP OMEN x Riot Games. Built for champions — performance gear for the Rift and beyond.",
    imageUrl: championSplashUrl("Vi", 0),
    ctaLabel: "Shop HP OMEN",
  },
  {
    slug: "secretlab",
    partnerName: "Secretlab",
    headline: "PLAY IN COMFORT",
    copy: "Secretlab x Riot Games. Engineered for long sessions — the official gaming chair of Riot esports.",
    imageUrl: championSplashUrl("Jinx", 0),
    ctaLabel: "Shop Secretlab",
  },
];

const MANY_COLLABS: MerchCollabEntry[] = [
  ...REAL_COLLABS,
  {
    slug: "logitech",
    partnerName: "Logitech G",
    headline: "PRECISION PLAY",
    copy: "Logitech G x Riot Games. Pro-grade mice, keyboards, and headsets for the competitive edge.",
    imageUrl: championSplashUrl("Ezreal", 0),
    ctaLabel: "Shop Logitech G",
  },
];

// ---------------------------------------------------------------------------
// Showcase entry
// ---------------------------------------------------------------------------

export const merchCollabCarouselShowcase: ShowcaseEntry = {
  slug: "merch-collab-carousel",
  name: "Merch Collab Carousel",
  area: "merch",
  description:
    'The "— LATEST COLLABORATIONS" section from the merch homepage. ~506px tall: riotSans en-dash heading + 2-up tile grid at 1280px (1-up at 390px). Each tile has a full-bleed dark image with gradient scrim, optional partner logo, headline, copy, and a red "Shop Now" CTA. Matches the HP/OMEN + Secretlab tiles on the real merch.riotgames.com homepage.',
  variants: [
    {
      name: "Default — 2 collabs (HP OMEN + Secretlab)",
      notes:
        "The real homepage layout: 2 tiles side-by-side at 1280px. At 390px each tile stacks vertically. Champion splash art used as placeholder images.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 1280, fontFamily: "var(--font-merch, system-ui)" }}>
          <MerchCollabCarousel collabs={REAL_COLLABS} />
        </div>
      ),
    },
    {
      name: "3 collabs — arrow nav active",
      notes:
        "When more than 2 collabs are supplied, the carousel arrow buttons appear. Mobile scrolls one tile at a time.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 1280, fontFamily: "var(--font-merch, system-ui)" }}>
          <MerchCollabCarousel collabs={MANY_COLLABS} />
        </div>
      ),
    },
    {
      name: "Single collab",
      notes: "Edge case: one tile fills the left column; right slot is empty.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 1280, fontFamily: "var(--font-merch, system-ui)" }}>
          <MerchCollabCarousel collabs={REAL_COLLABS.slice(0, 1)} />
        </div>
      ),
    },
  ],
};
