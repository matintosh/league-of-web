"use client";

/**
 * AccountPageClient — client shell for /merch/account.
 * Holds interactive routing: sign-in → no-op stub, track order → /merch/pages/order-lookup.
 */

import { useRouter } from "next/navigation";
import { MerchHeader, MerchFooter, MerchSignInPanel } from "@low/ui";

/** /merch/account interactive page shell. */
export function AccountPageClient() {
  const router = useRouter();

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundColor: "var(--color-merch-bg)",
        fontFamily: "var(--font-merch)",
      }}
    >
      <MerchHeader
        activeCategory="account"
        onSignIn={() => router.push("/merch/account")}
        onLogoClick={() => router.push("/merch")}
        onCategoryClick={(slug) => {
          if (slug === "shop-all") router.push("/merch/shop-all");
          else router.push(`/merch/${slug}`);
        }}
      />

      <main className="flex flex-1 items-start justify-center py-20 px-6">
        <div className="w-full max-w-7xl">
          <MerchSignInPanel
            onSignIn={() => {
              // No real auth — stub (presentational only)
            }}
            onTrackOrder={() => router.push("/merch/pages/order-lookup")}
            onTerms={() => router.push("/merch/pages/terms")}
            onPrivacy={() => router.push("/merch/pages/privacy")}
          />
        </div>
      </main>

      <MerchFooter />
    </div>
  );
}
