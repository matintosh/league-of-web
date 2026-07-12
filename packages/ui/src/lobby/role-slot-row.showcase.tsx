import type { ShowcaseEntry } from "../showcase";
import {
  RoleSlotRowFilledDemo,
  RoleSlotRowPartialDemo,
  RoleSlotRowEmptyDemo,
  RoleSlotRowSmDemo,
  RoleSlotRowClickableDemo,
  RoleSlotRowGlyphDemo,
  RoleSlotRowAllRolesDemo,
} from "./role-slot-row.demo";

export const roleSlotRowShowcase: ShowcaseEntry = {
  slug: "role-slot-row",
  name: "Role Slot Row",
  area: "lobby",
  description:
    "Horizontal row of circular role-slot indicators used in PlayerBanner. Filled slots show a role icon (real CommunityDragon SVG or inline glyph fallback) with a colored ring (gold=primary, teal=secondary). Empty slots show a dark circle with grey ring. Supports sm/md size and optional click handler.",
  variants: [
    {
      name: "Filled — md (mid + support)",
      notes:
        "Both slots filled with real CommunityDragon position SVGs. Gold ring on primary slot, teal ring on secondary. 34px circles (md default).",
      render: () => <RoleSlotRowFilledDemo />,
    },
    {
      name: "Partial — md (top + empty)",
      notes:
        "One filled slot (top, gold ring) and one empty slot (dark circle, grey ring). 34px md scale.",
      render: () => <RoleSlotRowPartialDemo />,
    },
    {
      name: "Empty — md (both unset)",
      notes:
        "Both slots empty — two dark circles with grey rings and no icon content. Glyph fallback path (no iconSrcFor).",
      render: () => <RoleSlotRowEmptyDemo />,
    },
    {
      name: "Small size — sm",
      notes:
        "size='sm': 26px circles, 14px icons. Filled (jungle+bottom) and partial (top+empty) side-by-side.",
      render: () => <RoleSlotRowSmDemo />,
    },
    {
      name: "Clickable (interactive)",
      notes:
        "onSlotClick wired — clicking a slot fires the callback and logs the slot index. Circles render as <button> with hover/focus ring. Role popover is out of scope.",
      render: () => <RoleSlotRowClickableDemo />,
    },
    {
      name: "Glyph fallback (no iconSrcFor)",
      notes:
        "No iconSrcFor prop — falls back to inline SVG glyphs (same design as RoleSelector glyphs, 14px). Gold color on filled slots.",
      render: () => <RoleSlotRowGlyphDemo />,
    },
    {
      name: "Five slots — all roles",
      notes:
        "Five slots row with all roles filled. Demonstrates that the ring-color Record extends gracefully (slots 2+ use grey-3 fallback ring).",
      render: () => <RoleSlotRowAllRolesDemo />,
    },
  ],
};
