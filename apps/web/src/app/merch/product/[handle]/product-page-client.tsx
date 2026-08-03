"use client";

/**
 * ProductPageClient — client shell for /merch/product/[handle].
 * Wraps the gallery + purchase panel in MerchHeader + MerchFooter,
 * matching the shell pattern used by all other merch pages.
 * Holds cartOpen state and renders MerchCartDrawer.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMerchNav } from "@/lib/merch-nav";
import {
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
  /** Full-text product description. */
  description: string;
  /** Breadcrumb trail for MerchPurchasePanel. */
  breadcrumb: string[];
  /** Size/variant options with availability flags. */
  variants: { label: string; available: boolean }[];
  /** Ordered list of gallery image URLs. */
  images: string[];
  /** Products for the "Shop More" franchise carousel below the product section. */
  carouselProducts?: MerchProduct[];
  /** Banner image URL for the franchise carousel (e.g. a wide splash from Data Dragon). */
  carouselBannerImageUrl?: string;
}

/** /merch/product/[handle] interactive page shell. */
export function ProductPageClient({
  title,
  price,
  originalPrice,
  badges,
  description,
  breadcrumb,
  variants,
  images,
  carouselProducts,
  carouselBannerImageUrl,
}: ProductPageClientProps) {
  const router = useRouter();
  const handleNavSelect = useMerchNav();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems] = useState<MerchCartItem[]>([]);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sizeGuideUnit, setSizeGuideUnit] = useState<"in" | "cm">("in");

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
         * White bg, 14px muted text, ~60px line-height to match real.
         */}
        {breadcrumb && breadcrumb.length > 0 && (
          <div
            style={{
              width: "100%",
              backgroundColor: "var(--color-merch-bg)",
              borderBottom: "1px solid var(--color-merch-border)",
            }}
          >
            <nav
              aria-label="Breadcrumb"
              style={{
                maxWidth: "80rem",
                margin: "0 auto",
                padding: "0 1.5rem",
                height: 60,
                display: "flex",
                alignItems: "center",
              }}
            >
              <ol
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px",
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: 14,
                  color: "var(--color-merch-muted)",
                }}
              >
                {breadcrumb.map((seg, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {idx > 0 && <span aria-hidden="true">›</span>}
                    <span>{seg}</span>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        )}

        {/* 2-col gallery + purchase panel */}
        <div
          className="px-4 py-8 md:px-6 md:py-10"
          style={{ maxWidth: "80rem", margin: "0 auto", width: "100%" }}
        >
        {/*
         * Desktop: grid with gallery ~62% / panel ~38% — gallery is the dominant column.
         * Mobile: single column stack (flex-col), gallery full-width, no overflow.
         * Measured real site at 1280px: gallery 688–828px, panel ~452px (grid, no gap).
         */}
        <div className="flex flex-col gap-6 md:grid md:gap-0 md:items-start" style={{ gridTemplateColumns: "62% 38%" }}>
          {/* Left: gallery — full-width on mobile, ~62% on desktop */}
          <div className="w-full">
            <MerchProductGallery
              images={images}
              alt={title}
              selectedIndex={0}
            />
          </div>

          {/* Right: purchase panel — full-width on mobile, ~38% on desktop with left padding */}
          <div className="min-w-0" style={{ paddingLeft: "clamp(0px, 2.5vw, 40px)" }}>
            <MerchPurchasePanel
              title={title}
              price={price}
              originalPrice={originalPrice}
              badges={badges}
              description={description}
              breadcrumb={breadcrumb}
              variants={variants}
              variantLabel="Size"
              selectedVariant="M"
              quantity={1}
              showSizeGuideLink
              onSizeGuideClick={() => setSizeGuideOpen(true)}
            />
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

        <p
          style={{
            marginTop: 32,
            fontSize: 12,
            color: "var(--color-merch-muted)",
          }}
        >
          Demo route — static props. For interactive variant/qty/cart demo see{" "}
          <a
            href="/showcase/merch-purchase-panel"
            style={{ color: "var(--color-merch-red)" }}
          >
            /showcase/merch-purchase-panel
          </a>
          .
        </p>
        </div>
      </main>

      {/* Franchise carousel — rendered below the product section when products are supplied */}
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
    </div>
  );
}
