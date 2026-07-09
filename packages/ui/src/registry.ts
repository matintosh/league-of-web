import type { ShowcaseEntry } from "./showcase";
import { hextechButtonShowcase } from "./chrome/hextech-button.showcase";
import { windowFrameShowcase } from "./chrome/window-frame.showcase";

/**
 * Every component registers its showcase entry here.
 * Keep sorted by area, then name.
 */
export const registry: ShowcaseEntry[] = [hextechButtonShowcase, windowFrameShowcase];
