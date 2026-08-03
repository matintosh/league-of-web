"use client";

/**
 * CollectionIndexClient — thin client wrapper for the collection index page.
 * Exists solely to provide nav routing callbacks via useMerchNav()
 * without converting the whole page to a client component.
 */

import { useRouter } from "next/navigation";
import { MerchHeader } from "@low/ui";
import { useMerchNav } from "@/lib/merch-nav";

/** Renders MerchHeader with full nav routing for /merch/collection. */
export function CollectionIndexHeader() {
  const router = useRouter();
  const handleNavSelect = useMerchNav();

  return (
    <MerchHeader
      activeCategory="categories"
      onCategoryClick={handleNavSelect}
      onSearchClick={() => router.push("/merch/search")}
      onLogoClick={() => router.push("/merch")}
    />
  );
}
