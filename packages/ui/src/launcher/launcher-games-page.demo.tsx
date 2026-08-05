"use client";

/**
 * LauncherGamesPageDemo — client wrapper for the showcase.
 * Wires up the onGameAction callback to console.log so
 * the showcase entry itself can remain server-safe.
 */

import type { LauncherGamesPageProps } from "./launcher-games-page";
import { LauncherGamesPage } from "./launcher-games-page";

export function LauncherGamesPageDemo(props: Omit<LauncherGamesPageProps, "onGameAction">) {
  return (
    <LauncherGamesPage
      {...props}
      onGameAction={(key, action) => {
        // eslint-disable-next-line no-console
        console.log("[LauncherGamesPageDemo] onGameAction", { key, action });
      }}
    />
  );
}
