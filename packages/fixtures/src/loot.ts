/**
 * Loot fixture data — dummy items for the Store → LOOT tab (issue #251).
 * 2024+ era: CRAFTING sub-tab inventory + forge UI.
 *
 * All icon URLs use CDragon rcp-fe-lol-loot plugin (verified 200 on 2026-07-13).
 * Champion art uses DDragon loading art (public CDN, no API key).
 *
 * Fixture values only — never import in @low/ui components.
 */
import { championSquareUrl } from "./ddragon";
import type { LootCategory, ForgeSlot, LootItem } from "./types";

const LOOT_ICONS =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-loot/global/default/assets/loot_item_icons";

const LOOT_CAT_ICONS =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-loot/global/default/assets/category_icons";

// ---------------------------------------------------------------------------
// CDragon loot icon helpers
// ---------------------------------------------------------------------------

/** Loot item icon URL (CDragon rcp-fe-lol-loot · loot_item_icons). */
export const lootItemIconUrl = (filename: string): string =>
  `${LOOT_ICONS}/${filename}`;

/** Loot category sidebar icon URL (CDragon rcp-fe-lol-loot · category_icons). */
export const lootCategoryIconUrl = (
  name: "all" | "champion" | "skin" | "emote" | "eternals" | "chest" | "wardskin" | "companion",
): string => `${LOOT_CAT_ICONS}/${name}.png`;

// ---------------------------------------------------------------------------
// Demo inventory items
// ---------------------------------------------------------------------------

/** Hextech Chest — material; count: 0 */
const demoHextechChest: LootItem = {
  id: "material-chest-hextech",
  name: "Hextech Chest",
  category: "material",
  count: 0,
  iconSrc: lootItemIconUrl("chest.png"),
};

/** Hextech Key — material; count: 3 */
const demoHextechKey: LootItem = {
  id: "material-key",
  name: "Hextech Key",
  category: "material",
  count: 3,
  iconSrc: lootItemIconUrl("material_key.png"),
};

/** Bel'Veth champion shard */
const demoBelvethShard: LootItem = {
  id: "champion-shard-belveth",
  name: "Bel'Veth",
  category: "champion",
  count: 1,
  iconSrc: championSquareUrl("Belveth"),
};

/** Syndra champion shard — used in the forge slot */
const demaSyndraShard: LootItem = {
  id: "champion-shard-syndra",
  name: "Syndra",
  category: "champion",
  count: 1,
  iconSrc: championSquareUrl("Syndra"),
};

/** Demo skin shard — Legendary tier */
const demoSkinShard: LootItem = {
  id: "skin-shard-jinx-firecracker",
  name: "Firecracker Jinx",
  category: "skin",
  count: 1,
  iconSrc: championSquareUrl("Jinx"),
  tier: "Legendary",
};

// ---------------------------------------------------------------------------
// Demo loot categories (full inventory)
// ---------------------------------------------------------------------------

export const demoLootCategories: LootCategory[] = [
  {
    id: "material",
    label: "MATERIALS",
    items: [demoHextechChest, demoHextechKey],
  },
  {
    id: "champion",
    label: "CHAMPIONS",
    items: [demoBelvethShard],
  },
  {
    id: "skin",
    label: "SKINS",
    items: [demoSkinShard],
  },
  {
    id: "tactician",
    label: "TACTICIANS",
    items: [],
  },
  {
    id: "eternal",
    label: "ETERNALS",
    items: [],
  },
];

/** Empty loot state — useful for the empty-inventory showcase variant. */
export const emptyLootCategories: LootCategory[] = [
  { id: "material",   label: "MATERIALS",  items: [] },
  { id: "champion",   label: "CHAMPIONS",  items: [] },
  { id: "skin",       label: "SKINS",      items: [] },
  { id: "tactician",  label: "TACTICIANS", items: [] },
  { id: "eternal",    label: "ETERNALS",   items: [] },
];

// ---------------------------------------------------------------------------
// Demo forge slots
// ---------------------------------------------------------------------------

/**
 * Forge slots for the reference screenshot state:
 * slot 0 → Syndra shard (filled, 1/1), slots 1–2 → empty (0/1).
 */
export const demoForgeSlots: [ForgeSlot, ForgeSlot, ForgeSlot] = [
  demaSyndraShard,
  null,
  null,
];

/** All three slots filled — for showcase variant. */
export const filledForgeSlots: [ForgeSlot, ForgeSlot, ForgeSlot] = [
  demaSyndraShard,
  demoHextechKey,
  demoHextechChest,
];

/** All slots empty — for showcase variant. */
export const emptyForgeSlots: [ForgeSlot, ForgeSlot, ForgeSlot] = [null, null, null];

// ---------------------------------------------------------------------------
// Demo resource counters (bottom bar)
// ---------------------------------------------------------------------------

export const demoLootResources = {
  keyFragments: 33137,
  keys: 42,
  lootBags: 0,
};
