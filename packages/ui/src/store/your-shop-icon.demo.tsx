"use client";

import { useState } from "react";
import { yourShopIconVideoUrl } from "@low/fixtures";
import { YourShopIcon } from "./your-shop-icon";

// Real-client CTA video URLs, resolved from @low/fixtures (pages/showcase supply
// URLs; the component never fetches or builds them).
const VIDEO_SOURCES = {
  ctaIntro: yourShopIconVideoUrl("call-to-action-intro"),
  ctaLoop: yourShopIconVideoUrl("call-to-action-loop"),
  click: yourShopIconVideoUrl("click"),
};

// ---------------------------------------------------------------------------
// Full CTA — intro → loop attention videos + click burst
// ---------------------------------------------------------------------------

export function YourShopIconCtaDemo() {
  const [count, setCount] = useState(0);

  return (
    <div
      className="flex items-center gap-6 p-6"
      style={{ backgroundColor: "var(--color-hextech-black)" }}
    >
      <YourShopIcon
        videoSources={VIDEO_SOURCES}
        onActivate={() => setCount((c) => c + 1)}
      />
      <p className="font-body text-sm text-grey-1">
        Activations: <span className="text-gold-2">{count}</span> — the count
        increments immediately on click (navigation never waits on the video);
        the click burst plays afterwards as an accent.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loop only — the ambient attention loop without the one-shot intro
// ---------------------------------------------------------------------------

export function YourShopIconLoopDemo() {
  return (
    <div
      className="flex items-center gap-6 p-6"
      style={{ backgroundColor: "var(--color-hextech-black)" }}
    >
      <YourShopIcon
        videoSources={{ ctaLoop: VIDEO_SOURCES.ctaLoop, click: VIDEO_SOURCES.click }}
        onActivate={() => {}}
      />
      <p className="font-body text-sm text-grey-1">
        Only the ambient loop is supplied — it idles immediately (no intro burst)
        and still fires the click accent on activation.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Static only — no videos (also the reduced-motion / broken-clip fallback)
// ---------------------------------------------------------------------------

export function YourShopIconStaticDemo() {
  return (
    <div
      className="flex items-center gap-6 p-6"
      style={{ backgroundColor: "var(--color-hextech-black)" }}
    >
      <YourShopIcon onActivate={() => {}} />
      <p className="font-body text-sm text-grey-1">
        No <code>videoSources</code> — the static gold Hextech shop glyph renders
        on its own. This is exactly what shows under{" "}
        <code>prefers-reduced-motion: reduce</code> or when a clip fails to load.
      </p>
    </div>
  );
}
