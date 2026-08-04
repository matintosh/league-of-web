/**
 * Next.js App Router metadata route — /robots.txt
 *
 * Allows all user agents and references the canonical sitemap URL.
 * Base URL is env-driven (NEXT_PUBLIC_BASE_URL) with a sane prod default.
 */

import type { MetadataRoute } from "next";

/** Matches the base-URL constant used in sitemap.ts. */
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://league-of-web.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
