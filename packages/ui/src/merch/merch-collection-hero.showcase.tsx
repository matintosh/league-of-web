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
    "Compact banner (~160px min-height) for collection/category pages on the Riot merch store. Renders breadcrumb trail, large heading (text-4xl, uppercase), optional item count, and optional description. Supports solid dark/light background or full-bleed image with dark scrim. Measured from merch.riotgames.com/en-us/collection/league-classic/ and /category/league-of-legends/.",
  variants: [
    {
      name: "Dark theme — solid background (default)",
      notes:
        "Dark solid background (--color-merch-ink), white text, breadcrumb with muted/white crumb links. Matches the real store's collection banner with no image.",
      backgrounds: ["light"],
      render: () => (
        <MerchCollectionHero
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
      name: "Shop All — no breadcrumbs, no item count",
      notes:
        "Minimal variant: heading only. Matches /shop-all page: 'Home > Shop All'.",
      backgrounds: ["light"],
      render: () => (
        <MerchCollectionHero
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
