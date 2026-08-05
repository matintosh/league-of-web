import type { ShowcaseEntry } from "../showcase";
import { LauncherShell } from "./launcher-shell";

/** Placeholder slot content — labeled boxes for each slot. Server-safe (no 'use client'). */
function SlotPlaceholder({
  label,
  bg,
  height = "h-full",
}: {
  label: string;
  bg: string;
  height?: string;
}) {
  return (
    <div
      className={`flex ${height} w-full items-center justify-center`}
      style={{ backgroundColor: bg, color: "var(--color-launcher-text-muted)", fontSize: 11 }}
    >
      <span className="uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}

export const launcherShellShowcase: ShowcaseEntry = {
  slug: "launcher-shell",
  name: "LauncherShell",
  area: "launcher",
  description:
    "Foundation 3-column shell for the /launcher section: optional 28px window bar, 56px left icon rail, flex-1 center content, 280px right social panel. Uses --color-launcher-* tokens (issue #679). Individual rail/tab/social components slot in as children.",
  variants: [
    {
      name: "Full shell — window bar + all slots",
      notes:
        "windowBar provided → 28px top bar rendered. Slots show labeled placeholders at actual column widths.",
      render: () => (
        <div style={{ height: 480 }}>
          <LauncherShell
            windowBar={
              <SlotPlaceholder
                label="Window Bar"
                bg="var(--color-launcher-bg)"
                height="h-[28px]"
              />
            }
            rail={
              <SlotPlaceholder label="Rail" bg="var(--color-launcher-rail-bg)" />
            }
            socialPanel={
              <SlotPlaceholder label="Social Panel" bg="var(--color-launcher-panel-bg)" />
            }
          >
            <SlotPlaceholder label="Content Area" bg="var(--color-launcher-content-bg)" />
          </LauncherShell>
        </div>
      ),
    },
    {
      name: "Shell — no window bar",
      notes: "windowBar omitted → bar element not rendered; 3-column body fills full height.",
      render: () => (
        <div style={{ height: 480 }}>
          <LauncherShell
            rail={
              <SlotPlaceholder label="Rail" bg="var(--color-launcher-rail-bg)" />
            }
            socialPanel={
              <SlotPlaceholder label="Social Panel" bg="var(--color-launcher-panel-bg)" />
            }
          >
            <SlotPlaceholder label="Content Area" bg="var(--color-launcher-content-bg)" />
          </LauncherShell>
        </div>
      ),
    },
  ],
};
