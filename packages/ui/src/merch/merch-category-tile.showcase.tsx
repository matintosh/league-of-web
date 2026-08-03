import { championSplashUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { MerchCategoryTile } from "./merch-category-tile";
import { MerchCategoryTileGrid } from "./merch-category-tile-grid";
import { MerchCategoryTileInteractiveDemo } from "./merch-category-tile.demo";

/** Placeholder images sourced from the Data Dragon CDN (ddragon.leagueoflegends.com). */
const IMGS = {
  ahri0:   championSplashUrl("Ahri", 0),
  jinx0:   championSplashUrl("Jinx", 0),
  vi0:     championSplashUrl("Vi", 0),
  lux0:    championSplashUrl("Lux", 0),
  lux1:    championSplashUrl("Lux", 1),
  teemo0:  championSplashUrl("Teemo", 0),
};

export const merchCategoryTileShowcase: ShowcaseEntry = {
  slug: "merch-category-tile",
  name: "Merch Category Tile",
  area: "merch",
  description:
    "Category/collection tile for the Collections index page: 16:9 image with hover scale(1.04), dark label strip with uppercase white text. Entire tile is clickable. Measured from merch.riotgames.com/en-us/collection/.",
  variants: [
    {
      name: "Default tile",
      notes: "Standard tile with name and image at ~400px wide.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 400 }}>
          <MerchCategoryTile
            slug="league-classic"
            name="League Classic"
            imageUrl={IMGS.ahri0}
          />
        </div>
      ),
    },
    {
      name: "Long name — overflow check",
      notes: "Category name exceeding typical length; label strip should not break layout.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 400 }}>
          <MerchCategoryTile
            slug="spirit-blossom-extended-collection"
            name="Spirit Blossom Extended Collector's Edition"
            imageUrl={IMGS.lux1}
          />
        </div>
      ),
    },
    {
      name: "Placeholder / missing image",
      notes: "When imageUrl points to a broken URL the surface background shows through.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 400 }}>
          <MerchCategoryTile
            slug="placeholder"
            name="Placeholder Category"
            imageUrl=""
            imageAlt="Placeholder — no image"
          />
        </div>
      ),
    },
    {
      name: "Standalone interactive tile",
      notes: "When onClick is provided the tile gains tabIndex and keyboard support (Enter/Space). Used for standalone usage without a wrapping <a>. Click or press Enter/Space to activate.",
      backgrounds: ["light"],
      render: () => <MerchCategoryTileInteractiveDemo />,
    },
    {
      name: "Grid of 3 tiles — MerchCategoryTileGrid",
      notes: "Three tiles rendered through the real MerchCategoryTileGrid, matching the lg desktop layout.",
      backgrounds: ["light"],
      render: () => (
        <MerchCategoryTileGrid heading="Collections">
          <MerchCategoryTile slug="arcane" name="Arcane" imageUrl={IMGS.vi0} />
          <MerchCategoryTile slug="project" name="PROJECT" imageUrl={IMGS.lux0} />
          <MerchCategoryTile slug="star-guardian" name="Star Guardian" imageUrl={IMGS.lux1} />
        </MerchCategoryTileGrid>
      ),
    },
  ],
};
