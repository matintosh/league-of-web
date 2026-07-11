import type { ShowcaseEntry } from "./showcase";
import { crestDividerShowcase } from "./chrome/crest-divider.showcase";
import { currencyDisplayShowcase } from "./chrome/currency-display.showcase";
import { filterTabsShowcase } from "./chrome/filter-tabs.showcase";
import { hextechButtonShowcase } from "./chrome/hextech-button.showcase";
import { hextechToggleShowcase } from "./chrome/hextech-toggle.showcase";
import { hextechTooltipShowcase } from "./chrome/hextech-tooltip.showcase";
import { modalFrameShowcase } from "./chrome/modal-frame.showcase";
import { newsCardShowcase } from "./chrome/news-card.showcase";
import { playButtonShowcase } from "./chrome/play-button.showcase";
import { playerHovercardShowcase } from "./chrome/player-hovercard.showcase";
import { sectionHeaderShowcase } from "./chrome/section-header.showcase";
import { settingsModalShowcase } from "./chrome/settings-modal.showcase";
import { settingsRowShowcase } from "./chrome/settings-row.showcase";
import { tabBarShowcase } from "./chrome/tab-bar.showcase";
import { topNavbarShowcase } from "./chrome/top-navbar.showcase";
import { windowFrameShowcase } from "./chrome/window-frame.showcase";
import { championCardShowcase } from "./collection/champion-card.showcase";
import { lobbyPlayerCardShowcase } from "./lobby/lobby-player-card.showcase";
import { matchFoundModalShowcase } from "./lobby/match-found-modal.showcase";
import { queueStatusShowcase } from "./lobby/queue-status.showcase";
import { roleSelectorShowcase } from "./lobby/role-selector.showcase";

/**
 * Every component registers its showcase entry here.
 * Keep sorted by area, then name.
 */
export const registry: ShowcaseEntry[] = [
  // chrome
  crestDividerShowcase,
  currencyDisplayShowcase,
  filterTabsShowcase,
  hextechButtonShowcase,
  hextechToggleShowcase,
  hextechTooltipShowcase,
  modalFrameShowcase,
  newsCardShowcase,
  playButtonShowcase,
  playerHovercardShowcase,
  sectionHeaderShowcase,
  settingsModalShowcase,
  settingsRowShowcase,
  tabBarShowcase,
  topNavbarShowcase,
  windowFrameShowcase,
  // collection
  championCardShowcase,
  // lobby
  lobbyPlayerCardShowcase,
  matchFoundModalShowcase,
  queueStatusShowcase,
  roleSelectorShowcase,
];
