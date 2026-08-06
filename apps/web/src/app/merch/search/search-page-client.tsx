"use client";

/**
 * SearchPageClient — shell for /merch/search.
 *
 * The real merch.riotgames.com/en-us/search is a PERMANENT hero-only
 * placeholder. Every URL — no query, ?q=jinx, any query — renders the
 * identical "NO SEARCH TERM PROVIDED" hero. There is no working results
 * view on the real site.
 *
 * This client component simply renders the hero at all times, matching
 * that behaviour exactly. The query, filtering, and results UI that existed
 * here before were our own addition, not present on the real site.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMerchNav } from "@/lib/merch-nav";
import {
  MerchHeader,
  MerchSearchHero,
  MerchFooter,
  MerchCartDrawer,
} from "@low/ui";
import type { MerchCartItem } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SearchPageClientProps {
  /** No props required — page always shows the hero. Kept for API stability. */
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/** /merch/search interactive page shell — always renders the search hero. */
export function SearchPageClient(_props: SearchPageClientProps) {
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
        activeCategory="search"
        cartCount={cartItems.length}
        onCartClick={() => setCartOpen(true)}
        onSearchClick={() => {
          /* Already on the search page */
        }}
        onCategoryClick={handleNavSelect}
        onLogoClick={() => router.push("/merch")}
      />

      <main className="flex-1">
        {/*
         * Permanent hero — always shown regardless of ?q=.
         * Matches the real merch.riotgames.com/en-us/search which never
         * renders a results view.
         *
         * Art URLs: served directly from merch.riotgames.com/assets/ (stable,
         * hotlinkable — confirmed 200 via Playwright, 2026-08).
         *   arcade_riven_ahri.svg — full-bleed cover, intrinsically faint/grayscale
         *   pattern-404.svg       — contain, top-right
         *   ziggs.png             — 320×288 at left=704px top=208px (band-relative)
         */}
        <MerchSearchHero
          arcadeSrc="https://merch.riotgames.com/assets/arcade_riven_ahri.svg"
          patternSrc="https://merch.riotgames.com/assets/pattern-404.svg"
          ziggsSrc="https://merch.riotgames.com/assets/ziggs.png"
          onSearchClick={() => {
            /* Real site CTA does nothing functional — kept as no-op prop. */
          }}
        />
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
