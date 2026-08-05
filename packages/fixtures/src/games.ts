/**
 * Game tile fixture types for the Riot launcher Games page.
 * Provides the `GameTileData` interface consumed by `@low/ui` components.
 * Values are always supplied by pages / showcase files — never by `@low/ui`.
 */

/**
 * Status of a game in the user's library.
 * Drives the badge variant rendered on `GameTile`.
 */
export type GameStatus = "installed" | "update" | "play" | "install" | "coming-soon";

/** Data contract for a single game tile. */
export interface GameTileData {
  /** Unique key, e.g. "lol" | "valorant" | "tft" | "2xko" | "wildrift". */
  gameKey: string;
  /** Display name rendered below the cover image, e.g. "League of Legends". */
  gameName: string;
  /** Key-art cover image URL (full-bleed, object-cover). */
  coverUrl: string;
  /**
   * Game logo image URL.
   * Passed as a string for URL-based logos; the component also accepts a
   * ReactNode via the `logoNode` prop for inline SVG logos.
   */
  logoUrl?: string;
  /** Badge variant. */
  status: GameStatus;
  /**
   * CSS color value for the full-width "Installed" bar shown at the tile
   * bottom in coverBadge layout. Should reference a launcher token via
   * `var(--color-launcher-installed-bar-<game>)`. Falls back to the
   * default badge-installed green when omitted.
   *
   * Example: `"var(--color-launcher-installed-bar-lol)"`
   */
  installedBarColor?: string;
}
