import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const indexFixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase4-0h/reviewer-handoff-index.json",
  import.meta.url
);
const indexDocUrl = new URL("../docs/phase-4-0h-reviewer-handoff-index.md", import.meta.url);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const coreSourceUrl = new URL("../packages/core/src/index.mjs", import.meta.url);
const reportScriptUrl = new URL("../scripts/report-phase-status.mjs", import.meta.url);
const repoRootUrl = new URL("../", import.meta.url);
const docUrls = [
  new URL("../README.md", import.meta.url),
  new URL("../apps/cli/README.md", import.meta.url),
  new URL("../packages/core/README.md", import.meta.url),
  new URL("../docs/architecture.md", import.meta.url),
  new URL("../docs/host-policy-preconditions.md", import.meta.url),
  new URL("../docs/session-events-stdio-contract.md", import.meta.url),
  new URL("../docs/phase-4-stdio-dry-run-event-emission.md", import.meta.url),
  new URL("../docs/phase-4-0g-host-policy-review-comparison.md", import.meta.url)
];

const topLevelOrder = Object.freeze([
  "schema",
  "schemaVersion",
  "indexPhase",
  "phaseIntroduced",
  "artifactKind",
  "metadataGeneratedAt",
  "reviewRange",
  "runtimeStatus",
  "artifactCount",
  "grantsRuntimeApproval",
  "runtimeBehaviorIntroduced",
  "liveRuntimeBehaviorIntroduced",
  "reviewMetadataOnly",
  "authoritativeRoles",
  "evidenceOnlyRoles",
  "safety",
  "artifacts"
]);

const artifactKeyOrder = Object.freeze([
  "path",
  "artifactKind",
  "phaseIntroduced",
  "reviewPurpose",
  "runtimeStatus",
  "evidenceRole",
  "authoritative",
  "normative",
  "fixture",
  "docs",
  "displayOnlyEvidence",
  "grantsRuntimeApproval",
  "runtimeBehaviorIntroduced"
]);

const allowedRuntimeStatuses = new Set([
  "finite-dry-run-only",
  "pre-runtime-policy-only",
  "static-review-record-only",
  "static-display-only",
  "static-reviewer-index-only"
]);

async function readIndexFixture() {
  const text = await readFile(indexFixtureUrl, "utf8");
  return {
    text,
    json: JSON.parse(text)
  };
}

function artifactUrl(path) {
  return new URL(path, repoRootUrl);
}

test("Phase 4.0H reviewer handoff index metadata is deterministic LF-only JSON", async () => {
  const { text, json } = await readIndexFixture();

  assert.equal(text.endsWith("\n"), true);
  assert.equal(text.includes("\r"), false);
  assert.deepEqual(Object.keys(json), topLevelOrder);
  assert.equal(json.schema, "ardyn.phase-4-reviewer-handoff-index");
  assert.equal(json.schemaVersion, "0.1.0");
  assert.equal(json.indexPhase, "phase-4.0h-reviewer-handoff-index");
  assert.equal(json.phaseIntroduced, "4.0H");
  assert.equal(json.artifactKind, "phase_4_reviewer_handoff_index");
  assert.equal(json.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.deepEqual(json.reviewRange, {
    fromPhase: "4.0A",
    throughPhase: "4.0H"
  });
  assert.equal(json.runtimeStatus, "static-reviewer-index-only");
  assert.equal(json.artifactCount, json.artifacts.length);
});

test("Phase 4.0H reviewer handoff index covers Phase 4.0A through Phase 4.0H artifacts", async () => {
  const { json } = await readIndexFixture();
  const indexedPhases = [...new Set(json.artifacts.map((artifact) => artifact.phaseIntroduced))];

  assert.deepEqual(indexedPhases, ["4.0A", "4.0B", "4.0C", "4.0D", "4.0E", "4.0F", "4.0G", "4.0H"]);

  for (const requiredPath of [
    "docs/session-events-stdio-contract.md",
    "docs/phase-4-stdio-dry-run-event-emission.md",
    "tests/fixtures/stdio-dry-run/phase4-0b-minimal-session-events.jsonl",
    "docs/phase-4-0c-pre-runtime-transport-policy.md",
    "docs/phase-4-0d-rust-host-transport-policy-contracts.md",
    "docs/phase-4-0e-rust-host-policy-metadata.md",
    "tests/fixtures/host-policy/phase4-0e-stdio-transport-policy-metadata.json",
    "docs/phase-4-0f-host-policy-review-records.md",
    "docs/phase-4-0g-host-policy-review-comparison.md",
    "docs/phase-4-0h-reviewer-handoff-index.md",
    "tests/fixtures/host-policy/phase4-0h/reviewer-handoff-index.json"
  ]) {
    assert.ok(
      json.artifacts.some((artifact) => artifact.path === requiredPath),
      `${requiredPath} should be indexed`
    );
  }

  for (const artifact of json.artifacts) {
    assert.deepEqual(Object.keys(artifact), artifactKeyOrder, `${artifact.path} key order`);
    await access(artifactUrl(artifact.path));
    assert.equal(allowedRuntimeStatuses.has(artifact.runtimeStatus), true, artifact.path);
    assert.match(artifact.phaseIntroduced, /^4\.0[A-H]$/);
  }
});

test("Phase 4.0H reviewer handoff index cannot grant approval or enable runtime behavior", async () => {
  const { json } = await readIndexFixture();

  assert.equal(json.reviewMetadataOnly, true);
  assert.equal(json.grantsRuntimeApproval, false);
  assert.equal(json.runtimeBehaviorIntroduced, false);
  assert.equal(json.liveRuntimeBehaviorIntroduced, false);
  assert.equal(json.safety.nonExecuting, true);
  assert.equal(json.safety.staticIndexOnly, true);
  assert.equal(json.safety.reviewOnly, true);

  for (const [key, value] of Object.entries(json.safety)) {
    if (key === "nonExecuting" || key === "staticIndexOnly" || key === "reviewOnly") {
      assert.equal(value, true, `${key} should remain true`);
    } else {
      assert.equal(value, false, `${key} should remain false`);
    }
  }

  for (const artifact of json.artifacts) {
    assert.equal(artifact.grantsRuntimeApproval, false, artifact.path);
    assert.equal(artifact.runtimeBehaviorIntroduced, false, artifact.path);
  }
});

test("Phase 4.0H marks review records and comparison artifacts as static evidence only", async () => {
  const { json } = await readIndexFixture();
  const reviewRecordArtifacts = json.artifacts.filter(
    (artifact) => artifact.artifactKind === "host-policy-review-record-fixture"
  );
  const comparisonArtifacts = json.artifacts.filter(
    (artifact) => artifact.artifactKind === "host-policy-review-comparison-fixture"
  );

  assert.equal(reviewRecordArtifacts.length, 7);
  assert.equal(comparisonArtifacts.length, 7);

  for (const artifact of reviewRecordArtifacts) {
    assert.equal(artifact.runtimeStatus, "static-review-record-only", artifact.path);
    assert.equal(artifact.evidenceRole, "fixture-evidence", artifact.path);
    assert.equal(artifact.fixture, true, artifact.path);
    assert.equal(artifact.authoritative, false, artifact.path);
    assert.equal(artifact.normative, false, artifact.path);
  }

  for (const artifact of comparisonArtifacts) {
    assert.equal(artifact.runtimeStatus, "static-display-only", artifact.path);
    assert.equal(artifact.evidenceRole, "display-only-evidence", artifact.path);
    assert.equal(artifact.displayOnlyEvidence, true, artifact.path);
    assert.equal(artifact.fixture, true, artifact.path);
    assert.equal(artifact.authoritative, false, artifact.path);
    assert.equal(artifact.normative, false, artifact.path);
  }
});

test("Phase 4.0H docs and report describe reviewer navigation without runtime approval", async () => {
  const [indexDoc, reportSource, ...indexedDocs] = await Promise.all([
    readFile(indexDocUrl, "utf8"),
    readFile(reportScriptUrl, "utf8"),
    ...docUrls.map((url) => readFile(url, "utf8"))
  ]);
  const normalizedIndexDoc = indexDoc.replace(/\s+/g, " ");

  for (const requiredPhrase of [
    "static reviewer handoff index",
    "navigation metadata for Devin/Codex review workflows",
    "not runtime configuration",
    "not an approval token",
    "not consumed by a live host loop",
    "Normative docs",
    "Evidence-only entries",
    "grantsRuntimeApproval: false",
    "Still Forbidden"
  ]) {
    assert.match(
      normalizedIndexDoc,
      new RegExp(requiredPhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    );
  }

  for (const source of indexedDocs) {
    assert.match(source, /docs\/phase-4-0h-reviewer-handoff-index\.md/);
  }

  assert.match(reportSource, /phase40HInventory/);
  assert.match(reportSource, /reviewerHandoffIndex/);
  assert.match(reportSource, /staticIndexOnly/);
  assert.match(reportSource, /grantsRuntimeApproval/);
});

test("Phase 4.0H source guards do not add runtime or CLI command surfaces", async () => {
  const [cliSource, coreSource, reportSource] = await Promise.all([
    readFile(cliSourceUrl, "utf8"),
    readFile(coreSourceUrl, "utf8"),
    readFile(reportScriptUrl, "utf8")
  ]);

  for (const forbiddenCliPattern of [
    /host-policy-index/i,
    /policy-index/i,
    /review-index/i,
    /index-host-policy/i,
    /phase-4-0h/i,
    /replay-session-transcript/,
    /policy-metadata/,
    /host-policy-export/,
    /serve-runtime/,
    /stdio-runtime/,
    /process\.stdin/,
    /node:readline/,
    /node:child_process/,
    /node:http/,
    /node:https/,
    /node:net/,
    /\bWebSocket\b/,
    /\bspawn\s*\(/,
    /\bcreateServer\s*\(/,
    /\blisten\s*\(/
  ]) {
    assert.doesNotMatch(cliSource, forbiddenCliPattern);
  }

  for (const forbiddenCorePattern of [
    /process\.stdin/,
    /node:readline/,
    /node:child_process/,
    /node:http/,
    /node:https/,
    /node:net/,
    /\bWebSocket\b/,
    /\bspawn\s*\(/,
    /\bcreateServer\s*\(/,
    /\blisten\s*\(/
  ]) {
    assert.doesNotMatch(coreSource, forbiddenCorePattern);
  }

  for (const forbiddenReportPattern of [
    /node:child_process/,
    /from\s+["']child_process["']/,
    /node:http/,
    /node:https/,
    /node:net/,
    /node:dgram/,
    /\bfetch\s*\(/,
    /\bWebSocket\b/,
    /\bspawn\s*\(/,
    /\bexec(File)?\s*\(/,
    /\bcreateServer\s*\(/,
    /\blisten\s*\(/,
    /\bwriteFile\s*\(/,
    /\bappendFile\s*\(/,
    /\bmkdir\s*\(/,
    /\brm\s*\(/,
    /\bunlink\s*\(/
  ]) {
    assert.doesNotMatch(reportSource, forbiddenReportPattern);
  }
});
