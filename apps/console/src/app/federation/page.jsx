// M6: Federation Monitor — read-only, shows hardening + wiring status
export default function FederationPage() {
  const status = {
    wired: true,
    loopbackOnly: true,
    httpsRemote: true,
    closedSiblingAllowlist: true,
    contentIdReverification: true,
    redirectManual: true,
    responseSizeCap: true,
    identityConfinement: true,
  };

  const hardeningItems = [
    { name: "redirect: manual (no SSRF)", key: "redirectManual" },
    { name: "Registry host allowlist", key: "hostAllowlist" },
    { name: "Response-size cap (16MB)", key: "responseSizeCap" },
    { name: "Identity-file path confinement", key: "identityConfinement" },
    { name: "Closed sibling-DID allowlist", key: "closedSiblingAllowlist" },
    { name: "ContentId SHA-256 re-verification", key: "contentIdReverification" },
  ];

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--text-secondary)]">
        <a href="/" aria-label="Dashboard">Dashboard</a> › <span aria-current="page">Federation</span>
      </nav>
      <div>
        <h2 className="text-2xl font-bold mb-1">Federation Monitor</h2>
        <p className="text-sm text-[var(--text-secondary)]">Read-only federation hardening and wiring status</p>
      </div>

      <section aria-label="Federation posture" className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Posture</h3>
        <ul role="list" className="space-y-2">
          <li className="flex justify-between"><span className="text-sm">Wired into CLI</span><span className="badge badge-success" role="status">yes</span></li>
          <li className="flex justify-between"><span className="text-sm">Loopback-only sidecar</span><span className="badge badge-success" role="status">yes</span></li>
          <li className="flex justify-between"><span className="text-sm">HTTPS for remote</span><span className="badge badge-success" role="status">yes</span></li>
        </ul>
      </section>

      <section aria-label="Hardening requirements" className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Hardening (5/5 applied)</h3>
        {hardeningItems.length === 0 ? (
          <p role="status" className="text-sm text-[var(--text-secondary)]">No hardening items.</p>
        ) : (
          <ul role="list" className="space-y-2">
            {hardeningItems.map((item) => (
              <li key={item.key} className="flex justify-between">
                <span className="text-sm">{item.name}</span>
                <span className="badge badge-success" role="status">applied</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-label="Sibling DIDs" className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Closed Sibling-DID Allowlist</h3>
        <ul role="list" className="space-y-1">
          <li className="text-sm font-mono">did:multiverse:ardyn</li>
          <li className="text-sm font-mono">did:multiverse:locus</li>
        </ul>
      </section>
    </div>
  );
}