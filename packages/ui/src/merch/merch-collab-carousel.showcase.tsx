import { championSplashUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { MerchCollabCarousel } from "./merch-collab-carousel";
import type { MerchCollabEntry } from "./merch-collab-carousel";

// ---------------------------------------------------------------------------
// Fixture data — product-name headlines match real merch.riotgames.com style
// ---------------------------------------------------------------------------

const REAL_COLLABS: MerchCollabEntry[] = [
  {
    slug: "hp-omen",
    partnerName: "HP OMEN",
    headline: "HyperX OMEN 16 VALORANT Edition",
    copy: "HP OMEN x Riot Games. Performance laptops and peripherals built for the competitive edge.",
    imageUrl: championSplashUrl("Vi", 0),
    ctaLabel: "Shop HP OMEN",
  },
  {
    slug: "secretlab",
    partnerName: "Secretlab",
    headline: "Secretlab TITAN Evo",
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
    headline: "Logitech G PRO X Superlight",
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
    'The "— LATEST COLLABORATIONS" section from the merch homepage. White-bg 2-up product panels at 1280px with large black product-name headings, 01/02 slide index numbers, and 64px round bordered arrow buttons. Mobile: full-bleed image on top → white text block below (heading + copy + centered arrows, no CTA). Matches merch.riotgames.com.',
  variants: [
    {
      name: "Default — 2 collabs (HP OMEN + Secretlab)",
      notes:
        "The real homepage layout: 2 white panels side-by-side at 1280px. Each panel shows 01/02 slide index. At 390px, switches to image-then-text stack with centered arrow nav.",
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
        "With more than 2 collabs, desktop shows 2 at a time and the next arrow advances by 2. Mobile scrolls one tile at a time. Prev arrow is disabled on the first page.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 1280, fontFamily: "var(--font-merch, system-ui)" }}>
          <MerchCollabCarousel collabs={MANY_COLLABS} />
        </div>
      ),
    },
    {
      name: "Single collab",
      notes: "Edge case: one panel fills the left slot; the right slot shows an empty placeholder.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 1280, fontFamily: "var(--font-merch, system-ui)" }}>
          <MerchCollabCarousel collabs={REAL_COLLABS.slice(0, 1)} />
        </div>
      ),
    },
  ],
};
