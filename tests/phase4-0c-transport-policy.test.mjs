import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const transportPolicyUrl = new URL(
  "../docs/phase-4-0c-pre-runtime-transport-policy.md",
  import.meta.url
);
const dryRunDocUrl = new URL("../docs/phase-4-stdio-dry-run-event-emission.md", import.meta.url);
const sessionContractUrl = new URL("../docs/session-events-stdio-contract.md", import.meta.url);
const hostPolicyUrl = new URL("../docs/host-policy-preconditions.md", import.meta.url);
const readmeUrl = new URL("../README.md", import.meta.url);
const cliReadmeUrl = new URL("../apps/cli/README.md", import.meta.url);
const coreReadmeUrl = new URL("../packages/core/README.md", import.meta.url);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const coreSourceUrl = new URL("../packages/core/src/index.mjs", import.meta.url);
const cliSourcePath = fileURLToPath(cliSourceUrl);

test("Phase 4.0C transport policy covers future stdio ownership without enabling runtime", async () => {
  const source = await readFile(transportPolicyUrl, "utf8");

  for (const requiredPhrase of [
    "Phase 4.0C is a policy and design hardening phase",
    "does not implement a live stdin command loop",
    "The future Rust host must own process-level stdio policy",
    "The TypeScript core remains responsible for deterministic contract data",
    "Future live stdout must be reserved for session-event JSONL only",
    "Stderr is reserved for diagnostics, never session-event JSONL",
    "Phase 4.0C does not implement backpressure handling",
    "Partial frames are not valid events",
    "Dropped lines",
    "Duplicate lines",
    "Out-of-order lines",
    "Malformed lines",
    "Process Exit Semantics",
    "Stderr Redaction Policy",
    "Transcript Persistence And Replay Design",
    "proposal-only in Phase 4.0C"
  ]) {
    assert.match(source, new RegExp(requiredPhrase, "i"), `${requiredPhrase} should be documented`);
  }

  for (const forbiddenRuntimeClaim of [
    /Phase 4\.0C implements a live/i,
    /Phase 4\.0C adds a live/i,
    /runtime replay is implemented/i,
    /replay-session-transcript .* implemented/i
  ]) {
    assert.doesNotMatch(source, forbiddenRuntimeClaim);
  }
});

test("Phase 4.0C redaction and replay policy remains pre-runtime and safe by default", async () => {
  const source = await readFile(transportPolicyUrl, "utf8");

  for (const redactionTopic of [
    "secrets and production signing keys",
    "bearer tokens, API keys, cookies, passwords, and connection strings",
    "local absolute paths, home directories, usernames, and workspace roots",
    "raw environment variables or environment dumps",
    "stack traces, frames, module paths, and dependency internals",
    "raw JSON parse excerpts",
    "schema validation values"
  ]) {
    assert.match(source, new RegExp(redactionTopic, "i"), `${redactionTopic} should be redacted before live runtime`);
  }

  assert.match(source, /preferred replay input is normalized\s+`ardyn\.session-transcript` JSON/i);
  assert.match(source, /Raw\s+JSONL line capture can remain a forensic source/i);
  assert.match(
    source,
    /Replay must\s+reject or classify duplicate, dropped, out-of-order, and malformed\s+events/i
  );
  assert.match(source, /must\s+not start adapters, execute tasks, spawn processes, connect to Locus/i);

  for (const replayMatrixEntry of [
    "Valid normalized transcript",
    "Dropped sequence",
    "Missing terminal event",
    "Duplicate `sequence`",
    "Duplicate `eventId`",
    "Byte-identical duplicate raw JSONL line",
    "Out-of-order sequence",
    "Blank line",
    "CRLF framing",
    "Non-JSON line",
    "Non-object JSON line",
    "Schema-invalid event",
    "Unsafe safety flag",
    "Non-ARDYN source harness"
  ]) {
    assert.match(source, new RegExp(replayMatrixEntry, "i"));
  }
});

test("Phase 4.0C docs are indexed from the existing Phase 4 and package docs", async () => {
  const [dryRunDoc, sessionContract, hostPolicy, readme, cliReadme, coreReadme] =
    await Promise.all([
      readFile(dryRunDocUrl, "utf8"),
      readFile(sessionContractUrl, "utf8"),
      readFile(hostPolicyUrl, "utf8"),
      readFile(readmeUrl, "utf8"),
      readFile(cliReadmeUrl, "utf8"),
      readFile(coreReadmeUrl, "utf8")
    ]);

  for (const [name, source] of [
    ["dry-run doc", dryRunDoc],
    ["session contract", sessionContract],
    ["host policy", hostPolicy],
    ["README", readme]
  ]) {
    assert.match(
      source,
      /docs\/phase-4-0c-pre-runtime-transport-policy\.md/,
      `${name} should link the Phase 4.0C policy`
    );
  }

  assert.match(cliReadme, /Phase 4\.0C adds pre-runtime transport policy only/i);
  assert.match(cliReadme, /adds no replay or live runtime CLI/i);
  assert.match(coreReadme, /Phase 4\.0C does not add core runtime APIs/i);
});

test("Phase 4.0C source does not add replay execution or live transport hooks", async () => {
  const [cliSource, coreSource] = await Promise.all([
    readFile(cliSourceUrl, "utf8"),
    readFile(coreSourceUrl, "utf8")
  ]);
  const combinedSource = `${cliSource}\n${coreSource}`;
  const commandBranches = [...cliSource.matchAll(/if \(command === "([^"]+)"\)/g)].map(
    (match) => match[1]
  );

  assert.equal(commandBranches.includes("replay-session-transcript"), false);

  for (const forbiddenPattern of [
    /process\.stdin/,
    /node:readline/,
    /node:child_process/,
    /from\s+["']child_process["']/,
    /require\s*\(\s*["'](?:node:)?child_process["']\s*\)/,
    /node:http/,
    /node:https/,
    /node:net/,
    /node:dgram/,
    /\bfetch\s*\(/,
    /\bWebSocket\b/,
    /\bspawn\s*\(/,
    /\bexecFile\s*\(/,
    /childProcess\.(?:exec|execFile|spawn)\s*\(/,
    /\bcreateServer\s*\(/,
    /\blisten\s*\(/,
    /@ardyn\/adapters/,
    /@ardyn\/fabric/,
    /@ardyn\/mcp/
  ]) {
    assert.doesNotMatch(combinedSource, forbiddenPattern);
  }
});

test("Phase 4.0C replay proposal is not implemented as a CLI command", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase4-0c-replay-proposal-"));

  try {
    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          cliSourcePath,
          "replay-session-transcript",
          "--file",
          "examples/session-transcripts/valid-minimal.json",
          "--summary"
        ],
        {
          cwd: repoRoot,
          encoding: "utf8"
        }
      ),
      (error) => {
        assert.notEqual(error.code, 0);
        assert.equal(error.stdout, "");
        assert.match(error.stderr, /^Usage: ardyn /);
        assert.doesNotMatch(error.stderr, /session\.started/);
        assert.doesNotMatch(error.stderr, /at\s+.+\(/);
        assert.doesNotMatch(error.stderr, /process\.env/i);
        return true;
      }
    );

    assert.deepEqual(await readdir(scratch), []);
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});
