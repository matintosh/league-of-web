/**
 * /launcher page — placeholder until /launcher/overview is built.
 *
 * Renders a minimal "coming soon" content area inside the launcher shell
 * (supplied by layout.tsx). When the overview tab is implemented this page
 * can be replaced with: `redirect("/launcher/overview")`.
 */

export default function LauncherPage() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-3"
      style={{ color: "var(--color-launcher-text-muted)" }}
    >
      <p
        className="text-xs uppercase tracking-[0.3em]"
        style={{ color: "var(--color-launcher-tab-active)" }}
      >
        Coming soon
      </p>
      <h2
        className="text-2xl font-bold uppercase tracking-widest"
        style={{ color: "var(--color-launcher-text-primary)", fontFamily: "var(--font-display)" }}
      >
        Launcher
      </h2>
      <p className="text-sm" style={{ color: "var(--color-launcher-text-muted)" }}>
        Launcher tabs are being built. Check back soon.
      </p>
    </div>
  );
}
