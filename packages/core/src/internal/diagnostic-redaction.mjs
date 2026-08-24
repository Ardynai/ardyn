// P3a: extracted from index.mjs — stderr diagnostic-redaction family.
// Behavior-preserving move; public names re-exported by index.mjs unchanged.

export const ARDYN_STDIO_FRAMING_REDACTION_PHASE =
  "phase-4.1c-framing-redaction-contracts";
export const STDERR_REDACTION_SAFE = "redacted_safe";
export const STDERR_REDACTION_UNREDACTABLE_FAIL_CLOSED = "unredactable_fail_closed";
export const STDERR_REDACTION_MALFORMED = "malformed";

function diagnosticCodeIsDeterministic(code) {
  return typeof code === "string" && /^[a-z][a-z0-9_.-]{2,63}$/.test(code);
}

function replaceAndTrack(message, pattern, replacement, kind, redactions, trackedReplacement = replacement) {
  const matched = pattern.test(message);
  pattern.lastIndex = 0;
  const next = message.replace(pattern, replacement);

  if (matched) {
    redactions.push({ kind, replacement: trackedReplacement });
  }

  return next;
}

function redactSensitiveDiagnosticMessage(message) {
  const redactions = [];

  if (message.includes("\u0000") || /UNREDACTABLE_RAW_BYTES/.test(message)) {
    return {
      message: "[DIAGNOSTIC_REDACTION_FAILED]",
      redactions,
      unredactable: true
    };
  }

  let redacted = message;
  redacted = replaceAndTrack(
    redacted,
    /raw parse detail:\s*.+$/gi,
    "raw parse detail: [REDACTED_RAW_PARSE_DETAIL]",
    "raw_parse_detail",
    redactions
  );
  redacted = replaceAndTrack(
    redacted,
    /stack:\s*[\s\S]+$/gi,
    "stack: [REDACTED_STACK]",
    "stack_trace",
    redactions
  );
  redacted = replaceAndTrack(
    redacted,
    /\n\s*at\s+[\s\S]+$/g,
    " [REDACTED_STACK]",
    "stack_trace",
    redactions
  );
  redacted = replaceAndTrack(
    redacted,
    /[A-Za-z]:\\Users\\[^ "'\n\r]+/g,
    "[REDACTED_HOME_PATH]",
    "user_home_path",
    redactions
  );
  redacted = replaceAndTrack(
    redacted,
    /\/(?:Users|home)\/[^ "'\n\r]+/g,
    "[REDACTED_HOME_PATH]",
    "user_home_path",
    redactions
  );
  redacted = replaceAndTrack(
    redacted,
    /[A-Za-z]:\\(?!Users\\)[^ "'\n\r]+/g,
    "[REDACTED_ABSOLUTE_PATH]",
    "absolute_path",
    redactions
  );
  redacted = replaceAndTrack(
    redacted,
    /\/(?:var|tmp|etc|opt|srv|workspace|mnt)\/[^ "'\n\r]+/g,
    "[REDACTED_ABSOLUTE_PATH]",
    "absolute_path",
    redactions
  );
  redacted = replaceAndTrack(
    redacted,
    /process\.env\.[A-Z0-9_]+(?:=[^ "'\n\r]+)?/g,
    "process.env.[REDACTED_ENV]",
    "environment_variable",
    redactions
  );
  redacted = replaceAndTrack(
    redacted,
    /\b(?:SECRET|TOKEN|API_KEY|APIKEY|PASSWORD|AUTHORIZATION|HOME|USER)=([^ "'\n\r]+)/g,
    "[REDACTED_ENV]=[REDACTED]",
    "environment_variable",
    redactions
  );
  redacted = replaceAndTrack(
    redacted,
    /\b(secret|token|api[_-]?key|password|authorization)\s*[:=]\s*[^ "'\n\r,;]+/gi,
    "$1=[REDACTED_SECRET]",
    "secret_or_token",
    redactions,
    "secret-or-token=[REDACTED_SECRET]"
  );
  redacted = replaceAndTrack(
    redacted,
    /\bBearer\s+[A-Za-z0-9._-]+/g,
    "Bearer [REDACTED_TOKEN]",
    "secret_or_token",
    redactions
  );
  redacted = replaceAndTrack(
    redacted,
    /\bsk-[A-Za-z0-9_-]{8,}\b/g,
    "[REDACTED_API_KEY]",
    "api_key",
    redactions
  );

  if (/[\r\n]/.test(redacted)) {
    return {
      message: "[DIAGNOSTIC_REDACTION_FAILED]",
      redactions,
      unredactable: true
    };
  }

  return {
    message: redacted,
    redactions,
    unredactable: false
  };
}

function redactionRuntimeEffect() {
  return {
    currentContractEnablesRuntime: false,
    processStdioOwnershipAvailable: false,
    stderrWriterAvailable: false,
    stdoutWriterAvailable: false,
    runtimeCommandAvailable: false,
    writesToStdout: false,
    writesToStderr: false
  };
}

function redactionRecord(classification, fields = {}) {
  return {
    schema: "ardyn.stderr-diagnostic-redaction-review",
    schemaVersion: "0.1.0",
    phase: ARDYN_STDIO_FRAMING_REDACTION_PHASE,
    classification,
    diagnostic: {
      code: fields.code ?? "diagnostic.malformed",
      message: fields.message ?? "[DIAGNOSTIC_REDACTION_FAILED]"
    },
    redactions: fields.redactions ?? [],
    failClosed: classification !== STDERR_REDACTION_SAFE,
    reviewOnly: true,
    runtimeEffect: redactionRuntimeEffect()
  };
}

export function redactStderrDiagnosticForReview(diagnostic) {
  if (
    !diagnostic ||
    typeof diagnostic !== "object" ||
    !diagnosticCodeIsDeterministic(diagnostic.code) ||
    typeof diagnostic.message !== "string" ||
    diagnostic.message.length === 0
  ) {
    return redactionRecord(STDERR_REDACTION_MALFORMED);
  }

  const redacted = redactSensitiveDiagnosticMessage(diagnostic.message);

  if (redacted.unredactable) {
    return redactionRecord(STDERR_REDACTION_UNREDACTABLE_FAIL_CLOSED, {
      code: diagnostic.code,
      message: redacted.message,
      redactions: redacted.redactions
    });
  }

  return redactionRecord(STDERR_REDACTION_SAFE, {
    code: diagnostic.code,
    message: redacted.message,
    redactions: redacted.redactions
  });
}

export function classifyRedactionSafety(diagnostic) {
  return redactStderrDiagnosticForReview(diagnostic).classification;
}
