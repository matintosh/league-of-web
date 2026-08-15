> **FIDELITY METHOD (applies here too):** follow docs/fidelity-method.md — (1) HYBRID: extract REAL computed styles from the live source via `node scripts/extract_styles.mjs` and build to exact values (not screenshot-only), confirm layout/variant vs the ref, diff assembled pages too; (2) REAL ASSETS: use real CDN logos/icons/crests/art via @low/fixtures helpers, not hand-drawn SVGs. Adopted 2026-08-15 after it corrected many wrong-by-guess values on /universe.

# Login Fidelity Scorecard — the 1:1 ratchet

North star: **/login is a 1:1 clone of the Riot Client login screen** vs the reference `docs/reference/riot-login-page.png` (1359×641). The `/login` route renders a bounded login window (`LOGIN_WIDTH`×`LOGIN_HEIGHT` from `apps/web/src/lib/login-window.ts`).

This scorecard is the worklist for the **login-fidelity** meta-loop (armed 2026-08-09 after launcher CONVERGED): each idle tick it picks the next surface (⬜ never-diffed first, then oldest-audited), runs a holistic side-by-side visual diff vs `riot-login-page.png`, files measured `login,status:ready` delta issues, and updates the row. The build-loop then builds them.

**Reference image:** `docs/reference/riot-login-page.png` (the Riot Client sign-in screen: full-bleed champion key-art background, centered LoL wordmark, sign-in card with username/password fields + social login row + "stay signed in" checkbox + circular arrow submit, legal footer, notice banner).

**Verdict:** ✅ pixel-match · ⚠️ deltas open (issue#s) · ⬜ never diffed

**Convergence:** when ALL rows ✅ and two full rotations file zero issues → CONVERGED. (Then, per the sequential-expansion plan, CLIENT is next.)

**Method note (learned from merch + launcher):** single-surface REFERENCE-BASED diffs (one region vs the ref image, measured with getComputedStyle/boundingBox) are the reliable ratchet. Verify seed assumptions against actual pixels before filing — launcher caught two false seed notes this way. Bias toward MATCH/DRY; do not manufacture deltas.

---

## SURFACES / REGIONS

| Surface | Our route / component | Verdict | Last diff | Notes |
|---|---|---|---|---|
| Assembled /login (whole screen) | `/login` (`apps/web/src/app/login/page.tsx`) | ⚠️ | 2026-08-10 (ldiff-login-2) | Re-verified after fixes: #961 footer (mt-[52px]/gap-[11px]) + #962 social gap (29px) LANDED ✓, all regions MATCH. ONLY open delta: **#964** wordmark icon missing (see wordmark row). Prior notes: | First diff at 1360×640: STRONG MATCH — backdrop #010a13 ✓, 33px window chrome ✓, 400px white left panel ✓, full-bleed splash ✓, text inputs 44×288 #ececec 17px-indent ✓, social row FB/Google/Apple 28px ✓, checkbox 16×16 ✓, submit 48×48 rounded-xl #c4c4c4 arrow centered ✓, no overflow ✓. **3 deltas:** #961 footer links panel-relative ~29px too high + row gap 6px vs 11px (status:ready); #962 password→social gap 20px vs 29px (status:ready); **#960 wordmark → Riot Games stacked SVG lockup — USER APPROVED 2026-08-09 (chose full 1:1 real-brand-asset over the "League of Web" signature); now status:ready.** |
| Background / splash art | `/login` (page bg layer) | ✅ | 2026-08-10 (ldiff-login-2) | Backdrop #010a13 ✓, Syndra full-bleed championSplashUrl x=400-1359 ✓, 400px white left panel ✓. MATCH. |
| Login wordmark | `RiotGamesWordmark` (`packages/ui/src/login/riot-games-wordmark.tsx`) | ✅ | 2026-08-10 (ldiff-wordmark) | Icon+text lockup SHIPPED (#964/#965): colosseum icon ~29px LEFT + RIOT/GAMES text ~63px, total 98px box (x=152, ref x=150–248), rgb(235,2,43) token-backed red, no overflow. MATCH. |
| Auth tabs | `LoginAuthTabs` | ✅ | 2026-08-10 (ldiff-login-2) | Correctly ABSENT in the current/white theme (ref has none). N/A — MATCH. |
| Text inputs | `LoginTextInput` (username + password) | ✅ | 2026-08-10 (ldiff-login-2) | 44×288px, #ececec bg, 17px indent, floating labels, 1px height delta vs ref. MATCH. |
| Social login row | `SocialLoginButtons` | ✅ | 2026-08-10 (ldiff-login-2) | FB/Google/Apple, each 28px tall / 91px wide, 8px gap. pw→social gap 29px (#962). MATCH. |
| Stay-signed-in checkbox | `LoginCheckbox` | ✅ | 2026-08-10 (ldiff-login-2) | 16×16 grey square, left-aligned label 'Keep me signed in'. MATCH. |
| Submit button | `CircleSubmitButton` | ✅ | 2026-08-10 (ldiff-login-2) | 48×48 rounded, centered on panel axis, arrow glyph. MATCH. |
| Legal footer | `LoginLegalFooter` | ✅ | 2026-08-10 (ldiff-login-2) | Footer links positioned (mt-[52px], 11px row gap #961), y≈86% proportional. MATCH. |
| Notice banner | `LoginNoticeBanner` | ✅ | 2026-08-10 (ldiff-login-2) | Correctly not rendered in the current/white theme (ref has none). MATCH. |

---

## STRUCTURAL GAPS (ranked by impact)

_None catalogued yet — the first rotation of diffs will populate this section with measured, ranked gaps._

---

## ROTATION LOG (append one line per loop tick)

- 2026-08-09 — Scorecard seeded. LOGIN-FIDELITY LOOP ARMED after launcher CONVERGED (sequential-expansion plan: merch parked → launcher done → **login now active**). Infra confirmed: `/login` route + 8 login components (#780-785/#833) + `docs/reference/riot-login-page.png` (1359×641). All rows ⬜ — next up: the assembled /login holistic diff (highest impact), then per-region.
- 2026-08-09 — Assembled /login diffed (ldiff-login-1) vs riot-login-page.png at 1360×640 → STRONG MATCH, 3 deltas. #961 (footer position mt-6→mt-[52px], gap-1.5→gap-[11px]) + #962 (social wrapper mt-1→mt-[13px]) filed status:ready (build-loop builds). #960 (replace "League of Web" wordmark span with Riot Games stacked SVG lockup) PARKED status:hold-review-integrity — this is the author's project-name signature on the login; replacing it with the real Riot lockup is a BRANDING decision for the user, not a mechanical fidelity fix. Surfaced to user. What matched DRY: backdrop/chrome/panel/splash/inputs/social/checkbox/submit all within tolerance. Next surface: after #961/#962 build, re-verify assembled or diff individual regions.
- 2026-08-10 — Assembled /login RE-VERIFY (ldiff-login-2) after #960/#961/#962 merged. #961 footer + #962 social gap CONFIRMED LANDED (MATCH). #960 wordmark PARTIAL: RIOT/GAMES text landed but the Riot Games colosseum ICON (left ~29px of the 98px mark) is missing → filed #964 (status:ready). Re-measured ALL regions: background/splash ✅, chrome ✅, inputs ✅, social ✅, checkbox ✅, submit ✅, footer ✅, notice-banner (absent, correct) ✅, no overflow ✅ — 8/9 regions now ✅, only wordmark ⚠️ (#964). Login is one fix from CONVERGED. Next: after #964 builds, re-verify wordmark → CONVERGED → client.
- 2026-08-10 — Login wordmark RE-VERIFY (ldiff-wordmark) after #964/#965 merged → MATCH/DRY, 0 issues. Colosseum icon + RIOT/GAMES text confirmed (98px box, token red, no overflow). Wordmark row ✅ — **ALL 9 REGIONS NOW ✅.** Convergence status: 1 zero-filing rotation (this one); ldiff-login-2 filed #964, so ONE more confirmatory assembled re-verify is needed to satisfy the two-consecutive-zero-rotations governor (rigor per launcher precedent + the merch 'don't declare done early' lesson). NOT yet formally CONVERGED. Next login tick: confirmatory assembled /login re-verify → if DRY → CONVERGED → arm CLIENT.
- 2026-08-10 — CONVERGENCE re-verify (assembled /login, 2nd consecutive confirmatory rotation) → MATCH/DRY, 0 issues. All 9 regions confirmed at 1360×640: background/splash (Syndra x=401), wordmark icon+text lockup (x=152, 98×25), auth-tabs-absent, inputs (288×44), social row (FB/Google/Apple 91×28), checkbox, submit (48×48), footer, notice-absent; no overflow. Two consecutive zero-filing rotations (ldiff-wordmark + this) satisfy the governor. **login-fidelity: CONVERGED — /login 1:1 within tolerance.** Per sequential-expansion plan → CLIENT is next (build client-fidelity scorecard + loop).
