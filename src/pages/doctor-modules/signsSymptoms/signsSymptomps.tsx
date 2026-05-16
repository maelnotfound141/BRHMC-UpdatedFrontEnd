import DoctorSidebar from "@/components/custom-sidebar/doctorSidebar";
import ImageWithBasePath from "@/components/image-with-base-path";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

// List of standard symptoms
const SYMPTOMS_LIST = [
  "Altered mental sensorium",
  "Abdominal cramp / pain",
  "Anorexia",
  "Bleeding gums",
  "Body weakness",
  "Blurring of vision",
  "Chest pain/discomfort",
  "Constipation",
  "Cough",
  "Diarrhea",
  "Dizziness",
  "Dysphagia",
  "Dyspnea",
  "Dysuria",
  "Epistaxis",
  "Fever",
  "Frequency of urination",
  "Headache",
  "Hematemesis",
  "Hematuria",
  "Hemoptysis",
  "Irritability",
  "Jaundice",
  "Lower extremity edema",
  "Myalgia",
  "Orthopnea",
  "Stool, bloody/black tarry/mucoid",
  "Palpitation",
  "Seizures",
  "Skin rashes",
  "Sweating",
  "Urgency",
  "Vomiting",
  "Weight loss",
];

const PatientSignsAndSymptoms = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Dummy patient data
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

  // module state
  const [isEditing, setIsEditing] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);

  // delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // form state
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [painChecked, setPainChecked] = useState(false);
  const [painValue, setPainValue] = useState("");
  const [otherChecked, setOtherChecked] = useState(false);
  const [otherValue, setOtherValue] = useState("");

  // backup state
  const [savedState, setSavedState] = useState<{
    selectedSymptoms: string[];
    painChecked: boolean;
    painValue: string;
    otherChecked: boolean;
    otherValue: string;
  } | null>(null);

  useEffect(() => {
    const selectedPatientId = location.state?.selectedPatientId;

    if (selectedPatientId) {
      setTimeout(() => {}, 1500);
    }
  }, [location.state]);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () =>
      document.removeEventListener("click", handleOutsideClick);
  }, []);

  // handlers
  const handleAdd = () => {
    setIsEditing(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setSavedState({
      selectedSymptoms,
      painChecked,
      painValue,
      otherChecked,
      otherValue,
    });

    setHasSavedData(true);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (savedState) {
      setSelectedSymptoms(savedState.selectedSymptoms);
      setPainChecked(savedState.painChecked);
      setPainValue(savedState.painValue);
      setOtherChecked(savedState.otherChecked);
      setOtherValue(savedState.otherValue);
    } else {
      setSelectedSymptoms([]);
      setPainChecked(false);
      setPainValue("");
      setOtherChecked(false);
      setOtherValue("");
    }

    setIsEditing(false);
  };

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((item) => item !== symptom)
        : [...prev, symptom]
    );
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setSelectedSymptoms([]);
    setPainChecked(false);
    setPainValue("");
    setOtherChecked(false);
    setOtherValue("");
    setSavedState(null);
    setHasSavedData(false);
    setIsEditing(false);
    setShowDeleteModal(false);
  };

  return (
    <>
      <style>
        {`
          .text-hover-primary:hover {
            color: var(--primary, #0f763f) !important;
          }

          .acc-info-backdrop {
            position: fixed;
            inset: 0;
            z-index: 1080;
            background: rgba(0, 0, 0, 0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
          }

          .acc-info-box {
            width: 360px;
            max-width: 100%;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
          }

          .acc-info-title {
            height: 40px;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 12px;
            font-size: 14px;
            font-weight: 700;
          }

          .acc-info-icon {
            width: 42px;
            height: 42px;
            background: var(--primary, #0f763f);
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            flex-shrink: 0;
          }

          .acc-info-icon-danger {
            background: #dc3545;
          }

          .acc-info-action-btn {
            border-radius: 4px;
            font-size: 0.82rem;
          }

          @media (max-width: 575.98px) {
            .acc-info-box {
              width: 100%;
            }

            .acc-info-footer {
              flex-direction: column;
            }

            .acc-info-footer button {
              width: 100%;
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
                className="card border-0 shadow-sm p-3 p-md-4 mb-4 d-flex flex-column h-100"
                style={{
                  borderRadius: "12px",
                  borderTop: "4px solid var(--primary, #0f763f)",
                }}
              >
                {/* patient profile */}
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

                {/* SIGNS & SYMPTOMS SECTION */}
                <div className="d-flex flex-column flex-grow-1 mb-4">
                  {/* HEADER */}
                  <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-3 gap-3">
                    <h5 className="fw-bold text-dark mb-0 text-center text-lg-start text-uppercase">
                      Pertinent Sign and Symptoms
                    </h5>

                    {/* ACTION BUTTONS */}
                    <div
                      className="d-flex flex-wrap justify-content-end rounded-1"
                      role="group"
                      style={{ gap: "4px" }}
                    >
                      {/* ADD BUTTON - DESKTOP ONLY */}
                      {!hasSavedData && (
                        <button
                          onClick={handleAdd}
                          disabled={isEditing}
                          className={`btn btn-sm mt-0 d-none d-lg-flex align-items-center gap-2 px-3 py-2 ${
                            isEditing
                              ? "bg-light text-muted opacity-50"
                              : "text-white fw-bold"
                          }`}
                          style={{
                            borderRadius: "3px",
                            backgroundColor:
                              "var(--primary, #0f763f)",
                            border:
                              "1px solid var(--primary, #0f763f)",
                            cursor: isEditing
                              ? "not-allowed"
                              : "pointer",
                          }}
                        >
                          <i className="isax isax-add-square"></i>
                          Add
                        </button>
                      )}

                      <button
                        onClick={handleEdit}
                        disabled={!hasSavedData || isEditing}
                        className={`btn btn-sm border-secondary-subtle d-flex align-items-center justify-content-center gap-2 px-3 py-2 ${
                          !hasSavedData || isEditing
                            ? "bg-light text-muted opacity-50"
                            : "bg-white text-dark fw-bold"
                        }`}
                        style={{
                          borderRadius: "3px",
                          cursor:
                            !hasSavedData || isEditing
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        <i className="isax isax-edit"></i>
                        Edit
                      </button>

                      <button
                        onClick={handleSave}
                        disabled={!isEditing}
                        className={`btn btn-sm border-secondary-subtle d-flex align-items-center justify-content-center gap-2 px-3 py-2 ${
                          !isEditing
                            ? "bg-light text-muted opacity-50"
                            : "text-white fw-bold shadow-sm"
                        }`}
                        style={{
                          borderRadius: "3px",
                          cursor: !isEditing
                            ? "not-allowed"
                            : "pointer",
                          backgroundColor: isEditing
                            ? "var(--primary, #0f763f)"
                            : undefined,
                          borderColor: isEditing
                            ? "var(--primary, #0f763f)"
                            : undefined,
                        }}
                      >
                        <i className="isax isax-save-2"></i>
                        Save
                      </button>

                      <button
                        onClick={handleCancel}
                        disabled={!isEditing}
                        className={`btn btn-sm border-secondary-subtle d-flex align-items-center justify-content-center gap-2 px-3 py-2 ${
                          !isEditing
                            ? "bg-light text-muted opacity-50"
                            : "bg-white text-dark fw-bold"
                        }`}
                        style={{
                          borderRadius: "3px",
                          cursor: !isEditing
                            ? "not-allowed"
                            : "pointer",
                        }}
                      >
                        <i className="isax isax-undo"></i>
                        Cancel
                      </button>

                      <button
                        onClick={handleDeleteClick}
                        disabled={!hasSavedData || isEditing}
                        className={`btn btn-sm border-secondary-subtle d-flex align-items-center justify-content-center gap-2 px-3 py-2 ${
                          !hasSavedData || isEditing
                            ? "bg-light text-muted opacity-50"
                            : "bg-white text-danger fw-bold"
                        }`}
                        style={{
                          borderRadius: "3px",
                          cursor:
                            !hasSavedData || isEditing
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        <i className="isax isax-trash"></i>
                        Del
                      </button>
                    </div>
                  </div>

                  {/* TABLE */}
                  <div className="border rounded-0 flex-grow-1 bg-white d-flex flex-column shadow-sm">
                    <table
                      className="table table-hover align-middle mb-0"
                      style={{ tableLayout: "auto" }}
                    >
                      <thead className="table-light">
                        <tr>
                          <th
                            className="fw-semibold text-secondary py-3 ps-3 border-bottom text-nowrap"
                            style={{
                              color:
                                "var(--primary, #0f763f)",
                            }}
                          >
                            Signs and Symptoms Checklist
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td className="p-3 p-md-4 border-bottom-0">
                            {!isEditing && !hasSavedData ? (
                              <div className="d-flex flex-column align-items-center justify-content-center text-muted py-5">
                                


                             
                               {/* MOBILE ONLY ADD ICON BUTTON */}
                                 
<div className="d-flex flex-column justify-content-center align-items-center w-100 text-center py-5 d-lg-none">
  {/* Circular Add Button */}
  <div
    onClick={handleAdd}
    className="rounded-circle d-flex align-items-center justify-content-center border shadow-sm"
    style={{
      width: "64px",
      height: "64px",
      border: "2px solid var(--primary, #0f763f)",
      backgroundColor: "#fff",
      cursor: isEditing ? "not-allowed" : "pointer",
    }}
    title="Add New Sign & Symptoms"
  >
    <i
      className="isax isax-add fs-1"
      style={{ fontSize: "2.5rem", color: "var(--primary, #0f763f)" }}
    />
  </div>

  {/* "Add New" Label */}
  <span
    className="mt-2 fw-semibold text-muted"
    style={{ fontSize: "14px" }}
  >
    Add New
  </span>

  {/* Message Text */}
  <p className="mt-3 fw-semibold text-muted" style={{ fontSize: "16px" }}>
    No pertinent signs and symptoms recorded.
  </p>
</div>
                              </div>
                            ) : (
                              <div className="row g-2">
                                {SYMPTOMS_LIST.map(
                                  (symptom, index) => (
                                    <div
                                      className="col-12 col-sm-6 col-md-4 col-lg-3"
                                      key={index}
                                    >
                                      <div className="form-check d-flex align-items-center gap-1">
                                        <input
                                          className="form-check-input mt-0 shadow-none"
                                          type="checkbox"
                                          id={`symptom-${index}`}
                                          checked={selectedSymptoms.includes(
                                            symptom
                                          )}
                                          onChange={() =>
                                            handleSymptomToggle(
                                              symptom
                                            )
                                          }
                                          disabled={!isEditing}
                                        />

                                        <label
                                          className="form-check-label text-dark pt-1"
                                          htmlFor={`symptom-${index}`}
                                          style={{
                                            fontSize:
                                              "0.85rem",
                                          }}
                                        >
                                          {symptom}
                                        </label>
                                      </div>
                                    </div>
                                  )
                                )}

                                {/* PAIN */}
                                <div className="col-12 mt-4">
                                  <div className="form-check d-flex align-items-center gap-1 mb-2">
                                    <input
                                      className="form-check-input mt-0 shadow-none"
                                      type="checkbox"
                                      id="check-pain"
                                      checked={painChecked}
                                      onChange={(e) => {
                                        setPainChecked(
                                          e.target.checked
                                        );

                                        if (
                                          !e.target.checked
                                        )
                                          setPainValue("");
                                      }}
                                      disabled={!isEditing}
                                    />

                                    <label
                                      className="form-check-label text-dark pt-1 fw-bold"
                                      htmlFor="check-pain"
                                    >
                                      Pain
                                    </label>
                                  </div>

                                  <input
                                    type="text"
                                    className="form-control rounded-1 shadow-none"
                                    value={painValue}
                                    onChange={(e) =>
                                      setPainValue(
                                        e.target.value.toUpperCase()
                                      )
                                    }
                                    disabled={
                                      !painChecked ||
                                      !isEditing
                                    }
                                  />
                                </div>

                                {/* OTHER */}
                                <div className="col-12 mt-3">
                                  <div className="form-check d-flex align-items-center gap-1 mb-2">
                                    <input
                                      className="form-check-input mt-0 shadow-none"
                                      type="checkbox"
                                      id="check-other"
                                      checked={otherChecked}
                                      onChange={(e) => {
                                        setOtherChecked(
                                          e.target.checked
                                        );

                                        if (
                                          !e.target.checked
                                        )
                                          setOtherValue("");
                                      }}
                                      disabled={!isEditing}
                                    />

                                    <label
                                      className="form-check-label text-dark pt-1 fw-bold"
                                      htmlFor="check-other"
                                    >
                                      Other
                                    </label>
                                  </div>

                                  <input
                                    type="text"
                                    className="form-control rounded-1 shadow-none"
                                    value={otherValue}
                                    onChange={(e) =>
                                      setOtherValue(
                                        e.target.value.toUpperCase()
                                      )
                                    }
                                    disabled={
                                      !otherChecked ||
                                      !isEditing
                                    }
                                  />
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="acc-info-backdrop">
          <div className="acc-info-box shadow-lg">
            <div className="acc-info-title">
              <span>Confirm Delete</span>

              <button
                type="button"
                className="btn-close btn-close-sm"
                onClick={() => setShowDeleteModal(false)}
              />
            </div>

            <div className="d-flex align-items-center gap-3 p-4">
              <div className="acc-info-icon acc-info-icon-danger">
                <i className="isax isax-trash"></i>
              </div>

              <div>
                <div className="fw-bold text-dark mb-1">
                  Clear Form?
                </div>

                <div className="small fw-semibold text-muted">
                  Are you sure you want to clear the current
                  signs and symptoms form?
                </div>
              </div>
            </div>

            <div className="acc-info-footer d-flex justify-content-end gap-2 px-4 pb-3">
              <button
                type="button"
                className="btn btn-sm btn-light fw-bold px-4 border acc-info-action-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-sm btn-danger fw-bold px-4 acc-info-action-btn"
                onClick={confirmDelete}
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

export default PatientSignsAndSymptoms;