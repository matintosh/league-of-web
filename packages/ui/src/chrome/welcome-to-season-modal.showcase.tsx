import type { ShowcaseEntry } from "../showcase";
import {
  WelcomeToSeasonModalStaticDemo,
  WelcomeToSeasonModal2020Demo,
  WelcomeToSeasonModalInteractiveDemo,
} from "./welcome-to-season-modal.demo";

export const welcomeToSeasonModalShowcase: ShowcaseEntry = {
  slug: "welcome-to-season-modal",
  name: "Welcome To Season Modal",
  area: "chrome",
  description:
    "Full-screen season-intro overlay shown the first time a player visits Profile → STATS. Dims the background behind a ~80%-viewport panel with title, 3-column feature strip (click/history/compare), and a gold CTA button. Dismissed only via the CTA — no close button.",
  variants: [
    {
      name: "Open — Season 2019",
      notes:
        "Primary open state. Backdrop scrim + panel centred at ~980×580px. Three feature columns with art placeholders.",
      render: () => <WelcomeToSeasonModalStaticDemo />,
    },
    {
      name: "Alternate season prop — 2020",
      notes:
        "Passing season=\"2020\" updates both the title (\"Welcome to Season 2020\") and the CTA (\"Start Season 2020!\").",
      render: () => <WelcomeToSeasonModal2020Demo />,
    },
    {
      name: "Interactive open/close",
      notes:
        "Click \"Open Modal\" to trigger. Click \"Start Season 2019!\" CTA to dismiss. Closed state renders nothing (open={false} → null).",
      render: () => <WelcomeToSeasonModalInteractiveDemo />,
    },
  ],
};
