/**
 * /merch/product/[handle] — canonical PDP route.
 * Thin server component: resolves fixture data and delegates to ProductPageClient
 * (which provides MerchHeader + MerchFooter + MerchCartDrawer shell).
 *
 * This is the canonical path (1:1 with merch.riotgames.com/en-us/product/<handle>).
 * The old /merch/[handle] route issues a 308 permanentRedirect here.
 *
 * For interactive demos (variant switching, qty stepper) see the /showcase entries.
 */
import { championSplashUrl } from "@low/fixtures";
import type { MerchProduct } from "@low/fixtures";
import { ProductPageClient } from "./product-page-client";

/** Static fixture product for PDP demo. */
const DEMO_PRODUCT = {
  title: "MSI 2026 Tee",
  price: "$39.99",
  originalPrice: undefined as string | undefined,
  badges: ["New"] as string[],
  description:
    "Celebrate Midseason Showdown with this officially licensed apparel. 100% cotton preshrunk jersey tee. Machine washable. Unisex sizing.",
  breadcrumb: ["Home", "Apparel", "MSI 2026 Tee"],
  variants: [
    { label: "XS", available: true },
    { label: "S", available: true },
    { label: "M", available: true },
    { label: "L", available: false },
    { label: "XL", available: true },
    { label: "XXL", available: false },
  ],
  images: [
    championSplashUrl("Jinx", 0),
    championSplashUrl("Lux", 0),
    championSplashUrl("Vi", 0),
    championSplashUrl("Ahri", 0),
  ],
};

/** Fixture products for the franchise carousel below the product section. */
const CAROUSEL_PRODUCTS: MerchProduct[] = [
  { slug: "arcane-vi-hoodie",         title: "Arcane Vi Graphic Hoodie",                imageUrl: championSplashUrl("Vi", 0),      price: "$39.99", originalPrice: "$59.99", badge: "Sale" },
  { slug: "jinx-chaos-tee",           title: "Jinx Chaos Agent Graphic Tee",            imageUrl: championSplashUrl("Jinx", 0),    price: "$24.99", badge: "New" },
  { slug: "lol-classic-cap",          title: "League of Legends Classic Logo Cap",      imageUrl: championSplashUrl("Lux", 0),     price: "$27.99" },
  { slug: "project-lux-art-print",    title: "PROJECT: Lux Collector's Art Print",      imageUrl: championSplashUrl("Lux", 0),     price: "$34.99", badge: "Limited" },
  { slug: "poro-plush-s14",           title: "Poro Limited Edition Plush — Season 14",  imageUrl: championSplashUrl("Jinx", 0),    price: "$29.99", badge: "Preorder" },
  { slug: "arcane-caitlyn-figure",    title: "Arcane Caitlyn Collector's Resin Figure", imageUrl: championSplashUrl("Caitlyn", 0), price: "$49.99", badge: "Restock" },
  { slug: "lol-classic-collectors-box", title: "League Classic Collector's Box",        imageUrl: championSplashUrl("Ahri", 0),    price: "$89.99" },
];

interface Props {
  params: Promise<{ handle: string }>;
}

export default async function MerchProductPage({ params }: Props) {
  // `handle` is available for future dynamic fixture resolution.
  const { handle: _handle } = await params;

  return (
    <ProductPageClient
      title={DEMO_PRODUCT.title}
      price={DEMO_PRODUCT.price}
      originalPrice={DEMO_PRODUCT.originalPrice}
      badges={DEMO_PRODUCT.badges}
      description={DEMO_PRODUCT.description}
      breadcrumb={DEMO_PRODUCT.breadcrumb}
      variants={DEMO_PRODUCT.variants}
      images={DEMO_PRODUCT.images}
      carouselProducts={CAROUSEL_PRODUCTS}
      carouselBannerImageUrl={championSplashUrl("Vi", 0)}
    />
  );
}
