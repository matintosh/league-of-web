> **FIDELITY METHOD (applies here too):** follow docs/fidelity-method.md — (1) HYBRID: extract REAL computed styles from the live source via `node scripts/extract_styles.mjs` and build to exact values (not screenshot-only), confirm layout/variant vs the ref, diff assembled pages too; (2) REAL ASSETS: use real CDN logos/icons/crests/art via @low/fixtures helpers, not hand-drawn SVGs. Adopted 2026-08-15 after it corrected many wrong-by-guess values on /universe.

# Merch Store — Site Map & Coverage

A living **site map** of our **/merch** clone vs the real store at <https://merch.riotgames.com/>.
Goal: 1:1 with the real site — every PAGE built, real brand assets, Playwright-measured, no placeholders.

**Legend:** ✅ page live · 🔨 in progress (open issue) · ⬜ page missing · ⛔ out of scope (real commerce/auth backend)

**Status:** last updated 2026-08-09 · **9 / 9 page types live 🎉** · **30 components** shipped · **DEEP-CLONE DECLARED STRONG-CLONE / PARKED (2026-08-09, user decision "call merch strong clone, advance").** Rounds 3→6 converged deltas 180→154→138→109 (verdict "atom-level 1:1, subtly off"); the automated deep-review method then hit a reliability ceiling — reviewers disagree on what the REAL site shows and oscillate (proven: round-6 read the breadcrumb crumb as weight-600; real is weight-400, already shipped by round-4). Round-6 backlog **#931-945 + 6px-overflow #946 PARKED** under label `status:hold-review-integrity` (NOT status:ready → build-loop ignores; the "revisit-merch-later" bucket — each needs ground-truth adjudication vs the real site before it's safe to build). No more automated merch rounds. Active surface moved to **launcher** (sequential-expansion plan). Deploy is CURRENT (verified local HEAD build == prod). · mobile pixel-perfect ✅ (#618-#623) · **DEEP-CLONE ROUND 3 ✅ MERGED (2026-08-06)** — the both-live deep review (both sites side-by-side, ≥2px tolerance) drove 15 composition fixes #854-#868 (product card 460→375px rhythm, homepage feed, PDP layout/panel/related, header, collab swiper, collections index, breadcrumb, support/FAQ, hero, search art, listings, footer, gift band) **+ REAL RIOT PRODUCT PHOTOGRAPHY (#872)** — 28 products swapped from LoL champion-splash art to real merch.riotgames.com Sanity-CDN photos (user imagery-policy decision 2026-08-06; splash art gone from all merch product cards). Pre-round-3 verdict ~75% clone. Round-3 fully merged AND deployed. **DEEP-CLONE ROUND 4 ✅ MERGED (2026-08-07)** — the round-4 both-live re-review (verdict: more "close" targets than round-3, gestalt deltas 35→24) drove 15 corrective fixes #888-#902 (card GREY #f7f7f7 surface — corrected round-3's white-card mistake; homepage composition — removed invented sections + added VALORANT/Riftbound/2XKO; collab 390 double-render BUG; header real Riot fist emblem; hero strip; PDP panel/gallery/related rebuilt; per-page LOAD MORE; support tabs → plain text; search Ziggs on-screen; footer artwork; breadcrumb; collections; gift-band) + #918 marquee 390-overflow follow-up. All 16 merged to main. **Deploy-gated:** Vercel 100/day quota exhausted again (16 merges = 16 auto-builds) — prod is a few merges behind (/merch@390 scrollWidth=396 confirms #919 not yet live). **Round-5 re-review HELD until quota reset (~1 day)** so it measures the true final deployed state, not a partial one. · **desktop 1:1 fidelity pass ✅ COMPLETE** — PDP typography+proportions #627/#628 (PR #630) + listing 2-col flush redesign #629 (PR #631: real cards w/ franchise overlay + multi-badge + REFINE across all 4 pages, homepage corrected 4-col→2-col, MerchProduct badge→+badges[]+franchiseLabel). Cart = DRY. Every page measured/verified at BOTH 1280 + 390. **Real imagery ✅ SHIPPED** (#632) — uses the actual merch.riotgames.com Sanity-CDN hero banners + 8 real products (hotlink via Next remotePatterns + `merchAssetUrl` helper); champion-splash art gone from /merch. **Independent `/merch/showcase` ✅ SHIPPED** (#633) — under the /merch layout, all 22 merch components render with real merch tokens + Inter (fixed the tokenless-render bug); branded "Merch Design System" page, linked from landing hub. **Hero fixed ✅** — scrim removed (#634) + reselected to VIVID real full-art banners (#635). **Full working nav ✅ SHIPPED** (#636) — Categories/Featured dropdown menus + `/merch/sale` + mobile menu + onCategoryClick wired on EVERY page (was only Shop-All, only on 3 pages). **Collections index restructured ✅** (#637/#638, PR #639) — stacked shop-carousel strips (MerchCollectionList) matching the real /collection/, not a tile grid. **Site map now COMPREHENSIVE** — every `page.tsx` route is listed (store pages + nav-destination routes + supporting routes like /merch/showcase + the [handle] redirect). **Build-status page ✅** (#663) — public `/merch/status` renders the site map + fidelity scorecard parsed from these docs. **Homepage hero/strip unified ✅** (#664) — the franchise strip is now the hero carousel's slide-control bar (real logo SVGs extracted via Playwright, clip-path square-left first tile, 40px content gutters); MerchCategoryStrip kept but no longer rendered on the homepage. **NOTE:** #663 + #664 merged but NOT yet deployed — Vercel 100/day deploy quota exhausted; batch-deploy when it resets (~24h).

> The real store prefixes with `/` (e.g. `/product/<handle>`); our clone nests everything under
> `/merch`. This map tracks PAGES (routes) first; the component table at the bottom tracks the parts
> each page composes. Maintained by the merch loop (refreshed every tick, incl. idle).

---

## PAGES (the site map)

| Page | Real URL | Our route | Status | Composes |
|---|---|---|---|---|
| **Homepage** | `/` | `/merch` | ✅ | Header · HeroBanner (franchise strip folded IN as slide-control bar w/ real logo SVGs — #664) · ProductGrid · GiftCardBand · Footer |
| **Product detail (PDP)** | `/product/<handle>` | `/merch/product/[handle]` | ✅ (canonical; `/merch/[handle]` → 308 redirect) | Gallery · PurchasePanel · (related, accordions ⬜) |
| **Shop All** | `/shop-all/` | `/merch/shop-all` | ✅ | CollectionHero · FilterSortBar · ProductGrid |
| **Collections index** | `/collection/` | `/merch/collection` | ✅ | "All Collections" heading · MerchCollectionList (stacked shop-carousel strips) |
| **Collection / category** | `/collection/<handle>` | `/merch/collection/[handle]` | ✅ | CollectionHero · FilterSortBar · ProductGrid |
| **Cart page** | `/cart` | `/merch/cart` | ✅ | full-page cart: MerchCartPage (line items · summary · checkout) |
| **Search** | `/search` | `/merch/search` | ✅ | MerchSearchBar · results ProductGrid · empty state |
| **Info / Support pages** (FAQ / Shipping / Returns / Collectability / Accessibility / Legal / Cookies / Terms / Privacy) | `/faqs/`,`/shipping/`… | `/merch/pages/[slug]` | ✅ | MerchSupportHero + MerchSupportTabStrip (9-pill nav) + InfoPage prose (white bg, real typography — #642) |
| **Account / sign-in** | `/account` | `/merch/account` | ✅ | MerchSignInPanel — presentational sign-in stub (no real auth) |

### Nav-destination routes (header nav must reach these)
| Page | Real URL | Our route | Status | Notes |
|---|---|---|---|---|
| **Sale** | `/sale/` | `/merch/sale` | ✅ | sale-filtered listing (2 real sale items, struck price); empty-state ready |
| **Categories ▾** | nav dropdown | menu → `/merch/collection/<cat>` | ✅ | functional dropdown (Apparel/Collectibles/Accessories/Art/Home/Gaming) + mobile submenu |
| **Featured ▾** | nav dropdown | menu → `/merch/collection/<slug>` | ✅ | functional dropdown (LoL/Riftbound/Arcane/VALORANT/TFT/Esports) + mobile submenu |
| **My Shop** | `/account` (gold) | `/merch/account` | ✅ | gold nav item → account |

### Supporting routes (not store pages, but real routes in our app)
| Page | Our route | Status | Notes |
|---|---|---|---|
| **PDP legacy redirect** | `/merch/[handle]` | ✅ | 308 → `/merch/product/[handle]` (kept so old links resolve) |
| **Component showcase** | `/merch/showcase` | ✅ | independent merch design-system browser (28 components, real tokens) |
| **Showcase detail** | `/merch/showcase/[slug]` | ✅ | per-component variants |
| **Build-status page** | `/merch/status` | ✅ | public site-map + fidelity dashboard, parsed from docs (#663). NOT live until deploy quota resets |

> Every `page.tsx` under `apps/web/src/app/merch/` is represented in one of the three tables above. Store-page fidelity is tracked in `docs/merch-fidelity.md`.

## PAGES — next up (build order)

**All 9 store page types shipped + full working nav ✅.** Remaining:

1. ~~Public `sitemap.xml` + `robots.txt`~~ ✅ SHIPPED (#665, PR #666) — `app/sitemap.ts` (66 routes: 4 client + 9 static merch + 10 products + 5 collections + 13 info + 25 merch showcase, dynamic ones from @low/fixtures via new `MERCH_COLLECTION_HANDLES` export) + `app/robots.ts` (allow-all + sitemap ref). NOT live until deploy quota resets.
2. **Ongoing 1:1 fidelity polish** — the fidelity-engine meta-loop (:53) pixel-diffs each store page vs the real site and files residual deltas.

---

## COMPONENTS (the parts pages compose)

**Legend:** ✅ done · 🔨 open issue · ⬜ not started

| Component | Status | Used by |
|---|---|---|
| `MerchHeader` (real Riot logo) | ✅ | all |
| `MerchFooter` | ✅ | all |
| `MerchStore` (shell) | ✅ | all |
| `MerchHeroBanner` | ✅ | Homepage |
| `MerchProductCard` | ✅ | grids |
| `MerchProductGrid` | ✅ | Homepage, Collection, Shop All, Search |
| `MerchCollectionHero` | ✅ | Collection, Shop All |
| `MerchProductGallery` | ✅ | PDP |
| `MerchPurchasePanel` | ✅ | PDP |
| `MerchCartDrawer` | ✅ | all (header cart) |
| Category tile grid (`CategoryTileGrid` + `CategoryTile`) | ✅ | (category pages) |
| `MerchCollectionList` (stacked collection strips: banner · rotated name tab · card row) | ✅ | Collections index |
| `MerchShopCarousel` (franchise product carousel) | ✅ | PDP |
| `MerchSearchBar` · `MerchSignInPanel` · `MerchGiftCardBand` · `MerchCategoryStrip` (standalone; superseded on homepage by hero control bar) | ✅ | Search · Account · Homepage |
| `franchiseLogos` (8 real franchise wordmark SVGs, extracted via Playwright) + `MerchHeroBanner` franchise slide-control bar | ✅ | Homepage hero (#664) |
| `MerchBreadcrumbBar` (shared crumb bar: 16px black text, 40px pad, 60/40 height, optional count + REFINE; #672/#673) | ✅ | Shop All · Sale · PDP · Collection/category (replaced 4 inline copies) |
| Full working nav (dropdowns · mobile menu · `merch-nav.ts` helper) | ✅ | header (all pages) |
| `MerchFilterSortBar` (filter chips + sort dropdown) | ✅ | Collection, Shop All |
| `MerchShopCarousel` (franchise product carousel) | ✅ | PDP |
| `MerchProductInfoTabs` (Description tab below buy panel) | ✅ | PDP |
| `MerchSizeGuideModal` (apparel size table) + PurchasePanel amend | ✅ | PDP |
| Correction: homepage needs NO separate category-tile grid (hero+chip-strip+grid already matches real) | ✅ DRY | — |
| Info-page template (`MerchInfoPage`) | ✅ | Info pages |
| `MerchSupportHero` (SUPPORT h1 + mascot) · `MerchSupportTabStrip` (9-pill section nav) | ✅ | Info/Support pages |
| `MerchSupportForm` (row + lookup variants; tokened Card-of-Authenticity SVG; #667/#668) | ✅ | Info/Support form pages (order-status · gift-card-balance · verify-your-product) |
| `MerchCartPage` (full-page cart: line items table + order summary) | ✅ | Cart page |

---

## Out of scope

- Checkout flow, payment, real auth/account backend — no real commerce (presentational stubs only where a page is expected).
- Individual product/collection *instances* — we clone page *templates* + representative dummy data (champion splashes via `championSplashUrl`), not Riot's full catalog.

<!-- alias-refresh 2026-08-09: re-trigger prod build to publish round-4 tail (#864-#902,#918,#919) + #920-#930 -->
