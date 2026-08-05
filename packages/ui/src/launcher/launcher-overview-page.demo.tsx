"use client";

/**
 * Stateful demo for LauncherOverviewPage.
 * Lives in a separate client component so the showcase file stays server-safe.
 * Wires carousel index, play button open/close, and mode selection.
 */

import { useState } from "react";
import { LauncherOverviewPage } from "./launcher-overview-page";

/** Interactive demo: manages carousel, play button open, and selectedModeId. */
export function LauncherOverviewPageDemo() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedModeId, setSelectedModeId] = useState("lol");

  return (
    <LauncherOverviewPage
      carouselActiveIndex={carouselIndex}
      onCarouselSelect={setCarouselIndex}
      onCta={() => console.log("[demo] CTA clicked")}
      playButtonOpen={dropdownOpen}
      selectedModeId={selectedModeId}
      onPlay={() => {
        console.log("[demo] play clicked, mode:", selectedModeId);
        setDropdownOpen(false);
      }}
      onToggleDropdown={() => setDropdownOpen((o) => !o)}
      onSelectMode={(id) => {
        setSelectedModeId(id);
        setDropdownOpen(false);
      }}
    />
  );
}
