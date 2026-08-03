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
    "Full-width homepage hero for the Riot merch store. Aspect ratio ~64:27 (≈2.37, matching 1280×535 from merch.riotgames.com). Art-forward: text overlay is optional so baked-in artwork carries the branding. CTA defaults to white pill + black text (radius 2px, sentence-case); red variant available. Multi-slide: dot nav + ‹ › arrow controls.",
  variants: [
    {
      name: "Multi-slide carousel (auto-advance)",
      notes:
        "Three-slide carousel with 4s auto-advance. Art-forward slides with light CTA (white pill, bottom-right). Arrow controls + dot nav visible.",
      backgrounds: ["dark"],
      render: () => <MerchHeroBannerDemo />,
    },
    {
      name: "Single slide — art-forward, light CTA bottom-right",
      notes:
        "Single slide; no carousel. Light CTA (white pill + black text, radius 2px) anchored bottom-right matching the real store's MSI 26 slide.",
      backgrounds: ["dark"],
      render: () => <MerchHeroBannerSingleDemo />,
    },
    {
      name: "Light CTA — center-left (default position)",
      notes:
        "Slide with eyebrow + headline + light CTA aligned center-left. Text overlay with softened scrim.",
      backgrounds: ["dark"],
      render: () => (
        <MerchHeroBanner
          autoPlayMs={0}
          slides={[
            {
              id: "light-left",
              imageUrl: IMG_LUX,
              imageAlt: "Lux PROJECT Collection banner",
              eyebrow: "Limited Edition",
              headline: "PROJECT Collection",
              body: "Exclusive apparel and collectibles for the Rift's elite.",
              ctaLabel: "Shop All",
              ctaVariant: "light",
              align: "left",
            },
          ]}
        />
      ),
    },
    {
      name: "Red CTA — alternate variant",
      notes:
        "Red CTA (--color-merch-red bg, white text, uppercase) — legacy Riot red style, e.g. 'Shop Now' on sale slides.",
      backgrounds: ["dark"],
      render: () => (
        <MerchHeroBanner
          autoPlayMs={0}
          slides={[
            {
              id: "red-cta",
              imageUrl: IMG_VI,
              imageAlt: "Arcane Vi hoodie banner",
              eyebrow: "Sale — Up to 40% Off",
              headline: "Arcane Collection",
              body: "Gear up with officially licensed merch from the hit animated series.",
              ctaLabel: "Shop Now",
              ctaVariant: "red",
              align: "left",
            },
          ]}
        />
      ),
    },
    {
      name: "No text overlay — pure art-forward",
      notes:
        "Hero with no eyebrow, headline, body, or CTA — image only. Scrim suppressed. Art carries all branding.",
      backgrounds: ["dark"],
      render: () => (
        <MerchHeroBanner
          autoPlayMs={0}
          slides={[
            {
              id: "image-only",
              imageUrl: IMG_JINX,
              imageAlt: "Jinx Riftbound Origins banner",
            },
          ]}
        />
      ),
    },
    {
      name: "Two slides — arrow + dot navigation",
      notes:
        "Two slides with no auto-advance; use ‹ › arrows or dots to switch.",
      backgrounds: ["dark"],
      render: () => (
        <MerchHeroBanner
          autoPlayMs={0}
          slides={[
            {
              id: "s1",
              imageUrl: IMG_JINX,
              imageAlt: "Jinx Riftbound Origins",
              ctaLabel: "Shop All",
              ctaVariant: "light",
              ctaCorner: "bottom-right",
              align: "left",
            },
            {
              id: "s2",
              imageUrl: IMG_VI,
              imageAlt: "Arcane Vi hoodie",
              ctaLabel: "Shop Now",
              ctaVariant: "red",
              ctaCorner: "bottom-right",
              align: "left",
            },
          ]}
        />
      ),
    },
  ],
};
