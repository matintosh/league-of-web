import { championSplashUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { MerchCollabCarousel } from "./merch-collab-carousel";
import type { MerchCollabEntry } from "./merch-collab-carousel";

// ---------------------------------------------------------------------------
// Fixture data — headlines match real merch.riotgames.com campaign style (mixed-case)
// ---------------------------------------------------------------------------

const REAL_COLLABS: MerchCollabEntry[] = [
  {
    slug: "hp-omen",
    partnerName: "HP OMEN",
    headline: "HyperX OMEN 16 VALORANT Edition",
    copy: "A unique VALORANT design built with every competitive advantage. Performance laptops and peripherals built for the competitive edge.",
    imageUrl: championSplashUrl("Vi", 0),
  },
  {
    slug: "secretlab",
    partnerName: "Secretlab",
    headline: "Secretlab TITAN Evo",
    copy: "Engineered for long sessions — the official gaming chair of Riot esports.",
    imageUrl: championSplashUrl("Jinx", 0),
  },
];

const MANY_COLLABS: MerchCollabEntry[] = [
  ...REAL_COLLABS,
  {
    slug: "logitech",
    partnerName: "Logitech G",
    headline: "Logitech G PRO X Superlight",
    copy: "Pro-grade mice, keyboards, and headsets for the competitive edge.",
    imageUrl: championSplashUrl("Ezreal", 0),
  },
  {
    slug: "hyperx",
    partnerName: "HyperX",
    headline: "HyperX Cloud Alpha VALORANT Edition",
    copy: "Iconic red design. Dual-chamber drivers for best-in-class sound.",
    imageUrl: championSplashUrl("Caitlyn", 0),
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
    'The "Latest Collaborations" swiper section from the merch homepage (issue #855). Full-width #f7f7f7 band, single-slide snap swiper: text LEFT (plain index "01", 48px/600 mixed-case headline, body, 48px arrow buttons) + landscape image RIGHT. Next slide peeks ~56px at right edge. No CTA anywhere. Mobile: full-bleed image top + text below. Matches merch.riotgames.com.',
  variants: [
    {
      name: "Default — 2 collabs (HP OMEN + Secretlab)",
      notes:
        "Real homepage layout. Slide shows plain '01' index above a 48px mixed-case headline and body copy. 48px arrow buttons below text (prev disabled on first slide). No CTA. #f7f7f7 band.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 1280, fontFamily: "var(--font-merch, system-ui)" }}>
          <MerchCollabCarousel collabs={REAL_COLLABS} />
        </div>
      ),
    },
    {
      name: "4 collabs — arrow nav active",
      notes:
        "With 4 collabs, both prev/next arrows are enabled (except at the edges). Next slide peeks at right edge at desktop width.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 1280, fontFamily: "var(--font-merch, system-ui)" }}>
          <MerchCollabCarousel collabs={MANY_COLLABS} />
        </div>
      ),
    },
    {
      name: "Single collab",
      notes: "Edge case: one slide fills the track. Both arrows are disabled.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 1280, fontFamily: "var(--font-merch, system-ui)" }}>
          <MerchCollabCarousel collabs={REAL_COLLABS.slice(0, 1)} />
        </div>
      ),
    },
  ],
};
