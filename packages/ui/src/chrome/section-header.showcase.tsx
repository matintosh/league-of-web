import type { ShowcaseEntry } from "../showcase";
import { SectionHeader } from "./section-header";

export const sectionHeaderShowcase: ShowcaseEntry = {
  slug: "section-header",
  name: "Section Header",
  area: "chrome",
  description:
    "Eyebrow + display-title block adapted from the leagueoflegends.com champion grid header. Supports optional intro paragraph, two size scales (md/lg), and left/center alignment.",
  variants: [
    {
      name: "Full (eyebrow + title + intro)",
      notes:
        "Full composition: eyebrow label over title over intro paragraph, centered. Matches the 'CHOOSE YOUR / CHAMPION' reference block.",
      render: () => (
        <div
          data-shot="section-header-full"
          className="w-full max-w-2xl px-8 py-10"
        >
          <SectionHeader
            eyebrow="Choose your"
            title="Champion"
            intro="With over 170 champions in League of Legends, you might be wondering where to start — we'll help you find one that's just the right fit."
          />
        </div>
      ),
    },
    {
      name: "Title only",
      notes: "Minimal variant — title with no eyebrow or intro.",
      render: () => (
        <div className="w-full max-w-2xl px-8 py-10">
          <SectionHeader title="Champions" />
        </div>
      ),
    },
    {
      name: "Left-aligned",
      notes: 'align="left" — for sidebar or narrow-context sections.',
      render: () => (
        <div className="w-full max-w-2xl px-8 py-10">
          <SectionHeader
            eyebrow="Browse by"
            title="Role"
            intro="Filter champions by their primary role to find the right playstyle for you."
            align="left"
          />
        </div>
      ),
    },
    {
      name: "Large (lg)",
      notes:
        'size="lg" — hero-scale heading (text-5xl), centered. Use for top-of-page landing blocks.',
      render: () => (
        <div className="w-full max-w-2xl px-8 py-10">
          <SectionHeader
            eyebrow="Welcome to"
            title="League of Legends"
            size="lg"
          />
        </div>
      ),
    },
    {
      name: "Large left-aligned with intro",
      notes: 'size="lg" + align="left" + intro — hero block flush to left edge.',
      render: () => (
        <div className="w-full max-w-2xl px-8 py-10">
          <SectionHeader
            eyebrow="Discover"
            title="Patch Notes"
            intro="Stay up to date with the latest balance changes, new content, and gameplay updates."
            size="lg"
            align="left"
          />
        </div>
      ),
    },
    {
      name: "Long title overflow",
      notes: "Verifies that long titles wrap gracefully without overflowing layout.",
      render: () => (
        <div className="w-full max-w-2xl px-8 py-10">
          <SectionHeader
            eyebrow="Discover"
            title="Everything You Need to Know About Ranked Season 2025"
            intro="From placements to emerald tier, here is what changed and how to climb."
          />
        </div>
      ),
    },
  ],
};
