import type { ShowcaseEntry } from "./showcase";
import { currencyDisplayShowcase } from "./chrome/currency-display.showcase";
import { hextechButtonShowcase } from "./chrome/hextech-button.showcase";
import { playerHovercardShowcase } from "./chrome/player-hovercard.showcase";
import { topNavbarShowcase } from "./chrome/top-navbar.showcase";
import { windowFrameShowcase } from "./chrome/window-frame.showcase";

/**
 * Every component registers its showcase entry here.
 * Keep sorted by area, then name.
 */
export const registry: ShowcaseEntry[] = [currencyDisplayShowcase, hextechButtonShowcase, playerHovercardShowcase, topNavbarShowcase, windowFrameShowcase];
