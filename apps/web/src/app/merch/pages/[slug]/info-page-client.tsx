"use client";

/**
 * Client components for /merch/pages/[slug].
 * Thin wrappers that provide routing callbacks without making the server page
 * a client component.
 */

import { useRouter } from "next/navigation";
import { MerchHeader, MerchSupportTabStrip } from "@low/ui";
import type { MerchSupportTab } from "@low/fixtures";
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

interface InfoPageTabStripProps {
  /** All 9 support section tabs (from MERCH_SUPPORT_TABS fixture). */
  sections: MerchSupportTab[];
  /** Slug of the currently active page. */
  activeSlug: string;
}

/**
 * Renders MerchSupportTabStrip with router-driven tab selection.
 * Clicking a tab navigates to /merch/pages/{slug}.
 */
export function InfoPageTabStrip({ sections, activeSlug }: InfoPageTabStripProps) {
  const router = useRouter();

  return (
    <MerchSupportTabStrip
      sections={sections}
      activeSlug={activeSlug}
      onSelect={(slug) => router.push(`/merch/pages/${slug}`)}
    />
  );
}
