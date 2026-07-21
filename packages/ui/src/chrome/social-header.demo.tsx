"use client";

import { friendFinderImageUrl, socialMaskUrl } from "@low/fixtures";
import { useState } from "react";
import type { SocialAction } from "./social-header";
import { SocialHeader } from "./social-header";

/** Real-client add-friend mask glyph, patch-7.5 pinned (#434). */
const ADD_ICON_SRC = friendFinderImageUrl("add_person_mask");
/** Remaining real-client social glyphs, `latest`-pinned masks (#440). */
const GROUPS_ICON_SRC = socialMaskUrl("add_folder_mask");
const LIST_ICON_SRC = socialMaskUrl("sort_mask");
const SEARCH_ICON_SRC = socialMaskUrl("search_mask");

/**
 * Interactive demo that logs which action button was last clicked.
 * Demonstrates onAction callback wiring.
 */
export function SocialHeaderActionLogDemo() {
  const [last, setLast] = useState<SocialAction | null>(null);

  return (
    <div className="w-64 bg-blue-7">
      <SocialHeader
        onAction={setLast}
        addIconSrc={ADD_ICON_SRC}
        groupsIconSrc={GROUPS_ICON_SRC}
        listIconSrc={LIST_ICON_SRC}
        searchIconSrc={SEARCH_ICON_SRC}
      />
      {last !== null && (
        <p className="px-3 py-1 font-body text-xs text-grey-1">
          Last action: <span className="text-gold-2">{last}</span>
        </p>
      )}
    </div>
  );
}

/**
 * Demo of the collapse chevron affordance (#401). Wiring onToggleCollapse
 * renders the leading « button; clicking it here logs the collapse intent.
 */
export function SocialHeaderCollapseDemo() {
  const [collapsedCount, setCollapsedCount] = useState(0);

  return (
    <div className="w-64 bg-blue-7">
      <SocialHeader
        onToggleCollapse={() => setCollapsedCount((n) => n + 1)}
        addIconSrc={ADD_ICON_SRC}
        groupsIconSrc={GROUPS_ICON_SRC}
        listIconSrc={LIST_ICON_SRC}
        searchIconSrc={SEARCH_ICON_SRC}
      />
      <p className="px-3 py-1 font-body text-xs text-grey-1">
        Collapse clicked: <span className="text-gold-2">{collapsedCount}</span>
      </p>
    </div>
  );
}
