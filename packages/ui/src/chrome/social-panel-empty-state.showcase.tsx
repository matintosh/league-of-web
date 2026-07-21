import type { ReactNode } from "react";
import { poroUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { SocialPanelEmptyState } from "./social-panel-empty-state";

/**
 * The empty state fills its flex parent, so each variant is wrapped in a fixed
 * frame that mimics the friends-rail column: 224px wide, tall, and the same
 * near-black navy background as SocialPanel — so the poro art is verified to
 * read cleanly against the real backdrop, not a neutral card.
 */
function RailFrame({ children }: { children: ReactNode }) {
  return (
    <div className="h-96 w-56 bg-[color-mix(in_srgb,var(--color-blue-7)_22%,var(--color-hextech-black))]">
      {children}
    </div>
  );
}

export const socialPanelEmptyStateShowcase: ShowcaseEntry = {
  slug: "social-panel-empty-state",
  name: "SocialPanelEmptyState",
  area: "chrome",
  description:
    "Poro empty state for the friends rail — a centered 102×96 poro mascot (pinned patch-7.5 friend-finder art) above a short copy line. Shown by SocialPanel when the groups list is empty: no friends yet (question poro), a search with no results (sad poro), or a loading placeholder (sleeping poro).",
  variants: [
    {
      name: "Question — no friends yet",
      notes:
        'Default state for a new account. "?" poro with "Add a friend to get started". This is what SocialPanel renders when groups is [] and a poroSrcFor resolver is supplied. data-shot target.',
      render: () => (
        <div data-shot="social-panel-empty-state">
          <RailFrame>
            <SocialPanelEmptyState poro="question" poroSrcFor={poroUrl} />
          </RailFrame>
        </div>
      ),
    },
    {
      name: "Sad — search returned nothing",
      notes:
        'Droopy poro with "No results found" / "Try a different Riot ID." — for a friend search that matched no one.',
      render: () => (
        <RailFrame>
          <SocialPanelEmptyState poro="sad" poroSrcFor={poroUrl} />
        </RailFrame>
      ),
    },
    {
      name: "Sleeping — loading",
      notes:
        'Dozing poro with "Loading your friends…" — an away / loading placeholder (no supporting sub-line).',
      render: () => (
        <RailFrame>
          <SocialPanelEmptyState poro="sleeping" poroSrcFor={poroUrl} />
        </RailFrame>
      ),
    },
  ],
};
