/**
 * /launcher page — delegates to LauncherClient (client component).
 *
 * Server component: supplies no props. LauncherClient owns all state and
 * assembles the full launcher shell (window bar, rail, tab bar, play button,
 * overview hero, social panel). Layout passthrough — the layout.tsx shell
 * wrapper is bypassed in favour of the full self-contained client assembly.
 *
 * Closes #694.
 */

import { LauncherClient } from "./launcher-client";

export default function LauncherPage() {
  return <LauncherClient />;
}
