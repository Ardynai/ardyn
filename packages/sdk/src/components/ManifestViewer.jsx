// M5: ManifestViewer — accessible manifest display
export default function ManifestViewer({ manifest = null, isLoading = false, error = null }) {
  if (isLoading) return <div role="status" aria-label="Loading manifest">Loading manifest…</div>;
  if (error) return <div role="alert" aria-label="Manifest error">Error: {error}</div>;
  if (!manifest) return <div role="status" aria-label="No manifest">No manifest loaded.</div>;
  return (
    <div role="region" aria-label="Manifest viewer" className="ardyn-manifest-viewer">
      <h3 aria-level={2}>Manifest</h3>
      <dl className="ardyn-manifest-fields">
        {Object.entries(manifest).map(([key, value]) => (
          <div key={key} className="ardyn-manifest-field">
            <dt>{key}</dt>
            <dd>{typeof value === "object" ? JSON.stringify(value) : String(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}