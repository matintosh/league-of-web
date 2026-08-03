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
| Homepage | `/` | `/merch` | ✅ | 2026-08-03 | header/footer/hero/grid pixel-audited; real hero+products; scrim removed |
| PDP | `/product/<h>` | `/merch/product/[handle]` | ✅ | 2026-08-03 | typography #627 + gallery 62/38 #628 shipped; real gallery+carousel |
| Shop All | `/shop-all/` | `/merch/shop-all` | ✅* | 2026-08-03 | 2-col flush + real 8 products. *open: chip-strip still shown where real = REFINE only |
| Collections index | `/collection/` | `/merch/collection` | ✅ | 2026-08-03 | FIXED (#637/#638, PR #639): stacked collection strips (MerchCollectionList — banner + rotated name tab + card row) + "All Collections" 48/600 heading. Residual (non-blocking): heading top ~20px short; 2 strips vs real 4 (fixture has 2 franchises); banners = champion-splash placeholders (real Sanity banners unavailable) |
| Collection/category | `/collection/<h>` | `/merch/collection/[handle]` | ✅* | 2026-08-03 | same 2-col template; *chip-strip vs REFINE |
| Cart | `/cart` | `/merch/cart` | ✅ | 2026-08-03 | audited DRY (real returns 500) — matches spec |
| Search | `/search` | `/merch/search` | ✅ | 2026-08-03 | search bar + results + empty state |
| Info pages | `/faqs/`,`/shipping/`,`/returns/` | `/merch/pages/[slug]` | ⚠️ #640 #641 | 2026-08-03 | RESOLVED: real = store-chrome SUPPORT portal (not Zendesk). Missing SUPPORT hero + section-tab nav → #640; h2 17→38px, body 14→16px, page bg DARK rgb(1,10,19)→white → #641. Real URL is `/en-us/faqs/`, not `/pages/faqs` |
| Sale | `/sale/` | `/merch/sale` | ⬜ | never | new route (nav build) — never diffed; queue for ratchet |
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
