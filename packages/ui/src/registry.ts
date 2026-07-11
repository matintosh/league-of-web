import type { ShowcaseEntry } from "./showcase";
import { countdownHeaderShowcase } from "./champ-select/countdown-header.showcase";
import { skinCarouselShowcase } from "./champ-select/skin-carousel.showcase";
import { teamPlayerRowShowcase } from "./champ-select/team-player-row.showcase";
import { chatPanelShowcase } from "./chrome/chat-panel.showcase";
import { crestDividerShowcase } from "./chrome/crest-divider.showcase";
import { currencyDisplayShowcase } from "./chrome/currency-display.showcase";
import { filterTabsShowcase } from "./chrome/filter-tabs.showcase";
import { friendGroupHeaderShowcase } from "./chrome/friend-group-header.showcase";
import { friendRowShowcase } from "./chrome/friend-row.showcase";
import { hextechButtonShowcase } from "./chrome/hextech-button.showcase";
import { hextechCheckboxShowcase } from "./chrome/hextech-checkbox.showcase";
import { hextechSelectShowcase } from "./chrome/hextech-select.showcase";
import { hextechToggleShowcase } from "./chrome/hextech-toggle.showcase";
import { hextechTooltipShowcase } from "./chrome/hextech-tooltip.showcase";
import { modalFrameShowcase } from "./chrome/modal-frame.showcase";
import { newsCardShowcase } from "./chrome/news-card.showcase";
import { playButtonShowcase } from "./chrome/play-button.showcase";
import { playerHovercardShowcase } from "./chrome/player-hovercard.showcase";
import { searchInputShowcase } from "./chrome/search-input.showcase";
import { sectionHeaderShowcase } from "./chrome/section-header.showcase";
import { settingsModalShowcase } from "./chrome/settings-modal.showcase";
import { settingsRowShowcase } from "./chrome/settings-row.showcase";
import { storyCardShowcase } from "./chrome/story-card.showcase";
import { tabBarShowcase } from "./chrome/tab-bar.showcase";
import { topNavbarShowcase } from "./chrome/top-navbar.showcase";
import { windowFrameShowcase } from "./chrome/window-frame.showcase";
import { championCardShowcase } from "./collection/champion-card.showcase";
import { skinCardShowcase } from "./collection/skin-card.showcase";
import { statMedallionShowcase } from "./collection/stat-medallion.showcase";
import { gameModeCardShowcase } from "./lobby/game-mode-card.showcase";
import { lobbyPlayerCardShowcase } from "./lobby/lobby-player-card.showcase";
import { matchFoundModalShowcase } from "./lobby/match-found-modal.showcase";
import { queueStatusShowcase } from "./lobby/queue-status.showcase";
import { queueTypeListShowcase } from "./lobby/queue-type-list.showcase";
import { roleSelectorShowcase } from "./lobby/role-selector.showcase";

/**
 * Every component registers its showcase entry here.
 * Keep sorted by area, then name.
 */
export const registry: ShowcaseEntry[] = [
  // champ-select
  countdownHeaderShowcase,
  skinCarouselShowcase,
  teamPlayerRowShowcase,
  // chrome
  chatPanelShowcase,
  crestDividerShowcase,
  currencyDisplayShowcase,
  filterTabsShowcase,
  friendGroupHeaderShowcase,
  friendRowShowcase,
  hextechButtonShowcase,
  hextechCheckboxShowcase,
  hextechSelectShowcase,
  hextechToggleShowcase,
  hextechTooltipShowcase,
  modalFrameShowcase,
  newsCardShowcase,
  playButtonShowcase,
  playerHovercardShowcase,
  searchInputShowcase,
  sectionHeaderShowcase,
  settingsModalShowcase,
  settingsRowShowcase,
  storyCardShowcase,
  tabBarShowcase,
  topNavbarShowcase,
  windowFrameShowcase,
  // collection
  championCardShowcase,
  skinCardShowcase,
  statMedallionShowcase,
  // lobby
  gameModeCardShowcase,
  lobbyPlayerCardShowcase,
  matchFoundModalShowcase,
  queueStatusShowcase,
  queueTypeListShowcase,
  roleSelectorShowcase,
];
