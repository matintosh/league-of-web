import { LAUNCHER_WIDTH, LAUNCHER_HEIGHT } from "@/lib/launcher-window";

/**
 * /launcher layout — bounds the launcher to a fixed 1280×720 window centered on
 * a dark backdrop, matching the /client convention (a desktop app window, not
 * edge-to-edge browser content). LauncherShell fills this box via h-full.
 *
 * The dark --color-launcher-* tokens are available globally via
 * packages/tokens/src/theme.css (imported in the root layout via globals.css).
 */
export default function LauncherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex h-screen w-screen items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--color-launcher-bg)" }}
    >
      <div
        className="shrink-0 overflow-hidden"
        style={{ width: LAUNCHER_WIDTH, height: LAUNCHER_HEIGHT }}
      >
        {children}
      </div>
    </div>
  );
}
