import type { ShowcaseEntry } from "../showcase";
import {
  RolePickerPopoverOpenDemo,
  RolePickerPopoverWithSelectionDemo,
  RolePickerPopoverFillSelectedDemo,
  RolePickerPopoverDisabledDemo,
  RolePickerPopoverInteractiveDemo,
} from "./role-picker-popover.demo";

/**
 * Showcase entries for RolePickerPopover.
 *
 * All static variants use open=true in a relative container so the absolute-
 * positioned popover is visible without needing a trigger. The interactive
 * demo wires the full trigger → popover → selection → close round-trip.
 *
 * Hover note: the label block updates on hover (roving label) — hover each
 * icon in the interactive demo to see "Jungle", "Top", etc. appear in the
 * label block above. The caption ("Priority" / "Secondary") is always visible.
 */
export const rolePickerPopoverShowcase: ShowcaseEntry = {
  slug: "role-picker-popover",
  name: "Role Picker Popover",
  area: "lobby",
  description:
    "Dark floating panel for lobby role selection. Renders above the trigger circle (absolute, no portal) with a downward caret notch. Contains a roving label block (hovered/selected role name over slot caption) and a row of 6 role glyphs (Top · Jungle · Mid · Bot · Support · Fill) with a hairline divider before Fill. Selected role shows a teal diamond marker; disabled roles (the other slot's pick) are dimmed. Controlled: parent sets open/selected; popover fires onSelect+onClose on pick.",
  variants: [
    {
      name: "Open — no selection",
      notes:
        "open=true with no selected role. Label block shows only the slot caption ('Priority'). All roles interactive.",
      render: () => <RolePickerPopoverOpenDemo />,
    },
    {
      name: "Open — Jungle selected",
      notes:
        "selected='jungle'. Label block shows 'Jungle' over 'Priority' caption. Teal diamond marker at top-right of Jungle icon. Other roles in default state.",
      render: () => <RolePickerPopoverWithSelectionDemo />,
    },
    {
      name: "Fill selected",
      notes:
        "selected='fill'. Demonstrates the asterisk glyph with selected gold border + teal diamond. Label block shows 'Fill' over 'Secondary' caption.",
      render: () => <RolePickerPopoverFillSelectedDemo />,
    },
    {
      name: "Disabled roles (other-slot pick)",
      notes:
        "disabledRoles=['jungle', 'utility']. These appear dimmed (opacity-30) and are non-interactive. The label block only updates on hover over non-disabled roles. Hover note: hovering a dimmed role does not update the label.",
      render: () => <RolePickerPopoverDisabledDemo />,
    },
    {
      name: "Interactive — full round-trip",
      notes:
        "Trigger circle opens the popover (Priority + Secondary). Click a role to close the popover and update the trigger icon + self RoleSlotRow. The other slot's pick is passed as disabledRoles. Click the trigger again to re-open. Hover roles to see the roving label block update.",
      render: () => <RolePickerPopoverInteractiveDemo />,
    },
  ],
};
