/**
 * Runeterra map assets + region data for the Universe interactive map.
 *
 * Pin markers are public assets from the official Map of Runeterra app
 * (map.leagueoflegends.com/assets/images/pins/*) — referenced by URL, not
 * re-hosted, under the same Riot Games Fan Content Policy basis as the Data
 * Dragon champion art used elsewhere in this project.
 */

const MAP_PIN_BASE = "https://map.leagueoflegends.com/assets/images/pins";

/** Known pin marker names on the Map of Runeterra CDN. */
export type RuneterraPin =
  | "capital"
  | "landmark"
  | "town-med"
  | "town-sml"
  | "story"
  | "short-prose"
  | "comic"
  | "cinematic"
  | "image-gallery"
  | "green-book"
  | "red-book";

/** URL for a Runeterra map pin marker (optionally the -hover variant). */
export const runeterraPinUrl = (name: RuneterraPin, hover = false): string =>
  `${MAP_PIN_BASE}/${name}${hover ? "-hover" : ""}.png`;

/** A placeable region marker on the Runeterra map. */
export interface RuneterraRegion {
  /** Region display name, e.g. "Demacia". */
  name: string;
  /** Horizontal position as a percentage of the map width (0–100). */
  x: number;
  /** Vertical position as a percentage of the map height (0–100). */
  y: number;
  /** Pin marker to use for this region. @default "capital" */
  pin?: RuneterraPin;
  /** Link target for the region. */
  href?: string;
}
