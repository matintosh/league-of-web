/**
 * /merch/product/[handle] — canonical PDP route.
 * Thin server component: resolves fixture data by handle and delegates to ProductPageClient
 * (which provides MerchHeader + MerchFooter + MerchCartDrawer shell).
 *
 * This is the canonical path (1:1 with merch.riotgames.com/en-us/product/<handle>).
 * The old /merch/[handle] route issues a 308 permanentRedirect here.
 *
 * For interactive demos (variant switching, qty stepper) see the /showcase entries.
 */
import { notFound } from "next/navigation";
import { MERCH_PRODUCTS, merchAssetUrl } from "@low/fixtures";
import type { MerchProduct } from "@low/fixtures";
import { ProductPageClient } from "./product-page-client";

// ---------------------------------------------------------------------------
// Per-product PDP data not stored on MerchProduct (gallery images, categoryTrail, notices)
// ---------------------------------------------------------------------------

interface PdpExtra {
  /** Ordered gallery image URLs (first = hero). */
  images: string[];
  /** Category trail above the h1. */
  categoryTrail?: string[];
  /** Purchase notices between price and CTA. */
  notices?: string[];
  /** Breadcrumb trail. */
  breadcrumb: string[];
  /** Size/variant chips. Empty array = no selector. */
  variants: { label: string; available: boolean }[];
  /** Full-text description. */
  description: string;
}

const APPAREL_SIZES = [
  { label: "XS", available: true },
  { label: "S", available: true },
  { label: "M", available: true },
  { label: "L", available: true },
  { label: "XL", available: true },
  { label: "XXL", available: true },
];

const DEFAULT_NOTICES = [
  "This product is not intended as a toy or children's product.",
  "This item typically ships within 2 weeks from purchase.",
];

const PLUSH_NOTICES = [
  "This product is not intended as a toy or children's product.",
  "This item typically ships within 2 weeks from purchase.",
];

/**
 * PDP-specific extra data keyed by product slug.
 * Gallery images come from Sanity CDN via `merchAssetUrl`.
 */
const PDP_EXTRAS: Record<string, PdpExtra> = {
  "league-classic-collectors-box": {
    breadcrumb: ["Home", "Collectibles", "League of Legends Classic Collector's Box"],
    categoryTrail: ["Collectibles", "Bundles", "League of Legends"],
    notices: DEFAULT_NOTICES,
    variants: [],
    description:
      "The ultimate League of Legends collector's set. Includes exclusive in-game content, premium physical collectibles, and limited-edition artwork. While supplies last.",
    images: [
      merchAssetUrl("ed593ec11a590c788d3ec1b634ce0b72a63b1059-2560x2560.png", { w: 1200 }),
      merchAssetUrl("90fbdec8c3eb880925465c353ec3008232884399-2560x2560.png", { w: 1200 }),
      merchAssetUrl("8c31457af6be19f63c1c7db02a17cf35b294f69f-2560x2560.png", { w: 1200 }),
      merchAssetUrl("6c5085455d8e8802cb29dd2d38b660e16aa446e4-2560x2560.png", { w: 1200 }),
    ],
  },
  "rocklove-lol-heart-of-gold-ring": {
    breadcrumb: ["Home", "Collectibles", "RockLove League of Legends Classic Heart of Gold Ring"],
    categoryTrail: ["Collectibles", "Jewelry", "League of Legends"],
    notices: DEFAULT_NOTICES,
    variants: [
      { label: "5", available: true },
      { label: "6", available: true },
      { label: "7", available: true },
      { label: "8", available: true },
      { label: "9", available: false },
    ],
    description:
      "Inspired by the beloved Heart of Gold item, this officially licensed ring is handcrafted in sterling silver with gold plating. A limited-edition piece for the true League collector.",
    images: [
      merchAssetUrl("8a423221c48327f9f1d5549a08678ffed8e08adf-2560x2560.png", { w: 1200 }),
    ],
  },
  "twitch-7in-limited-edition-statue": {
    breadcrumb: ["Home", "Collectibles", 'Twitch 7" Limited Edition Statue'],
    categoryTrail: ["Collectibles", "Figures", "League of Legends"],
    notices: DEFAULT_NOTICES,
    variants: [],
    description:
      'A 7" limited-edition statue of Twitch, the Plague Rat. Hand-painted with premium detail. Individually numbered. While supplies last.',
    images: [
      merchAssetUrl("d8e1532ea8be393a605c65436f3b3d2150b3230f-2560x2560.png", { w: 1200 }),
    ],
  },
  "amumu-plush": {
    breadcrumb: ["Home", "Collectibles", "Amumu Plush"],
    categoryTrail: ["Collectibles", "Plush", "League of Legends"],
    notices: PLUSH_NOTICES,
    variants: [],
    description:
      "The Sad Mummy is here — soft, huggable Amumu plush. Perfect for any League fan. Officially licensed.",
    images: [
      merchAssetUrl("bac8ecd0218d8af9d8f0d78d4fca40cb27a8a803-2560x2560.png", { w: 1200 }),
    ],
  },
  "lol-classic-hoodie": {
    breadcrumb: ["Home", "Apparel", "League of Legends Classic Hoodie"],
    categoryTrail: ["Apparel", "Hoodies", "League of Legends"],
    notices: DEFAULT_NOTICES,
    variants: APPAREL_SIZES,
    description:
      "Show your League pride with this official League of Legends Classic Hoodie. Premium fleece, embroidered crest, kangaroo pocket.",
    images: [
      merchAssetUrl("a87ba685e599a287b6f56c32fb629d0d8515c828-2560x2560.png", { w: 1200 }),
    ],
  },
  "lol-classic-yearbook-tee": {
    breadcrumb: ["Home", "Apparel", "League of Legends Classic Yearbook Tee"],
    categoryTrail: ["Apparel", "T-Shirts", "League of Legends"],
    notices: DEFAULT_NOTICES,
    variants: APPAREL_SIZES,
    description:
      "Celebrate the history of the Rift with this retro-style yearbook tee. 100% cotton, preshrunk.",
    images: [
      merchAssetUrl("8f1db0c815008cde9070446a5bc9a205f702b840-2560x2560.png", { w: 1200 }),
    ],
  },
  "riftbound-vendetta-zed-shen-showdown-deck": {
    breadcrumb: ["Home", "Riftbound", "Riftbound: LoL TCG Vendetta Zed vs Shen Showdown Deck"],
    categoryTrail: ["Riftbound", "Decks", "League of Legends TCG"],
    notices: DEFAULT_NOTICES,
    variants: [],
    description:
      "Two complete competitive decks for the Riftbound TCG — Zed and Shen face off in this ultimate showdown box. Includes exclusive card backs and foil alternates.",
    images: [
      merchAssetUrl("e8238ddeff8f44a3164a3155712307fad4d9f7fb-2560x2560.png", { w: 1200 }),
    ],
  },
  "riftbound-vendetta-booster-display": {
    breadcrumb: ["Home", "Riftbound", "Riftbound: LoL TCG Vendetta Booster Display"],
    categoryTrail: ["Riftbound", "Booster Displays", "League of Legends TCG"],
    notices: DEFAULT_NOTICES,
    variants: [],
    description:
      "A full booster display of 24 Vendetta booster packs for the Riftbound TCG. Each pack contains 15 cards with guaranteed rare slots.",
    images: [
      merchAssetUrl("3102667c372acb3a074f2ca9c2fdbc1caeaef923-2560x2560.png", { w: 1200 }),
    ],
  },
  "lol-classic-cap": {
    breadcrumb: ["Home", "Apparel", "League of Legends Classic Cap"],
    categoryTrail: ["Apparel", "Headwear", "League of Legends"],
    notices: DEFAULT_NOTICES,
    variants: [
      { label: "One Size", available: true },
    ],
    description:
      "Classic 6-panel structured cap with embroidered League of Legends crest. Adjustable strap.",
    images: [
      merchAssetUrl("a87ba685e599a287b6f56c32fb629d0d8515c828-2560x2560.png", { w: 1200 }),
    ],
  },
  "amumu-plush-mini": {
    breadcrumb: ["Home", "Collectibles", "Amumu Mini Plush — Sale"],
    categoryTrail: ["Collectibles", "Plush", "League of Legends"],
    notices: PLUSH_NOTICES,
    variants: [],
    description:
      "Mini version of the beloved Amumu plush — perfect for your desk or keychain hoop. On sale while supplies last.",
    images: [
      merchAssetUrl("bac8ecd0218d8af9d8f0d78d4fca40cb27a8a803-2560x2560.png", { w: 1200 }),
    ],
  },
};

/** Carousel uses the real products excluding the current PDP product. */
function carouselFor(slug: string): MerchProduct[] {
  return MERCH_PRODUCTS.filter((p) => p.slug !== slug);
}

interface Props {
  params: Promise<{ handle: string }>;
}

export default async function MerchProductPage({ params }: Props) {
  const { handle } = await params;

  // Resolve fixture product by slug (slug === URL handle).
  const product = MERCH_PRODUCTS.find((p) => p.slug === handle);
  if (!product) {
    notFound();
  }

  const extra = PDP_EXTRAS[handle] ?? {
    breadcrumb: ["Home", product.title],
    categoryTrail: undefined,
    notices: DEFAULT_NOTICES,
    variants: [],
    description: product.title,
    images: [product.imageUrl],
  };

  const carouselProducts = carouselFor(handle);
  // Use the product's primary image as the carousel banner.
  const carouselBannerImageUrl = extra.images[0];

  return (
    <ProductPageClient
      title={product.title}
      price={product.price}
      originalPrice={product.originalPrice}
      badges={product.badges ?? (product.badge ? [product.badge] : [])}
      description={extra.description}
      breadcrumb={extra.breadcrumb}
      categoryTrail={extra.categoryTrail}
      notices={extra.notices}
      variants={extra.variants}
      images={extra.images}
      carouselProducts={carouselProducts}
      carouselBannerImageUrl={carouselBannerImageUrl}
    />
  );
}
