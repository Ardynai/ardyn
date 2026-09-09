# Locus webUI connection (R-5)

The existing console can respond to a verified Locus `open` request. It imports
the exact shared `@multiverse/fabric-hub-protocol` 0.3.0 artifact prepared in
Multiverse PR #465. No crypto implementation or trust root is copied
into Ardyn source.

Proposed founder registration: `systemId=ardyn`, `category=webui`,
`currentDid=<existing-founder-created-system-did>`. The system's signed envelope
carries its exact deployed HTTPS origin, `embedUrl=<that-origin>/`, and
`capabilities=["open"]`. Identity remains in the closed manifest entry. The
existing root keyring and a positive minimum current manifest version must be
configured server-side; update that minimum on every manifest publication.
No keys or registrations are created by this PR.

`GET /api/locus-webui` rereads the primary directory snapshot and verifies its
manifest and envelope. `POST` accepts only a signed, current Locus host ticket,
with exact request origin, a 64 KiB input bound, replay protection and an
unexpired consented request. It signs only the fixed `open` response for `/`.
No console API key, session token, auth handoff, or console command is carried
by the channel. Existing API authentication and execution approvals still apply.

The browser checks the parent WindowProxy, exact `https://locus.localhost`
origin, signatures, recipient/channel/record bindings, lifetime and replay.
The host creates a cross-origin iframe with
`sandbox="allow-scripts allow-same-origin"`; same-origin embedding is refused
by the shared verifier. CSP permits only that exact Locus frame ancestor.
Version 1 fixtures remain compatibility proofs; runtime channels require v2.

Missing registry/root/version configuration produces `webui_trust_unavailable`;
missing or invalid server key produces `webui_signer_unavailable`. The app stays
usable standalone. A failed embedded connection shows a native alert using the
existing console text, border, surface and spacing tokens.
Only the shared `onReplyPosted` callback clears that alert, after signature,
correlation and current-channel verification. HTTP 200 alone cannot clear it.
This callback proves local posting, not host acknowledgement.

## Reference lock and validation

Preserve the existing operator console: cyan accent, fixed sidebar, dense status
panels, system typography, existing loading/empty/error states. The only new
surface is a compact connection-error alert. No navigation, telemetry content,
approval affordance, or theme behavior is redesigned. Local Refero product craft
and Impeccable product-register guidance inform this identity-preserving change;
the Batch 4 instruction authorizes completing this narrow integration without a
new design interview.

A configured signing key that does not match the current signed repository identity
fails closed with HTTP 503 and `webui_signer_mismatch`.

Run `node --test tests/locus-webui.test.mjs` for exact vector outcomes, artifact
and vector byte integrity, real endpoint composition, stale/untrusted input and
bounded request failures, including an invalid reply followed by verified recovery.
Run Node with the key-generation-blocking public-fixture preload for these tests.
The current component proof is in `docs/visual-proof/locus-webui-030/README.md`.
Full Next build/dev verification remains STOP: `NEXT_FRAMEWORK_KEY_REQUIRED` until
the founder securely configures `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`; do not
generate a framework key, copy a cache or substitute a fixture key to proceed.

The vendored tarball and adjacent provenance pin SHA-256
`c5991fb0db8ab4b7ca79276b80fd65bb9e1a815094ad5b9f41d7330934c9d277`.
The 0.3.0 files live under `vendor/fabric-hub-protocol/0.3.0/`; prior 0.2.0 files
remain unchanged. This update changes only the console dependency path and the
installed protocol version/path/integrity in the lockfile; Noble versions do not
change. A clean `npm ci --ignore-scripts` was necessary because workspace-scoped
install reported up-to-date while still resolving 0.2.0. Activation still
requires founder-managed keys, a signed current manifest/envelope and deployment.
The existing source-guard manifest updates only the hash for that reviewed
lockfile delta; CLI, Rust, Fabric and all other pinned source remain unchanged.
