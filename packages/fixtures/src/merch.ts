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
// Real Sanity CDN asset IDs used where available; champion splash art from
// Data Dragon fills remaining slots (all URLs hotlinkable, no self-hosting).
// Verified 2026-08: CDN returns 200 for all real asset IDs below.
// ---------------------------------------------------------------------------

import type { MerchProduct } from "./types";
import { championSplashUrl } from "./ddragon";

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
// Real Sanity CDN asset IDs used where available; champion splash art from
// Data Dragon fills remaining slots (all URLs hotlinkable, no self-hosting).
// Verified 2026-08: CDN returns 200 for all real asset IDs below.
// ---------------------------------------------------------------------------

/**
 * ~30 fixture products across 7 franchise groups matching the real homepage
 * feed depth: LoL Classic, MSI 2026, TFT Choncc line, VALORANT Masters London,
 * Riftbound TCG, Arcane, Sale items. Real Sanity asset IDs used for the 8
 * verified live products; champion splash art used for the remaining fixtures.
 */
export const MERCH_PRODUCTS: MerchProduct[] = [
  // ── League of Legends Classic ────────────────────────────────────────────
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
    slug: "lol-classic-logo-cap",
    title: "League of Legends Classic Logo Cap",
    imageUrl: championSplashUrl("Jinx", 0),
    price: "$34.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "League of Legends",
  },
  {
    slug: "lol-classic-poro-plush",
    title: "Poro Limited Edition Plush",
    imageUrl: championSplashUrl("Lux", 0),
    price: "$29.99",
    badges: ["New", "Limited Edition"],
    badge: "New",
    franchiseLabel: "League of Legends",
  },

  // ── MSI 2026 ─────────────────────────────────────────────────────────────
  {
    slug: "msi-2026-jacket",
    title: "MSI 2026 Track Jacket",
    imageUrl: championSplashUrl("Lux", 6),
    price: "$84.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "LoL Esports",
  },
  {
    slug: "msi-2026-jersey",
    title: "MSI 2026 Jersey",
    imageUrl: championSplashUrl("Ahri", 0),
    price: "$54.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "LoL Esports",
  },
  {
    slug: "msi-2026-tee",
    title: "MSI 2026 Tee",
    imageUrl: championSplashUrl("Ezreal", 0),
    price: "$29.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "LoL Esports",
  },
  {
    slug: "msi-2026-hat",
    title: "MSI 2026 Snapback Hat",
    imageUrl: championSplashUrl("Caitlyn", 0),
    price: "$39.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "LoL Esports",
  },

  // ── TFT Choncc line ────────────────────────────────────────────────────
  {
    slug: "tft-choncc-plush-xl",
    title: "TFT Choncc XL Plush",
    imageUrl: championSplashUrl("Tristana", 0),
    price: "$49.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "Teamfight Tactics",
  },
  {
    slug: "tft-choncc-hoodie",
    title: "TFT Choncc Graphic Hoodie",
    imageUrl: championSplashUrl("Lulu", 0),
    price: "$69.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "Teamfight Tactics",
  },
  {
    slug: "tft-little-legends-pin-set",
    title: "TFT Little Legends Enamel Pin Set",
    imageUrl: championSplashUrl("Teemo", 0),
    price: "$24.99",
    badges: ["New", "Limited Edition"],
    badge: "New",
    franchiseLabel: "Teamfight Tactics",
  },

  // ── VALORANT Masters London ────────────────────────────────────────────
  {
    slug: "valorant-masters-london-jersey",
    title: "VALORANT Masters London 2026 Jersey",
    imageUrl: championSplashUrl("Vi", 0),
    price: "$64.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "VALORANT",
  },
  {
    slug: "valorant-masters-london-hoodie",
    title: "VALORANT Masters London Pullover Hoodie",
    imageUrl: championSplashUrl("Vi", 3),
    price: "$79.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "VALORANT",
  },
  {
    slug: "valorant-masters-london-tee",
    title: "VALORANT Masters London Event Tee",
    imageUrl: championSplashUrl("Jinx", 3),
    price: "$34.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "VALORANT",
  },
  {
    slug: "valorant-jett-figure",
    title: "VALORANT Jett Collector Figure",
    imageUrl: championSplashUrl("Akali", 0),
    price: "$54.99",
    badges: ["New", "Limited Edition"],
    badge: "New",
    franchiseLabel: "VALORANT",
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
    imageUrl: championSplashUrl("Jinx", 0),
    price: "$19.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "Riftbound",
  },
  {
    slug: "riftbound-vendetta-booster-pack",
    title: "Riftbound: Vendetta Booster Pack (10-card)",
    imageUrl: championSplashUrl("Zed", 0),
    price: "$4.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "Riftbound",
  },

  // ── Arcane ────────────────────────────────────────────────────────────
  {
    slug: "arcane-vi-hoodie",
    title: "Arcane Vi Graphic Hoodie",
    imageUrl: championSplashUrl("Vi", 5),
    price: "$64.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "Arcane",
  },
  {
    slug: "arcane-jinx-chaos-tee",
    title: "Arcane Jinx Chaos Agent Tee",
    imageUrl: championSplashUrl("Jinx", 5),
    price: "$29.99",
    badges: ["New"],
    badge: "New",
    franchiseLabel: "Arcane",
  },
  {
    slug: "arcane-caitlyn-figure",
    title: "Arcane Caitlyn Collector's Resin Figure",
    imageUrl: championSplashUrl("Caitlyn", 5),
    price: "$49.99",
    badges: ["New", "Limited Edition"],
    badge: "New",
    franchiseLabel: "Arcane",
  },

  // ── Sale items ────────────────────────────────────────────────────────
  {
    slug: "lol-classic-cap-sale",
    title: "League of Legends Classic Cap",
    imageUrl: merchAssetUrl("a87ba685e599a287b6f56c32fb629d0d8515c828-2560x2560.png"),
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
    imageUrl: championSplashUrl("Lux", 0),
    price: "$9.99",
    originalPrice: "$16.99",
    badges: ["Sale"],
    badge: "Sale",
    franchiseLabel: "League of Legends",
  },
  {
    slug: "valorant-logo-tee-sale",
    title: "VALORANT Logo Tee",
    imageUrl: championSplashUrl("Vi", 0),
    price: "$14.99",
    originalPrice: "$29.99",
    badges: ["Sale"],
    badge: "Sale",
    franchiseLabel: "VALORANT",
  },
  {
    slug: "tft-choncc-sticker-pack-sale",
    title: "TFT Choncc Sticker Pack",
    imageUrl: championSplashUrl("Teemo", 0),
    price: "$5.99",
    originalPrice: "$9.99",
    badges: ["Sale"],
    badge: "Sale",
    franchiseLabel: "Teamfight Tactics",
  },
  {
    slug: "riftbound-acrylic-standee-sale",
    title: "Riftbound Acrylic Standee — Zed",
    imageUrl: championSplashUrl("Zed", 0),
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
