/**
 * LoginLegalFooter — presentational, server-safe (no 'use client').
 *
 * Renders the version + hCaptcha legal row shown at the very bottom of the
 * Classic login panel (issue #676).
 *
 * Visual spec (pixel-sampled from ref):
 * - Two lines at the bottom of the left panel.
 * - hCaptcha notice with dead anchor links (href="#", no onClick needed in
 *   the component — the page handles navigation context).
 * - Version string (e.g. "14.24.560.7891").
 * - Font-body text-[10px] text-login-placeholder, uppercase.
 *
 * Presentational — no internal state; no onClick on links (dead "#" anchors
 * are sufficient in this presentational context).
 */

export interface LoginLegalFooterProps {
  /** Version string displayed at the bottom of the classic login panel. */
  version?: string;
}

export function LoginLegalFooter({ version = "14.24.560.7891" }: LoginLegalFooterProps) {
  return (
    <div className="mt-auto pb-3 pt-4 px-10">
      <p className="font-body text-[10px] leading-snug text-login-placeholder uppercase tracking-wide">
        The app is protected by hCaptcha and its{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="#" className="underline">
          Terms of Service
        </a>{" "}
        apply.
      </p>
      <p className="mt-1 font-body text-[10px] text-login-placeholder uppercase tracking-wide">
        {version}
      </p>
    </div>
  );
}
