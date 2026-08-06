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
 * Visual spec (from docs/reference/riot-login-page.png + issue #101, #676, #784):
 * - Three buttons side-by-side (default), each ~28px tall, square corners.
 * - Facebook: bg-brand-facebook (#1877f2), real "f" glyph path.
 * - Google:   bg-brand-google (#ececec, same as login-surface), borderless, real multicolor "G".
 *   Brand-asset SVG exception: Google's 4-colour mark is embedded as-is,
 *   carrying official brand colors (#4285f4 / #34a853 / #fbbc05 / #ea4335).
 * - Apple:    bg-login-black (#000000), real apple silhouette in white.
 * - Xbox:     bg-brand-xbox (#107c10), real Xbox sphere path.
 * - PlayStation: bg-brand-playstation (#003791), real PS wordmark path.
 * - All: hover:brightness-95 for a subtle press feel.
 * - All SVGs are aria-hidden; each button carries its own aria-label.
 *
 * Brand-asset exception: Facebook, Google, Apple, Xbox, PlayStation glyphs
 * are faithful reproductions of the real brand marks (simple-icons style),
 * identical to the pattern used in packages/ui/src/merch/franchise-logos.tsx.
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
        {/*
         * Real Facebook "f" mark — simple-icons path (brand-asset exception).
         * Source: simpleicons.org/icons/facebook
         */}
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  google: {
    label: "Continue with Google",
    containerClass: "bg-brand-google",
    glyph: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        {/*
         * Real Google "G" — multicolor brand mark (brand-asset exception).
         * Carries official brand colors: #4285f4 / #34a853 / #fbbc05 / #ea4335.
         * Source: simpleicons.org/icons/google
         */}
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285f4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34a853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#fbbc05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#ea4335"
        />
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
         * Real Apple logo silhouette — simple-icons path (brand-asset exception).
         * Source: simpleicons.org/icons/apple
         */}
        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
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
        {/*
         * Real Xbox logo — simple-icons path (brand-asset exception).
         * Source: simpleicons.org/icons/xbox
         */}
        <path d="M4.102 3.27C3.294 4.14 2.578 5.108 2.07 6.204 1.68 7.05 1.5 7.805 1.5 7.81c0 .008.426.547.947 1.197.52.65 1.434 1.968 2.03 2.927.6.961 1.626 2.796 2.283 4.076.657 1.28 1.487 2.728 1.843 3.218.358.49 1.203 1.413 1.88 2.053l1.23 1.163.696-.15c2.394-.518 4.49-1.96 5.913-4.07.357-.524.647-1.013.647-1.087 0-.295-2.66-4.297-3.694-5.565-.605-.75-1.878-2.064-2.828-2.92C11.497 7.797 9.75 6.378 9.626 6.378c-.148 0-1.015.854-2.097 2.1-.98 1.13-2.105 2.552-2.5 3.16-.398.61-.744 1.11-.77 1.11-.026 0 .208-.512.52-1.138.313-.625 1.01-1.821 1.55-2.658.54-.837 1.623-2.318 2.407-3.29.784-.972 1.562-1.874 1.73-2.005.17-.13.246-.27.17-.312-.42-.232-1.965-.6-3.008-.715-1.052-.117-1.34-.09-2.2.306-.853.394-1.013.503-1.325.78zm11.757-1.013c-.614.063-1.562.252-2.108.42-.547.168-1.263.472-1.592.675l-.6.37 1.77 1.59c.974.875 2.196 2.18 2.717 2.9.52.718 1.367 2.142 1.882 3.165.515 1.022 1.022 2.127 1.127 2.455.104.328.226.57.27.538.044-.032.428-.562.854-1.178.84-1.22 1.297-2.153 1.556-3.168.15-.587.162-.855.094-1.89-.094-1.43-.373-2.387-.978-3.338-.543-.862-1.418-1.726-2.26-2.23-.508-.307-.876-.377-2.732-.31z" />
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
        {/*
         * Real PlayStation logo mark — simple-icons path (brand-asset exception).
         * Source: simpleicons.org/icons/playstation
         */}
        <path d="M8.984 2.596v14.347l3.915 1.245V6.688c0-.67.296-1.138.77-.996.578.194.694 1.108.694 1.108v5.511l3.867 1.234V7.024c0-1.386-.597-3.205-3.398-4.047-1.844-.551-5.848-.93-5.848-.381zm9.296 11.095c-1.547.467-3.285.645-4.868.567-1.37-.06-2.857-.36-4.136-.94v3.096l-2.614-.83v-2.44l-3.96-1.265C1.756 13.264.918 14.458 2.256 15.62c.97.835 2.91 1.7 4.897 2.318l1.763.562L8.922 24l3.876 1.236v-6.066c1.35.42 2.76.56 4.062.44 1.37-.127 2.6-.524 3.425-1.092.998-.688 1.247-1.547.777-2.192-.432-.588-1.44-.977-2.782-.635z" />
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
              "h-7 rounded-none",
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
