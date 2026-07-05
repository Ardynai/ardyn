export const FABRIC_FEDERATION_DEFAULT_LOCAL_DID: "did:multiverse:ardyn";
export const FABRIC_FEDERATION_CLOSED_SIBLING_DIDS: readonly string[];
export const FABRIC_FEDERATION_DEFAULT_PATHS: Readonly<{
  allowlist: string;
  inbox: string;
  keepalive: string;
  markReceived: string;
  register: string;
  send: string;
}>;

export class FabricFederationError extends Error {
  code: string;
  status?: number;
}

export interface FabricFederationConfigInput {
  allowSiblingDids?: string[];
  capabilities?: string[];
  closedSiblingDids?: string[];
  fetchImpl?: typeof fetch;
  identityFile?: string;
  localDid?: string;
  receiverPollIntervalMs?: number;
  registryBaseUrl: string;
  registryPaths?: Partial<Record<"allowlist" | "inbox" | "keepalive" | "markReceived" | "register" | "send", string>>;
  registryToken: string;
  sidecarBaseUrl: string;
  sidecarToken: string;
  timeoutMs?: number;
  reachability?: {
    endpointUrl?: string;
    id?: string;
    name?: string;
    ownerDid?: string;
    version?: string;
  };
}

export interface FabricCaPieceDescriptor {
  index: number;
  offset: number;
  sha256: string;
  size: number;
}

export interface FabricCaContentDescriptor {
  contentId: string;
  hash: "sha256";
  merkle: "sha256-domain-separated-binary-pair-v1";
  merkleRoot: string;
  pieces: FabricCaPieceDescriptor[];
  pieceSize: number;
  schemaVersion: "1.0.0";
  totalSize: number;
  transport: "fabric-ca";
}

export interface FabricFederationDelivery {
  bytes: Buffer;
  contentId: string;
  descriptor: FabricCaContentDescriptor;
  encrypted: boolean;
  envelope: Record<string, unknown>;
  fromDid: string;
  secure: boolean;
  toDid: string;
  verification: { contentId: string; pieceCount: number; totalSize: number };
}

export interface FabricFederationClient {
  fetchAllowlist(options?: Record<string, unknown>): Promise<string[]>;
  getContent(contentId: string, options?: Record<string, unknown>): Promise<Buffer>;
  getDescriptor(contentId: string, options?: Record<string, unknown>): Promise<FabricCaContentDescriptor>;
  keepalive(options?: Record<string, unknown>): Promise<unknown>;
  pollInboundOnce(handler: (delivery: FabricFederationDelivery) => unknown | Promise<unknown>, options?: Record<string, unknown>): Promise<{ delivered: unknown[]; rejected: unknown[] }>;
  putContent(pathOrBytes: string | Buffer | Uint8Array, options?: Record<string, unknown>): Promise<{ contentId: string; descriptor: FabricCaContentDescriptor }>;
  registerReachability(options?: Record<string, unknown>): Promise<unknown>;
  resolveAllowlist(options?: Record<string, unknown>): Promise<string[]>;
  send(toDid: string, pathOrBytes: string | Buffer | Uint8Array, options?: { secure?: boolean } & Record<string, unknown>): Promise<unknown>;
  startReceiver(handler: (delivery: FabricFederationDelivery) => unknown | Promise<unknown>, options?: { intervalMs?: number; keepaliveEveryMs?: number; signal?: AbortSignal }): { ready: Promise<void>; stop(): void };
}

export function isLoopbackFabricFederationUrl(value: string): boolean;
export function loadFabricFederationConfigFromEnv(env?: Record<string, string | undefined>): Partial<FabricFederationConfigInput>;
export function createFabricFederationClient(options: FabricFederationConfigInput): FabricFederationClient;
export function sendFabricFederationContent(options: FabricFederationConfigInput, toDid: string, pathOrBytes: string | Buffer | Uint8Array, sendOptions?: { secure?: boolean } & Record<string, unknown>): Promise<unknown>;
export function startFabricFederationReceiver(options: FabricFederationConfigInput, handler: (delivery: FabricFederationDelivery) => unknown | Promise<unknown>, receiverOptions?: { intervalMs?: number; keepaliveEveryMs?: number; signal?: AbortSignal }): { ready: Promise<void>; stop(): void };
export function verifyFabricCaContent(data: Buffer | Uint8Array, descriptor: FabricCaContentDescriptor, expectedContentId?: string): { contentId: string; pieceCount: number; totalSize: number };
export function fabricCaContentId(data: Buffer | Uint8Array, descriptor: FabricCaContentDescriptor): string;
