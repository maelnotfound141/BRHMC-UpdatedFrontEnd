import DoctorSidebar from "@/components/custom-sidebar/doctorSidebar";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./history.css";

// helper function para s date and time
const getCurrentDateTime = () => {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const yyyy = now.getFullYear();

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;
  const hh = String(hours).padStart(2, "0");

  return `${mm}/${dd}/${yyyy} ${hh}:${minutes} ${ampm}`;
};

// lista kang mga history
const ALL_HISTORY_TYPES = [
  "Chief Complaint",
  "Present History",
  "Growth and Dev",
  "Past History",
  "Family History",
  "Personal/Social History",
];

const PatientHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // su sa informant modal state
  const [showInformantModal, setShowInformantModal] = useState(false);
  const [informantInput, setInformantInput] = useState("Family Member");
  const [otherInformantInput, setOtherInformantInput] = useState("");
  const [reliabilityInput, setReliabilityInput] = useState("100");
  const [savedInformant, setSavedInformant] = useState<{
    type: string;
    reliability: string;
  } | null>(null);

  // pag add History Modal State
  const [showAddHistoryModal, setShowAddHistoryModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);

  const [newHistoryDate, setNewHistoryDate] = useState(getCurrentDateTime());
  const [newHistoryType, setNewHistoryType] = useState("");
  const [newHistoryDetails, setNewHistoryDetails] = useState("");
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);

  // pag Warning / Confirm Modal States
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  // pag Mobile View Record Modal State
  const [viewingRecord, setViewingRecord] = useState<any | null>(null);

  // dummy data profle
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

  const [historyRecords, setHistoryRecords] = useState<any[]>([
    {
      id: 1,
      history: "Chief Complaint",
      details: "Please ignore this record. Phhilhealth oecb live test in progress.",
      parsedDetails: null,
      dateEntered: "03/21/2026 02:45 PM",
      entryBy: "LIQUE, ROWAN M",
    },
  ]);

  const isTableEmpty = historyRecords.length === 0;

  const availableHistoryTypes = ALL_HISTORY_TYPES.filter(
    (type) =>
      !historyRecords.some((record) => record.history === type) ||
      (isEditing && type === newHistoryType)
  );

  useEffect(() => {
    if (!isEditing) {
      setSelectedCheckboxes([]);
      setNewHistoryDetails("");
    }
  }, [newHistoryType, isEditing]);

  useEffect(() => {
    const selectedPatientId = location.state?.selectedPatientId;

    if (selectedPatientId) {
      setTimeout(() => {}, 1500);
    }
  }, [location.state]);

  const handleOpenAddHistory = () => {
    setIsEditing(false);
    setNewHistoryDate(getCurrentDateTime());
    setNewHistoryType("");
    setNewHistoryDetails("");
    setSelectedCheckboxes([]);

    if (availableHistoryTypes.length === 0) {
      setShowWarningModal(true);
    } else {
      setShowAddHistoryModal(true);
    }
  };

  const handleSaveInformant = () => {
    const finalInformantType =
      informantInput === "Other" && otherInformantInput.trim() !== ""
        ? otherInformantInput
        : informantInput;

    setSavedInformant({
      type: finalInformantType,
      reliability: reliabilityInput,
    });

    setShowInformantModal(false);
  };

  const handleCheckboxToggle = (option: string) => {
    setSelectedCheckboxes((prev) => {
      if (prev.includes(option)) {
        if (option === "Other") setNewHistoryDetails("");
        return prev.filter((item) => item !== option);
      }

      return [...prev, option];
    });
  };

  const getCheckboxOptions = (type: string) => {
    if (type === "Family History" || type === "Past History") {
      return [
        "Hypertension",
        "Diabetes Mellitus",
        "Asthma",
        "Allergy to food/drug",
        "Tuberculosis",
        "Goiter",
        "Cancer",
        "Other",
      ];
    }

    if (type === "Personal/Social History") {
      return ["Smoking", "Alcohol", "Illegal Drug", "Diet", "Other"];
    }

    return [];
  };

  const openEditModalForRecord = (record: any) => {
    setIsEditing(true);
    setSelectedRecordId(record.id);
    setNewHistoryDate(record.dateEntered);
    setNewHistoryType(record.history);

    if (record.parsedDetails) {
      const checks = [...record.parsedDetails.checked];

      if (record.parsedDetails.notes && !checks.includes("Other")) {
        checks.push("Other");
      }

      setSelectedCheckboxes(checks);
      setNewHistoryDetails(record.parsedDetails.notes || "");
    } else {
      setSelectedCheckboxes([]);
      setNewHistoryDetails(record.details || "");
    }

    setShowAddHistoryModal(true);
  };

  const handleOpenEditHistory = () => {
    if (!selectedRecordId) return;

    const recordToEdit = historyRecords.find((r) => r.id === selectedRecordId);

    if (recordToEdit) {
      openEditModalForRecord(recordToEdit);
    }
  };

  const handleDeleteHistoryClick = () => {
    if (!selectedRecordId) return;
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteHistory = () => {
    if (!selectedRecordId) return;

    setHistoryRecords((prev) => prev.filter((r) => r.id !== selectedRecordId));
    setSelectedRecordId(null);
    setShowDeleteConfirmModal(false);
  };

  const handleSaveHistory = () => {
    if (!newHistoryType) return;

    let detailsText = "";
    let structuredParsedDetails = null;
    const options = getCheckboxOptions(newHistoryType);

    if (options.length > 0) {
      const validOptions = options.filter((opt) => opt !== "Other");
      const checkedOptions = validOptions.filter((opt) =>
        selectedCheckboxes.includes(opt)
      );
      const uncheckedOptions = validOptions.filter(
        (opt) => !selectedCheckboxes.includes(opt)
      );

      structuredParsedDetails = {
        checked: checkedOptions,
        unchecked: uncheckedOptions,
        notes: newHistoryDetails.trim(),
      };
    } else {
      detailsText = newHistoryDetails.trim() || "No details provided";
    }

    const newRecord = {
      id: isEditing && selectedRecordId ? selectedRecordId : Date.now(),
      history: newHistoryType,
      details: detailsText,
      parsedDetails: structuredParsedDetails,
      dateEntered: newHistoryDate,
      entryBy:
        isEditing && selectedRecordId
          ? historyRecords.find((r) => r.id === selectedRecordId)?.entryBy ||
            "CURRENT_USER"
          : "CURRENT_USER",
    };

    if (isEditing && selectedRecordId) {
      setHistoryRecords((prevRecords) =>
        prevRecords.map((r) => (r.id === selectedRecordId ? newRecord : r))
      );
    } else {
      setHistoryRecords((prevRecords) => [...prevRecords, newRecord]);
      setSelectedRecordId(newRecord.id);
    }

    setNewHistoryType("");
    setNewHistoryDetails("");
    setSelectedCheckboxes([]);
    setIsEditing(false);
    setShowAddHistoryModal(false);
  };

  const hasCheckboxes = getCheckboxOptions(newHistoryType).length > 0;
  const isOtherChecked = selectedCheckboxes.includes("Other");
  const isTextareaEnabled = !hasCheckboxes || isOtherChecked;
  const isSaveHistoryDisabled =
    !newHistoryType || (isOtherChecked && newHistoryDetails.trim() === "");

  const renderRecordDetails = (record: any) => {
    if (record.parsedDetails) {
      return (
        <div className="d-flex flex-wrap gap-2 align-items-center">
          {record.parsedDetails.checked.map((item: string) => (
            <span
              key={`checked-${item}`}
              className="badge rounded-1 px-2 py-1 fw-semibold d-flex align-items-center gap-1"
              style={{
                backgroundColor: "rgba(15, 118, 63, 0.1)",
                color: "var(--primary, #0f763f)",
                border: "1px solid rgba(15, 118, 63, 0.25)",
              }}
            >
              <span style={{ fontSize: "1rem", lineHeight: "1" }}>+</span>
              {item}
            </span>
          ))}

          {record.parsedDetails.unchecked.map((item: string) => (
            <span
              key={`unchecked-${item}`}
              className="badge rounded-1 px-2 py-1 fw-medium text-secondary d-flex align-items-center gap-1"
              style={{
                backgroundColor: "#f8f9fa",
                border: "1px solid #dee2e6",
              }}
            >
              <span style={{ fontSize: "1rem", lineHeight: "1" }}>-</span>
              {item}
            </span>
          ))}

          {record.parsedDetails.notes && (
            <span
              className="text-dark ms-1 mt-1 fw-medium"
              style={{ fontSize: "0.9rem" }}
            >
              <span className="text-muted fw-bold me-2">Others:</span>
              {record.parsedDetails.notes}
            </span>
          )}
        </div>
      );
    }

    return record.details;
  };

  return (
    <>
     

      <div
        className="content doctor-content bg-light mt-n4 d-flex flex-column"
        style={{ minHeight: "100vh" }}
      >
        <div className="container-fluid px-3 px-lg-5 pt-0 flex-grow-1 d-flex flex-column">
        <div className="doctor-dashboard-layout">
  <DoctorSidebar />

  <div className="doctor-dashboard-main">
              <div
              
                className="card border-0 shadow-sm p-3 p-md-4 mb-4 d-flex flex-column h-100 position-relative"
                style={{
                  borderRadius: "12px",
                  borderTop: "4px solid var(--primary, #0f763f)",
                }}
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

                {/* profile header */}
                <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3 gap-md-4 mb-4 pb-4 border-bottom text-center text-md-start position-relative">
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

                {/* sa patient hist container */}
                <div className="d-flex flex-column flex-grow-1 mb-4">
                  <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-3 gap-3">
                    <h5 className="fw-bold text-dark mb-0 text-center text-lg-start">
                      PATIENT HISTORY
                    </h5>

                    <div className="history-action-bar ms-lg-auto">
                     <button
  onClick={() => setShowInformantModal(true)}
  className="btn btn-sm text-white fw-semibold rounded-1 shadow-sm border-0 history-action-btn d-flex align-items-center justify-content-center gap-1"
  style={{ backgroundColor: "var(--primary, #0f763f)" }}
>
  <i className="isax isax-profile-2user"></i>
  <span>Add Informant</span>
</button>

                      <div
  className={
    isTableEmpty
      ? "d-none d-lg-flex gap-2"
      : "d-flex gap-2"
  }
>
                        <button
  onClick={handleOpenAddHistory}
  className={`btn btn-sm rounded-1 d-flex align-items-center justify-content-center gap-1 history-action-btn ${
    availableHistoryTypes.length === 0 && !isEditing
      ? "bg-light text-muted opacity-50 border border-secondary-subtle"
      : "text-white fw-bold border-0"
  }`}
  style={{
    cursor:
      availableHistoryTypes.length === 0 && !isEditing
        ? "not-allowed"
        : "pointer",
    backgroundColor:
      !(availableHistoryTypes.length === 0 && !isEditing)
        ? "#0f763f"
        : undefined,
  }}
>
  <i className="isax isax-add-square"></i>
  <span>Add</span>
</button>

                        <button
                          onClick={handleOpenEditHistory}
                          disabled={!selectedRecordId}
                          className={`btn btn-sm btn-light border border-secondary-subtle rounded-1 d-flex align-items-center justify-content-center gap-1 text-dark history-action-btn ${
                            selectedRecordId
                              ? "text-hover-primary"
                              : "opacity-50"
                          }`}
                          style={{
                            cursor: selectedRecordId
                              ? "pointer"
                              : "not-allowed",
                          }}
                        >
                          <i className="isax isax-edit"></i>
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={handleDeleteHistoryClick}
                          disabled={!selectedRecordId}
                          className={`btn btn-sm btn-light border border-secondary-subtle rounded-1 d-flex align-items-center justify-content-center gap-1 history-action-btn ${
                            selectedRecordId
                              ? "text-danger"
                              : "text-dark opacity-50"
                          }`}
                          style={{
                            cursor: selectedRecordId
                              ? "pointer"
                              : "not-allowed",
                          }}
                        >
                          <i className="isax isax-trash"></i>
                          <span>Del</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* table area */}
                  {/* table area */}
<div
  className="border rounded-0 flex-grow-1 bg-white position-relative"
  style={{
    minHeight: "400px",
    overflow: "auto",
  }}
>
  {/* MOBILE CENTER FAB */}
  
                    <table
                     className="table align-middle mb-0"
                      style={{ tableLayout: "auto" }}
                    >
                      <thead className="table-light">
                        <tr>
                          <th className="fw-semibold text-secondary py-3 ps-3 border-bottom text-nowrap">
                            History
                          </th>

                          <th className="fw-semibold text-secondary py-3 border-bottom d-none d-md-table-cell">
                            Details
                          </th>

                          <th className="fw-semibold text-secondary py-3 border-bottom text-nowrap d-none d-md-table-cell">
                            Date Entered
                          </th>

                          <th className="fw-semibold text-secondary py-3 pe-3 border-bottom text-nowrap d-none d-lg-table-cell">
                            Entry By
                          </th>

                          <th className="fw-semibold text-secondary py-3 pe-3 border-bottom text-center d-md-none">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {isTableEmpty && (
                          <tr>
                            <td colSpan={5} className="text-center border-0" style={{ height: "350px", verticalAlign: "middle" }}>                              <div className="d-flex flex-column align-items-center justify-content-center text-center">

                                {/* Desktop Document Icon */}
                                <i
                                  className="isax isax-document-text fs-1 mb-3 opacity-50 d-none d-lg-block"
                                  style={{
                                    fontSize: "3rem",
                                    color: "var(--primary, #0f763f)",
                                  }}
                                ></i>

                                {/* Mobile Add Button */}
                                <button
                                  onClick={handleOpenAddHistory}
                                  className={`btn border-0 d-flex d-lg-none align-items-center justify-content-center shadow ${
                                    availableHistoryTypes.length === 0 && !isEditing ? "opacity-50" : ""
                                  }`}
                                  style={{
                                    backgroundColor: "var(--primary, #0f763f)",
                                    width: "64px",
                                    height: "64px",
                                    minWidth: "64px",
                                    minHeight: "64px",
                                    borderRadius: "50%",
                                    padding: 0,
                                    cursor: availableHistoryTypes.length === 0 && !isEditing ? "not-allowed" : "pointer",
                                  }}
                                >
                                  <i className="isax isax-add" style={{ fontSize: "1.8rem", color: "#fff" }} />
                                </button>

                                {/* Mobile Label */}
                                <span
                                  className="mt-2 fw-semibold text-muted d-lg-none"
                                  style={{ fontSize: "14px" }}
                                >
                                </span>

                                {/* Empty Text */}
                                <p className="mb-0 fw-bold text-dark">
                                  No history records added yet.
                                </p>

                              </div>
                            </td>
                          </tr>
                        )}

                        {historyRecords.map((record) => (
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
                            style={{ cursor: "pointer" }}
                          >
                            <td className="ps-3 py-3 text-dark border-bottom-0 fw-bold">
                              {record.history}
                            </td>

                            <td className="py-3 text-dark border-bottom-0 d-none d-md-table-cell">
                              {renderRecordDetails(record)}
                            </td>

                            <td className="py-3 text-secondary small border-bottom-0 d-none d-md-table-cell">
                              {record.dateEntered}
                            </td>

                            <td className="pe-3 py-3 text-secondary small border-bottom-0 d-none d-lg-table-cell">
                              {record.entryBy}
                            </td>

                            <td className="pe-3 py-3 text-center border-bottom-0 d-md-none">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewingRecord(record);
                                }}
                                className="btn btn-sm btn-light border border-secondary-subtle rounded-1 text-primary shadow-sm"
                              >
                                <i className="isax isax-eye"></i> View
                              </button>
                            </td>
                          </tr>
                        ))}

                        {/* ung saved na informant */}
                        {savedInformant && (
                          <tr style={{ backgroundColor: "#e9ecef" }}>
                            <td colSpan={5} className="p-0 border-0">
                              <div
                                className="px-4 py-3 border-top d-flex flex-column gap-1"
                                style={{
                                  borderLeft:
                                    "4px solid var(--primary, #0f763f)",
                                }}
                              >
                                <span
                                  className="fw-bold text-dark text-uppercase"
                                  style={{
                                    fontSize: "0.8rem",
                                    letterSpacing: "0.5px",
                                  }}
                                >
                                  Informant and Reliability
                                </span>

                                <div
                                  className="d-flex flex-wrap gap-4 mt-1 text-dark"
                                  style={{ fontSize: "0.95rem" }}
                                >
                                  <div>
                                    <span className="text-secondary me-2">
                                      Informant:
                                    </span>
                                    <span className="fw-bold">
                                      {savedInformant.type}
                                    </span>
                                  </div>

                                  <div>
                                    <span className="text-secondary me-2">
                                      Reliability:
                                    </span>
                                    <span className="fw-bold">
                                      {savedInformant.reliability} %
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* tabs sa baba */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- para sa mobile view record modal --- */}
      {viewingRecord && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable px-3">
            <div
              className="modal-content border-0 shadow-lg"
              style={{ borderRadius: "8px", overflow: "hidden" }}
            >
              <div
                className="modal-header border-0 py-3 d-flex align-items-center"
                style={{ backgroundColor: "#333b45" }}
              >
                <h3
                  className="modal-title text-white fw-bold m-0 d-flex align-items-center gap-2"
                  style={{ fontSize: "1.1rem", letterSpacing: "0.5px" }}
                >
                  <i
                    className="isax isax-document-text"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                  {viewingRecord.history}
                </h3>

                <button
                  type="button"
                  className="btn-close btn-close-white ms-auto"
                  onClick={() => setViewingRecord(null)}
                ></button>
              </div>

              <div className="modal-body p-4 bg-white">
                <div className="mb-4">
                  <label className="text-secondary small fw-bold text-uppercase mb-2">
                    History Details
                  </label>

                  <div className="p-3 bg-light rounded-2 border">
                    {renderRecordDetails(viewingRecord)}
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-6">
                    <label className="text-secondary small fw-bold text-uppercase mb-1">
                      Date Entered
                    </label>

                    <p className="mb-0 text-dark fw-medium">
                      {viewingRecord.dateEntered}
                    </p>
                  </div>

                  <div className="col-6">
                    <label className="text-secondary small fw-bold text-uppercase mb-1">
                      Entry By
                    </label>

                    <p className="mb-0 text-dark fw-medium">
                      {viewingRecord.entryBy}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="modal-footer border-0 d-flex justify-content-end p-3"
                style={{ backgroundColor: "#e2e5e9" }}
              >
                <button
                  type="button"
                  className="btn btn-secondary rounded-1 px-4 py-2 fw-medium"
                  onClick={() => setViewingRecord(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- sa pag add infoirmant modal --- */}
      {showInformantModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered px-3">
            <div
              className="modal-content border-0 shadow-lg"
              style={{ borderRadius: "8px", overflow: "hidden" }}
            >
              <div
                className="modal-header border-0 py-3 d-flex align-items-center"
                style={{ backgroundColor: "#333b45" }}
              >
                <h3
                  className="modal-title text-white fw-bold m-0 d-flex align-items-center gap-2"
                  style={{ fontSize: "1.1rem", letterSpacing: "0.5px" }}
                >
                  <i
                    className="isax isax-add-square"
                    style={{ fontSize: "1.75rem" }}
                  ></i>
                  ADD INFORMANT AND RELIABILITY
                </h3>

                <button
                  type="button"
                  className="btn-close btn-close-white ms-auto"
                  onClick={() => setShowInformantModal(false)}
                ></button>
              </div>

              <div className="modal-body p-4 bg-white">
                <div className="mb-4">
                  <label
                    className="form-label text-dark fw-medium mb-1"
                    style={{ fontSize: "0.95rem" }}
                  >
                    Add Informant
                  </label>

                  <select
                    value={informantInput}
                    onChange={(e) => setInformantInput(e.target.value)}
                    className="form-select rounded-1 shadow-none text-dark py-2"
                    style={{ border: "1px solid var(--primary, #0f763f)" }}
                  >
                    <option value="Family Member">Family Member</option>
                    <option value="Friend">Friend</option>
                    <option value="Neighbor">Neighbor</option>
                    <option value="Relative">Relative</option>
                    <option value="Self">Self</option>
                    <option value="Other">Other</option>
                  </select>

                  {informantInput === "Other" && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Please specify..."
                        value={otherInformantInput}
                        onChange={(e) =>
                          setOtherInformantInput(e.target.value)
                        }
                        className="form-control rounded-1 shadow-none text-dark py-2"
                        style={{
                          border: "1px solid var(--primary, #0f763f)",
                        }}
                        autoFocus
                      />
                    </div>
                  )}
                </div>

                <div className="mb-2">
                  <label
                    className="form-label text-dark fw-medium mb-1"
                    style={{ fontSize: "0.95rem" }}
                  >
                    Reliability %
                  </label>

                  <div style={{ maxWidth: "120px" }}>
                    <input
                      type="number"
                      value={reliabilityInput}
                      onChange={(e) => setReliabilityInput(e.target.value)}
                      className="form-control rounded-1 shadow-none text-dark py-2"
                      style={{ border: "1px solid var(--primary, #0f763f)" }}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              <div
                className="modal-footer border-0 d-flex justify-content-end p-3"
                style={{ backgroundColor: "#e2e5e9" }}
              >
                <button
                  type="button"
                  className="btn text-white rounded-1 px-4 py-2 fw-medium"
                  style={{ backgroundColor: "var(--primary, #0f763f)" }}
                  onClick={handleSaveInformant}
                >
                  Save and Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- sa pagg add patient history modal --- */}
      {showAddHistoryModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered px-3">
            <div
              className="modal-content border-0 shadow-lg"
              style={{ borderRadius: "8px", overflow: "hidden" }}
            >
              <div
                className="modal-header border-0 py-3 d-flex align-items-center"
                style={{ backgroundColor: "#333b45" }}
              >
                <h3
                  className="modal-title text-white fw-bold m-0 d-flex align-items-center gap-2"
                  style={{ fontSize: "1.1rem", letterSpacing: "0.5px" }}
                >
                  <i
                    className={
                      isEditing ? "isax isax-edit" : "isax isax-add-square"
                    }
                    style={{ fontSize: "1.75rem" }}
                  ></i>
                  {isEditing ? "EDIT PATIENT HISTORY" : "ADD PATIENT HISTORY"}
                </h3>

                <button
                  type="button"
                  className="btn-close btn-close-white ms-auto"
                  onClick={() => setShowAddHistoryModal(false)}
                ></button>
              </div>

              <div className="modal-body p-4 bg-white">
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-5 col-lg-4">
                    <label
                      className="form-label text-dark fw-medium mb-1"
                      style={{ fontSize: "0.95rem" }}
                    >
                      Date/Time
                    </label>

                    <input
                      type="text"
                      value={newHistoryDate}
                      onChange={(e) => setNewHistoryDate(e.target.value)}
                      className="form-control rounded-1 shadow-none text-dark py-2 bg-light"
                      style={{ border: "1px solid var(--primary, #0f763f)" }}
                      disabled
                    />
                  </div>

                  <div className="col-12 col-md-7 col-lg-8">
                    <label
                      className="form-label text-dark fw-medium mb-1"
                      style={{ fontSize: "0.95rem" }}
                    >
                      Type of History
                    </label>

                    <select
                      value={newHistoryType}
                      onChange={(e) => setNewHistoryType(e.target.value)}
                      className="form-select rounded-1 shadow-none text-dark py-2"
                      style={{ border: "1px solid var(--primary, #0f763f)" }}
                      disabled={isEditing}
                    >
                      <option value="" disabled>
                        Select...
                      </option>

                      {availableHistoryTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {newHistoryType && (
                  <div className="mt-2 fade-in">
                    <label
                      className="form-label text-dark fw-medium mb-3"
                      style={{ fontSize: "0.95rem" }}
                    >
                      History Details
                    </label>

                    {hasCheckboxes && (
                      <div className="row g-3 mb-4 px-1">
                        {getCheckboxOptions(newHistoryType).map((option) => (
                          <div className="col-6 col-md-3" key={option}>
                            <div className="form-check d-flex align-items-center gap-1">
                              <input
                                className="form-check-input shadow-none mt-0"
                                type="checkbox"
                                id={`check-${option}`}
                                checked={selectedCheckboxes.includes(option)}
                                onChange={() => handleCheckboxToggle(option)}
                                style={{
                                  border:
                                    "1px solid var(--primary, #0f763f)",
                                  cursor: "pointer",
                                  width: "18px",
                                  height: "18px",
                                }}
                              />

                              <label
                                className="form-check-label text-dark pt-1"
                                htmlFor={`check-${option}`}
                                style={{
                                  cursor: "pointer",
                                  fontSize: "0.9rem",
                                }}
                              >
                                {option}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <textarea
                      value={newHistoryDetails}
                      onChange={(e) => setNewHistoryDetails(e.target.value)}
                      className="form-control rounded-1 shadow-none text-dark p-3"
                      style={{
                        border: "1px solid var(--primary, #0f763f)",
                        resize: "none",
                        backgroundColor: isTextareaEnabled
                          ? "#ffffff"
                          : "#f8f9fa",
                        cursor: isTextareaEnabled ? "text" : "not-allowed",
                      }}
                      rows={5}
                      placeholder={
                        !hasCheckboxes
                          ? "Enter history details..."
                          : isOtherChecked
                          ? "Please specify other details..."
                          : "Check 'Other' above to enable typing..."
                      }
                      disabled={!isTextareaEnabled}
                    ></textarea>
                  </div>
                )}
              </div>

              <div
                className="modal-footer border-0 d-flex justify-content-between align-items-center p-3"
                style={{ backgroundColor: "#e2e5e9" }}
              >
                <div className="text-danger small fw-bold">
                  {isOtherChecked && newHistoryDetails.trim() === ""
                    ? "Please specify details for 'Other'."
                    : ""}
                </div>

                <button
                  type="button"
                  className={`btn text-white rounded-1 px-4 py-2 fw-medium ${
                    isSaveHistoryDisabled ? "opacity-50" : ""
                  }`}
                  style={{
                    backgroundColor: "var(--primary, #0f763f)",
                    cursor: isSaveHistoryDisabled ? "not-allowed" : "pointer",
                  }}
                  onClick={handleSaveHistory}
                  disabled={isSaveHistoryDisabled}
                >
                  Save and Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- warning modal para sa gamit na ung lahat na history type --- */}
      {showWarningModal && (
        <div className="acc-info-backdrop">
          <div className="acc-info-box shadow-lg">
            <div className="acc-info-title">
              <span>Notice</span>

              <button
                type="button"
                className="btn-close btn-close-sm"
                onClick={() => setShowWarningModal(false)}
              />
            </div>

            <div className="d-flex align-items-center gap-3 p-4">
              <div className="acc-info-icon">
                <i className="isax isax-info-circle"></i>
              </div>

              <div className="small fw-semibold text-dark">
                All types of history already exist.
              </div>
            </div>

            <div className="d-flex justify-content-end px-4 pb-3">
              <button
                type="button"
                className="btn btn-sm text-white fw-bold px-4 acc-info-action-btn"
                style={{
                  backgroundColor: "var(--primary, #0f763f)",
                  borderColor: "var(--primary, #0f763f)",
                }}
                onClick={() => setShowWarningModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- confirm delete modal --- */}
      {showDeleteConfirmModal && (
        <div className="acc-info-backdrop">
          <div className="acc-info-box shadow-lg">
            <div className="acc-info-title">
              <span>Confirm Delete</span>

              <button
                type="button"
                className="btn-close btn-close-sm"
                onClick={() => setShowDeleteConfirmModal(false)}
              />
            </div>

            <div className="d-flex align-items-center gap-3 p-4">
              <div className="acc-info-icon acc-info-icon-danger">
                <i className="isax isax-trash"></i>
              </div>

              <div>
                <div className="fw-bold text-dark mb-1">Delete Record?</div>

                <div className="small fw-semibold text-muted">
                  Are you sure you want to delete this history record?
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 px-4 pb-3">
              <button
                type="button"
                className="btn btn-sm btn-light fw-bold px-4 border acc-info-action-btn"
                onClick={() => setShowDeleteConfirmModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-sm btn-danger fw-bold px-4 acc-info-action-btn"
                onClick={confirmDeleteHistory}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PatientHistory;



