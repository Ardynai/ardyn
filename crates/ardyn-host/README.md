# ardyn-host

Rust host scaffold for ARDYN.

Phase 4.0C still exposes static Rust host identity and handshake data only.
Rust task planning, runtime execution, live stdio reading, tool execution,
network serving, plugin installation, torrent download, code-pack enablement,
and agent-loop behavior are not implemented here.

Future live stdio work must make the Rust host the owner of process-level
stdout/stderr policy, buffering, flushing, backpressure, partial-write
handling, process exit semantics, redaction enforcement, and transport-failure
audit records before any runtime loop exists.
