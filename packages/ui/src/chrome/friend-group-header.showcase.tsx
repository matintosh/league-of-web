import type { ShowcaseEntry } from "../showcase";
import {
  FriendGroupHeaderExpandedDemo,
  FriendGroupHeaderCollapsedDemo,
  FriendGroupHeaderWithMembersDemo,
  FriendGroupHeaderZeroDemo,
  FriendGroupHeaderToggleDemo,
} from "./friend-group-header.demo";

export const friendGroupHeaderShowcase: ShowcaseEntry = {
  slug: "friend-group-header",
  name: "FriendGroupHeader",
  area: "chrome",
  description:
    "Collapsible social group header row — caret, uppercase name, and online/total count. Full-row button toggles collapsed state.",
  variants: [
    {
      name: "Expanded",
      notes:
        "Caret points down (▾, 0° rotation), group name uppercase grey-1, count grey-2. Mirrors the reference '▾ GENERAL (0/0)' band.",
      render: () => <FriendGroupHeaderExpandedDemo />,
    },
    {
      name: "Collapsed",
      notes:
        "Caret rotated -90° (pointing right). List is hidden at the parent level — this component signals state via aria-expanded.",
      render: () => <FriendGroupHeaderCollapsedDemo />,
    },
    {
      name: "With online members",
      notes: "Count shows (1/9) matching the '▾ GÉNÉRAL (1/9)' reference row.",
      render: () => <FriendGroupHeaderWithMembersDemo />,
    },
    {
      name: "Zero online",
      notes: "Both counts zero — (0/0) edge case matching GENERAL group.",
      render: () => <FriendGroupHeaderZeroDemo />,
    },
    {
      name: "Interactive toggle",
      notes:
        "Click the row to toggle collapsed state. Caret rotates and aria-expanded flips.",
      render: () => <FriendGroupHeaderToggleDemo />,
    },
  ],
};
