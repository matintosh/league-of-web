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
    "PDP left column: two-layer themed hero surface (light texture + dark navy diagonal band, both desktop and mobile). League of Legends wordmark top-left at full opacity. Product image container 664×664 at (82,68) desktop. Full-bleed 100vw secondary carousel: 2-up 640×640 object-fit:cover slides with ‹ › chevron overlays, themed slide surface (same light+navy layers), LoL wordmark bottom-left, flush under the hero. Mobile: 573px tall hero, image 342×573 at x=24, carousel collapses to container width (no overflow at 390).",
  variants: [
    {
      name: "Single image — no carousel (hero surface only, token fallbacks)",
      notes:
        "One image: 2-up carousel hidden. Hero surface shows light bg + navy diagonal band fallback tokens. No bgImageUrl/fgImageUrl → --color-merch-surface + --color-merch-pdp-hero-navy.",
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
      name: "5-image gallery — first selected (hero + full-bleed 640px detail carousel)",
      notes:
        "selectedIndex=0; 4 secondary images in full-bleed 2-up 640×640 carousel below the hero. Slide surface extends the themed bg (light + navy band). Matches amumu-plush real layout.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 828, fontFamily: "system-ui, sans-serif", overflow: "hidden" }}>
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
        <div style={{ maxWidth: 828, fontFamily: "system-ui, sans-serif", overflow: "hidden" }}>
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
      notes:
        "selectedIndex=3 shows fourth carousel tile active-outlined. 5 carousel images; ‹ › chevrons appear when >2 secondaries.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 828, fontFamily: "system-ui, sans-serif", overflow: "hidden" }}>
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
      notes: "With only 1 secondary image, 2-up carousel shows a single 640px slide, no ‹ › nav.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 828, fontFamily: "system-ui, sans-serif", overflow: "hidden" }}>
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
