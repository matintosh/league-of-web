/**
 * Sanity CDN helpers for merch.riotgames.com assets.
 * CDN project: dsfx7636. Hotlinkable (200, immutable 1yr cache).
 * Supports Sanity image transforms: ?w=&fm=&q=&accountingTag=
 */

const SANITY_BASE = "https://cdn.sanity.io/images/dsfx7636";

export interface MerchAssetOpts {
  /** Output width in pixels. Defaults to 640. */
  w?: number;
  /** Output format, e.g. "webp". Defaults to "webp". */
  fmt?: string;
  /** Quality 0–100. Defaults to 75. */
  q?: number;
  /**
   * Sanity dataset name. Defaults to "consumer_products_live".
   * Use "consumer_products" for campaign-specific hero assets.
   */
  dataset?: string;
}

/**
 * Builds a Sanity CDN URL for a merch asset.
 *
 * @param assetId - The full Sanity asset id including dimensions and extension,
 *   e.g. `"ed593ec11a590c788d3ec1b634ce0b72a63b1059-2560x2560.png"`.
 * @param opts - Optional transform parameters (width, format, quality, dataset).
 * @returns A fully-qualified, hotlinkable CDN URL with transform params appended.
 *
 * @example
 * // 640px webp product shot (default)
 * merchAssetUrl("ed593ec11a590c788d3ec1b634ce0b72a63b1059-2560x2560.png")
 *
 * @example
 * // 1920px webp hero banner from the campaign-specific dataset
 * merchAssetUrl("d9528f9cc6c88034bb963709002e0dfde2520fb7-1680x589.webp", {
 *   w: 1920,
 *   dataset: "consumer_products",
 * })
 */
export const merchAssetUrl = (assetId: string, opts: MerchAssetOpts = {}): string => {
  const { w = 640, fmt = "webp", q = 75, dataset = "consumer_products_live" } = opts;
  return `${SANITY_BASE}/${dataset}/${assetId}?w=${w}&fm=${fmt}&q=${q}&accountingTag=consumer_products`;
};

// ---------------------------------------------------------------------------
// Real product fixture — the 8 live products from merch.riotgames.com/en-us/shop-all/
// (verified 2026-08, all CDN URLs return 200 with ?w=640&fm=webp&q=75)
// ---------------------------------------------------------------------------

import type { MerchProduct } from "./types";

/**
 * The 8 real products currently live on merch.riotgames.com/en-us/shop-all/.
 * Square 2560×2560 product shots on white/transparent backgrounds.
 * Hotlinked from cdn.sanity.io — no self-hosting.
 */
export const MERCH_PRODUCTS: MerchProduct[] = [
  {
    slug: "league-classic-collectors-box",
    title: "League of Legends Classic Collector's Box",
    imageUrl: merchAssetUrl("ed593ec11a590c788d3ec1b634ce0b72a63b1059-2560x2560.png"),
    price: "$89.99",
    badges: ["New", "Limited Edition", "Preorder"],
    badge: "New",
    franchiseLabel: "League of Legends",
  },
  {
    slug: "rocklove-lol-heart-of-gold-ring",
    title: "RockLove League of Legends Classic Heart of Gold Ring",
    imageUrl: merchAssetUrl("8a423221c48327f9f1d5549a08678ffed8e08adf-2560x2560.png"),
    price: "$199.99",
    badges: ["New", "Preorder", "Limited Edition"],
    badge: "New",
    franchiseLabel: "League of Legends",
  },
  {
    slug: "twitch-7in-limited-edition-statue",
    title: 'Twitch 7" Limited Edition Statue',
    imageUrl: merchAssetUrl("d8e1532ea8be393a605c65436f3b3d2150b3230f-2560x2560.png"),
    price: "$84.99",
    badges: ["New", "Preorder", "Limited Edition"],
    badge: "New",
    franchiseLabel: "League of Legends",
  },
  {
    slug: "amumu-plush",
    title: "Amumu Plush",
    imageUrl: merchAssetUrl("bac8ecd0218d8af9d8f0d78d4fca40cb27a8a803-2560x2560.png"),
    price: "$29.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "League of Legends",
  },
  {
    slug: "lol-classic-hoodie",
    title: "League of Legends Classic Hoodie",
    imageUrl: merchAssetUrl("a87ba685e599a287b6f56c32fb629d0d8515c828-2560x2560.png"),
    price: "$64.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "League of Legends",
  },
  {
    slug: "lol-classic-yearbook-tee",
    title: "League of Legends Classic Yearbook Tee",
    imageUrl: merchAssetUrl("8f1db0c815008cde9070446a5bc9a205f702b840-2560x2560.png"),
    price: "$29.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "League of Legends",
  },
  {
    slug: "riftbound-vendetta-zed-shen-showdown-deck",
    title: "Riftbound: LoL TCG Vendetta Zed vs Shen Showdown Deck",
    imageUrl: merchAssetUrl("e8238ddeff8f44a3164a3155712307fad4d9f7fb-2560x2560.png"),
    price: "$34.99",
    badges: ["New", "Out of Stock"],
    badge: "Out of Stock",
    franchiseLabel: "Riftbound",
  },
  {
    slug: "riftbound-vendetta-booster-display",
    title: "Riftbound: LoL TCG Vendetta Booster Display",
    imageUrl: merchAssetUrl("3102667c372acb3a074f2ca9c2fdbc1caeaef923-2560x2560.png"),
    price: "$119.99",
    badges: ["New", "Out of Stock"],
    badge: "Out of Stock",
    franchiseLabel: "Riftbound",
  },
];
