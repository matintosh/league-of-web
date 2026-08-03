"use client";

/**
 * MerchHeaderDemo — stateful demo wrappers for the merch header showcase.
 * These are CLIENT components because they hold useState for dismissal /
 * active-category toggling. They are imported by merch-header.showcase.tsx
 * which stays server-safe (no 'use client').
 */

import { useState } from "react";
import { MerchHeader } from "./merch-header";

/** Demo: dismissible announcement marquee. */
export function MerchHeaderWithDismissDemo() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <MerchHeader
      announcement={
        dismissed
          ? undefined
          : "We're upgrading our warehouse! Orders placed between July 3–7 may be delayed. We apologize for the inconvenience."
      }
      onDismissAnnouncement={() => setDismissed(true)}
    />
  );
}

/** Demo: active nav category + cart badge + announcement. */
export function MerchHeaderActiveCategoryDemo() {
  const [active, setActive] = useState("shop-all");

  return (
    <MerchHeader
      activeCategory={active}
      cartCount={3}
      onCategoryClick={setActive}
      announcement="Summer Sale — Up to 50% off select items. Limited time only."
    />
  );
}
