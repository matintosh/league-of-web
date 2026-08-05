/**
 * /launcher layout — composes LauncherShell with empty slot placeholders so the
 * dark launcher palette is applied to every route under /launcher/. Individual
 * rail, social-panel, and window-bar components (built in subsequent issues) will
 * replace the placeholder divs once available.
 *
 * The --color-launcher-* tokens live in the main theme.css (not a separate file
 * like /merch uses for merch.css) because the launcher is an in-client section
 * that shares the Hextech token namespace. No separate CSS import is needed here.
 */

import { LauncherShell } from "@low/ui";

export default function LauncherLayout({ children }: { children: React.ReactNode }) {
  return (
    <LauncherShell
      rail={
        /* Rail placeholder — replaced by LauncherIconRail in a follow-up issue */
        <div className="h-full w-full" style={{ backgroundColor: "var(--color-launcher-rail-bg)" }} />
      }
      socialPanel={
        /* Social panel placeholder — replaced by LauncherSocialPanel in a follow-up issue */
        <div className="h-full w-full" style={{ backgroundColor: "var(--color-launcher-panel-bg)" }} />
      }
    >
      {children}
    </LauncherShell>
  );
}
