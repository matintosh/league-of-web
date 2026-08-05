"use client";

/**
 * GameTileDemo — click-handler wrapper for GameTile showcase.
 * Logs the gameKey + action to the browser console so the showcase
 * can remain server-safe.
 */

import { GameTile } from "./game-tile";
import type { GameTileProps } from "./game-tile";

export function GameTileDemo(props: GameTileProps) {
  return (
    <GameTile
      {...props}
      onAction={(key, action) => {
        // eslint-disable-next-line no-console
        console.log("[GameTileDemo] onAction", { key, action });
      }}
    />
  );
}
