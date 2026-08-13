/**
 * /universe/map — the interactive Map of Runeterra.
 *
 * Server route that supplies the region markers (positions + links) to the
 * client UniverseRuneterraMap. Fills the viewport under the /universe layout.
 */

import { UniverseRuneterraMap } from "@low/ui";
import type { RuneterraRegion } from "@low/fixtures";

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
  { name: "Bandle City", x: 58, y: 38, pin: "town-sml", href: "/universe/region" },
  { name: "Targon Peak", x: 12, y: 60, pin: "landmark", href: "/universe/region" },
];

export const metadata = {
  title: "Map of Runeterra — Universe",
  description: "Explore and discover Runeterra — the interactive world map.",
};

export default function UniverseMapPage() {
  return (
    <div style={{ height: "calc(100vh - 48px)", width: "100%" }}>
      <UniverseRuneterraMap regions={REGIONS} />
    </div>
  );
}
