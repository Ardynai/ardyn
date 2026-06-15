import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  APPROVAL_PREREQUISITE_SOURCE_BUNDLE_SCHEMA,
  bundleApprovalPrerequisiteSourcesForReview,
  evaluateRuntimeApprovalPrerequisitesForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase522BaselineCommit = "96fcae9aa864ea19c04a094be544513b7e77378b";
const reviewedAt = "2026-06-15T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-22/approval-prerequisite-source-bundle-contract.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "bundleSummary",
  "bundlePartShape",
  "bundleResultShape",
  "sourceBundleCases",
  "readerIntegration",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-bundle-parts",
  "missing-required-bundle-part",
  "malformed-bundle-part",
  "single-valid-bundle",
  "duplicate-equivalent-bundle-parts",
  "conflicting-bundle-parts-rejected",
  "stale-source-bundle-rejected",
  "revoked-source-bundle-rejected",
  "unknown-source-bundle-rejected",
  "malformed-source-bundle-rejected",
  "empty-source-bundle-rejected"
]);

const expectedClassifications = Object.freeze({
  "missing-bundle-parts": "missing_prerequisite_source_bundle_parts_rejected",
  "missing-required-bundle-part":
    "missing_required_prerequisite_source_bundle_part_rejected",
  "malformed-bundle-part": "malformed_prerequisite_source_bundle_part_rejected",
  "single-valid-bundle":
    "valid_prerequisite_source_bundle_review_only_runtime_still_blocked",
  "duplicate-equivalent-bundle-parts":
    "duplicate_equivalent_prerequisite_source_bundle_parts_review_only_runtime_still_blocked",
  "conflicting-bundle-parts-rejected":
    "conflicting_prerequisite_source_bundle_parts_rejected",
  "stale-source-bundle-rejected": "stale_prerequisite_source_bundle_rejected",
  "revoked-source-bundle-rejected": "revoked_prerequisite_source_bundle_rejected",
  "unknown-source-bundle-rejected": "unknown_prerequisite_source_bundle_rejected",
  "malformed-source-bundle-rejected":
    "malformed_prerequisite_source_bundle_rejected",
  "empty-source-bundle-rejected": "empty_prerequisite_source_bundle_rejected"
});

const sourceBundleCommandProbes = Object.freeze([
  "approval-prerequisite-source-bundle",
  "bundle-approval-prerequisite-sources",
  "runtime-prerequisite-source-bundle",
  "phase-5-22-approval-prerequisite-source-bundle",
  "approval-prerequisite-source-selection",
  "select-approval-prerequisite-sources",
  "serve-runtime"
]);

function validity(overrides = {}) {
  return {
    notBefore: "2026-06-01T00:00:00.000Z",
    expiresAt: "2026-12-31T00:00:00.000Z",
    evaluatedAt: reviewedAt,
    validAtEvaluation: true,
    ...overrides
  };
}

function runtimeApprovalRecord(overrides = {}) {
  return {
    schema: "ardyn.runtime-approval-record",
    schemaVersion: "0.1.0",
    recordKind: "runtime-approval-record",
    recordId: "runtime-approval-record-001",
    recordPhase: "phase-5.7-runtime-approval-validation",
    approvalStatus: "approved",
    validity: validity(),
    revocation: {
      revoked: false,
      revokedAt: null,
      revocationReason: null
    },
    runtimeEffect: {
      currentRecordEnablesRuntime: false,
      runtimeStarts: false,
      runtimeEnabled: false,
      runtimeCommandEnabled: false,
      runtimeExecutionEnabled: false,
      approvalGrantCreated: false
    },
    ...overrides
  };
}

function commandExposureApprovalRecord(overrides = {}) {
  return {
    schema: "ardyn.runtime-command-exposure-approval-record",
    schemaVersion: "0.1.0",
    recordKind: "runtime-command-exposure-approval-record",
    recordId: "command-exposure-approval-record-001",
    recordPhase: "phase-5.8-runtime-command-exposure-approval",
    approvalStatus: "approved",
    validity: validity(),
    revocation: {
      revoked: false,
      revokedAt: null,
      revocationReason: null
    },
    commandExposureEffect: {
      currentRecordExposesUserRuntimeCommand: false,
      currentRecordEnablesRuntimeCommand: false,
      currentRecordExposesRuntimeExecution: false,
      additionalRuntimeCommandsRecognized: false,
      commandAliasCreated: false
    },
    runtimeEffect: {
      currentRecordEnablesRuntime: false,
      runtimeStarts: false,
      runtimeEnabled: false,
      runtimeCommandEnabled: false,
      runtimeExecutionEnabled: false,
      approvalGrantCreated: false
    },
    ...overrides
  };
}

function validRecords(overrides = {}) {
  return [
    runtimeApprovalRecord(overrides.runtimeApprovalRecord),
    commandExposureApprovalRecord(overrides.commandExposureApprovalRecord)
  ];
}

function inlineSource(sourceId, records, overrides = {}) {
  return {
    sourceId,
    sourceKind: "inline-prerequisite-records",
    sourceMode: "in-memory",
    records,
    ...overrides
  };
}

function selectedSourceBundlePart(partId, sourceInputs, overrides = {}) {
  return {
    partId,
    partKind: "selected-prerequisite-source",
    partMode: "in-memory",
    sourceInputs,
    ...overrides
  };
}

function sourceBundleCases() {
  const equivalentRecords = validRecords();

  return [
    {
      caseId: "missing-bundle-parts",
      input: { reviewedAt },
      expectedAccepted: false,
      expectedForwarded: false,
      expectedSelectedPartId: null
    },
    {
      caseId: "missing-required-bundle-part",
      input: {
        reviewedAt,
        bundleParts: [
          {
            partId: "bundle-metadata-only",
            partKind: "bundle-metadata",
            partMode: "in-memory",
            sourceInputs: [inlineSource("source-valid-a", validRecords())]
          }
        ]
      },
      expectedAccepted: false,
      expectedForwarded: false,
      expectedSelectedPartId: null
    },
    {
      caseId: "malformed-bundle-part",
      input: {
        reviewedAt,
        bundleParts: [
          selectedSourceBundlePart("bundle-malformed", [
            inlineSource("source-valid-a", validRecords())
          ], {
            partMode: "filesystem"
          })
        ]
      },
      expectedAccepted: false,
      expectedForwarded: false,
      expectedSelectedPartId: null
    },
    {
      caseId: "single-valid-bundle",
      input: {
        reviewedAt,
        bundleParts: [
          selectedSourceBundlePart("bundle-valid-a", [
            inlineSource("source-valid-a", validRecords())
          ])
        ]
      },
      expectedAccepted: true,
      expectedForwarded: true,
      expectedSelectedPartId: "bundle-valid-a"
    },
    {
      caseId: "duplicate-equivalent-bundle-parts",
      input: {
        reviewedAt,
        bundleParts: [
          selectedSourceBundlePart("bundle-valid-b", [
            inlineSource("source-valid-b", equivalentRecords)
          ]),
          selectedSourceBundlePart("bundle-valid-a", [
            inlineSource("source-valid-a", equivalentRecords)
          ])
        ]
      },
      expectedAccepted: true,
      expectedForwarded: true,
      expectedSelectedPartId: "bundle-valid-a"
    },
    {
      caseId: "conflicting-bundle-parts-rejected",
      input: {
        reviewedAt,
        bundleParts: [
          selectedSourceBundlePart("bundle-conflict-a", [
            inlineSource("source-conflict-a", validRecords())
          ]),
          selectedSourceBundlePart("bundle-conflict-b", [
            inlineSource("source-conflict-b", validRecords({
              runtimeApprovalRecord: {
                recordId: "runtime-approval-record-conflicting"
              }
            }))
          ])
        ]
      },
      expectedAccepted: false,
      expectedForwarded: false,
      expectedSelectedPartId: null
    },
    {
      caseId: "stale-source-bundle-rejected",
      input: {
        reviewedAt,
        bundleParts: [
          selectedSourceBundlePart("bundle-stale", [
            inlineSource("source-stale", [
              runtimeApprovalRecord({
                validity: validity({
                  expiresAt: "2026-06-14T00:00:00.000Z",
                  validAtEvaluation: false
                })
              }),
              commandExposureApprovalRecord()
            ])
          ])
        ]
      },
      expectedAccepted: false,
      expectedForwarded: false,
      expectedSelectedPartId: null
    },
    {
      caseId: "revoked-source-bundle-rejected",
      input: {
        reviewedAt,
        bundleParts: [
          selectedSourceBundlePart("bundle-revoked", [
            inlineSource("source-revoked", [
              runtimeApprovalRecord({
                revocation: {
                  revoked: true,
                  revokedAt: "2026-06-15T00:00:00.000Z",
                  revocationReason: "operator-revoked"
                }
              }),
              commandExposureApprovalRecord()
            ])
          ])
        ]
      },
      expectedAccepted: false,
      expectedForwarded: false,
      expectedSelectedPartId: null
    },
    {
      caseId: "unknown-source-bundle-rejected",
      input: {
        reviewedAt,
        bundleParts: [
          selectedSourceBundlePart("bundle-unknown", [
            inlineSource("source-unknown", [
              ...validRecords(),
              {
                schema: "ardyn.unreviewed-runtime-prerequisite-record",
                schemaVersion: "0.1.0",
                recordKind: "unreviewed-runtime-prerequisite-record",
                recordId: "unknown-record-001"
              }
            ])
          ])
        ]
      },
      expectedAccepted: false,
      expectedForwarded: false,
      expectedSelectedPartId: null
    },
    {
      caseId: "malformed-source-bundle-rejected",
      input: {
        reviewedAt,
        bundleParts: [
          selectedSourceBundlePart("bundle-malformed-source", [
            inlineSource("source-malformed", validRecords(), {
              sourceKind: "file-prerequisite-records",
              sourceMode: "filesystem"
            })
          ])
        ]
      },
      expectedAccepted: false,
      expectedForwarded: false,
      expectedSelectedPartId: null
    },
    {
      caseId: "empty-source-bundle-rejected",
      input: {
        reviewedAt,
        bundleParts: [
          selectedSourceBundlePart("bundle-empty", [
            inlineSource("source-empty", [])
          ])
        ]
      },
      expectedAccepted: false,
      expectedForwarded: false,
      expectedSelectedPartId: null
    }
  ];
}

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

function assertAllFalse(record) {
  for (const [key, value] of Object.entries(record)) {
    assert.equal(value, false, key);
  }
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

test("Phase 5.22 source bundle fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(
    fixture.schema,
    "ardyn.phase-5.22.approval-prerequisite-source-bundle-contract"
  );
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-5.22-approval-prerequisite-source-bundle");
  assert.equal(fixture.artifactKind, "approval-prerequisite-source-bundle-contract");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(
    fixture.sourcePhase.phase,
    "phase-5.21-approval-prerequisite-source-selection"
  );
  assert.equal(fixture.sourcePhase.runtimeEnabled, false);
  assert.equal(fixture.sourcePhase.approvalGrantProduced, false);
});

test("Phase 5.22 source bundle classifies bundle inputs deterministically", () => {
  for (const bundleCase of sourceBundleCases()) {
    const result = bundleApprovalPrerequisiteSourcesForReview(bundleCase.input);

    assert.equal(result.schema, APPROVAL_PREREQUISITE_SOURCE_BUNDLE_SCHEMA);
    assert.equal(result.schemaVersion, "0.1.0");
    assert.equal(result.bundleKind, "approval-prerequisite-source-bundle");
    assert.equal(result.bundleMode, "review-only");
    assert.equal(result.reviewedAt, reviewedAt);
    assert.equal(result.reviewOnly, true);
    assert.equal(result.authoritative, false);
    assert.equal(result.classification, expectedClassifications[bundleCase.caseId]);
    assert.equal(result.sourceBundleAccepted, bundleCase.expectedAccepted, bundleCase.caseId);
    assert.equal(result.readerInputForwarded, bundleCase.expectedForwarded, bundleCase.caseId);
    assert.equal(result.selectedBundlePartId, bundleCase.expectedSelectedPartId, bundleCase.caseId);
    assert.equal(result.approvalGrant.produced, false, bundleCase.caseId);
    assert.equal(result.approvalGrant.persisted, false, bundleCase.caseId);
    assert.equal(result.approvalGrant.grantId, null, bundleCase.caseId);
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.22 duplicate equivalent bundle parts select lowest bundle part id and remain review-only", () => {
  const duplicateCase = sourceBundleCases().find(
    (bundleCase) => bundleCase.caseId === "duplicate-equivalent-bundle-parts"
  );
  const result = bundleApprovalPrerequisiteSourcesForReview(duplicateCase.input);
  const evaluation = evaluateRuntimeApprovalPrerequisitesForReview(result.bundledReaderInput);

  assert.equal(result.sourceBundleAccepted, true);
  assert.equal(result.readerInputForwarded, true);
  assert.equal(result.selectedBundlePartId, "bundle-valid-a");
  assert.deepEqual(result.equivalentBundlePartIds, ["bundle-valid-a", "bundle-valid-b"]);
  assert.equal(result.bundledReaderInput.reviewedAt, reviewedAt);
  assert.equal(result.bundledReaderInput.prerequisiteRecords.length, 2);
  assert.equal(
    result.approvalPrerequisiteReader.classification,
    "valid_prerequisite_records_review_only_runtime_still_blocked"
  );
  assert.equal(result.approvalPrerequisiteReader.prerequisiteSignalRecognized, true);
  assert.equal(evaluation.prerequisiteSignalRecognized, true);
  assert.equal(evaluation.approvalGrant.produced, false);
  assert.equal(evaluation.approvalGrant.persisted, false);
  assertAllFalse(evaluation.runtimeEffect);
});

test("Phase 5.22 conflicting bundle parts fail closed before reader forwarding", () => {
  const conflictCase = sourceBundleCases().find(
    (bundleCase) => bundleCase.caseId === "conflicting-bundle-parts-rejected"
  );
  const result = bundleApprovalPrerequisiteSourcesForReview(conflictCase.input);

  assert.equal(result.sourceBundleAccepted, false);
  assert.equal(result.readerInputForwarded, false);
  assert.equal(result.selectedBundlePartId, null);
  assert.equal(result.bundledReaderInput, null);
  assert.equal(result.approvalPrerequisiteReader, null);
  assert.deepEqual(result.conflictingBundlePartIds, [
    "bundle-conflict-a",
    "bundle-conflict-b"
  ]);
  assert.ok(result.rejectionReasons.includes("conflicting_prerequisite_source_bundle_parts"));
  assert.ok(result.rejectionReasons.includes("approval_grant_not_implemented"));
  assert.ok(result.rejectionReasons.includes("runtime_enablement_still_blocked"));
  assertAllFalse(result.runtimeEffect);
});

test("Phase 5.22 fixture mirrors source bundle cases and blocks grants", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.bundleSummary, {
    approvalPrerequisiteSourceBundleRecorded: true,
    bundleKind: "approval-prerequisite-source-bundle",
    bundleReviewOnly: true,
    bundleAuthoritative: false,
    missingBundlePartsRejected: true,
    missingRequiredBundlePartsRejected: true,
    malformedBundlePartsRejected: true,
    duplicateBundlePartsHandledDeterministically: true,
    conflictingBundlePartsRejected: true,
    staleSourcesRejected: true,
    revokedSourcesRejected: true,
    unknownSourcesRejected: true,
    malformedSourcesRejected: true,
    emptySourcesRejected: true,
    validBundleFeedsReviewReaderOnly: true,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false
  });
  assert.deepEqual(
    fixture.sourceBundleCases.map((bundleCase) => bundleCase.caseId),
    expectedCaseIds
  );

  for (const bundleCase of fixture.sourceBundleCases) {
    assert.equal(bundleCase.classification, expectedClassifications[bundleCase.caseId]);
    assert.equal(bundleCase.reviewOnly, true, bundleCase.caseId);
    assert.equal(bundleCase.authoritative, false, bundleCase.caseId);
    assert.equal(bundleCase.approvalGrant.produced, false, bundleCase.caseId);
    assert.equal(bundleCase.approvalGrant.persisted, false, bundleCase.caseId);
    assert.equal(bundleCase.approvalGrant.grantId, null, bundleCase.caseId);
    assertAllFalse(bundleCase.runtimeEffect);
  }
  assert.equal(fixture.readerIntegration.validBundleMayFeedReviewReader, true);
  assert.equal(fixture.readerIntegration.rejectedBundleDoesNotFeedReader, true);
  assert.equal(fixture.readerIntegration.readerStillReviewOnly, true);
  assert.equal(fixture.readerIntegration.evaluatorStillReviewOnly, true);
  assert.equal(fixture.readerIntegration.readerCanProduceGrant, false);
  assert.equal(fixture.readerIntegration.evaluatorCanProduceGrant, false);
  assertAllFalse(fixture.blockedRuntimeEffect);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.22 source bundle", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-22-source-bundle-"));

  try {
    for (const args of [
      fixture.serveRuntimeBlockedBehavior.args,
      fixture.serveRuntimeBlockedBehavior.dryRunArgs
    ]) {
      const failure = await runCliFailure(args, { cwd: scratch });
      const label = args.join(" ");

      assert.notEqual(failure.code, 0, label);
      assert.equal(failure.stdout, "", label);
      assert.equal(failure.stderr, fixture.serveRuntimeBlockedBehavior.stderr, label);
      assert.match(failure.stderr, /Runtime unavailable: serve-runtime is recognized/);
      assert.deepEqual(await readdir(scratch), [], `${label} should not write files`);
    }
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("Phase 5.22 source bundle command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-22-source-bundle-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const command of sourceBundleCommandProbes) {
      for (const args of [[command], [command, "--dry-run"]]) {
        const failure = await runCliFailure(args, { cwd: scratch });
        const label = args.join(" ");

        assert.notEqual(failure.code, 0, label);
        assert.equal(failure.stdout, "", label);
        if (command === "serve-runtime") {
          assert.equal(failure.stderr, serveRuntimeStderr, label);
        } else {
          assert.match(failure.stderr, /^Usage: ardyn /, label);
        }
        assert.deepEqual(await readdir(scratch), [], `${label} should not write files`);
      }
    }
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("Phase 5.22 does not change CLI runtime source or add source-bundle runtime primitives", async () => {
  const [{ stdout: baselineSource }, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase522BaselineCommit}:apps/cli/src/index.mjs`], {
      cwd: repoRoot,
      encoding: "utf8",
      maxBuffer: 1024 * 1024
    }),
    readFile(cliSourceUrl, "utf8")
  ]);

  assert.equal(currentSource, baselineSource);

  for (const forbiddenPattern of [
    /process\.stdin/,
    /process\.stdout\.write\s*\([^)]*runtime/i,
    /process\.stderr\.write\s*\([^)]*runtime/i,
    /node:readline/,
    /node:child_process/,
    /node:http/,
    /node:https/,
    /node:net/,
    /node:dgram/,
    /\bfetch\s*\(/,
    /\bWebSocket\b/,
    /\bspawn\s*\(/,
    /\bfork\s*\(/,
    /\bexec(File)?\s*\(/,
    /\bcreateServer\s*\(/,
    /\.listen\s*\(/,
    /process\.kill\s*\(/,
    /\bwatch\s*\(/,
    /\bwatchFile\s*\(/,
    /\bwriteFile\s*\([^)]*runtime/i,
    /\bappendFile\s*\(/,
    /process\.env/,
    /approval.*grant.*create/i,
    /approvalPrerequisiteSourceBundleCommand/i,
    /runtimePrerequisiteSourceBundleCommand/i
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
