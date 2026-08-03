# Merch Store — Site Map & Coverage

A living **site map** of our **/merch** clone vs the real store at <https://merch.riotgames.com/>.
Goal: 1:1 with the real site — every PAGE built, real brand assets, Playwright-measured, no placeholders.

**Legend:** ✅ page live · 🔨 in progress (open issue) · ⬜ page missing · ⛔ out of scope (real commerce/auth backend)

**Status:** last updated 2026-08-03 · **9 / 9 page types live 🎉** · **22 components** shipped · site map COMPLETE + PDP depth shipped (info-tabs #615 · shop-carousel #616 · size-guide #617). **NOW IN PROGRESS: MOBILE pixel-perfect pass** (user bar expanded — every page must match real mobile at ~390px; audit-mobile sweeping).

> The real store prefixes with `/` (e.g. `/product/<handle>`); our clone nests everything under
> `/merch`. This map tracks PAGES (routes) first; the component table at the bottom tracks the parts
> each page composes. Maintained by the merch loop (refreshed every tick, incl. idle).

---

## PAGES (the site map)

| Page | Real URL | Our route | Status | Composes |
|---|---|---|---|---|
| **Homepage** | `/` | `/merch` | ✅ | Header · HeroBanner · ProductGrid · Footer |
| **Product detail (PDP)** | `/product/<handle>` | `/merch/product/[handle]` | ✅ (canonical; `/merch/[handle]` → 308 redirect) | Gallery · PurchasePanel · (related, accordions ⬜) |
| **Shop All** | `/shop-all/` | `/merch/shop-all` | ✅ | CollectionHero · FilterSortBar · ProductGrid |
| **Collections index** | `/collection/` | `/merch/collection` | ✅ | heading · CategoryTileGrid (3-col tile grid) |
| **Collection / category** | `/collection/<handle>` | `/merch/collection/[handle]` | ✅ | CollectionHero · FilterSortBar · ProductGrid |
| **Cart page** | `/cart` | `/merch/cart` | ✅ | full-page cart: MerchCartPage (line items · summary · checkout) |
| **Search** | `/search` | `/merch/search` | ✅ | MerchSearchBar · results ProductGrid · empty state |
| **Info pages** (FAQ / Shipping / Returns / Collectability / Accessibility / Legal / Cookies / Terms / Privacy) | `/pages/<slug>` | `/merch/pages/[slug]` | ✅ | InfoPage template (9 slugs, footer links wired + resolve 200) |
| **Account / sign-in** | `/account` | `/merch/account` | ✅ | MerchSignInPanel — presentational sign-in stub (no real auth) |

## PAGES — next up (build order)

**All 9 page types shipped.** Remaining is depth/fidelity, not new pages:

1. **PDP sub-components** — related-products carousel · description accordions · size-guide modal (PDP `related, accordions ⬜`)
2. **Homepage category-tile grid** — the `CategoryTileGrid` also belongs on the homepage (real store shows category tiles there)
3. **Ongoing 1:1 fidelity polish** — periodic Playwright audits of each page vs the real store (like the homepage pixel-audit) to close residual pixel gaps

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
| `MerchShopCarousel` (franchise product carousel) | ✅ | PDP |
| `MerchProductInfoTabs` (Description tab below buy panel) | ✅ | PDP |
| `MerchSizeGuideModal` (apparel size table) + PurchasePanel amend | ✅ | PDP |
| Correction: homepage needs NO separate category-tile grid (hero+chip-strip+grid already matches real) | ✅ DRY | — |
| Info-page template (`MerchInfoPage`) | ✅ | Info pages |
| `MerchCartPage` (full-page cart: line items table + order summary) | ✅ | Cart page |

---

## Out of scope

- Checkout flow, payment, real auth/account backend — no real commerce (presentational stubs only where a page is expected).
- Individual product/collection *instances* — we clone page *templates* + representative dummy data (champion splashes via `championSplashUrl`), not Riot's full catalog.
