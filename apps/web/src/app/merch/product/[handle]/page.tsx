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
import { MERCH_PRODUCTS, merchAssetUrl } from "@low/fixtures";
import type { MerchProduct } from "@low/fixtures";
import { ProductPageClient } from "./product-page-client";

// Real product shot for the Collector's Box PDP (primary listing image, same as product card).
const COLLECTORS_BOX_IMAGE = merchAssetUrl(
  "ed593ec11a590c788d3ec1b634ce0b72a63b1059-2560x2560.png",
  { w: 1200 }
);

/** Static fixture product for PDP demo — Collector's Box with real imagery. */
const DEMO_PRODUCT = {
  title: "League of Legends Classic Collector's Box",
  price: "$89.99",
  originalPrice: undefined as string | undefined,
  badges: ["New", "Limited Edition", "Preorder"] as string[],
  description:
    "The ultimate League of Legends collector's set. Includes exclusive in-game content, premium physical collectibles, and limited-edition artwork. While supplies last.",
  breadcrumb: ["Home", "Collectibles", "League of Legends Classic Collector's Box"],
  variants: [] as { label: string; available: boolean }[],
  // Gallery: primary shot repeated at different Sanity transform widths for zoom demo
  images: [
    COLLECTORS_BOX_IMAGE,
    // Additional views from the real PDP gallery (first 3 non-primary images)
    merchAssetUrl("90fbdec8c3eb880925465c353ec3008232884399-2560x2560.png", { w: 1200 }),
    merchAssetUrl("8c31457af6be19f63c1c7db02a17cf35b294f69f-2560x2560.png", { w: 1200 }),
    merchAssetUrl("6c5085455d8e8802cb29dd2d38b660e16aa446e4-2560x2560.png", { w: 1200 }),
  ],
};

/** Carousel uses the real 8 products (excluding the PDP product itself). */
const CAROUSEL_PRODUCTS: MerchProduct[] = MERCH_PRODUCTS.filter(
  (p) => p.slug !== "league-classic-collectors-box"
);

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
      carouselBannerImageUrl={COLLECTORS_BOX_IMAGE}
    />
  );
}
