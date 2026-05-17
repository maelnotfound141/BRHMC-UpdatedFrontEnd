import DoctorSidebar from "@/components/custom-sidebar/doctorSidebar";
import { useEffect, useRef, useState } from "react";

interface Physician {
  id: number;
  type: string;
  name: string;
  accessStatus: string;
}

const PhysicianModule = () => {
  const [open, setOpen] = useState(false);

  // modal states
  const [showAddModal, setShowAddModal] =
    useState(false);

  const [isEditing, setIsEditing] =
    useState(false);

  const [selectedRecordId, setSelectedRecordId] =
    useState<number | null>(null);

  const [
    showDeleteConfirmModal,
    setShowDeleteConfirmModal,
  ] = useState(false);

  // form states
  const [physicianType, setPhysicianType] =
    useState("");

  const [physicianName, setPhysicianName] =
    useState("LIQUE R, MD");

  const [accessStatus, setAccessStatus] =
    useState("Active");

  // patient profile
  const [mockPatientProfile] = useState({
    hospitalNumber: "000000000777288",
    lastName: "DO",
    firstName: "REA",
    middleName: "MON",
    address: "111 Estanza, Legazpi City, Albay",
  });

  // physician list
  const [physicians, setPhysicians] =
    useState<Physician[]>([]);

  const wrapperRef =
    useRef<HTMLDivElement | null>(null);

  const toggleRef =
    useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node
        ) &&
        toggleRef.current &&
        !toggleRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "click",
      handleOutsideClick
    );

    return () =>
      document.removeEventListener(
        "click",
        handleOutsideClick
      );
  }, []);

  // ESC close modal
  useEffect(() => {
    const handleKeyDown = (
      e: KeyboardEvent
    ) => {
      if (e.key === "Escape") {
        setShowAddModal(false);
        setShowDeleteConfirmModal(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, []);

  const resetForm = () => {
    setIsEditing(false);
    setPhysicianType("");
    setPhysicianName("LIQUE R, MD");
    setAccessStatus("Active");
  };

  // ADD BUTTON LOGIC
  const handleAdd = () => {
    resetForm();
    setIsEditing(false);
    setSelectedRecordId(null);
    setShowAddModal(true);
  };

  const openEditModalForRecord = (
    record: Physician
  ) => {
    setIsEditing(true);
    setPhysicianType(record.type);
    setPhysicianName(record.name);
    setAccessStatus(record.accessStatus);
    setSelectedRecordId(record.id);
    setShowAddModal(true);
  };

  const handleOpenEdit = () => {
    if (selectedRecordId === null) return;

    const recordToEdit = physicians.find(
      (r) => r.id === selectedRecordId
    );

    if (recordToEdit) {
      openEditModalForRecord(recordToEdit);
    }
  };

  const handleDeleteClick = () => {
    if (selectedRecordId === null) return;

    setShowDeleteConfirmModal(true);
  };

  const confirmDelete = () => {
    if (selectedRecordId === null) return;

    setPhysicians((prev) =>
      prev.filter(
        (r) => r.id !== selectedRecordId
      )
    );

    setSelectedRecordId(null);
    setShowDeleteConfirmModal(false);
  };

  const handleSave = () => {
    if (!physicianType || !physicianName)
      return;

    const newRecord: Physician = {
      id:
        isEditing &&
        selectedRecordId !== null
          ? selectedRecordId
          : Date.now(),
      type: physicianType,
      name: physicianName,
      accessStatus,
    };

    if (
      isEditing &&
      selectedRecordId !== null
    ) {
      setPhysicians((prevRecords) =>
        prevRecords.map((r) =>
          r.id === selectedRecordId
            ? newRecord
            : r
        )
      );
    } else {
      setPhysicians((prevRecords) => [
        ...prevRecords,
        newRecord,
      ]);
    }

    resetForm();
    setShowAddModal(false);
  };

  const isSaveDisabled =
    !physicianType || !physicianName;

  const hasRecords =
    physicians.length > 0;

  return (
    <>
  <style>
{`


/* =========================================================
   CLEAN WHITE TABLE UI (NO HOVER - MEDICAL STYLE)
========================================================= */

/* ===== TABLE BASE LOOK ===== */
.table {
  background-color: #ffffff !important;
}

/* Force white rows */
.table tbody tr {
  background-color: #ffffff !important;
}

/* Remove ALL hover effects completely */
.table-hover tbody tr:hover,
.table-hover tbody tr:hover > td {
  background-color: #ffffff !important;
  color: inherit !important;
}

/* Keep click behavior but no hover styling */
.table-hover tbody tr {
  cursor: pointer;
  transition: none !important;
}

/* ===== SELECTED ROW (GREEN MEDICAL HIGHLIGHT) ===== */
.selected-row > td {
  background-color: #e6f4ea !important; /* soft green like your UI */
  color: #0b592f !important;
}

/* left border accent */
.selected-row > td:first-child {
  border-left: 4px solid var(--primary, #0f763f) !important;
}

/* ===== TABLE HEADER (CLEAN WHITE HEADER) ===== */
.table thead th {
  background-color: #ffffff !important;
  color: #6c757d !important;
  font-weight: 600;
  border-bottom: 1px solid #e9ecef !important;
}

/* ===== TABLE CELLS ===== */
.table td {
  background-color: #ffffff !important;
  border-bottom: 1px solid #f1f3f5 !important;
}

/* ===== REMOVE STRIPING IF ANY ===== */
.table-striped tbody tr:nth-of-type(odd) {
  background-color: #ffffff !important;
}

/* ===== TABLE LAYOUT ===== */
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

/* ===== TEXT WRAP ===== */
.text-wrap-custom {
  white-space: normal !important;
  word-break: break-word;
}

/* ===== EMPTY TABLE STATE ===== */
.empty-table-cell {
  height: 450px;
  min-height: 450px;
  background-color: #ffffff !important;
  vertical-align: middle;
}

.empty-table-cell > div {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* ===== MOBILE CLEANUP ===== */
@media (max-width: 767px) {
  .table td,
  .table th {
    font-size: 13px;
  }

  .table thead th {
    font-size: 12px;
  }
}
`}
</style>

      <div
        className="content doctor-content bg-light mt-n4 d-flex flex-column"
        style={{ minHeight: "100vh" }}
      >
        <div className="container-fluid px-2 px-lg-5 pt-0 flex-grow-1 d-flex flex-column">
          <div className="doctor-dashboard-layout">
            <DoctorSidebar />

            <div className="doctor-dashboard-main">
              <div
                className="card border-0 shadow-sm p-3 p-md-4 mb-4 d-flex flex-column h-100 physician-mobile-card"
                style={{
                  borderRadius: "12px",
                  borderTop:
                    "4px solid var(--primary, #0f763f)",
                }}
              >
                {/* PROFILE HEADER */}
{/* PROFILE HEADER */}
<div
  className="
    d-flex
    flex-column
    flex-md-row
    align-items-center
    align-items-md-start
    text-center
    text-md-start
    gap-3
    mb-4
    pb-4
    border-bottom
  "
>

<div
  className="
    rounded-circle
    d-flex
    align-items-center
    justify-content-center
    bg-light
    shadow-sm
    flex-shrink-0
    mx-auto
    mx-md-0
  "
  style={{
    width: "90px",
    height: "90px",
    minWidth: "90px",
    minHeight: "90px",
    border: "2px solid var(--primary, #0f763f)",
  }}
>
  <i
    className="isax isax-user"
    style={{
      color: "var(--primary, #0f763f)",
      fontSize: "38px",
    }}
  />
</div>

  <div
    className="
      d-flex
      flex-column
      align-items-center
      align-items-md-start
    "
  >

    <div className="badge bg-light text-secondary border mb-2 px-2 py-1 mobile-badge">
      ID: {mockPatientProfile.hospitalNumber}
    </div>

    <h3 className="fw-bold mb-1 text-dark physician-mobile-name">
      {mockPatientProfile.lastName},{" "}
      {mockPatientProfile.firstName}{" "}
      {mockPatientProfile.middleName}
    </h3>

    <div
      className="
        text-muted
        small
        d-flex
        align-items-center
        justify-content-center
        justify-content-md-start
        gap-2
        mobile-address
      "
    >
      <i className="isax isax-location text-danger" />
      {mockPatientProfile.address}
    </div>

  </div>
</div>

                {/* PHYSICIAN SECTION */}
                <div className="d-flex flex-column flex-grow-1 mb-4">
                  {/* HEADER */}
                  <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-3 gap-3">
                    <h5 className="fw-bold text-dark mb-0 text-uppercase physician-mobile-title">
                      Physician
                    </h5>

                    {/* ACTION BUTTONS */}
                  
<div
  className={`d-flex flex-wrap justify-content-end align-items-center gap-2 ms-md-auto action-btn-group ${
    !hasRecords ? "d-none d-lg-flex" : ""
  }`}
>
  {/* ADD */}
  <button
    onClick={handleAdd}
    className="btn btn-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-white fw-bold"
    style={{
      borderRadius: "3px",
      backgroundColor: "var(--primary, #0f763f)",
      border: "1px solid var(--primary, #0f763f)",
    }}
  >
    <i className="isax isax-add-square"></i>
    <span>Add</span>
  </button>

  {/* EDIT */}
  <button
    onClick={handleOpenEdit}
    disabled={selectedRecordId === null}
    className={`btn btn-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 ${
      selectedRecordId === null
        ? "bg-light text-muted opacity-50"
        : "bg-white text-dark fw-bold border border-secondary-subtle"
    }`}
    style={{
      borderRadius: "3px",
      cursor: selectedRecordId === null ? "not-allowed" : "pointer",
    }}
  >
    <i className="isax isax-edit"></i>
    <span>Edit</span>
  </button>

  {/* DELETE */}
  <button
    onClick={handleDeleteClick}
    disabled={selectedRecordId === null}
    className={`btn btn-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 ${
      selectedRecordId === null
        ? "bg-light text-muted opacity-50"
        : "bg-white text-danger fw-bold border border-secondary-subtle"
    }`}
    style={{
      borderRadius: "3px",
      cursor: selectedRecordId === null ? "not-allowed" : "pointer",
    }}
  >
    <i className="isax isax-trash"></i>
    <span>Del</span>
  </button>
</div>
                  </div>

                  {/* TABLE */}
                  <div className="border rounded-0 flex-grow-1 bg-white d-flex flex-column shadow-sm physician-mobile-table">
                    <table className="table table-hover align-middle mb-0 table-fixed">
                      {hasRecords && (
                        <thead className="table-light">
                          <tr>
                            <th className="fw-semibold text-secondary py-3 ps-3 border-bottom text-nowrap">
                              Type of Physician
                            </th>

                            <th className="fw-semibold text-secondary py-3 border-bottom d-none d-md-table-cell">
                              Name of Physician
                            </th>

                            <th className="fw-semibold text-secondary py-3 pe-3 border-bottom text-nowrap">
                              Access Status
                            </th>
                          </tr>
                        </thead>
                      )}

                      <tbody>
  {hasRecords ? (
    physicians.map((record) => (
      <tr
  key={record.id}
  onClick={() => setSelectedRecordId(record.id)}
  onDoubleClick={() => {
    setSelectedRecordId(record.id);
    openEditModalForRecord(record);
  }}
  className={
    selectedRecordId === record.id
      ? "selected-row"
      : ""
  }
>
        <td className="ps-3 py-3 text-dark border-bottom-0 text-wrap-custom">
  {record.type}
</td>

<td className="py-3 text-dark border-bottom-0 d-none d-md-table-cell text-wrap-custom">
  {record.name}
</td>

<td className="pe-3 py-3 text-dark border-bottom-0 text-wrap-custom">
  {record.accessStatus}
</td>
      </tr>
    ))
  ) : (
    <tr>
      <td
  colSpan={3}
  className="border-bottom-0 empty-table-cell"
>
        <div className="d-flex flex-column align-items-center justify-content-center text-center text-muted py-5 custom-empty-state physician-mobile-empty">

          {/* DOCUMENT ICON (same as SignatoryModule) */}
          <i
            className="isax isax-document-text fs-1 mb-3 opacity-50 d-none d-lg-block"
            style={{
              fontSize: "3rem",
              color: "var(--primary, #0f763f)",
            }}
          ></i>

          {/* MOBILE ADD BUTTON */}
          {/* MOBILE ADD BUTTON */}
<div
  className="rounded-circle d-flex align-items-center justify-content-center shadow-sm d-lg-none mobile-add-circle"
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
    style={{
      fontSize: "2rem",
      color: "#fff",
    }}
  />
</div>

          {/* MOBILE LABEL */}
          <span
            className="mt-2 fw-semibold text-muted d-lg-none"
            style={{ fontSize: "14px" }}
          >
            
          </span>

          {/* EMPTY TEXT */}
          <p className="mb-0 fw-bold text-dark">
            No physician records found
          </p>
        </div>
      </td>
    </tr>
  )}
</tbody>
                    </table>
                  </div>

                  {/* TOTAL */}
                  <div className="mt-3 small text-muted fw-semibold">
                    Total Number of Record/s:{" "}
                    {physicians.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showAddModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{
            backgroundColor:
              "rgba(0,0,0,0.5)",
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered px-3">
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
                <h3
                  className="modal-title text-white fw-bold m-0 d-flex align-items-center gap-2"
                  style={{
                    fontSize: "1.1rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  <i
                    className={
                      isEditing
                        ? "isax isax-edit"
                        : "isax isax-add-square"
                    }
                    style={{
                      fontSize: "1.75rem",
                    }}
                  />

                  {isEditing
                    ? "EDIT PHYSICIAN"
                    : "ADD PHYSICIAN"}
                </h3>

                <button
                  type="button"
                  className="btn-close btn-close-white ms-auto"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                ></button>
              </div>

              <div className="modal-body p-4 bg-white">
                <div className="row mb-3 align-items-center">
                  <div className="col-4">
                    <label className="form-label text-dark fw-bold mb-0">
                      Type of Physician
                    </label>
                  </div>

                  <div className="col-8">
                    <select
                      value={physicianType}
                      onChange={(e) =>
                        setPhysicianType(
                          e.target.value
                        )
                      }
                      className="form-select rounded-1 shadow-none text-dark py-1"
                    >
                      <option
                        value=""
                        disabled
                      ></option>

                      <option value="Admitting">
                        Admitting
                      </option>

                      <option value="Attending">
                        Attending
                      </option>

                      <option value="Consultant">
                        Consultant
                      </option>

                      <option value="Resident">
                        Resident
                      </option>

                      <option value="Surgeon">
                        Surgeon
                      </option>
                    </select>
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <div className="col-4">
                    <label className="form-label text-dark fw-bold mb-0">
                      Name of Physician
                    </label>
                  </div>

                  <div className="col-8">
                    <select
                      value={physicianName}
                      onChange={(e) =>
                        setPhysicianName(
                          e.target.value
                        )
                      }
                      className="form-select rounded-1 shadow-none text-dark py-1"
                    >
                      <option value="LIQUE R, MD">
                        LIQUE R, MD
                      </option>
                    </select>
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <div className="col-4">
                    <label className="form-label text-dark fw-bold mb-0">
                      Access to Record
                    </label>
                  </div>

                  <div className="col-8">
                    <input
                      type="text"
                      value={accessStatus}
                      readOnly
                      className="form-control rounded-1 shadow-none text-dark py-1 w-50"
                    />
                  </div>
                </div>
              </div>

              <div
                className="modal-footer border-0 d-flex justify-content-end p-3"
                style={{
                  backgroundColor: "#e2e5e9",
                }}
              >
                <button
                  type="button"
                  className={`btn text-white rounded-1 px-4 py-2 fw-medium ${
                    isSaveDisabled
                      ? "opacity-50"
                      : ""
                  }`}
                  style={{
                    backgroundColor:
                      "var(--primary, #0f763f)",
                    cursor:
                      isSaveDisabled
                        ? "not-allowed"
                        : "pointer",
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
      )}

      {/* DELETE MODAL */}
      {showDeleteConfirmModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{
            backgroundColor:
              "rgba(0,0,0,0.5)",
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
                className="modal-header border-0 py-2 d-flex align-items-center"
                style={{
                  backgroundColor: "#dc3545",
                }}
              >
                <h6 className="modal-title text-white fw-bold m-0 d-flex align-items-center gap-2">
                  <i className="isax isax-trash"></i>
                  Confirm Delete
                </h6>
              </div>

              <div className="modal-body p-4 text-center bg-white">
                <i
                  className="isax isax-warning-2 text-danger mb-3 d-block"
                  style={{
                    fontSize: "2.5rem",
                  }}
                ></i>

                <p className="mb-0 text-dark fw-medium">
                  Are you sure you want to
                  delete this physician?
                </p>
              </div>

              <div
                className="modal-footer border-0 p-2 justify-content-center"
                style={{
                  backgroundColor: "#f8f9fa",
                }}
              >
                <button
                  type="button"
                  className="btn btn-sm btn-light border border-secondary-subtle fw-bold text-dark shadow-sm px-4"
                  onClick={() =>
                    setShowDeleteConfirmModal(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-sm px-4 fw-bold text-white shadow-sm"
                  style={{
                    backgroundColor:
                      "#dc3545",
                  }}
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

export default PhysicianModule;


