// Modularization: shared Tier-1 review/boundary helpers extracted from index.mjs.
// Used by index.mjs kernel + multiple domain modules.

import { isPlainObjectRecord } from "../internal/utils.mjs";

function compareAscii(left, right) {
  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
}

function stableJsonValue(value) {
  if (Array.isArray(value)) {
    return value.map(stableJsonValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .sort(([left], [right]) => compareAscii(left, right))
        .map(([key, entryValue]) => [key, stableJsonValue(entryValue)])
    );
  }

  return value;
}

function stableJsonStringify(value) {
  return JSON.stringify(stableJsonValue(value));
}

function dataProperty(source, key) {
  if (!source || typeof source !== "object") {
    return undefined;
  }

  const descriptor = Object.getOwnPropertyDescriptor(source, key);
  return descriptor && "value" in descriptor ? descriptor.value : undefined;
}

const REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE = Object.freeze({
  runtimeEnabled: false,
  runtimeStarted: false,
  runtimeReady: false,
  runtimeCommandEnabled: false,
  runtimeCommandExposureEnabled: false,
  runtimeExecutionEnabled: false,
  runtimeExecuted: false,
  approvalGrantProduced: false,
  approvalGrantPersisted: false,
  approvalEvaluatorAuthoritative: false
});

const APPROVAL_PREREQUISITE_READER_DEFAULT_REVIEWED_AT =
  "1970-01-01T00:00:00.000Z";

const APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT =
  APPROVAL_PREREQUISITE_READER_DEFAULT_REVIEWED_AT;

function reviewOnlyRuntimeEffectAllFalse(runtimeEffect) {
  return (
    isPlainObjectRecord(runtimeEffect) &&
    Object.keys(REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE).every(
      (key) => runtimeEffect[key] === false
    ) &&
    Object.values(runtimeEffect).every(
      (value) => value === false
    )
  );
}

function approvalEvaluatorCandidateNestedTrueClaim(value, keyPredicate, seen = new Set()) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      approvalEvaluatorCandidateNestedTrueClaim(entry, keyPredicate, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, value]) =>
      (value === true && keyPredicate(key)) ||
      approvalEvaluatorCandidateNestedTrueClaim(value, keyPredicate, seen)
  );
}

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_PROTOTYPE_POLLUTION_PATH_FIELDS =
  Object.freeze(new Set(["__proto__", "constructor", "prototype"]));

const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_GRANT_KEY_PATTERN =
  /(^|_|\b)grant(ed|ing|Id|Produced|Persisted)?($|_|\b)/i;

function reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
  value,
  keys,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(entry, keys, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      (keys.includes(key) && entry === true) ||
      reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
        entry,
        keys,
        seen
      )
  );
}

function reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse(
  runtimeEffect
) {
  return (
    isPlainObjectRecord(runtimeEffect) &&
    Object.values(runtimeEffect).every((value) => value === false)
  );
}

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_DIGEST_PATTERN =
  /^sha256:[0-9a-f]{64}$/;


export { compareAscii, stableJsonValue, stableJsonStringify, dataProperty, REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE, APPROVAL_PREREQUISITE_READER_DEFAULT_REVIEWED_AT, APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT, reviewOnlyRuntimeEffectAllFalse, approvalEvaluatorCandidateNestedTrueClaim, REVIEW_ONLY_EVALUATOR_PREFLIGHT_PROTOTYPE_POLLUTION_PATH_FIELDS, REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_GRANT_KEY_PATTERN, reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent, reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse, REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_DIGEST_PATTERN };

function commandSurfaceShellBoundaryMapForbiddenBehavior() {
  return [
    "shell runtime, REPL, prompt loop, command parser, tokenizer, builtin execution, command execution, process spawning, process control, terminal backend execution, stdin loop, stdout/stderr writers, pipes, redirection, completion, job control, background jobs, command history, history persistence, parameter expansion, or environment variable expansion",
    "PATH lookup, executable lookup, command search, filename completion, globbing, filesystem shell behavior, filesystem read/write, command history file access, or shell history persistence",
    "new CLI command exposure, serve-runtime bypass, runtime authorization, approval decision/grant, reviewer routing, evaluator execution, transcript/audit runtime writes, or command-surface control behavior",
    "secret store, env ingestion, vault access, token loader, OAuth flow, session handling, API key handling, credential export, secret persistence, credential scanner runtime, secret scanner runtime, rotation/revocation job, or redaction runtime",
    "Fabric bus, websocket/http transport, MCP exposure, task execution, connector grants, backend middleware, API/server behavior, database client, storage adapter, cache engine, RLS runtime, migration, logger runtime, audit writer, transcript writer, telemetry client, health check, backup job, restore job, failover runtime, infrastructure/deployment/compliance automation, PII processing, retention/export job, testing/CI/release automation, filesystem write, process control, UI behavior, or blocked CLI bypass",
    "Matrix client behavior, homeserver connection, E2EE key/session handling, message polling, message sending, room joining, external gateway client, service discovery, scheduling, polling, connector runtime, gateway runtime, content-addressed/chunked/resumable/multi-source/BitTorrent/DHT/swarm/P2P/large-payload transfer, fabric-core producer behavior, Secure Drop implementation, encoded handoff runtime, codec, translator, stego, covert channel, tokenizer exploit, bypass, Hermes/CUA/computer-use runtime, SQLite runtime, embedded DB/query runtime, or DB storage behavior"
  ];
}


function externalGatewayMatrixBoundaryMapForbiddenBehavior() {
  return [
    "Matrix client behavior, homeserver connection, room join, message polling, message reading, message sending, message ingestion/export runtime, E2EE key/session handling, or access-token loader",
    "external gateway client or connector for Telegram, Discord, Slack, Signal, WhatsApp, Home Assistant, or similar external platforms",
    "service discovery, scheduling, polling, connector runtime, gateway runtime, retry engine, queue, worker, operation monitor, runbook executor, or failover runtime",
    "Fabric bus, websocket/http transport, MCP exposure, task execution, Secure Drop implementation, Secure Drop crypto, transport, inbox polling, file selection, connector ingestion, ST3GG wrapping, or hidden payload transport",
    "content-addressed transport, chunked transfer, resumable transfer, multi-source transfer, BitTorrent, DHT, swarm, P2P behavior, large payload transfer runtime, fabric-core producer behavior, or transfer package seam",
    "secret store, env ingestion, vault access, keyring/DID runtime, token loader, OAuth flow, session handling, credential scanner runtime, secret scanner runtime, rotation/revocation job, credential export, secret persistence, or redaction runtime",
    "shell runtime, PATH lookup, executable lookup, command execution, pipes, redirection, job control, command history, or process spawning",
    "SQLite runtime, embedded DB file parsing, SQL parser, B-tree traversal, query execution, index scan, WAL, transaction, or DB storage behavior",
    "backend middleware, API/server behavior, database client, storage adapter, cache engine, RLS runtime, migration, logger runtime, audit writer, transcript writer, telemetry client, external sink, health check, backup job, restore job, failover runtime, infrastructure/deployment/compliance automation, PII processing, retention/export job, testing/CI/release automation, filesystem write, process control, UI behavior, command exposure, or blocked CLI bypass"
  ];
}


function secretsCredentialBoundaryMapForbiddenBehavior() {
  return [
    "secret store, vault access, env ingestion, keyring, DID runtime, token loader, OAuth flow, session handling, credential scanner runtime, secret scanner runtime, rotation job, revocation job, credential export, secret persistence, or redaction runtime",
    "Matrix client, HiClaw-style gateway client, homeserver access, room join, message ingestion/export, access-token handling, refresh-token handling, E2EE key/session handling, or gateway rate-limit runtime",
    "external gateway client for Telegram, Discord, Slack, Signal, WhatsApp, Home Assistant, or similar services",
    "MCP connector, MCP server credential handling, plugin credential handling, provider credential handling, SkillHub install/trust scanner runtime, tool registry, or connector grant",
    "Fabric bus, websocket/http transport, MCP exposure, task execution, Secure Drop implementation, Secure Drop crypto, keyring/DID implementation, ST3GG wrapping, or file selection",
    "Hermes runtime, CUA driver install/update/runtime, CUA manifest discovery, CUA MCP stdio invocation, computer-use screenshots, OCR, accessibility-tree access, UI element/SOM runtime, input automation, or approval runtime",
    "encoded handoff runtime, codec, translator, encoder, decoder, conlang generator, stego, covert channel, tokenizer exploit, bypass, or hidden payload",
    "shell runtime, process spawning, PATH lookup, executable lookup, command execution, pipes, redirection, job control, command history, or filesystem shell behavior",
    "SQLite runtime, embedded DB file parsing, SQL parser, B-tree traversal, query execution, index scan, WAL, transaction, or DB storage behavior",
    "backend middleware, API/server behavior, database client, storage adapter, cache engine, RLS runtime, migration, logger runtime, audit writer, transcript writer, telemetry client, external sink, health check, backup job, restore job, failover runtime, infrastructure/deployment/compliance automation, PII processing, retention/export job, testing/CI/release automation, filesystem write, process control, UI behavior, command exposure, or blocked CLI bypass"
  ];
}


function maintenanceGovernanceBoundaryMapForbiddenBehavior() {
  return [
    "ADR generator runtime",
    "diagram generator runtime",
    "dependency update bot",
    "dependency update automation",
    "vulnerability patch automation",
    "release publishing",
    "CI workflow modification",
    "policy engine",
    "waiver automation",
    "Graphify mutation inside the repo",
    "Code Mode runtime",
    "subagent runtime",
    "Jules automation",
    "external repo import, vendoring, copying, migration, or integration",
    "package export or deployment automation",
    "runtime governance",
    "backend middleware, API/server behavior, Fabric bus, websocket/http transport, MCP exposure, task execution, connector grant, Secure Drop implementation, encoded handoff runtime, codec, translator, stego, covert channel, tokenizer exploit, or bypass",
    "database client, storage adapter, cache engine, RLS runtime, migration, persistence, filesystem write, or process control",
    "auth/session/token/API-key behavior",
    "Hermes, CUA-driver, computer-use, agent-mode, profile-loader, or skill-loader runtime",
    "logger runtime, audit writer, transcript writer, telemetry client, health monitor, backup job, restore job, failover runtime, infrastructure automation, deployment automation, compliance enforcement, PII processing, retention job, export job, or testing/CI/release automation",
    "command exposure",
    "interactive control",
    "blocked CLI bypass"
  ];
}


function operationsReliabilityBoundaryMapForbiddenBehavior() {
  return [
    "runtime operations engine",
    "retry engine",
    "idempotency store",
    "circuit breaker",
    "queue",
    "scheduler",
    "worker",
    "lease store",
    "operation monitor",
    "runbook executor",
    "process supervisor",
    "failover runtime",
    "background subagent runtime",
    "front-desk model runtime",
    "model router",
    "fusion runtime",
    "judge runtime",
    "orchestration runtime",
    "computer-use or CUA-driver reliability runtime",
    "SkillHub install or rollback runtime",
    "MCP, tool, plugin, or provider runtime",
    "service discovery, polling, persistence, database client, storage adapter, cache engine, filesystem write, or process control",
    "backend middleware, API/server behavior, Fabric bus, websocket/http transport, MCP exposure, task execution, connector grant, Secure Drop implementation, encoded handoff runtime, codec, translator, stego, covert channel, tokenizer exploit, or bypass",
    "logger runtime, audit writer, telemetry client, health monitor, backup job, restore job, infrastructure automation, deployment automation, compliance enforcement, PII processing, retention job, export job, or runtime governance",
    "Hermes install, vendoring, copying, importing, migration, or integration",
    "cua-driver install, execution, stdio MCP invocation, manifest discovery, update, backend start, or tool dispatch",
    "testing, CI, release automation, package export, artifact upload, live dependency update, or patch automation",
    "command exposure",
    "interactive control",
    "blocked CLI bypass"
  ];
}


function testingFrameworksQualityGatesBoundaryMapForbiddenBehavior() {
  return [
    "new test runner",
    "integration test runner",
    "e2e runner",
    "browser test runner",
    "computer-use test runner",
    "CUA-driver test runtime",
    "chaos runner",
    "stress runner",
    "model-eval runtime",
    "training or fine-tuning code",
    "CI pipeline creation",
    "release automation",
    "package export",
    "artifact upload",
    "external service test",
    "live dependency update",
    "patch automation",
    "runtime test harness",
    "Hermes install, vendoring, copying, importing, migration, or integration",
    "cua-driver install, execution, stdio MCP invocation, manifest discovery, update, backend start, or tool dispatch",
    "computer-use runtime",
    "desktop or browser control",
    "screenshot, OCR, accessibility-tree, UI element, SOM, OS-window, coordinate fallback, or input automation behavior",
    "background subagents, queues, schedulers, async workers, profile loaders, skill loaders, SkillHub install, security scan runtime, model router, fusion runtime, judge runtime, or front-desk model runtime",
    "gateway messaging, scheduled automation, terminal backend execution, ACP/A2A runtime, Locus integration, external harness integration, or cross-harness communication",
    "backend API, server, database client, storage adapter, cache engine, RLS, migration, storage write, transcript write, audit write, import/export path, package distribution, or persistence",
    "Fabric bus, websocket/http transport, MCP exposure, task execution, connector grant, Secure Drop implementation, encoded handoff runtime, codec, translator, stego, covert channel, tokenizer exploit, or bypass",
    "logger runtime, audit writer, telemetry client, external sink, health checker, backup job, restore job, failover runtime, service discovery, scheduler, process supervisor, infrastructure automation, deployment automation, compliance enforcement, PII processing, retention job, export job, filesystem write, process control, or UI behavior",
    "command exposure",
    "interactive control",
    "blocked CLI bypass"
  ];
}


function agentModeProfileSkillhubCapabilityBoundaryMapForbiddenBehavior() {
  return [
    "Hermes install, vendoring, copying, importing, migration, or integration",
    "fainir prompt-guide install, vendoring, copying, importing, migration, or integration",
    "cua-driver install, execution, binary invocation, update command, stdio MCP driver invocation, manifest discovery, backend start, tool dispatch, or driver update behavior",
    "computer-use runtime",
    "desktop control",
    "browser control",
    "screenshot or capture runtime",
    "OCR runtime",
    "accessibility tree access",
    "UI element or SOM index runtime",
    "OS window enumeration",
    "Wayland/X11 input",
    "Windows UI Automation or SendInput behavior",
    "macOS accessibility or private-API behavior",
    "coordinate fallback or input automation",
    "click, double-click, right-click, middle-click, drag, scroll, type-text, key/hotkey, focus, set-value, move-cursor, or launch-app runtime",
    "safe-action runtime",
    "mutating action approval runtime",
    "always-approve or session-approve behavior",
    "destructive key-combo execution",
    "dangerous typed-command execution",
    "multimodal screenshot/image tool response runtime",
    "telemetry opt-in, telemetry client, or external telemetry sink",
    "background worker, daemon, queue, scheduler, async executor, or live subagent",
    "concurrent conversation runtime or front-desk responder",
    "profile loader, personality loader, session loader, context-file loader, memory-profile loader, or skill loader",
    "SkillHub installer, one-click skill install, rollback runtime, permission manifest executor, or security scan runtime",
    "MCP scanner, plugin scanner, provider scanner, tool inventory scanner, tool registry, or live inventory registry",
    "gateway messaging runtime for Telegram, Discord, Slack, Signal, WhatsApp, Home Assistant, or other platforms",
    "scheduled automation, cron, recurrence, delivery target, or cancellation runtime",
    "terminal backend execution for local, Docker, SSH, cloud, or any toolset runner",
    "model router, model-provider switching runtime, lightweight front-desk model, fusion runtime, judge runtime, diffusion mode, or Sakana-style multi-candidate runtime",
    "Locus integration or external harness communication",
    "ACP/A2A runtime, adapter, registry, service discovery, or handoff transport",
    "backend API, server, database, storage, cache, RLS, migration, transcript write, audit write, import/export, package, or persistence behavior",
    "Fabric bus, websocket/http transport, MCP/task runtime, connector grants, Secure Drop implementation, encoded handoff codec/translator/stego/covert-channel/tokenizer-exploit/bypass behavior",
    "logger runtime, audit writer, health check runtime, backup job, restore job, failover runtime, infrastructure automation, deployment automation, compliance enforcement, PII processing, filesystem/process/UI behavior",
    "command exposure",
    "interactive control",
    "blocked CLI bypass"
  ];
}


function infrastructureComplianceDataRetentionBoundaryMapForbiddenBehavior() {
  return [
    "infrastructure automation",
    "deployment automation",
    "cloud provisioning",
    "environment manager",
    "compliance automation",
    "compliance enforcement",
    "PII collection or processing",
    "retention job",
    "deletion job",
    "export job",
    "policy engine",
    "vendor integration",
    "external service lookup",
    "secret/env/vault access",
    "backend API",
    "server",
    "database client",
    "storage adapter",
    "cache engine",
    "storage write",
    "RLS rule",
    "migration",
    "auth/session/token/API-key runtime",
    "connector grant",
    "Fabric runtime bus",
    "websocket/http transport",
    "MCP tool exposure",
    "task execution",
    "logger runtime",
    "audit writer",
    "transcript writer",
    "telemetry client",
    "external sink",
    "health checker",
    "monitor",
    "scheduler",
    "backup job",
    "restore job",
    "failover runtime",
    "recovery automation",
    "process supervisor",
    "service discovery",
    "background polling",
    "filesystem write",
    "filesystem scanning",
    "process control",
    "stdin loop",
    "stdout/stderr runtime writer",
    "import/export command",
    "package writer",
    "package reader",
    "Secure Drop crypto, transport, stego, send/receive, inbox polling, file selection, filesystem scanning, connector ingestion, secret/vault/env access, or ST3GG wrapping",
    "encoded handoff runtime, codec, translator runtime, encoder, decoder, conlang generator, stego, covert channel, tokenizer exploit, bypass, hidden payload, or transport behavior",
    "command exposure",
    "interactive control",
    "reviewer routing",
    "evaluator execution",
    "approval decision",
    "approval grant",
    "UI/frontend/browser/rendering/WCAG automation"
  ];
}


function availabilityRecoveryBoundaryMapForbiddenBehavior() {
  return [
    "health-check runtime",
    "monitor",
    "scheduler",
    "backup job",
    "restore job",
    "failover runtime",
    "degraded-mode runtime behavior",
    "recovery automation",
    "process supervisor",
    "external service integration",
    "service discovery",
    "background polling",
    "persistence path",
    "backend API",
    "server",
    "database client",
    "storage adapter",
    "cache engine",
    "storage write",
    "RLS rule",
    "migration",
    "auth/session/token/API-key runtime",
    "connector grant",
    "Fabric runtime bus",
    "websocket/http transport",
    "MCP tool exposure",
    "task execution",
    "logger runtime",
    "audit writer",
    "transcript writer",
    "telemetry client",
    "external sink",
    "secret/env/vault access",
    "filesystem write",
    "filesystem scanning",
    "process control",
    "stdin loop",
    "stdout/stderr runtime writer",
    "import/export command",
    "package writer",
    "package reader",
    "Secure Drop crypto, transport, stego, send/receive, inbox polling, file selection, filesystem scanning, connector ingestion, secret/vault/env access, or ST3GG wrapping",
    "encoded handoff runtime, codec, translator runtime, encoder, decoder, conlang generator, stego, covert channel, tokenizer exploit, bypass, hidden payload, or transport behavior",
    "command exposure",
    "interactive control",
    "reviewer routing",
    "evaluator execution",
    "approval decision",
    "approval grant",
    "UI/frontend/browser/rendering/WCAG automation"
  ];
}


function errorTrackingLoggingAuditIntegrityBoundaryMapForbiddenBehavior() {
  return [
    "logger runtime",
    "log writer",
    "audit writer",
    "transcript writer",
    "error collector",
    "telemetry client",
    "external sink",
    "export path",
    "persistence path",
    "redaction runtime",
    "tamper-evident writer",
    "digest writer",
    "trace collector",
    "alerting runtime",
    "backend API",
    "server",
    "database client",
    "storage adapter",
    "cache engine",
    "storage write",
    "RLS rule",
    "auth/session/token/API-key runtime",
    "connector grant",
    "Fabric runtime bus",
    "websocket/http transport",
    "MCP tool exposure",
    "task execution",
    "service discovery",
    "schedule enforcement",
    "background polling",
    "secret/env/vault access",
    "filesystem write",
    "filesystem scanning",
    "process control",
    "stdin loop",
    "stdout/stderr runtime writer",
    "import/export command",
    "package writer",
    "package reader",
    "Secure Drop crypto, transport, stego, send/receive, inbox polling, file selection, filesystem scanning, connector ingestion, secret/vault/env access, or ST3GG wrapping",
    "encoded handoff runtime, codec, translator runtime, encoder, decoder, conlang generator, stego, covert channel, tokenizer exploit, bypass, hidden payload, or transport behavior",
    "command exposure",
    "interactive control",
    "reviewer routing",
    "evaluator execution",
    "approval decision",
    "approval grant",
    "UI/frontend/browser/rendering/WCAG automation"
  ];
}


function rateLimitingAbuseControlBoundaryMapForbiddenBehavior() {
  return [
    "limiter runtime",
    "quota engine",
    "throttle runtime",
    "abuse detector",
    "denial-of-service runtime",
    "queue",
    "scheduler",
    "retry engine",
    "circuit breaker",
    "idempotency store",
    "request cost meter",
    "rate-limit middleware",
    "backend API",
    "server",
    "database client",
    "storage adapter",
    "cache engine",
    "storage write",
    "RLS rule",
    "auth/session/token/API-key runtime",
    "connector grant",
    "Fabric runtime bus",
    "websocket/http transport",
    "MCP tool exposure",
    "task execution",
    "service discovery",
    "schedule enforcement",
    "background polling",
    "secret/env/vault access",
    "filesystem write",
    "filesystem scanning",
    "process control",
    "import/export command",
    "package writer",
    "package reader",
    "persistence layer",
    "transcript writer",
    "audit writer",
    "Secure Drop crypto, transport, stego, send/receive, inbox polling, file selection, filesystem scanning, connector ingestion, secret/vault/env access, or ST3GG wrapping",
    "encoded handoff runtime, codec, translator runtime, encoder, decoder, conlang generator, stego, covert channel, tokenizer exploit, bypass, hidden payload, or transport behavior",
    "command exposure",
    "interactive control",
    "reviewer routing",
    "evaluator execution",
    "approval decision",
    "approval grant",
    "stdin loop",
    "stdout/stderr runtime writer",
    "UI/frontend/browser/rendering/WCAG automation"
  ];
}


function securityRlsInputSanitizationBoundaryMapForbiddenBehavior() {
  return [
    "security middleware",
    "runtime sanitizer",
    "schema validator that authorizes runtime",
    "injection-prevention runtime",
    "database client",
    "database schema",
    "database migration",
    "RLS rule",
    "storage adapter",
    "permission enforcement runtime",
    "secure transport server config",
    "https/hsts server",
    "backend API",
    "server",
    "Fabric runtime bus",
    "websocket/http transport",
    "MCP tool exposure",
    "task execution",
    "connector grant",
    "connector scanner",
    "secret/env/vault access",
    "secret scanner runtime",
    "dependency patch automation",
    "live security scanner",
    "audit writer",
    "log writer",
    "tamper-evident writer",
    "transcript writer",
    "filesystem write",
    "import/export command",
    "package writer",
    "package reader",
    "persistence layer",
    "service discovery",
    "schedule enforcement",
    "background polling",
    "Secure Drop crypto, transport, stego, send/receive, inbox polling, file selection, filesystem scanning, connector ingestion, secret/vault/env access, or ST3GG wrapping",
    "encoded handoff runtime, codec, translator runtime, encoder, decoder, conlang generator, stego, covert channel, tokenizer exploit, bypass, hidden payload, or transport behavior",
    "command exposure",
    "interactive control",
    "reviewer routing",
    "evaluator execution",
    "approval decision",
    "approval grant",
    "process control",
    "stdin loop",
    "stdout/stderr runtime writer",
    "UI/frontend/browser/rendering/WCAG automation"
  ];
}


function authPermissionsContractBoundaryMapForbiddenBehavior() {
  return [
    "identity provider integration",
    "login flow",
    "session runtime",
    "token issuance",
    "API-key issuance",
    "role engine",
    "permission evaluator",
    "authorization evaluator",
    "approval decision",
    "approval grant",
    "operator consent runtime",
    "runtime authorization enforcement",
    "policy enforcement runtime",
    "connector grant",
    "secret/env/vault access",
    "keyring/DID implementation",
    "delegation engine",
    "revocation engine",
    "backend API",
    "server",
    "Fabric runtime bus",
    "websocket/http transport",
    "MCP tool exposure",
    "task execution",
    "database client",
    "database schema",
    "database migration",
    "RLS rule",
    "storage adapter",
    "cache engine",
    "transcript writer",
    "audit writer",
    "filesystem write",
    "import/export command",
    "package writer",
    "package reader",
    "persistence layer",
    "service discovery",
    "schedule enforcement",
    "background polling",
    "Secure Drop crypto, transport, stego, send/receive, inbox polling, file selection, filesystem scanning, connector ingestion, secret/vault/env access, or ST3GG wrapping",
    "encoded handoff runtime, codec, translator runtime, encoder, decoder, conlang generator, stego, covert channel, tokenizer exploit, bypass, hidden payload, or transport behavior",
    "command exposure",
    "interactive control",
    "reviewer routing",
    "evaluator execution",
    "process control",
    "stdin loop",
    "stdout/stderr runtime writer",
    "UI/frontend/browser/rendering/WCAG automation"
  ];
}


function databaseStorageContractBoundaryMapForbiddenBehavior() {
  return [
    "database client",
    "database connection",
    "database schema",
    "database migration",
    "RLS rule",
    "app-permission enforcement runtime",
    "cache engine",
    "cache invalidation runtime",
    "storage adapter",
    "filesystem write",
    "transcript writer",
    "audit writer",
    "persistence layer",
    "backup job",
    "restore job",
    "retention job",
    "deletion job",
    "export job",
    "import job",
    "package writer",
    "package reader",
    "backend API",
    "server",
    "Fabric runtime bus",
    "websocket/http transport",
    "connector grant",
    "MCP tool exposure",
    "task execution",
    "service discovery",
    "schedule enforcement",
    "background polling",
    "secrets, vault, or env access",
    "Secure Drop crypto, transport, stego, send/receive, inbox polling, file selection, connector ingestion, secret/vault/env access, or ST3GG wrapping",
    "encoded handoff runtime, codec, translator runtime, encoder, decoder, conlang generator, stego, covert channel, tokenizer exploit, bypass, hidden payload, or transport behavior",
    "command exposure",
    "interactive control",
    "reviewer routing",
    "evaluator execution",
    "approval decision",
    "approval grant",
    "stdin loop",
    "stdout/stderr runtime writer",
    "filesystem scanning",
    "process control",
    "UI/frontend/browser/rendering/WCAG automation"
  ];
}


function interAgentEncodedHandoffConformanceForbiddenBehavior() {
  return [
    "codec implementation",
    "translator runtime",
    "encoder implementation",
    "decoder implementation",
    "conlang generator",
    "seed generator",
    "protocol runtime",
    "protocol negotiator",
    "message router",
    "message bus",
    "Fabric runtime bus",
    "backend API",
    "server",
    "websocket/http transport",
    "gRPC transport",
    "MQTT transport",
    "libp2p transport",
    "A2A, ACP, AMP, ANP, Agora, LMOS, MCP, Fabric, Matrix, gRPC, MQTT, or libp2p runtime",
    "import command",
    "export command",
    "package writer",
    "package reader",
    "package distribution",
    "persistence",
    "database or storage write",
    "secrets, vault, or env access",
    "connector grant",
    "MCP tool exposure",
    "task execution",
    "Secure Drop crypto, transport, stego, send/receive, inbox polling, file selection, connector ingestion, secret/vault/env access, or ST3GG vendoring",
    "SemanticStego, SteganographyEngine, TokenExploiter, semantic stego, covert channel delivery, tokenizer exploitation, monitor bypass, guardrail evasion, Unicode homoglyphs, zero-width payloads, stealth/adversarial/phantom attributes, or hidden payload paths",
    "command exposure",
    "interactive control",
    "reviewer routing",
    "evaluator execution",
    "approval decision",
    "approval grant",
    "service discovery",
    "schedule enforcement",
    "background polling",
    "filesystem scanning",
    "process control",
    "UI/frontend/browser/rendering/WCAG automation"
  ];
}


function fabricAwareApiBackendContractBoundaryMapForbiddenBehavior() {
  return [
    "API endpoint implementation",
    "backend server implementation",
    "HTTP server",
    "websocket/http transport",
    "Fabric runtime bus",
    "Fabric broker",
    "Fabric transport",
    "adapter runtime",
    "connector grant",
    "connector ingestion",
    "live registry connection",
    "task execution",
    "MCP tool exposure",
    "import path",
    "export path",
    "package writer",
    "package reader",
    "package distribution",
    "package persistence",
    "database or storage write",
    "secrets, vault, or env access",
    "result collection",
    "result validation",
    "review routing",
    "evaluator execution",
    "approval decision",
    "approval grant",
    "command exposure",
    "service discovery",
    "schedule enforcement",
    "background polling",
    "filesystem scanning",
    "process control",
    "UI/frontend/browser/rendering/WCAG automation",
    "Secure Drop crypto, transport, stego, send/receive, inbox polling, file selection, connector ingestion, secret/vault/env access, or ST3GG vendoring"
  ];
}


function productionReadinessCoverageMatrixForbiddenBehavior() {
  return {
    ...consumerContractGapIndexForbiddenBehavior(),
    databaseStorageRuntimeWritesEnabled: false,
    runtimeDatabaseWriteEnabled: false,
    storageRuntimeWriteEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    externalServicesEnabled: false,
    networkServerEnabled: false,
    hostingDeploymentProvisioned: false,
    cloudComputeProvisioned: false,
    rateLimitingRuntimeEnabled: false,
    cachingCdnRuntimeEnabled: false,
    loadBalancingRuntimeEnabled: false,
    runtimeObservabilityEnabled: false,
    disasterRecoveryRuntimeEnabled: false,
    infrastructureMutationEnabled: false,
    complianceAttestationProduced: false,
    productionTestRuntimeEnabled: false,
    operationsMonitorEnabled: false,
    alertDispatchEnabled: false,
    retryCircuitBreakerRuntimeEnabled: false,
    serviceDiscoveryEnabled: false,
    liveServiceRegistryConnectionEnabled: false,
    scheduleEnforcementEnabled: false,
    backgroundPollingEnabled: false
  };
}


function consumerContractGapIndexForbiddenBehavior() {
  return {
    ...consumerContractReadinessMatrixForbiddenBehavior(),
    mcpExecutionEnabled: false,
    httpRuntimeSurfaceEnabled: false,
    webSocketHttpSurfaceEnabled: false
  };
}


function consumerContractReadinessMatrixForbiddenBehavior() {
  return {
    commandRuntimeControlEnabled: false,
    commandExposurePermissionGranted: false,
    runtimePermissionGranted: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorExecutionPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    connectorGrantProduced: false,
    connectorIngestionAdded: false,
    liveRegistryConnectionEnabled: false,
    webSocketRuntimeEnabled: false,
    httpRuntimeEnabled: false,
    taskRuntimeExecutionEnabled: false,
    taskExecutionEnabled: false,
    mcpRuntimeExecutionEnabled: false,
    mcpToolExposureEnabled: false,
    fabricRuntimeSurfaceEnabled: false,
    contentFabricRuntimeBehaviorEnabled: false,
    adapterRuntimeBehaviorEnabled: false,
    secureDropImplemented: false,
    secureDropCryptoImplemented: false,
    secureDropTransportImplemented: false,
    secureDropStegoImplemented: false,
    secureDropSendReceiveImplemented: false,
    secureDropInboxPollingEnabled: false,
    fileSelectionEnabled: false,
    filesystemWatcherEnabled: false,
    filesystemScanningEnabled: false,
    secretVaultEnvAccessEnabled: false,
    st3ggVendored: false,
    processControlEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    transcriptRuntimeWritePerformed: false,
    auditRuntimeWritePerformed: false
  };
}


function targetConsumerPlanningMetadataForbiddenBehavior() {
  return {
    commandRuntimeControlEnabled: false,
    commandExposurePermissionGranted: false,
    runtimePermissionGranted: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorExecutionPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    connectorGrantProduced: false,
    connectorIngestionAdded: false,
    liveRegistryConnectionEnabled: false,
    webSocketRuntimeEnabled: false,
    httpRuntimeEnabled: false,
    taskRuntimeExecutionEnabled: false,
    mcpRuntimeExecutionEnabled: false,
    fabricRuntimeSurfaceEnabled: false,
    contentFabricRuntimeBehaviorEnabled: false,
    adapterRuntimeBehaviorEnabled: false,
    secureDropImplemented: false,
    secureDropCryptoImplemented: false,
    secureDropTransportImplemented: false,
    secureDropStegoImplemented: false,
    secureDropSendReceiveImplemented: false,
    secureDropInboxPollingEnabled: false,
    fileSelectionEnabled: false,
    filesystemWatcherEnabled: false,
    filesystemScanningEnabled: false,
    secretVaultEnvAccessEnabled: false,
    st3ggVendored: false,
    processControlEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    transcriptRuntimeWritePerformed: false,
    auditRuntimeWritePerformed: false
  };
}


export { commandSurfaceShellBoundaryMapForbiddenBehavior, externalGatewayMatrixBoundaryMapForbiddenBehavior, secretsCredentialBoundaryMapForbiddenBehavior, maintenanceGovernanceBoundaryMapForbiddenBehavior, operationsReliabilityBoundaryMapForbiddenBehavior, testingFrameworksQualityGatesBoundaryMapForbiddenBehavior, agentModeProfileSkillhubCapabilityBoundaryMapForbiddenBehavior, infrastructureComplianceDataRetentionBoundaryMapForbiddenBehavior, availabilityRecoveryBoundaryMapForbiddenBehavior, errorTrackingLoggingAuditIntegrityBoundaryMapForbiddenBehavior, rateLimitingAbuseControlBoundaryMapForbiddenBehavior, securityRlsInputSanitizationBoundaryMapForbiddenBehavior, authPermissionsContractBoundaryMapForbiddenBehavior, databaseStorageContractBoundaryMapForbiddenBehavior, interAgentEncodedHandoffConformanceForbiddenBehavior, fabricAwareApiBackendContractBoundaryMapForbiddenBehavior, productionReadinessCoverageMatrixForbiddenBehavior, consumerContractGapIndexForbiddenBehavior, consumerContractReadinessMatrixForbiddenBehavior, targetConsumerPlanningMetadataForbiddenBehavior };

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_REQUIRED_FALSE_FIELDS = Object.freeze([
  "intakeCheckpointStateIsApprovalGrant",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "runtimePermissionGranted",
  "commandExposurePermissionGranted",
  "runtimeCommandExposureEnabled",
  "runtimeExecutionEnabled"
]);


export { REVIEW_ONLY_EVALUATOR_PREFLIGHT_REQUIRED_FALSE_FIELDS };

const NON_AUTHORIZING_EVALUATOR_DECISION_REQUIRED_FALSE_FIELDS = Object.freeze([
  "evaluatorPreflightCheckpointStateIsApprovalGrant",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "runtimePermissionGranted",
  "commandExposurePermissionGranted",
  "runtimeCommandExposureEnabled",
  "runtimeExecutionEnabled",
  "evaluatorExecutionRequested",
  "evaluatorExecutionStarted",
  "evaluatorExecutionEnabled",
  "evaluatorExecuted"
]);


export { NON_AUTHORIZING_EVALUATOR_DECISION_REQUIRED_FALSE_FIELDS };

const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_DECISION_CANDIDATE_SUMMARY_FIELDS =
  Object.freeze([
    "candidateKind",
    "candidateMode",
    "candidateClassification",
    "reviewArtifactOnly",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "evaluatorExecuted",
    "runtimeEffectAllFalse"
  ]);


export { REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_DECISION_CANDIDATE_SUMMARY_FIELDS };

const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_CLEANUP_EVIDENCE_FIELDS =
  Object.freeze([
    "phase",
    "evidenceMode",
    "npmAuditRequired",
    "cargoAuditRequired",
    "cargoMacheteRequired",
    "fallowStaticRequired",
    "optionalAdvisoryChecksAllowed",
    "megaLinterRun",
    "broadTrunkRewriteRun",
    "toolsInstalledByPhase542",
    "fallowRuntimeUsed",
    "runtimeExecutionEnabled",
    "commandExposurePermissionGranted"
  ]);


export { REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_CLEANUP_EVIDENCE_FIELDS };

const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_RUNTIME_EFFECT_FIELDS =
  Object.freeze([
    "runtimeEnabled",
    "runtimeStarted",
    "runtimeReady",
    "runtimeCommandEnabled",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "runtimeExecuted",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "approvalEvaluatorAuthoritative"
  ]);


export { REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_RUNTIME_EFFECT_FIELDS };

const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_CLEANUP_EVIDENCE_FIELDS =
  Object.freeze([
    "phase",
    "evidenceMode",
    "npmAuditRequired",
    "cargoAuditRequired",
    "cargoMacheteRequired",
    "fallowStaticRequired",
    "optionalAdvisoryChecksAllowed",
    "megaLinterRun",
    "broadTrunkRewriteRun",
    "toolsInstalledByPhase543",
    "fallowRuntimeUsed",
    "runtimeExecutionEnabled",
    "commandExposurePermissionGranted"
  ]);


export { REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_CLEANUP_EVIDENCE_FIELDS };

const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_RUNTIME_EFFECT_FIELDS =
  Object.freeze([
    "runtimeEnabled",
    "runtimeStarted",
    "runtimeReady",
    "runtimeCommandEnabled",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "runtimeExecuted",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "approvalEvaluatorAuthoritative"
  ]);


export { REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_RUNTIME_EFFECT_FIELDS };

function approvalPrerequisiteSourceSelectionSignature(readerInput) {
  return JSON.stringify(
    approvalPrerequisiteStableValue(readerInput?.prerequisiteRecords ?? [])
  );
}


export { approvalPrerequisiteSourceSelectionSignature };

function approvalPrerequisiteStableValue(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => approvalPrerequisiteStableValue(entry));
  }

  if (!isPlainObjectRecord(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, approvalPrerequisiteStableValue(value[key])])
  );
}


export { approvalPrerequisiteStableValue };

function approvalPrerequisiteBundleConsumptionAcceptedSummary({
  sourceBundle,
  evaluator
}) {
  return {
    selectedBundlePartId: sourceBundle.selectedBundlePartId,
    readerRecordCount: sourceBundle.bundledReaderInput.prerequisiteRecords.length,
    evaluatorClassification: evaluator.classification,
    prerequisiteSignalRecognized: evaluator.prerequisiteSignalRecognized,
    evaluatorReviewOnly: evaluator.reviewOnly,
    evaluatorAuthoritative: evaluator.authoritative
  };
}


export { approvalPrerequisiteBundleConsumptionAcceptedSummary };

const APPROVAL_PREREQUISITE_INTEGRATION_CLASSIFICATION_BY_BUNDLE =
  Object.freeze({
    missing_prerequisite_source_bundle_parts_rejected:
      "missing_prerequisite_integration_input_rejected",
    missing_required_prerequisite_source_bundle_part_rejected:
      "malformed_prerequisite_integration_input_rejected",
    malformed_prerequisite_source_bundle_part_rejected:
      "malformed_prerequisite_integration_input_rejected",
    conflicting_prerequisite_source_bundle_parts_rejected:
      "conflicting_prerequisite_integration_input_rejected",
    stale_prerequisite_source_bundle_rejected:
      "stale_prerequisite_integration_input_rejected",
    revoked_prerequisite_source_bundle_rejected:
      "revoked_prerequisite_integration_input_rejected",
    unknown_prerequisite_source_bundle_rejected:
      "unknown_prerequisite_integration_input_rejected",
    malformed_prerequisite_source_bundle_rejected:
      "malformed_prerequisite_integration_input_rejected",
    empty_prerequisite_source_bundle_rejected:
      "empty_prerequisite_integration_input_rejected"
  });


export { APPROVAL_PREREQUISITE_INTEGRATION_CLASSIFICATION_BY_BUNDLE };

const APPROVAL_PREREQUISITE_INTEGRATION_CLASSIFICATION_BY_CONSUMPTION =
  Object.freeze({
    missing_prerequisite_bundle_consumption_rejected:
      "missing_prerequisite_integration_input_rejected",
    malformed_prerequisite_bundle_consumption_rejected:
      "malformed_prerequisite_integration_input_rejected",
    conflicting_prerequisite_bundle_consumption_rejected:
      "conflicting_prerequisite_integration_input_rejected",
    valid_prerequisite_bundle_consumed_for_review_only_runtime_still_blocked:
      "valid_prerequisite_integration_review_summary_runtime_still_blocked"
  });


export { APPROVAL_PREREQUISITE_INTEGRATION_CLASSIFICATION_BY_CONSUMPTION };

function approvalPrerequisiteIntegrationReviewSummary(evaluator) {
  if (evaluator == null) {
    return null;
  }

  return {
    schema: evaluator.schema,
    evaluatorKind: evaluator.evaluatorKind,
    evaluationMode: evaluator.evaluationMode,
    classification: evaluator.classification,
    prerequisiteSignalRecognized: evaluator.prerequisiteSignalRecognized,
    reviewOnly: evaluator.reviewOnly,
    authoritative: evaluator.authoritative,
    reviewSummaryIsApprovalGrant: false,
    approvalGrantProduced: evaluator.approvalGrant.produced,
    approvalGrantPersisted: evaluator.approvalGrant.persisted,
    approvalGrantId: evaluator.approvalGrant.grantId,
    runtimeEffectAllFalse: reviewOnlyRuntimeEffectAllFalse(evaluator.runtimeEffect)
  };
}


export { approvalPrerequisiteIntegrationReviewSummary };

const MALFORMED_HUMAN_TOOL_INSPECTION_DISPOSITION_CLASSIFICATION =
  "malformed_human_tool_inspection_disposition_boundary_input_rejected";


export { MALFORMED_HUMAN_TOOL_INSPECTION_DISPOSITION_CLASSIFICATION };

function hasOwn(source, key) {
  return Object.prototype.hasOwnProperty.call(source, key);
}


export { hasOwn };

const MALFORMED_REVIEW_ONLY_DISPOSITION_AGGREGATION_CLASSIFICATION =
  "malformed_review_only_disposition_aggregation_checkpoint_input_rejected";


export { MALFORMED_REVIEW_ONLY_DISPOSITION_AGGREGATION_CLASSIFICATION };

const MALFORMED_REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_CLASSIFICATION =
  "malformed_review_only_aggregation_inspection_handoff_input_rejected";


export { MALFORMED_REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_CLASSIFICATION };

const MALFORMED_REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_CLASSIFICATION =
  "malformed_review_only_handoff_readiness_artifact_input_rejected";


export { MALFORMED_REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_CLASSIFICATION };

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_REVIEWER_ROUTING_FALSE_PATHS =
  Object.freeze([
    Object.freeze(["handoffIsReviewerRouting"]),
    Object.freeze(["reviewerRoutingPerformed"]),
    Object.freeze(["reviewerRoutingEnabled"])
  ]);


export { REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_REVIEWER_ROUTING_FALSE_PATHS };

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_REVIEWER_ROUTING_NULL_PATHS =
  Object.freeze([Object.freeze(["reviewerRouteId"])]);


export { REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_REVIEWER_ROUTING_NULL_PATHS };

const MALFORMED_REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_CLASSIFICATION =
  "malformed_review_only_readiness_inspection_checkpoint_input_rejected";


export { MALFORMED_REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_CLASSIFICATION };

const MALFORMED_REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_CLASSIFICATION =
  "malformed_review_only_readiness_handoff_disposition_input_rejected";


export { MALFORMED_REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_CLASSIFICATION };

const MALFORMED_REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_CLASSIFICATION =
  "malformed_review_only_handoff_disposition_inspection_checkpoint_input_rejected";


export { MALFORMED_REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_CLASSIFICATION };

const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_EXTERNAL_SYSTEM_KEYS =
  Object.freeze([
    "externalSystem",
    "externalSystemLookup",
    "externalRepo",
    "externalRepository",
    "externalSourceLookup",
    "externalSourceUrl",
    "externalSourceFilePath",
    "buildYourOwnOpenClaw",
    "goose",
    "onyx"
  ]);


export { REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_EXTERNAL_SYSTEM_KEYS };
