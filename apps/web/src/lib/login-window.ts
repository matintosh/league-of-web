/**
 * Fixed login-window dimensions — the real client's login lives in a bounded
 * frame that is SMALLER than the 1280×720 main client window (issue #343).
 *
 * Measured from docs/reference/riot-login-page.png (1359×641, aspect ≈ 2.12:1,
 * left white form panel ≈ 29.4% ≈ 400px). We target ~1360×640 so the form
 * panel proportion matches the ref: 400 / 1360 = 29.4% panel, 70.6% keyart.
 * fix(login): #780 — resize to ref proportion (issue #780).
 */
export const LOGIN_WIDTH = 1360;
export const LOGIN_HEIGHT = 640;
