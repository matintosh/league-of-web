// Keep in sync with packages/tokens/src/theme.css — same 64 hex values.
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
  /** Pure white — hairline dividers/borders at low opacity (#529). */
  white: "#ffffff",
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
  /** FIND MATCH / LOCK IN idle fill top stop (#331) — see theme.css @theme comment */
  tealGradFmA: "#104258",
  /** FIND MATCH / LOCK IN idle fill bottom stop (#331) */
  tealGradFmB: "#0fbdd6",
  /** FIND MATCH / LOCK IN idle border (#331) */
  tealFmBorder: "#138fb4",
  /** FIND MATCH / LOCK IN idle glow (#331) */
  tealFmGlow: "#127ea0",
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
  /** Honor celebration crest green — peak honor-crest green from the "CHECKPOINT REACHED"
   *  overlay (issue #360), pixel-sampled from docs/reference/client-honor-checkpoint-celebration.png. */
  honorGreen: "#36f532",
  /** Honor crest gold-green highlight — the bright rim on the crest gems (issue #360). */
  honorGreenBright: "#7dffa0",
  /** Honor celebration backdrop — deep green-black forest base for the overlay gradient (issue #360). */
  honorForest: "#0d2417",
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
  // Launcher dark palette — sampled from lol-launcher-ref/image.png (issue #679)
  /** Outermost shell / behind rail */
  launcherBg: "#0e1015",
  /** Left icon rail surface */
  launcherRailBg: "#13151a",
  /** Right social panel surface */
  launcherPanelBg: "#1a1c22",
  /** Panel account header row */
  launcherPanelHeader: "#1e2028",
  /** Center content area dark base */
  launcherContentBg: "#11131a",
  /** Subtle 1px panel borders */
  launcherBorder: "#2a2c35",
  /** Intra-panel section separators */
  launcherDivider: "#22242c",
  /** Main labels / name text */
  launcherTextPrimary: "#e8e6e1",
  /** Secondary / status text */
  launcherTextMuted: "#7b7d8a",
  /** Offline / disabled text */
  launcherTextDim: "#4a4c58",
  /** Tab active underline — same hex as gold-2 */
  launcherTabActive: "#c8aa6e",
  /** Icon rail active indicator — same hex as gold-3 */
  launcherRailActive: "#c89b3c",
  /** Window close button hover — deep brick-red (distinct from warning #ed2c49;
   *  sampled from Riot launcher close-btn hover, issue #696). */
  launcherCloseHover: "#c0392b",
  /** Search field background — matches shell bg */
  launcherInputBg: "#0e1015",
  /** Search field border — matches launcher-border */
  launcherInputBorder: "#2a2c35",
  /** LauncherPlayButton: light warm gold — Play pill top stop (issue #741) */
  launcherPlayPillFrom: "#D3AB5D",
  /** LauncherPlayButton: light warm gold — Play pill bottom stop (issue #741) */
  launcherPlayPillTo: "#DBB672",
  /** LauncherPlayButton: dark muted olive-gold — detached caret pill fill (issue #741) */
  launcherCaretPill: "#44391C",
  /** LauncherPlayButton: red — selected game mode row text in dropdown (issue #741) */
  launcherSelectedMode: "#BC5556",
  /** LauncherPlayButton: flat near-black — dropdown panel bg (issue #741) */
  launcherDropdownBg: "#1F1F1F",
} as const;

export type Palette = typeof palette;

/**
 * Hextech motion presets (issue #299) — duration + easing pairs mirroring
 * Riot's shared-mixin approach so all client motion "feels Hextech". Exposed
 * as CSS custom properties in theme.css (`--motion-soft`, etc.); these TS
 * constants are the rare-case escape hatch (e.g. Web Animations API / canvas).
 *
 * Three-way sync: these 3 values must stay identical to the `--motion-*`
 * custom properties in BOTH blocks of packages/tokens/src/theme.css.
 */
export const motion = {
  /** Settle — soft ease-out, ~400-500ms (pieces settling into place). */
  soft: "450ms cubic-bezier(0.22, 1, 0.36, 1)",
  /** Attention — sharp overshoot snap, ~200ms (ready check, alerts). */
  snap: "200ms cubic-bezier(0.5, 0, 0.2, 1.4)",
  /** Crossfade — video state-machine intro/loop/outro blend, 200-300ms. */
  crossfade: "250ms cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export type Motion = typeof motion;
