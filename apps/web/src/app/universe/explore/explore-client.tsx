"use client";

/**
 * ExploreClient — interactive shell for the /universe/explore page.
 *
 * Holds filter + sort state; delegates rendering to server-safe @low/ui components.
 * 'use client' lives here so the route page.tsx can stay a server component.
 */

import { useState } from "react";
import {
  UniverseFilterTabs,
  UniverseStoryCard,
  type UniverseFilterOption,
  type UniverseStoryKind,
} from "@low/ui";
import { championSplashUrl } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Filter options
// ---------------------------------------------------------------------------

const FILTERS: UniverseFilterOption[] = [
  { key: "everything", label: "Everything" },
  { key: "short-stories", label: "Short Stories" },
  { key: "comics", label: "Comics" },
  { key: "videos", label: "Videos" },
  { key: "music", label: "Music" },
];

// ---------------------------------------------------------------------------
// Story card fixture data
// ---------------------------------------------------------------------------

interface StoryCard {
  id: string;
  art: string;
  overline: string;
  title: string;
  kind: UniverseStoryKind;
  badgeText?: string;
  filterKeys: string[];
}

const ALL_CARDS: StoryCard[] = [
  {
    id: "c1",
    art: championSplashUrl("Ahri"),
    overline: "LeBlanc",
    title: "EVERYWHERE, AND EVERYONE",
    kind: "story",
    filterKeys: ["everything", "short-stories"],
  },
  {
    id: "c2",
    art: championSplashUrl("Jinx"),
    overline: "Jinx",
    title: "PAINTINGS FRAMED IN HALF-LIGHT",
    kind: "comic",
    badgeText: "6 Pages",
    filterKeys: ["everything", "comics"],
  },
  {
    id: "c3",
    art: championSplashUrl("Nasus"),
    overline: "Nasus",
    title: "HOUNDS OF IRON",
    kind: "story",
    filterKeys: ["everything", "short-stories"],
  },
  {
    id: "c4",
    art: championSplashUrl("Senna"),
    overline: "Senna",
    title: "MILIO'S SUPER SPECIAL ADVENTURE REPORTS",
    kind: "story",
    filterKeys: ["everything", "short-stories"],
  },
  {
    id: "c5",
    art: championSplashUrl("Kayn"),
    overline: "Kayn",
    title: "THE WILL OF THE DEAD",
    kind: "story",
    filterKeys: ["everything", "short-stories"],
  },
  {
    id: "c6",
    art: championSplashUrl("Yasuo"),
    overline: "4 Skins",
    title: "EVERYTHING WE SHOULD HAVE SAID",
    kind: "comic",
    badgeText: "4 Pages",
    filterKeys: ["everything", "comics"],
  },
  {
    id: "c7",
    art: championSplashUrl("Viego"),
    overline: "Viego",
    title: "RUINATION PROLOGUE",
    kind: "comic",
    badgeText: "12 Pages",
    filterKeys: ["everything", "comics"],
  },
  {
    id: "c8",
    art: championSplashUrl("Xayah"),
    overline: "Xayah · Star Guardian Comics",
    title: "EMBRACE",
    kind: "comic",
    badgeText: "8 Pages",
    filterKeys: ["everything", "comics"],
  },
  {
    id: "c9",
    art: championSplashUrl("Zoe"),
    overline: "Star Guardian Duets · Taliyah",
    title: "HOPE",
    kind: "story",
    filterKeys: ["everything", "short-stories"],
  },
  {
    id: "c10",
    art: championSplashUrl("Ekko"),
    overline: "Star Guardian Duets · Tome Marc",
    title: "CONVINCE ME",
    kind: "story",
    filterKeys: ["everything", "short-stories"],
  },
  {
    id: "c11",
    art: championSplashUrl("Seraphine"),
    overline: "Seraphine",
    title: "SHINE SO BRIGHT",
    kind: "music",
    filterKeys: ["everything", "music"],
  },
  {
    id: "c12",
    art: championSplashUrl("Vi"),
    overline: "Vi",
    title: "CLOCKWORK",
    kind: "video",
    filterKeys: ["everything", "videos"],
  },
  {
    id: "c13",
    art: championSplashUrl("Nautilus"),
    overline: "Bilgewater",
    title: "AN INTIMATE EVENING AT OYSTER BILL'S",
    kind: "story",
    filterKeys: ["everything", "short-stories"],
  },
  {
    id: "c14",
    art: championSplashUrl("Aphelios"),
    overline: "Aphelios",
    title: "TWIN STARS",
    kind: "music",
    filterKeys: ["everything", "music"],
  },
  {
    id: "c15",
    art: championSplashUrl("Tristana"),
    overline: "Zaun",
    title: "THE BOYS AND BOMBOLINI",
    kind: "story",
    filterKeys: ["everything", "short-stories"],
  },
  {
    id: "c16",
    art: championSplashUrl("Blitzcrank"),
    overline: "Piltover",
    title: "PINWHEEL",
    kind: "story",
    filterKeys: ["everything", "short-stories"],
  },
];

// ---------------------------------------------------------------------------
// Client component
// ---------------------------------------------------------------------------

export function ExploreClient() {
  const [activeFilter, setActiveFilter] = useState("everything");
  const [sort, setSort] = useState<"Newest" | "Oldest">("Newest");

  const filtered = ALL_CARDS.filter((c) => c.filterKeys.includes(activeFilter));
  const sorted =
    sort === "Newest" ? [...filtered] : [...filtered].reverse();

  return (
    <div style={{ backgroundColor: "var(--color-universe-bg)" }}>
      {/* Filter/sort bar */}
      <div
        className="sticky top-0 z-20"
        style={{ backgroundColor: "color-mix(in srgb, var(--color-universe-bg) 90%, transparent)" }}
      >
        <div className="px-3">
          <UniverseFilterTabs
            filters={FILTERS}
            activeFilter={activeFilter}
            onFilter={setActiveFilter}
            sort={sort}
            onSortToggle={() => setSort((s) => (s === "Newest" ? "Oldest" : "Newest"))}
          />
        </div>
      </div>

      {/* Story card grid — full-bleed edge-to-edge, small gutter (#3a) */}
      <div className="px-3 py-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {sorted.map((card) => (
            <UniverseStoryCard
              key={card.id}
              art={card.art}
              overline={card.overline}
              title={card.title}
              kind={card.kind}
              badgeText={card.badgeText}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
