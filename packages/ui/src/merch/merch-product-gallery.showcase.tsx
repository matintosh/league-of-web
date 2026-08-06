import { championSplashUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { MerchProductGallery } from "./merch-product-gallery";

const IMG_A = championSplashUrl("Jinx", 0);
const IMG_B = championSplashUrl("Lux", 0);
const IMG_C = championSplashUrl("Vi", 0);
const IMG_D = championSplashUrl("Ahri", 0);
const IMG_E = championSplashUrl("Ashe", 0);
const IMG_F = championSplashUrl("Ezreal", 0);

export const merchProductGalleryShowcase: ShowcaseEntry = {
  slug: "merch-product-gallery",
  name: "Merch Product Gallery",
  area: "merch",
  description:
    "PDP left column: grey 664×664 surface panel (--color-merch-surface-alt, 24px padding) + LoL wordmark watermark + optional badge overlay (top-right) + vertical franchise label (left edge). Main image 1:1 square inside the panel. Secondary images in a horizontal carousel with › arrow. Mobile: portrait hero (342×629 ~1:1.84), 351px square thumbnail strip. Matches merch.riotgames.com PDP gallery (verified 2026-08).",
  variants: [
    {
      name: "Single image — no carousel (grey surface + watermark)",
      notes:
        "One image: thumbnail carousel hidden. Grey surface panel with LoL watermark visible. No badge overlay.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 680, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductGallery
            images={[IMG_A]}
            alt="Single product image"
            selectedIndex={0}
          />
        </div>
      ),
    },
    {
      name: "4-image gallery — first selected + New badge overlay",
      notes:
        "selectedIndex=0; 3 secondary images in horizontal carousel. Green 'New' badge overlaid top-right. LoL watermark top-left.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 680, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductGallery
            images={[IMG_A, IMG_B, IMG_C, IMG_D]}
            alt="Amumu Plush"
            selectedIndex={0}
            badgeLabel="New"
          />
        </div>
      ),
    },
    {
      name: "4-image gallery — second selected (static)",
      notes: "selectedIndex=1 to show active border on second carousel tile.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 680, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductGallery
            images={[IMG_A, IMG_B, IMG_C, IMG_D]}
            alt="MSI 2026 Tee"
            selectedIndex={1}
          />
        </div>
      ),
    },
    {
      name: "6-image gallery — fourth selected (static)",
      notes: "selectedIndex=3 shows fourth carousel tile active-bordered.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 680, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductGallery
            images={[IMG_A, IMG_B, IMG_C, IMG_D, IMG_E, IMG_F]}
            alt="MSI 2026 Jacket"
            selectedIndex={3}
          />
        </div>
      ),
    },
    {
      name: "No carousel arrows — 2 images (no arrow when ≤2 images)",
      notes: "Arrow › only renders when images.length > 2. With 2 images the carousel scrolls but no arrow.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 680, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductGallery
            images={[IMG_C, IMG_D]}
            alt="Collector's Print"
            selectedIndex={0}
          />
        </div>
      ),
    },
  ],
};
