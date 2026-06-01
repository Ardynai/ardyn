# Windows-First Runtime

ARDYN should be excellent on Windows without becoming Windows-only.

## Requirements

- The Rust host should provide the native entrypoint for Windows install, update, process supervision, and local policy enforcement.
- The TypeScript core should stay portable across Windows, macOS, Linux, and container environments.
- Paths, shell behavior, process spawning, and credential access must be modeled explicitly rather than assuming POSIX behavior.
- Future desktop and browser control must be gated by capability manifests and task permissions.

## Host Responsibilities

The host should eventually own:

- Process tree cleanup.
- Signal and Ctrl-C handling.
- Stdio transport stability.
- Local service startup and shutdown.
- Windows service or tray integration if needed.
- Explicit path normalization and workspace boundary checks.

## Phase 1 Boundary

This scaffold does not add Windows automation or tool execution. It only documents the boundary and creates a Rust host crate placeholder so future work has a clear ownership point.

