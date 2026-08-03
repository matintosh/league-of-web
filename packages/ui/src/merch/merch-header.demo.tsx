"use client";

/**
 * MerchHeaderDemo — stateful demo wrappers for the merch header showcase.
 * These are CLIENT components because they hold useState for dismissal /
 * active-category toggling / dropdown open state. They are imported by
 * merch-header.showcase.tsx which stays server-safe (no 'use client').
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

/**
 * Demo: functional dropdown menus.
 * Click Categories▾ or Featured▾ to open the real dropdown; click an item
 * to capture its slug. Esc and outside-click close the menu.
 */
export function MerchHeaderDropdownDemo() {
  const [lastSlug, setLastSlug] = useState<string | null>(null);

  return (
    <div>
      <MerchHeader
        activeCategory={lastSlug ?? undefined}
        cartCount={0}
        onCategoryClick={setLastSlug}
      />
      {lastSlug && (
        <p
          style={{
            marginTop: 12,
            fontSize: 13,
            color: "var(--color-merch-muted)",
            padding: "0 24px",
          }}
        >
          Last nav slug selected:{" "}
          <strong style={{ color: "var(--color-merch-ink)" }}>{lastSlug}</strong>
        </p>
      )}
    </div>
  );
}
