import UtilityPageShell from "./utilityPageShell";

const mockRequisitions = [
  {
    number: "REQ-2026-0001",
    department: "Ward 1A - Medicine",
    status: "Draft",
    date: "05/17/2026",
  },
  {
    number: "REQ-2026-0002",
    department: "Ward 1A - Medicine",
    status: "Submitted",
    date: "05/16/2026",
  },
];

const NurseRequisition = () => {
  return (
    <UtilityPageShell
      title="Requisition"
      subtitle="Prepare and monitor ward requisition requests."
      icon="isax isax-receipt-item"
    >
      <div className="d-flex justify-content-end mb-3">
        <button
          type="button"
          className="btn btn-sm text-white fw-bold d-flex align-items-center gap-2 px-3 py-2"
          style={{
            backgroundColor: "var(--primary, #0f763f)",
            borderColor: "var(--primary, #0f763f)",
          }}
        >
          <i className="isax isax-add-circle" />
          <span>New Requisition</span>
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-sm align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Requisition No.</th>
              <th>Department</th>
              <th>Status</th>
              <th>Date Created</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockRequisitions.map((requisition) => (
              <tr key={requisition.number}>
                <td className="fw-bold text-dark">{requisition.number}</td>
                <td>{requisition.department}</td>
                <td>
                  <span
                    className={`badge rounded-pill px-3 py-2 ${
                      requisition.status === "Submitted"
                        ? "bg-success-subtle text-success"
                        : "bg-warning-subtle text-warning"
                    }`}
                  >
                    {requisition.status}
                  </span>
                </td>
                <td>{requisition.date}</td>
                <td className="text-center">
                  <button type="button" className="btn btn-sm btn-light border">
                    <i className="isax isax-eye" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </UtilityPageShell>
  );
};

export default NurseRequisition;
