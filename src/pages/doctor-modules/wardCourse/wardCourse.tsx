import DoctorSidebar from "@/components/custom-sidebar/doctorSidebar";
import DeleteConfirmationModal from "@/components/delete-confirmation-modal/DeleteConfirmationModal";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./wardCourse.css";

interface WardCourseRecord {
  id: string;
  date: string;
  courseText: string;
  entryBy: string;
  showInCF4: boolean;
}

const CourseInTheWard = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

  const todayStr = new Date().toISOString().split("T")[0];

  // State Management
  const [records, setRecords] = useState<WardCourseRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Responsive State
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
    date: todayStr,
    courseText: "",
    showInCF4: false,
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const selectedPatientId = location.state?.selectedPatientId;

    if (selectedPatientId) {
      setTimeout(() => {}, 1500);
    }
  }, [location.state]);

  const remainingChars = 255 - formData.courseText.length;

  const isRowSelected = selectedRecordId !== null;
  const hasRecords = records.length > 0;

  // Validation checks
  const isTextValid = formData.courseText.trim().length > 0;

  const isDateValid =
    formData.date.trim() !== "" &&
    formData.date <= todayStr;

  const isFormValid = isTextValid && isDateValid;

  // Pagination
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

  // Toolbar handlers
  const handleAdd = () => {
    setFormData({
      date: todayStr,
      courseText: "",
      showInCF4: false,
    });

    setIsEditing(false);
    setSelectedRecordId(null);

    setShowModal(true);
  };

  const handleEdit = () => {
    if (!selectedRecordId) return;

    const recordToEdit = records.find(
      (r) => r.id === selectedRecordId
    );

    if (recordToEdit) {
      setFormData({
        date: recordToEdit.date,
        courseText: recordToEdit.courseText,
        showInCF4: recordToEdit.showInCF4,
      });

      setIsEditing(true);
      setShowModal(true);
    }
  };

  const handleDeleteClick = () => {
    if (!selectedRecordId) return;

    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedRecordId) {
      const updatedRecords = records.filter(
        (r) => r.id !== selectedRecordId
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
    }

    setShowDeleteModal(false);
  };

  // Save logic
  const saveRecord = () => {
    if (!isFormValid) return;

    if (isEditing && selectedRecordId) {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === selectedRecordId
            ? { ...r, ...formData, entryBy: r.entryBy }
            : r
        )
      );
    } else {
      const newRecord: WardCourseRecord = {
        id: Date.now().toString(),
        ...formData,
        entryBy: "DO, REA MON",
      };

      // newest first
      setRecords((prev) => [newRecord, ...prev]);

      // back to first page
      setCurrentPage(1);
    }
  };

  const handleSave = () => {
    if (!isFormValid) return;

    saveRecord();

    if (!isEditing) {
      setFormData({
        date: todayStr,
        courseText: "",
        showInCF4: false,
      });
    }
  };

  const handleSaveAndClose = () => {
    if (!isFormValid) return;

    saveRecord();

    setShowModal(false);
  };

  return (
    <>
      

      <div
        className="content doctor-content bg-light mt-n4 d-flex flex-column"
        style={{ minHeight: "100vh" }}
      >
       <div className="container-fluid px-2 px-lg-5 pt-0 flex-grow-1 d-flex flex-column">
          <div className="doctor-dashboard-layout">
            <DoctorSidebar />

            <div className="doctor-dashboard-main">
              <div
                className="card border-0 shadow-sm p-3 p-md-4 mb-4 d-flex flex-column flex-grow-1"
                style={{
                  borderRadius: "12px",
                  borderTop: "4px solid var(--primary, #0f763f)",
                }}
              >

                {/* close button */}
<button
  type="button"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/doctor-dashboard", { replace: true });
  }}
  className="card-close-btn d-flex align-items-center justify-content-center"
>
  <span className="desktop-close text-white fw-bold">×</span>

  <span className="mobile-back">
  <i className="isax isax-arrow-left"></i>
</span>
</button>  
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
                      Course in the Ward
                    </h5>

                    {(!isMobile || hasRecords) && (
                      <div
                        className="d-flex flex-wrap justify-content-center justify-content-md-end pb-1 pb-lg-0 ms-md-auto"
                        style={{ gap: "6px" }}
                      >
                        <button
  onClick={handleAdd}
  className={`btn btn-sm shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap flex-grow-1 flex-md-grow-0 ${
    !hasRecords
      ? "text-white fw-bold border-0"
      : "bg-white text-dark fw-bold border border-secondary-subtle"
  }`}
  style={{
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: !hasRecords ? "#0f763f" : undefined,
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

                        <button
                          className="btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap bg-white text-dark fw-bold flex-grow-1 flex-md-grow-0"
                          style={{
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          <i className="isax isax-document-text"></i>
                          <span className="d-none d-sm-inline">
                            Summ
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Table */}
                  <div
className="border rounded-0 flex-grow-1 bg-white shadow-sm d-flex flex-column overflow-hidden position-relative"
style={{ minHeight: "450px", position: "relative" }} 
>
                    <div className="table-responsive flex-grow-1 bg-white p-0">
                      <table
  className="table ward-table align-middle mb-0"
  
>
                        <thead style={{ backgroundColor: "#f8f9fa" }}>
                          <tr>
<th
  className="text-center border-bottom py-3 px-4 text-dark text-start align-middle"
  style={{ fontWeight: 700 }}
>
  Date
</th>

<th
  className="text-center border-bottom py-3 px-4 text-dark text-start align-middle"
  style={{ fontWeight: 700, color: "#000" }}
>
  Course In the Ward
</th>

<th
  className="text-center border-bottom py-3 px-4 text-dark text-start align-middle"
  style={{ fontWeight: 700, color: "#000"  }}
>
  Entry by
</th>

<th
  className="text-center border-bottom py-3 px-4 text-dark text-center align-middle"
  style={{ fontWeight: 700, color: "#000"  }}
>
  Show in CF4
</th>                          
                          </tr>
                        </thead>

                        <tbody>
                            {paginatedRecords.length === 0 ? (
  <tr>
    <td colSpan={4} className="border-0 p-0">
      <div
        className="d-flex flex-column align-items-center justify-content-center text-muted text-center"
        style={{ minHeight: "350px" }}
      >
        {/* Desktop icon */}
        <i className="isax isax-document-text mb-3 opacity-50 d-none d-lg-block" style={{ fontSize: "3rem" }} />

        {/* Mobile add button */}
        <button
          onClick={handleAdd}
          className="d-lg-none"
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "var(--primary, #0f763f)",
            color: "#fff",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 18px rgba(15,118,63,0.25)",
            cursor: "pointer",
          }}
        >
          <i className="isax isax-add" style={{ fontSize: "1.6rem" }} />
        </button>

        <h6 className="fw-bold mb-0 mt-3">No course records found.</h6>
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
                                <td className="py-3 px-4 align-top">
                                  {record.date}
                                </td>

                                <td
                                  className="py-3 px-3 align-top"
                                  style={{
                                  whiteSpace: "normal",
                                  overflowWrap: "break-word",
                                  wordBreak: "break-word",
                                }}
                                >
                                  {record.courseText}
                                </td>

                                <td
                                  className="py-3 px-3 align-top"
                                  style={{
                                  whiteSpace: "normal",
                                  overflowWrap: "break-word",
                                  wordBreak: "break-word",
                                }}
                                >
                                  {record.entryBy}
                                </td>

                                <td className="py-3 px-4 text-center align-top">
                                  {record.showInCF4 && (
                                    <i
                                      className="isax isax-tick-circle text-success"
                                      style={{
                                        fontSize: "1.2rem",
                                      }}
                                    ></i>
                                  )}
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

                  {isEditing
                    ? "EDIT COURSE IN THE WARD"
                    : "ADD COURSE IN THE WARD"}
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
                    Date <span className="text-danger">*</span>
                  </label>

                  <input
                    type="date"
                    max={todayStr}
                    className={`form-control form-control-sm rounded-1 shadow-none w-100 w-sm-auto ${
                      !isDateValid ? "is-invalid" : ""
                    }`}
                    style={{
                      borderColor: !isDateValid
                        ? "#dc3545"
                        : "var(--primary, #0f763f)",
                      maxWidth: "200px",
                    }}
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date: e.target.value,
                      })
                    }
                  />

                  {!isDateValid && (
                    <div className="invalid-feedback d-block mt-1">
                      Date is required and cannot be in the future.
                    </div>
                  )}
                </div>

                <div className="mb-1">
                  <label
                    className="fw-bold mb-1 d-flex justify-content-between align-items-center"
                    style={{
                      color: "var(--primary, #0f763f)",
                      fontSize: "0.85rem",
                    }}
                  >
                    <span>
                      Course In the Ward{" "}
                      <span className="text-danger">*</span>
                    </span>
                  </label>

                  <textarea
                    className={`form-control rounded-1 shadow-none ${
                      !isTextValid &&
                      formData.courseText.length > 0
                        ? "is-invalid"
                        : ""
                    }`}
                    rows={6}
                    maxLength={255}
                    style={{
                      borderColor:
                        !isTextValid &&
                        formData.courseText.length > 0
                          ? "#dc3545"
                          : "var(--primary, #0f763f)",
                      resize: "none",
                      fontSize: "0.9rem",
                    }}
                    value={formData.courseText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        courseText: e.target.value,
                      })
                    }
                    placeholder="Day 1. summary of"
                  ></textarea>

                  {!isTextValid &&
                    formData.courseText.length > 0 && (
                      <div className="invalid-feedback d-block mt-1">
                        Input cannot be just empty spaces.
                      </div>
                    )}
                </div>

                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mt-3 gap-2">
                  <div className="form-check d-flex align-items-center gap-1">
                    <input
                      className="form-check-input mt-0 shadow-none"
                      type="checkbox"
                      id="showInCF4"
                      checked={formData.showInCF4}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          showInCF4: e.target.checked,
                        })
                      }
                      style={{
                        border:
                          "1px solid var(--primary, #0f763f)",
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                      }}
                    />

                    <label
                      className="form-check-label text-dark pt-1 ms-1"
                      htmlFor="showInCF4"
                      style={{
                        fontSize: "0.85rem",
                        cursor: "pointer",
                      }}
                    >
                      Show this ward course in CF4
                    </label>
                  </div>

                  <div
                    className="text-muted w-100 text-start text-sm-end mt-2 mt-sm-0"
                    style={{
                      fontSize: "0.75rem",
                      lineHeight: "1.4",
                    }}
                  >
                    This Text Field will hold maximum of 255
                    characters
                    <br className="d-none d-sm-block" />

                    <span
                      style={{
                        color: "var(--primary, #0f763f)",
                      }}
                    >
                      Remaining available characters{" "}
                      {remainingChars}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="modal-footer border-0 p-3 justify-content-end"
                style={{ backgroundColor: "#e2e5e9" }}
              >
                <div className="d-flex modal-footer-actions gap-2 w-100 justify-content-sm-end">
                  <button
                    type="button"
                    className="btn bg-secondary text-white rounded-1 px-4 py-2 fw-medium shadow-sm"
                    onClick={handleSave}
                    disabled={!isFormValid}
                    style={{
                      opacity: !isFormValid ? 0.6 : 1,
                      cursor: !isFormValid
                        ? "not-allowed"
                        : "pointer",
                    }}
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    className="btn rounded-1 px-4 py-2 fw-medium shadow-sm text-white"
                    style={{
                      backgroundColor:
                        "var(--primary, #0f763f)",
                      opacity: !isFormValid ? 0.6 : 1,
                      cursor: !isFormValid
                        ? "not-allowed"
                        : "pointer",
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
        <DeleteConfirmationModal
          message={
            <>
              Are you sure you want to delete this{" "}
              <strong className="text-danger">Course Record</strong>?
            </>
          }
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
};

export default CourseInTheWard;
