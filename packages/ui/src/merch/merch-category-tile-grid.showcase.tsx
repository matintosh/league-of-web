import { championSplashUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { MerchCategoryTile } from "./merch-category-tile";
import { MerchCategoryTileGrid } from "./merch-category-tile-grid";

/** Placeholder images sourced from the Data Dragon CDN (ddragon.leagueoflegends.com). */
const IMGS = {
  ahri0:    championSplashUrl("Ahri", 0),
  ahri1:    championSplashUrl("Ahri", 1),
  ahri2:    championSplashUrl("Ahri", 2),
  jinx0:    championSplashUrl("Jinx", 0),
  jinx1:    championSplashUrl("Jinx", 1),
  jinx2:    championSplashUrl("Jinx", 2),
  vi0:      championSplashUrl("Vi", 0),
  vi1:      championSplashUrl("Vi", 1),
  vi2:      championSplashUrl("Vi", 2),
  lux0:     championSplashUrl("Lux", 0),
  lux1:     championSplashUrl("Lux", 1),
  lux2:     championSplashUrl("Lux", 2),
  teemo0:   championSplashUrl("Teemo", 0),
  teemo1:   championSplashUrl("Teemo", 1),
  caitlyn0: championSplashUrl("Caitlyn", 0),
};

export const merchCategoryTileGridShowcase: ShowcaseEntry = {
  slug: "merch-category-tile-grid",
  name: "Merch Category Tile Grid",
  area: "merch",
  description:
    "Responsive grid wrapper for MerchCategoryTile. 3 columns at lg (≥1024px), 2 at md, 1 on mobile — 24px gap at lg, 16px below. Heading at text-4xl / 800 weight / uppercase. Measured from merch.riotgames.com/en-us/collection/.",
  variants: [
    {
      name: "Full 9-tile grid — desktop view",
      notes: "All 9 real collection names at ~1280px; renders the complete Collections index.",
      backgrounds: ["light"],
      render: () => (
        <MerchCategoryTileGrid heading="Collections">
          <MerchCategoryTile slug="league-classic"    name="League Classic"         imageUrl={IMGS.ahri0} />
          <MerchCategoryTile slug="arcane"            name="Arcane"                 imageUrl={IMGS.vi0} />
          <MerchCategoryTile slug="valorant"          name="VALORANT"               imageUrl={IMGS.jinx0} />
          <MerchCategoryTile slug="tft"               name="Teamfight Tactics"      imageUrl={IMGS.teemo0} />
          <MerchCategoryTile slug="league-of-legends" name="League of Legends"      imageUrl={IMGS.lux0} />
          <MerchCategoryTile slug="ruination"         name="Ruination"              imageUrl={IMGS.vi1} />
          <MerchCategoryTile slug="project"           name="PROJECT"                imageUrl={IMGS.lux1} />
          <MerchCategoryTile slug="star-guardian"     name="Star Guardian"          imageUrl={IMGS.lux2} />
          <MerchCategoryTile slug="spirit-blossom"    name="Spirit Blossom"         imageUrl={IMGS.ahri1} />
        </MerchCategoryTileGrid>
      ),
    },
    {
      name: "Compact 4-tile grid",
      notes: "Four tiles — validates the 2-column tablet layout and heading-only usage.",
      backgrounds: ["light"],
      render: () => (
        <MerchCategoryTileGrid heading="Collections">
          <MerchCategoryTile slug="arcane"         name="Arcane"         imageUrl={IMGS.vi2} />
          <MerchCategoryTile slug="project"        name="PROJECT"        imageUrl={IMGS.lux0} />
          <MerchCategoryTile slug="star-guardian"  name="Star Guardian"  imageUrl={IMGS.ahri2} />
          <MerchCategoryTile slug="spirit-blossom" name="Spirit Blossom" imageUrl={IMGS.jinx2} />
        </MerchCategoryTileGrid>
      ),
    },
    {
      name: "Custom heading override",
      notes: 'heading prop overrides the default "Collections" text.',
      backgrounds: ["light"],
      render: () => (
        <MerchCategoryTileGrid heading="Browse Collections">
          <MerchCategoryTile slug="ruination"      name="Ruination"      imageUrl={IMGS.jinx1} />
          <MerchCategoryTile slug="tft"            name="Teamfight Tactics" imageUrl={IMGS.teemo1} />
          <MerchCategoryTile slug="league-classic" name="League Classic"  imageUrl={IMGS.caitlyn0} />
        </MerchCategoryTileGrid>
      ),
    },
  ],
};
