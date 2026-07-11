import type { ShowcaseEntry } from "../showcase";
import {
  QueueTypeListInteractiveDemo,
  QueueTypeListSelectedUnselectedDemo,
  QueueTypeListDisabledWarningDemo,
  QueueTypeListAllStatesDemo,
} from "./queue-type-list.demo";

export const queueTypeListShowcase: ShowcaseEntry = {
  slug: "queue-type-list",
  name: "Queue Type List",
  area: "lobby",
  description:
    "Radiogroup of diamond-bullet queue option rows shown below the mode description on the PvP screen. Selected row renders a filled gold diamond + bold gold text; unselected rows render an outline diamond + grey text; disabled+warning rows show a red warning triangle between the diamond and label.",
  variants: [
    {
      name: "Interactive",
      notes:
        "Click a non-disabled option to select it. State owned by demo component.",
      render: () => <QueueTypeListInteractiveDemo />,
    },
    {
      name: "Selected / unselected",
      notes:
        "First option selected (filled gold diamond + bold gold text). Second option unselected (outline diamond + grey text).",
      render: () => <QueueTypeListSelectedUnselectedDemo />,
    },
    {
      name: "Disabled + warning",
      notes:
        "Row has disabled=true, warning=true — renders outline diamond, red warning triangle, dimmed grey-2 text.",
      render: () => <QueueTypeListDisabledWarningDemo />,
    },
    {
      name: "All states",
      notes:
        "All three states together: selected (BLIND PICK), unselected (RANKED SOLO/DUO), and disabled+warning (RANKED FLEX).",
      render: () => <QueueTypeListAllStatesDemo />,
    },
  ],
};
