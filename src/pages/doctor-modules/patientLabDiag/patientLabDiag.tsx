import React, { useEffect, useMemo, useState } from "react";
import DoctorSidebar from "@/components/custom-sidebar/doctorSidebar";
import DeleteConfirmationModal from "@/components/delete-confirmation-modal/DeleteConfirmationModal";
import { useLocation, useNavigate } from "react-router-dom";
import "./patientLabDiag.css";

// --- Types ---
interface LabRecord {
  id: string;
  labTest: string;
  result: string;
  remark: string;
}

// --- Component ---
const PertinentLabDiagnostic = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- Mock Patient ---
  const [mockPatientProfile] = useState({
    hospitalNumber: "000000000777288",
    lastName: "DO",
    firstName: "REA",
    middleName: "MON",
    address: "111 Estanza, Legazpi City, Albay",
  });

  // --- States ---
  const [records, setRecords] = useState<LabRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // --- Responsive State ---
  const [isMobile, setIsMobile] = useState(false);

  // --- Form ---
  const [formData, setFormData] = useState({
    labTest: "",
    result: "",
    remark: "",
  });

  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // --- Effects ---
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (location.state?.selectedPatientId) {
      setTimeout(() => {}, 1000);
    }
  }, [location.state]);

  // --- Derived State ---
  const isRowSelected = selectedRecordId !== null;
  const hasRecords = records.length > 0;

  const isFormValid = useMemo(() => {
    return (
      formData.labTest.trim().length > 0 &&
      formData.result.trim().length > 0
    );
  }, [formData]);

  const totalPages = Math.max(1, Math.ceil(records.length / pageSize));

  const paginatedRecords = records.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // --- Helpers ---
  const resetForm = () => {
    setFormData({ labTest: "", result: "", remark: "" });
  };

  // --- Handlers ---
  const handleAdd = () => {
    resetForm();
    setIsEditing(false);
    setSelectedRecordId(null);
    setShowModal(true);
  };

  const handleEdit = () => {
    if (!selectedRecordId) return;
    const selected = records.find((record) => record.id === selectedRecordId);
    if (!selected) return;
    setFormData({
      labTest: selected.labTest,
      result: selected.result,
      remark: selected.remark,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteClick = () => {
    if (!selectedRecordId) return;
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedRecordId) return;
    const updatedRecords = records.filter((record) => record.id !== selectedRecordId);
    setRecords(updatedRecords);
    const newTotalPages = Math.max(1, Math.ceil(updatedRecords.length / pageSize));
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
    setSelectedRecordId(null);
    setShowDeleteModal(false);
  };

  const saveRecord = () => {
    if (!isFormValid) return;
    if (isEditing && selectedRecordId) {
      setRecords((prev) =>
        prev.map((record) =>
          record.id === selectedRecordId ? { ...record, ...formData } : record
        )
      );
    } else {
      const newRecord: LabRecord = {
        id: Date.now().toString(),
        ...formData,
      };
      setRecords((prev) => [newRecord, ...prev]);
      setCurrentPage(1);
    }
    setShowModal(false);
    resetForm();
  };

  const toggleRowExpand = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <div className="content doctor-content bg-light mt-n4" style={{ minHeight: "100vh" }}>
        <div className="container-fluid px-3 px-lg-5 pt-0">
          <div className="doctor-dashboard-layout">
            <DoctorSidebar />

            <div className="doctor-dashboard-main">
              <div
                className="card border-0 shadow-sm p-3 p-md-4 mb-4 flex-grow-1"
                style={{ borderTop: "4px solid #0f763f" }}
              >

                
                {/* close button */}
                      
                        <button
                          type="button"
                          className="btn-close"
                          aria-label="Close"
                          style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            padding: "4px",
                            zIndex: 10,
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate("/doctor-dashboard", { replace: true });
                          }}
                        >
                        </button>

                {/* ── HEADER — now matches ProcedureAndComplication exactly ── */}
                <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3 gap-md-4 mb-4 pb-4 border-bottom text-center text-md-start">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center bg-light shadow-sm flex-shrink-0"
                    style={{ width: "90px", height: "90px", border: "2px solid var(--primary, #0f763f)" }}
                  >
                    <i className="isax isax-user fs-1 text-primary" style={{ color: "var(--primary, #0f763f)" }} />
                  </div>
                  <div>
                    <div className="badge bg-light text-secondary border mb-2 px-2 py-1">
                      ID: {mockPatientProfile.hospitalNumber}
                    </div>
                    <h3 className="fw-bold mb-1 text-dark fs-3 fs-md-2">
                      {mockPatientProfile.lastName}, {mockPatientProfile.firstName} {mockPatientProfile.middleName}
                    </h3>
                    <div className="text-muted small d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                      <i className="isax isax-location text-danger" />
                      {mockPatientProfile.address}
                    </div>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-3">
                  <h5 className="fw-bold text-uppercase mb-0 text-center text-md-start">
                    Pertinent Lab/Diagnostic Findings
                  </h5>

                  {(!isMobile || hasRecords) && (
                    <div className="d-flex justify-content-center justify-content-md-end gap-2 flex-wrap w-100 w-md-auto">

                      {/* Add */}
                      <button
                        type="button"
                        onClick={handleAdd}
                        className="btn btn-sm border shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap fw-bold text-white"
                        style={{
                          borderRadius: "4px",
                          cursor: "pointer",
                          backgroundColor: "#0f763f",
                          borderColor: "#0f763f",
                        }}
                      >
                        <i className="isax isax-add-square"></i>
                        <span>Add</span>
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        disabled={!isRowSelected}
                        onClick={handleEdit}
                        className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap fw-bold ${
                          isRowSelected ? "bg-white text-dark text-hover-primary" : "bg-light text-muted opacity-50"
                        }`}
                        style={{ borderRadius: "4px", cursor: isRowSelected ? "pointer" : "not-allowed" }}
                      >
                        <i className="isax isax-edit"></i>
                        <span>Edit</span>
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        disabled={!isRowSelected}
                        onClick={handleDeleteClick}
                        className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap fw-bold ${
                          isRowSelected ? "bg-white text-danger" : "bg-light text-muted opacity-50"
                        }`}
                        style={{ borderRadius: "4px", cursor: isRowSelected ? "pointer" : "not-allowed" }}
                      >
                        <i className="isax isax-trash"></i>
                        <span>Delete</span>
                      </button>

                    </div>
                  )}
                </div>

                {/* Main Content */}
                <div
                  className="border rounded bg-white flex-grow-1 d-flex flex-column"
                  style={{ minHeight: "460px", border: "1px solid #e5e7eb" }}
                >
                  {!hasRecords ? (
                    <div className="d-flex flex-column align-items-center justify-content-center text-center text-muted custom-empty-state physician-mobile-empty h-100">

                      {/* Desktop Document Icon */}
                      <i
                        className="isax isax-document-text fs-1 mb-3 opacity-50 d-none d-lg-block"
                        style={{
                          fontSize: "3rem",
                          color: "var(--primary, #0f763f)",
                        }}
                      />

                      {/* Mobile Add Button */}
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center shadow-sm d-lg-none"
                        onClick={handleAdd}
                        style={{
                          width: "64px",
                          height: "64px",
                          backgroundColor: "var(--primary, #0f763f)",
                          cursor: "pointer",
                        }}
                      >
                        <i
                          className="isax isax-add"
                          style={{ fontSize: "2rem", color: "#fff" }}
                        />
                      </div>

                      {/* Mobile Label */}
                      <span
                        className="mt-2 fw-semibold text-muted d-lg-none"
                        style={{ fontSize: "14px" }}
                      >
                      </span>

                      {/* Empty Text */}
                      <p className="mb-0 fw-bold text-dark">
                        No lab/diagnostic findings found.
                      </p>

                    </div>
                  ) : (
                    <>
                      <div className="table-responsive flex-grow-1">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="bg-light">
                            <tr>
                              <th className="px-4 py-3">Laboratory Test</th>
                              <th className="px-4 py-3">Result</th>
                              <th className="px-4 py-3 d-none d-lg-table-cell">Remark</th>
                              <th className="px-4 py-3 text-center d-lg-none">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedRecords.map((record) => (
                              <React.Fragment key={record.id}>
                                <tr
                                  onClick={() => setSelectedRecordId(record.id)}
                                  className={selectedRecordId === record.id ? "selected-row" : ""}
                                  style={{ cursor: "pointer" }}
                                >
                                  <td className="px-4 py-3">{record.labTest}</td>
                                  <td className="px-4 py-3 text-break">{record.result}</td>
                                  <td className="px-4 py-3 d-none d-lg-table-cell">{record.remark || "—"}</td>
                                  <td className="text-center d-lg-none">
                                    <button
                                      className="btn btn-sm btn-outline-secondary"
                                      onClick={(e) => toggleRowExpand(e, record.id)}
                                    >
                                      {expandedRows[record.id] ? "Hide" : "See More"}
                                    </button>
                                  </td>
                                </tr>
                                {expandedRows[record.id] && (
                                  <tr className="d-lg-none bg-light">
                                    <td colSpan={4}>
                                      <div className="p-3">
                                        <div><strong>Remark:</strong> {record.remark || "—"}</div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center p-3 border-top bg-light gap-3 mt-auto">
                        <div className="d-flex align-items-center gap-2">
                          <span className="small text-muted">Show</span>
                          <select
                            className="form-select form-select-sm"
                            style={{ width: "80px" }}
                            value={pageSize}
                            onChange={(e) => {
                              setPageSize(Number(e.target.value));
                              setCurrentPage(1);
                            }}
                          >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                          </select>
                          <span className="small text-muted">entries</span>
                        </div>

                        <div className="small text-muted">
                          Showing {(currentPage - 1) * pageSize + 1} to{" "}
                          {Math.min(currentPage * pageSize, records.length)} of {records.length}
                        </div>

                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                          >
                            Prev
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Footer Count */}
                <div className="mt-3 fw-bold text-muted small">
                  Total Records: <span className="text-dark">{records.length}</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title text-white">
                  {isEditing ? "EDIT" : "ADD"} PERTINENT LAB/DIAGNOSTIC FINDING
                </h5>
                <button className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
              </div>

              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="small fw-bold mb-1">Laboratory Test</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.labTest}
                      onChange={(e) => setFormData({ ...formData, labTest: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="small fw-bold mb-1">Remark</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.remark}
                      onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <label className="small fw-bold mb-1">Result</label>
                    <textarea
                      rows={6}
                      className="form-control"
                      value={formData.result}
                      onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-light">
                <button className="btn btn-success px-4" disabled={!isFormValid} onClick={saveRecord}>
                  Save and Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          message="Are you sure you want to delete this record?"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
};

export default PertinentLabDiagnostic;