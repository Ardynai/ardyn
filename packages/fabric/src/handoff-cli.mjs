// M20: CLI implementation for the gated federation A2A exchange.
// Lives in packages/fabric so apps/cli/src/index.mjs stays narrow (the CLI
// source guards forbid runtime primitives like process.stdin there); this
// module is a package library, not the CLI surface itself.
//
// GATING: default OFF. Without --enable-federation-exchange nothing happens;
// without --approve nothing is sent or received (--dry-run supported).
import { pathToFileURL } from "node:url";
import { join } from "node:path";

export async function runFederationExchangeCommand({ subCommand, args = [], printJson, fail, readOption, approveFlag = "--approve" }) {
  const enabled = args.includes("--enable-federation-exchange");
  const approved = args.includes(approveFlag);
  const dryRun = args.includes("--dry-run");

  if (!enabled) {
    printJson({
      command: "federation", subCommand,
      enabled: false, approved: false,
      refused: true,
      reason: "Federation A2A exchange is gated: add --enable-federation-exchange to proceed.",
      usage: `ardyn federation ${subCommand} --enable-federation-exchange [--approve] [--to <did>|--payload <file|->|--once]`,
    });
    return;
  }
  if (!approved && !dryRun) {
    fail(`Federation A2A exchange requires explicit approval: add --approve to execute. Nothing was ${subCommand === "send-handoff" ? "sent" : "received"}.`);
    return;
  }

  const cwd = process.cwd();
  const federationModule = await import(pathToFileURL(join(cwd, "packages/fabric/src/federation.mjs")).href);
  const handoffModule = await import(pathToFileURL(join(cwd, "packages/fabric/src/handoff.mjs")).href);
  const config = federationModule.loadFabricFederationConfigFromEnv();

  // Correctness-cleanup: FAIL-CLOSED credentials. Previously a missing env var
  // produced Authorization: Bearer "unset" — silent garbage auth against the
  // remote registry. Now we refuse locally, naming the missing variables.
  const registryToken = process.env.ARDYN_FABRIC_REGISTRY_TOKEN;
  const sidecarToken = process.env.ARDYN_FABRIC_SIDECAR_TOKEN ?? process.env.FABRIC_TRANSPORT_D_AUTH_TOKEN;
  const missing = [];
  if (!registryToken || !registryToken.trim()) missing.push("ARDYN_FABRIC_REGISTRY_TOKEN");
  if (!sidecarToken || !sidecarToken.trim()) missing.push("ARDYN_FABRIC_SIDECAR_TOKEN (or FABRIC_TRANSPORT_D_AUTH_TOKEN)");
  if (missing.length > 0) {
    fail(`Refusing to contact the registry/sidecar without credentials. Set: ${missing.join(", ")}.`);
    return;
  }

  const client = federationModule.createFabricFederationClient({
    ...config,
    registryToken,
    sidecarToken,
  });
  const handoff = handoffModule.createFederationHandoff({ client, localDid: config?.localDid });

  if (dryRun) {
    printJson({ command: "federation", subCommand, dryRun: true, enabled: true, approved: false, sent: false, received: false });
    return;
  }

  if (subCommand === "send-handoff") {
    const toDid = readOption(args, "--to");
    const payloadArg = readOption(args, "--payload");
    if (!toDid) { fail("Missing required --to did:multiverse:<sibling> for send-handoff."); return; }
    if (!payloadArg) { fail("Missing required --payload <file|-> for send-handoff (- reads stdin)."); return; }
    let payloadText;
    if (payloadArg === "-") {
      payloadText = await new Promise((resolve) => {
        let data = "";
        process.stdin.setEncoding("utf8");
        process.stdin.on("data", (c) => { data += c; });
        process.stdin.on("end", () => resolve(data));
      });
    } else {
      payloadText = await (await import("node:fs/promises")).readFile(payloadArg, "utf8");
    }
    let payload;
    try { payload = JSON.parse(payloadText); } catch { payload = payloadText; }
    try {
      const result = await handoff.sendHandoff({ toDid, payload }, { approved: true });
      printJson({ command: "federation", subCommand: "send-handoff", sent: true, toDid: result.toDid, contentId: result.contentId });
    } catch (err) {
      fail(`send-handoff refused: ${err.message}`);
    }
    return;
  }

  // receive-handoff: single poll (--once) or receiver loop until SIGINT.
  const once = args.includes("--once");
  const audit = [];
  const { redactSecrets } = await import(pathToFileURL(join(cwd, "packages/core/src/data-auth.mjs")).href);
  const handler = async (delivery) => {
    const result = await handoff.handleDelivery(delivery, { approved: true });
    // Audit every accepted message; redact secrets from anything logged.
    audit.push({
      fromDid: result.fromDid,
      contentId: result.contentId,
      payloadPreview: redactSecrets(JSON.stringify(result.payload)).slice(0, 200),
    });
  };
  try {
    if (once) {
      const r = await client.pollInboundOnce(handler);
      printJson({ command: "federation", subCommand: "receive-handoff", once: true, delivered: r.delivered.length, rejected: r.rejected.length, audit });
    } else {
      const receiver = client.startReceiver(handler);
      printJson({ command: "federation", subCommand: "receive-handoff", loop: true, message: "Receiver running. Ctrl+C to stop." });
      await receiver.ready;
      process.on("SIGINT", () => { receiver.stop(); process.exit(0); });
    }
  } catch (err) {
    fail(`receive-handoff error: ${err.message}`);
  }
}
