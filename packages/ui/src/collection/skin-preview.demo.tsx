'use client';

import { useState } from "react";
import { SkinPreview } from "./skin-preview";
import { championSplashUrl, loadingArtUrl } from "@low/fixtures";

// Kayle skins for the demo — chromaCount mirrors the client ref ("0" badge visible on each thumb)
const KAYLE_SKINS = [
  { name: "Kayle", skinIndex: 0, owned: true, chromaCount: 0 },
  { name: "Judgment Kayle", skinIndex: 1, owned: true, chromaCount: 3 },
  { name: "Viridian Kayle", skinIndex: 2, owned: false, chromaCount: 0 },
  { name: "Transcended Kayle", skinIndex: 3, owned: false, chromaCount: 0 },
  { name: "Silver Kayle", skinIndex: 8, owned: false, chromaCount: 2 },
];

const thumbnails = KAYLE_SKINS.map((s) => ({
  name: s.name,
  imageSrc: loadingArtUrl("Kayle", s.skinIndex),
  owned: s.owned,
  chromaCount: s.chromaCount,
}));

/** Stateful demo — navigable skin preview, owned Silver Kayle state */
export function SkinPreviewOwnedDemo() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const skin = KAYLE_SKINS[selectedIndex];

  return (
    <div className="relative w-full" style={{ height: 420 }}>
      <SkinPreview
        skinName={skin?.name ?? ""}
        description="Given to players who purchased the Retail Collector's Edition of League of Legends."
        acquiredDate="25/11/2010"
        owned={skin?.owned ?? false}
        splashSrc={championSplashUrl("Kayle", skin?.skinIndex ?? 0)}
        thumbnails={thumbnails}
        selectedIndex={selectedIndex}
        onPrev={() => setSelectedIndex((i) => (i - 1 + KAYLE_SKINS.length) % KAYLE_SKINS.length)}
        onNext={() => setSelectedIndex((i) => (i + 1) % KAYLE_SKINS.length)}
        onThumbnailSelect={setSelectedIndex}
        onClose={() => alert("close")}
        onInspect={() => alert("inspect")}
        onLore={() => alert("lore")}
      />
    </div>
  );
}

/** Stateful demo — unowned skin state, no acquired date */
export function SkinPreviewUnownedDemo() {
  const [selectedIndex, setSelectedIndex] = useState(2);

  return (
    <div className="relative w-full" style={{ height: 420 }}>
      <SkinPreview
        skinName={KAYLE_SKINS[selectedIndex]?.name ?? ""}
        owned={KAYLE_SKINS[selectedIndex]?.owned ?? false}
        splashSrc={championSplashUrl("Kayle", KAYLE_SKINS[selectedIndex]?.skinIndex ?? 0)}
        thumbnails={thumbnails}
        selectedIndex={selectedIndex}
        onPrev={() => setSelectedIndex((i) => (i - 1 + KAYLE_SKINS.length) % KAYLE_SKINS.length)}
        onNext={() => setSelectedIndex((i) => (i + 1) % KAYLE_SKINS.length)}
        onThumbnailSelect={setSelectedIndex}
        onClose={() => alert("close")}
      />
    </div>
  );
}
