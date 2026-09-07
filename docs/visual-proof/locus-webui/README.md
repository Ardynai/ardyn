# R-5 production console proof

Production `next build` and `next start` on loopback, rendered in installed
Chromium through a synthetic HTTPS Locus parent and HTTPS console origin.
Only routing is intercepted; the app HTML, JS, CSS, CSP and error responses
come from the actual production server. No real key or registration is used.

- Desktop: `desktop.png`, 1440 × 1000.
- Mobile: `mobile.png`, 390 × 844.
- The actual parent sends to the exact child origin in an iframe with
  `allow-scripts allow-same-origin`. Missing deployment trust produces the
  pictured named error. The existing standalone console shows no Locus alert.
- CSP response is exactly `frame-ancestors https://locus.localhost`.
- Neither viewport emits a browser page exception.

Inspection found the existing mobile header sitting beside the console body
because the shared shell always used a row. The shell now uses a column at the
existing mobile breakpoint, preserving the existing navigation and tokens.
The dashboard's unavailable telemetry is the real unconfigured local result;
these screenshots are not evidence of a live registry or enabled harness.

Validation command used in this workspace:
`node C:/Users/Josh/AppData/Local/Temp/batch4-ardyn-visual.cjs`.
Output: `PASS: production console desktop/mobile, real cross-origin sandbox,
named missing-trust alert, exact CSP, standalone unchanged, no page errors`.
