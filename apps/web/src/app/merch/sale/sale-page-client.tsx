"use client";

/**
 * SalePageClient — client shell for /merch/sale.
 * Filters MERCH_PRODUCTS to sale items (badge === "Sale" or originalPrice present)
 * and renders a listing matching the real /category/sales/ page:
 *   breadcrumb "Home / Sales (N)" + Refine button → product grid on white.
 * No dark hero band — the real sale page has none.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MerchHeader,
  MerchProductGrid,
  MerchProductCard,
  MerchFooter,
  MerchCartDrawer,
} from "@low/ui";
import type { MerchProduct, MerchCartItem } from "@low/fixtures";
import { useMerchNav } from "@/lib/merch-nav";

export interface SalePageClientProps {
  /** Products that have a Sale badge or originalPrice — provided by the server page. */
  products: MerchProduct[];
}

/** /merch/sale interactive page shell. */
export function SalePageClient({ products }: SalePageClientProps) {
  const router = useRouter();
  const handleNavSelect = useMerchNav();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems] = useState<MerchCartItem[]>([]);

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundColor: "var(--color-merch-bg)",
        fontFamily: "var(--font-merch)",
      }}
    >
      <MerchHeader
        activeCategory="sale"
        cartCount={cartItems.length}
        onCartClick={() => setCartOpen(true)}
        onSearchClick={() => router.push("/merch/search")}
        onCategoryClick={handleNavSelect}
        onLogoClick={() => router.push("/merch")}
      />

      <main className="flex-1">
        {/* Breadcrumb + Refine row — matches real /category/sales/ header.
            No dark hero band; grid opens directly on white page background. */}
        <div
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3"
          style={{ borderBottom: "1px solid var(--color-merch-border)" }}
        >
          {/* Breadcrumb: Home / Sales (N) ~14px */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-[14px]"
            style={{ color: "var(--color-merch-muted)" }}
          >
            <button
              type="button"
              className="transition-colors duration-150 hover:underline"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                color: "var(--color-merch-muted)",
                fontSize: "inherit",
              }}
              onClick={() => router.push("/merch")}
            >
              Home
            </button>
            <span aria-hidden>/</span>
            <span style={{ color: "var(--color-merch-ink)" }}>
              Sales ({products.length})
            </span>
          </nav>

          {/* Refine button — red bg, white text, sliders icon */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 text-[11px] font-bold uppercase tracking-[0.08em] transition-colors duration-150"
            style={{
              height: 36,
              backgroundColor: "var(--color-merch-red)",
              color: "var(--color-merch-on-dark)",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--color-merch-red-dark)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--color-merch-red)";
            }}
          >
            {/* Sliders icon (same as MerchProductGrid's RefineIcon) */}
            <svg
              aria-hidden
              focusable="false"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              style={{ width: 14, height: 14, display: "block" }}
            >
              <line x1="2" y1="4" x2="14" y2="4" />
              <line x1="2" y1="8" x2="14" y2="8" />
              <line x1="2" y1="12" x2="14" y2="12" />
              <circle cx="5" cy="4" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="10" cy="8" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            Refine
          </button>
        </div>

        {products.length > 0 ? (
          <MerchProductGrid
            columns={2}
          >
            {products.map((product) => (
              <MerchProductCard
                key={product.slug}
                slug={product.slug}
                title={product.title}
                imageUrl={product.imageUrl}
                price={product.price}
                originalPrice={product.originalPrice}
                badge={product.badge}
                badges={product.badges}
                franchiseLabel={product.franchiseLabel}
                onClick={() => router.push(`/merch/product/${product.slug}`)}
              />
            ))}
          </MerchProductGrid>
        ) : (
          /* Faithful empty state — real merch.riotgames.com/sale shows a
             simple centered message when no sale items are available. */
          <div
            style={{
              maxWidth: "80rem",
              margin: "0 auto",
              padding: "80px 24px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "18px",
                color: "var(--color-merch-muted)",
                margin: 0,
              }}
            >
              No sale items are available right now. Check back soon!
            </p>
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
    </div>
  );
}
