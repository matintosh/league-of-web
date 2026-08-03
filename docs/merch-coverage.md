# Merch Store — Site Map & Coverage

A living **site map** of our **/merch** clone vs the real store at <https://merch.riotgames.com/>.
Goal: 1:1 with the real site — every PAGE built, real brand assets, Playwright-measured, no placeholders.

**Legend:** ✅ page live · 🔨 in progress (open issue) · ⬜ page missing · ⛔ out of scope (real commerce/auth backend)

**Status:** last updated 2026-08-03 · **7 / 9 page types live** · **17 components** shipped · **homepage pixel-audit ✅ COMPLETE** (all 6: header·footer·Inter·gift-band·cat-strip·hero·grid — #590/#592/#595/#596/#597/#598/#602/#600/#604) · next: search #599 · account #601 · PDP-move #603

> The real store prefixes with `/` (e.g. `/product/<handle>`); our clone nests everything under
> `/merch`. This map tracks PAGES (routes) first; the component table at the bottom tracks the parts
> each page composes. Maintained by the merch loop (refreshed every tick, incl. idle).

---

## PAGES (the site map)

| Page | Real URL | Our route | Status | Composes |
|---|---|---|---|---|
| **Homepage** | `/` | `/merch` | ✅ | Header · HeroBanner · ProductGrid · Footer |
| **Product detail (PDP)** | `/product/<handle>` | `/merch/product/[handle]` * | ✅ (at `/merch/[handle]`) | Gallery · PurchasePanel · (related, accordions ⬜) |
| **Shop All** | `/shop-all/` | `/merch/shop-all` | ✅ | CollectionHero · FilterSortBar · ProductGrid |
| **Collections index** | `/collection/` | `/merch/collection` | ✅ | heading · CategoryTileGrid (3-col tile grid) |
| **Collection / category** | `/collection/<handle>` | `/merch/collection/[handle]` | ✅ | CollectionHero · FilterSortBar · ProductGrid |
| **Cart page** | `/cart` | `/merch/cart` | ✅ | full-page cart: MerchCartPage (line items · summary · checkout) |
| **Search** | `/search` | `/merch/search` | 🔨 #599 | MerchSearchBar 🔨 #599 · results ProductGrid |
| **Info pages** (FAQ / Shipping / Returns / Collectability / Accessibility / Legal / Cookies / Terms / Privacy) | `/pages/<slug>` | `/merch/pages/[slug]` | ✅ | InfoPage template (9 slugs, footer links wired + resolve 200) |
| **Account / sign-in** | `/account` | `/merch/account` | 🔨 #601 | MerchSignInPanel 🔨 #601 — presentational stub (no real auth) |

\* PDP currently lives at `/merch/[handle]`; 🔨 #603 moves canonical to `/merch/product/[handle]` (old path → permanentRedirect) to match the real URL 1:1.

## PAGES — next up (build order)

1. ~~Homepage pixel-audit~~ ✅ DONE — all 6 issues shipped + deployed (#590/#592/#595/#596/#597/#598/#602/#600/#604)
2. **Search** `/merch/search` — 🔨 #599 (MerchSearchBar + results grid) — *spec inferred, Playwright-verify at build*
3. **Account** `/merch/account` — 🔨 #601 (MerchSignInPanel stub) — *spec inferred, Playwright-verify at build*
4. **PDP URL 1:1** — 🔨 #603 (`/merch/product/[handle]` canonical + redirect)

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
| Category tile grid (`CategoryTileGrid` + `CategoryTile`) | ✅ | Homepage, Collections index |
| `MerchFilterSortBar` (filter chips + sort dropdown) | ✅ | Collection, Shop All |
| PDP related-products carousel | ⬜ | PDP |
| PDP description accordions | ⬜ | PDP |
| Size guide modal | ⬜ | PDP |
| Search overlay | ⬜ | header |
| Info-page template (`MerchInfoPage`) | ✅ | Info pages |
| `MerchCartPage` (full-page cart: line items table + order summary) | ✅ | Cart page |

---

## Out of scope

- Checkout flow, payment, real auth/account backend — no real commerce (presentational stubs only where a page is expected).
- Individual product/collection *instances* — we clone page *templates* + representative dummy data (champion splashes via `championSplashUrl`), not Riot's full catalog.
