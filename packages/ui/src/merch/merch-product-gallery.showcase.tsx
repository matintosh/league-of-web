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
    "PDP left column: themed diagonal hero surface (upper light texture layer + lower dark navy band clipped by diagonal polygon). League of Legends wordmark top-left at full opacity. Secondary images in a horizontal carousel below. Mobile: shorter hero (390×674) with scaled diagonal. Matches merch.riotgames.com PDP gallery (verified 2026-08 via Playwright). No grey panel, no watermark opacity, no vertical label, no badge overlay in gallery.",
  variants: [
    {
      name: "Single image — no carousel (diagonal hero surface, token fallbacks)",
      notes:
        "One image: thumbnail carousel hidden. Diagonal hero surface with LoL wordmark at full opacity. No bgImageUrl/fgImageUrl → token fallbacks render (--color-merch-surface + --color-merch-pdp-hero-navy).",
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
      name: "5-image gallery — first selected (hero + 4 secondary tiles)",
      notes:
        "selectedIndex=0; 4 secondary images in horizontal carousel below the hero. Matches amumu-plush real layout (5 images total). No badge in gallery — badge lives in the purchase panel.",
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
      notes: "selectedIndex=1 to show active border on second carousel tile.",
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
      notes: "selectedIndex=3 shows fourth carousel tile active-bordered.",
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
      name: "No carousel arrows — 2 images (no arrow when ≤2 images)",
      notes: "Arrow › only renders when images.length > 2. With 2 images the carousel scrolls but no arrow.",
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
