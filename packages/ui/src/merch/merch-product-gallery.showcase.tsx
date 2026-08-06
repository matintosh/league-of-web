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
    "PDP left column: themed hero surface (light texture background layer). League of Legends wordmark top-left at full opacity. Product image container 664×664 at (82,68) desktop. Secondary images in a full-bleed 2-up 640×640 object-fit:cover carousel with ‹ › chevron overlays and LoL wordmark bottom-left, flush under the hero. Mobile: 629px tall hero, image 342×629 at x=24. No navy overlay (faint/absent on real amumu-plush), no grey panel, no watermark opacity, no vertical label, no badge overlay in gallery.",
  variants: [
    {
      name: "Single image — no carousel (hero surface only, token fallbacks)",
      notes:
        "One image: 2-up carousel hidden. Hero surface with LoL wordmark at full opacity. No bgImageUrl → token fallback (--color-merch-surface).",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 828, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductGallery
            images={[IMG_A]}
            alt="Single product image"
            selectedIndex={0}
          />
        </div>
      ),
    },
    {
      name: "5-image gallery — first selected (hero + 2-up detail carousel)",
      notes:
        "selectedIndex=0; 4 secondary images in 2-up 640×640 carousel below the hero. Matches amumu-plush real layout (5 images total). No badge in gallery — badge lives in the purchase panel.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 828, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductGallery
            images={[IMG_A, IMG_B, IMG_C, IMG_D, IMG_E]}
            alt="Amumu Plush"
            selectedIndex={0}
          />
        </div>
      ),
    },
    {
      name: "5-image gallery — second selected (static)",
      notes: "selectedIndex=1 shows second detail image active-outlined in the 2-up carousel.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 828, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductGallery
            images={[IMG_A, IMG_B, IMG_C, IMG_D, IMG_E]}
            alt="MSI 2026 Tee"
            selectedIndex={1}
          />
        </div>
      ),
    },
    {
      name: "6-image gallery — fourth selected (static)",
      notes: "selectedIndex=3 shows fourth carousel tile active-outlined. 5 carousel images; ‹ › chevrons appear when >2 secondaries.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 828, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductGallery
            images={[IMG_A, IMG_B, IMG_C, IMG_D, IMG_E, IMG_F]}
            alt="MSI 2026 Jacket"
            selectedIndex={3}
          />
        </div>
      ),
    },
    {
      name: "2-image gallery — no chevrons (≤2 secondaries: 1 carousel slide, no arrows)",
      notes: "With only 1 secondary image, 2-up carousel shows a single tile with no ‹ › nav.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 828, fontFamily: "system-ui, sans-serif" }}>
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
