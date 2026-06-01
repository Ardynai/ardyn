export const FABRIC_SCHEMA_VERSION: "1.0.0";
export const DATA_TYPES: Set<string>;
export const CODE_TYPES: Set<string>;
export const FABRIC_HARNESSES: Set<string>;
export const PUBLIC_LICENSE_ALLOWLIST: Set<string>;
export const FIRST_PARTY_KEYRING: Readonly<Record<string, unknown>>;

export function parseFabricJson<T = unknown>(json: string): T;
export function canonicalize(value: unknown): string;
export function signingPayload(value: Record<string, unknown>): Buffer;
export function sha256Hex(value: string | Buffer | Uint8Array): string;
export function hashObject(value: unknown): string;
export function manifestDigest(manifest: Record<string, unknown>): string;
export function keyIdForPublicKey(publicKey: Buffer): string;
export function validatePackManifest(manifest: unknown): { valid: boolean; errors: string[] };
export function validateCatalog(catalog: unknown): { valid: boolean; errors: string[] };
export function validateKeyringShape(keyring: unknown): { valid: boolean; errors: string[] };
export function evaluateLicensePolicy(manifest: Record<string, unknown>): Record<string, { allowed: boolean; obligation?: string; reason?: string }>;
export function packIdNamespace(id: string): string;
export function isPathPayloadSafe(value: string): boolean;
export function pathConfinementError(value: string): string | null;

