"use client";

export type Provider = "facebook" | "google" | "apple" | "xbox" | "playstation";

export interface SocialLoginButtonsProps {
  /**
   * Called with the provider key when the user clicks a brand button.
   */
  onProvider?: (p: Provider) => void;
  /**
   * Which providers to render, in order. Defaults to the current three
   * (facebook, google, apple) so existing uses are unaffected.
   * Classic theme passes ["facebook","google","apple","xbox","playstation"].
   */
  providers?: Provider[];
}

/**
 * SocialLoginButtons renders the row of equal-width brand sign-in buttons
 * shown below the username/password form on Riot's login page.
 *
 * Visual spec (from docs/reference/riot-login-page.png + issue #101):
 * - Three buttons side-by-side (default), each ~36px tall, square corners.
 * - Facebook: bg-brand-facebook (#1877f2), white simplified "f" glyph.
 * - Google:   bg-login-bg (white), 1px login-surface border, "G" in login-ink.
 *   NOTE: Google's 4-colour mark is a registered trademark; this uses a plain
 *   single-colour "G" silhouette to avoid trademark issues.
 * - Apple:    bg-login-black (#000000), white simplified apple silhouette.
 * - Xbox:     bg-brand-xbox (#107c10), white "X" glyph — simplified original.
 * - PlayStation: bg-brand-playstation (#003791), white "PS" text — simplified original.
 * - All: hover:brightness-95 for a subtle press feel.
 * - All SVGs are aria-hidden; each button carries its own aria-label.
 *
 * Provider config lives in an exhaustive Record<Provider, …> so adding a
 * union member will break typecheck rather than silently omit a button.
 *
 * Purely presentational — no internal state. issue #676 adds xbox + playstation.
 */

interface ProviderConfig {
  label: string;
  /** Tailwind bg + border classes */
  containerClass: string;
  glyph: React.ReactNode;
}

const providerConfig: Record<Provider, ProviderConfig> = {
  facebook: {
    label: "Continue with Facebook",
    containerClass: "bg-brand-facebook",
    glyph: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 fill-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simplified "f" glyph — original minimal letterform, not Meta's exact mark */}
        <path d="M13.5 3H10.5C8.843 3 7.5 4.343 7.5 6v2.5H5.5v3h2v8.5h3.5V11.5h2.5l.5-3h-3V6.5c0-.552.448-1 1-1h2V3h-2z" />
      </svg>
    ),
  },
  google: {
    label: "Continue with Google",
    containerClass: "bg-login-bg border border-login-surface",
    glyph: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        {/*
         * Single-colour simplified "G" — intentionally NOT Google's 4-colour
         * brand mark (trademarked). This is a plain geometric letterform in
         * login-ink to avoid trademark issues while remaining recognisable.
         */}
        <text
          x="12"
          y="17"
          textAnchor="middle"
          fontSize="16"
          fontWeight="600"
          fontFamily="Arial, sans-serif"
          className="fill-login-ink"
        >
          G
        </text>
      </svg>
    ),
  },
  apple: {
    label: "Continue with Apple",
    containerClass: "bg-login-black",
    glyph: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 fill-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/*
         * Simplified apple silhouette — original minimal shape, not Apple's
         * exact proprietary mark.
         */}
        <path d="M17.05 12.536c-.03-2.607 2.13-3.868 2.228-3.933-1.213-1.776-3.098-2.019-3.77-2.048-1.604-.163-3.14.95-3.957.95-.816 0-2.077-.93-3.41-.904-1.752.025-3.37 1.023-4.273 2.587-1.824 3.163-.467 7.847 1.313 10.41.876 1.257 1.915 2.668 3.276 2.617 1.318-.052 1.814-.847 3.408-.847 1.594 0 2.047.847 3.44.822 1.42-.023 2.317-1.282 3.184-2.543.998-1.456 1.41-2.868 1.43-2.941-.031-.012-2.738-1.05-2.869-4.16zM14.453 4.5c.727-.88 1.217-2.103 1.083-3.32-1.047.042-2.314.698-3.063 1.577-.672.776-1.26 2.016-1.102 3.207 1.167.09 2.354-.594 3.082-1.464z" />
      </svg>
    ),
  },
  xbox: {
    label: "Continue with Xbox",
    containerClass: "bg-brand-xbox",
    glyph: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 fill-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simplified "X" glyph — original letterform, not Microsoft's exact Xbox mark */}
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 14.5l-4.5-4.5-4.5 4.5-1.5-1.5 4.5-4.5-4.5-4.5 1.5-1.5 4.5 4.5 4.5-4.5 1.5 1.5-4.5 4.5 4.5 4.5-1.5 1.5z" />
      </svg>
    ),
  },
  playstation: {
    label: "Continue with PlayStation",
    containerClass: "bg-brand-playstation",
    glyph: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 fill-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simplified "PS" text glyph — original letterform, not Sony's exact mark */}
        <text
          x="4"
          y="17"
          fontSize="12"
          fontWeight="700"
          fontFamily="Arial, sans-serif"
          fill="white"
        >
          PS
        </text>
      </svg>
    ),
  },
};

const DEFAULT_PROVIDERS: Provider[] = ["facebook", "google", "apple"];

export function SocialLoginButtons({
  onProvider,
  providers = DEFAULT_PROVIDERS,
}: SocialLoginButtonsProps) {
  return (
    <div className="flex w-full gap-2">
      {providers.map((key) => {
        const { label, containerClass, glyph } = providerConfig[key];
        return (
          <button
            key={key}
            type="button"
            aria-label={label}
            onClick={() => onProvider?.(key)}
            className={[
              "flex flex-1 items-center justify-center",
              "h-9 rounded-none",
              "hover:brightness-95",
              "transition-[filter] duration-150",
              containerClass,
            ].join(" ")}
          >
            {glyph}
          </button>
        );
      })}
    </div>
  );
}
