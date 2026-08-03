/**
 * /merch/[handle] — permanent redirect to the canonical PDP URL.
 * The new canonical path is /merch/product/[handle] (1:1 with merch.riotgames.com).
 * All existing links (product cards, showcase entries, cart) continue to work
 * via this 308 redirect.
 *
 * Static sibling segments (/merch/cart, /merch/shop-all, /merch/collection,
 * /merch/pages) are resolved by Next.js before this dynamic catch before this
 * dynamic [handle] segment and are unaffected.
 */
import { permanentRedirect } from "next/navigation";

interface Props {
  params: Promise<{ handle: string }>;
}

export default async function MerchHandleRedirect({ params }: Props) {
  const { handle } = await params;
  permanentRedirect(`/merch/product/${handle}`);
}
