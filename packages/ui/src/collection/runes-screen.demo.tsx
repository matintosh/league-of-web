'use client';

import { useState } from "react";
import { RunesScreen } from "./runes-screen";
import { RUNE_PATHS_ORDERED, runesGlyphIconUrl } from "@low/fixtures";
import { demoRunePages } from "@low/fixtures";
import type { RunePage } from "./runes-screen";

/** Default demo — 3 preset pages, interactive state */
export function RunesScreenDefaultDemo() {
  const [selectedPageId, setSelectedPageId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [hidePresets, setHidePresets] = useState(false);
  const [activePathFilter, setActivePathFilter] = useState<string | null>(null);

  // Cast fixture data to component type (same shape, fixture adds helper fields)
  const pages: RunePage[] = demoRunePages;

  return (
    <div className="h-[500px] bg-hextech-black">
      <RunesScreen
        paths={RUNE_PATHS_ORDERED}
        allRunesGlyphSrc={runesGlyphIconUrl()}
        pages={pages}
        maxPages={3}
        selectedPageId={selectedPageId}
        onSelectPage={setSelectedPageId}
        onCreatePage={() => console.log("create page")}
        onDeletePage={(id) => console.log("delete page", id)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        hidePresets={hidePresets}
        onHidePresetsChange={setHidePresets}
        activePathFilter={activePathFilter}
        onPathFilterChange={setActivePathFilter}
      />
    </div>
  );
}

/** Selected page demo — first card pre-selected */
export function RunesScreenSelectedDemo() {
  const [selectedPageId, setSelectedPageId] = useState<string>("preset-precision");
  const pages: RunePage[] = demoRunePages;

  return (
    <div className="h-[500px] bg-hextech-black">
      <RunesScreen
        paths={RUNE_PATHS_ORDERED}
        allRunesGlyphSrc={runesGlyphIconUrl()}
        pages={pages}
        maxPages={3}
        selectedPageId={selectedPageId}
        onSelectPage={setSelectedPageId}
        onCreatePage={() => console.log("create page")}
        onDeletePage={(id) => console.log("delete page", id)}
      />
    </div>
  );
}

/** Empty demo — no pages, only CREATE NEW card */
export function RunesScreenEmptyDemo() {
  return (
    <div className="h-[500px] bg-hextech-black">
      <RunesScreen
        paths={RUNE_PATHS_ORDERED}
        allRunesGlyphSrc={runesGlyphIconUrl()}
        pages={[]}
        maxPages={3}
        onSelectPage={() => {}}
        onCreatePage={() => console.log("create page")}
        onDeletePage={() => {}}
      />
    </div>
  );
}

/** Active path filter demo — Domination path pre-selected, others dimmed */
export function RunesScreenPathFilterDemo() {
  const [selectedPageId, setSelectedPageId] = useState<string | undefined>(undefined);
  const [activePathFilter, setActivePathFilter] = useState<string | null>("7200"); // Domination
  const pages: RunePage[] = demoRunePages;

  return (
    <div className="h-[500px] bg-hextech-black">
      <RunesScreen
        paths={RUNE_PATHS_ORDERED}
        allRunesGlyphSrc={runesGlyphIconUrl()}
        pages={pages}
        maxPages={3}
        selectedPageId={selectedPageId}
        onSelectPage={setSelectedPageId}
        onCreatePage={() => console.log("create page")}
        onDeletePage={(id) => console.log("delete page", id)}
        activePathFilter={activePathFilter}
        onPathFilterChange={setActivePathFilter}
      />
    </div>
  );
}

/** Hide presets demo — preset pages hidden from the card grid */
export function RunesScreenHidePresetsDemo() {
  const [selectedPageId, setSelectedPageId] = useState<string | undefined>(undefined);
  const [hidePresets, setHidePresets] = useState(true);
  const pages: RunePage[] = demoRunePages;

  return (
    <div className="h-[500px] bg-hextech-black">
      <RunesScreen
        paths={RUNE_PATHS_ORDERED}
        allRunesGlyphSrc={runesGlyphIconUrl()}
        pages={pages}
        maxPages={3}
        selectedPageId={selectedPageId}
        onSelectPage={setSelectedPageId}
        onCreatePage={() => console.log("create page")}
        onDeletePage={(id) => console.log("delete page", id)}
        hidePresets={hidePresets}
        onHidePresetsChange={setHidePresets}
      />
    </div>
  );
}

/** Trash button enabled demo — a page is selected so trash is active */
export function RunesScreenTrashEnabledDemo() {
  const [selectedPageId, setSelectedPageId] = useState<string | undefined>("preset-sorcery");
  const pages: RunePage[] = demoRunePages;

  return (
    <div className="h-[500px] bg-hextech-black">
      <RunesScreen
        paths={RUNE_PATHS_ORDERED}
        allRunesGlyphSrc={runesGlyphIconUrl()}
        pages={pages}
        maxPages={3}
        selectedPageId={selectedPageId}
        onSelectPage={setSelectedPageId}
        onCreatePage={() => console.log("create page")}
        onDeletePage={(id) => {
          console.log("delete page", id);
          setSelectedPageId(undefined);
        }}
      />
    </div>
  );
}
