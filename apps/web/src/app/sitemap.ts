/**
 * Next.js App Router metadata route — /sitemap.xml
 *
 * Enumerates every public route in the app so crawlers have a canonical
 * route list. Dynamic entries (products, collections, info pages, merch
 * showcase slugs) are sourced exclusively from @low/fixtures and the
 * shared UI registry — never hardcoded or refetched at runtime.
 *
 * Base URL is env-driven: set NEXT_PUBLIC_BASE_URL in your environment or
 * Vercel project settings. Falls back to the production Vercel URL.
 */

import type { MetadataRoute } from "next";
import {
  MERCH_PRODUCTS,
  MERCH_COLLECTION_HANDLES,
  MERCH_INFO_PAGES,
} from "@low/fixtures";
import { registry } from "@low/ui/registry";

/** Single base-URL constant — all absolute URLs are built from this. */
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://league-of-web.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  // ---------------------------------------------------------------------------
  // Static client routes
  // ---------------------------------------------------------------------------
  const staticClientRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/client`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/login`, changeFrequency: "monthly", priority: 0.6 },
    {
      url: `${BASE_URL}/showcase`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // ---------------------------------------------------------------------------
  // Static merch routes
  // ---------------------------------------------------------------------------
  const staticMerchRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/merch`, changeFrequency: "daily", priority: 0.9 },
    {
      url: `${BASE_URL}/merch/shop-all`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/merch/sale`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/merch/collection`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/merch/cart`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/merch/search`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/merch/account`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/merch/status`,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/merch/showcase`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  // ---------------------------------------------------------------------------
  // Dynamic merch product routes — one entry per product from MERCH_PRODUCTS
  // ---------------------------------------------------------------------------
  const productRoutes: MetadataRoute.Sitemap = MERCH_PRODUCTS.map((p) => ({
    url: `${BASE_URL}/merch/product/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // ---------------------------------------------------------------------------
  // Dynamic merch collection routes — from MERCH_COLLECTION_HANDLES
  // ---------------------------------------------------------------------------
  const collectionRoutes: MetadataRoute.Sitemap = MERCH_COLLECTION_HANDLES.map(
    (handle) => ({
      url: `${BASE_URL}/merch/collection/${handle}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  // ---------------------------------------------------------------------------
  // Dynamic info-page routes — from MERCH_INFO_PAGES (keys only; unknown slugs 404)
  // ---------------------------------------------------------------------------
  const infoPageRoutes: MetadataRoute.Sitemap = Object.keys(
    MERCH_INFO_PAGES
  ).map((slug) => ({
    url: `${BASE_URL}/merch/pages/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // ---------------------------------------------------------------------------
  // Dynamic merch showcase routes — registry entries with area === "merch"
  // ---------------------------------------------------------------------------
  const merchShowcaseRoutes: MetadataRoute.Sitemap = registry
    .filter((e) => e.area === "merch")
    .map((e) => ({
      url: `${BASE_URL}/merch/showcase/${e.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  return [
    ...staticClientRoutes,
    ...staticMerchRoutes,
    ...productRoutes,
    ...collectionRoutes,
    ...infoPageRoutes,
    ...merchShowcaseRoutes,
  ];
}
