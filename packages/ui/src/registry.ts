import type { ShowcaseEntry } from "./showcase";
import { currencyDisplayShowcase } from "./chrome/currency-display.showcase";
import { hextechButtonShowcase } from "./chrome/hextech-button.showcase";
import { hextechToggleShowcase } from "./chrome/hextech-toggle.showcase";
import { hextechTooltipShowcase } from "./chrome/hextech-tooltip.showcase";
import { modalFrameShowcase } from "./chrome/modal-frame.showcase";
import { playerHovercardShowcase } from "./chrome/player-hovercard.showcase";
import { settingsModalShowcase } from "./chrome/settings-modal.showcase";
import { settingsRowShowcase } from "./chrome/settings-row.showcase";
import { tabBarShowcase } from "./chrome/tab-bar.showcase";
import { topNavbarShowcase } from "./chrome/top-navbar.showcase";
import { windowFrameShowcase } from "./chrome/window-frame.showcase";

/**
 * Every component registers its showcase entry here.
 * Keep sorted by area, then name.
 */
export const registry: ShowcaseEntry[] = [currencyDisplayShowcase, hextechButtonShowcase, hextechToggleShowcase, hextechTooltipShowcase, modalFrameShowcase, playerHovercardShowcase, settingsModalShowcase, settingsRowShowcase, tabBarShowcase, topNavbarShowcase, windowFrameShowcase];
