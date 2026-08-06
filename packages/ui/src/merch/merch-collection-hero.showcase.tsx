import { championSplashUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { MerchCollectionHero } from "./merch-collection-hero";

/** Placeholder images from Data Dragon CDN (ddragon.leagueoflegends.com). */
const IMG_JINX = championSplashUrl("Jinx", 0);
const IMG_LUX  = championSplashUrl("Lux", 0);

const HOME_CRUMB    = { label: "Home", href: "/merch" };
const COLL_CRUMB    = { label: "Collections", href: "/merch/collection" };

export const merchCollectionHeroShowcase: ShowcaseEntry = {
  slug: "merch-collection-hero",
  name: "Merch Collection Hero",
  area: "merch",
  description:
    "Compact banner (~160px min-height) for collection/category pages on the Riot merch store. Renders breadcrumb trail, large heading (text-4xl, uppercase), optional item count, optional description, and optional gold SHOP NOW CTA. Supports solid dark/light background or full-bleed image with dark scrim. Measured from merch.riotgames.com/en-us/collection/league-classic/, /category/league-of-legends/, and the PDP collection band.",
  variants: [
    {
      name: "Dark theme — solid background (default)",
      notes:
        "Dark solid background (--color-merch-ink), white text, breadcrumb with muted/white crumb links. Matches the real store's collection banner with no image. headingAs='h1' for stand-alone category pages.",
      backgrounds: ["light"],
      render: () => (
        <MerchCollectionHero
          headingAs="h1"
          heading="League Classic"
          itemCount={7}
          breadcrumbs={[HOME_CRUMB, COLL_CRUMB, { label: "League Classic" }]}
          description="Timeless designs inspired by the original champions of the Rift."
        />
      ),
    },
    {
      name: "Dark theme — with background image",
      notes:
        "Full-bleed background image with linear-gradient scrim. Text remains readable on dark overlay.",
      backgrounds: ["light"],
      render: () => (
        <MerchCollectionHero
          headingAs="h1"
          heading="Arcane Collection"
          itemCount={12}
          backgroundImageUrl={IMG_JINX}
          backgroundImageAlt="Arcane Jinx splash art"
          breadcrumbs={[HOME_CRUMB, COLL_CRUMB, { label: "Arcane Collection" }]}
          description="Official merchandise from the hit animated series."
        />
      ),
    },
    {
      name: "Light theme — solid surface",
      notes:
        "Light background (--color-merch-surface) with dark text — for category pages on lighter site sections.",
      backgrounds: ["light"],
      render: () => (
        <MerchCollectionHero
          headingAs="h1"
          heading="League of Legends"
          theme="light"
          breadcrumbs={[HOME_CRUMB, { label: "League of Legends" }]}
          description="Champions, items, and lore from the Rift, brought to life."
        />
      ),
    },
    {
      name: "Light theme — with background image",
      notes:
        "theme='light' with an image. Scrim still dark to keep contrast; description uses body color.",
      backgrounds: ["light"],
      render: () => (
        <MerchCollectionHero
          headingAs="h1"
          heading="PROJECT Collection"
          itemCount={5}
          theme="light"
          backgroundImageUrl={IMG_LUX}
          backgroundImageAlt="PROJECT Lux splash art"
          breadcrumbs={[HOME_CRUMB, COLL_CRUMB, { label: "PROJECT Collection" }]}
        />
      ),
    },
    {
      name: "PDP collection band — gold SHOP NOW, franchise splash, h2",
      notes:
        "The real PDP collection band: dark theme, wide franchise splash background, gold SHOP NOW button (--color-merch-gold #f9c824). Heading renders as h2 (decorative) because the PDP panel above owns the h1.",
      backgrounds: ["light"],
      render: () => (
        <MerchCollectionHero
          heading="League of Legends"
          description="Explore the full collection of officially licensed League of Legends merchandise."
          backgroundImageUrl={IMG_JINX}
          backgroundImageAlt="League of Legends franchise splash"
          theme="dark"
          ctaLabel="SHOP NOW"
        />
      ),
    },
    {
      name: "Shop All — no breadcrumbs, no item count",
      notes:
        "Minimal variant: heading only. Matches /shop-all page: 'Home > Shop All'.",
      backgrounds: ["light"],
      render: () => (
        <MerchCollectionHero
          headingAs="h1"
          heading="Shop All"
          breadcrumbs={[HOME_CRUMB, { label: "Shop All" }]}
        />
      ),
    },
    {
      name: "Category page — no description",
      notes:
        "Category heading with breadcrumbs and item count; no description.",
      backgrounds: ["light"],
      render: () => (
        <MerchCollectionHero
          headingAs="h1"
          heading="New Arrivals"
          itemCount={24}
          breadcrumbs={[HOME_CRUMB, { label: "New Arrivals" }]}
        />
      ),
    },
    {
      name: "Minimal — heading only",
      notes: "No breadcrumbs, no itemCount, no description. Just the heading.",
      backgrounds: ["light"],
      render: () => (
        <MerchCollectionHero heading="Sale" />
      ),
    },
  ],
};
