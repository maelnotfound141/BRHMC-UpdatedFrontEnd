import DoctorSidebar from "@/components/custom-sidebar/doctorSidebar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

// --- Helpers ---
const getCurrentDate = () => {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const yyyy = now.getFullYear();

  return `${mm}/${dd}/${yyyy}`;
};

const toInputDate = (dateStr: string) => {
  if (!dateStr) return "";

  const parts = dateStr.split("/");

  if (parts.length !== 3) return dateStr;

  return `${parts[2]}-${parts[0]}-${parts[1]}`;
};

const toDisplayDate = (inputDate: string) => {
  if (!inputDate) return "";

  const parts = inputDate.split("-");

  if (parts.length !== 3) return inputDate;

  return `${parts[1]}/${parts[2]}/${parts[0]}`;
};

// --- Constants ---
const FORMS_LIST = [
  "Admitting History",
  "Patient History",
  "Tagubilin",
  "Discharge Summary",
  "Medical Abstract",
];

const PHYSICIANS_LIST = [
  "ALODIE JOY -, ABAGATNAN, M",
  "JOWANNA A. ABITRIA, MD",
  "JOHN PATRICK L. ACOSTA, MD",
  "CHARMANE CLAIRE T. AGCAOILI, MD",
  "JOSE MARI C. AHORRO, MD",
];

// --- Types ---
interface SignatoryRecord {
  id: number;
  form: string;
  physician: string;
  date: string;
}

const SignatoryModule = () => {
  const location = useLocation();

  // --- Responsive State ---
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  // --- Patient Profile ---
  const [mockPatientProfile] = useState({
    hospitalNumber: "000000000777288",
    lastName: "DO",
    firstName: "REA",
    middleName: "MON",
    address: "111 Estanza, Legazpi City, Albay",
  });

  // --- States ---
  const [records, setRecords] = useState<
    SignatoryRecord[]
  >([]);

  const [selectedRecordId, setSelectedRecordId] =
    useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [showValidationModal, setShowValidationModal] =
    useState(false);

  const [validationMessage, setValidationMessage] =
    useState("");

  const [isEditing, setIsEditing] = useState(false);

  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  // --- Form State ---
  const [formData, setFormData] = useState<
    Record<string, { physician: string; date: string }>
  >({});

  useEffect(() => {
    initializeFormData();
  }, []);

  useEffect(() => {
    if (location.state?.selectedPatientId) {
      setTimeout(() => {}, 1500);
    }
  }, [location.state]);

  // --- Helpers ---
  const initializeFormData = (
    recordToEdit: SignatoryRecord | null = null
  ) => {
    const initialData: Record<
      string,
      { physician: string; date: string }
    > = {};

    const currentDate = getCurrentDate();

    FORMS_LIST.forEach((form) => {
      initialData[form] = {
        physician: "",
        date: currentDate,
      };
    });

    if (recordToEdit) {
      initialData[recordToEdit.form] = {
        physician: recordToEdit.physician,
        date: recordToEdit.date,
      };
    }

    setFormData(initialData);
  };

  const resetForm = () => {
    initializeFormData();
  };

  const isRowSelected = selectedRecordId !== null;

  const hasRecords = records.length > 0;

  // --- Pagination Logic ---
  const totalPages = Math.max(
    1,
    Math.ceil(records.length / pageSize)
  );

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

  // --- Handlers ---
  const handleAdd = () => {
    resetForm();

    setSelectedRecordId(null);

    setIsEditing(false);

    setShowModal(true);
  };

  const handleEdit = () => {
    if (!selectedRecordId) return;

    const selected = records.find(
      (record) => record.id === selectedRecordId
    );

    if (!selected) return;

    initializeFormData(selected);

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

  const handleFormChange = (
    formName: string,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [formName]: {
        ...prev[formName],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    let duplicateForms: string[] = [];

    FORMS_LIST.forEach((formName) => {
      const data = formData[formName];

      if (data && data.physician !== "") {
        const existingRecord = records.find(
          (s) => s.form === formName
        );

        if (existingRecord) {
          if (!isEditing) {
            duplicateForms.push(formName);
          } else if (
            existingRecord.id !== selectedRecordId
          ) {
            duplicateForms.push(formName);
          }
        }
      }
    });

    if (duplicateForms.length > 0) {
      setValidationMessage(
        `The following form(s) are already added: ${duplicateForms.join(
          ", "
        )}. Please edit the existing record instead.`
      );

      setShowValidationModal(true);

      return;
    }

    let updatedRecords = [...records];

    FORMS_LIST.forEach((formName) => {
      const data = formData[formName];

      if (data && data.physician !== "") {
        const existingIndex =
          updatedRecords.findIndex(
            (s) => s.form === formName
          );

        if (
          existingIndex >= 0 &&
          isEditing &&
          updatedRecords[existingIndex].id ===
            selectedRecordId
        ) {
          updatedRecords[existingIndex] = {
            ...updatedRecords[existingIndex],
            physician: data.physician,
            date: data.date,
          };
        } else if (
          !isEditing ||
          (isEditing && existingIndex === -1)
        ) {
          updatedRecords.unshift({
            id: Date.now() + Math.random(),
            form: formName,
            physician: data.physician,
            date: data.date,
          });
        }
      }
    });

    setRecords(updatedRecords);

    setCurrentPage(1);

    setShowModal(false);

    resetForm();
  };

  const isSaveDisabled = !Object.values(formData).some(
    (data) => data.physician !== ""
  );

  return (
    <>
      <style>
        {`
          .table-hover tbody tr {
            cursor: pointer;
            transition: all 0.2s ease-in-out;
          }

          .selected-row > td {
            background-color: #e6f4ea !important;
            color: #0b592f !important;
          }

          .selected-row > td:first-child {
            border-left: 4px solid var(--primary, #0f763f) !important;
          }

          .table-fixed {
            table-layout: fixed;
            width: 100%;
          }

          .table-fixed td,
          .table-fixed th {
            word-wrap: break-word;
            overflow-wrap: break-word;
            vertical-align: top;
          }

          .text-wrap-custom {
            white-space: normal !important;
            word-break: break-word;
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
          <div className="doctor-dashboard-layout">
                  <DoctorSidebar />

                 <div className="doctor-dashboard-main">
              <div
                className="card border-0 shadow-sm p-3 p-md-4 mb-4 d-flex flex-column flex-grow-1"
                style={{
                  borderRadius: "12px",
                  borderTop:
                    "4px solid var(--primary, #0f763f)",
                }}
              >
                {/* Header */}
                <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3 gap-md-4 mb-4 pb-4 border-bottom text-center text-md-start">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center bg-light shadow-sm flex-shrink-0"
                    style={{
                      width: "90px",
                      height: "90px",
                      border:
                        "2px solid var(--primary, #0f763f)",
                    }}
                  >
                    <i className="isax isax-user fs-1 text-primary" />
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

                {/* Toolbar */}
                <div className="d-flex flex-column flex-grow-1 mb-4">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
                    <h5 className="fw-bold text-dark mb-0 text-center text-md-start text-uppercase">
                      Signatory
                    </h5>

                    {(!isMobile || hasRecords) && (
                      <div
                        className="d-flex flex-wrap justify-content-center justify-content-md-end pb-1 pb-lg-0 ms-md-auto"
                        style={{ gap: "6px" }}
                      >
                        <button
                          onClick={handleAdd}
                          className="btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap bg-white text-dark fw-bold flex-grow-1 flex-md-grow-0"
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
                      <table className="table table-hover align-middle mb-0 table-fixed">
                        

                        <tbody>
                          {paginatedRecords.length === 0 ? (
                              <tr>
                                  <td colSpan={3} className="text-center text-muted py-5 border-0">
                                  <div className="d-flex flex-column align-items-center justify-content-center gap-3">

                                    {/* MOBILE ONLY ADD BUTTON - CIRCULAR STYLE */}
                                    <div
                                      className="rounded-circle d-flex align-items-center justify-content-center shadow-sm d-lg-none"
                                      onClick={handleAdd}
                                      style={{
                                        width: "64px",
                                        height: "64px",
                                        border: "2px solid var(--primary, #0f763f)",
                                        backgroundColor: "#fff",
                                        cursor: "pointer",
                                      }}
                                      title="Add New Signatory"
                                    >
                                      <i
                                        className="isax isax-add fs-1 text-primary"
                                        style={{ fontSize: "2rem" }}
                                      />
                                    </div>

                                    {/* Add New Text Below */}
                                    <span
                                      className="mt-2 fw-semibold text-muted"
                                      style={{ fontSize: "14px" }}
                                    >
                                      Add New
                                    </span>

                                    {/* TEXT BELOW BUTTON */}
                                    <div className="text-center">
                                      <h6 className="fw-bold mb-1">
                                        No signatory records found
                                      </h6>

                                      
                                    </div>
                                  </div>
                                </td>
                              </tr>
) : (
                            paginatedRecords.map(
                              (record) => (
                                <tr
                                  key={record.id}
                                  onClick={() =>
                                    setSelectedRecordId(
                                      record.id
                                    )
                                  }
                                  className={
                                    selectedRecordId ===
                                    record.id
                                      ? "selected-row"
                                      : ""
                                  }
                                >
                                  <td className="py-3 px-4 fw-medium text-dark align-top text-wrap-custom">
                                    {record.form}
                                  </td>

                                  <td className="py-3 px-4 text-dark align-top text-wrap-custom">
                                    {record.physician}
                                  </td>

                                  <td className="py-3 px-4 text-muted align-top text-nowrap">
                                    {record.date}
                                  </td>
                                </tr>
                              )
                            )
                          )}
                        </tbody>
                      </table>
                    </div>  
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
                style={{
                  backgroundColor: "#333b45",
                }}
              >
                <h4 className="modal-title text-white fw-bold m-0 d-flex align-items-center gap-2">
                  <i
                    className={
                      isEditing
                        ? "isax isax-edit"
                        : "isax isax-add-square"
                    }
                  ></i>

                  {isEditing
                    ? "EDIT SIGNATORY"
                    : "ADD SIGNATORY"}
                </h4>

                <button
                  type="button"
                  className="btn-close btn-close-white shadow-none"
                  onClick={() =>
                    setShowModal(false)
                  }
                ></button>
              </div>

              <div className="modal-body p-3 p-md-4 bg-white">
                <div className="row mb-3 pb-2 border-bottom fw-bold text-dark">
                  <div className="col-4">
                    Form
                  </div>

                  <div className="col-5">
                    Signatory
                  </div>

                  <div className="col-3">
                    Date Signed
                  </div>
                </div>

                {FORMS_LIST.map((formName) => (
                  <div
                    className="row mb-2 align-items-center py-1"
                    key={formName}
                  >
                    <div className="col-4">
                      <label className="mb-0 text-dark fw-medium">
                        {formName}
                      </label>
                    </div>

                    <div className="col-5">
                      <select
                        className="form-select rounded-1 shadow-none"
                        value={
                          formData[formName]
                            ?.physician || ""
                        }
                        onChange={(e) =>
                          handleFormChange(
                            formName,
                            "physician",
                            e.target.value
                          )
                        }
                      >
                        <option value="">
                          --, -- MD
                        </option>

                        {PHYSICIANS_LIST.map(
                          (physician) => (
                            <option
                              key={physician}
                              value={physician}
                            >
                              {physician}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="col-3">
                      <input
                        type="date"
                        className="form-control rounded-1 shadow-none"
                        value={toInputDate(
                          formData[formName]?.date
                        )}
                        onChange={(e) =>
                          handleFormChange(
                            formName,
                            "date",
                            toDisplayDate(
                              e.target.value
                            )
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="modal-footer border-0 p-3 justify-content-end"
                style={{
                  backgroundColor: "#e2e5e9",
                }}
              >
                <div className="d-flex modal-footer-actions gap-2 w-100 justify-content-sm-end">
                  <button
                    type="button"
                    className="btn px-4 py-2 fw-medium shadow-sm text-white"
                    style={{
                      borderRadius: "3px",
                      backgroundColor:
                        "var(--primary, #0f763f)",
                      border:
                        "1px solid var(--primary, #0f763f)",
                      opacity:
                        isSaveDisabled ? 0.6 : 1,
                    }}
                    onClick={handleSave}
                    disabled={isSaveDisabled}
                  >
                    Save and Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Modal */}
      {showValidationModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1060,
          }}
        >
          <div className="modal-dialog modal-sm modal-dialog-centered px-3">
            <div className="modal-content border-0 shadow-lg">
              <div
                className="modal-header border-0"
                style={{
                  backgroundColor: "#333b45",
                }}
              >
                <h6 className="text-white fw-bold m-0">
                  Notice
                </h6>
              </div>

              <div className="modal-body text-center p-4">
                <i
                  className="isax isax-warning-2 text-warning d-block mb-3"
                  style={{ fontSize: "2.5rem" }}
                ></i>

                <p className="mb-0">
                  {validationMessage}
                </p>
              </div>

              <div className="modal-footer border-0">
                <button
                  className="btn text-white w-100"
                  style={{
                    backgroundColor:
                      "var(--primary, #0f763f)",
                  }}
                  onClick={() =>
                    setShowValidationModal(false)
                  }
                >
                  Understood
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
          tabIndex={-1}
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1060,
          }}
        >
          <div className="modal-dialog modal-sm modal-dialog-centered px-3">
            <div className="modal-content border-0 shadow-lg">
              <div
                className="modal-header border-0 py-3 d-flex align-items-center"
                style={{
                  backgroundColor: "#333b45",
                }}
              >
                <h3 className="modal-title text-white fw-bold m-0 d-flex align-items-center gap-2">
                  <i className="isax isax-warning-2"></i>
                  Confirm Delete
                </h3>
              </div>

              <div className="modal-body p-4 bg-white text-center">
                <i
                  className="isax isax-trash text-danger mb-3 d-block"
                  style={{ fontSize: "2.5rem" }}
                ></i>

                <p className="mb-0 text-dark fw-medium">
                  Are you sure you want to delete
                  this record?
                </p>
              </div>

              <div
                className="modal-footer border-0 d-flex flex-column flex-sm-row justify-content-center gap-2 p-3"
                style={{
                  backgroundColor: "#e2e5e9",
                }}
              >
                <button
                  type="button"
                  className="btn btn-light rounded-1 px-4 py-2 fw-medium border-secondary-subtle w-100"
                  onClick={() =>
                    setShowDeleteModal(false)
                  }
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

export default SignatoryModule;