// M5: ApprovalGate — shows approval status, disables actions when not approved
export default function ApprovalGate({ approved = false, onApprove, label = "Approve Runtime", disabled = false }) {
  return (
    <div role="group" aria-label="Approval gate" className="ardyn-approval-gate">
      <span
        role="status"
        aria-label={`Approval status: ${approved ? "approved" : "not approved"}`}
        className={`ardyn-approval-status ${approved ? "approved" : "pending"}`}
      >
        {approved ? "✓ Approved" : "⚠ Approval required"}
      </span>
      {!approved && (
        <button
          type="button"
          onClick={onApprove}
          disabled={disabled}
          aria-disabled={disabled || approved}
          className="ardyn-approve-btn"
        >
          {label}
        </button>
      )}
    </div>
  );
}