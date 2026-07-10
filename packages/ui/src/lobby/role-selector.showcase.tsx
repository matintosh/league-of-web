import type { ShowcaseEntry } from "../showcase";
import {
  RoleSelectorInteractiveDemo,
  RoleSelectorNoneDemo,
  RoleSelectorTopDemo,
  RoleSelectorMidDemo,
  RoleSelectorSupportDemo,
  RoleSelectorWithDisabledDemo,
} from "./role-selector.demo";

export const roleSelectorShowcase: ShowcaseEntry = {
  slug: "role-selector",
  name: "Role Selector",
  area: "lobby",
  description:
    "Primary/secondary position picker from the lobby: five role icons (Top, Jungle, Mid, Bottom, Support) as inline SVG glyphs. Selected role highlighted gold; hovering brightens.",
  variants: [
    {
      name: "Interactive",
      notes: "Click a role to select it. State owned by demo component.",
      render: () => <RoleSelectorInteractiveDemo />,
    },
    {
      name: "None selected",
      notes: "All roles available, none selected.",
      render: () => <RoleSelectorNoneDemo />,
    },
    {
      name: "Top selected",
      notes: "Static snapshot — Top is the selected role.",
      render: () => <RoleSelectorTopDemo />,
    },
    {
      name: "Mid selected",
      notes: "Static snapshot — Mid is the selected role.",
      render: () => <RoleSelectorMidDemo />,
    },
    {
      name: "Support selected",
      notes: "Static snapshot — Support is the selected role.",
      render: () => <RoleSelectorSupportDemo />,
    },
    {
      name: "With disabled roles",
      notes: "Jungle and Support disabled (opacity-40, non-interactive). Interactive — click to select.",
      render: () => <RoleSelectorWithDisabledDemo />,
    },
  ],
};
