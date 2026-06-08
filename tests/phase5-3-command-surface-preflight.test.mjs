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
const fixtureUrl = new URL(
  "../tests/fixtures/command-surface/phase5-3/command-surface-approval-preflight.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhases",
  "commandSurfaceApproval",
  "preflightStatus",
  "requiredBlockersBeforePreflightCanPass",
  "approvalBoundaryRequirements",
  "externalReviewRequirement",
  "runtimeEnablementStatus",
  "runtimeEffect",
  "candidateRuntimeCommands",
  "rejectionProbeExpectation",
  "nonExecutionInvariants",
  "validationCommands"
]);

const expectedCommandKeys = Object.freeze([
  "commandName",
  "allowedToday",
  "exposedToday",
  "requiredFuturePreconditions",
  "stdoutRule",
  "stderrRule",
  "dryRunBehavior",
  "approvalBoundaryRequirements",
  "rollbackBehavior",
  "externalReviewRequiredBeforeExposure"
]);

const expectedCandidateCommands = Object.freeze([
  "serve-runtime",
  "stdio-runtime",
  "replay-session-transcript",
  "runtime-command-surface-review",
  "command-surface-approval-preflight",
  "phase-5-3-command-surface-approval-preflight",
  "approve-runtime-command",
  "enable-runtime",
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

function commandNames(fixture) {
  return fixture.candidateRuntimeCommands.map(({ commandName }) => commandName);
}

function recordMatches(record, expected) {
  return Object.entries(expected).every(([field, value]) => record[field] === value);
}

function recordValuesAreFalse(record) {
  return Object.values(record).every((value) => value === false);
}

function preflightFailure(classification) {
  return { valid: false, classification, failClosed: true };
}

function blockedPreflightSuccess() {
  return {
    valid: true,
    classification: "command_surface_approved_for_preflight_runtime_still_disabled",
    failClosed: false,
    runtimeEnabled: false,
    preflightCanPass: false
  };
}

function readyPreflightSuccess(canPass) {
  return {
    valid: true,
    classification: "preflight_ready_runtime_enablement_still_requires_separate_phase",
    failClosed: false,
    runtimeEnabled: false,
    preflightCanPass: canPass
  };
}

function malformedPreflightClassification(fixture) {
  return recordMatches(fixture, {
    schema: "ardyn.phase-5.3.command-surface-approval-preflight",
    phase: "phase-5.3-command-surface-approval-preflight"
  })
    ? null
    : "malformed";
}

function approvalWidenedClassification(fixture) {
  const approval = fixture.commandSurfaceApproval;

  return recordMatches(approval, {
    approvalRecorded: true,
    candidateCommandNamesReviewed: true,
    runtimeEnablementStatus: false,
    runtimeEnabled: false,
    runtimeEnablementApproved: false,
    approvalGrantsRuntime: false,
    approvalCreatesRuntimeCommand: false
  })
    ? null
    : "command_surface_approval_widened_to_runtime";
}

function runtimeEnabledClassification(fixture) {
  const disabledChecks = [
    fixture.runtimeEnablementStatus === false,
    recordMatches(fixture.preflightStatus, {
      runtimeEnablementStatus: false,
      runtimeEnabled: false,
      candidateCommandsExposedToday: false
    }),
    recordValuesAreFalse(fixture.runtimeEffect)
  ];

  return disabledChecks.every(Boolean) ? null : "runtime_enablement_present";
}

function exposedCommandClassification(fixture) {
  const commandIsBlocked = (command) =>
    recordMatches(command, {
      allowedToday: false,
      exposedToday: false,
      externalReviewRequiredBeforeExposure: true
    });

  return fixture.candidateRuntimeCommands.every(commandIsBlocked)
    ? null
    : "future_command_reported_exposed_today";
}

function missingExternalReviewClassification(fixture) {
  return recordMatches(fixture.externalReviewRequirement, {
    required: true,
    externalReviewComplete: false,
    externalReviewMayGrantRuntimeEnablement: false
  })
    ? null
    : "external_review_requirement_missing";
}

function blockersRemain(fixture) {
  return Object.values(fixture.requiredBlockersBeforePreflightCanPass).some((value) => value !== true);
}

function blockersPassedClassification(fixture) {
  return blockersRemain(fixture) && fixture.preflightStatus.canPass !== false
    ? "preflight_passed_with_blockers_remaining"
    : null;
}

const preflightClassifiers = [
  malformedPreflightClassification,
  approvalWidenedClassification,
  runtimeEnabledClassification,
  exposedCommandClassification,
  missingExternalReviewClassification,
  blockersPassedClassification
];

function firstPreflightFailureClassification(fixture) {
  return preflightClassifiers.map((preflightClassifier) => preflightClassifier(fixture)).find(Boolean);
}

function preflightSuccess(fixture) {
  const blockersRemain = Object.values(fixture.requiredBlockersBeforePreflightCanPass).some(
    (value) => value !== true
  );

  return blockersRemain ? blockedPreflightSuccess() : readyPreflightSuccess(fixture.preflightStatus.canPass);
}

function classifyPreflight(fixture) {
  const failureClassification = firstPreflightFailureClassification(fixture);
  return failureClassification ? preflightFailure(failureClassification) : preflightSuccess(fixture);
}

async function runCliFailure(args, options = {}) {
  const result = await execFileAsync(process.execPath, [cliPath, ...args], {
    cwd: options.cwd ?? repoRoot,
    encoding: "utf8"
  }).then(
    (success) => ({ kind: "success", stdout: success.stdout }),
    (error) => ({ kind: "failure", error })
  );

  assert.equal(result.kind, "failure", `Expected ardyn ${args.join(" ")} to fail`);
  assert.equal(typeof result.error.code, "number", args.join(" "));
  assert.equal(typeof result.error.stdout, "string", args.join(" "));
  assert.equal(typeof result.error.stderr, "string", args.join(" "));

  return {
    code: result.error.code,
    stdout: result.error.stdout,
    stderr: result.error.stderr
  };
}

test("Phase 5.3 command-surface preflight fixture records runtime disabled", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.deepEqual(commandNames(fixture), expectedCandidateCommands);
  assert.equal(fixture.runtimeEnablementStatus, false);
  assert.equal(fixture.commandSurfaceApproval.runtimeEnablementStatus, false);
  assert.equal(fixture.commandSurfaceApproval.runtimeEnabled, false);
  assert.equal(fixture.preflightStatus.runtimeEnabled, false);
  assert.deepEqual(classifyPreflight(fixture), {
    valid: true,
    classification: "command_surface_approved_for_preflight_runtime_still_disabled",
    failClosed: false,
    runtimeEnabled: false,
    preflightCanPass: false
  });
});

test("Phase 5.3 command-surface approval does not imply runtime enablement", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.equal(fixture.commandSurfaceApproval.approvalRecorded, true);
  assert.equal(fixture.commandSurfaceApproval.candidateCommandNamesReviewed, true);
  assert.equal(fixture.commandSurfaceApproval.approvalGrantsRuntime, false);
  assert.equal(fixture.commandSurfaceApproval.approvalCreatesRuntimeCommand, false);
  assert.equal(fixture.preflightStatus.canPass, false);

  for (const [label, mutate, classification] of [
    [
      "approval grants runtime",
      (json) => (json.commandSurfaceApproval.approvalGrantsRuntime = true),
      "command_surface_approval_widened_to_runtime"
    ],
    [
      "runtime enabled by approval",
      (json) => (json.commandSurfaceApproval.runtimeEnabled = true),
      "command_surface_approval_widened_to_runtime"
    ],
    [
      "runtime enablement approved",
      (json) => (json.commandSurfaceApproval.runtimeEnablementApproved = true),
      "command_surface_approval_widened_to_runtime"
    ],
    ["runtime effect present", (json) => (json.runtimeEffect.runtimeEnabled = true), "runtime_enablement_present"],
    [
      "runtime command surface exposed",
      (json) => (json.runtimeEffect.runtimeCommandSurfaceExposed = true),
      "runtime_enablement_present"
    ]
  ]) {
    const mutated = clone(fixture);
    mutate(mutated);

    assert.deepEqual(
      classifyPreflight(mutated),
      { valid: false, classification, failClosed: true },
      label
    );
  }
});

test("Phase 5.3 future command names cannot be reported as exposed today", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.equal(new Set(commandNames(fixture)).size, fixture.candidateRuntimeCommands.length);

  for (const command of fixture.candidateRuntimeCommands) {
    assert.deepEqual(Object.keys(command), expectedCommandKeys, command.commandName);
    assert.match(command.commandName, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(command.allowedToday, false, command.commandName);
    assert.equal(command.exposedToday, false, command.commandName);
    assert.equal(command.stdoutRule, "zero_stdout_while_blocked", command.commandName);
    assert.equal(command.stderrRule, "usage_stderr_while_blocked", command.commandName);
    assert.equal(command.dryRunBehavior, "dry_run_variant_rejected_while_blocked", command.commandName);
    assert.ok(command.requiredFuturePreconditions.length >= 5, command.commandName);
    assert.ok(command.approvalBoundaryRequirements.length >= 3, command.commandName);
    assert.match(command.rollbackBehavior, /^must_/, command.commandName);
    assert.equal(command.externalReviewRequiredBeforeExposure, true, command.commandName);
  }

  for (const [label, mutate] of [
    ["allowed today", (json) => (json.candidateRuntimeCommands[0].allowedToday = true)],
    ["exposed today", (json) => (json.candidateRuntimeCommands[0].exposedToday = true)],
    ["global exposure", (json) => (json.preflightStatus.candidateCommandsExposedToday = true)]
  ]) {
    const mutated = clone(fixture);
    mutate(mutated);
    const classification = label === "global exposure"
      ? "runtime_enablement_present"
      : "future_command_reported_exposed_today";

    assert.deepEqual(
      classifyPreflight(mutated),
      { valid: false, classification, failClosed: true },
      label
    );
  }
});

test("Phase 5.3 preflight cannot pass while required blockers remain false", async () => {
  const fixture = await readJson(fixtureUrl);
  const blockerEntries = Object.entries(fixture.requiredBlockersBeforePreflightCanPass);

  assert.ok(blockerEntries.length >= 10);
  for (const [field, value] of blockerEntries) {
    assert.equal(value, false, field);
  }

  const passingWithBlockers = clone(fixture);
  passingWithBlockers.preflightStatus.canPass = true;
  assert.deepEqual(classifyPreflight(passingWithBlockers), {
    valid: false,
    classification: "preflight_passed_with_blockers_remaining",
    failClosed: true
  });

  const allBlockersResolved = clone(fixture);
  for (const field of Object.keys(allBlockersResolved.requiredBlockersBeforePreflightCanPass)) {
    allBlockersResolved.requiredBlockersBeforePreflightCanPass[field] = true;
  }
  assert.deepEqual(classifyPreflight(allBlockersResolved), {
    valid: true,
    classification: "preflight_ready_runtime_enablement_still_requires_separate_phase",
    failClosed: false,
    runtimeEnabled: false,
    preflightCanPass: false
  });
});

test("Phase 5.3 candidate commands still reject nonzero with zero stdout", async () => {
  const [fixture, cliSource] = await Promise.all([readJson(fixtureUrl), readFile(cliSourceUrl, "utf8")]);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-3-command-probes-"));

  try {
    assert.deepEqual(fixture.rejectionProbeExpectation, {
      exitCode: "nonzero",
      stdout: "empty",
      stderrPrefix: "Usage: ardyn ",
      scratchDirectoryWrites: "none",
      approvalGrantWrites: "none",
      runtimeStateWrites: "none",
      stackOrSecretLeakage: "none"
    });

    for (const command of commandNames(fixture)) {
      const escapedCommand = command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      assert.doesNotMatch(cliSource, new RegExp(`command === "${escapedCommand}"`), command);

      for (const args of [[command], [command, "--dry-run"]]) {
        const label = args.join(" ");
        const failure = await runCliFailure(args, { cwd: scratch });

        assert.notEqual(failure.code, 0, label);
        assert.equal(failure.stdout, "", label);
        assert.match(failure.stderr, /^Usage: ardyn /, label);
        assert.doesNotMatch(failure.stderr, /stack|process\.env|secret/i, label);
        assert.deepEqual(await readdir(scratch), [], `${label} should not write files`);
      }
    }
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});
