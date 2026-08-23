// Credibility pass: THE canonical secret redactor.
//
// Previously four drifting copies existed (CLI redactStderr, data-auth
// redactSecrets, processor-pipeline redactCapturedText, and the internal
// diagnostic engine's own tracked-redaction). This module is the single
// source every caller delegates to. Strongest-pattern superset:
//   - key=value assignment forms for token/secret/password/api_key/api-key
//   - Bearer credentials
//   - OpenAI-style sk- keys and GitHub ghp_ tokens
// Everything that reaches transcripts, audits, SSE frames, or logs MUST go
// through here.

export function redactSecretsDeep(text) {
  if (!text || typeof text !== "string") return text;
  return text
    .replace(/(?:token|secret|password|api_key|apikey|api-key)\s*=\s*[^\s\n]+/gi, "REDACTED")
    .replace(/(?:Bearer)\s+[A-Za-z0-9._-]+/gi, "Bearer REDACTED")
    .replace(/(?:sk-)[A-Za-z0-9]{20,}/gi, "sk-REDACTED")
    .replace(/(?:ghp_)[A-Za-z0-9]{36}/gi, "ghp_REDACTED");
}

export default { redactSecretsDeep };
