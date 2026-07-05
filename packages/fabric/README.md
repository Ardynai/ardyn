# @ardyn/fabric

Content Fabric v1.0.0 conformance foundation for ARDYN.

This package implements canonical serialization, signing payload generation, SHA-256 digest helpers, shape validation, license prechecks, path confinement prechecks, first-party trust-root data, and an out-of-process Multiverse Fabric federation client.

Import live federation helpers from `@ardyn/fabric/federation`. The federation client talks to `fabric-transport-d` over loopback HTTP and the Multiverse registry over authenticated HTTP. It does not import `@multiverse/fabric-core`, decrypt Secure Drop ciphertext, join a DHT/swarm, install, seed, enable, sandbox, or execute packs.

