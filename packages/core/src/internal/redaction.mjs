// Credibility pass: THE canonical secret redactor.
//
// Previously four drifting copies existed (CLI redactStderr, data-auth
// redactSecrets, processor-pipeline redactCapturedText, and the internal
// diagnostic engine's own tracked-redaction). This module is the single
// source every caller delegates to. Strongest-pattern superset:
//   - key=value AND key:value assignment forms (quoted or bare keys) for
//     token/secret/password/api_key/api-key families (incl. prefixed/suffixed
//     key names like access_token or auth-token)
//   - JSON-shaped "key":"value" pairs keep their key and quotes so JSON
//     frames stay parseable after redaction
//   - Bearer credentials
//   - OpenAI-style sk- keys and GitHub ghp_ tokens
// ponytail: string-only by design; non-string scalar values pass through.
// Known ceiling: secrets in non-scalar positions (objects/arrays as values)
// are not rewritten — upgrade path is a structural walker if that shows up.
// Everything that reaches transcripts, audits, SSE frames, or logs MUST go
// through here.

const SECRET_KEY = String.raw`(?:[\w_-]*[-_])?(?:token|secret|password|api[_-]?key)(?:[-_][\w_-]*)?`;

export function redactSecretsDeep(text) {
  if (!text || typeof text !== "string") return text;
  return text
    .replace(
      new RegExp(`("${SECRET_KEY}"\\s*:\\s*)("(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*')`, "gi"),
      '$1"REDACTED"'
    )
    .replace(
      new RegExp(`(${SECRET_KEY})(["']?\\s*[=:]\\s*)(?:"(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*'|[^\\s,;}\\n]+)`, "gi"),
      (match, key, sep) => (/^["']/.test(sep) ? `${key}${sep}"REDACTED"` : `${key}${sep}REDACTED`)
    )
    .replace(/(?:Bearer)\s+[A-Za-z0-9._-]+/gi, "Bearer REDACTED")
    .replace(/(?:sk-)[A-Za-z0-9]{20,}/gi, "sk-REDACTED")
    .replace(/(?:ghp_)[A-Za-z0-9]{36}/gi, "ghp_REDACTED");
}

export default { redactSecretsDeep };
