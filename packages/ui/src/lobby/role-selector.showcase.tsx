import type { ShowcaseEntry } from "../showcase";
import {
  RoleSelectorInteractiveDemo,
  RoleSelectorNoneDemo,
  RoleSelectorTopDemo,
  RoleSelectorMidDemo,
  RoleSelectorSupportDemo,
  RoleSelectorWithDisabledDemo,
  RoleSelectorRealIconsDemo,
  RoleSelectorRealIconsTopDemo,
} from "./role-selector.demo";

export const roleSelectorShowcase: ShowcaseEntry = {
  slug: "role-selector",
  name: "Role Selector",
  area: "lobby",
  description:
    "Primary/secondary position picker from the lobby: five role icons (Top, Jungle, Mid, Bottom, Support). Supports real CommunityDragon position SVGs via iconSrcFor prop, or inline SVG glyph fallback.",
  variants: [
    {
      name: "Interactive (glyph fallback)",
      notes: "Click a role to select it. State owned by demo component. Inline SVG glyph fallback.",
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
    {
      name: "Real Icons (CommunityDragon)",
      notes: "iconSrcFor=roleIconSrc — real position SVGs from CommunityDragon. Gold default variant; light (near-white) variant on selected. Click to select.",
      render: () => <RoleSelectorRealIconsDemo />,
    },
    {
      name: "Real Icons — Top selected",
      notes: "Static snapshot with real icons — Top selected shows the light variant; others show gold default.",
      render: () => <RoleSelectorRealIconsTopDemo />,
    },
  ],
};
