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
// Product fixtures — ~30 products mirroring the real merch.riotgames.com feed.
// All URLs use real Sanity CDN asset IDs (hotlinkable, no self-hosting).
// Verified 2026-08: CDN returns 200 for all asset IDs below.
// ---------------------------------------------------------------------------

import type { MerchProduct } from "./types";

// ---------------------------------------------------------------------------
// PDP description fixture types
// ---------------------------------------------------------------------------

/**
 * A measurement row in the Approximate Measurements block.
 * Each item is a human-readable line, e.g. "Height: ~11 inches / ~28 cm".
 */
export interface MerchMeasurementBlock {
  /** Section heading, e.g. "Approximate Measurements:". */
  heading: string;
  /** Each measurement line. */
  items: string[];
}

/**
 * Purchasing disclaimer block — bold heading + body copy.
 * Matches the PURCHASING DISCLAIMER(S) block on the real PDP.
 */
export interface MerchDisclaimerBlock {
  /** Heading label, e.g. "PURCHASING DISCLAIMER(S)". */
  heading: string;
  /** Disclaimer body text. */
  body: string;
}

/**
 * Structured product description for the PDP accordion panel.
 * Separates the multi-paragraph prose, measurements, and disclaimer
 * so that rendering components can apply correct typography to each block.
 *
 * Values are editorial copy — sourced from merch.riotgames.com/en-us/product/amumu-plush.
 */
export interface MerchProductDescription {
  /** One or more body paragraphs rendered as <p> elements. */
  paragraphs: string[];
  /** Optional measurements block (Approximate Measurements). */
  measurements?: MerchMeasurementBlock;
  /** Optional purchasing disclaimer block. */
  disclaimer?: MerchDisclaimerBlock;
}

/**
 * Full description content for the Amumu Plush PDP, measured from
 * merch.riotgames.com/en-us/product/amumu-plush (Playwright 2026-08).
 *
 * Panel: ~248px tall at 372px column width.
 * Body: 16px / line-height normal / Inter / --color-merch-body.
 * Measurements heading: 16px / 400.
 * Disclaimer heading: Inter 16px / 700.
 */
export const AMUMU_PLUSH_DESCRIPTION: MerchProductDescription = {
  paragraphs: [
    "As one of League's original 40 champions, the Sad Mummy has spent almost two decades searching for a hug — and now he can finally have one. This officially licensed Amumu Plush brings the Sad Mummy home in huggable plush form, lovingly crafted with soft materials and detailed embroidery.",
    "Whether you're a longtime fan of the Sad Mummy or just joining the Rift, this plush is the perfect companion for your desk, shelf, or the next time you need a hug. Bring home the Amumu Plush today and put an end to his centuries of solitude.",
  ],
  measurements: {
    heading: "Approximate Measurements:",
    items: [
      "Height: ~11 inches / ~28 cm",
      "Width: ~7 inches / ~18 cm",
      "Material: 100% polyester plush fabric",
    ],
  },
  disclaimer: {
    heading: "PURCHASING DISCLAIMER(S)",
    body: "This product is not intended as a toy or children's product. This item typically ships within 2 weeks from purchase. Quantities are limited — order early to avoid disappointment. Riot Games reserves the right to cancel orders that appear fraudulent.",
  },
};

// ---------------------------------------------------------------------------
// Product fixtures — ~30 products mirroring the real merch.riotgames.com feed.
// All image URLs use real Sanity CDN assets sourced from merch.riotgames.com
// (Playwright, 2026-08). No champion splash art used as product imagery.
// Verified 2026-08: CDN returns 200 for all asset IDs below.
// ---------------------------------------------------------------------------

/**
 * ~30 fixture products across 7 franchise groups matching the real homepage
 * feed depth: LoL Classic, MSI 2026, TFT Choncc line, VALORANT Masters London,
 * Riftbound TCG, Arcane, Sale items. All images use real Sanity CDN asset IDs
 * sourced from merch.riotgames.com (Playwright, 2026-08). No splash art.
 */
export const MERCH_PRODUCTS: MerchProduct[] = [
  // ── League of Legends Classic ─────────────────────────────────────────────
  // Real homepage order (7 items): Collector's Box → Twitch Statue → Yearbook Tee
  // → Gold Ring → Hoodie → Amumu → Pool Party Caitlyn (measured 2026-08).
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
    slug: "twitch-7in-limited-edition-statue",
    title: 'Twitch 7" Limited Edition Statue',
    imageUrl: merchAssetUrl("d8e1532ea8be393a605c65436f3b3d2150b3230f-2560x2560.png"),
    price: "$84.99",
    badges: ["New", "Preorder", "Limited Edition"],
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
    slug: "rocklove-lol-heart-of-gold-ring",
    title: "RockLove League of Legends Classic Heart of Gold Ring",
    imageUrl: merchAssetUrl("8a423221c48327f9f1d5549a08678ffed8e08adf-2560x2560.png"),
    price: "$199.99",
    badges: ["New", "Preorder", "Limited Edition"],
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
    slug: "amumu-plush",
    title: "Amumu Plush",
    imageUrl: merchAssetUrl("bac8ecd0218d8af9d8f0d78d4fca40cb27a8a803-2560x2560.png"),
    price: "$29.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "League of Legends",
  },
  {
    slug: "pool-party-caitlyn-bikini",
    title: "Pool Party Caitlyn Bikini",
    imageUrl: merchAssetUrl("31e7c2c734b4df133b027edbbbc66c84273b94c9-2560x2560.png"),
    price: "$49.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "League of Legends",
  },

  // ── MSI 2026 ─────────────────────────────────────────────────────────────
  // Real prices (2026-08): Jacket $74.99 / Jersey $64.99 / Long Sleeve Tee $69.99 / Tee $34.99.
  {
    slug: "msi-2026-jacket",
    title: "MSI 2026 Jacket",
    imageUrl: merchAssetUrl("9304d3ab3b0d8d0aa985e99627828a9f8f7a2502-2560x2560.png"),
    price: "$74.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "LoL Esports",
  },
  {
    slug: "msi-2026-jersey",
    title: "MSI 2026 Jersey",
    imageUrl: merchAssetUrl("5a1126c290b43c946f25ffc7b1b3096e9f0837d0-2560x2560.png"),
    price: "$64.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "LoL Esports",
  },
  {
    slug: "msi-2026-long-sleeve-tee",
    title: "MSI 2026 Long Sleeve Tee",
    imageUrl: merchAssetUrl("cbf765370a7166e0586050862a57f9b69040b654-2560x2560.png"),
    price: "$69.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "LoL Esports",
  },
  {
    slug: "msi-2026-tee",
    title: "MSI 2026 Tee",
    imageUrl: merchAssetUrl("f7782d9ffd1177af0bb59798540ffece932b6124-2560x2560.png"),
    price: "$34.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "LoL Esports",
  },

  // ── TFT Choncc line ────────────────────────────────────────────────────
  {
    slug: "tft-choncc-plush-xl",
    title: "TFT Choncc XL Plush",
    imageUrl: merchAssetUrl("7297076e445b28c11566e5afe6d348dff38d499e-2560x2560.png"),
    price: "$49.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "Teamfight Tactics",
  },
  {
    slug: "tft-choncc-hoodie",
    title: "TFT Choncc Graphic Hoodie",
    imageUrl: merchAssetUrl("0522c3c67034b27104400207ff3e6426ce945aa6-2560x2560.png"),
    price: "$69.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "Teamfight Tactics",
  },
  {
    slug: "tft-little-legends-pin-set",
    title: "TFT Little Legends Enamel Pin Set",
    imageUrl: merchAssetUrl("6c5085455d8e8802cb29dd2d38b660e16aa446e4-2560x2560.png"),
    price: "$24.99",
    badges: ["New", "Limited Edition"],
    badge: "New",
    franchiseLabel: "Teamfight Tactics",
  },

  // ── VCT Masters London ────────────────────────────────────────────────────
  // Real line: "VALORANT Masters London 26 //" at $59.99 / $44.99 / $39.99 (2026-08).
  {
    slug: "vct-masters-london-jersey",
    title: "VALORANT Masters London 26 // Jersey",
    imageUrl: merchAssetUrl("5c091e4fdde681d4149ae8c426f1a1851f446f9e-2560x2560.png"),
    price: "$59.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "VCT",
  },
  {
    slug: "vct-masters-london-hoodie",
    title: "VALORANT Masters London 26 // Pullover Hoodie",
    imageUrl: merchAssetUrl("d81d93d506631a487defed36a75d99cb2d52af13-2560x2560.png"),
    price: "$44.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "VCT",
  },
  {
    slug: "vct-masters-london-tee",
    title: "VALORANT Masters London 26 // Tee",
    imageUrl: merchAssetUrl("4b7290d0746f9e40ac250bfe25aa184ac6a0bd8a-2560x2560.jpg"),
    price: "$39.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "VCT",
  },

  // ── VALORANT ──────────────────────────────────────────────────────────────
  {
    slug: "valorant-masters-london-jersey",
    title: "VALORANT Masters London 2026 Jersey",
    imageUrl: merchAssetUrl("550d5115df74771d4aef0d92cecbe4f4cdd3712c-2560x2560.png"),
    price: "$64.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "VALORANT",
  },
  {
    slug: "valorant-jett-figure",
    title: "VALORANT Jett Collector Figure",
    imageUrl: merchAssetUrl("869e6cbe35d94e4378183c52db179c4edc39c503-2560x2560.png"),
    price: "$54.99",
    badges: ["New", "Limited Edition"],
    badge: "New",
    franchiseLabel: "VALORANT",
  },
  {
    slug: "valorant-logo-tee",
    title: "VALORANT Logo Tee",
    imageUrl: merchAssetUrl("2482e51bfb07ecd0cc0ed90998bce58bfe1f6699-2560x2560.png"),
    price: "$34.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "VALORANT",
  },

  // ── Riftbound TCG ─────────────────────────────────────────────────────────
  // Real shop-all page 1 ends with Riftbound items carrying "Out of Stock" badges.
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
  {
    slug: "riftbound-origins-starter-deck",
    title: "Riftbound: Origins Starter Deck — Jinx",
    imageUrl: merchAssetUrl("7f07ffee92dabe0e6b2dac03d219e574eebdb870-2560x2560.png"),
    price: "$19.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "Riftbound",
  },
  {
    slug: "riftbound-vendetta-booster-pack",
    title: "Riftbound: Vendetta Booster Pack (10-card)",
    imageUrl: merchAssetUrl("e0a08c2f8d9e931a799617aaf74cb1f89a71e148-2560x2560.png"),
    price: "$4.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "Riftbound",
  },

  // ── 2XKO ──────────────────────────────────────────────────────────────────
  // Real: posters at $28 (whole-dollar, no cents) with "Special Edition" (purple)
  // + "Made to Order" (green) badges (measured merch.riotgames.com 2026-08).
  // `badge` uses "Limited" (valid enum value); `badges` carries the display labels.
  {
    slug: "2xko-poster-special-edition",
    title: "2XKO Special Edition Poster",
    imageUrl: merchAssetUrl("39ef595b21b59cc4fb45ef5af962454cb72c6a95-2560x2560.png"),
    price: "$28",
    badges: ["Special Edition", "Made to Order"],
    badge: "Limited",
    franchiseLabel: "2XKO",
  },
  {
    slug: "2xko-duelists-poster",
    title: "2XKO Duelists Poster",
    imageUrl: merchAssetUrl("b6755dec3164466c86fac5b695df9f1cbb704a14-2560x2560.png"),
    price: "$28",
    badges: ["Special Edition", "Made to Order"],
    badge: "Limited",
    franchiseLabel: "2XKO",
  },

  // ── Riftbound TCG ─────────────────────────────────────────────────────
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
  {
    slug: "riftbound-origins-starter-deck",
    title: "Riftbound: Origins Starter Deck — Jinx",
    imageUrl: merchAssetUrl("7f07ffee92dabe0e6b2dac03d219e574eebdb870-2560x2560.png"),
    price: "$19.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "Riftbound",
  },
  {
    slug: "riftbound-vendetta-booster-pack",
    title: "Riftbound: Vendetta Booster Pack (10-card)",
    imageUrl: merchAssetUrl("e0a08c2f8d9e931a799617aaf74cb1f89a71e148-2560x2560.png"),
    price: "$4.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "Riftbound",
  },

  // ── Arcane ────────────────────────────────────────────────────────────
  {
    slug: "arcane-vi-hoodie",
    title: "Arcane Vi Graphic Hoodie",
    imageUrl: merchAssetUrl("74c1cee04be48521280fd81d65a7ded689500c53-2560x2560.png"),
    price: "$64.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "Arcane",
  },
  {
    slug: "arcane-jinx-chaos-tee",
    title: "Arcane Jinx Chaos Agent Tee",
    imageUrl: merchAssetUrl("03aa395bfc5d6e3b4345eec4dcafa76927a36ef5-2560x2560.png"),
    price: "$29.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "Arcane",
  },
  {
    slug: "arcane-caitlyn-figure",
    title: "Arcane Caitlyn Collector's Resin Figure",
    imageUrl: merchAssetUrl("5ca9a0f2ed65245214c48d97cd6378466db9a42f-2560x2560.png"),
    price: "$49.99",
    badges: ["New", "Limited Edition"],
    badge: "New",
    franchiseLabel: "Arcane",
  },

  // ── Apparel (category:apparel) ────────────────────────────────────────
  // Additional apparel items to populate /merch/collection/apparel with
  // enough depth to demonstrate 8-per-page LOAD MORE (real: 138 items).
  {
    slug: "apparel-lol-classic-zip-hoodie",
    title: "League of Legends Classic Zip-Up Hoodie",
    imageUrl: merchAssetUrl("a87ba685e599a287b6f56c32fb629d0d8515c828-2560x2560.png"),
    price: "$74.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "League of Legends",
  },
  {
    slug: "apparel-lol-classic-varsity-jacket",
    title: "League of Legends Classic Varsity Jacket",
    imageUrl: merchAssetUrl("9304d3ab3b0d8d0aa985e99627828a9f8f7a2502-2560x2560.png"),
    price: "$129.99",
    badges: ["New", "Limited Edition"],
    badge: "New",
    franchiseLabel: "League of Legends",
  },
  {
    slug: "apparel-msi-2026-polo",
    title: "MSI 2026 Performance Polo",
    imageUrl: merchAssetUrl("f7782d9ffd1177af0bb59798540ffece932b6124-2560x2560.png"),
    price: "$49.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "LoL Esports",
  },
  {
    slug: "apparel-arcane-jinx-bomber",
    title: "Arcane Jinx Bomber Jacket",
    imageUrl: merchAssetUrl("74c1cee04be48521280fd81d65a7ded689500c53-2560x2560.png"),
    price: "$119.99",
    badges: ["New", "Limited Edition"],
    badge: "New",
    franchiseLabel: "Arcane",
  },
  {
    slug: "apparel-valorant-tactical-hoodie",
    title: "VALORANT Tactical Pullover Hoodie",
    imageUrl: merchAssetUrl("d81d93d506631a487defed36a75d99cb2d52af13-2560x2560.png"),
    price: "$79.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "VALORANT",
  },
  {
    slug: "apparel-vct-windbreaker",
    title: "VCT 2026 Championship Windbreaker",
    imageUrl: merchAssetUrl("550d5115df74771d4aef0d92cecbe4f4cdd3712c-2560x2560.png"),
    price: "$89.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "VCT",
  },
  {
    slug: "apparel-2xko-launch-hoodie",
    title: "2XKO Launch Hoodie",
    imageUrl: merchAssetUrl("b6755dec3164466c86fac5b695df9f1cbb704a14-2560x2560.png"),
    price: "$69.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "2XKO",
  },
  {
    slug: "apparel-lol-classic-crewneck",
    title: "League of Legends Classic Crewneck Sweatshirt",
    imageUrl: merchAssetUrl("8f1db0c815008cde9070446a5bc9a205f702b840-2560x2560.png"),
    price: "$54.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "League of Legends",
  },
  {
    slug: "apparel-tft-choncc-tee",
    title: "TFT Choncc Graphic Tee",
    imageUrl: merchAssetUrl("03aa395bfc5d6e3b4345eec4dcafa76927a36ef5-2560x2560.png"),
    price: "$29.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "Teamfight Tactics",
  },
  {
    slug: "apparel-arcane-vi-track-jacket",
    title: "Arcane Vi Track Jacket",
    imageUrl: merchAssetUrl("0522c3c67034b27104400207ff3e6426ce945aa6-2560x2560.png"),
    price: "$99.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "Arcane",
  },

  // ── Sale items (7 items — matches real "Sales (7)" count) ───────────────────
  {
    slug: "lol-classic-cap-sale",
    // Fixed: title "Classic Cap" now matches the cap packshot (f8855c0e…), not a hoodie.
    title: "League of Legends Classic Logo Cap",
    imageUrl: merchAssetUrl("f8855c0e351de66671faf5e009fd161ed508bd4c-2560x2560.png"),
    price: "$19.99",
    originalPrice: "$34.99",
    badges: ["Sale"],
    badge: "Sale",
    franchiseLabel: "League of Legends",
  },
  {
    slug: "amumu-plush-mini-sale",
    title: "Amumu Mini Plush",
    imageUrl: merchAssetUrl("bac8ecd0218d8af9d8f0d78d4fca40cb27a8a803-2560x2560.png"),
    price: "$14.99",
    originalPrice: "$24.99",
    badges: ["Sale"],
    badge: "Sale",
    franchiseLabel: "League of Legends",
  },
  {
    slug: "lol-classic-keychain-sale",
    title: "League of Legends Classic Keychain Set",
    imageUrl: merchAssetUrl("8c31457af6be19f63c1c7db02a17cf35b294f69f-2560x2560.png"),
    price: "$9.99",
    originalPrice: "$16.99",
    badges: ["Sale"],
    badge: "Sale",
    franchiseLabel: "League of Legends",
  },
  {
    slug: "lol-classic-poro-plush-sale",
    title: "Poro Limited Edition Plush",
    imageUrl: merchAssetUrl("31e7c2c734b4df133b027edbbbc66c84273b94c9-2560x2560.png"),
    price: "$19.99",
    originalPrice: "$29.99",
    badges: ["Sale"],
    badge: "Sale",
    franchiseLabel: "League of Legends",
  },
  {
    slug: "valorant-logo-tee-sale",
    title: "VALORANT Logo Tee",
    imageUrl: merchAssetUrl("2482e51bfb07ecd0cc0ed90998bce58bfe1f6699-2560x2560.png"),
    price: "$14.99",
    originalPrice: "$29.99",
    badges: ["Sale"],
    badge: "Sale",
    franchiseLabel: "VALORANT",
  },
  {
    slug: "tft-choncc-sticker-pack-sale",
    title: "TFT Choncc Sticker Pack",
    imageUrl: merchAssetUrl("52512e6bfb59c2507b4956ec3a7007da267fc1e1-2560x2560.png"),
    price: "$5.99",
    originalPrice: "$9.99",
    badges: ["Sale"],
    badge: "Sale",
    franchiseLabel: "Teamfight Tactics",
  },
  {
    slug: "riftbound-acrylic-standee-sale",
    title: "Riftbound Acrylic Standee — Zed",
    imageUrl: merchAssetUrl("ee62b36ebf58552edf4feccef6a0f69efe06fe6e-2560x2560.png"),
    price: "$7.99",
    originalPrice: "$12.99",
    badges: ["Sale"],
    badge: "Sale",
    franchiseLabel: "Riftbound",
  },
];

// ---------------------------------------------------------------------------
// Franchise feature card fixtures — full-width 1278×748 hero cards per
// franchise group, matching the real homepage's section-opening feature cards.
// ---------------------------------------------------------------------------

/** A franchise feature card shown at the top of each brand section. */
export interface MerchFranchiseFeatureCard {
  /** Franchise key, e.g. "league-of-legends". */
  franchiseSlug: string;
  /** Display name, e.g. "LEAGUE OF LEGENDS". */
  franchiseLabel: string;
  /** Campaign headline, e.g. "CLASSIC COLLECTION". */
  headline: string;
  /** Optional subheadline / campaign copy. */
  subcopy?: string;
  /** Feature card image URL (wide 16:9 or ~1278×748). */
  imageUrl: string;
  /** CTA label, e.g. "Shop the Collection". */
  ctaLabel?: string;
}

/**
 * Real franchise feature cards mirroring the real homepage's brand sections.
 * Image URLs use existing Sanity CDN assets where available; champion splash
 * art is used as a placeholder for franchises without a dedicated feature image.
 */
export const MERCH_FRANCHISE_FEATURE_CARDS: MerchFranchiseFeatureCard[] = [
  {
    franchiseSlug: "league-of-legends",
    franchiseLabel: "League of Legends",
    headline: "CLASSIC COLLECTION",
    subcopy: "Celebrate 15 years of League. Collectors' boxes, statues, and apparel.",
    imageUrl: merchAssetUrl("3dbbf5ce0d30940b0db3741cdb9d1bed12afce48-3296x1030.png", {
      w: 1280,
      dataset: "consumer_products_live",
    }),
    ctaLabel: "Shop the Collection",
  },
  {
    franchiseSlug: "riftbound",
    franchiseLabel: "Riftbound",
    headline: "VENDETTA — NEW TCG",
    subcopy: "The Riftbound TCG returns with Vendetta. Showdown decks and booster displays.",
    imageUrl: merchAssetUrl("a01262bae9dcf03621b7f850c89b86535b76638a-3296x1030.jpg", {
      w: 1280,
      dataset: "consumer_products_live",
    }),
    ctaLabel: "Shop Riftbound",
  },
];

/**
 * URL handles for the /merch/collection/[handle] browse route.
 * These match the switch cases in `apps/web/src/app/merch/collection/[handle]/page.tsx`.
 * Exported so `sitemap.ts` can enumerate collection routes from fixtures rather than
 * duplicating the handle list in app code.
 */
export const MERCH_COLLECTION_HANDLES: string[] = [
  "apparel",
  "collectibles",
  "riftbound",
  "league-of-legends",
  "sale",
];
