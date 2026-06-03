# Schema Migration Policy

Phase 3.7 defines local schema migration metadata for review and display only.
It does not migrate files, rewrite artifacts, execute tools, connect adapters,
or start runtime behavior.

## Metadata Record

`buildSchemaMigrationMetadataRecord(kind, artifact)` returns an
`ardyn.schema-migration-metadata` record with:

| Field | Meaning |
| --- | --- |
| `artifactKind` | One of `manifest`, `task`, `planner_trace`, `approval_review_artifact`, `trace_diff`, or `host_policy`. |
| `schemaId` | The known schema id for the artifact kind, or the artifact's explicit schema id when present. |
| `artifactSchemaVersion` | The schema version found on the artifact. |
| `artifactVersion` | The artifact version when the kind has one, currently review artifacts. |
| `compatibility` | `compatible`, `upgrade_available`, `unsupported_major`, or `malformed`. |
| `migrationRequired` | `true` only when an artifact cannot be safely accepted for display without manual review. |
| `migrationAvailable` | `true` when same-major metadata could be normalized by a future reviewed migrator. |
| `migrationNotes` | Deterministic reviewer notes. |
| `nonExecuting` | Always `true` in Phase 3.7. |

## Compatibility Rules

`compatible` means the artifact schema metadata is current.

`upgrade_available` means the artifact uses a supported major version but not
the current exact version. ARDYN may display it as inert review metadata. A
future migration phase may normalize it after tests and policy review.

`unsupported_major` means the artifact major version is outside the supported
major line. A future migrator must not auto-upgrade this without manual review.

`malformed` means the artifact is missing required schema metadata or has
invalid semver/schema values. It must be reviewed manually.

## Future Migration Boundaries

Automatically migratable later:

- Same-major schema or artifact version normalization.
- Renamed display-only fields with deterministic mappings.
- Added optional metadata fields that preserve previous behavior.

Manual review required:

- Major-version changes.
- Missing schema ids or invalid semver.
- Safety flags that are not false.
- Any field that could be misread as execution, network, install, download,
  key loading, signing, or adapter behavior.

Unknown fields remain inert. Reviewers and future UIs may display their names
and stable JSON values, but must not interpret them as commands, policies,
network targets, secrets, signing keys, or executable instructions.

## Locus Display

Locus may later display migration status through public ARDYN artifacts, but
Phase 3.7 adds no Locus runtime dependency, imports, SDK calls, or connection.
Display surfaces should show `compatibility`, `migrationRequired`,
`migrationAvailable`, notes, unknown-field counts, and false safety flags.

## Forbidden Behavior

Phase 3.7 migration metadata must not add runtime execution, network
server/listener behavior, adapter connections, real MCP/OpenClaw calls, plugin
install, torrent download, Content Fabric runtime/download/install/enable,
code-pack enablement, autonomous loops, production signing keys, secret
handling, external CI calls, process spawning outside tests, or a Locus runtime
dependency.
