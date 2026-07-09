// Keep in sync with packages/tokens/src/theme.css — same 19 hex values.
/** Hextech palette as TS constants — for the rare case CSS classes can't be used (e.g. canvas). */
export const palette = {
  gold1: "#f0e6d2",
  gold2: "#c8aa6e",
  gold3: "#c89b3c",
  gold4: "#785a28",
  gold5: "#463714",
  gold6: "#32281e",
  blue1: "#cdfafa",
  blue2: "#0ac8b9",
  blue3: "#0397ab",
  blue4: "#005a82",
  blue5: "#0a323c",
  blue6: "#091428",
  blue7: "#0a1428",
  grey1: "#a09b8c",
  grey2: "#5b5a56",
  grey3: "#3c3c41",
  grey4: "#1e2328",
  greyCool: "#1e282d",
  hextechBlack: "#010a13",
} as const;

export type Palette = typeof palette;
