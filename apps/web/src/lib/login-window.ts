/**
 * Fixed login-window dimensions — the real client's login lives in a bounded
 * frame that is SMALLER than the 1280×720 main client window (issue #343).
 *
 * Measured from docs/reference/riot-login-page.png (1359×641, aspect ≈ 2.12:1,
 * left white form panel ≈ 29.4% ≈ 400px). We keep the 400px form panel intact
 * (the issue is the outer boundary only — do not redesign the form) and pick a
 * compact 1024×540 window: clearly smaller than the main client, tall enough to
 * fit the form comfortably, with the keyart taking the remaining ≈624px.
 */
export const LOGIN_WIDTH = 1024;
export const LOGIN_HEIGHT = 540;
