import type { ShowcaseEntry } from "../showcase";
import type { RuneterraRegion } from "@low/fixtures";
import { UniverseRuneterraMap } from "./universe-runeterra-map";

const REGIONS: RuneterraRegion[] = [
  { name: "Freljord", x: 24, y: 18, pin: "capital", href: "/universe/region" },
  { name: "Noxus", x: 33, y: 30, pin: "capital", href: "/universe/region" },
  { name: "Ionia", x: 72, y: 26, pin: "landmark", href: "/universe/region" },
  { name: "Demacia", x: 17, y: 40, pin: "capital", href: "/universe/region" },
  { name: "Piltover & Zaun", x: 45, y: 44, pin: "town-med", href: "/universe/region" },
  { name: "Bilgewater", x: 66, y: 50, pin: "landmark", href: "/universe/region" },
  { name: "Targon", x: 16, y: 72, pin: "landmark", href: "/universe/region" },
  { name: "Shurima", x: 41, y: 66, pin: "capital", href: "/universe/region" },
  { name: "Ixtal", x: 51, y: 74, pin: "town-med", href: "/universe/region" },
  { name: "Shadow Isles", x: 79, y: 72, pin: "landmark", href: "/universe/region" },
];

export const universeRuneterraMapShowcase: ShowcaseEntry = {
  slug: "universe-runeterra-map",
  name: "Universe Runeterra Map",
  area: "universe",
  description:
    "Interactive Map of Runeterra — a fan-recreation of map.leagueoflegends.com: an intro state (EXPLORE & DISCOVER / RUNETERRA + BEGIN EXPLORING) that reveals a pan/zoom world map with region markers. Base atmosphere from tokens; pin markers use the real public Map-of-Runeterra assets via runeterraPinUrl().",
  referenceImage: "universe-map-app.png",
  referenceNote:
    "docs/reference/universe-map-app.png (intro) + universe-map-explore.png (explore state with region labels + crest pins)",
  variants: [
    {
      name: "Intro state (Begin Exploring)",
      notes:
        "Opening overlay over the map atmosphere. Click BEGIN EXPLORING to reveal the pan/zoom explore state.",
      backgrounds: ["dark"],
      render: () => (
        <div style={{ height: "520px", width: "100%" }}>
          <UniverseRuneterraMap regions={REGIONS} />
        </div>
      ),
    },
    {
      name: "Explore state (pan + zoom, hover a region)",
      notes:
        "Drag to pan, wheel or +/- to zoom. Hover a region marker to raise its pin + label. Real pin assets from the Map-of-Runeterra CDN.",
      backgrounds: ["dark"],
      render: () => (
        <div style={{ height: "520px", width: "100%" }}>
          <UniverseRuneterraMap regions={REGIONS} startExploring />
        </div>
      ),
    },
  ],
};
