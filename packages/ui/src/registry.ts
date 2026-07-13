import type { ShowcaseEntry } from "./showcase";
import { championPickTileShowcase } from "./champ-select/champion-pick-tile.showcase";
import { countdownHeaderShowcase } from "./champ-select/countdown-header.showcase";
import { lockInButtonShowcase } from "./champ-select/lock-in-button.showcase";
import { skinCarouselShowcase } from "./champ-select/skin-carousel.showcase";
import { skinThumbStripShowcase } from "./champ-select/skin-thumb-strip.showcase";
import { teamPlayerRowShowcase } from "./champ-select/team-player-row.showcase";
import { arcadeEventTabShowcase } from "./chrome/arcade-event-tab.showcase";
import { clubsEmptyStateShowcase } from "./chrome/clubs-empty-state.showcase";
import { chatPanelShowcase } from "./chrome/chat-panel.showcase";
import { crestDividerShowcase } from "./chrome/crest-divider.showcase";
import { currencyDisplayShowcase } from "./chrome/currency-display.showcase";
import { filterTabsShowcase } from "./chrome/filter-tabs.showcase";
import { findingMatchPanelShowcase } from "./chrome/finding-match-panel.showcase";
import { friendGroupHeaderShowcase } from "./chrome/friend-group-header.showcase";
import { friendRequestsRowShowcase } from "./chrome/friend-requests-row.showcase";
import { friendRowShowcase } from "./chrome/friend-row.showcase";
import { hextechButtonShowcase } from "./chrome/hextech-button.showcase";
import { hextechCheckboxShowcase } from "./chrome/hextech-checkbox.showcase";
import { hextechSelectShowcase } from "./chrome/hextech-select.showcase";
import { hextechToggleShowcase } from "./chrome/hextech-toggle.showcase";
import { hextechTooltipShowcase } from "./chrome/hextech-tooltip.showcase";
import { homeNewsScreenShowcase } from "./chrome/home-news-screen.showcase";
import { modalFrameShowcase } from "./chrome/modal-frame.showcase";
import { newsCardShowcase } from "./chrome/news-card.showcase";
import { partyStatusPanelShowcase } from "./chrome/party-status-panel.showcase";
import { playButtonShowcase } from "./chrome/play-button.showcase";
import { playerHovercardShowcase } from "./chrome/player-hovercard.showcase";
import { profileBannerShowcase } from "./chrome/profile-banner.showcase";
import { profileChipShowcase } from "./chrome/profile-chip.showcase";
import { rankedQueuePanelShowcase } from "./chrome/ranked-queue-panel.showcase";
import { searchInputShowcase } from "./chrome/search-input.showcase";
import { sectionHeaderShowcase } from "./chrome/section-header.showcase";
import { settingsModalShowcase } from "./chrome/settings-modal.showcase";
import { settingsRowShowcase } from "./chrome/settings-row.showcase";
import { socialDockShowcase } from "./chrome/social-dock.showcase";
import { socialHeaderShowcase } from "./chrome/social-header.showcase";
import { socialPanelShowcase } from "./chrome/social-panel.showcase";
import { storyCardShowcase } from "./chrome/story-card.showcase";
import { tabBarShowcase } from "./chrome/tab-bar.showcase";
import { topNavbarShowcase } from "./chrome/top-navbar.showcase";
import { windowFrameShowcase } from "./chrome/window-frame.showcase";
import { championCardShowcase } from "./collection/champion-card.showcase";
import { championDetailShowcase } from "./collection/champion-detail.showcase";
import { emoteTileShowcase } from "./collection/emote-tile.showcase";
import { emoteWheelShowcase } from "./collection/emote-wheel.showcase";
import { profileRankedScreenShowcase } from "./collection/profile-ranked-screen.showcase";
import { runesScreenShowcase } from "./collection/runes-screen.showcase";
import { skinCardShowcase } from "./collection/skin-card.showcase";
import { statMedallionShowcase } from "./collection/stat-medallion.showcase";
import { gameModeCardShowcase } from "./lobby/game-mode-card.showcase";
import { lobbyHeaderShowcase } from "./lobby/lobby-header.showcase";
import { lobbyPlayerCardShowcase } from "./lobby/lobby-player-card.showcase";
import { matchFoundModalShowcase } from "./lobby/match-found-modal.showcase";
import { queueStatusShowcase } from "./lobby/queue-status.showcase";
import { queueTypeListShowcase } from "./lobby/queue-type-list.showcase";
import { playerBannerShowcase } from "./lobby/player-banner.showcase";
import { rolePickerPopoverShowcase } from "./lobby/role-picker-popover.showcase";
import { roleSelectorShowcase } from "./lobby/role-selector.showcase";
import { roleSlotRowShowcase } from "./lobby/role-slot-row.showcase";
import { circleSubmitButtonShowcase } from "./login/circle-submit-button.showcase";
import { loginCheckboxShowcase } from "./login/login-checkbox.showcase";
import { loginTextInputShowcase } from "./login/login-text-input.showcase";
import { socialLoginButtonsShowcase } from "./login/social-login-buttons.showcase";
import { featuredTabShowcase } from "./store/featured-tab.showcase";
import { heroCarouselShowcase } from "./store/hero-carousel.showcase";
import { storeItemTileShowcase } from "./store/store-item-tile.showcase";
import { storeSubNavBarShowcase } from "./store/store-sub-nav-bar.showcase";

/**
 * Every component registers its showcase entry here.
 * Keep sorted by area, then name.
 */
export const registry: ShowcaseEntry[] = [
  // champ-select — alphabetical: ChampionPickTile < CountdownHeader < LockInButton < SkinCarousel < SkinThumbStrip < TeamPlayerRow
  championPickTileShowcase,
  countdownHeaderShowcase,
  lockInButtonShowcase,
  skinCarouselShowcase,
  skinThumbStripShowcase,
  teamPlayerRowShowcase,
  // chrome — alphabetical: ArcadeEventTab < ChatPanel < ClubsEmptyState < ...
  arcadeEventTabShowcase,
  chatPanelShowcase,
  clubsEmptyStateShowcase,
  crestDividerShowcase,
  currencyDisplayShowcase,
  filterTabsShowcase,
  findingMatchPanelShowcase,
  friendGroupHeaderShowcase,
  friendRequestsRowShowcase,
  friendRowShowcase,
  hextechButtonShowcase,
  hextechCheckboxShowcase,
  hextechSelectShowcase,
  hextechToggleShowcase,
  hextechTooltipShowcase,
  homeNewsScreenShowcase,
  modalFrameShowcase,
  newsCardShowcase,
  partyStatusPanelShowcase,
  playButtonShowcase,
  playerHovercardShowcase,
  profileBannerShowcase,
  profileChipShowcase,
  rankedQueuePanelShowcase,
  searchInputShowcase,
  sectionHeaderShowcase,
  settingsModalShowcase,
  settingsRowShowcase,
  socialDockShowcase,
  socialHeaderShowcase,
  socialPanelShowcase,
  storyCardShowcase,
  tabBarShowcase,
  topNavbarShowcase,
  windowFrameShowcase,
  // login
  circleSubmitButtonShowcase,
  loginCheckboxShowcase,
  loginTextInputShowcase,
  socialLoginButtonsShowcase,
  // collection — alphabetical: ChampionCard < ChampionDetail < EmoteTile < EmoteWheel < ProfileRankedScreen < RunesScreen < SkinCard < StatMedallion
  championCardShowcase,
  championDetailShowcase,
  emoteTileShowcase,
  emoteWheelShowcase,
  profileRankedScreenShowcase,
  runesScreenShowcase,
  skinCardShowcase,
  statMedallionShowcase,
  // lobby — alphabetical: GameModeCard < LobbyHeader < LobbyPlayerCard < MatchFoundModal < PlayerBanner < QueueStatus < QueueTypeList < RolePickerPopover < RoleSelector < RoleSlotRow
  gameModeCardShowcase,
  lobbyHeaderShowcase,
  lobbyPlayerCardShowcase,
  matchFoundModalShowcase,
  playerBannerShowcase,
  queueStatusShowcase,
  queueTypeListShowcase,
  rolePickerPopoverShowcase,
  roleSelectorShowcase,
  roleSlotRowShowcase,
  // store — alphabetical: FeaturedTab < HeroCarousel < StoreItemTile < StoreSubNavBar
  featuredTabShowcase,
  heroCarouselShowcase,
  storeItemTileShowcase,
  storeSubNavBarShowcase,
];
