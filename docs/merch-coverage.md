# Merch Store — Site Map & Coverage

A living **site map** of our **/merch** clone vs the real store at <https://merch.riotgames.com/>.
Goal: 1:1 with the real site — every PAGE built, real brand assets, Playwright-measured, no placeholders.

**Legend:** ✅ page live · 🔨 in progress (open issue) · ⬜ page missing · ⛔ out of scope (real commerce/auth backend)

**Status:** last updated 2026-08-03 · **5 / 9 page types live** · **12 components** shipped · **PR #585 merged + deployed** (collection · shop-all · cart)

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
| **Collections index** | `/collection/` | `/merch/collection` | ⬜ | CollectionHero · CategoryTileGrid ⬜ |
| **Collection / category** | `/collection/<handle>` | `/merch/collection/[handle]` | ✅ | CollectionHero · FilterSortBar · ProductGrid |
| **Cart page** | `/cart` | `/merch/cart` | ✅ | full-page cart: MerchCartPage (line items · summary · checkout) |
| **Search** | `/search` | `/merch/search` | ⬜ | SearchOverlay ⬜ · results ProductGrid |
| **Info pages** (About / FAQ / Shipping / Returns / Contact / Terms / Privacy) | `/pages/<slug>` | `/merch/pages/[slug]` | ⬜ | InfoPage template ⬜ (footer links target these) |
| **Account / sign-in** | `/account` | `/merch/account` | ⬜ / ⛔ | presentational stub only (no real auth) |

\* PDP currently lives at `/merch/[handle]`; consider moving to `/merch/product/[handle]` to match the real URL 1:1.

## PAGES — next up (build order)

1. **Collections index** `/merch/collection` — grid of category tiles (needs CategoryTileGrid)
2. **Search** `/merch/search` — search overlay + results
3. **Info pages** `/merch/pages/[slug]` — one template + About/FAQ/Shipping/Returns/Contact/Terms/Privacy content
4. **Account** `/merch/account` — presentational sign-in stub
5. PDP URL 1:1 — move `/merch/[handle]` → `/merch/product/[handle]`

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
| Category tile grid | ⬜ | Homepage, Collections index |
| `MerchFilterSortBar` (filter chips + sort dropdown) | ✅ | Collection, Shop All |
| PDP related-products carousel | ⬜ | PDP |
| PDP description accordions | ⬜ | PDP |
| Size guide modal | ⬜ | PDP |
| Search overlay | ⬜ | header |
| Info-page template | ⬜ | Info pages |
| `MerchCartPage` (full-page cart: line items table + order summary) | ✅ | Cart page |

---

## Out of scope

- Checkout flow, payment, real auth/account backend — no real commerce (presentational stubs only where a page is expected).
- Individual product/collection *instances* — we clone page *templates* + representative dummy data (champion splashes via `championSplashUrl`), not Riot's full catalog.
