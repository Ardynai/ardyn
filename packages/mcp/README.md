# @ardyn/mcp

MCP adapter scaffold for ARDYN.

MCP is treated as a typed protocol boundary. Future work should require explicit capabilities and permission grants before exposing tools.

Phase 3 exports metadata-only registration data and a registry-read capability descriptor. It does not open MCP connections, expose tools, spawn processes, or serve network traffic.
