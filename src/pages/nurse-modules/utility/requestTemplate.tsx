import UtilityPageShell from "./utilityPageShell";

const mockTemplates = [
  {
    code: "MED-SUP-001",
    name: "Medicine Ward Supplies",
    items: 12,
    updated: "05/17/2026",
  },
  {
    code: "GEN-WARD-002",
    name: "General Ward Consumables",
    items: 18,
    updated: "05/15/2026",
  },
];

const NurseRequestTemplate = () => {
  return (
    <UtilityPageShell
      title="Request Template"
      subtitle="Create and manage reusable ward request templates."
      icon="isax isax-document-text"
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
          <span>New Template</span>
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-sm align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Template Code</th>
              <th>Template Name</th>
              <th className="text-center">Items</th>
              <th>Last Updated</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockTemplates.map((template) => (
              <tr key={template.code}>
                <td className="fw-bold text-dark">{template.code}</td>
                <td>{template.name}</td>
                <td className="text-center fw-semibold">{template.items}</td>
                <td>{template.updated}</td>
                <td className="text-center">
                  <button type="button" className="btn btn-sm btn-light border">
                    <i className="isax isax-edit" />
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

export default NurseRequestTemplate;
