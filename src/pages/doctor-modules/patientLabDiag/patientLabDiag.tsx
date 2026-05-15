import React, { useEffect, useState } from "react";
import DoctorSidebar from "@/components/custom-sidebar/doctorSidebar";
import { useLocation } from "react-router";

// --- Types ---
interface LabRecord {
  id: string;
  labTest: string;
  result: string;
  remark: string;
}

const PertinentLabDiagnostic = () => {
  const location = useLocation();

  const [mockPatientProfile] = useState({
    hospitalNumber: "000000000777288",
    lastName: "DO",
    firstName: "REA",
    middleName: "MON",
    address: "111 Estanza, Legazpi City, Albay",
    birthdate: "01/01/2000",
    age: "26 Yrs. Old",
    civilStatus: "Married",
    gender: "Male",
    employmentStatus: "Employed",
    nationality: "Filipino",
    religion: "Catholic",
    seniorCitizenNo: "",
    mssNo: "",
    isPersonnel: "No",
  });

  // --- State Management ---
  const [records, setRecords] = useState<LabRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // --- Responsive State ---
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    labTest: "",
    result: "",
    remark: "",
  });

  // pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (location.state?.selectedPatientId) {
      setTimeout(() => {}, 1500);
    }
  }, [location.state]);

  const isRowSelected = selectedRecordId !== null;
  const hasRecords = records.length > 0;

  // validation
  const isFormValid =
    formData.labTest.trim().length > 0 &&
    formData.result.trim().length > 0;

  // pagination
  const totalPages = Math.max(1, Math.ceil(records.length / pageSize));

  const paginatedRecords = records.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  // --- Helpers ---
  const resetForm = () => {
    setFormData({
      labTest: "",
      result: "",
      remark: "",
    });
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

    const selected = records.find(
      (record) => record.id === selectedRecordId
    );

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

    const updatedRecords = records.filter(
      (record) => record.id !== selectedRecordId
    );

    setRecords(updatedRecords);

    const newTotalPages = Math.max(
      1,
      Math.ceil(updatedRecords.length / pageSize)
    );

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
          record.id === selectedRecordId
            ? {
                ...record,
                ...formData,
              }
            : record
        )
      );
    } else {
      const newRecord: LabRecord = {
        id: Date.now().toString(),
        ...formData,
      };

      // newest first
      setRecords((prev) => [newRecord, ...prev]);

      // return to first page
      setCurrentPage(1);
    }

    setShowModal(false);
    resetForm();
  };

  const handleSaveAndClose = () => {
    saveRecord();
  };

  return (
    <>
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
          .hide-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
          .hide-scrollbar { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
          .text-hover-primary:hover { color: var(--primary, #0f763f) !important; }

          .table-hover tbody tr { cursor: pointer; transition: all 0.2s ease-in-out; }

          .selected-row > td {
            background-color: #e6f4ea !important;
            color: #0b592f !important;
          }

          .selected-row > td:first-child {
            border-left: 4px solid var(--primary, #0f763f) !important;
          }

          .selected-row .text-muted {
            color: #0f763f !important;
          }

          @media (max-width: 575.98px) {
            .modal-footer-actions {
              flex-direction: column-reverse;
              width: 100%;
            }

            .modal-footer-actions button {
              width: 100%;
              margin-top: 8px;
            }

            .pagination-controls {
              flex-direction: column;
              gap: 12px;
            }
          }
        `}
      </style>

      <div
        className="content doctor-content bg-light mt-n4 d-flex flex-column"
        style={{ minHeight: "100vh" }}
      >
        <div className="container-fluid px-3 px-lg-5 pt-0 flex-grow-1 d-flex flex-column">
          <div className="row flex-grow-1">
            <DoctorSidebar />

            <div className="col-lg-8 col-xl-9 mt-4 mt-lg-0 d-flex flex-column">
              <div
                className="card border-0 shadow-sm p-3 p-md-4 mb-4 d-flex flex-column flex-grow-1"
                style={{
                  borderRadius: "12px",
                  borderTop: "4px solid var(--primary, #0f763f)",
                }}
              >
                {/* Patient Profile Header */}
                <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3 gap-md-4 mb-4 pb-4 border-bottom text-center text-md-start">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center bg-light shadow-sm flex-shrink-0"
                    style={{
                      width: "90px",
                      height: "90px",
                      border: "2px solid var(--primary, #0f763f)",
                    }}
                  >
                    <i
                      className="isax isax-user fs-1 text-primary"
                      style={{ color: "var(--primary, #0f763f)" }}
                    />
                  </div>

                  <div>
                    <div className="badge bg-light text-secondary border mb-2 px-2 py-1">
                      ID: {mockPatientProfile.hospitalNumber}
                    </div>

                    <h3 className="fw-bold mb-1 text-dark fs-3 fs-md-2">
                      {mockPatientProfile.lastName},{" "}
                      {mockPatientProfile.firstName}{" "}
                      {mockPatientProfile.middleName}
                    </h3>

                    <div className="text-muted small d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                      <i className="isax isax-location text-danger" />
                      {mockPatientProfile.address}
                    </div>
                  </div>
                </div>

                {/* Main Data Section */}
                <div className="d-flex flex-column flex-grow-1 mb-4">
                  {/* Toolbar */}
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
                    <h5 className="fw-bold text-dark mb-0 text-center text-md-start text-uppercase">
                      Pertinent Lab/Diagnostic Findings
                    </h5>

                    {(!isMobile || hasRecords) && (
                      <div
                        className="d-flex flex-wrap justify-content-center justify-content-md-end pb-1 pb-lg-0 ms-md-auto"
                        style={{ gap: "6px" }}
                      >
                        <button
                          onClick={handleAdd}
                          className="btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap bg-white text-dark fw-bold text-hover-primary flex-grow-1 flex-md-grow-0"
                          style={{
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          <i className="isax isax-add-square"></i>
                          <span>Add</span>
                        </button>

                        <button
                          onClick={handleEdit}
                          disabled={!isRowSelected}
                          className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap flex-grow-1 flex-md-grow-0 ${
                            !isRowSelected
                              ? "bg-light text-muted opacity-50"
                              : "bg-white text-dark fw-bold"
                          }`}
                          style={{
                            borderRadius: "4px",
                            cursor: !isRowSelected
                              ? "not-allowed"
                              : "pointer",
                          }}
                        >
                          <i className="isax isax-edit"></i>
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={handleDeleteClick}
                          disabled={!isRowSelected}
                          className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap flex-grow-1 flex-md-grow-0 ${
                            !isRowSelected
                              ? "bg-light text-muted opacity-50"
                              : "bg-white text-danger fw-bold"
                          }`}
                          style={{
                            borderRadius: "4px",
                            cursor: !isRowSelected
                              ? "not-allowed"
                              : "pointer",
                          }}
                        >
                          <i className="isax isax-trash"></i>
                          <span>Del</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Table */}
                  <div
                    className="border rounded-0 flex-grow-1 bg-white shadow-sm d-flex flex-column overflow-hidden"
                    style={{ minHeight: "450px" }}
                  >
                    <div className="table-responsive flex-grow-1 bg-white p-0">
                      <table
                        className="table table-hover align-middle mb-0"
                        style={{
                          fontSize: "0.85rem",
                          minWidth: "750px",
                        }}
                      >
                        <thead style={{ backgroundColor: "#f8f9fa" }}>
                          <tr>
                            <th
                              className="border-bottom py-3 px-4 text-dark fw-bold"
                              style={{ width: "30%" }}
                            >
                              Laboratory Test
                            </th>

                            <th
                              className="border-bottom py-3 px-4 text-dark fw-bold"
                              style={{ width: "40%" }}
                            >
                              Result
                            </th>

                            <th
                              className="border-bottom py-3 px-4 text-dark fw-bold"
                              style={{ width: "30%" }}
                            >
                              Remark
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {paginatedRecords.length === 0 ? (
                            <tr>
                              <td
                                colSpan={3}
                                className="text-center text-muted py-5 border-0"
                              >
                                <div className="d-flex flex-column align-items-center justify-content-center">
                                  <i
                                    className="isax isax-document-text fs-1 mb-3 opacity-50 d-block"
                                    style={{ fontSize: "3rem" }}
                                  ></i>

                                  <h6 className="fw-bold mb-1">
                                    No lab/diagnostic findings recorded.
                                  </h6>

                                  <p className="small mb-3">
                                    Click{" "}
                                    <strong className="text-dark">
                                      Add
                                    </strong>{" "}
                                    in the toolbar above to begin.
                                  </p>

                                  {/* Mobile Add Button */}
                                  {isMobile && (
                                    <button
                                      onClick={handleAdd}
                                      className="btn btn-sm shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-white fw-bold"
                                      style={{
                                        borderRadius: "3px",
                                        backgroundColor: "var(--primary, #0f763f)",
                                        border: "1px solid var(--primary, #0f763f)",
                                        minWidth: "100px",
                                      }}
                                    >
                                      <i className="isax isax-add-square"></i>
                                      <span>Add</span>
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ) : (
                            paginatedRecords.map((record) => (
                              <tr
                                key={record.id}
                                onClick={() =>
                                  setSelectedRecordId(record.id)
                                }
                                className={
                                  selectedRecordId === record.id
                                    ? "selected-row"
                                    : ""
                                }
                              >
                                <td className="py-3 px-4 fw-medium text-dark align-top border-start-0">
                                  {record.labTest}
                                </td>

                                <td
                                  className="py-3 px-4 text-wrap text-break align-top"
                                  style={{ maxWidth: "300px" }}
                                >
                                  {record.result}
                                </td>

                                <td className="py-3 px-4 text-muted align-top">
                                  {record.remark}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {hasRecords && (
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center p-3 border-top bg-light gap-2 pagination-controls">
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-muted small fw-medium">
                            Show
                          </span>

                          <select
                            className="form-select form-select-sm shadow-none"
                            style={{
                              width: "75px",
                              borderColor: "#ced4da",
                            }}
                            value={pageSize}
                            onChange={handlePageSizeChange}
                          >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>

                          <span className="text-muted small fw-medium">
                            entries
                          </span>
                        </div>

                        <span className="text-muted small fw-medium text-center">
                          Showing{" "}
                          {(currentPage - 1) * pageSize + 1} to{" "}
                          {Math.min(
                            currentPage * pageSize,
                            records.length
                          )}{" "}
                          of {records.length} entries
                        </span>

                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-secondary px-3"
                            onClick={() =>
                              handlePageChange(currentPage - 1)
                            }
                            disabled={currentPage === 1}
                          >
                            Prev
                          </button>

                          <span className="btn btn-sm btn-light disabled px-3 text-dark fw-bold border">
                            {currentPage} / {totalPages}
                          </span>

                          <button
                            className="btn btn-sm btn-outline-secondary px-3"
                            onClick={() =>
                              handlePageChange(currentPage + 1)
                            }
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className="mt-2 text-muted fw-bold"
                  style={{ fontSize: "0.85rem" }}
                >
                  Total Number of Record/s:{" "}
                  <span className="text-dark">
                    {records.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1060,
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered px-2 px-sm-3">
            <div
              className="modal-content border-0 shadow-lg"
              style={{
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <div
                className="modal-header border-0 py-3 d-flex align-items-center"
                style={{ backgroundColor: "#333b45" }}
              >
                <h4
                  className="modal-title text-white fw-bold m-0 d-flex align-items-center gap-2"
                  style={{
                    fontSize: "1.1rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  <i
                    className="isax isax-add-square"
                    style={{ fontSize: "1.5rem" }}
                  ></i>

                  {isEditing ? "EDIT" : "ADD"} PERTINENT LAB |
                  RADIO | DIAGNOSTIC FINDINGS
                </h4>

                <button
                  type="button"
                  className="btn-close btn-close-white shadow-none"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body p-3 p-md-4 bg-white">
                <div className="mb-3">
                  <label
                    className="fw-bold mb-1"
                    style={{
                      color: "var(--primary, #0f763f)",
                      fontSize: "0.85rem",
                    }}
                  >
                    Lab | Radio | Diagnostic{" "}
                    <span className="text-danger">*</span>
                  </label>

                  <input
                    type="text"
                    className={`form-control rounded-1 shadow-none ${
                      !isFormValid &&
                      formData.labTest.length === 0
                        ? "is-invalid"
                        : ""
                    }`}
                    style={{
                      borderColor:
                        "var(--primary, #0f763f)",
                    }}
                    value={formData.labTest}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        labTest: e.target.value,
                      })
                    }
                    placeholder="Enter test name..."
                  />
                </div>

                <div className="mb-3">
                  <label
                    className="fw-bold mb-1"
                    style={{
                      color: "var(--primary, #0f763f)",
                      fontSize: "0.85rem",
                    }}
                  >
                    Result{" "}
                    <span className="text-danger">*</span>
                  </label>

                  <textarea
                    className={`form-control rounded-1 shadow-none ${
                      !isFormValid &&
                      formData.result.length === 0
                        ? "is-invalid"
                        : ""
                    }`}
                    rows={6}
                    style={{
                      borderColor:
                        "var(--primary, #0f763f)",
                      resize: "none",
                      fontSize: "0.9rem",
                    }}
                    value={formData.result}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        result: e.target.value,
                      })
                    }
                    placeholder="Enter results..."
                  ></textarea>
                </div>

                <div className="mb-1">
                  <label
                    className="fw-bold mb-1"
                    style={{
                      color: "var(--primary, #0f763f)",
                      fontSize: "0.85rem",
                    }}
                  >
                    Remark
                  </label>

                  <input
                    type="text"
                    className="form-control rounded-1 shadow-none"
                    style={{
                      borderColor:
                        "var(--primary, #0f763f)",
                    }}
                    value={formData.remark}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        remark: e.target.value,
                      })
                    }
                    placeholder="Enter remarks (optional)..."
                  />
                </div>
              </div>

              <div
                className="modal-footer border-0 p-3 justify-content-end"
                style={{ backgroundColor: "#e2e5e9" }}
              >
                <div className="d-flex modal-footer-actions gap-2 w-100 justify-content-sm-end">
                  <button
                    type="button"
                    className="btn px-4 py-2 fw-medium shadow-sm text-white"
                    style={{
                      borderRadius: "3px",
                      backgroundColor: "var(--primary, #0f763f)",
                      border: "1px solid var(--primary, #0f763f)",
                      opacity: !isFormValid ? 0.6 : 1,
                      cursor: !isFormValid ? "not-allowed" : "pointer",
                    }}
                    onClick={handleSaveAndClose}
                    disabled={!isFormValid}
                  >
                    Save and Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1060,
          }}
        >
          <div className="modal-dialog modal-sm modal-dialog-centered px-3">
            <div
              className="modal-content border-0 shadow-lg"
              style={{
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <div
                className="modal-header border-0 py-3 d-flex align-items-center"
                style={{ backgroundColor: "#333b45" }}
              >
                <h3
                  className="modal-title text-white fw-bold m-0 d-flex align-items-center gap-2"
                  style={{
                    fontSize: "1.1rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  <i
                    className="isax isax-warning-2"
                    style={{ fontSize: "1.5rem" }}
                  ></i>

                  Confirm Delete
                </h3>
              </div>

              <div className="modal-body p-4 bg-white text-center">
                <i
                  className="isax isax-trash text-danger mb-3 d-block"
                  style={{ fontSize: "2.5rem" }}
                ></i>

                <p
                  className="mb-0 text-dark fw-medium"
                  style={{ fontSize: "1.05rem" }}
                >
                  Are you sure you want to delete this{" "}
                  <strong className="text-danger">
                    Finding
                  </strong>
                  ?
                </p>
              </div>

              <div
                className="modal-footer border-0 d-flex flex-column flex-sm-row justify-content-center gap-2 p-3"
                style={{ backgroundColor: "#e2e5e9" }}
              >
                <button
                  type="button"
                  className="btn btn-light rounded-1 px-4 py-2 fw-medium border-secondary-subtle w-100"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-danger rounded-1 px-4 py-2 fw-medium w-100"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PertinentLabDiagnostic;