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
    "PDP left column: main image (1:1 square, object-fit contain — product art floats on the surface) + thumbnail strip (72×72, 8px gap). Active thumb: 2px ink border. Inactive: 1px border. Strip hidden for single image. Controlled via selectedIndex + onSelect. Measured from merch.riotgames.com PDPs.",
  variants: [
    {
      name: "4-image gallery — first selected (static)",
      notes:
        "selectedIndex=0; thumbnail strip visible with 4 thumbs. No interactivity in server-safe mode — use the demo for clicks.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 480, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductGallery
            images={[IMG_A, IMG_B, IMG_C, IMG_D]}
            alt="MSI 2026 Tee"
            selectedIndex={0}
          />
        </div>
      ),
    },
    {
      name: "4-image gallery — second thumbnail selected (static)",
      notes: "selectedIndex=1 to show active border on second thumb.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 480, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductGallery
            images={[IMG_A, IMG_B, IMG_C, IMG_D]}
            alt="MSI 2026 Tee"
            selectedIndex={1}
          />
        </div>
      ),
    },
    {
      name: "Single image — no strip",
      notes: "images.length === 1 so thumbnail strip is hidden.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 480, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductGallery
            images={[IMG_A]}
            alt="Single product image"
            selectedIndex={0}
          />
        </div>
      ),
    },
    {
      name: "6-image gallery — fourth selected (static)",
      notes: "selectedIndex=3 shows fourth thumb active-bordered.",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 480, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductGallery
            images={[IMG_A, IMG_B, IMG_C, IMG_D, IMG_E, IMG_F]}
            alt="MSI 2026 Jacket"
            selectedIndex={3}
          />
        </div>
      ),
    },
    {
      name: "4:5 portrait override",
      notes: "aspectRatio='4 / 5' override (1:1 square is now the default, matching the real PDP).",
      backgrounds: ["light"],
      render: () => (
        <div style={{ maxWidth: 480, fontFamily: "system-ui, sans-serif" }}>
          <MerchProductGallery
            images={[IMG_B, IMG_C, IMG_D]}
            alt="Collector's Print"
            aspectRatio="4 / 5"
            selectedIndex={0}
          />
        </div>
      ),
    },
  ],
};
