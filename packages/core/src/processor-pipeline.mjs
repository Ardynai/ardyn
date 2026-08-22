// M15: Pluggable pre/post processor pipeline for action gateways.
// Pattern adapted from Vision-Agents pluggable processors (MIT) — not vendored.
//
// A processor is { name, phase: "pre"|"post", process(ctx) -> result } where result is
// { action: "allow"|"deny"|"transform", reason?, patch?, audit? }.
// The gateway runs all pre processors in declared order before an action, executes,
// then runs post processors. The audit record is written BEFORE acting.
// Fail-closed: a missing/broken/throwing processor DENIES; deny is sticky — later
// processors still run (so audit-record can write its row) but cannot un-deny.

// Redact secrets in captured text (screenshots OCR, logs, exec stdout).
// Moved here from computer-use.mjs so both gateways compose the same redaction;
// computer-use.mjs re-exports it for backward compatibility.
// Credibility pass: delegates to the single canonical redactor
// (internal/redaction.mjs) — no more drifting copies.
import { redactSecretsDeep as redactCapturedText } from "./internal/redaction.mjs";
export { redactCapturedText };

// Policy rule matching — moved verbatim from computer-use createGateway.
export function matchPolicyRule(action, rule) {
  if (rule.action && action.action !== rule.action) return false;
  if (rule.text && typeof action.text === "string") {
    return action.text.includes(rule.text);
  }
  if (rule.action && action.action === rule.action && !rule.text) return true;
  return true; // empty rule matches all (used for default allow)
}

function normalizeDenyDecision(reason) {
  const r = reason == null ? "deny" : String(reason);
  return /^deny/.test(r) ? r : `deny_${r}`;
}

// Built-in processor (1): policy-gate — wraps the existing fail-closed allow/deny
// evaluation (deny rules before allow rules; no policy = deny).
export function policyGateProcessor(policy) {
  return {
    name: "policy-gate",
    phase: "pre",
    process(ctx) {
      const hasPolicy = policy && (policy.deny || policy.allow);
      if (!hasPolicy) return { action: "deny", reason: "deny_no_policy" };
      if ((policy.deny || []).some(r => matchPolicyRule(ctx.action, r))) {
        return { action: "deny", reason: "deny_rule" };
      }
      if ((policy.allow || []).some(r => matchPolicyRule(ctx.action, r))) {
        return { action: "allow" };
      }
      return { action: "deny", reason: "deny_no_allow" };
    },
  };
}

// Single audit-record shape shared by the built-in processor and the gateway's
// record-before-act fallback guard (one writer, one shape).
export function buildActionAuditRecord(ctx) {
  const record = {
    action: ctx.action.action,
    decision: ctx.decision,
    allowed: ctx.allowed,
    timestamp: new Date().toISOString(),
    auditRecordWrittenBefore: true,
    details: { ...ctx.action },
  };
  if (Array.isArray(ctx.auditPayloads) && ctx.auditPayloads.length > 0) {
    record.processorAudit = [...ctx.auditPayloads];
  }
  return record;
}

export function writeActionAuditRecord(audit, ctx) {
  const record = buildActionAuditRecord(ctx);
  audit.record(record);
  ctx.auditRecord = record;
  ctx.auditWrittenDecision = ctx.decision;
  return record;
}

// Built-in processor (3): audit-record — writes the audit row for the current ctx
// state. Place it AFTER policy-gate so the row carries the policy decision.
export function auditRecordProcessor(audit) {
  return {
    name: "audit-record",
    phase: "pre",
    process(ctx) {
      writeActionAuditRecord(audit, ctx);
      return { action: ctx.allowed ? "allow" : "deny" };
    },
  };
}

// Built-in processor (2): secret/PII redaction — masks token/secret strings in
// captured text on the post phase, reusing redactCapturedText. Transforms every
// top-level string field of the result; only changed fields are patched.
export function redactResultProcessor() {
  return {
    name: "redact-result",
    phase: "post",
    process(ctx) {
      const result = ctx.result;
      if (!result || typeof result !== "object") return { action: "allow" };
      const patch = {};
      let changed = false;
      for (const [key, value] of Object.entries(result)) {
        if (typeof value === "string") {
          const masked = redactCapturedText(value);
          if (masked !== value) {
            patch[key] = masked;
            changed = true;
          }
        }
      }
      return changed ? { action: "transform", patch } : { action: "allow" };
    },
  };
}

function isValidProcessorShape(p) {
  return (
    p !== null &&
    typeof p === "object" &&
    typeof p.name === "string" &&
    p.name.length > 0 &&
    typeof p.process === "function" &&
    (p.phase === "pre" || p.phase === "post")
  );
}

async function invokeProcessor(p, phase, ctx) {
  try {
    // A registered-but-malformed processor is broken, not skippable: deny.
    if (!isValidProcessorShape(p)) {
      return { ok: false, decision: "deny_broken_processor", reason: "invalid_processor_shape", name: p?.name ?? String(p) };
    }
    if (p.phase !== phase) return { ok: true, skipped: true }; // belongs to the other phase
    const result = await p.process(ctx);
    if (!result || typeof result !== "object" || !["allow", "deny", "transform"].includes(result.action)) {
      return { ok: false, decision: "deny_invalid_processor_result", reason: "processor_returned_no_decision", name: p.name };
    }
    return { ok: true, result, name: p.name };
  } catch (err) {
    return { ok: false, decision: "deny_broken_processor", reason: `processor_error:${err?.message ?? err}`, name: p?.name ?? "?" };
  }
}

// Run all processors for `phase` in declared order against `ctx`.
// - allow     → continue
// - transform → shallow-merge result.patch into ctx.target (when present), continue
// - deny / broken / missing / invalid → sticky denial; iteration continues so later
//   processors (e.g. audit-record) still run, but the outcome stays denied.
// Returns { allowed, decision, reason, outcomes }.
export async function runProcessors(processors, phase, ctx) {
  const outcomes = [];
  let denied = false;
  let decision = "allow";
  let reason;

  for (const p of Array.isArray(processors) ? processors : []) {
    const outcome = await invokeProcessor(p, phase, ctx);
    outcomes.push(outcome);
    if (!outcome.ok) {
      denied = true;
      if (decision === "allow") {
        decision = outcome.decision;
        reason = outcome.reason;
        ctx.allowed = false;
        ctx.decision = decision;
        ctx.reason = reason;
      }
      continue;
    }
    if (outcome.skipped) continue;
    const r = outcome.result;
    if (r.action === "deny") {
      denied = true;
      if (decision === "allow") {
        decision = normalizeDenyDecision(r.reason);
        reason = r.reason ?? "deny";
        // Sync into ctx so later processors (e.g. audit-record) see the denial.
        ctx.allowed = false;
        ctx.decision = decision;
        ctx.reason = reason;
      }
      continue;
    }
    if (r.action === "transform") {
      if (r.patch && typeof r.patch === "object" && ctx.target && typeof ctx.target === "object") {
        Object.assign(ctx.target, r.patch);
      }
      if (r.audit != null && Array.isArray(ctx.auditPayloads)) ctx.auditPayloads.push(r.audit);
      continue;
    }
    // allow
    if (r.audit != null && Array.isArray(ctx.auditPayloads)) ctx.auditPayloads.push(r.audit);
  }

  return { allowed: !denied, decision, reason, outcomes };
}
