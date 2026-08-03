export type Availability = "online" | "away" | "in-game" | "in-queue" | "offline";

export interface Wallet {
  /** Riot Points (paid currency) */
  rp: number;
  /** Blue Essence */
  blueEssence: number;
}

export interface Summoner {
  gameName: string;
  tagLine: string;
  level: number;
  profileIconId: number;
  availability: Availability;
}

export interface Friend {
  summoner: Summoner;
  /** e.g. "League of Legends", "Away", custom status text */
  statusText?: string;
  groupName: string;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export interface HeroSlide {
  /** Skin-line collection name rendered in large display text, e.g. "DEMACIA VICE". */
  skinLine: string;
  /** Short subtitle beneath the skin line. */
  subtitle: string;
  /** RP cost shown in the overlay. */
  rpPrice: number;
  /** Full splash art URL (460×300px recommended). */
  splashUrl: string;
}

export interface StoreItem {
  /** Unique stable id (fixture slug or server id). */
  id: string;
  /** Display name shown on the tile. */
  name: string;
  /** Category — drives layout and badge display rules. */
  type: "skin" | "bundle" | "currency" | "pass";
  /** RP cost. */
  rpPrice: number;
  /** Optional Blue Essence cost (shown instead of RP on BE items). */
  bePrice?: number;
  /** Thumbnail / splash art URL. */
  imageUrl: string;
  /** Optional bundle quantity badge, e.g. 10 → renders "10x". */
  quantity?: number;
  /** Whether this item is in the user's wishlist. */
  isWishlisted?: boolean;
  /** When true, renders a "Not enough RP" label in red. */
  insufficientRP?: boolean;
  /**
   * Optional icon URLs for the individual contents of a bundle/pass, shown as a
   * vertical column of circular glyphs at the tile's right edge (grid variant).
   * Up to 3 render; any beyond that are collapsed behind a "+N" overflow slot.
   * Presentational — callers supply resolved URLs (e.g. from a cdragon helper).
   */
  subItems?: StoreSubItem[];
}

/** One contained item shown in a featured tile's right-edge glyph column. */
export interface StoreSubItem {
  /** Stable id for the contained item (used as React key + alt text). */
  id: string;
  /** Accessible label, e.g. "Arcade 2019 Ward Skin". */
  name: string;
  /** Circular glyph art URL (caller-resolved). */
  iconUrl: string;
}

// ---------------------------------------------------------------------------
// Purchase modal
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Champion Mastery + Eternals (Profile Overview panel — issue #245)
// ---------------------------------------------------------------------------

/**
 * One champion mastery entry (left panel of MasteryEternalsPanel).
 * Presentational: all image URLs are resolved by the caller.
 */
export interface ChampionMasteryEntry {
  /** DDragon champion id, e.g. "Blitzcrank". Used for alt text. */
  championId: string;
  /** Display name shown under the crest, e.g. "BLITZCRANK". */
  championName: string;
  /** Square champion portrait URL (e.g. `championSquareUrl("Blitzcrank")`). */
  championIconSrc: string;
  /** Mastery crest art URL (e.g. `masteryCrestUrl(7)`). */
  masteryCrestSrc: string;
  /** Mastery level (0 = none, 4–10 for modern mastery tiers). */
  masteryLevel: 0 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  /** Mastery point total, e.g. 412105. */
  points: number;
  /** Best grade achieved, e.g. "S+", "S-", "A". */
  bestGrade: string;
}

/**
 * One eternals stat entry (right panel of MasteryEternalsPanel).
 * Presentational: all image URLs resolved by the caller.
 */
export interface EternalEntry {
  /** Stat label, e.g. "Structures Destroyed". */
  name: string;
  /** Numeric stat value, e.g. 117. */
  value: number;
  /** Eternals 3D-render icon URL (CDragon or placeholder). */
  iconSrc: string;
  /** Small (~24px) champion portrait URL below the stat value. */
  championIconSrc: string;
  /** Champion id for alt text, e.g. "Blitzcrank". */
  championId: string;
}

/** A single item shown in the 2×2 preview grid of the purchase modal. */
export interface PurchaseItem {
  /** Stable item id. */
  id: string;
  /** Display name shown inside the preview tile. */
  name: string;
  /** Category label shown below the name. */
  category: "Champion" | "Skin" | "Ward Skin" | "Icon" | "Emote" | "Bundle";
  /** Art URL for the preview tile. */
  artUrl: string;
}

// ---------------------------------------------------------------------------
// Loot (Store → LOOT tab — issue #251)
// ---------------------------------------------------------------------------

/**
 * A single item in the loot inventory.
 * 2024+ era: matches the CRAFTING sub-tab inventory tile design.
 */
export interface LootItem {
  /** Unique stable loot id, e.g. "chest-hextech", "champion-shard-jinx". */
  id: string;
  /** Display name shown below the tile. */
  name: string;
  /**
   * Loot category — governs which group header this item appears under
   * and which sidebar filter icon is active.
   */
  category: "material" | "champion" | "skin" | "tactician" | "eternals";
  /**
   * Quantity owned. Shown as a badge in the tile bottom-right.
   * 0 = not owned (shown with a dimmed tile and "0" badge).
   */
  count: number;
  /** Item icon URL (CDragon loot_item_icons or category_icons). */
  iconSrc: string;
  /** Optional tier/rarity label, e.g. "Legendary", "Mythic". */
  tier?: string;
  /**
   * Recently-acquired flag. When true the tile shows a circular gold star
   * medallion overlapping its top edge (the client's "new loot" indicator).
   */
  isNew?: boolean;
}

/**
 * A category group in the loot inventory panel (e.g. "MATERIALS").
 * Groups are rendered with a label header then a horizontal tile row.
 */
export interface LootCategory {
  /** Internal category key. */
  id: "material" | "champion" | "skin" | "tactician" | "eternals";
  /** Display label in uppercase, e.g. "MATERIALS". */
  label: string;
  /** Items in this category. Empty categories show the header but no tiles. */
  items: LootItem[];
}

/**
 * One slot in the crafting forge (3 total).
 * null = empty slot with placeholder helmet icon + "0/1" label.
 */
export type ForgeSlot = LootItem | null;

// ---------------------------------------------------------------------------
// Clash scouting (Screen — issue #257)
// ---------------------------------------------------------------------------

/**
 * Per-champion entry shown in the scouting panel champion strip.
 * Presentational: all URLs resolved by caller.
 */
export interface ClashScoutingChampion {
  /** Champion square icon URL (e.g. `championSquareUrl("Ahri")`). */
  iconSrc: string;
  /** Win-rate percentage 0–100. */
  winPct: number;
  /** Total games played on this champion. */
  games: number;
  /** Average KDA ratio, e.g. 3.7. */
  kda: number;
}

/**
 * One opponent column in the Clash scouting panel.
 * Matches the 5-column layout in docs/reference/client-clash-scouting.png.
 */
export interface ClashScoutingPlayer {
  /** Summoner display name shown above the rank emblem. */
  summonerName: string;
  /** Rank tier label, e.g. "GOLD IV" or "SILVER I". */
  rankLabel: string;
  /**
   * Ranked emblem shield art URL.
   * Use `rankedEmblemUrl("Gold")` / `rankedEmblemUrl("Silver")` etc.
   */
  rankEmblemSrc: string;
  /**
   * Top played champions for this player (show up to 4 rows per the reference).
   * Pass 4 entries to match the reference screenshot.
   */
  champions: ClashScoutingChampion[];
}

/** Bundle / set data used to populate StoreItemPurchaseModal. */
export interface PurchaseBundle {
  /** Stable bundle id — must match the StoreItem id it originates from. */
  id: string;
  /** Bundle display name, e.g. "Arcade Caitlyn Border Set". */
  setName: string;
  /** Portrait art shown in Zone 1. */
  setArtUrl: string;
  /** Bullet breakdown lines, e.g. ["1 Champion", "1 Skin"]. */
  breakdown: string[];
  /** Original (pre-discount) RP price; null means no discount. */
  originalPrice: number | null;
  /** Discount percentage 0–100; null means no discount. */
  discountPct: number | null;
  /** Final RP price shown on the purchase button. */
  finalPrice: number;
  /** 2×2 preview items (up to 4). */
  items: PurchaseItem[];
}

// ---------------------------------------------------------------------------
// Merch store (merch.riotgames.com clone — /merch route)
// ---------------------------------------------------------------------------

/**
 * A single product in the Riot merch store.
 * Presentational: all image URLs are resolved by the caller (page / fixture file).
 */
export interface MerchProduct {
  /** URL-safe product slug, e.g. "riftbound-origins-champion-deck-jinx". */
  slug: string;
  /** Display title, e.g. "Riftbound Origins Champion Deck - Jinx". */
  title: string;
  /** Primary product image URL (square or portrait, object-fit: cover). */
  imageUrl: string;
  /** Display price string, e.g. "$19.99" or "$19.99 – $49.99". */
  price: string;
  /** Original (pre-sale) price string, e.g. "$29.99"; omit if not on sale. */
  originalPrice?: string;
  /** Optional badge label for the tile. */
  badge?: "New" | "Sale" | "Out of Stock" | "Limited" | "Preorder" | "Restock";
}

/**
 * A size or colour variant chip on the PDP purchase panel.
 */
export interface MerchVariant {
  /** Chip label, e.g. "S", "M", "L", "XL". */
  label: string;
  /** Whether this variant is available to purchase. */
  available: boolean;
}

/**
 * A line item in the merch cart drawer.
 */
export interface MerchCartItem {
  /** Unique line item id. */
  id: string;
  /** Product title. */
  title: string;
  /** Thumbnail URL (80×80, object-fit: cover). */
  imageUrl: string;
  /** Variant label shown below title, e.g. "Size: M" or "Color: Black / Size: L". */
  variantLabel?: string;
  /** Display price for one unit, e.g. "$39.99". */
  unitPrice: string;
  /** Current quantity (min 1). */
  quantity: number;
}
