import type { ShowcaseEntry } from "../showcase";
import {
  HeroCarouselMultiSlideDemo,
  HeroCarouselSingleSlideDemo,
} from "./hero-carousel.demo";

export const heroCarouselShowcase: ShowcaseEntry = {
  slug: "hero-carousel",
  name: "Hero Carousel",
  area: "store",
  description:
    "Large cinematic hero panel for the Store FEATURED tab. Full-bleed splash art with a bottom-left overlay (eyebrow label, skin-line name, subtitle, RP price) and bottom-right dot navigation. Presentational — parent owns activeIndex and drives auto-advance if desired. Fixed at 460×300px.",
  variants: [
    {
      name: "Multi-slide — 5 slides, dot navigation",
      notes:
        "Five slides loaded from fixture data. Click any dot to jump to that slide. Active dot is gold-3; inactive dots are blue-5.",
      render: () => <HeroCarouselMultiSlideDemo />,
    },
    {
      name: "Single slide — one dot, no navigation needed",
      notes:
        "When only one slide is supplied a single dot renders at the bottom-right. Clicking it is a no-op (already active).",
      render: () => <HeroCarouselSingleSlideDemo />,
    },
  ],
};
