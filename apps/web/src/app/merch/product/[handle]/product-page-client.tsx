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
 *   Breadcrumb bar is ABSOLUTE — overlays the top of the grid, takes no layout space.
 *   Grid starts at header bottom (y≈130); breadcrumb at y≈130 h=60 overlays the hero.
 *
 * Layout (390px mobile):
 *   Single column stack — gallery first, then purchase panel below.
 *   Real site has NO separate compact mobile header row above the gallery;
 *   breadcrumb → gallery → grey category trail → big H1 → price → CTAs.
 *   The "merch-pdp-mobile-header" div (round-3 #857) has been removed (round-4 #893).
 *   Mobile CTAs: ATC full-width + BIN full-width, stacked column (~24px gap, h≈90).
 */

import React, { useState } from "react";
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
  /**
   * Description panel content — ReactNode for rich products (multi-paragraph,
   * measurements, disclaimer), plain string or <p> for simple products.
   */
  description: React.ReactNode;
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
   * Real amumu-plush: faint/absent — passed through to gallery which omits heavy overlay.
   */
  fgImageUrl?: string;
  /** Products for the "Shop More" franchise carousel below the product section. */
  carouselProducts?: MerchProduct[];
  /**
   * Banner image URL for the franchise band (wide campaign art, e.g. 3296×1030 LoL Classic).
   * Rendered in the 320px franchise band above the light-surface related carousel.
   */
  carouselBannerImageUrl?: string;
  /** Collection hero background image URL (used for the SHOP NOW band). */
  collectionBannerImageUrl?: string;
  /**
   * Franchise logo image URL for the carousel band (e.g. the LoL wordmark image).
   * Left-aligned in the 320px band per issue #895 measurement.
   */
  carouselFranchiseLogoUrl?: string;
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
  carouselFranchiseLogoUrl,
  // collectionBannerImageUrl consumed by page.tsx for the pdp-band (CSS gradient, not an image)
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
         * ── Full-bleed 2-col PDP grid ─────────────────────────────────────
         * Desktop: 64.7% gallery / 35.3% panel, full viewport width.
         * Mobile: single column stack (gallery first, then panel).
         * position:relative so the absolute breadcrumb overlay anchors here.
         */}
        <div
          className="merch-pdp-grid"
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "64.7% 35.3%",
            width: "100%",
            alignItems: "start",
          }}
        >
          {/*
           * Breadcrumb bar — ABSOLUTE overlay at top of grid, z=100.
           * Real site: position:absolute; z-index:100 at y=130, h=60,
           * overlaying the top of the 1280×800 hero — takes NO layout space.
           * Transparent background so the hero bleeds through.
           */}
          {breadcrumb && breadcrumb.length > 0 && (
            <div
              className="merch-pdp-breadcrumb"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                height: 60,
                display: "flex",
                alignItems: "center",
                background: "transparent",
              }}
            >
              <MerchBreadcrumbBar
                crumbs={breadcrumb.map((seg, idx) => ({
                  label: seg,
                  onClick: idx === 0 ? () => router.push("/merch") : undefined,
                }))}
              />
            </div>
          )}

          {/* Left: gallery — FULL-BLEED to left edge, no horizontal padding */}
          {/*
           * Real hero surface: x=0, w=828, h=800.
           * Padding removed per issue measurement: 32/24/32/40 → pushes surface x=40.
           * No padding here; the gallery component manages internal image positioning.
           */}
          <div style={{ minWidth: 0 }}>
            <MerchProductGallery
              images={images}
              alt={title}
              selectedIndex={galleryIndex}
              onSelect={setGalleryIndex}
              bgImageUrl={bgImageUrl}
              fgImageUrl={fgImageUrl}
            />
          </div>

          {/* Right: purchase panel */}
          {/*
           * Real: panel left edge x=868 (828 col + 40 gutter), H1 w=372.
           * padding-left:40px + grid split to 35.3% resolves to ~372px content width.
           */}
          <div style={{ padding: "32px 40px 32px 40px", minWidth: 0 }}>
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
              onBuyNow={() => {}}
            />
            {/*
             * Thin full-panel divider between notices/CTAs and Description accordion.
             * Real PDP: 1px grey rule spans the full panel width above the Description row.
             */}
            <div
              style={{
                marginTop: 32,
                borderTop: "1px solid var(--color-merch-divider)",
              }}
            >
              {/*
               * Description: accordion row — 18px/400 header, collapsed by default.
               * Body clamped to 3 lines (expand on toggle), color #000.
               * Real PDP round-4: accordion at y=662, body P clamped h=60.
               * NOTE: round-3 #858 used variant="static" but round-4 #893 reverts to accordion.
               */}
              <MerchProductInfoTabs
                tabs={[
                  {
                    id: "description",
                    label: "Description",
                    content: description,
                  },
                ]}
              />
            </div>
          </div>
        </div>

        {/*
         * ── PDP related-products band (issue #895) ────────────────────────
         *
         * Real site structure below the gallery+panel:
         *   1. 320px franchise band — BLACK bg with blue splash art, LoL logo
         *      IMAGE left-aligned (~40px inset), WHITE "Shop Now" button with
         *      black riotSans 16/600 label ls 0.32px, LEFT-aligned under logo.
         *   2. Related-products carousel on a WHITE page-background section:
         *      305×375 ARTICLE cards, bg surface-alt (#f7f7f7), 1px white border,
         *      name riotSans 16/700 black, price Inter 16, icon-only cart button.
         *      Curated ~12 items (not all 47 products).
         *
         * The 320px franchise band IS the MerchShopCarousel banner (light mode).
         * No MerchCollectionHero wrapping band — the carousel owns the full section.
         */}
        {carouselProducts && carouselProducts.length > 0 && (
          <div
            style={{
              marginTop: 0,
              backgroundColor: "var(--color-merch-bg)",
              width: "100%",
            }}
          >
            {/* Light-surface related carousel — 320px franchise band above 305×375 cards */}
            <MerchShopCarousel
              franchiseName="League of Legends"
              bannerImageUrl={carouselBannerImageUrl ?? ""}
              franchiseLogoUrl={carouselFranchiseLogoUrl}
              products={carouselProducts}
              darkSurface={false}
              onProductClick={(slug) => router.push(`/merch/product/${slug}`)}
              onShopNowClick={() => router.push("/merch/shop-all")}
            />
          </div>
        )}
      </main>

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
          .merch-pdp-grid {
            grid-template-columns: 1fr !important;
          }
          .merch-pdp-breadcrumb {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
          }
          /* Mobile CTA: column stack, full-width buttons, ~24px gap, parent h≈90 */
          .merch-pdp-cta {
            flex-direction: column !important;
            width: 100% !important;
            gap: 12px !important;
          }
          .merch-pdp-cta-atc {
            width: 100% !important;
          }
          .merch-pdp-cta-bin {
            width: 100% !important;
            height: 50px !important;
          }
        }
      `}</style>
    </div>
  );
}
