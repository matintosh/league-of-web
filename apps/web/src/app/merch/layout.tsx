/**
 * /merch layout — imports the merch design token CSS so --color-merch-* variables
 * are available to the merch route and its descendants. The merch token set is
 * intentionally scoped here (not in the root layout) so it does not pollute the
 * Hextech client token namespace.
 */
import "@low/tokens/merch.css";

export default function MerchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
