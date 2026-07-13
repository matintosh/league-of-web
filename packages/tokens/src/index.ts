// Keep in sync with packages/tokens/src/theme.css — same 60 hex values.
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
  /** Darkest Hextech navy — pixel-sampled from the TFT hub dark frame (#0b0f18); used in
   *  SpellsTab right-panel fallback, StatsTab inputs, and TFT hub panels (issue #231). */
  blue8: "#0b0f18",
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
  /** PlayButton v4 hover fill top stop — XAML #1D3B4A */
  pbHoverFill: "#1d3b4a",
  /** PlayButton v6 GreenLine inner border — measured from play-button-hifi-closeup.png:
   *  reference RGB(40–47, 150–168, 170–185) ≈ #2a96b3 (issue #291, supersedes #09343d) */
  pbInnerBorder: "#2a96b3",
  statusOnline: "#00c853",
  /** Dark forest green band background for the OPEN PARTY rail block (issue #163).
   *  Pixel-sampled from docs/reference/client-lobby-solo.jpg — distinct from
   *  statusOnline (#00c853 bright lime). */
  partyBand: "#1a3a1a",
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
  /** Arcade event deep purple-navy — root gradient dark stop (issue #187) */
  arcadeBgDark: "#0d0520",
  /** Arcade event deep navy-black — root gradient deep stop (issue #187) */
  arcadeBgDeep: "#050e20",
  /** Arcade CTA bright aqua — LEARN MORE button fill (issue #240, pixel-sampled from
   *  docs/reference/client-home-arcade2019.jpg y=978–990 x=1300–1430: mean #63eee6) */
  arcadeAqua: "#63eee6",
  /** Ban phase bright border/accent red — BAN button border and BanStatusStrip X stroke (issue #275).
   *  Brick-red family; distinct from riotRed (#eb022b login CTA) and warning (#ed2c49 queue alert). */
  banRed1: "#d94444",
  /** Ban phase fill gradient top stop — BAN button enabled fill top (#c13333, issue #275) */
  banRed2: "#c13333",
  /** Ban phase fill gradient bottom stop — BAN button enabled fill bottom (#8b1f1f, issue #275) */
  banRed3: "#8b1f1f",
  /** Ban phase press/active fill — BAN button active state darkened fill (#5c1414, issue #275) */
  banRedPress: "#5c1414",
} as const;

export type Palette = typeof palette;
