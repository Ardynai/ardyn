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
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const boundaryUrl = new URL(
  "../tests/fixtures/host-policy/phase5-2/guarded-runtime-default-blocked-boundary.json",
  import.meta.url
);
const commandMatrixUrl = new URL(
  "../tests/fixtures/command-surface/phase5-2/runtime-command-rejection-matrix.json",
  import.meta.url
);

const expectedBoundaryKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourceApprovalBoundary",
  "runtimeDefaultState",
  "approvalBoundaryChecks",
  "blockedPathExpectedErrors",
  "approvalGrantState",
  "commandSurfaceState",
  "sideEffectState",
  "runtimeEffect",
  "candidateRuntimeCommandsFixture",
  "nonExecutionInvariants",
  "validationCommands"
]);

const requiredApprovalBoundaryChecks = Object.freeze([
  "required",
  "checkedBeforeRuntimeStart",
  "checkedBeforeCommandSurfaceExposure",
  "checkedBeforeApprovalGrantCreation"
]);

const runtimeDefaultForbiddenFlags = Object.freeze([
  "runtimeEnabled",
  "runtimeStarted",
  "runtimeReady",
  "runtimeGrantPresent",
  "commandSurfacePresent"
]);

const candidateRuntimeCommands = Object.freeze([
  "serve-runtime",
  "stdio-runtime",
  "replay-session-transcript",
  "external-review-packet",
  "review-packet",
  "runtime-readiness-review",
  "grant-runtime",
  "runtime-implementation-approval",
  "runtime-command-surface-review",
  "controlled-runtime-implementation-approval",
  "approve-runtime-implementation",
  "approve-runtime-command",
  "approve-runtime",
  "enable-runtime",
  "phase-5-runtime",
  "phase-5-1-runtime",
  "phase-5-2-runtime",
  "phase-5-2-guarded-runtime",
  "guarded-runtime-implementation",
  "runtime-start",
  "runtime-stop",
  "runtime-status",
  "runtime-rollback",
  "runtime-failure-audit"
]);

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertRecordValues(record, expected, label) {
  for (const [field, value] of Object.entries(record)) {
    assert.equal(value, expected[field] ?? false, `${label}.${field}`);
  }
}

function boundaryFailure(classification, error) {
  return {
    valid: false,
    classification,
    error,
    failClosed: true
  };
}

function boundarySuccess() {
  return {
    valid: true,
    classification: "runtime_blocked_by_default_approval_boundary_required",
    runtimeEnabled: false,
    approvalGrantCreated: false,
    commandSurfaceExists: false,
    sideEffectsAllowed: false,
    failClosed: false
  };
}

function classifyPhase52Boundary(fixture) {
  const checks = [
    {
      failed: () =>
        fixture.schema !== "ardyn.phase-5.2.guarded-runtime-default-blocked-boundary" ||
        fixture.phase !== "phase-5.2-guarded-runtime-implementation-slice",
      classification: "malformed",
      error: () => "PHASE5_2_FIXTURE_MALFORMED"
    },
    {
      failed: () => requiredApprovalBoundaryChecks.some((field) => fixture.approvalBoundaryChecks[field] !== true),
      classification: "approval_boundary_check_missing",
      error: () => fixture.blockedPathExpectedErrors.missingApprovalBoundary.code
    },
    {
      failed: () =>
        fixture.runtimeDefaultState.runtimeBlocked !== true ||
        runtimeDefaultForbiddenFlags.some((field) => fixture.runtimeDefaultState[field]),
      classification: "runtime_default_not_blocked",
      error: () => "PHASE5_2_RUNTIME_DEFAULT_NOT_BLOCKED"
    },
    {
      failed: () =>
        Object.values(fixture.approvalGrantState).some(Boolean) || fixture.sourceApprovalBoundary.runtimeApprovalGranted,
      classification: "approval_grant_created",
      error: () => fixture.blockedPathExpectedErrors.approvalGrantAttempt.code
    },
    {
      failed: () => Object.values(fixture.commandSurfaceState).some(Boolean),
      classification: "command_surface_exists",
      error: () => fixture.blockedPathExpectedErrors.commandSurfaceAttempt.code
    },
    {
      failed: () => Object.values(fixture.sideEffectState).some(Boolean) || Object.values(fixture.runtimeEffect).some(Boolean),
      classification: "side_effect_or_runtime_effect_present",
      error: () => fixture.blockedPathExpectedErrors.sideEffectAttempt.code
    }
  ];
  const failedCheck = checks.find((check) => check.failed());

  return failedCheck ? boundaryFailure(failedCheck.classification, failedCheck.error()) : boundarySuccess();
}

async function runCliFailure(args, options = {}) {
  const result = await execFileAsync(process.execPath, [cliPath, ...args], {
    cwd: options.cwd ?? repoRoot,
    encoding: "utf8"
  }).then(
    (success) => ({
      kind: "success",
      stdout: success.stdout
    }),
    (error) => ({
      kind: "failure",
      failure: {
        code: error.code,
        stdout: error.stdout,
        stderr: error.stderr
      }
    })
  );

  assert.deepEqual(
    { kind: result.kind, stdout: result.stdout },
    { kind: "failure", stdout: undefined },
    `Expected ardyn ${args.join(" ")} to fail`
  );
  assert.equal(typeof result.failure.code, "number", args.join(" "));
  assert.equal(typeof result.failure.stdout, "string", args.join(" "));
  assert.equal(typeof result.failure.stderr, "string", args.join(" "));

  return result.failure;
}

test("Phase 5.2 blocked-runtime fixture is deterministic and disabled by default", async () => {
  const raw = await readFile(boundaryUrl, "utf8");
  const fixture = await readJson(boundaryUrl);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedBoundaryKeys);
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(fixture.sourceApprovalBoundary.sourcePhase, "phase-5.1-controlled-runtime-implementation-approval");
  assert.equal(fixture.sourceApprovalBoundary.runtimeImplementationApproved, false);
  assert.equal(fixture.sourceApprovalBoundary.runtimeEnablementApproved, false);
  assert.equal(fixture.sourceApprovalBoundary.runtimeApprovalGranted, false);
  assert.equal(fixture.runtimeDefaultState.status, "blocked_by_default");
  assert.equal(fixture.runtimeDefaultState.runtimeBlocked, true);
  assertRecordValues(fixture.approvalGrantState, {}, "approvalGrantState");
  assertRecordValues(fixture.commandSurfaceState, { exists: false }, "commandSurfaceState");
  assertRecordValues(fixture.sideEffectState, {}, "sideEffectState");
  assertRecordValues(fixture.runtimeEffect, {}, "runtimeEffect");
  assert.deepEqual(classifyPhase52Boundary(fixture), {
    valid: true,
    classification: "runtime_blocked_by_default_approval_boundary_required",
    runtimeEnabled: false,
    approvalGrantCreated: false,
    commandSurfaceExists: false,
    sideEffectsAllowed: false,
    failClosed: false
  });
});

test("Phase 5.2 approval-boundary checks are required and fail closed deterministically", async () => {
  const fixture = await readJson(boundaryUrl);

  for (const [label, mutate, expected] of [
    [
      "missing approval boundary requirement",
      (json) => (json.approvalBoundaryChecks.required = false),
      "PHASE5_2_APPROVAL_BOUNDARY_REQUIRED"
    ],
    [
      "runtime start check omitted",
      (json) => (json.approvalBoundaryChecks.checkedBeforeRuntimeStart = false),
      "PHASE5_2_APPROVAL_BOUNDARY_REQUIRED"
    ],
    [
      "runtime enabled by default",
      (json) => (json.runtimeDefaultState.runtimeEnabled = true),
      "PHASE5_2_RUNTIME_DEFAULT_NOT_BLOCKED"
    ],
    [
      "approval grant created",
      (json) => (json.approvalGrantState.grantCreated = true),
      "PHASE5_2_RUNTIME_GRANT_FORBIDDEN"
    ],
    [
      "command surface added",
      (json) => (json.commandSurfaceState.cliCommandsAdded = true),
      "PHASE5_2_COMMAND_SURFACE_FORBIDDEN"
    ],
    [
      "side effect introduced",
      (json) => (json.sideEffectState.filesWritten = true),
      "PHASE5_2_SIDE_EFFECT_FORBIDDEN"
    ],
    [
      "runtime effect introduced",
      (json) => (json.runtimeEffect.processControlAdded = true),
      "PHASE5_2_SIDE_EFFECT_FORBIDDEN"
    ]
  ]) {
    const mutated = clone(fixture);
    mutate(mutated);
    const result = classifyPhase52Boundary(mutated);

    assert.equal(result.valid, false, label);
    assert.equal(result.error, expected, label);
    assert.equal(result.failClosed, true, label);
  }

  assert.deepEqual(fixture.blockedPathExpectedErrors.missingApprovalBoundary, {
    code: "PHASE5_2_APPROVAL_BOUNDARY_REQUIRED",
    message: "Phase 5.2 guarded runtime remains blocked until a fresh approval-boundary check passes.",
    stdout: "",
    sideEffects: []
  });
  assert.deepEqual(fixture.blockedPathExpectedErrors.approvalGrantAttempt.sideEffects, []);
  assert.deepEqual(fixture.blockedPathExpectedErrors.commandSurfaceAttempt.sideEffects, []);
  assert.deepEqual(fixture.blockedPathExpectedErrors.sideEffectAttempt.sideEffects, []);
});

test("Phase 5.2 command matrix enumerates candidate runtime commands as blocked", async () => {
  const raw = await readFile(commandMatrixUrl, "utf8");
  const matrix = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.equal(matrix.schema, "ardyn.phase-5.2.runtime-command-rejection-matrix");
  assert.equal(matrix.phase, "phase-5.2-guarded-runtime-implementation-slice");
  assert.deepEqual(matrix.candidateRuntimeCommands, candidateRuntimeCommands);
  assert.equal(new Set(matrix.candidateRuntimeCommands).size, candidateRuntimeCommands.length);
  assert.deepEqual(matrix.scope, {
    status: "blocked",
    runtimeBlockedByDefault: true,
    approvalBoundaryChecksRequired: true,
    approvalGrantCreated: false,
    commandSurfaceExists: false,
    sideEffectsAllowed: false,
    candidateCommandsExposed: false
  });
  assert.deepEqual(matrix.rejectionProbeExpectation, {
    exitCode: "nonzero",
    stdout: "empty",
    stderrPrefix: "Usage: ardyn ",
    scratchDirectoryWrites: "none",
    approvalGrantWrites: "none",
    stackOrSecretLeakage: "none"
  });
  assert.equal(matrix.perCommandExpectation.deterministicErrorCode, "ARDYN_CLI_USAGE");
  assert.equal(matrix.perCommandExpectation.sideEffectBehavior, "no_files_no_grants_no_runtime_state");
});

test("Phase 5.2 candidate runtime commands and dry-run variants remain rejected with no side effects", async () => {
  const [matrix, cliSource] = await Promise.all([readJson(commandMatrixUrl), readFile(cliSourceUrl, "utf8")]);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-2-command-probes-"));

  try {
    for (const command of matrix.candidateRuntimeCommands) {
      const escapedCommand = command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      assert.doesNotMatch(cliSource, new RegExp(`command === "${escapedCommand}"`), command);

      for (const args of [[command], [command, "--dry-run"]]) {
        const failure = await runCliFailure(args, { cwd: scratch });

        assert.notEqual(failure.code, 0, args.join(" "));
        assert.equal(failure.stdout, "", args.join(" "));
        assert.match(failure.stderr, /^Usage: ardyn /, args.join(" "));
        assert.doesNotMatch(failure.stderr, /stack|process\.env|secret/i, args.join(" "));
        assert.deepEqual(await readdir(scratch), [], `${args.join(" ")} should not write files`);
      }
    }
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});
