# Autobuild Progress Log

Append one entry per completed work item (format in `LOOP-PROTOCOL.md`). Keep the two running sections below current.

## Blocked / needs Josh
- (none yet)

## For Fable's review (fill in as you go; finalize at the end)
- Posture change: runtime is being enabled (build mode). Scrutinize the runtime enable path, approval gates, and that kill-switch/redaction/replay/audit stayed intact.
- Fabric wiring: confirm the pre-wiring hardening (redirect:manual, inbound-auth signatures, registry host allowlist, identity-file confinement, response cap) landed BEFORE the client was wired.
- Any new dependencies + why. Any `ponytail:` ceilings left.

---

## Log
### 2026-08-19T01:35Z — M0.1: Fix security.yml rust-toolchain
- Changed: `.github/workflows/security.yml` (added `with: toolchain: stable` + `components: rustfmt, clippy` + `cargo install cargo-audit --locked`), `tests/fixtures/source-guards/digests.json` (added ci.yml + security.yml), `tests/m0-security-yml-fix.test.mjs` (new)
- Tests: 1159 → 1162 (pass)
- Self-review: pass — fixes the root cause (missing toolchain spec), cargo-audit was never installed so it would have failed anyway
- Commit: 55874d8
- Notes: Also fixed a spurious file-mode change on apps/cli/src/index.mjs (100644 → 100755) that git detected
