import { championSplashUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { MerchHeroBanner } from "./merch-hero-banner";
import { MerchHeroBannerDemo, MerchHeroBannerSingleDemo } from "./merch-hero-banner.demo";

/** Showcase image placeholders from Data Dragon CDN. */
const IMG_JINX = championSplashUrl("Jinx", 0);
const IMG_LUX  = championSplashUrl("Lux", 0);
const IMG_VI   = championSplashUrl("Vi", 0);

export const merchHeroBannerShowcase: ShowcaseEntry = {
  slug: "merch-hero-banner",
  name: "Merch Hero Banner",
  area: "merch",
  description:
    "Full-width homepage hero for the Riot merch store. Aspect ratio ~16:5 (matching 3296×1030 source images). Supports single or multi-slide carousel with auto-advance, dot navigation, text overlay (eyebrow/headline/body/CTA), and configurable text alignment. Measured from merch.riotgames.com.",
  variants: [
    {
      name: "Multi-slide carousel (auto-advance)",
      notes:
        "Three-slide carousel with 4s auto-advance. Left-aligned slide 1 & 3; center-aligned slide 2. Dot nav visible below.",
      backgrounds: ["dark"],
      render: () => <MerchHeroBannerDemo />,
    },
    {
      name: "Single slide — left aligned, no dots",
      notes:
        "Single slide with no carousel. Dot nav hidden. CTA button present.",
      backgrounds: ["dark"],
      render: () => <MerchHeroBannerSingleDemo />,
    },
    {
      name: "Center-aligned text overlay",
      notes:
        "Slide with align='center' — uses radial scrim; text block centered.",
      backgrounds: ["dark"],
      render: () => (
        <MerchHeroBanner
          autoPlayMs={0}
          slides={[
            {
              id: "center-demo",
              imageUrl: IMG_LUX,
              imageAlt: "Lux PROJECT Collection banner",
              eyebrow: "Limited Edition",
              headline: "PROJECT Collection",
              body: "Exclusive apparel and collectibles for the Rift's elite.",
              ctaLabel: "Explore",
              align: "center",
            },
          ]}
        />
      ),
    },
    {
      name: "No text overlay — image only",
      notes: "Hero with no eyebrow, headline, body, or CTA — pure image banner.",
      backgrounds: ["dark"],
      render: () => (
        <MerchHeroBanner
          autoPlayMs={0}
          slides={[
            {
              id: "image-only",
              imageUrl: IMG_VI,
              imageAlt: "Arcane Vi banner",
            },
          ]}
        />
      ),
    },
    {
      name: "Two slides — manual navigation",
      notes: "Two slides with no auto-advance; use dots to switch.",
      backgrounds: ["dark"],
      render: () => (
        <MerchHeroBanner
          autoPlayMs={0}
          slides={[
            {
              id: "s1",
              imageUrl: IMG_JINX,
              imageAlt: "Jinx Riftbound Origins",
              eyebrow: "New Arrivals",
              headline: "Riftbound Origins",
              ctaLabel: "Shop Now",
              align: "left",
            },
            {
              id: "s2",
              imageUrl: IMG_VI,
              imageAlt: "Arcane Vi hoodie",
              eyebrow: "Sale — Up to 40% Off",
              headline: "Arcane Collection",
              ctaLabel: "View Deals",
              align: "left",
            },
          ]}
        />
      ),
    },
  ],
};
