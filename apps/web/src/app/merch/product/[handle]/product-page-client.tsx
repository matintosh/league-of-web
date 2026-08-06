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
 *   Order: breadcrumb (absolute overlay) → gallery image → mobile header row → price/CTA.
 *   Gallery image renders FIRST on mobile (image-first order).
 *   Compact title + [LoL logo][heart][share][badge] row is BELOW the gallery.
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
  MerchCollectionHero,
  MerchShopCarousel,
  MerchSizeGuideModal,
  LolWordmark,
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
            <div style={{ marginTop: 32 }}>
              {/*
               * Description: static always-open section (no chevron, no toggle, no borders).
               * Real PDP: heading "Description" visible, body always shown, padding 0 0 32px.
               * Uses variant="static" (issue #858 — was collapsed accordion, now static).
               */}
              <MerchProductInfoTabs
                variant="static"
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
         * ── Mobile-only compact header row ────────────────────────────────
         * Sits BELOW the gallery on 390px viewports (image-first order).
         * Real site measurement:
         *   breadcrumb (y=138) → hero image 342×629 at x=24 → this row → price/CTA
         *   LEFT: title on its own line (16px/600)
         *   Then a row: LoL lockup flush-left + heart/share/badge right
         * Hidden on desktop (>768px) — the full panel handles it there.
         */}
        <div
          className="merch-pdp-mobile-header"
          style={{
            display: "none",
            flexDirection: "column",
            padding: "12px 16px 0",
            gap: 8,
          }}
        >
          {/* Title — full-width own line */}
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "var(--color-merch-ink-dark)",
              display: "block",
            }}
          >
            {title}
          </span>

          {/* Row: LoL lockup flush-left + heart/share/badge right */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {/* LoL logo — flush left */}
            <span
              aria-label="League of Legends"
              style={{
                color: "var(--color-merch-ink-dark)",
                flex: "1 1 auto",
                display: "flex",
                alignItems: "center",
              }}
            >
              <LolWordmark />
            </span>

            {/* Heart icon — borderless, pure black */}
            <button
              type="button"
              aria-label="Add to wishlist"
              onClick={() => {}}
              style={{
                width: 40,
                height: 40,
                border: "none",
                background: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-merch-ink-dark)",
                flexShrink: 0,
                padding: 0,
              }}
            >
              {/* Heart SVG — outline */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>

            {/* Share icon — borderless, export box-with-up-arrow */}
            <button
              type="button"
              aria-label="Share product"
              onClick={() => {}}
              style={{
                width: 40,
                height: 40,
                border: "none",
                background: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-merch-ink-dark)",
                flexShrink: 0,
                padding: 0,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="8 17 3 17 3 21 21 21 21 17 16 17" />
                <line x1="12" y1="3" x2="12" y2="15" />
                <polyline points="8 7 12 3 16 7" />
              </svg>
            </button>

            {/* Badge chip — first badge only in mobile header */}
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
        </div>

        {/*
         * ── Collection SHOP NOW band ───────────────────────────────────────
         * Real site: 1280×320 band between the product section and related carousel.
         * Uses MerchCollectionHero as the band component.
         * heading is decorative (h2) — the PDP panel above owns the h1.
         * CTA: gold SHOP NOW button (--color-merch-gold), measured from live site.
         */}
        <div style={{ marginTop: 16 }}>
          <MerchCollectionHero
            heading="League of Legends"
            description="Explore the full collection of officially licensed League of Legends merchandise."
            backgroundImageUrl={collectionBannerImageUrl ?? carouselBannerImageUrl}
            theme="dark"
            ctaLabel="SHOP NOW"
            onCtaClick={() => router.push("/merch/shop-all")}
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
          .merch-pdp-breadcrumb {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
