// M5: StatusBadge — accessible status indicator
export default function StatusBadge({ status = "unknown", label }) {
  const statusConfig = {
    active: { color: "green", text: label ?? "Active" },
    blocked: { color: "red", text: label ?? "Blocked" },
    pending: { color: "yellow", text: label ?? "Pending" },
    approved: { color: "green", text: label ?? "Approved" },
    denied: { color: "red", text: label ?? "Denied" },
    unknown: { color: "gray", text: label ?? "Unknown" },
  };
  const config = statusConfig[status] ?? statusConfig.unknown;
  return (
    <span
      role="status"
      aria-label={`Status: ${config.text}`}
      className={`ardyn-badge ardyn-badge-${config.color}`}
    >
      {config.text}
    </span>
  );
}