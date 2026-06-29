# How This Works: Rust Host

## Owns

`crates/ardyn-host` owns Rust-side static host metadata and policy review
records. It also contains a private blocked stdio runtime skeleton used by tests
and fixtures. It does not run a live runtime.

## Key Files

- `crates/ardyn-host/src/lib.rs`: public Rust library surface.
- `crates/ardyn-host/src/stdio_runtime/mod.rs`: private blocked stdio runtime
  planning skeleton.
- `crates/ardyn-host/Cargo.toml`: Rust package metadata.
- `tests/phase4-*`, `tests/phase5-*`: JavaScript tests that also pin Rust host
  evidence through fixtures and docs.
- Rust tests live inside the crate source.

## Main Flow

The public Rust surface exposes static identity, policy metadata, review record
classification, approval-record classification, transport-harness contracts,
and stdio runtime contract gates. The private `stdio_runtime` module classifies
fixture-shaped input and returns blocked planning data.

## Gotchas

- The `stdio_runtime` module is intentionally private. Public access is guarded
  by a compile-fail doctest in `lib.rs`.
- Blocked runtime helpers may plan frames or lifecycle outcomes, but they do not
  spawn, kill, poll, wait on, or manage processes.
- Serialized field names are contract surface. Rename Rust enum variants or
  struct fields only with explicit schema/fixture intent.

## Start Reading

Read the crate-level docs at the top of `crates/ardyn-host/src/lib.rs`, then
follow the public function or struct used by the test you are changing. Read
`stdio_runtime/mod.rs` only for blocked-runtime planning behavior.
