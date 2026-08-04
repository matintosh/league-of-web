"use client";

/**
 * Interactive demos for MerchBreadcrumbBar showcase.
 * Stateful client components — imported only from the showcase file.
 */

import { MerchBreadcrumbBar } from "./merch-breadcrumb-bar";

/** Demo: Shop All with count and REFINE (interactive hover state). */
export function MerchBreadcrumbBarWithRefineDemo() {
  return (
    <div style={{ width: "100%", backgroundColor: "var(--color-merch-bg)" }}>
      <MerchBreadcrumbBar
        crumbs={[
          { label: "Home", onClick: () => undefined },
          { label: "Shop All" },
        ]}
        count={42}
        onRefineClick={() => undefined}
      />
    </div>
  );
}

/** Demo: Collection page breadcrumb with count and REFINE. */
export function MerchBreadcrumbBarCollectionDemo() {
  return (
    <div style={{ width: "100%", backgroundColor: "var(--color-merch-bg)" }}>
      <MerchBreadcrumbBar
        crumbs={[
          { label: "Home", onClick: () => undefined },
          { label: "Apparel" },
        ]}
        count={28}
        onRefineClick={() => undefined}
      />
    </div>
  );
}
