import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";

import {
  buildApprovalReviewArtifactDisplaySummary,
  buildSessionTranscriptSummary,
  buildMigrationAttestationDisplaySummary,
  buildReviewArtifactAttestationPlan,
  buildSchemaMigrationMetadataRecord,
  classifyApprovalReviewArtifactCompatibility,
  classifySessionTranscript,
  explainSessionTranscript,
  normalizeApprovalReviewArtifactForDisplay,
  validateSessionTranscript,
  validateApprovalReviewArtifactVersion
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);

async function runCli(args) {
  const result = await execFileAsync(process.execPath, ["apps/cli/src/index.mjs", ...args], {
    cwd: process.cwd(),
    encoding: "utf8"
  });

  return JSON.parse(result.stdout);
}

async function runCliFailure(args) {
  let result;

  try {
    result = await execFileAsync(process.execPath, ["apps/cli/src/index.mjs", ...args], {
      cwd: process.cwd(),
      encoding: "utf8"
    });
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

  assert.fail(`Expected ardyn ${args.join(" ")} to fail, got stdout: ${result.stdout}`);
}

function assertCliFailure(failure, stderrPattern) {
  assert.notEqual(failure.code, 0);
  assert.equal(failure.stdout, "");
  assert.match(failure.stderr, stderrPattern);
}

function assertAllFalse(flags) {
  for (const [key, value] of Object.entries(flags)) {
    assert.equal(value, false, `${key} should remain false`);
  }
}

function assertNoSecretTerms(value) {
  const text = JSON.stringify(value).toLowerCase();

  for (const forbidden of ["privatekey", "private_key", "secret", "token", "password"]) {
    assert.equal(text.includes(forbidden), false, `${forbidden} should not appear in output`);
  }
}

const minimalManifestPath = "examples/minimal-manifest/ardyn.manifest.json";
const minimalTaskPath = "examples/minimal-task/task.json";
const planningManifestPath = "tests/fixtures/planning-manifest.json";
const exactMatchTaskPath = "tests/fixtures/tasks/exact-match.json";
const approvalRequiredTaskPath = "tests/fixtures/tasks/approval-required.json";
const traceLeftPath = "tests/fixtures/trace-comparison/left-approval-review-artifact.json";
const traceRightPath = "tests/fixtures/trace-comparison/right-approval-review-artifact.json";
const invalidReviewArtifactPath = "tests/fixtures/review-artifacts/invalid-execution-enabled.json";
const phase36ReviewArtifactPath = "tests/fixtures/review-artifacts/phase3-6/current-compatible-v1.json";
const phase36UnknownFieldsArtifactPath =
  "tests/fixtures/review-artifacts/phase3-6/compatible-unknown-fields.json";
const phase36UnsupportedMajorArtifactPath =
  "tests/fixtures/review-artifacts/phase3-6/unsupported-major-v2.json";
const phase36MalformedArtifactPath = "tests/fixtures/review-artifacts/phase3-6/malformed-missing-version.json";
const phase37ReviewArtifactPath =
  "tests/fixtures/review-artifacts/phase3-7/current-compatible-review-artifact.json";
const phase37OlderReviewArtifactPath =
  "tests/fixtures/review-artifacts/phase3-7/older-compatible-review-artifact.json";
const phase37UnsupportedMajorArtifactPath =
  "tests/fixtures/review-artifacts/phase3-7/unsupported-major-review-artifact.json";
const phase37MalformedArtifactPath =
  "tests/fixtures/review-artifacts/phase3-7/malformed-review-artifact.json";
const validMinimalTranscriptPath = "examples/session-transcripts/valid-minimal.json";
const invalidOutOfOrderTranscriptPath = "examples/session-transcripts/invalid-out-of-order-sequence.json";
const invalidMissingStartedTranscriptPath =
  "examples/session-transcripts/invalid-missing-session-started.json";
const invalidSourceHarnessTranscriptPath = "examples/session-transcripts/invalid-source-harness.json";
const invalidSafetyFlagTranscriptPath = "examples/session-transcripts/invalid-safety-flag.json";

async function readJsonFixture(fixturePath) {
  return JSON.parse(await readFile(fixturePath, "utf8"));
}

const leftTraceSummary = {
  schema: "ardyn.approval-review-artifact",
  schemaVersion: "0.1.0",
  version: "0.1.0",
  task: {
    id: "task.phase3-4.compare-left"
  },
  manifest: {
    id: "planner-hardening",
    version: "0.1.0",
    schemaVersion: "0.1.0"
  }
};

const rightTraceSummary = {
  schema: "ardyn.approval-review-artifact",
  schemaVersion: "0.1.0",
  version: "0.1.0",
  task: {
    id: "task.phase3-4.compare-right"
  },
  manifest: {
    id: "planner-hardening",
    version: "0.2.0",
    schemaVersion: "0.1.0"
  }
};

test("ardyn plan prints a non-executing task plan", async () => {
  const output = await runCli(["plan", "--manifest", minimalManifestPath, "--task", minimalTaskPath]);

  assert.equal(output.command, "plan");
  assert.equal(output.schema, undefined);
  assert.equal(output.output, undefined);
  assert.equal(output.nonExecuting, undefined);
  assert.equal(output.phase, "phase-3-task-planning");
  assert.equal(output.task.id, "task.minimal.describe");
  assert.deepEqual(
    output.selectedCapabilities.map((capability) => capability.id),
    ["runtime.describe"]
  );
  assert.equal(output.approval.required, false);
  assert.equal(output.approval.status, null);
  assert.equal(output.matchingPolicy.tags, true);
  assert.deepEqual(output.plannerTrace.manifest, {
    id: "minimal-ardyn",
    version: "0.1.0",
    schemaVersion: "0.1.0"
  });
  assert.deepEqual(output.plannerTrace.selectedCapabilities, ["runtime.describe"]);
  assert.equal(output.plannerTrace.approvalDecision.status, "not_required");
  assertAllFalse(output.safety);
});

test("ardyn plan default output remains the full task plan JSON", async () => {
  const output = await runCli([
    "plan",
    "--manifest",
    planningManifestPath,
    "--task",
    exactMatchTaskPath
  ]);

  assert.equal(output.command, "plan");
  assert.equal(output.output, undefined);
  assert.equal(output.schema, undefined);
  assert.equal(output.nonExecuting, undefined);
  assert.equal(output.phase, "phase-3-task-planning");
  assert.equal(output.task.id, "task.phase3-1.exact");
  assert.deepEqual(
    output.selectedCapabilities.map((capability) => capability.id),
    ["network"]
  );
  assert.deepEqual(output.plannerTrace.selectedCapabilities, ["network"]);
  assert.deepEqual(output.plannerTrace.unresolvedRequests, []);
  assertAllFalse(output.safety);
});

test("ardyn plan --trace prints the full planner trace without enabling runtime work", async () => {
  const defaultOutput = await runCli([
    "plan",
    "--manifest",
    minimalManifestPath,
    "--task",
    minimalTaskPath
  ]);
  const output = await runCli([
    "plan",
    "--manifest",
    minimalManifestPath,
    "--task",
    minimalTaskPath,
    "--trace"
  ]);

  assert.equal(output.command, "plan");
  assert.equal(output.output, "trace");
  assert.deepEqual(output.manifest, {
    id: "minimal-ardyn",
    version: "0.1.0",
    schemaVersion: "0.1.0"
  });
  assert.equal(output.taskId, "task.minimal.describe");
  assert.deepEqual(output.trace, defaultOutput.plannerTrace);
  assert.deepEqual(output.trace.taskIntake, {
    valid: true,
    errors: [],
    taskId: "task.minimal.describe",
    requestedCapabilities: ["runtime.describe"]
  });
  assert.deepEqual(output.trace.candidateCapabilities, [
    {
      request: "runtime.describe",
      candidates: [
        {
          capabilityId: "runtime.describe",
          matchType: "exact",
          score: 300,
          scope: null,
          tag: null,
          reason: "Matched exact capability id."
        }
      ]
    }
  ]);
  assert.deepEqual(output.trace.selectedCapabilities, ["runtime.describe"]);
  assert.deepEqual(output.trace.unresolvedRequests, []);
  assert.equal(output.trace.approvalDecision.status, "not_required");
  assert.deepEqual(output.trace.safety, output.safety);
  assertAllFalse(output.trace.safety);
  assertAllFalse(output.safety);
});

test("ardyn plan --summary prints concise selection, unresolved, and approval results", async () => {
  const output = await runCli([
    "plan",
    "--manifest",
    planningManifestPath,
    "--task",
    approvalRequiredTaskPath,
    "--summary"
  ]);

  assert.equal(output.command, "plan");
  assert.equal(output.output, "summary");
  assert.deepEqual(output.manifest, {
    id: "planner-hardening",
    version: "0.1.0",
    schemaVersion: "0.1.0"
  });
  assert.equal(output.taskId, "task.phase3-1.approval");
  assert.deepEqual(output.selectedCapabilities, ["secure.registry"]);
  assert.deepEqual(output.unresolvedRequests, []);
  assert.equal(output.approval.required, true);
  assert.equal(output.approval.status, "approval-required");
  assert.deepEqual(output.approval.reasons, [
    {
      type: "task-constraint",
      field: "constraints.requireHumanApproval"
    },
    {
      type: "policy-scope",
      capabilityId: "secure.registry",
      scope: "registry",
      access: "read"
    }
  ]);
  assert.equal(output.approval.decision.status, "required");
  assert.equal(output.approval.decision.nonExecuting, true);
  assert.equal(output.trace, undefined);
  assert.equal(output.plannerTrace, undefined);
  assert.equal(output.requests, undefined);
  assert.equal(output.task, undefined);
  assertAllFalse(output.safety);
});

test("ardyn plan --explain prints deterministic candidate ranking", async () => {
  const output = await runCli([
    "plan",
    "--manifest",
    planningManifestPath,
    "--task",
    exactMatchTaskPath,
    "--explain"
  ]);

  assert.equal(output.command, "plan");
  assert.equal(output.output, "explain");
  assert.deepEqual(output.matchingPolicy, {
    exactCapabilityId: true,
    permissionScope: true,
    tags: true
  });
  assert.deepEqual(output.requests, [
    {
      request: "network",
      matchType: "exact",
      scope: null,
      reason: "Matched exact capability id.",
      selectedCapabilityIds: ["network"],
      candidates: [
        {
          capabilityId: "network",
          matchType: "exact",
          score: 300,
          scope: null,
          tag: null,
          reason: "Matched exact capability id."
        },
        {
          capabilityId: "beta.scope",
          matchType: "tag",
          score: 200,
          scope: null,
          tag: "network",
          reason: "Matched capability tag."
        },
        {
          capabilityId: "alpha.scope",
          matchType: "scope",
          score: 100,
          scope: "network",
          tag: null,
          reason: "Matched permission scope."
        },
        {
          capabilityId: "beta.scope",
          matchType: "scope",
          score: 100,
          scope: "network",
          tag: null,
          reason: "Matched permission scope."
        }
      ]
    }
  ]);
  assert.deepEqual(output.unresolvedRequests, []);
  assert.equal(output.approval.required, false);
  assert.equal(output.approval.status, null);
  assert.deepEqual(output.approval.reasons, []);
  assert.equal(output.approval.decision.status, "not_required");
  assertAllFalse(output.safety);
});

test("ardyn plan --explain includes approval reasons and decision details", async () => {
  const output = await runCli([
    "plan",
    "--manifest",
    planningManifestPath,
    "--task",
    approvalRequiredTaskPath,
    "--explain"
  ]);

  assert.equal(output.command, "plan");
  assert.equal(output.output, "explain");
  assert.equal(output.taskId, "task.phase3-1.approval");
  assert.deepEqual(output.requests, [
    {
      request: "secure.registry",
      matchType: "exact",
      scope: null,
      reason: "Matched exact capability id.",
      selectedCapabilityIds: ["secure.registry"],
      candidates: [
        {
          capabilityId: "secure.registry",
          matchType: "exact",
          score: 300,
          scope: null,
          tag: null,
          reason: "Matched exact capability id."
        }
      ]
    }
  ]);
  assert.deepEqual(output.unresolvedRequests, []);
  assert.equal(output.approval.required, true);
  assert.equal(output.approval.status, "approval-required");
  assert.deepEqual(output.approval.reasons, [
    {
      type: "task-constraint",
      field: "constraints.requireHumanApproval"
    },
    {
      type: "policy-scope",
      capabilityId: "secure.registry",
      scope: "registry",
      access: "read"
    }
  ]);
  assert.deepEqual(output.approval.decision.requestedCapabilityIds, ["secure.registry"]);
  assert.equal(output.approval.decision.status, "required");
  assert.equal(output.approval.decision.reason, "Approval is required before any future execution.");
  assert.equal(output.approval.decision.nonExecuting, true);
  assertAllFalse(output.safety);
});

test("ardyn plan --review-artifact prints stable non-executing approval artifact", async () => {
  const output = await runCli([
    "plan",
    "--manifest",
    planningManifestPath,
    "--task",
    exactMatchTaskPath,
    "--review-artifact"
  ]);

  assert.equal(output.command, undefined);
  assert.equal(output.output, undefined);
  assert.equal(output.schema, "ardyn.approval-review-artifact");
  assert.equal(output.schemaVersion, "0.1.0");
  assert.equal(output.version, "0.1.0");
  assert.equal(output.generatedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(output.nonExecuting, true);
  assert.equal(output.taskId, "task.phase3-1.exact");
  assert.deepEqual(output.manifest, {
    id: "planner-hardening",
    version: "0.1.0",
    schemaVersion: "0.1.0"
  });
  assert.deepEqual(output.requestedCapabilityIds, ["network"]);
  assert.deepEqual(output.selectedCapabilities, ["network"]);
  assert.deepEqual(output.unresolvedRequests, []);
  assert.deepEqual(
    output.candidateRankings[0].candidates.map((candidate) => [
      candidate.rank,
      candidate.capabilityId,
      candidate.matchType,
      candidate.score
    ]),
    [
      [1, "network", "exact", 300],
      [2, "beta.scope", "tag", 200],
      [3, "alpha.scope", "scope", 100],
      [4, "beta.scope", "scope", 100]
    ]
  );
  assert.equal(output.approvalDecision.status, "not_required");
  assert.equal(output.approvalDecision.nonExecuting, true);
  assertAllFalse(output.safety);
});

test("ardyn plan --review-artifact --output writes only the requested review artifact file", async () => {
  const exportDir = await mkdtemp(join(tmpdir(), "ardyn-review-artifact-"));
  const outputPath = join(exportDir, "approval-review-artifact.json");

  try {
    const expectedArtifact = await runCli([
      "plan",
      "--manifest",
      planningManifestPath,
      "--task",
      exactMatchTaskPath,
      "--review-artifact"
    ]);
    const expectedBytes = `${JSON.stringify(expectedArtifact, null, 2)}\n`;

    const summary = await runCli([
      "plan",
      "--manifest",
      planningManifestPath,
      "--task",
      exactMatchTaskPath,
      "--review-artifact",
      "--output",
      outputPath
    ]);

    assert.deepEqual(await readdir(exportDir), ["approval-review-artifact.json"]);
    assert.equal(await readFile(outputPath, "utf8"), expectedBytes);
    assert.deepEqual(summary, {
      command: "plan",
      output: "review-artifact-export",
      path: outputPath,
      bytes: Buffer.byteLength(expectedBytes, "utf8"),
      nonExecuting: true,
      safety: expectedArtifact.safety
    });
    assertAllFalse(summary.safety);
  } finally {
    await rm(exportDir, { recursive: true, force: true });
  }
});

test("ardyn plan rejects --output outside review artifact mode without writing a file", async () => {
  const exportDir = await mkdtemp(join(tmpdir(), "ardyn-review-artifact-"));
  const outputPath = join(exportDir, "approval-review-artifact.json");

  try {
    const failure = await runCliFailure([
      "plan",
      "--manifest",
      planningManifestPath,
      "--task",
      exactMatchTaskPath,
      "--output",
      outputPath
    ]);

    assertCliFailure(failure, /--output requires --review-artifact\./);
    assert.deepEqual(await readdir(exportDir), []);
  } finally {
    await rm(exportDir, { recursive: true, force: true });
  }
});

test("ardyn plan --review-artifact rejects missing --output path without JSON output", async () => {
  const failure = await runCliFailure([
    "plan",
    "--manifest",
    planningManifestPath,
    "--task",
    exactMatchTaskPath,
    "--review-artifact",
    "--output"
  ]);

  assertCliFailure(failure, /Missing required --output path\./);
});

for (const outputPath of ["\\\\server\\share\\approval-review-artifact.json", "//server/share/approval-review-artifact.json"]) {
  test(`ardyn plan --review-artifact rejects UNC output path ${outputPath}`, async () => {
    const failure = await runCliFailure([
      "plan",
      "--manifest",
      planningManifestPath,
      "--task",
      exactMatchTaskPath,
      "--review-artifact",
      "--output",
      outputPath
    ]);

    assertCliFailure(failure, /--output must be a local file path\./);
  });
}

test("ardyn plan output modes preserve no-match smoke shapes", async () => {
  const traceOutput = await runCli([
    "plan",
    "--manifest",
    planningManifestPath,
    "--task",
    minimalTaskPath,
    "--trace"
  ]);
  const summaryOutput = await runCli([
    "plan",
    "--manifest",
    planningManifestPath,
    "--task",
    minimalTaskPath,
    "--summary"
  ]);
  const explainOutput = await runCli([
    "plan",
    "--manifest",
    planningManifestPath,
    "--task",
    minimalTaskPath,
    "--explain"
  ]);

  assert.equal(traceOutput.output, "trace");
  assert.deepEqual(traceOutput.trace.selectedCapabilities, []);
  assert.deepEqual(traceOutput.trace.unresolvedRequests, ["runtime.describe"]);
  assert.deepEqual(traceOutput.trace.candidateCapabilities, [
    {
      request: "runtime.describe",
      candidates: []
    }
  ]);

  assert.equal(summaryOutput.output, "summary");
  assert.deepEqual(summaryOutput.selectedCapabilities, []);
  assert.deepEqual(summaryOutput.unresolvedRequests, ["runtime.describe"]);
  assert.equal(summaryOutput.approval.required, false);
  assert.equal(summaryOutput.approval.decision.status, "not_required");

  assert.equal(explainOutput.output, "explain");
  assert.deepEqual(explainOutput.requests, [
    {
      request: "runtime.describe",
      matchType: "no-match",
      scope: null,
      reason: "No exact capability id, capability tag, or supported permission scope matched.",
      selectedCapabilityIds: [],
      candidates: []
    }
  ]);
  assert.deepEqual(explainOutput.unresolvedRequests, ["runtime.describe"]);
  assert.equal(explainOutput.approval.required, false);
  assert.equal(explainOutput.approval.decision.status, "not_required");

  assertAllFalse(traceOutput.safety);
  assertAllFalse(traceOutput.trace.safety);
  assertAllFalse(summaryOutput.safety);
  assertAllFalse(explainOutput.safety);
});

test("ardyn plan rejects multiple output modes without JSON output", async () => {
  const failure = await runCliFailure([
    "plan",
    "--manifest",
    minimalManifestPath,
    "--task",
    minimalTaskPath,
    "--trace",
    "--summary"
  ]);

  assertCliFailure(failure, /Plan output flags are mutually exclusive: --trace, --summary\./);
});

test("ardyn plan rejects review artifact with another output mode", async () => {
  const failure = await runCliFailure([
    "plan",
    "--manifest",
    minimalManifestPath,
    "--task",
    minimalTaskPath,
    "--trace",
    "--review-artifact"
  ]);

  assertCliFailure(failure, /Plan output flags are mutually exclusive: --trace, --review-artifact\./);
});

test("ardyn plan without --manifest fails without JSON output", async () => {
  const failure = await runCliFailure(["plan", "--task", minimalTaskPath]);

  assertCliFailure(failure, /Missing required --manifest path\./);
});

test("ardyn plan without --task fails without JSON output", async () => {
  const failure = await runCliFailure(["plan", "--manifest", minimalManifestPath]);

  assertCliFailure(failure, /Missing required --task path\./);
});

test("ardyn review-artifact --summary prints deterministic display metadata", async () => {
  const artifact = await readJsonFixture(phase36ReviewArtifactPath);
  const output = await runCli(["review-artifact", "--file", phase36ReviewArtifactPath, "--summary"]);

  assert.deepEqual(output, {
    command: "review-artifact",
    output: "summary",
    file: phase36ReviewArtifactPath,
    compatibility: classifyApprovalReviewArtifactCompatibility(artifact),
    displaySummary: buildApprovalReviewArtifactDisplaySummary(artifact)
  });
  assert.equal(output.compatibility, "compatible");
  assert.equal(output.displaySummary.valid, true);
  assert.equal(output.displaySummary.safety.nonExecuting, true);
  assertAllFalse(output.displaySummary.safety.flags);
});

test("ardyn review-artifact --explain treats unknown fields as inert display data", async () => {
  const artifact = await readJsonFixture(phase36UnknownFieldsArtifactPath);
  const normalized = normalizeApprovalReviewArtifactForDisplay(artifact);
  const output = await runCli(["review-artifact", "--file", phase36UnknownFieldsArtifactPath, "--explain"]);

  assert.deepEqual(output, {
    command: "review-artifact",
    output: "explain",
    file: phase36UnknownFieldsArtifactPath,
    compatibility: classifyApprovalReviewArtifactCompatibility(artifact),
    versionValidation: validateApprovalReviewArtifactVersion(artifact),
    approval: normalized.approvalDecision,
    safety: {
      nonExecuting: normalized.nonExecuting,
      allFlagsFalse: normalized.safetyFlagsAllFalse,
      flags: normalized.safety
    },
    unknownFields: {
      handling: "preserve_as_inert_display_data",
      names: normalized.unknownFields,
      values: normalized.unknown
    },
    displayGuidance: {
      useSummaryForCompactDisplay: true,
      preserveUnknownFieldsAsInertData: true,
      doNotExecuteOrInterpretUnknownFields: true,
      summary: buildApprovalReviewArtifactDisplaySummary(artifact)
    },
    normalized
  });
  assert.equal(output.compatibility, "compatible");
  assert.deepEqual(output.unknownFields.names, ["displayHints", "futureReviewMetadata"]);
  assert.equal(output.unknownFields.values.futureReviewMetadata.riskScore, 0);
  assert.equal(output.approval.status, "not_required");
  assert.equal(output.safety.nonExecuting, true);
  assertAllFalse(output.safety.flags);
});

test("ardyn review-artifact fails cleanly for unsupported major artifacts", async () => {
  const failure = await runCliFailure([
    "review-artifact",
    "--file",
    phase36UnsupportedMajorArtifactPath,
    "--summary"
  ]);

  assertCliFailure(failure, /review artifact compatibility unsupported_major:/);
  assert.match(failure.stderr, /schemaVersion major 2 is unsupported; supported major is 0/);
  assert.match(failure.stderr, /version major 2 is unsupported; supported major is 0/);
});

test("ardyn review-artifact fails cleanly for malformed artifacts", async () => {
  const failure = await runCliFailure(["review-artifact", "--file", phase36MalformedArtifactPath, "--explain"]);

  assertCliFailure(failure, /review artifact compatibility malformed:/);
  assert.match(failure.stderr, /schema must be ardyn\.approval-review-artifact/);
  assert.match(failure.stderr, /version must be a semantic version string/);
});

test("ardyn review-artifact --schema-status prints deterministic migration metadata", async () => {
  const artifact = await readJsonFixture(phase37OlderReviewArtifactPath);
  const output = await runCli([
    "review-artifact",
    "--file",
    phase37OlderReviewArtifactPath,
    "--schema-status"
  ]);

  assert.deepEqual(output, {
    command: "review-artifact",
    output: "schema-status",
    file: phase37OlderReviewArtifactPath,
    schemaStatus: buildSchemaMigrationMetadataRecord("approval_review_artifact", artifact),
    displaySummary: buildMigrationAttestationDisplaySummary("approval_review_artifact", artifact)
  });
  assert.equal(output.schemaStatus.compatibility, "upgrade_available");
  assert.equal(output.schemaStatus.migrationRequired, false);
  assert.equal(output.schemaStatus.migrationAvailable, true);
  assert.equal(output.schemaStatus.nonExecuting, true);
  assert.equal(output.displaySummary.nonExecuting, true);
  assertAllFalse(output.displaySummary.safety);
});

test("ardyn review-artifact --attestation-plan prints unsigned non-production plan", async () => {
  const artifact = await readJsonFixture(phase37ReviewArtifactPath);
  const output = await runCli([
    "review-artifact",
    "--file",
    phase37ReviewArtifactPath,
    "--attestation-plan"
  ]);

  assert.deepEqual(output, {
    command: "review-artifact",
    output: "attestation-plan",
    file: phase37ReviewArtifactPath,
    attestationPlan: buildReviewArtifactAttestationPlan(artifact)
  });
  assert.equal(output.attestationPlan.verification.status, "unsigned");
  assert.equal(output.attestationPlan.signer.productionKeyAvailable, false);
  assert.equal(output.attestationPlan.signing.productionSigningEnabled, false);
  assert.equal(output.attestationPlan.signing.keysLoaded, false);
  assert.equal(output.attestationPlan.signing.realSigningPerformed, false);
  assert.equal(output.attestationPlan.nonExecuting, true);
  assertAllFalse(output.attestationPlan.safety);
  assertNoSecretTerms(output.attestationPlan);
});

test("ardyn review-artifact --schema-status classifies unsupported and malformed inputs", async () => {
  const unsupportedOutput = await runCli([
    "review-artifact",
    "--file",
    phase37UnsupportedMajorArtifactPath,
    "--schema-status"
  ]);
  const malformedOutput = await runCli([
    "review-artifact",
    "--file",
    phase37MalformedArtifactPath,
    "--schema-status"
  ]);

  assert.equal(unsupportedOutput.schemaStatus.compatibility, "unsupported_major");
  assert.equal(unsupportedOutput.schemaStatus.migrationRequired, true);
  assert.equal(unsupportedOutput.schemaStatus.migrationAvailable, false);
  assert.match(
    unsupportedOutput.schemaStatus.validationErrors.join("\n"),
    /schemaVersion major 2 is unsupported/
  );

  assert.equal(malformedOutput.schemaStatus.compatibility, "malformed");
  assert.equal(malformedOutput.schemaStatus.migrationRequired, true);
  assert.equal(malformedOutput.schemaStatus.migrationAvailable, false);
  assert.match(malformedOutput.schemaStatus.validationErrors.join("\n"), /version must be a semantic version string/);
});

test("ardyn review-artifact --attestation-plan marks unsupported inputs without signing", async () => {
  const output = await runCli([
    "review-artifact",
    "--file",
    phase37UnsupportedMajorArtifactPath,
    "--attestation-plan"
  ]);

  assert.equal(output.attestationPlan.verification.status, "unsupported");
  assert.equal(output.attestationPlan.verification.verified, false);
  assert.equal(output.attestationPlan.signing.productionSigningEnabled, false);
  assert.equal(output.attestationPlan.signing.keysLoaded, false);
  assert.equal(output.attestationPlan.signing.realSigningPerformed, false);
  assertNoSecretTerms(output.attestationPlan);
  assertAllFalse(output.attestationPlan.safety);
});

for (const filePath of [
  "https://example.test/review-artifact.json",
  "file:///C:/tmp/review-artifact.json",
  "\\\\server\\share\\review-artifact.json",
  "//server/share/review-artifact.json"
]) {
  test(`ardyn review-artifact rejects non-local file path ${filePath}`, async () => {
    const failure = await runCliFailure(["review-artifact", "--file", filePath, "--summary"]);

    assertCliFailure(failure, /--file must be a local JSON file path\./);
  });
}

test("ardyn validate-session-transcript prints deterministic default validation JSON for a valid transcript", async () => {
  const transcript = await readJsonFixture(validMinimalTranscriptPath);
  const output = await runCli(["validate-session-transcript", "--file", validMinimalTranscriptPath]);

  assert.deepEqual(output, {
    command: "validate-session-transcript",
    output: "default",
    file: validMinimalTranscriptPath,
    validation: validateSessionTranscript(transcript),
    classification: classifySessionTranscript(transcript),
    nonExecuting: true,
    safety: classifySessionTranscript(transcript).safety
  });
  assert.equal(output.validation.valid, true);
  assert.equal(output.classification.classification, "valid");
  assert.equal(output.nonExecuting, true);
  assertAllFalse(output.safety);
  assertAllFalse(output.classification.safety);
});

test("ardyn validate-session-transcript --summary prints deterministic local-only summary", async () => {
  const transcript = await readJsonFixture(validMinimalTranscriptPath);
  const output = await runCli([
    "validate-session-transcript",
    "--file",
    validMinimalTranscriptPath,
    "--summary"
  ]);

  assert.deepEqual(output, {
    command: "validate-session-transcript",
    output: "summary",
    file: validMinimalTranscriptPath,
    summary: buildSessionTranscriptSummary(transcript)
  });
  assert.equal(output.summary.classification, "valid");
  assertAllFalse(output.summary.safety);
});

test("ardyn validate-session-transcript keeps exit 0 and deterministic invalid classification for semantic transcript errors", async () => {
  const transcript = await readJsonFixture(invalidOutOfOrderTranscriptPath);
  const output = await runCli([
    "validate-session-transcript",
    "--file",
    invalidOutOfOrderTranscriptPath
  ]);

  assert.deepEqual(output, {
    command: "validate-session-transcript",
    output: "default",
    file: invalidOutOfOrderTranscriptPath,
    validation: validateSessionTranscript(transcript),
    classification: classifySessionTranscript(transcript),
    nonExecuting: true,
    safety: classifySessionTranscript(transcript).safety
  });
  assert.equal(output.validation.valid, false);
  assert.equal(output.classification.classification, "invalid");
  assert.deepEqual(output.validation.errors, [
    "events[1].sequence must be 2",
    "events[2].sequence must be 4"
  ]);
  assertAllFalse(output.safety);
  assertAllFalse(output.classification.safety);
});

test("ardyn validate-session-transcript --explain prints deterministic invalid explanation", async () => {
  const transcript = await readJsonFixture(invalidMissingStartedTranscriptPath);
  const output = await runCli([
    "validate-session-transcript",
    "--file",
    invalidMissingStartedTranscriptPath,
    "--explain"
  ]);

  assert.deepEqual(output, {
    command: "validate-session-transcript",
    output: "explain",
    file: invalidMissingStartedTranscriptPath,
    explanation: explainSessionTranscript(transcript)
  });
  assert.equal(output.explanation.classification, "invalid");
  assert.deepEqual(output.explanation.errors, ["events[0].eventType must be session.started"]);
  assertAllFalse(output.explanation.safety);
  assertAllFalse(output.explanation.summary.safety);
});

for (const [fixturePath, expectedErrors] of [
  [invalidSourceHarnessTranscriptPath, ["sourceHarness must be ardyn"]],
  [invalidSafetyFlagTranscriptPath, ["safety.executionEnabled must be false"]]
]) {
  test(`ardyn validate-session-transcript reports deterministic invalid classification for ${fixturePath}`, async () => {
    const transcript = await readJsonFixture(fixturePath);
    const output = await runCli(["validate-session-transcript", "--file", fixturePath]);

    assert.equal(output.classification.classification, "invalid");
    assert.deepEqual(output.validation.errors, expectedErrors);
    assert.deepEqual(output.classification.errors, expectedErrors);
    assert.deepEqual(output.validation, validateSessionTranscript(transcript));
    assert.deepEqual(output.classification, classifySessionTranscript(transcript));
    assertAllFalse(output.safety);
    assertAllFalse(output.classification.safety);
  });
}

test("ardyn validate-session-transcript without --file fails without JSON output", async () => {
  const failure = await runCliFailure(["validate-session-transcript"]);

  assertCliFailure(failure, /Missing required --file path\./);
});

test("ardyn validate-session-transcript with a missing file path value fails without JSON output", async () => {
  const failure = await runCliFailure(["validate-session-transcript", "--file"]);

  assertCliFailure(failure, /Missing required --file path\./);
});

test("ardyn validate-session-transcript rejects multiple output modes without JSON output", async () => {
  const failure = await runCliFailure([
    "validate-session-transcript",
    "--file",
    validMinimalTranscriptPath,
    "--summary",
    "--explain"
  ]);

  assertCliFailure(
    failure,
    /Session transcript output flags are mutually exclusive: --summary, --explain\./
  );
});

for (const filePath of [
  "https://example.test/session-transcript.json",
  "file:///C:/tmp/session-transcript.json",
  "\\\\server\\share\\session-transcript.json",
  "//server/share/session-transcript.json"
]) {
  test(`ardyn validate-session-transcript rejects non-local file path ${filePath}`, async () => {
    const failure = await runCliFailure(["validate-session-transcript", "--file", filePath]);

    assertCliFailure(failure, /--file must be a local JSON file path\./);
  });
}

test("ardyn validate-session-transcript keeps all top-level safety flags false", async () => {
  const output = await runCli(["validate-session-transcript", "--file", validMinimalTranscriptPath]);

  assert.equal(output.nonExecuting, true);
  assertAllFalse(output.safety);
});

test("ardyn review-trace reports equal approval review artifacts", async () => {
  const output = await runCli([
    "review-trace",
    "--left",
    traceLeftPath,
    "--right",
    traceLeftPath
  ]);

  assert.equal(output.command, "review-trace");
  assert.equal(output.output, "default");
  assert.equal(output.equal, true);
  assert.equal(output.differenceCount, 0);
  assert.deepEqual(output.differences, []);
  assert.deepEqual(output.left, leftTraceSummary);
  assert.deepEqual(output.right, leftTraceSummary);
  assert.equal(output.nonExecuting, true);
  assertAllFalse(output.safety);
});

test("ardyn review-trace reports deterministic differences for changed artifacts", async () => {
  const output = await runCli([
    "review-trace",
    "--left",
    traceLeftPath,
    "--right",
    traceRightPath
  ]);

  assert.equal(output.command, "review-trace");
  assert.equal(output.output, "default");
  assert.equal(output.equal, false);
  assert.equal(output.differenceCount, 8);
  assert.deepEqual(
    output.differences.map((difference) => [difference.type, difference.path]),
    [
      ["task-mismatch", "taskId"],
      ["manifest-mismatch", "manifest.version"],
      ["requested-capabilities-change", "requestedCapabilityIds"],
      ["selected-capabilities-change", "selectedCapabilities"],
      ["unresolved-requests-change", "unresolvedRequests"],
      ["approval-requested-capabilities-change", "approvalDecision.requestedCapabilityIds"],
      ["approval-status-change", "approvalDecision.status"],
      ["candidate-rankings-change", "candidateRankings"]
    ]
  );
  assert.deepEqual(output.left, leftTraceSummary);
  assert.deepEqual(output.right, rightTraceSummary);
  assert.equal(output.nonExecuting, true);
  assertAllFalse(output.safety);
});

test("ardyn review-trace --summary prints concise comparison metadata", async () => {
  const output = await runCli([
    "review-trace",
    "--left",
    traceLeftPath,
    "--right",
    traceRightPath,
    "--summary"
  ]);

  assert.equal(output.command, "review-trace");
  assert.equal(output.output, "summary");
  assert.equal(output.equal, false);
  assert.equal(output.differenceCount, 8);
  assert.equal(output.differences, undefined);
  assert.deepEqual(output.differenceTypes, [
    { type: "task-mismatch", path: "taskId" },
    { type: "manifest-mismatch", path: "manifest.version" },
    { type: "requested-capabilities-change", path: "requestedCapabilityIds" },
    { type: "selected-capabilities-change", path: "selectedCapabilities" },
    { type: "unresolved-requests-change", path: "unresolvedRequests" },
    { type: "approval-requested-capabilities-change", path: "approvalDecision.requestedCapabilityIds" },
    { type: "approval-status-change", path: "approvalDecision.status" },
    { type: "candidate-rankings-change", path: "candidateRankings" }
  ]);
  assert.deepEqual(output.left, leftTraceSummary);
  assert.deepEqual(output.right, rightTraceSummary);
  assert.equal(output.nonExecuting, true);
  assertAllFalse(output.safety);
});

test("ardyn review-trace --explain prints deterministic difference reasons", async () => {
  const output = await runCli([
    "review-trace",
    "--left",
    traceLeftPath,
    "--right",
    traceRightPath,
    "--explain"
  ]);

  assert.equal(output.command, "review-trace");
  assert.equal(output.output, "explain");
  assert.equal(output.equal, false);
  assert.equal(output.differenceCount, 8);
  assert.deepEqual(output.left, leftTraceSummary);
  assert.deepEqual(output.right, rightTraceSummary);
  assert.deepEqual(
    output.differences.map((difference) => ({
      type: difference.type,
      path: difference.path,
      reason: difference.reason,
      detail: difference.detail
    })),
    [
      {
        type: "task-mismatch",
        path: "taskId",
        reason: "Task identifiers differ.",
        detail: "taskId changed from \"task.phase3-4.compare-left\" to \"task.phase3-4.compare-right\"."
      },
      {
        type: "manifest-mismatch",
        path: "manifest.version",
        reason: "Manifest summary fields differ.",
        detail: "manifest.version changed from \"0.1.0\" to \"0.2.0\"."
      },
      {
        type: "requested-capabilities-change",
        path: "requestedCapabilityIds",
        reason: "Requested capability ids differ.",
        detail: "requestedCapabilityIds added [\"missing.capability\",\"planner.tie\"] and removed [\"network\"]."
      },
      {
        type: "selected-capabilities-change",
        path: "selectedCapabilities",
        reason: "Selected capability ids differ.",
        detail: "selectedCapabilities added [\"alpha.tag\",\"beta.tag\"] and removed [\"network\"]."
      },
      {
        type: "unresolved-requests-change",
        path: "unresolvedRequests",
        reason: "Unresolved request ids differ.",
        detail: "unresolvedRequests added [\"missing.capability\"] and removed []."
      },
      {
        type: "approval-requested-capabilities-change",
        path: "approvalDecision.requestedCapabilityIds",
        reason: "Approval requested capability ids differ.",
        detail:
          "approvalDecision.requestedCapabilityIds added [\"alpha.tag\",\"beta.tag\"] and removed [\"network\"]."
      },
      {
        type: "approval-status-change",
        path: "approvalDecision.status",
        reason: "Approval status differs.",
        detail: "approvalDecision.status changed from \"not_required\" to \"required\"."
      },
      {
        type: "candidate-rankings-change",
        path: "candidateRankings",
        reason: "Candidate rankings differ.",
        detail: "candidateRankings changed between left and right artifacts."
      }
    ]
  );
  assert.equal(output.nonExecuting, true);
  assertAllFalse(output.safety);
});

test("ardyn review-trace rejects multiple output modes without JSON output", async () => {
  const failure = await runCliFailure([
    "review-trace",
    "--left",
    traceLeftPath,
    "--right",
    traceRightPath,
    "--summary",
    "--explain"
  ]);

  assertCliFailure(failure, /Review trace output flags are mutually exclusive: --summary, --explain\./);
});

test("ardyn review-trace rejects invalid review artifacts without JSON output", async () => {
  const failure = await runCliFailure([
    "review-trace",
    "--left",
    invalidReviewArtifactPath,
    "--right",
    traceLeftPath
  ]);

  assertCliFailure(failure, /left approval review artifact is invalid:/);
});

for (const { side, path } of [
  { side: "left", path: "\\\\server\\share\\left.json" },
  { side: "left", path: "//server/share/left.json" },
  { side: "right", path: "\\\\server\\share\\right.json" },
  { side: "right", path: "//server/share/right.json" }
]) {
  test(`ardyn review-trace rejects ${side} UNC path ${path}`, async () => {
    const failure = await runCliFailure([
      "review-trace",
      "--left",
      side === "left" ? path : traceLeftPath,
      "--right",
      side === "right" ? path : traceRightPath
    ]);

    assertCliFailure(failure, new RegExp(`${side} must be a local JSON file path\\.`));
  });
}

test("ardyn review-trace without required flags fails without JSON output", async () => {
  const failure = await runCliFailure(["review-trace", "--right", traceRightPath]);

  assertCliFailure(failure, /Missing required --left path\./);
});

test("ardyn review-trace with a missing path value fails without JSON output", async () => {
  const failure = await runCliFailure(["review-trace", "--left", traceLeftPath, "--right"]);

  assertCliFailure(failure, /Missing required --right path\./);
});

test("ardyn review-trace keeps all safety flags false", async () => {
  const output = await runCli([
    "review-trace",
    "--left",
    traceLeftPath,
    "--right",
    traceRightPath
  ]);

  assert.equal(output.nonExecuting, true);
  assertAllFalse(output.safety);
});
