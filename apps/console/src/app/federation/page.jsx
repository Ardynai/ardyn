// M6: Federation Monitor — read-only, loopback-only
export default function FederationPage() {
  const federationStatus = {
    wired: false,
    loopbackOnly: true,
    httpsRemote: true,
    closedSiblingAllowlist: true,
    contentIdReverification: true,
    redirectManual: true,
    responseSizeCap: true,
    hostAllowlist: true,
    identityFileConfinement: true,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Federation Monitor</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Federation client state and invariants (read-only)
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Federation Status</h3>
          <span className="badge badge-warning">Hardened, not wired</span>
        </div>

        <div className="space-y-2">
          {Object.entries(federationStatus).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
              <span className="text-sm text-[var(--text-secondary)]">
                {key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}
              </span>
              <span className={value ? "badge badge-success" : "badge badge-danger"}>
                {value ? "Yes" : "No"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-3">Security Invariants</h3>
        <div className="space-y-2 text-sm text-[var(--text-secondary)]">
          <p>✅ Loopback-only sidecar enforced</p>
          <p>✅ HTTPS-only remote registry</p>
          <p>✅ Closed sibling-DID allowlist</p>
          <p>✅ Receive-side contentId re-verification</p>
          <p>✅ redirect:manual (no SSRF)</p>
          <p>✅ Response-size cap (16MB)</p>
          <p>✅ Registry host allowlist support</p>
          <p>✅ Identity-file path confinement</p>
          <p>✅ No P2P/DHT/BitTorrent</p>
          <p>✅ No Secure Drop decrypt</p>
          <p>✅ No fabric-core import</p>
        </div>
      </div>
    </div>
  );
}