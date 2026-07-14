import type { ShowcaseEntry } from "../showcase";
import {
  YourShopIconCtaDemo,
  YourShopIconLoopDemo,
  YourShopIconStaticDemo,
} from "./your-shop-icon.demo";

export const yourShopIconShowcase: ShowcaseEntry = {
  slug: "your-shop-icon",
  name: "YourShopIcon",
  area: "store",
  description:
    "Top-nav Your Shop entry-point icon with the real-client attention CTA (issue #317). " +
    "A static gold Hextech shop glyph always renders; when CTA videos are supplied, an " +
    "intro burst plays once, then an ambient loop idles to draw the eye, and a click burst " +
    "fires on activation. Navigation never waits on the video (fire-and-proceed); the video " +
    "layer is pointer-events-none and hidden under reduced motion, leaving the static glyph.",
  variants: [
    {
      name: "Full CTA — intro → loop + click burst",
      notes:
        "All three videos supplied: the intro reveal plays once on mount, then the ambient loop idles. Click the icon — the activation counter increments immediately and the white click burst plays as an accent.",
      render: () => <YourShopIconCtaDemo />,
    },
    {
      name: "Loop only — ambient attention loop",
      notes:
        "Only the loop + click clips supplied — no one-shot intro, so it idles straight into the attention loop and still fires the click accent.",
      render: () => <YourShopIconLoopDemo />,
    },
    {
      name: "Static only — no videos (reduced-motion fallback)",
      notes:
        "No videoSources: the static gold Hextech shop glyph renders alone. This is the exact look under prefers-reduced-motion: reduce or when a clip fails to load.",
      render: () => <YourShopIconStaticDemo />,
    },
  ],
};
