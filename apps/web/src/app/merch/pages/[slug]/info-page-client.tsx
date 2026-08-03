"use client";

/**
 * InfoPageHeader — thin client wrapper for /merch/pages/[slug].
 * Provides nav routing callbacks via useMerchNav() without making the whole
 * server page a client component.
 */

import { useRouter } from "next/navigation";
import { MerchHeader } from "@low/ui";
import { useMerchNav } from "@/lib/merch-nav";

/** Renders MerchHeader with full nav routing for /merch/pages/[slug]. */
export function InfoPageHeader() {
  const router = useRouter();
  const handleNavSelect = useMerchNav();

  return (
    <MerchHeader
      onCategoryClick={handleNavSelect}
      onSearchClick={() => router.push("/merch/search")}
      onLogoClick={() => router.push("/merch")}
    />
  );
}
