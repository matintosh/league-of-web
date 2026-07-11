// Keep in sync with packages/tokens/src/theme.css — same 49 hex values.
/** Hextech palette as TS constants — for the rare case CSS classes can't be used (e.g. canvas). */
export const palette = {
  gold1: "#f0e6d2",
  gold2: "#c8aa6e",
  gold3: "#c89b3c",
  gold4: "#785a28",
  gold5: "#463714",
  gold6: "#32281e",
  goldCream: "#cdbe91",
  goldCoin: "#deb53c",
  /** Riot production secondary button border gradient stops (issue #61) */
  goldBorderDark: "#72542a",
  goldBorderLight: "#bd9e5e",
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
  /** Secondary button fill on hover (issue #61) */
  greyHover: "#272e33",
  hextechBlack: "#010a13",
  tealFrame: "#0b4052",
  tealRing: "#167786",
  navySwirl: "#082640",
  tealGradA: "#0593a7",
  tealGradB: "#026f8f",
  tealGradHoverA: "#91e1dc",
  tealGradHoverB: "#0c9ca1",
  tealGradHoverC: "#1f9ebd",
  tealGradPressA: "#0d3f4b",
  tealGradPressB: "#025577",
  /** PlayButton v4 XAML default bar stroke top stop (80% alpha applied in CSS) */
  cyan1: "#3fe7ff",
  /** PlayButton v4 XAML hover bar stroke top stop */
  cyan2: "#aff5ff",
  /** PlayButton v4 XAML hover bar stroke mid stop */
  cyan3: "#46e6ff",
  /** PlayButton v4 XAML hover bar stroke bottom stop */
  cyan4: "#00add4",
  /** PlayButton v4 GoldLine frame bg (#00070E dark near-black) */
  pbOuterBg: "#00070e",
  /** PlayButton v4 GoldLine frame border (dark bronze) */
  pbOuterBorder: "#34291e",
  statusOnline: "#00c853",
  /** Warning/alert accent — queue-type-list warning triangle, pixel-sampled from client-pvp-mode-select.jpg (issue #80) */
  warning: "#ed2c49",
  // Login — light-theme palette (issue #100, pixel-sampled from docs/reference/riot-login-page.png)
  /** Riot brand red — focus border, checked fill, enabled button bg */
  riotRed: "#eb022b",
  /** Login page background (pure white) */
  loginBg: "#ffffff",
  /** Login input/checkbox surface fill */
  loginSurface: "#ececec",
  /** Floating label and disabled-button arrow color */
  loginPlaceholder: "#a7a7b7",
  /** Login body text color */
  loginInk: "#343434",
  /** Facebook brand button (normalized canonical value) */
  brandFacebook: "#1877f2",
  /** Login page text/icon black */
  loginBlack: "#000000",
} as const;

export type Palette = typeof palette;
