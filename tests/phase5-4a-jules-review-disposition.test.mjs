import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const reviewedPhase54Commit = "60176ca83afe1fcd11dc303b557e8a468ed3b3c0";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/command-surface/phase5-4a/jules-review-disposition.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "reviewer",
  "reviewedPhase",
  "reviewedBranch",
  "reviewedCommit",
  "reviewedBaseCommit",
  "disposition",
  "modeReview",
  "runtimeEffect",
  "reviewBoundary",
  "blockedCommandProbeNames",
  "nonExecutionInvariants",
  "validationCommands"
]);

const expectedRuntimeFalseFields = Object.freeze([
  "runtimeEnabled",
  "commandExposedToday",
  "runtimeCommandEnabled",
  "runtimeCommandExposureApproved",
  "runtimeCommandSurfaceApproved",
  "runtimeCommandSurfaceEnabled",
  "runtimeEnablementApproved",
  "approvalCommandEnabled",
  "cliSourceChanged",
  "stdoutStderrWritersEnabled",
  "processControlEnabled",
  "transcriptAuditSideEffectsEnabled",
  "adapterRuntimeBehaviorEnabled",
  "contentFabricRuntimeBehaviorEnabled"
]);

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function dispositionFailure(classification) {
  return { valid: false, classification, failClosed: true };
}

function dispositionSuccess() {
  return {
    valid: true,
    classification: "phase5_4a_jules_approved_runtime_still_blocked",
    failClosed: false,
    runtimeEnabled: false,
    commandExposedToday: false
  };
}

function classifyJulesDisposition(fixture) {
  if (fixture.disposition.verdict !== "APPROVE" || fixture.disposition.requestChanges !== false) {
    return dispositionFailure("jules_review_not_approved");
  }

  if (
    fixture.disposition.accidentalCommandRuntimeExposureFound !== false ||
    fixture.disposition.runtimeRemainsBlocked !== true ||
    fixture.disposition.commandExposureRemainsBlocked !== true
  ) {
    return dispositionFailure("review_disposition_does_not_preserve_blocked_runtime");
  }

  if (expectedRuntimeFalseFields.some((field) => fixture.runtimeEffect[field] !== false)) {
    return dispositionFailure("runtime_effect_enabled_by_review_disposition");
  }

  if (
    fixture.modeReview.expectedMode !== "100644" ||
    fixture.modeReview.modeOnCurrentMain !== "100644" ||
    fixture.modeReview.chmodCorrectionNeededOnCurrentMain !== false ||
    fixture.modeReview.chmodCorrectionAppliedByPhase54A !== false ||
    fixture.modeReview.contentChangedByPhase54A !== false
  ) {
    return dispositionFailure("apps_cli_index_mode_or_content_boundary_changed");
  }

  if (
    fixture.reviewBoundary.approvalDoesNotMean.includes("runtime-enabled") &&
    fixture.reviewBoundary.approvalDoesNotMean.includes("runtime-command-exposure-approved") &&
    fixture.reviewBoundary.requiredBeforeAnyRuntimeEnablement.includes("separate-runtime-enablement-review")
  ) {
    return dispositionSuccess();
  }

  return dispositionFailure("approval_boundary_missing_runtime_separation");
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

test("Phase 5.4A Jules disposition fixture is deterministic review metadata only", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(fixture.schema, "ardyn.phase-5.4a.jules-review-disposition");
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-5.4a-jules-review-disposition");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(fixture.reviewer, "Jules");
  assert.equal(fixture.reviewedCommit, reviewedPhase54Commit);
  assert.deepEqual(classifyJulesDisposition(fixture), dispositionSuccess());
});

test("Phase 5.4A approval does not imply runtime enablement or command exposure", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.equal(fixture.disposition.verdict, "APPROVE");
  assert.equal(fixture.disposition.mayProceedToNextStillDefaultBlockedCliCommandImplementationPhase, true);
  assert.deepEqual(fixture.runtimeEffect, Object.fromEntries(expectedRuntimeFalseFields.map((field) => [field, false])));

  for (const [label, mutate, classification] of [
    [
      "runtime enabled",
      (json) => (json.runtimeEffect.runtimeEnabled = true),
      "runtime_effect_enabled_by_review_disposition"
    ],
    [
      "command exposed today",
      (json) => (json.runtimeEffect.commandExposedToday = true),
      "runtime_effect_enabled_by_review_disposition"
    ],
    [
      "review says exposure found",
      (json) => (json.disposition.accidentalCommandRuntimeExposureFound = true),
      "review_disposition_does_not_preserve_blocked_runtime"
    ],
    [
      "approval boundary omits runtime separation",
      (json) => (json.reviewBoundary.approvalDoesNotMean = []),
      "approval_boundary_missing_runtime_separation"
    ]
  ]) {
    const mutated = clone(fixture);
    mutate(mutated);

    assert.deepEqual(classifyJulesDisposition(mutated), dispositionFailure(classification), label);
  }
});

test("Phase 5.4A confirms apps/cli/src/index.mjs mode is 100644 and content is unchanged", async () => {
  const fixture = await readJson(fixtureUrl);
  const { stdout: lsFilesStdout } = await execFileAsync("git", ["ls-files", "--stage", "apps/cli/src/index.mjs"], {
    cwd: repoRoot,
    encoding: "utf8"
  });

  assert.match(lsFilesStdout, /^100644 /);
  assert.equal(fixture.modeReview.modeOnCurrentMain, "100644");
  assert.equal(fixture.modeReview.chmodCorrectionNeededOnCurrentMain, false);
  assert.equal(fixture.modeReview.chmodCorrectionAppliedByPhase54A, false);

  const [{ stdout: reviewedContent }, currentContent] = await Promise.all([
    execFileAsync("git", ["show", `${reviewedPhase54Commit}:apps/cli/src/index.mjs`], {
      cwd: repoRoot,
      encoding: "utf8",
      maxBuffer: 1024 * 1024
    }),
    readFile(cliSourceUrl, "utf8")
  ]);

  assert.equal(currentContent, reviewedContent);
});

test("Phase 5.4A blocked command probes still reject nonzero with zero stdout", async () => {
  const [fixture, cliSource] = await Promise.all([readJson(fixtureUrl), readFile(cliSourceUrl, "utf8")]);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-4a-command-probes-"));

  try {
    assert.equal(new Set(fixture.blockedCommandProbeNames).size, fixture.blockedCommandProbeNames.length);

    for (const command of fixture.blockedCommandProbeNames) {
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
