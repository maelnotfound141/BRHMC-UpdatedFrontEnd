import React, { useEffect, useMemo, useState } from "react";
import DoctorSidebar from "@/components/custom-sidebar/doctorSidebar";
import { useLocation } from "react-router";

// --- Types ---
interface DiagnosisRecord {
  id: string;
  dateTime: string;
  typeOfDiag: string;
  physician: string;
  typeOfPhysician: string;
  diagnosisText: string;
  icdCode: string;
  isPrimary: string;
}

// --- Mock Data ---
const MOCK_PHYSICIANS = [
  "-- --. -",
  "Abagatnan Alodie Joy. -",
  "Abitria Jowanna. A",
  "Aboga Louise.",
  "Acosta John Patrick. L",
];

const DIAGNOSIS_TYPES = ["Admitting", "Final"];
const PHYSICIAN_TYPES = ["", "Attending Physician"];
const YES_NO = ["Yes", "No"];

// --- Helpers ---
const getCurrentDateTimeLocal = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const DiagnosisModule = () => {
  const location = useLocation();

  // --- Mock Patient ---
  const [mockPatientProfile] = useState({
    hospitalNumber: "000000000777288",
    lastName: "DO",
    firstName: "REA",
    middleName: "MON",
    address: "111 Estanza, Legazpi City, Albay",
  });

  // --- States ---
  const [records, setRecords] = useState<DiagnosisRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(
    null
  );

  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>(
    {}
  );

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  // --- Form ---
  const [formData, setFormData] = useState({
    dateTime: getCurrentDateTimeLocal(),
    typeOfDiag: "Admitting",
    physician: MOCK_PHYSICIANS[0],
    typeOfPhysician: "",
    diagnosisText: "",
    icdCode: "",
    isPrimary: "No",
  });

  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (location.state?.selectedPatientId) {
      setTimeout(() => {}, 1000);
    }
  }, [location.state]);

  const isRowSelected = selectedRecordId !== null;
  const hasRecords = records.length > 0;

  const isFormValid = useMemo(() => {
    return formData.diagnosisText.trim().length > 0;
  }, [formData]);

  const totalPages = Math.max(1, Math.ceil(records.length / pageSize));

  const paginatedRecords = records.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // --- Handlers ---
  const resetForm = () => {
    setFormData({
      dateTime: getCurrentDateTimeLocal(),
      typeOfDiag: "Admitting",
      physician: MOCK_PHYSICIANS[0],
      typeOfPhysician: "",
      diagnosisText: "",
      icdCode: "",
      isPrimary: "No",
    });
  };

  const handleAdd = () => {
    resetForm();
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = () => {
    if (!selectedRecordId) return;

    const selected = records.find((r) => r.id === selectedRecordId);

    if (!selected) return;

    setFormData({
      dateTime: selected.dateTime,
      typeOfDiag: selected.typeOfDiag,
      physician: selected.physician,
      typeOfPhysician: selected.typeOfPhysician,
      diagnosisText: selected.diagnosisText,
      icdCode: selected.icdCode,
      isPrimary: selected.isPrimary,
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

    setRecords((prev) =>
      prev.filter((record) => record.id !== selectedRecordId)
    );

    setSelectedRecordId(null);
    setShowDeleteModal(false);
  };

  const saveRecord = () => {
    if (!isFormValid) return;

    if (isEditing && selectedRecordId) {
      setRecords((prev) =>
        prev.map((record) =>
          record.id === selectedRecordId
            ? { ...record, ...formData }
            : record
        )
      );
    } else {
      const newRecord: DiagnosisRecord = {
        id: Date.now().toString(),
        ...formData,
      };

      setRecords((prev) => [newRecord, ...prev]);
    }

    setShowModal(false);
  };

  const toggleRowExpand = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.stopPropagation();

    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const val = e.target.value;

    setFormData((prev) => {
      const updated = {
        ...prev,
        typeOfDiag: val,
      };

      if (val === "Final") {
        updated.typeOfPhysician = "Attending Physician";
        updated.physician = "-- --. -";
      }

      return updated;
    });
  };

  const currentPhysicianTypes =
    formData.typeOfDiag === "Final"
      ? ["Attending Physician"]
      : PHYSICIAN_TYPES;

  return (
    <>
      <style>
        {`
          body {
            background: #f5f7fa;
            color: #1f2937;
          }

          .selected-row > td {
            background-color: #e6f4ea !important;
            transition: background-color 0.2s ease;
          }

          .selected-row > td:first-child {
            border-left: 4px solid #0f763f !important;
          }

          .toolbar-btn {
            border-radius: 10px;
            font-weight: 600;
            min-width: 120px;
            min-height: 42px;
            transition: all 0.2s ease;
          }

          .toolbar-btn:hover {
            transform: translateY(-1px);
          }

          .diagnosis-add-btn {
            background: linear-gradient(135deg, #0f763f, #198754);
            border: none;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            padding: 10px 18px;
            min-height: 42px;
            box-shadow: 0 4px 12px rgba(15,118,63,0.25);
            transition: all 0.25s ease;
          }

          .diagnosis-add-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 18px rgba(15,118,63,0.35);
            background: linear-gradient(135deg, #0b5d31, #157347);
            color: white;
          }

         .text-hover-primary:hover {
  color: var(--primary, #0f763f) !important;
}

.diagnosis-main-panel {
  min-height: 460px;
}

.diagnosis-empty-icon {
  font-size: 3.25rem;
}

          .card {
            border-radius: 16px !important;
            box-shadow: 0 8px 24px rgba(0,0,0,0.06) !important;
            border: 1px solid #e5e7eb !important;
            background: #ffffff;
          }

          .table {
            margin-bottom: 0;
          }

          .table thead {
            background: #f8fafc;
          }

          .table thead th {
            color: #374151;
            font-weight: 700;
            font-size: 0.875rem;
            border-bottom: 1px solid #e5e7eb;
            background: #f8fafc !important;
          }

          .table tbody td {
            border-color: #eef2f7;
            vertical-align: middle;
            color: #1f2937;
          }

          .table-hover tbody tr:hover {
            background-color: #f0fdf4;
            transition: background-color 0.2s ease;
          }

          .table tbody tr {
            transition: all 0.2s ease;
          }

          .modal-content {
            border-radius: 18px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
            box-shadow: 0 20px 45px rgba(0,0,0,0.12);
          }

          .modal-header {
            background: linear-gradient(135deg, #333b45, #1f2937) !important;
            border-bottom: none;
            padding: 1rem 1.5rem;
          }

          .modal-title {
            font-weight: 700;
          }

          .modal-footer {
            padding: 1rem 1.5rem;
            border-top: 1px solid #eef2f7;
          }

          .form-control,
          .form-select {
            border-radius: 10px;
            border: 1px solid #d1d5db;
            min-height: 46px;
            padding: 0.7rem 0.9rem;
            transition: all 0.2s ease;
          }

          textarea.form-control {
            min-height: 140px;
          }

          .form-control:focus,
          .form-select:focus {
            border-color: #0f763f;
            box-shadow: 0 0 0 4px rgba(15,118,63,0.15);
          }

          .btn-outline-primary,
          .btn-outline-danger,
          .btn-outline-secondary,
          .btn-light,
          .btn-danger,
          .btn-success {
            border-radius: 10px;
            font-weight: 600;
            transition: all 0.2s ease;
          }

          .badge {
            border-radius: 999px !important;
            padding: 0.55rem 0.9rem;
            font-weight: 600;
            font-size: 0.75rem;
            background: #e6f4ea !important;
            color: #0f763f !important;
            border: 1px solid rgba(15,118,63,0.15) !important;
          }

          .patient-avatar {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: #e6f4ea;
            border: 2px solid rgba(15,118,63,0.15);
            box-shadow: 0 6px 18px rgba(15,118,63,0.12);
          }


          .custom-empty-state {
  min-height: 350px;
}

@media (max-width: 767px) {
  .physician-mobile-empty {
    min-height: 420px;
    border: 1px solid #dee2e6;
    border-radius: 10px;
    background: #fff;
  }
}

          .patient-name {
            color: #1f2937;
            letter-spacing: 0.3px;
            margin-bottom: 0.35rem;
          }

          .patient-address {
            color: #6b7280;
            line-height: 1.6;
          }

          @media (max-width: 575.98px) {
            .toolbar-mobile-stack {
              width: 100%;
            }

            .toolbar-mobile-stack button {
              flex: 1;
            }

            .card {
              padding: 1rem !important;
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
                className="card border-0 shadow-sm p-3 p-md-4 mb-4 flex-grow-1"
                style={{
                  borderRadius: "16px",
                  borderTop: "4px solid #0f763f",
                  background: "#ffffff",
                }}
              >
                {/* Header */}
                <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3 gap-md-4 mb-4 pb-4 border-bottom">
                  <div className="rounded-circle d-flex align-items-center justify-content-center patient-avatar">
                    <i className="isax isax-user fs-1 text-success"></i>
                  </div>

                  <div>
                    <div className="badge mb-2">
                      ID: {mockPatientProfile.hospitalNumber}
                    </div>

                    <h3 className="fw-bold patient-name">
                      {mockPatientProfile.lastName},{" "}
                      {mockPatientProfile.firstName}{" "}
                      {mockPatientProfile.middleName}
                    </h3>

                    <div className="small patient-address">
                      {mockPatientProfile.address}
                    </div>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
                  <h5 className="fw-bold text-uppercase mb-0">
                    Diagnosis
                  </h5>

                  {(!isMobile || hasRecords) && (
                    <div className="d-flex gap-2 toolbar-mobile-stack">
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
  <span>Add Diagnosis</span>
</button>

                      {/* Edit */}
                      <button
  type="button"
  disabled={!isRowSelected}
  onClick={handleEdit}
  className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap fw-bold ${
    isRowSelected
      ? "bg-white text-dark text-hover-primary"
      : "bg-light text-muted opacity-50"
  }`}
  style={{
    borderRadius: "4px",
    cursor: isRowSelected ? "pointer" : "not-allowed",
  }}
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
    isRowSelected
      ? "bg-white text-danger"
      : "bg-light text-muted opacity-50"
  }`}
  style={{
    borderRadius: "4px",
    cursor: isRowSelected ? "pointer" : "not-allowed",
  }}
>
  <i className="isax isax-trash"></i>
  <span>Delete</span>
</button>
                    </div>
                  )}
                </div>

                {/* Table */}
                {/* Main Content */}
<div
  className="border rounded bg-white flex-grow-1"
  style={{
    minHeight: "460px",
    border: "1px solid #e5e7eb",
  }}
>
 {!hasRecords ? (
  <div className="d-flex flex-column align-items-center justify-content-center text-center text-muted py-5 custom-empty-state physician-mobile-empty h-100">

    {/* DESKTOP EMPTY ICON */}
    <i
      className="isax isax-document-text fs-1 mb-3 opacity-50 d-none d-lg-block"
      style={{
        fontSize: "3rem",
        color: "var(--primary, #0f763f)",
      }}
    ></i>

    {/* MOBILE ADD BUTTON */}
    <div
      className="rounded-circle d-flex align-items-center justify-content-center shadow-sm d-lg-none mb-2"
      onClick={handleAdd}
      style={{
        width: "64px",
        height: "64px",
        border: "2px solid var(--primary, #0f763f)",
        backgroundColor: "#fff",
        cursor: "pointer",
      }}
    >
      <i
        className="isax isax-add fs-1 text-primary"
        style={{ fontSize: "2rem" }}
      />
    </div>

    {/* MOBILE LABEL */}
    <span
      className="mt-2 fw-semibold text-muted d-lg-none"
      style={{ fontSize: "14px" }}
    >
      Add New
    </span>

    {/* EMPTY TEXT */}
    <p className="mb-0 fw-bold text-dark">
      No diagnosis records found
    </p>
  </div>
) : (
    <>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-light">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Diagnosis</th>

              <th className="px-4 py-3 d-none d-lg-table-cell">
                ICD
              </th>

              <th className="px-4 py-3 d-none d-lg-table-cell">
                Physician
              </th>

              <th className="px-4 py-3 text-center d-lg-none">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedRecords.map((record) => (
              <React.Fragment key={record.id}>
                <tr
                  onClick={() =>
                    setSelectedRecordId(record.id)
                  }
                  className={
                    selectedRecordId === record.id
                      ? "selected-row"
                      : ""
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td className="px-4 py-3">
                    {record.typeOfDiag}
                  </td>

                  <td className="px-4 py-3 text-break">
                    {record.diagnosisText}
                  </td>

                  <td className="px-4 py-3 d-none d-lg-table-cell">
                    {record.icdCode || "—"}
                  </td>

                  <td className="px-4 py-3 d-none d-lg-table-cell">
                    {record.physician}
                  </td>

                  <td className="text-center d-lg-none">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={(e) =>
                        toggleRowExpand(e, record.id)
                      }
                    >
                      {expandedRows[record.id]
                        ? "Hide"
                        : "See More"}
                    </button>
                  </td>
                </tr>

                {expandedRows[record.id] && (
                  <tr className="d-lg-none bg-light">
                    <td colSpan={5}>
                      <div className="p-3">
                        <div className="mb-2">
                          <strong>Primary:</strong>{" "}
                          {record.isPrimary}
                        </div>

                        <div className="mb-2">
                          <strong>ICD:</strong>{" "}
                          {record.icdCode || "—"}
                        </div>

                        <div>
                          <strong>Physician:</strong>{" "}
                          {record.physician}
                        </div>
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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center p-3 border-top bg-light gap-3">
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

          <span className="small text-muted">
            entries
          </span>
        </div>

        <div className="small text-muted">
          Showing{" "}
          {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(
            currentPage * pageSize,
            records.length
          )}{" "}
          of {records.length}
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((prev) => prev - 1)
            }
          >
            Prev
          </button>

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => prev + 1)
            }
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
                  Total Records:{" "}
                  <span className="text-dark">{records.length}</span>
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
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1060,
          }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title text-white">
                  {isEditing ? "EDIT" : "ADD"} DIAGNOSIS
                </h5>

                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="small fw-bold mb-1">
                      Date/Time
                    </label>

                    <input
                      type="datetime-local"
                      className="form-control"
                      value={formData.dateTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateTime: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="small fw-bold mb-1">
                      Type of Diagnosis
                    </label>

                    <select
                      className="form-select"
                      value={formData.typeOfDiag}
                      onChange={handleTypeChange}
                    >
                      {DIAGNOSIS_TYPES.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="small fw-bold mb-1">
                      Physician
                    </label>

                    <select
                      className="form-select"
                      value={formData.physician}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          physician: e.target.value,
                        })
                      }
                    >
                      {MOCK_PHYSICIANS.map((physician) => (
                        <option key={physician}>
                          {physician}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="small fw-bold mb-1">
                      Type of Physician
                    </label>

                    <select
                      className="form-select"
                      value={formData.typeOfPhysician}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          typeOfPhysician: e.target.value,
                        })
                      }
                    >
                      {currentPhysicianTypes.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="small fw-bold mb-1">
                      Diagnosis
                    </label>

                    <textarea
                      rows={6}
                      className="form-control"
                      value={formData.diagnosisText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          diagnosisText: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="small fw-bold mb-1">
                      ICD Code
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={formData.icdCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          icdCode: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="small fw-bold mb-1">
                      Primary Diagnosis
                    </label>

                    <select
                      className="form-select"
                      value={formData.isPrimary}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isPrimary: e.target.value,
                        })
                      }
                    >
                      {YES_NO.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-light">
                <button
                  className="btn btn-success px-4"
                  disabled={!isFormValid}
                  onClick={saveRecord}
                >
                  Save and Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div
          className="modal fade show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1060,
          }}
        >
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title text-white">
                  Confirm Delete
                </h5>
              </div>

              <div className="modal-body text-center py-4">
                <i
                  className="isax isax-trash text-danger mb-3"
                  style={{ fontSize: "3rem" }}
                ></i>

                <p>
                  Are you sure you want to delete this record?
                </p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-light"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-danger"
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

export default DiagnosisModule;