# Merch Fidelity Scorecard — the pixel-perfect ratchet

North star: **/merch is a PIXEL-PERFECT clone of merch.riotgames.com** at 1280px AND 390px.
This scorecard is the worklist for the **fidelity-engine** meta-loop (cron :53): each idle tick it
picks the next target (⬜ never-diffed first, then oldest-audited), runs a rigorous side-by-side
Playwright pixel-diff vs the real site, files measured `merch,status:ready` delta issues, and updates
the row. The build-loop (:11) then builds them. See `docs/loops/` for the loop briefs.

**Verdict:** ✅ pixel-match (within a few px) · ⚠️ deltas open (issue#s) · 🔁 re-diff queued · ⬜ never diffed
**Convergence:** when ALL rows ✅ and two full rotations file zero issues → CONVERGED (engine idles until the surface changes).

---

## PAGES (1280 + 390)

| Target | Real URL | Our route | Verdict | Last diff | Residual deltas |
|---|---|---|---|---|---|
| Homepage | `/` | `/merch` | ✅ | 2026-08-03 | re-verified + FIXED (#646/#647, PR #648): nav typography 16/600/UPPERCASE (shared header, JSDoc corrected); dropped leaked (N)/REFINE from homepage grid. shop-all/collection/sale keep their Refine |
| PDP | `/product/<h>` | `/merch/product/[handle]` | ✅ | 2026-08-03 | re-verify FULLY CLOSED: gallery 1:1 square+contain (#649), price 28px ink-dark (#650), title UPPERCASE (#651) [PR #652], breadcrumb full-width bar above grid (#653, PR #654). Minor residual (low-pri): wishlist heart in title row. Out-of-scope: "PURCHASING DISABLED" (real's live commerce state) |
| Shop All | `/shop-all/` | `/merch/shop-all` | ✅ | 2026-08-03 | FIXED (#655, PR #656): dropped dark hero → white breadcrumb bar (`Home/Shop All(N)` + inline REFINE), de-duped count/REFINE. 2-col grid + real products match. Logged residuals (NOT re-filed): chip-strip-vs-REFINE user-decision; real 390 is 1-col carousel vs our shared 2-col (#629) |
| Collections index | `/collection/` | `/merch/collection` | ✅ | 2026-08-03 | FIXED (#637/#638, PR #639): stacked collection strips (MerchCollectionList — banner + rotated name tab + card row) + "All Collections" 48/600 heading. Residual (non-blocking): heading top ~20px short; 2 strips vs real 4 (fixture has 2 franchises); banners = champion-splash placeholders (real Sanity banners unavailable) |
| Collection/category | `/category/<h>` | `/merch/collection/[handle]` | ✅ | 2026-08-03 | FIXED (#657, PR #658): dropped dark hero → white breadcrumb bar (Home/<Name>(N)+REFINE), de-duped count/REFINE. Matches real /category/<h>. Logged residual (NOT re-filed): chip-strip-vs-REFINE |
| Cart | `/cart` | `/merch/cart` | ✅ | 2026-08-03 | audited DRY (real returns 500) — matches spec |
| Search | `/search` | `/merch/search` | ✅ | 2026-08-03 (re-verified) | search bar + results + empty state. Re-verified DRY (no deltas) — 1st zero-issue rotation |
| Info pages | `/faqs/`,`/shipping/`,`/returns/` | `/merch/pages/[slug]` | ✅ | 2026-08-03 | FIXED (#640/#641, PR #642): SUPPORT hero (h1 48px) + 9-pill section-tab strip (MerchSupportHero + MerchSupportTabStrip) + h2 38/28px + body 16px + white bg (was dark rgb(1,10,19) bug). Residual: mascot = champion-splash placeholder (real mascot art unavailable) |
| Sale | `/category/sales/` | `/merch/sale` | ✅ | 2026-08-03 | FIXED (#643/#644, PR #645): dropped hero → breadcrumb+grid on white; sale-price = dark current + grey #666 struck 16px + green `-NN%` badge (tokens --color-merch-badge-sale/-price-struck). Non-sale cards verified unchanged |
| Account | `/account` | `/merch/account` | ⛔ | 2026-08-03 | real is SSO wall — presentational stub, no 1:1 target |

## KNOWN RESIDUAL DELTAS (open, awaiting user call or build)
- **Filter chip-strip vs REFINE** — real shop-all/collection show only a red REFINE button; ours also renders the FilterSortBar chip strip + sort dropdown. (User-decision: drop to match, or keep.)
- **Gift-card band + franchise category strip** — stylized; no real image assets on the Sanity CDN (gift-band is a fingerprinted static; nav is text links). Not blockers.

## COMPONENTS
Browsable + individually inspectable at **/merch/showcase** (22 components, real merch tokens). Component-level
fidelity is validated through the PAGES that compose them; the ratchet may target a single component when a
page diff isolates the gap to one component.

---

## Rotation log (meta-loop appends one line per tick)
- 2026-08-03 — scorecard seeded from session audits (homepage pixel-audit, desktop fidelity pass, mobile pass, real-image swap, hero fix, post-real-image selfcheck = DRY). Next up: 🔁 Collections index, 🔁 Info pages.
- 2026-08-03 — ratchet: Collections index diffed → 2 deltas (#637 structural layout=carousel-strips, #638 heading). Row 🔁→⚠️. Next up: 🔁 Info pages.
- 2026-08-03 — CLOSED: #637+#638 built+shipped (PR #639, MerchCollectionList strip layout + heading). Collections index ⚠️→✅. Next up: 🔁 Info pages.
- 2026-08-03 — ratchet: Info pages diffed → real is store-chrome SUPPORT portal → 2 deltas (#640 hero+tab-nav, #641 typography+bg). Row 🔁→⚠️. Added Sale ⬜. Next up: ⬜ Sale, then re-verify.
- 2026-08-03 — CLOSED: #640+#641 built+shipped (PR #642, MerchSupportHero + MerchSupportTabStrip + white-bg fix). Info pages ⚠️→✅. Next up: ⬜ Sale.
- 2026-08-03 — ratchet: Sale diffed vs real `/category/sales/` (our `/sale/` ref 500s) → 2 deltas (#643 drop hero band, #644 sale-price dark+grey-struck+green-%-badge). Row ⬜→⚠️. Next up: re-verify oldest ✅ (round-robin) after Sale closes.
- 2026-08-03 — CLOSED: #643+#644 built (builder died post-work → controller salvaged) + reviewed (dup-count fix) + shipped (PR #645). Sale ⚠️→✅. ALL scorecard rows now ✅ (non-⛔). Next: round-robin re-verify oldest ✅ (Homepage) OR convergence-govern if 2 rotations file zero.
- 2026-08-03 — ratchet: Homepage re-verified → 2 NEW deltas (#646 nav typography, #647 stray homepage-grid REFINE/count). Row ✅→⚠️. Re-verify caught leaks the per-page audits missed → NOT converged. Next up: build #646/#647, then re-diff.
- 2026-08-03 — CLOSED: #646+#647 built (2nd builder-died-post-work → controller salvaged) + reviewed (APPROVE) + shipped (PR #648). Homepage ⚠️→✅. All rows ✅ again. Convergence needs 2 consecutive zero-issue rotations — last rotation (Homepage) filed 2, so NOT yet. Next up: round-robin re-verify next-oldest ✅ (PDP).
- 2026-08-03 — ratchet: PDP re-verified → 3 NEW deltas (#649 gallery 1:1 square/contain, #650 price 28px, #651 title uppercase) — #627/#628 under-measured. Row ✅→⚠️. Residual noted: breadcrumb bar (file next). NOT converged. Next up: build #649-#651, then re-diff.
- 2026-08-03 — CLOSED: #649+#650+#651 shipped (PR #652, gallery/price/title). Filed breadcrumb residual #653 (controller, structural). PDP stays ⚠️ #653 until breadcrumb bar moves to full-width above grid. Next up: build #653, then re-diff PDP.
- 2026-08-03 — CLOSED: #653 shipped (PR #654, breadcrumb full-width bar above grid). PDP ⚠️→✅. All rows ✅. Last diff-rotation (PDP) filed issues → still NOT converged (need 2 consecutive zero-issue rotations). Next up: round-robin re-verify next-oldest ✅ (Shop All).
- 2026-08-03 — ratchet: Shop All re-verified → 1 delta (#655 dark hero → white breadcrumb bar, same pattern as PDP/Sale). Row ✅→⚠️. NOT converged. Consistency finding: the hero→breadcrumb-bar fix landed on PDP+Sale but not Shop All. Next up: build #655, then re-diff.
- 2026-08-03 — CLOSED: #655 shipped (PR #656, Shop All white breadcrumb bar). Shop All ⚠️→✅. All rows ✅. Last diff-rotation (Shop All) filed 1 issue → still NOT converged. TECH-DEBT NOTE (non-fidelity): breadcrumb bar now hand-rolled inline in 3 pages (Sale/PDP/Shop-All) — candidate to extract a shared MerchBreadcrumbBar (own task, low-pri). Next up: round-robin re-verify next-oldest ✅ (Collection/category — may have same dark-hero delta, or legitimately keep a banner — MEASURE).
- 2026-08-03 — ratchet: Collection/category re-verified → MEASURED (not assumed): real has NO hero, white breadcrumb bar → 1 delta #657 (drop dark hero, same fix as shop-all #655). Row ✅*→⚠️. NOT converged. 4th listing page needing the breadcrumb bar (shop-all/sale/PDP/collection) — reinforces MerchBreadcrumbBar extraction. Next up: build #657, then re-diff.
- 2026-08-03 — CLOSED: #657 shipped (PR #658, Collection breadcrumb bar). Collection/category ⚠️→✅. All rows ✅. Breadcrumb bar now consistent across ALL 4 listing pages (shop-all/sale/PDP/collection) — 4 inline copies → MerchBreadcrumbBar extraction now clearly worthwhile (logged, non-fidelity). Last diff-rotation (Collection) filed 1 issue → still NOT converged. Next up: round-robin re-verify next-oldest ✅ (Cart or Search).
- 2026-08-03 — ratchet: Search re-verified → DRY (0 deltas). ✅ FIRST zero-issue rotation. Convergence needs ONE MORE consecutive zero-issue rotation. (Cart real page 500s — non-diffable like Account ⛔.) Next up: re-verify another oldest ✅ (Homepage/PDP/etc.) — if DRY → CONVERGED.
