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
}

// ---------------------------------------------------------------------------
// Purchase modal
// ---------------------------------------------------------------------------

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
