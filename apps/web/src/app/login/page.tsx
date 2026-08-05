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
  LolClassicLogo,
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
 * theme "current" (default): white Riot-red login — UNCHANGED.
 * theme "classic": gold/cream LoL Classic variant (issue #676). Achieved by
 *   wrapping content in <div class="login-classic"> which remaps --color-login-*
 *   tokens via CSS scope. Classic has a narrower 266px panel (~26% of 1024),
 *   a top→mid→bottom gold gradient background, the real LoL Classic logo,
 *   real social brand marks, tighter tabs/inputs, partial notice banner,
 *   avatar + video chips, and no window title text.
 *
 * fix(login): classic fidelity pass — issue #676 delta fixes.
 * CLASSIC-ONLY — the current (white) login is byte-identical to origin/main.
 *
 * Splash champion: Syndra (current) / Zilean (classic — clock motif).
 */

const SPLASH_CURRENT = "Syndra";
// Classic: the real "League of Legends Classic" group promo (multi-champion clock
// scene), the same art the launcher Home uses. Hotlinked via next/image
// (wiki.leagueoflegends.com is in next.config remotePatterns).
const SPLASH_CLASSIC_PROMO =
  "https://wiki.leagueoflegends.com/en-us/images/League_Classic_Promo_01.jpg";

/* Classic panel width — ~26% of LOGIN_WIDTH (1024px) matches the ref ratio. */
const CLASSIC_PANEL_WIDTH = 266;

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
        {/* Fix #10: classic has no title text — ref title bar is bare; current keeps its title */}
        <WindowFrame
          title={isClassic ? undefined : "League of Web"}
          onHelp={() => console.log("help")}
          onMinimize={() => console.log("minimize")}
          onClose={() => console.log("close")}
        >
          {isClassic ? (
            /* ============================================================ */
            /* CLASSIC THEME — .login-classic scope remaps all login tokens */
            /* Fix: 266px panel (≈26%), gold gradient, real logos, tighter  */
            /* ============================================================ */
            <div className="login-classic flex h-full w-full overflow-hidden">
              {/* -------------------------------------------------------- */}
              {/* LEFT PANEL — classic gold/cream form, narrower + gradient  */}
              {/* -------------------------------------------------------- */}
              <div
                className="relative z-10 flex shrink-0 flex-col"
                style={{
                  width: CLASSIC_PANEL_WIDTH,
                  /* Fix #4: gold vertical gradient (pixel-sampled from ref 25.png) */
                  background:
                    "linear-gradient(to bottom, var(--color-login-classic-panel-from) 0%, var(--color-login-classic-panel-mid) 50%, var(--color-login-classic-panel-to) 100%)",
                }}
              >
                {/* Fix #1: REAL LoL Classic logo — crest + wordmark + CLASSIC ribbon */}
                <div className="px-5 pt-3 pb-1">
                  <LolClassicLogo
                    className="text-login-classic-ink"
                    width={80}
                  />
                </div>

                {/* Fix #5: Auth tabs — tightened via .login-classic [role=tablist] button CSS */}
                <LoginAuthTabs active={authTab} onSelect={setAuthTab} />

                {/* Form body */}
                <div className="flex flex-1 flex-col justify-center px-5 pb-2 pt-2">
                  <form onSubmit={handleSubmit} noValidate>
                    {/* Fix #6: input height compressed via .login-classic input CSS scope */}
                    <div className="flex flex-col gap-1.5">
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

                      {/* Fix #2: REAL social brand marks — 5 providers for classic */}
                      <div className="mt-1">
                        <SocialLoginButtons
                          providers={[...CLASSIC_PROVIDERS]}
                          onProvider={(p) => console.log("social provider:", p)}
                        />
                      </div>

                      {/* Fix #7: checkbox — verified custom box renders (~16px) */}
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
                  <div className="mt-3 flex gap-3">
                    <a
                      href="#"
                      aria-disabled="true"
                      onClick={(e) => e.preventDefault()}
                      className="footer-link font-body text-[10px] font-bold tracking-wide text-login-placeholder"
                      style={{ textTransform: "uppercase" }}
                    >
                      Can't sign in?
                    </a>
                    <a
                      href="#"
                      aria-disabled="true"
                      onClick={(e) => e.preventDefault()}
                      className="footer-link font-body text-[10px] font-bold tracking-wide text-login-placeholder"
                      style={{ textTransform: "uppercase" }}
                    >
                      Create account
                    </a>
                  </div>
                </div>

                {/* Fix #10: version string updated to v135.0.7 */}
                <LoginLegalFooter version="v135.0.7" />
              </div>

              {/* -------------------------------------------------------- */}
              {/* RIGHT — classic clock-themed champion splash (Zilean)    */}
              {/* -------------------------------------------------------- */}
              <div className="relative flex-1">
                {/* Fix #8: Notice banner — partial-width, left-aligned strip
                    (was absolute inset-x-0; now left-0 w-fit) */}
                <div className="absolute left-0 top-0 z-10">
                  <LoginNoticeBanner text="Split End Transfers Disabled" />
                </div>

                {/* Fix #9: Account avatar chip — top-right of splash */}
                <div
                  aria-hidden="true"
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: "rgba(10,8,4,0.72)" }}
                  title="Account"
                >
                  {/* Silhouette avatar icon */}
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4 fill-gold-3"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                </div>

                {/* Fix #9: Video/feedback button — bottom-right of splash */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: "rgba(10,8,4,0.72)" }}
                  title="Video"
                >
                  {/* Camera/video glyph */}
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4 fill-gold-3"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 6a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2V8a2 2 0 00-2-2H2zm13 1l4-2v8l-4-2V7z" />
                  </svg>
                </div>

                <Image
                  src={SPLASH_CLASSIC_PROMO}
                  alt=""
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="758px"
                />
              </div>
            </div>
          ) : (
            /* ============================================================ */
            /* CURRENT THEME — original layout, UNCHANGED from origin/main  */
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
