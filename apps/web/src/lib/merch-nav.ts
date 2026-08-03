/**
 * useMerchNav — central nav routing helper for the /merch section.
 *
 * Maps a MerchHeader nav slug → the correct Next.js route so pages don't
 * duplicate this logic. Slug conventions:
 *
 *   "shop-all"         → /merch/shop-all
 *   "sale"             → /merch/sale
 *   "my-shop"          → /merch/account
 *   "categories"       → /merch/collection  (the collection index)
 *   "featured"         → /merch/shop-all    (no dedicated featured index yet)
 *   anything else      → /merch/collection/<slug>   (collection handle)
 *
 * Usage (in a client page shell):
 *
 *   import { merchNavHref } from "@/lib/merch-nav";
 *   // or
 *   import { useMerchNav } from "@/lib/merch-nav";
 *
 *   // imperative:
 *   router.push(merchNavHref(slug));
 *
 *   // callback:
 *   const handleNavSelect = useMerchNav();
 *   <MerchHeader onCategoryClick={handleNavSelect} />
 */

"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

// ---------------------------------------------------------------------------
// Slug → route map
// ---------------------------------------------------------------------------

/**
 * Resolves a MerchHeader nav slug to a Next.js route string.
 *
 * @param slug - Nav slug (top-level or dropdown menu item slug).
 * @returns Absolute Next.js route, e.g. "/merch/shop-all".
 */
export function merchNavHref(slug: string): string {
  switch (slug) {
    case "shop-all":
      return "/merch/shop-all";
    case "sale":
      return "/merch/sale";
    case "my-shop":
      return "/merch/account";
    case "categories":
      return "/merch/collection";
    case "featured":
      return "/merch/shop-all";
    default:
      // Dropdown menu item slugs (apparel, arcane, league-of-legends, etc.)
      // → collection handle pages.
      return `/merch/collection/${slug}`;
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Returns a stable `onCategoryClick` callback that navigates to the correct
 * route for any MerchHeader nav slug (top-level or dropdown item).
 *
 * Memoised with `useCallback` so it is safe to pass as a prop without
 * causing extra renders on each parent render cycle.
 */
export function useMerchNav(): (slug: string) => void {
  const router = useRouter();

  return useCallback(
    (slug: string) => {
      router.push(merchNavHref(slug));
    },
    [router],
  );
}
