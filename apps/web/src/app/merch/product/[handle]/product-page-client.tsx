"use client";

/**
 * ProductPageClient — client shell for /merch/product/[handle].
 * Wraps the gallery + purchase panel in MerchHeader + MerchFooter,
 * matching the shell pattern used by all other merch pages.
 * Holds cartOpen state and renders MerchCartDrawer.
 *
 * Layout (1280px desktop):
 *   Full-bleed 2-col grid: 64.7% (gallery) / 35.3% (panel), NO outer max-width cap.
 *   Gallery left edge at x=0; panel H1 lands ~x=867.
 *   Breadcrumb bar spans full width above the grid.
 *
 * Layout (390px mobile):
 *   Order: breadcrumb → compact title + [LoL logo][heart][share][badge] row → gallery → price/CTA.
 *   The mobile header row sits ABOVE the gallery image (hoisted out of the panel).
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMerchNav } from "@/lib/merch-nav";
import {
  MerchBreadcrumbBar,
  MerchHeader,
  MerchFooter,
  MerchProductGallery,
  MerchProductInfoTabs,
  MerchPurchasePanel,
  MerchCartDrawer,
  MerchCollectionHero,
  MerchShopCarousel,
  MerchSizeGuideModal,
} from "@low/ui";
import type { MerchCartItem, MerchProduct } from "@low/fixtures";

export interface ProductPageClientProps {
  /** Product title — displayed in the purchase panel. */
  title: string;
  /** Formatted price string, e.g. "$39.99". */
  price: string;
  /** Optional original/crossed-out price for sale items. */
  originalPrice?: string;
  /** Badge labels rendered by MerchPurchasePanel. */
  badges: string[];
  /** Full-text product description. */
  description: string;
  /** Breadcrumb trail for MerchBreadcrumbBar. */
  breadcrumb: string[];
  /**
   * Category trail rendered above the h1 in the purchase panel.
   * E.g. ["Collectibles", "Plush", "League of Legends"].
   */
  categoryTrail?: string[];
  /**
   * Purchase notices between the price and the CTA.
   * Real copy: "This product is not intended as a toy or children's product."
   * + "This item typically ships within 2 weeks from purchase."
   */
  notices?: string[];
  /** Size/variant options with availability flags. */
  variants: { label: string; available: boolean }[];
  /** Ordered list of gallery image URLs. */
  images: string[];
  /**
   * URL for the upper background layer of the diagonal PDP hero surface.
   * Measured: 828×800 webp textured light surface (Sanity consumer_products dataset).
   */
  bgImageUrl?: string;
  /**
   * URL for the lower/foreground diagonal navy band of the PDP hero surface.
   * Measured: 828×360 webp dark navy band (Sanity consumer_products dataset).
   */
  fgImageUrl?: string;
  /** Products for the "Shop More" franchise carousel below the product section. */
  carouselProducts?: MerchProduct[];
  /** Banner image URL for the franchise carousel (e.g. a wide splash from Data Dragon). */
  carouselBannerImageUrl?: string;
  /** Collection hero background image URL (used for the SHOP NOW band). */
  collectionBannerImageUrl?: string;
}

/** /merch/product/[handle] interactive page shell. */
export function ProductPageClient({
  title,
  price,
  originalPrice,
  badges,
  description,
  breadcrumb,
  categoryTrail,
  notices,
  variants,
  images,
  bgImageUrl,
  fgImageUrl,
  carouselProducts,
  carouselBannerImageUrl,
  collectionBannerImageUrl,
}: ProductPageClientProps) {
  const router = useRouter();
  const handleNavSelect = useMerchNav();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems] = useState<MerchCartItem[]>([]);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sizeGuideUnit, setSizeGuideUnit] = useState<"in" | "cm">("in");
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    variants.length > 0 ? variants[0]?.label : undefined
  );

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundColor: "var(--color-merch-bg)",
        fontFamily: "var(--font-merch)",
      }}
    >
      <MerchHeader
        cartCount={cartItems.length}
        onCartClick={() => setCartOpen(true)}
        onSearchClick={() => router.push("/merch/search")}
        onCategoryClick={handleNavSelect}
        onLogoClick={() => router.push("/merch")}
      />

      <main className="flex-1">
        {/*
         * Breadcrumb bar — FULL WIDTH, above the 2-col gallery/panel row.
         * Real site: ~1280×60 bar at y≈130, spanning the page container.
         */}
        {breadcrumb && breadcrumb.length > 0 && (
          <MerchBreadcrumbBar
            crumbs={breadcrumb.map((seg, idx) => ({
              label: seg,
              onClick: idx === 0 ? () => router.push("/merch") : undefined,
            }))}
          />
        )}

        {/*
         * ── Mobile-only compact header row ────────────────────────────────
         * Sits above the gallery on 390px viewports:
         *   [compact title 16px] + [LoL logo] [heart] [share] [badge]
         * Hidden on desktop (>768px) — the full panel handles it there.
         */}
        <div
          className="merch-pdp-mobile-header"
          style={{
            display: "none",
            padding: "12px 16px 0",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "var(--color-merch-ink-dark)",
              flex: "1 1 auto",
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </span>
          {/* Badge chip — real site shows badge in the purchase panel, not gallery */}
          {badges[0] && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 400,
                padding: "3px 7px",
                borderRadius: 2,
                backgroundColor: "var(--color-merch-badge-new)",
                color: "var(--color-merch-ink-dark)",
                flexShrink: 0,
              }}
            >
              {badges[0]}
            </span>
          )}
        </div>

        {/*
         * ── Full-bleed 2-col PDP grid ─────────────────────────────────────
         * Desktop: 64.7% gallery / 35.3% panel, full viewport width, ~40px internal gutters.
         * Mobile: single column stack.
         */}
        <div
          className="merch-pdp-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "64.7% 35.3%",
            width: "100%",
            alignItems: "start",
          }}
        >
          {/* Left: gallery — full-bleed to left edge, 24px right padding on desktop */}
          <div style={{ padding: "32px 24px 32px 40px", minWidth: 0 }}>
            <MerchProductGallery
              images={images}
              alt={title}
              selectedIndex={galleryIndex}
              onSelect={setGalleryIndex}
              bgImageUrl={bgImageUrl}
              fgImageUrl={fgImageUrl}
            />
          </div>

          {/* Right: purchase panel — 40px left padding matches real site ~x=867 */}
          <div style={{ padding: "32px 40px 32px 24px", minWidth: 0 }}>
            <MerchPurchasePanel
              title={title}
              price={price}
              originalPrice={originalPrice}
              badges={badges}
              categoryTrail={categoryTrail}
              notices={notices}
              variants={variants}
              variantLabel="Size"
              selectedVariant={selectedVariant}
              onVariantChange={setSelectedVariant}
              showQuantity={false}
              showSizeGuideLink={variants.length > 0}
              onSizeGuideClick={() => setSizeGuideOpen(true)}
              onWishlist={() => {}}
              onShare={() => {}}
              onAddToCart={() => {}}
            />
            <div style={{ marginTop: 32 }}>
              <MerchProductInfoTabs
                tabs={[
                  {
                    id: "description",
                    label: "Description",
                    content: <p style={{ margin: 0 }}>{description}</p>,
                  },
                ]}
                selectedTab="description"
              />
            </div>
          </div>
        </div>

        {/*
         * ── Collection SHOP NOW band ───────────────────────────────────────
         * Real site: 1280×320 band between the product section and related carousel.
         * Uses MerchCollectionHero as the band component.
         */}
        <div style={{ marginTop: 16 }}>
          <MerchCollectionHero
            heading="League of Legends"
            description="Explore the full collection of officially licensed League of Legends merchandise."
            backgroundImageUrl={collectionBannerImageUrl ?? carouselBannerImageUrl}
            theme="dark"
          />
        </div>
      </main>

      {/* Franchise carousel — below the collection band when products are supplied */}
      {carouselProducts && carouselProducts.length > 0 && carouselBannerImageUrl && (
        <section
          className="px-4 md:px-8"
          style={{ maxWidth: 1280, margin: "0 auto", width: "100%" }}
        >
          <MerchShopCarousel
            franchiseName="League of Legends"
            bannerImageUrl={carouselBannerImageUrl}
            products={carouselProducts}
            onProductClick={(slug) => router.push(`/merch/product/${slug}`)}
            onShopNowClick={() => router.push("/merch/shop-all")}
          />
        </section>
      )}

      <MerchFooter copyrightText="Copyright Riot Games 2025" />

      <MerchCartDrawer
        open={cartOpen}
        items={cartItems}
        subtotal="$0.00"
        onClose={() => setCartOpen(false)}
        onContinueShopping={() => setCartOpen(false)}
        onCheckout={() => router.push("/merch/cart")}
      />

      <MerchSizeGuideModal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        unit={sizeGuideUnit}
        onUnitChange={setSizeGuideUnit}
        rows={[
          { size: "S",   measurements: { a: 25,   b: 26.5,  c: 24.25 } },
          { size: "M",   measurements: { a: 26,   b: 27.5,  c: 24.5  } },
          { size: "L",   measurements: { a: 27,   b: 28.5,  c: 24.75 } },
          { size: "XL",  measurements: { a: 28,   b: 29.5,  c: 25    } },
          { size: "2XL", measurements: { a: 29,   b: 30.5,  c: 25.25 } },
        ]}
      />

      {/* Responsive styles — mobile layout overrides */}
      <style>{`
        @media (max-width: 768px) {
          .merch-pdp-mobile-header {
            display: flex !important;
          }
          .merch-pdp-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
