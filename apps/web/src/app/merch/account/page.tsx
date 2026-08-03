import { AccountPageClient } from "./account-page-client";

/**
 * /merch/account — sign-in stub page.
 *
 * The real merch.riotgames.com/en-us/account redirects to Riot SSO before
 * rendering any content, so this page clones the presentational page shell:
 * MerchHeader + centered MerchSignInPanel + MerchFooter.
 *
 * Interactive state (sign-in routing, track-order routing) is delegated to
 * AccountPageClient so this server component remains a thin shell.
 *
 * Merch tokens (--color-merch-*) are provided by the /merch layout.
 */
export default function AccountPage() {
  return <AccountPageClient />;
}
