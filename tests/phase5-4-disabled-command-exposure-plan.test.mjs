import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const baseCliCommit = "e996996624edadbeb356d2834ff9fa605f6eed36";
const reviewedPhase54Commit = "60176ca83afe1fcd11dc303b557e8a468ed3b3c0";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/command-surface/phase5-4/disabled-command-exposure-plan.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhases",
  "runtimeExposureState",
  "futureExposurePhase",
  "futureFilesExpectedToChange",
  "filesForbiddenBeforeReview",
  "defaultRejectedUnavailableResult",
  "stdoutStderrRules",
  "dryRunBehavior",
  "approvalRequirements",
  "rollbackPlan",
  "candidateRuntimeCommands",
  "nonExecutionInvariants",
  "validationCommands"
]);

const expectedCommandKeys = Object.freeze([
  "commandName",
  "introducedBy",
  "runtimeEnabled",
  "commandExposedToday",
  "defaultResult",
  "stdoutRule",
  "stderrRule",
  "dryRunBehavior",
  "requiredBeforeExposure"
]);

const phase53CandidateCommandNames = Object.freeze([
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

const phase54CandidateCommandNames = Object.freeze([
  "disabled-command-exposure-plan",
  "phase-5-4-disabled-command-exposure-plan",
  "runtime-command-exposure-plan",
  "expose-runtime-commands",
  "runtime-command-exposure-review"
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

function exposureFailure(classification) {
  return { valid: false, classification, failClosed: true };
}

function exposureSuccess() {
  return {
    valid: true,
    classification: "disabled_command_exposure_plan_runtime_unavailable",
    failClosed: false,
    runtimeEnabled: false,
    commandExposedToday: false,
    externalReviewRequired: true
  };
}

function runtimeExposureWidenedClassification(fixture) {
  return recordMatches(fixture.runtimeExposureState, {
    runtimeEnabled: false,
    commandExposedToday: false,
    runtimeCommandsAvailable: false,
    runtimeCommandHandlersImplemented: false,
    runtimeCommandDispatchAdded: false,
    approvalGrantCreated: false,
    exposureComplete: false
  })
    ? null
    : "runtime_or_command_exposure_present";
}

function exposureCompleteClassification(fixture) {
  return fixture.runtimeExposureState.exposureComplete === false &&
    fixture.futureExposurePhase.mustNotMarkExposureCompleteBeforeReview === true
    ? null
    : "exposure_marked_complete_before_review";
}

function externalReviewClassification(fixture) {
  return recordMatches(fixture.futureExposurePhase, {
    mayExposeCommandsInThisPhase: false,
    julesReviewRequiredBeforeExposure: true,
    devinReviewRequiredBeforeExposure: true,
    externalReviewComplete: false,
    mustRecordReviewedBranchAndCommit: true
  }) &&
    fixture.futureExposurePhase.requiredReviewers.includes("Jules") &&
    fixture.futureExposurePhase.requiredReviewers.includes("Devin")
    ? null
    : "external_review_requirement_missing";
}

function commandExposureClassification(fixture) {
  const commandRemainsDisabled = (command) =>
    recordMatches(command, {
      runtimeEnabled: false,
      commandExposedToday: false,
      defaultResult: "rejected_unavailable_nonzero_zero_stdout",
      stdoutRule: "zero_stdout_while_disabled",
      stderrRule: "usage_stderr_while_disabled",
      dryRunBehavior: "dry_run_variant_rejected_while_disabled"
    }) &&
    command.requiredBeforeExposure.includes("jules-review-complete") &&
    command.requiredBeforeExposure.includes("devin-review-complete");

  return fixture.candidateRuntimeCommands.every(commandRemainsDisabled)
    ? null
    : "future_command_reported_exposed_or_missing_review";
}

function classifyDisabledExposurePlan(fixture) {
  for (const classifier of [
    runtimeExposureWidenedClassification,
    exposureCompleteClassification,
    externalReviewClassification,
    commandExposureClassification
  ]) {
    const classification = classifier(fixture);
    if (classification) {
      return exposureFailure(classification);
    }
  }

  return exposureSuccess();
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

test("Phase 5.4 disabled command exposure plan is deterministic runtime-unavailable metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(fixture.schema, "ardyn.phase-5.4.disabled-command-exposure-plan");
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-5.4-disabled-command-exposure-plan");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.deepEqual(commandNames(fixture), [...phase53CandidateCommandNames, ...phase54CandidateCommandNames]);
  assert.deepEqual(classifyDisabledExposurePlan(fixture), exposureSuccess());
});

test("Phase 5.4 records exact future files and files forbidden before review", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.futureFilesExpectedToChange, [
    "apps/cli/src/index.mjs",
    "tests/fixtures/command-surface/phase5-5/runtime-command-exposure-review.json",
    "tests/phase5-5-runtime-command-exposure-review.test.mjs",
    "docs/status/PHASE_5_5_RUNTIME_COMMAND_EXPOSURE_REVIEW.md"
  ]);
  assert.deepEqual(fixture.filesForbiddenBeforeReview, [
    "apps/cli/src/index.mjs",
    "apps/host/src/runtime/**",
    "packages/fabric/src/runtime/**",
    "docs/status/**",
    "tests/fixtures/command-surface/phase5-5/**"
  ]);
  assert.ok(fixture.nonExecutionInvariants.includes(
    `apps-cli-src-index-mjs-unchanged-from-${baseCliCommit}`
  ));
});

test("Phase 5.4 cannot expose commands or mark exposure complete before Jules and Devin review", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.equal(fixture.futureExposurePhase.julesReviewRequiredBeforeExposure, true);
  assert.equal(fixture.futureExposurePhase.devinReviewRequiredBeforeExposure, true);
  assert.equal(fixture.futureExposurePhase.externalReviewComplete, false);
  assert.equal(fixture.runtimeExposureState.exposureComplete, false);

  for (const [label, mutate, classification] of [
    [
      "runtime enabled",
      (json) => (json.runtimeExposureState.runtimeEnabled = true),
      "runtime_or_command_exposure_present"
    ],
    [
      "command exposed today",
      (json) => (json.runtimeExposureState.commandExposedToday = true),
      "runtime_or_command_exposure_present"
    ],
    [
      "exposure complete",
      (json) => (json.runtimeExposureState.exposureComplete = true),
      "runtime_or_command_exposure_present"
    ],
    [
      "review not required",
      (json) => (json.futureExposurePhase.julesReviewRequiredBeforeExposure = false),
      "external_review_requirement_missing"
    ],
    [
      "candidate exposed",
      (json) => (json.candidateRuntimeCommands[0].commandExposedToday = true),
      "future_command_reported_exposed_or_missing_review"
    ],
    [
      "candidate missing Devin review",
      (json) =>
        (json.candidateRuntimeCommands[0].requiredBeforeExposure =
          json.candidateRuntimeCommands[0].requiredBeforeExposure.filter((item) => item !== "devin-review-complete")),
      "future_command_reported_exposed_or_missing_review"
    ]
  ]) {
    const mutated = clone(fixture);
    mutate(mutated);

    assert.deepEqual(classifyDisabledExposurePlan(mutated), exposureFailure(classification), label);
  }
});

test("Phase 5.4 candidate commands remain runtime disabled and unavailable", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.equal(new Set(commandNames(fixture)).size, fixture.candidateRuntimeCommands.length);
  assert.deepEqual(fixture.defaultRejectedUnavailableResult, {
    exitCode: "nonzero",
    stdout: "",
    stderrPrefix: "Usage: ardyn ",
    runtimeAvailable: false,
    writes: [],
    approvalGrantWrites: [],
    runtimeStateWrites: []
  });
  assert.deepEqual(fixture.dryRunBehavior, {
    availableToday: false,
    dryRunVariantResult: "rejected_unavailable_nonzero_zero_stdout",
    mustNotWriteFiles: true,
    mustNotCreateApprovalGrant: true,
    mustNotReadOrWriteRuntimeState: true
  });

  for (const command of fixture.candidateRuntimeCommands) {
    assert.deepEqual(Object.keys(command), expectedCommandKeys, command.commandName);
    assert.match(command.commandName, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(command.runtimeEnabled, false, command.commandName);
    assert.equal(command.commandExposedToday, false, command.commandName);
    assert.equal(command.defaultResult, "rejected_unavailable_nonzero_zero_stdout", command.commandName);
    assert.equal(command.stdoutRule, "zero_stdout_while_disabled", command.commandName);
    assert.equal(command.stderrRule, "usage_stderr_while_disabled", command.commandName);
    assert.equal(command.dryRunBehavior, "dry_run_variant_rejected_while_disabled", command.commandName);
    assert.ok(command.requiredBeforeExposure.includes("jules-review-complete"), command.commandName);
    assert.ok(command.requiredBeforeExposure.includes("devin-review-complete"), command.commandName);
  }
});

test("Phase 5.4 does not change apps/cli/src/index.mjs from the base runtime-disabled CLI", async () => {
  await execFileAsync(
    "git",
    ["diff", "--quiet", baseCliCommit, reviewedPhase54Commit, "--", "apps/cli/src/index.mjs"],
    {
      cwd: repoRoot,
      encoding: "utf8"
    }
  );
});

test("Phase 5.4 candidate command names reject nonzero with zero stdout and no side effects", async () => {
  const [fixture, cliSource] = await Promise.all([readJson(fixtureUrl), readFile(cliSourceUrl, "utf8")]);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-4-command-probes-"));

  try {
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
