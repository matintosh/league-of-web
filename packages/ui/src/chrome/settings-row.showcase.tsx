import type { ShowcaseEntry } from "../showcase";
import {
  SettingsRowWithToggleDemo,
  SettingsRowWithButtonDemo,
  SettingsRowNoDescriptionDemo,
  SettingsRowMultipleDemo,
  SettingsRowLongLabelDemo,
} from "./settings-row.demo";

export const settingsRowShowcase: ShowcaseEntry = {
  slug: "settings-row",
  name: "Settings Row",
  area: "chrome",
  description:
    "A single row in the LoL client settings panel: label + optional description on the left, right-aligned control slot on the right, separated by a bottom border.",
  variants: [
    {
      name: "With toggle",
      notes: "Most common usage — toggle as the control.",
      render: () => <SettingsRowWithToggleDemo />,
    },
    {
      name: "With button control",
      notes: "Button as the control — e.g. for navigate actions.",
      render: () => <SettingsRowWithButtonDemo />,
    },
    {
      name: "No description",
      notes: "description prop omitted — label only.",
      render: () => <SettingsRowNoDescriptionDemo />,
    },
    {
      name: "Multiple rows",
      notes: "last:border-b-0 via CSS removes the final separator.",
      render: () => <SettingsRowMultipleDemo />,
    },
    {
      name: "Long label truncation",
      notes: "Overflowing label truncates with ellipsis; control stays right-aligned.",
      render: () => <SettingsRowLongLabelDemo />,
    },
  ],
};
