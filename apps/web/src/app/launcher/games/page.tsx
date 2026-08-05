/**
 * /launcher/games — Riot multi-game launcher Games library page.
 *
 * Assembles the full launcher shell (window bar + rail + content area) with
 * the LauncherGamesPage content. No social/friends panel per the ref (image-7.png
 * shows no right-hand social panel on this surface).
 *
 * Fixture data — cover art via championSplashUrl (champion splashes as stand-ins;
 * real game key-art is not available via Data Dragon). Game logos rendered as
 * inline SVG via the LauncherGamesPage logoNode map.
 *
 * Closes #686, #689.
 */

import { LauncherGamesClient } from "./launcher-games-client";

export default function LauncherGamesPage() {
  return <LauncherGamesClient />;
}
