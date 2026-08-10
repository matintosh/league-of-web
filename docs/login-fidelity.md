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
| Assembled /login (whole screen) | `/login` (`apps/web/src/app/login/page.tsx`) | ⚠️ | 2026-08-09 (ldiff-login-1) | First diff at 1360×640: STRONG MATCH — backdrop #010a13 ✓, 33px window chrome ✓, 400px white left panel ✓, full-bleed splash ✓, text inputs 44×288 #ececec 17px-indent ✓, social row FB/Google/Apple 28px ✓, checkbox 16×16 ✓, submit 48×48 rounded-xl #c4c4c4 arrow centered ✓, no overflow ✓. **3 deltas:** #961 footer links panel-relative ~29px too high + row gap 6px vs 11px (status:ready); #962 password→social gap 20px vs 29px (status:ready); **#960 wordmark → Riot Games stacked SVG lockup — USER APPROVED 2026-08-09 (chose full 1:1 real-brand-asset over the "League of Web" signature); now status:ready.** |
| Background / splash art | `/login` (page bg layer) | ⬜ | — | Full-bleed champion key-art + scrim/overlay behind the sign-in card. Verify art source (fixtures helper), fit/position, scrim opacity. |
| LoL wordmark / logo | `LolClassicLogo` (`packages/ui/src/login/lol-classic-logo.tsx`) | ⬜ | — | Centered "LEAGUE OF LEGENDS" wordmark above the card. Verify dims, position, gold treatment. |
| Auth tabs | `LoginAuthTabs` | ⬜ | — | Sign-in / Create-account tab strip. Verify tab labels, active underline/fill, typography, spacing. |
| Text inputs | `LoginTextInput` (username + password) | ⬜ | — | Field height, padding, border, placeholder color, label, focus state, password reveal affordance. |
| Social login row | `SocialLoginButtons` | ⬜ | — | Provider button row (e.g. Xbox/Google/etc.). Verify icons, sizes, gaps, hover. |
| Stay-signed-in checkbox | `LoginCheckbox` | ⬜ | — | Checkbox + label. Verify box dims, checked state color, label typography. |
| Submit button | `CircleSubmitButton` | ⬜ | — | Circular arrow submit button. Verify diameter, arrow glyph, gold fill, disabled/enabled states. |
| Legal footer | `LoginLegalFooter` | ⬜ | — | Version string + legal links at the bottom. Verify typography, color, spacing, version format. |
| Notice banner | `LoginNoticeBanner` | ⬜ | — | Status/notice banner (e.g. "Split End Transfers Disabled"). Verify placement, bg, text, icon. |

---

## STRUCTURAL GAPS (ranked by impact)

_None catalogued yet — the first rotation of diffs will populate this section with measured, ranked gaps._

---

## ROTATION LOG (append one line per loop tick)

- 2026-08-09 — Scorecard seeded. LOGIN-FIDELITY LOOP ARMED after launcher CONVERGED (sequential-expansion plan: merch parked → launcher done → **login now active**). Infra confirmed: `/login` route + 8 login components (#780-785/#833) + `docs/reference/riot-login-page.png` (1359×641). All rows ⬜ — next up: the assembled /login holistic diff (highest impact), then per-region.
- 2026-08-09 — Assembled /login diffed (ldiff-login-1) vs riot-login-page.png at 1360×640 → STRONG MATCH, 3 deltas. #961 (footer position mt-6→mt-[52px], gap-1.5→gap-[11px]) + #962 (social wrapper mt-1→mt-[13px]) filed status:ready (build-loop builds). #960 (replace "League of Web" wordmark span with Riot Games stacked SVG lockup) PARKED status:hold-review-integrity — this is the author's project-name signature on the login; replacing it with the real Riot lockup is a BRANDING decision for the user, not a mechanical fidelity fix. Surfaced to user. What matched DRY: backdrop/chrome/panel/splash/inputs/social/checkbox/submit all within tolerance. Next surface: after #961/#962 build, re-verify assembled or diff individual regions.
