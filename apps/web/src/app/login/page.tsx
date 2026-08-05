"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LoginTextInput,
  LoginCheckbox,
  CircleSubmitButton,
  SocialLoginButtons,
  LoginAuthTabs,
  LoginNoticeBanner,
  LoginLegalFooter,
  WindowFrame,
  type LoginAuthTab,
} from "@low/ui";
import { championSplashUrl } from "@low/fixtures";
import { ViewSwitcher } from "../view-switcher";
import { LOGIN_WIDTH, LOGIN_HEIGHT } from "../../lib/login-window";

/**
 * /login page — the login split composed inside a bounded client window
 * (issue #343). Like the real client, the login lives in a fixed-size frame
 * (WindowFrame) centered over a dark backdrop, NOT edge-to-edge browser content.
 *
 * The window is 1024×540 (see login-window.ts) — smaller than the 1280×720 main
 * client, faithful to the reference's ≈2.12:1 aspect and 400px form panel.
 *
 * Layout inside the frame:
 * - Left panel (400px): bg-login-bg, wordmark, sign-in form, social buttons,
 *   checkbox, submit button, footer links.
 * - Right: full-bleed champion splash via next/image fill.
 *
 * theme "current" (default): white Riot-red login — must remain UNCHANGED.
 * theme "classic": gold/cream LoL Classic variant. Achieved by wrapping
 *   content in <div class="login-classic"> which remaps --color-login-*
 *   tokens via CSS scope (no per-component variant props). issue #676.
 *
 * Classic champion splash: Zilean — clock motif matches the ref's clock-themed splash.
 *
 * Note: "LEAGUE OF WEB" / "LEAGUE OF WEB CLASSIC" wordmarks stand in for the
 * trademarked Riot Games / LoL Classic logos. Plain text marks in brand colors.
 *
 * Footer links use <a href="#" aria-disabled="true"> dead links styled with
 * CSS text-transform: uppercase. The natural-case JSX lets screen readers
 * speak them naturally while CSS provides the uppercase visual treatment.
 *
 * This route does NOT gate the client — portfolio visitors land on / directly.
 * Discovery path: Settings → Developer → "Sign out" link navigates here.
 * Submit navigates to /client (no real auth).
 *
 * Splash champion: Syndra (current) / Zilean (classic — clock motif).
 */

const SPLASH_CURRENT = "Syndra";
const SPLASH_CLASSIC = "Zilean";

type Theme = "current" | "classic";

const CLASSIC_PROVIDERS = ["facebook", "google", "apple", "xbox", "playstation"] as const;

export default function LoginPage() {
  const router = useRouter();

  const [theme, setTheme] = useState<Theme>("current");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [authTab, setAuthTab] = useState<LoginAuthTab>("sign-in");

  const bothFilled = username.trim().length > 0 && password.length > 0;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!bothFilled) return;
    router.push("/client");
  }

  const isClassic = theme === "classic";

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-hextech-black">
      {/* Portfolio tab strip — absolute so it floats above the window
          without contributing to page flow height (mirrors root `/`). */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex flex-col items-center">
        <div className="pointer-events-auto">
          <ViewSwitcher />
        </div>
        {/* Current | Classic theme toggle */}
        <div className="pointer-events-auto mt-1 flex items-center">
          <nav
            aria-label="Login theme"
            className="flex items-end gap-6"
          >
            {(["current", "classic"] as Theme[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={[
                  "shrink-0 font-display uppercase tracking-widest text-sm",
                  "border-b-2 pb-0.5 transition-colors duration-150",
                  theme === t
                    ? "border-gold-3 text-gold-1"
                    : "border-transparent text-grey-1 hover:text-gold-1",
                ].join(" ")}
              >
                {t === "current" ? "Current" : "Classic"}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Bounded login window — fixed size, centered on the dark backdrop. */}
      <div className="shrink-0" style={{ width: LOGIN_WIDTH, height: LOGIN_HEIGHT }}>
        <WindowFrame
          title={isClassic ? "League of Web — Classic" : "League of Web"}
          onHelp={() => console.log("help")}
          onMinimize={() => console.log("minimize")}
          onClose={() => console.log("close")}
        >
          {isClassic ? (
            /* ============================================================ */
            /* CLASSIC THEME — .login-classic scope remaps all login tokens */
            /* ============================================================ */
            <div className="login-classic flex h-full w-full overflow-hidden">
              {/* -------------------------------------------------------- */}
              {/* LEFT PANEL — classic gold/cream form                     */}
              {/* -------------------------------------------------------- */}
              <div
                className="relative z-10 flex shrink-0 flex-col bg-login-bg"
                style={{ width: 400 }}
              >
                {/* Classic logo wordmark — "LEAGUE OF WEB CLASSIC" stand-in */}
                <div className="px-8 pt-8 pb-3">
                  <div className="flex flex-col">
                    <span className="font-display text-[10px] uppercase tracking-[0.3em] text-login-placeholder">
                      League of Web
                    </span>
                    <span className="font-display text-lg font-bold uppercase tracking-widest text-login-accent leading-tight">
                      Classic
                    </span>
                  </div>
                </div>

                {/* Auth tabs */}
                <LoginAuthTabs active={authTab} onSelect={setAuthTab} />

                {/* Form body */}
                <div className="flex flex-1 flex-col justify-center px-8 pb-4 pt-4">
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="flex flex-col gap-3">
                      <LoginTextInput
                        value={username}
                        onChange={setUsername}
                        label="Username"
                      />
                      <LoginTextInput
                        value={password}
                        onChange={setPassword}
                        label="Password"
                        type="password"
                      />

                      {/* Social sign-in buttons — 5 providers for classic */}
                      <div className="mt-1">
                        <SocialLoginButtons
                          providers={[...CLASSIC_PROVIDERS]}
                          onProvider={(p) => console.log("social provider:", p)}
                        />
                      </div>

                      {/* Keep me signed in + submit row */}
                      <div className="flex items-center justify-between">
                        <LoginCheckbox
                          checked={keepSignedIn}
                          onChange={setKeepSignedIn}
                          label="Stay signed in"
                        />
                        <CircleSubmitButton
                          disabled={!bothFilled}
                          ariaLabel="Sign in"
                        />
                      </div>
                    </div>
                  </form>

                  {/* Footer links */}
                  <div className="mt-4 flex gap-4">
                    <a
                      href="#"
                      aria-disabled="true"
                      onClick={(e) => e.preventDefault()}
                      className="footer-link font-body text-xs font-bold tracking-wide text-login-placeholder"
                      style={{ textTransform: "uppercase" }}
                    >
                      Can't sign in?
                    </a>
                    <a
                      href="#"
                      aria-disabled="true"
                      onClick={(e) => e.preventDefault()}
                      className="footer-link font-body text-xs font-bold tracking-wide text-login-placeholder"
                      style={{ textTransform: "uppercase" }}
                    >
                      Create account
                    </a>
                  </div>
                </div>

                {/* Legal footer — version + hCaptcha */}
                <LoginLegalFooter />
              </div>

              {/* -------------------------------------------------------- */}
              {/* RIGHT — classic clock-themed champion splash (Zilean)    */}
              {/* -------------------------------------------------------- */}
              <div className="relative flex-1">
                {/* Notice banner pinned at top of splash */}
                <div className="absolute inset-x-0 top-0 z-10">
                  <LoginNoticeBanner text="Split End Transfers Disabled" />
                </div>

                <Image
                  src={championSplashUrl(SPLASH_CLASSIC)}
                  alt=""
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="624px"
                />
              </div>
            </div>
          ) : (
            /* ============================================================ */
            /* CURRENT THEME — original layout, UNCHANGED                  */
            /* ============================================================ */
            <div className="flex h-full w-full overflow-hidden bg-login-bg">
              {/* -------------------------------------------------------- */}
              {/* LEFT PANEL — form + wordmark                              */}
              {/* -------------------------------------------------------- */}
              <div
                className="relative z-10 flex shrink-0 flex-col bg-login-bg"
                style={{ width: 400 }}
              >
                {/* Wordmark — Riot Games logo stand-in */}
                <div className="px-10 pt-10 pb-6">
                  <span className="font-body text-sm font-bold uppercase tracking-widest text-riot-red">
                    League of Web
                  </span>
                </div>

                {/* Form body — centered vertically in remaining space */}
                <div className="flex flex-1 flex-col justify-center px-10 pb-10">
                  {/* "Sign in" heading */}
                  <h1 className="mb-6 font-body text-2xl font-bold text-login-ink">
                    Sign in
                  </h1>

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="flex flex-col gap-3">
                      {/* Username input */}
                      <LoginTextInput
                        value={username}
                        onChange={setUsername}
                        label="Username"
                      />

                      {/* Password input */}
                      <LoginTextInput
                        value={password}
                        onChange={setPassword}
                        label="Password"
                        type="password"
                      />

                      {/* Social sign-in buttons */}
                      <div className="mt-1">
                        <SocialLoginButtons
                          onProvider={(p) => console.log("social provider:", p)}
                        />
                      </div>

                      {/* Keep me signed in + submit row */}
                      <div className="flex items-center justify-between">
                        <LoginCheckbox
                          checked={keepSignedIn}
                          onChange={setKeepSignedIn}
                          label="Keep me signed in"
                        />

                        <CircleSubmitButton
                          disabled={!bothFilled}
                          ariaLabel="Sign in"
                        />
                      </div>
                    </div>
                  </form>

                  {/* Footer links */}
                  <div className="mt-6 flex gap-4">
                    <a
                      href="#"
                      aria-disabled="true"
                      onClick={(e) => e.preventDefault()}
                      className="footer-link font-body text-xs font-bold tracking-wide text-login-placeholder"
                      style={{ textTransform: "uppercase" }}
                    >
                      Can't sign in?
                    </a>
                    <a
                      href="#"
                      aria-disabled="true"
                      onClick={(e) => e.preventDefault()}
                      className="footer-link font-body text-xs font-bold tracking-wide text-login-placeholder"
                      style={{ textTransform: "uppercase" }}
                    >
                      Create account
                    </a>
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* RIGHT — full-bleed champion splash                       */}
              {/* -------------------------------------------------------- */}
              <div className="relative flex-1">
                <Image
                  src={championSplashUrl(SPLASH_CURRENT)}
                  alt=""
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="624px"
                />
              </div>
            </div>
          )}
        </WindowFrame>
      </div>
    </div>
  );
}
