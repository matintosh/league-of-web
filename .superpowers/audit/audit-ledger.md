# Pixel-perfect audit ledger (shared by auditor-screens + auditor-details)
Append-only. Before filing ANY issue: check this ledger AND `gh issue list --state open` for duplicates.

## Scope rules
- CLIENT ONLY. In-game HUD references are OUT (skip: loading, tutorial, buy-items, scoreboard, rampage, spell-hover, victory, exit-now, champion-abilities in-game video zone).
- Compare against PROD: https://league-of-web.vercel.app (1280x720 viewport for client pages; the /showcase for components).
- Issues must be dispatch briefs (see .claude/skills/new-issue/SKILL.md): reference image committed/linked, measured deltas not adjectives, props sketches for new components, acceptance criteria, labels type:component/enhancement + area:* + status:ready + priority.
- Max 3 issues per agent per cycle. Quality over volume.
- Known divergences (do NOT re-file): chroma renders (no CDN assets — color-dot stand-ins documented), emote art (profileIconUrl stand-ins), Google glyph single-color, wing PNG res on platinum/emerald (CDN artifact), banner-tip filigree arc (noted out of scope in #167), gear window-control missing (ledger'd follow-up candidate), medallion ratio (in flight #168/#169).

## Reference coverage map (gallery: https://interfaceingame.com/games/league-of-legends/)
URL pattern: https://interfaceingame.com/wp-content/uploads/league-of-legends/league-of-legends-<slug>-1920x1080.jpg (browser UA required)
- USED/covered by shipped issues: pvp (mode-select #92-94, rail #138, topbar #139), lobby (#153-155,#162-164,#168), match-found (#39-41), choose-your-champion (#132), choose-your-loadout (#86-90,#123), champions (collection #63-67), skins (#84-85), profile-overview (#141), champion-overview + abilities tab (#142), chromas (#143), emotes (#144), game-stats (social #95-99), main-menu (#145), clubs (dead tab only — full clubs page UNFILED).
- UNAUDITED or partially covered: main-menu deep details, any newly published shots.
- NEWLY COVERED (2026-07-12 cycle): featured (#171 filed), clubs (#170 filed), arcade (#172 filed).

## Open issues at seed time (2026-07-12): #168/#169 medallion (in flight). Everything else closed.
## Updated after cycle (2026-07-12): #170 clubs, #171 store-featured, #172 home-arcade2019 filed.
## Updated after cycle (2026-07-12, auditor-details): #180 TopNavbar active indicator wrong side filed.

## Findings log (append below: date | agent | reference | finding | action issue# or SKIPPED-dup/known)
2026-07-12 | auditor-screens | clubs (interfaceingame profile-clubs) | Profile > CLUBS tab entirely disabled; ClubsEmptyState screen ("JOIN CLUBS WITH YOUR FRIENDS", 3-col feature strip, CREATE CLUB CTA) completely absent | FILED #170
2026-07-12 | auditor-screens | featured (interfaceingame store-featured) | Entire Store section missing: no store sub-nav (FEATURED/CHAMPIONS/SKINS/LOOT/EMOTES/ACCESSORIES/ESPORTS), no hero carousel, no item grid, no PURCHASE RP button | FILED #171
2026-07-12 | auditor-screens | arcade (interfaceingame home-arcade2019) | Home > ARCADE 2019 tab present in sub-nav but disabled; ArcadeEventTab screen (skin grid, Arcade Pass panel, trailer tile) absent | FILED #172
2026-07-12 | controller (user-reported) | queue-in-lobby refs (client-queue-in-lobby.png, client-finding-match-widget.png, client-find-match-button.png) | Queue is a lobby STATE not a screen: FindingMatchPanel rail widget #173, queue-in-lobby rework #174 (retires MatchmakingScreen), LockInButton trapezoid geometry #175. Do NOT re-file queue-flow, find-match-button-shape, or rail-queue-indicator findings while these are open.
2026-07-12 | controller (user-reported) | client-role-picker.png | Role picker popover (was out-of-scope in #153/#155) now specced — do not re-file role-picker findings | FILED #178
2026-07-12 | auditor-details | main-menu (interfaceingame main-menu-1920x1080.jpg → docs/reference/client-main-menu.jpg) | TopNavbar active tab indicator uses border-t-2 pt-0.5 (overline above text, gold #c89b3c sampled at y=45–46 in live at 1280×720, HOME button DOM rect.t=45); reference shows gold line BELOW the text (bottom underline). Component: packages/ui/src/chrome/top-navbar.tsx:65. Fix: change border-t-2 pt-0.5 → border-b-2 pb-0.5 | FILED #180
