import type { ShowcaseEntry } from "../showcase";
import { mythicEssenceIconUrl, SAMPLE_MYTHIC_SHOP_ITEMS } from "@low/fixtures";
import { MythicShopPanel } from "./mythic-shop-panel";

export const mythicShopPanelShowcase: ShowcaseEntry = {
  slug: "mythic-shop-panel",
  name: "MythicShopPanel",
  area: "store",
  description:
    "Prestige skin grid for the Loot → MYTHIC SHOP sub-tab (2024+ era, Patch 14.24+ reference). " +
    "Centered display header, rotation description, and a 4-column grid of prestige skin cards " +
    "with Mythic Essence pricing chips. Rendered standalone here; in the client it mounts inside " +
    "LootTab's right panel when the MYTHIC SHOP sub-tab is active.",
  variants: [
    {
      name: "Full rotation (8 skins)",
      notes: "SAMPLE_MYTHIC_SHOP_ITEMS fixture — 380 ME each, DDragon loading art.",
      render: () => (
        <div className="h-[560px] w-[720px] overflow-hidden bg-hextech-black">
          <MythicShopPanel
            skins={SAMPLE_MYTHIC_SHOP_ITEMS}
            meIconSrc={mythicEssenceIconUrl()}
          />
        </div>
      ),
    },
    {
      name: "Short rotation (3 skins)",
      notes: "Partial rotation — grid left-fills, no placeholder slots.",
      render: () => (
        <div className="h-[560px] w-[720px] overflow-hidden bg-hextech-black">
          <MythicShopPanel
            skins={SAMPLE_MYTHIC_SHOP_ITEMS.slice(0, 3)}
            meIconSrc={mythicEssenceIconUrl()}
          />
        </div>
      ),
    },
  ],
};
