"use client";

export type LoginAuthTab = "sign-in" | "qr";

export interface LoginAuthTabsProps {
  /** The currently active tab. */
  active: LoginAuthTab;
  /** Called with the selected tab key when the user clicks a tab. */
  onSelect: (tab: LoginAuthTab) => void;
}

/**
 * LoginAuthTabs renders the segmented "Sign-in | QR Code" tab strip shown
 * at the top of the Classic login panel (issue #676).
 *
 * Visual spec (pixel-sampled from ref):
 * - Two tabs side-by-side, full width of the panel.
 * - Active tab: login-surface bg fill + 2px login-accent bottom border + login-ink text.
 * - Inactive tab: transparent bg + login-placeholder text.
 * - Tabs use font-body, text-sm, uppercase, tracking-wide.
 * - Icons: Sign-in uses a user silhouette; QR uses a grid symbol.
 * - All tokens — themes correctly inside .login-classic scope.
 *
 * Purely presentational — no internal state.
 */

const TABS: Array<{ key: LoginAuthTab; label: string; icon: React.ReactNode }> = [
  {
    key: "sign-in",
    label: "Sign-in",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="h-4 w-4"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simplified user silhouette */}
        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
      </svg>
    ),
  },
  {
    key: "qr",
    label: "QR Code",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="h-4 w-4"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simplified QR grid symbol */}
        <path
          fillRule="evenodd"
          d="M3 3h6v6H3V3zm1 1v4h4V4H4zm8-1h6v6h-6V3zm1 1v4h4V4h-4zM3 11h6v6H3v-6zm1 1v4h4v-4H4zm9 0h2v2h-2v-2zm0 4h2v2h-2v-2zm-2-2h2v2h-2v-2zm4-2h2v2h-2v-2zm0 4h2v2h-2v-2zm-2 0h-2v-2h2v2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

export function LoginAuthTabs({ active, onSelect }: LoginAuthTabsProps) {
  return (
    <div className="flex w-full" role="tablist" aria-label="Login method">
      {TABS.map(({ key, label, icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onSelect(key)}
            className={[
              "flex flex-1 items-center justify-center gap-2",
              "py-2.5 px-4",
              "font-body text-sm uppercase tracking-wide",
              "border-b-2 transition-colors duration-150",
              isActive
                ? [
                    "bg-login-surface",
                    "border-b-login-accent",
                    "text-login-ink",
                  ].join(" ")
                : [
                    "bg-transparent",
                    "border-b-transparent",
                    "text-login-placeholder",
                    "hover:text-login-ink",
                  ].join(" "),
            ].join(" ")}
          >
            {icon}
            {label}
          </button>
        );
      })}
    </div>
  );
}
