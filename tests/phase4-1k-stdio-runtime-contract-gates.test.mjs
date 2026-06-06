import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase4-1k/stdio-runtime-contract-gates.json",
  import.meta.url
);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);

const topLevelOrder = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "contractBoundary",
  "externalReview",
  "approvalState",
  "gateChecklist",
  "runtimeEffect",
  "nonExecutionInvariants",
  "audit"
]);

const requiredGateIds = Object.freeze([
  "policy-approval",
  "exact-scope-host-policy-approval-record",
  "operator-consent",
  "stdio-contract",
  "process-lifecycle",
  "transcript-persistence",
  "redaction",
  "failure-audit",
  "kill-semantics",
  "external-review-freshness",
  "runtime-readiness-review",
  "cli-surface-review",
  "rollback-plan",
  "external-integration-gates"
]);

const allowedEvidenceReadyGateIds = new Set([
  "policy-approval",
  "exact-scope-host-policy-approval-record",
  "operator-consent",
  "stdio-contract",
  "transcript-persistence",
  "redaction",
  "failure-audit",
  "kill-semantics",
  "rollback-plan"
]);

const blockedRuntimeSurfaces = Object.freeze([
  "serve-runtime-command",
  "stdio-runtime-command",
  "replay-session-transcript-command",
  "external-review-packet-command",
  "review-packet-command",
  "runtime-readiness-review-command",
  "stdio-runtime-contract-command",
  "runtime-contract-gates-command",
  "approve-runtime-command",
  "grant-runtime-command",
  "enable-runtime-command",
  "approval-evaluator",
  "host-policy-runtime-enforcement",
  "process-lifecycle-runtime",
  "process-stdio-ownership",
  "stdin-reader",
  "stdout-writer",
  "stderr-writer",
  "transcript-persistence-runtime",
  "transcript-replay-runtime",
  "redaction-runtime-enforcement",
  "failure-audit-runtime",
  "cleanup-runtime",
  "process-kill-runtime",
  "external-integration-runtime",
  "websocket-http-control-surface",
  "adapter-calls",
  "locus-runtime-dependency",
  "mcp-openclaw-calls",
  "plugin-execution",
  "content-fabric-runtime-behavior",
  "secrets-production-signing-keys",
  "runtime-approval-grant"
]);

const runtimeLikeCommands = Object.freeze([
  "serve-runtime",
  "stdio-runtime",
  "replay-session-transcript",
  "external-review-packet",
  "review-packet",
  "runtime-readiness-review",
  "stdio-runtime-contract",
  "runtime-contract-gates",
  "approve-runtime",
  "grant-runtime",
  "enable-runtime"
]);

async function readFixture() {
  const text = await readFile(fixtureUrl, "utf8");
  return { text, json: JSON.parse(text) };
}

async function runCliFailure(args, options = {}) {
  try {
    const result = await execFileAsync(process.execPath, [cliPath, ...args], {
      cwd: options.cwd ?? repoRoot,
      encoding: "utf8"
    });
    assert.fail(`Expected ardyn ${args.join(" ")} to fail, got stdout: ${result.stdout}`);
  } catch (error) {
    if (typeof error.code !== "number" || error.stdout === undefined || error.stderr === undefined) {
      throw error;
    }

    return {
      code: error.code,
      stdout: error.stdout,
      stderr: error.stderr
    };
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function hasRuntimeApprovalAttempt(record) {
  const gateAttemptsRuntime = (record.gateChecklist ?? []).some((gate) => {
    if (gate.status === "evidence-ready" && gate.staticContractEvidenceOnly !== true) {
      return true;
    }

    return (
      gate.status === "approved" ||
      gate.status === "runtime-approved" ||
      gate.status === "implemented" ||
      gate.status === "enabled" ||
      gate.runtimeImplemented === true ||
      gate.runtimeEnabled === true ||
      gate.runtimeApprovalGranted === true ||
      gate.runtimeImplementationApproved === true ||
      gate.runtimeEnablementApproved === true ||
      gate.grantsRuntimeApproval === true ||
      gate.runtimeBehaviorIntroduced === true
    );
  });

  const runtimeFlags = [
    record.contractBoundary?.runtimeImplemented,
    record.contractBoundary?.runtimeEnabled,
    record.contractBoundary?.runtimeImplementationApproved,
    record.contractBoundary?.runtimeEnablementApproved,
    record.contractBoundary?.runtimeApprovalGrantPresent,
    record.externalReview?.freshExternalReviewRecorded,
    record.externalReview?.freshDevinReviewRecorded,
    record.approvalState?.operatorRuntimeConsentRecorded,
    record.approvalState?.runtimeApprovalGrantPresent,
    record.approvalState?.runtimeApprovalGrantValid,
    record.approvalState?.runtimeApprovalGranted,
    record.approvalState?.runtimeImplementationApproved,
    record.approvalState?.runtimeEnablementApproved,
    ...Object.values(record.runtimeEffect?.runtime ?? {})
  ];

  const allowedFutureApprovalTrueFields = new Set([
    "policyApprovalRequiredBeforeRuntime",
    "exactScopeHostPolicyApprovalRecordRequiredBeforeRuntime",
    "operatorConsentRequiredBeforeRuntime",
    "freshExternalReviewRequiredBeforeRuntime",
    "freshDevinReviewRequiredBeforeRuntime",
    "runtimeReadinessReviewRequiredBeforeRuntime",
    "cliSurfaceReviewRequiredBeforeRuntime",
    "rollbackPlanRequiredBeforeRuntime",
    "externalIntegrationApprovalRequiredBeforeRuntime",
    "futureApprovalBooleansDoNotGrantRuntime"
  ]);
  const futureApprovalAttemptsRuntime = Object.entries(
    record.runtimeEffect?.requiredFutureApprovals ?? {}
  ).some(([field, value]) => value === true && !allowedFutureApprovalTrueFields.has(field));

  return runtimeFlags.some((value) => value === true) || gateAttemptsRuntime || futureApprovalAttemptsRuntime;
}

function classifyRuntimeContractGatesForReview(record) {
  if (
    record?.schema !== "ardyn.phase-4.1k.stdio-runtime-contract-gates" ||
    record?.schemaVersion !== "0.1.0" ||
    record?.phase !== "phase-4.1k-stdio-runtime-contract-gates" ||
    record?.artifactKind !== "approval-gated-public-rust-stdio-runtime-contract" ||
    record?.contractBoundary?.publicRustContractIntroduced !== true ||
    !Array.isArray(record?.gateChecklist) ||
    !Array.isArray(record?.nonExecutionInvariants)
  ) {
    return { classification: "malformed", valid: false, failClosed: true };
  }

  if (hasRuntimeApprovalAttempt(record)) {
    return {
      classification: "runtime_unavailable",
      valid: false,
      failClosed: true,
      runtimeAvailable: false
    };
  }

  return {
    classification: "runtime_contract_gates_only",
    valid: true,
    failClosed: false,
    runtimeAvailable: false
  };
}

function assertNoGateGrantsRuntime(gate) {
  assert.equal(gate.requiredBeforeRuntime, true, gate.id);
  assert.equal(gate.futureApprovalRequired, true, gate.id);
  assert.equal(gate.runtimeImplemented, false, gate.id);
  assert.equal(gate.runtimeEnabled, false, gate.id);
  assert.equal(gate.runtimeApprovalGranted, false, gate.id);
  assert.equal(gate.grantsRuntimeApproval, false, gate.id);
  assert.equal(gate.runtimeBehaviorIntroduced, false, gate.id);

  if (gate.status === "evidence-ready") {
    assert.equal(allowedEvidenceReadyGateIds.has(gate.id), true, gate.id);
    assert.equal(gate.staticContractEvidenceOnly, true, gate.id);
    return;
  }

  assert.ok(["blocked", "not-approved"].includes(gate.status), gate.id);
  assert.equal(gate.staticContractEvidenceOnly, false, gate.id);
}

test("Phase 4.1K runtime contract gates fixture is deterministic LF-only metadata", async () => {
  const { text, json } = await readFixture();

  assert.equal(text.endsWith("\n"), true);
  assert.equal(text.includes("\r"), false);
  assert.deepEqual(Object.keys(json), topLevelOrder);
  assert.equal(json.schema, "ardyn.phase-4.1k.stdio-runtime-contract-gates");
  assert.equal(json.schemaVersion, "0.1.0");
  assert.equal(json.phase, "phase-4.1k-stdio-runtime-contract-gates");
  assert.equal(json.artifactKind, "approval-gated-public-rust-stdio-runtime-contract");
  assert.equal(json.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.deepEqual(classifyRuntimeContractGatesForReview(json), {
    classification: "runtime_contract_gates_only",
    valid: true,
    failClosed: false,
    runtimeAvailable: false
  });
});

test("Phase 4.1K required gate ids are present and stable", async () => {
  const { json } = await readFixture();

  assert.deepEqual(
    json.gateChecklist.map((gate) => gate.id),
    requiredGateIds
  );

  for (const gate of json.gateChecklist) {
    assert.equal(typeof gate.label, "string", gate.id);
    assert.ok(gate.label.length > 0, gate.id);
    assert.deepEqual(gate.evidencePaths.every((path) => typeof path === "string"), true, gate.id);
    assertNoGateGrantsRuntime(gate);
  }
});

test("Phase 4.1K fixture records public Rust contract without runtime enablement", async () => {
  const { json } = await readFixture();

  assert.deepEqual(json.contractBoundary, {
    publicRustContractIntroduced: true,
    publicRustContractScope: "static-approval-gated-contract-only",
    runtimeImplemented: false,
    runtimeEnabled: false,
    runtimeImplementationApproved: false,
    runtimeEnablementApproved: false,
    runtimeApprovalGrantPresent: false,
    staticContractEvidenceOnly: true
  });
  assert.equal(json.externalReview.freshExternalReviewRecorded, false);
  assert.equal(json.externalReview.freshDevinReviewRecorded, false);
  assert.equal(json.externalReview.freshReviewRequiredButNotRuntimeGrant, true);
  assert.equal(json.approvalState.runtimeApprovalGrantPresent, false);
  assert.equal(json.approvalState.runtimeApprovalGrantValid, false);
  assert.equal(json.approvalState.runtimeApprovalGranted, false);
  assert.equal(json.approvalState.runtimeImplementationApproved, false);
  assert.equal(json.approvalState.runtimeEnablementApproved, false);
});

test("Phase 4.1K runtime effect keeps runtime booleans false and future approvals non-granting", async () => {
  const { json } = await readFixture();

  for (const [field, value] of Object.entries(json.runtimeEffect.runtime)) {
    assert.equal(value, false, `runtimeEffect.runtime.${field}`);
  }

  for (const [field, value] of Object.entries(json.runtimeEffect.requiredFutureApprovals)) {
    if (field.endsWith("RequiredBeforeRuntime") || field === "futureApprovalBooleansDoNotGrantRuntime") {
      assert.equal(value, true, `runtimeEffect.requiredFutureApprovals.${field}`);
    } else {
      assert.equal(value, false, `runtimeEffect.requiredFutureApprovals.${field}`);
    }
  }

  assert.deepEqual(json.nonExecutionInvariants, blockedRuntimeSurfaces);
});

test("Phase 4.1K mutated approval or runtime attempts fail closed", async () => {
  const { json } = await readFixture();
  const mutations = [
    ["approvalState.runtimeApprovalGranted", (record) => {
      record.approvalState.runtimeApprovalGranted = true;
    }],
    ["approvalState.runtimeApprovalGrantPresent", (record) => {
      record.approvalState.runtimeApprovalGrantPresent = true;
    }],
    ["contractBoundary.runtimeImplemented", (record) => {
      record.contractBoundary.runtimeImplemented = true;
    }],
    ["contractBoundary.runtimeEnabled", (record) => {
      record.contractBoundary.runtimeEnabled = true;
    }],
    ["gate grantsRuntimeApproval", (record) => {
      record.gateChecklist.find((gate) => gate.id === "stdio-contract").grantsRuntimeApproval = true;
    }],
    ["gate status approved", (record) => {
      record.gateChecklist.find((gate) => gate.id === "cli-surface-review").status = "approved";
    }],
    ["runtimeEffect.runtime.stdioRuntimeCommandAvailable", (record) => {
      record.runtimeEffect.runtime.stdioRuntimeCommandAvailable = true;
    }],
    ["runtimeEffect.requiredFutureApprovals.runtimeApprovalGranted", (record) => {
      record.runtimeEffect.requiredFutureApprovals.runtimeApprovalGranted = true;
    }],
    ["runtimeEffect.requiredFutureApprovals.unscopedApprovalRecorded", (record) => {
      record.runtimeEffect.requiredFutureApprovals.unscopedApprovalRecorded = true;
    }]
  ];

  for (const [label, mutate] of mutations) {
    const mutated = clone(json);
    mutate(mutated);
    const result = classifyRuntimeContractGatesForReview(mutated);

    assert.equal(result.classification, "runtime_unavailable", label);
    assert.equal(result.valid, false, label);
    assert.equal(result.failClosed, true, label);
    assert.equal(result.runtimeAvailable, false, label);
  }

  const malformed = clone(json);
  malformed.schema = "ardyn.phase-4.1k.runtime-approval-grant";
  assert.deepEqual(classifyRuntimeContractGatesForReview(malformed), {
    classification: "malformed",
    valid: false,
    failClosed: true
  });
});

test("Phase 4.1K runtime-like commands remain rejected with zero stdout", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase4-1k-probes-"));

  try {
    for (const command of runtimeLikeCommands) {
      const failure = await runCliFailure([command], { cwd: scratch });

      assert.notEqual(failure.code, 0, command);
      assert.equal(failure.stdout, "", command);
      assert.match(failure.stderr, /^Usage: ardyn /, command);
      assert.doesNotMatch(failure.stderr, /stack|process\.env|secret/i, command);
      assert.deepEqual(await readdir(scratch), [], `${command} should not write files`);
    }
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("Phase 4.1K source guard keeps CLI command list unchanged", async () => {
  const cliSource = await readFile(cliSourceUrl, "utf8");
  const commandBranches = [...cliSource.matchAll(/if \(command === "([^"]+)"\)/g)].map(
    (match) => match[1]
  );
  const usage = cliSource.match(/Usage: ardyn <([^"]+)>/)?.[1] ?? "";

  assert.deepEqual(commandBranches, [
    "doctor",
    "identity",
    "capabilities",
    "plan",
    "review-trace",
    "review-artifact",
    "validate-session-transcript",
    "emit-session-events",
    "serve"
  ]);

  for (const command of runtimeLikeCommands) {
    const escapedCommand = command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.doesNotMatch(cliSource, new RegExp(`command === "${escapedCommand}"`));
    assert.doesNotMatch(usage, new RegExp(`(^|\\||<)${escapedCommand}(\\||>|\\s|$)`));
  }
});
