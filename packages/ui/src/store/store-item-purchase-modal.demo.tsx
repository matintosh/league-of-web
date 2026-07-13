"use client";

import { useState } from "react";
import { StoreItemPurchaseModal } from "./store-item-purchase-modal";
import { championSplashUrl, rpIconUrl } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Static showcase wrappers
// Wrap in a transform container to contain fixed-position overlay within the
// showcase card (the [transform:translateZ(0)] creates a new stacking context
// that clips the fixed modal backdrop to the wrapper bounds).
// ---------------------------------------------------------------------------

const CAITLYN_BUNDLE = {
  setName: "Arcade Caitlyn Border Set",
  setArtUrl: championSplashUrl("Caitlyn", 6),
  breakdown: ["1 Champion", "1 Skin", "1 Ward Skin", "1 Icon"],
  originalPrice: 3420 as number | null,
  discountPct: 22 as number | null,
  finalPrice: 2660,
  items: [
    { id: "caitlyn-champ", name: "Caitlyn", category: "Champion" as const, artUrl: championSplashUrl("Caitlyn", 0) },
    { id: "arcade-caitlyn-skin", name: "Arcade Caitlyn", category: "Skin" as const, artUrl: championSplashUrl("Caitlyn", 6) },
    { id: "arcade-2019-ward", name: "Arcade 2019 Ward Skin", category: "Ward Skin" as const, artUrl: championSplashUrl("Lulu", 3) },
    { id: "arcade-caitlyn-icon", name: "Arcade Caitlyn Icon", category: "Icon" as const, artUrl: championSplashUrl("Caitlyn", 5) },
  ],
};

const RP_ICON = rpIconUrl();

/** Static: can-afford state (purchase button active). */
export function StoreItemPurchaseModalCanAffordDemo() {
  return (
    <div
      className="relative overflow-hidden [transform:translateZ(0)]"
      style={{ width: 980, height: 480 }}
    >
      <StoreItemPurchaseModal
        open={true}
        {...CAITLYN_BUNDLE}
        canAfford={true}
        rpIconSrc={RP_ICON}
        onPurchase={() => {}}
        onWishlist={() => {}}
        onClose={() => {}}
      />
    </div>
  );
}

/** Static: cannot-afford state (greyed button, red error labels). */
export function StoreItemPurchaseModalCannotAffordDemo() {
  return (
    <div
      className="relative overflow-hidden [transform:translateZ(0)]"
      style={{ width: 980, height: 480 }}
    >
      <StoreItemPurchaseModal
        open={true}
        {...CAITLYN_BUNDLE}
        canAfford={false}
        rpIconSrc={RP_ICON}
        onPurchase={() => {}}
        onWishlist={() => {}}
        onClose={() => {}}
      />
    </div>
  );
}

/** Static: single-item (non-bundle) — 1 large preview tile instead of 2×2. */
export function StoreItemPurchaseModalSingleItemDemo() {
  return (
    <div
      className="relative overflow-hidden [transform:translateZ(0)]"
      style={{ width: 980, height: 480 }}
    >
      <StoreItemPurchaseModal
        open={true}
        setName="Demacia Vice Garen"
        setArtUrl={championSplashUrl("Garen", 6)}
        breakdown={["1 Skin"]}
        originalPrice={null}
        discountPct={null}
        finalPrice={1350}
        canAfford={true}
        items={[
          {
            id: "demacia-vice-garen",
            name: "Demacia Vice Garen",
            category: "Skin",
            artUrl: championSplashUrl("Garen", 6),
          },
        ]}
        rpIconSrc={RP_ICON}
        onPurchase={() => {}}
        onWishlist={() => {}}
        onClose={() => {}}
      />
    </div>
  );
}

/** Interactive: trigger button opens/closes the modal. */
export function StoreItemPurchaseModalInteractiveDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative [transform:translateZ(0)]"
      style={{ width: 980, height: 480 }}
    >
      {!open && (
        <div className="flex items-center justify-center h-full">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="px-5 py-2.5 border border-gold-5 bg-gold-5/20 font-display text-sm uppercase tracking-widest text-gold-1 hover:bg-gold-4/30 transition-colors cursor-pointer"
          >
            Open Purchase Modal
          </button>
        </div>
      )}
      <StoreItemPurchaseModal
        open={open}
        {...CAITLYN_BUNDLE}
        canAfford={true}
        rpIconSrc={RP_ICON}
        onPurchase={() => setOpen(false)}
        onWishlist={() => {}}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
