"use client";

import { useState } from "react";
import { championSplashUrl } from "@low/fixtures";
import { MerchProductGallery } from "./merch-product-gallery";

const IMAGES = [
  championSplashUrl("Jinx", 0),
  championSplashUrl("Lux", 0),
  championSplashUrl("Vi", 0),
  championSplashUrl("Ahri", 0),
];

/** Interactive demo for the showcase — click thumbnails to swap the main image. */
export function MerchProductGalleryDemo() {
  const [selected, setSelected] = useState(0);
  return (
    <div style={{ maxWidth: 480, fontFamily: "system-ui, sans-serif" }}>
      <MerchProductGallery
        images={IMAGES}
        alt="MSI 2026 Tee — Interactive Demo"
        selectedIndex={selected}
        onSelect={setSelected}
      />
    </div>
  );
}
