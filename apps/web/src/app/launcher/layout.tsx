/**
 * /launcher layout — passthrough wrapper.
 *
 * The full LauncherShell (with rail, social panel, window bar) is assembled by
 * LauncherClient in page.tsx, not the layout. This passthrough exists so Next.js
 * still has a layout file for the /launcher segment. The dark --color-launcher-*
 * tokens are available globally via packages/tokens/src/theme.css (already
 * imported in the root layout via globals.css) — no additional CSS import needed.
 */

export default function LauncherLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
