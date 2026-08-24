import { isPlainObjectRecord } from "./internal/utils.mjs";
import { stableJsonStringify } from "./internal/review-shared.mjs";
import { STDERR_REDACTION_MALFORMED, STDERR_REDACTION_SAFE, STDERR_REDACTION_UNREDACTABLE_FAIL_CLOSED } from "./internal/diagnostic-redaction.mjs";

import { ARDYN_STDIO_FRAMING_REDACTION_PHASE } from "./internal/diagnostic-redaction.mjs";


export const STDIO_FRAMING_REDACTION_CONTRACT_SCHEMA =
  "ardyn.stdio-framing-redaction-contract";
export const STDIO_FRAMING_REDACTION_CONTRACT_VERSION = "0.1.0";
export const JSONL_WHOLE_LINE_BUNDLE_VALID = "valid_whole_line_bundle";
export const JSONL_WHOLE_LINE_BUNDLE_BLANK_LINE_REJECTED = "blank_line_rejected";
export const JSONL_WHOLE_LINE_BUNDLE_MISSING_FINAL_LF = "missing_final_lf";
export const JSONL_WHOLE_LINE_BUNDLE_CRLF_REJECTED = "crlf_rejected";
export const JSONL_WHOLE_LINE_BUNDLE_MALFORMED_JSON_LINE = "malformed_json_line";
export const JSONL_WHOLE_LINE_BUNDLE_PARTIAL_LINE_REJECTED = "partial_line_rejected";
function jsonlRuntimeEffect() {
  return {
    currentContractEnablesRuntime: false,
    processStdioOwnershipAvailable: false,
    stdoutWriterAvailable: false,
    stderrWriterAvailable: false,
    stdinReaderAvailable: false,
    runtimeCommandAvailable: false,
    writesToStdout: false,
    writesToStderr: false
  };
}
function framingValidationRecord(classification, fields = {}) {
  const valid = classification === JSONL_WHOLE_LINE_BUNDLE_VALID;

  return {
    schema: "ardyn.jsonl-whole-line-bundle-validation",
    schemaVersion: "0.1.0",
    phase: ARDYN_STDIO_FRAMING_REDACTION_PHASE,
    classification,
    valid,
    lineCount: fields.lineCount ?? 0,
    lfOnly: fields.lfOnly ?? true,
    finalLf: fields.finalLf ?? false,
    blankLinesAllowed: false,
    partialLineEmissionAllowed: false,
    oneJsonObjectPerLine: valid,
    errors: fields.errors ?? [],
    reviewOnly: true,
    runtimeEffect: jsonlRuntimeEffect()
  };
}
export function formatJsonlWholeLinesForReview(records) {
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error("review JSONL records must contain at least one object.");
  }

  const lines = [];

  for (let index = 0; index < records.length; index += 1) {
    if (!Object.prototype.hasOwnProperty.call(records, index)) {
      throw new Error(`review JSONL record ${index + 1} is missing.`);
    }

    const record = records[index];

    if (!isPlainObjectRecord(record)) {
      throw new Error(`review JSONL record ${index + 1} must be a JSON object.`);
    }

    lines.push(stableJsonStringify(record));
  }

  return `${lines.join("\n")}\n`;
}
export function validateJsonlWholeLineBundle(jsonl) {
  if (typeof jsonl !== "string") {
    return framingValidationRecord(JSONL_WHOLE_LINE_BUNDLE_MALFORMED_JSON_LINE, {
      errors: ["bundle must be a string"]
    });
  }

  if (jsonl.includes("\r")) {
    return framingValidationRecord(JSONL_WHOLE_LINE_BUNDLE_CRLF_REJECTED, {
      lfOnly: false,
      finalLf: jsonl.endsWith("\n"),
      errors: ["bundle must be LF-only and must not contain CR or CRLF"]
    });
  }

  if (!jsonl.endsWith("\n")) {
    return framingValidationRecord(JSONL_WHOLE_LINE_BUNDLE_MISSING_FINAL_LF, {
      finalLf: false,
      errors: ["bundle must end with a final LF"]
    });
  }

  const lines = jsonl.split("\n");
  const contentLines = lines.slice(0, -1);

  for (let index = 0; index < contentLines.length; index += 1) {
    if (contentLines[index] === "") {
      return framingValidationRecord(JSONL_WHOLE_LINE_BUNDLE_BLANK_LINE_REJECTED, {
        lineCount: contentLines.length,
        finalLf: true,
        errors: [`line ${index + 1} must not be blank`]
      });
    }
  }

  for (let index = 0; index < contentLines.length; index += 1) {
    const line = contentLines[index];
    const trimmed = line.trim();

    if (trimmed !== line) {
      return framingValidationRecord(JSONL_WHOLE_LINE_BUNDLE_MALFORMED_JSON_LINE, {
        lineCount: contentLines.length,
        finalLf: true,
        errors: [`line ${index + 1} must not contain leading or trailing whitespace`]
      });
    }

    if (trimmed.startsWith("{") && !trimmed.endsWith("}")) {
      return framingValidationRecord(JSONL_WHOLE_LINE_BUNDLE_PARTIAL_LINE_REJECTED, {
        lineCount: contentLines.length,
        finalLf: true,
        errors: [`line ${index + 1} is a partial JSON object`]
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(line);
    } catch {
      return framingValidationRecord(JSONL_WHOLE_LINE_BUNDLE_MALFORMED_JSON_LINE, {
        lineCount: contentLines.length,
        finalLf: true,
        errors: [`line ${index + 1} must contain exactly one valid JSON object`]
      });
    }

    if (!isPlainObjectRecord(parsed)) {
      return framingValidationRecord(JSONL_WHOLE_LINE_BUNDLE_MALFORMED_JSON_LINE, {
        lineCount: contentLines.length,
        finalLf: true,
        errors: [`line ${index + 1} must contain a JSON object`]
      });
    }
  }

  return framingValidationRecord(JSONL_WHOLE_LINE_BUNDLE_VALID, {
    lineCount: contentLines.length,
    finalLf: true
  });
}
export function createStdioFramingRedactionContractForReview() {
  return {
    schema: STDIO_FRAMING_REDACTION_CONTRACT_SCHEMA,
    schemaVersion: STDIO_FRAMING_REDACTION_CONTRACT_VERSION,
    contractKind: "stdio-framing-redaction-contract",
    contractPhase: ARDYN_STDIO_FRAMING_REDACTION_PHASE,
    reviewedPhase: "4.1C",
    jsonlFraming: {
      exactlyOneJsonObjectPerLine: true,
      jsonObjectOnly: true,
      lfOnly: true,
      finalLfRequired: true,
      blankLinesAllowed: false,
      crlfAllowed: false,
      partialLineEmissionAllowed: false,
      deterministicKeyOrder: "ascii-key-order-via-stable-json-display-v1",
      helper: "formatJsonlWholeLinesForReview"
    },
    stderrRedaction: {
      deterministicCodeRequired: true,
      deterministicMessageRequired: true,
      codePattern: "^[a-z][a-z0-9_.-]{2,63}$",
      redactionTokenPolicy: "typed-redaction-placeholders",
      helper: "redactStderrDiagnosticForReview",
      classifier: "classifyRedactionSafety",
      failClosedOnUnredactableDiagnostics: true,
      redactedSubjects: [
        "secrets",
        "environment_variables",
        "absolute_paths",
        "user_home_paths",
        "tokens",
        "api_keys",
        "stack_traces",
        "raw_parse_details"
      ]
    },
    validation: {
      helper: "validateJsonlWholeLineBundle",
      jsonlClassifications: [
        JSONL_WHOLE_LINE_BUNDLE_VALID,
        JSONL_WHOLE_LINE_BUNDLE_BLANK_LINE_REJECTED,
        JSONL_WHOLE_LINE_BUNDLE_MISSING_FINAL_LF,
        JSONL_WHOLE_LINE_BUNDLE_CRLF_REJECTED,
        JSONL_WHOLE_LINE_BUNDLE_MALFORMED_JSON_LINE,
        JSONL_WHOLE_LINE_BUNDLE_PARTIAL_LINE_REJECTED
      ],
      redactionClassifications: [
        STDERR_REDACTION_SAFE,
        STDERR_REDACTION_UNREDACTABLE_FAIL_CLOSED,
        STDERR_REDACTION_MALFORMED
      ]
    },
    runtimeEffect: {
      currentContractEnablesRuntime: false,
      runtimeImplementationAvailable: false,
      runtimeCommandAvailable: false,
      processStdioOwnershipAvailable: false,
      stdinReaderAvailable: false,
      stdoutWriterAvailable: false,
      stderrWriterAvailable: false,
      failureAuditRuntimeAvailable: false,
      approvalEvaluatorAvailable: false
    },
    audit: {
      createdAt: "1970-01-01T00:00:00.000Z",
      createdBy: "codex-phase-4.1c",
      reviewer: "Codex",
      devinReviewRequiredNow: false,
      preserveDevinReviewFor: "major-runtime-readiness-checkpoint",
      metadataOnly: true,
      writesFiles: false,
      runsRuntime: false
    }
  };
}
export function formatStdioFramingRedactionContractJsonForReview() {
  return `${JSON.stringify(createStdioFramingRedactionContractForReview(), null, 2)}\n`;
}