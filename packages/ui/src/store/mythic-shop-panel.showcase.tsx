import type { ShowcaseEntry } from "../showcase";
import {
  exaltedCardVideoUrl,
  mythicEssenceIconUrl,
  SAMPLE_MYTHIC_SHOP_ITEMS,
  type ExaltedTier,
} from "@low/fixtures";
import type { ExaltedCardFrameSources } from "./mythic-shop-panel";
import { MythicShopPanel } from "./mythic-shop-panel";

/**
 * Build the exalted frame video sources for one tier. Tier three ships no idle
 * loop (only 11 exalted files exist — see docs/reference/VIDEO-ASSETS.md), so
 * `loop` is left undefined for "three" and the card rests on the settled `bot`
 * frame after the reveal.
 */
function tierFrame(tier: ExaltedTier): ExaltedCardFrameSources {
  return {
    top: exaltedCardVideoUrl(tier, "top"),
    bot: exaltedCardVideoUrl(tier, "bot"),
    hover: exaltedCardVideoUrl(tier, "hover"),
    ...(tier === "three" ? {} : { loop: exaltedCardVideoUrl(tier, "loop") }),
  };
}

/**
 * Map the first three sample skins to the three exalted tiers, so a single
 * panel demonstrates tier one / two / three frames side by side. Remaining
 * cards render frameless (the pre-frame static look).
 */
const TIER_ORDER: ExaltedTier[] = ["one", "two", "three"];
const ALL_TIERS_FRAMES: Record<string, ExaltedCardFrameSources> =
  Object.fromEntries(
    SAMPLE_MYTHIC_SHOP_ITEMS.slice(0, 3).map((s, i) => [
      s.id,
      tierFrame(TIER_ORDER[i] ?? "one"),
    ]),
  );

/** Every card wears the tier-one frame — reads as a full animated rotation. */
const ALL_TIER_ONE_FRAMES: Record<string, ExaltedCardFrameSources> =
  Object.fromEntries(
    SAMPLE_MYTHIC_SHOP_ITEMS.map((s) => [s.id, tierFrame("one")]),
  );

export const mythicShopPanelShowcase: ShowcaseEntry = {
  slug: "mythic-shop-panel",
  name: "MythicShopPanel",
  area: "store",
  description:
    "Prestige skin grid for the Loot → MYTHIC SHOP sub-tab (2024+ era, Patch 14.24+ reference). " +
    "Centered display header, rotation description, and a 4-column grid of prestige skin cards " +
    "with Mythic Essence pricing chips. Cards can opt into the real client's animated exalted " +
    "card-frame videos (art-deco border: top→bot reveal, idle loop, hover swap via " +
    "var(--motion-crossfade)) — full-frame 400×512 straight-alpha overlays streamed from CDragon " +
    "(exaltedCardVideoUrl). Tier three ships no idle loop, so it rests on the settled frame. " +
    "Videos are pointer-events-none and hidden under prefers-reduced-motion (static card shows). " +
    "Rendered standalone here; in the client it mounts inside LootTab's right panel when the " +
    "MYTHIC SHOP sub-tab is active.",
  variants: [
    {
      name: "Full rotation (8 skins, no frames)",
      notes: "SAMPLE_MYTHIC_SHOP_ITEMS fixture — 380 ME each, DDragon loading art. Static baseline.",
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
      name: "Exalted frames — all three tiers",
      notes:
        "First three cards wear tier one / two / three exalted frames (gold, purple, prismatic). " +
        "Each reveals top→bot on mount then idles; hover a card to crossfade in its hover flourish. " +
        "Tier three (card 3) has no idle loop and rests on the settled frame.",
      render: () => (
        <div className="h-[560px] w-[720px] overflow-hidden bg-hextech-black">
          <MythicShopPanel
            skins={SAMPLE_MYTHIC_SHOP_ITEMS}
            meIconSrc={mythicEssenceIconUrl()}
            exaltedFrames={ALL_TIERS_FRAMES}
          />
        </div>
      ),
    },
    {
      name: "Exalted frames — tier one, full rotation",
      notes:
        "Every card wears the tier-one frame — the animated gold/teal art-deco border across a " +
        "whole rotation. Hover any card for the bright hover trace.",
      render: () => (
        <div className="h-[560px] w-[720px] overflow-hidden bg-hextech-black">
          <MythicShopPanel
            skins={SAMPLE_MYTHIC_SHOP_ITEMS}
            meIconSrc={mythicEssenceIconUrl()}
            exaltedFrames={ALL_TIER_ONE_FRAMES}
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
