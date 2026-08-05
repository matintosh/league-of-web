/**
 * /launcher — redirects to the LoL launcher overview screen.
 *
 * The LoL Overview is the primary launcher surface (5 of 7 reference images).
 * Previously this delegated to LauncherClient (a standalone assembly). It now
 * redirects to /launcher/lol which is the routed, rail-wired LoL shell.
 *
 * /launcher/home and /launcher/games remain reachable via the rail nav.
 *
 * Closes #718.
 */

import { redirect } from "next/navigation";

export default function LauncherPage() {
  redirect("/launcher/lol");
}
