import type { ShowcaseEntry } from "../showcase";
import {
  ObjectivesModalDemo,
  ObjectivesModalStaticDemo,
  ObjectivesModalDailyDemo,
} from "./objectives-modal.demo";

export const objectivesModalShowcase: ShowcaseEntry = {
  slug: "objectives-modal",
  name: "Objectives Modal",
  area: "chrome",
  description:
    "The current-era Missions / Objectives surface, opened from the nav-band Missions icon. A centered modal over the lobby: a left category rail (Daily / Weekly / Act / Events / Mastery / Ranked with completion markers), a splash-art banner header, a Blue-XP progress bar, and a scrollable list of mission rows (circular progress ring + reward tile).",
  referenceImage: "client-current-objectives-modal.jpg",
  referenceNote:
    "Current-era Objectives modal over an ARAM lobby (Welcome to Noxus: Act 1 — Chapter II). docs/reference/client-current-objectives-modal.jpg (1920×1080).",
  variants: [
    {
      name: "Interactive (trigger)",
      notes:
        "Click 'Open Objectives' to open. Category selection moves the gold active bar; ✕ / backdrop close it.",
      render: () => <ObjectivesModalDemo />,
    },
    {
      name: "Static — Events category",
      notes:
        "Always-open snapshot in a relative stage (does not overlay the page). Events active; five mission rows with progress rings + reward tiles.",
      render: () => <ObjectivesModalStaticDemo />,
    },
    {
      name: "Static — Daily category (completed)",
      notes:
        "Daily category active (gold check marker); short mission list. Shows the active bar at the top of the rail.",
      render: () => <ObjectivesModalDailyDemo />,
    },
  ],
};
