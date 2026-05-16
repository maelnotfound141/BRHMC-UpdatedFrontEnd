import React, { useState, useEffect } from "react";
import DoctorSidebar from "@/components/custom-sidebar/doctorSidebar";
import ImageWithBasePath from "@/components/image-with-base-path";
import { useLocation } from "react-router";

// --- Types ---
interface DispositionData {
  typeOfDisposition: string;
  typeOfCondition: string;
  dateOfDischarge: string;
}

interface InstructionData {
  diet: Record<string, { checked: boolean; details: string }>;
  activity: Record<string, { checked: boolean; details: string }>;
  specialInstruction: string;
  opdCheckUp: string;
  patientSign: string;
  patientSignDate: string;
  contactGlobe: string;
  contactSmart: string;
  drugs: Array<{
    name: string;
    morning: string;
    noon: string;
    afternoon: string;
    night: string;
    remark: string;
  }>;
}

const EMPTY_INSTRUCTION: InstructionData = {
  diet: {
    "As tolerated": { checked: false, details: "" },
    Diabetic: { checked: false, details: "" },
    "Low salt, low fat": { checked: false, details: "" },
    "Small frequent": { checked: false, details: "" },
    Others: { checked: false, details: "" },
  },
  activity: {
    "Complete bed rest": { checked: false, details: "" },
    "Moderate activity": { checked: false, details: "" },
    "No strenuous": { checked: false, details: "" },
    Other: { checked: false, details: "" },
  },
  specialInstruction: "",
  opdCheckUp: "",
  patientSign: "",
  patientSignDate: "",
  contactGlobe: "",
  contactSmart: "",
  drugs: Array(10)
    .fill(null)
    .map(() => ({
      name: "",
      morning: "",
      noon: "",
      afternoon: "",
      night: "",
      remark: "",
    })),
};

// mock data sa bulong
const MOCK_PHARMACY_DRUGS = [
  "0.9% Sodium Chloride (Collapsible), 1.00 Liter bag",
  "0.9% Sodium Chloride (Collapsible), 1.00 Liter bag, Euro Med",
  "0.9% Sodium Chloride Irrigation, 1.00 Liter bottle",
  "0.9% Sodium Chloride Solution, 1.00 Liter glass bottle",
  "0.9% Sodium Chloride Solution, 1.00 Liter plastic bottle",
  "0.9% Sodium Chloride Solution, 500.00 ml plastic bottle, Generic",
  "0.9% Sodium Chloride Solution, 500.00 ml glass bottle",
  "0.9% Sodium Chloride Solution, 50.00 ml bottle",
  "0.9% Sodium Chloride Solution, 100.00 ml bottle",
  "Acetazolamide, 250.00 mg tablet(s)",
  "Acetylcysteine, 600.00 mg tablet(s)",
  "Acetylcysteine, 200.00 mg sachet",
  "Acetylcysteine, 100.00 mg/5mL SUSPENSION, PCF",
  "Acetylcysteine, 100.00 mg SACHET, Fluimucil",
  "Acetylcysteine, 200.00 mg/ml 25ml vial",
  "Acetylcysteine, 100.00 mg/ml 3ml Ampule, PCF",
  "Aciclovir, 25.00 mg/ml, 10ml vial",
  "Aciclovir, 400.00 mg tablet(s)",
  "Aciclovir, 800.00 mg TABLET",
  "Acyclovir, 200.00 mg/5ml suspension",
  "Adenosine, 3.00 mg/ml 2ml Ampule"
];

const DispositionModule = () => {
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

  // main state
  const [activeTab, setActiveTab] = useState<"disposition" | "instruction" | null>(null);

  // Modal states
  const [showDisposeModal, setShowDisposeModal] = useState(false);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  
  // phrmacy modal states
  const [showPharmacyModal, setShowPharmacyModal] = useState(false);
  const [activeDrugRowIdx, setActiveDrugRowIdx] = useState<number | null>(null);
  const [pharmacySearchQuery, setPharmacySearchQuery] = useState("");

  // Data states
  const [dispositionData, setDispositionData] = useState<DispositionData | null>(null);
  const [instructionData, setInstructionData] = useState<InstructionData[]>([]);
  const [editingInstructionIdx, setEditingInstructionIdx] = useState<number | null>(null);

  const [dispForm, setDispForm] = useState<DispositionData>({
    typeOfDisposition: "Discharge",
    typeOfCondition: "",
    dateOfDischarge: "",
  });

  const [instActiveTab, setInstActiveTab] = useState<"instruction" | "drugs">("instruction");
  const [instForm, setInstForm] = useState<InstructionData>(
    JSON.parse(JSON.stringify(EMPTY_INSTRUCTION))
  );

  useEffect(() => {
    if (location.state?.selectedPatientId) {
      setTimeout(() => {}, 1500);
    }
  }, [location.state]);

  const handleSaveDisposition = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setDispositionData(dispForm);
    setShowDisposeModal(false);
  };

  const handleSaveInstruction = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Manual validation to prevent silent failures if on the "Drugs" tab
    if (!instForm.patientSign || !instForm.patientSignDate) {
      setInstActiveTab("instruction");
      setValidationMessage("Please fill out the required Patient/Rep Sign fields in the Instruction tab.");
      setShowValidationModal(true);
      return;
    }

    if (editingInstructionIdx !== null) {
      const updated = [...instructionData];
      updated[editingInstructionIdx] = JSON.parse(JSON.stringify(instForm));
      setInstructionData(updated);
      setEditingInstructionIdx(null);
    } else {
      setInstructionData([
        ...instructionData,
        JSON.parse(JSON.stringify(instForm)),
      ]);
    }
    setShowInstructionModal(false);
  };

  const handleOpenAddInstruction = () => {
    setInstForm(JSON.parse(JSON.stringify(EMPTY_INSTRUCTION)));
    setEditingInstructionIdx(null);
    setInstActiveTab("instruction");
    setShowInstructionModal(true);
  };

  const handleOpenEditInstruction = () => {
    if (instructionData.length > 0) {
      setInstForm(JSON.parse(JSON.stringify(instructionData[0])));
      setEditingInstructionIdx(0);
      setInstActiveTab("instruction");
      setShowInstructionModal(true);
    }
  };

  const handleOpenEditDisposition = () => {
    if (dispositionData) {
      setDispForm({ ...dispositionData });
      setShowDisposeModal(true);
    }
  };

  // phrmcy modal handlers ---
  const openPharmacyList = (rowIndex: number) => {
    setActiveDrugRowIdx(rowIndex);
    setPharmacySearchQuery("");
    setShowPharmacyModal(true);
  };

  const selectPharmacyDrug = (drugName: string) => {
    if (activeDrugRowIdx !== null) {
      updateDrugRow(activeDrugRowIdx, "name", drugName);
    }
    setShowPharmacyModal(false);
    setActiveDrugRowIdx(null);
  };

  const filteredPharmacyDrugs = MOCK_PHARMACY_DRUGS.filter((drug) =>
    drug.toLowerCase().includes(pharmacySearchQuery.toLowerCase())
  );

  // pag update form
  const handleDietChange = (key: string, field: "checked" | "details", value: any) => {
    setInstForm((prev) => ({
      ...prev,
      diet: {
        ...prev.diet,
        [key]: { ...prev.diet[key], [field]: value },
      },
    }));
  };

  const handleActivityChange = (key: string, field: "checked" | "details", value: any) => {
    setInstForm((prev) => ({
      ...prev,
      activity: {
        ...prev.activity,
        [key]: { ...prev.activity[key], [field]: value },
      },
    }));
  };

  const updateDrugRow = (index: number, field: keyof InstructionData["drugs"][0], value: string) => {
    const newDrugs = [...instForm.drugs];
    newDrugs[index] = { ...newDrugs[index], [field]: value };
    setInstForm({ ...instForm, drugs: newDrugs });
  };

  const setDispCurrentDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setDispForm({ ...dispForm, dateOfDischarge: now.toISOString().slice(0, 16) });
  };

  const formatDateTime = (dt: string) => {
    if (!dt) return "—";
    try {
      return new Date(dt).toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dt.replace("T", " ");
    }
  };

  const viewedInstruction = instructionData.length > 0 ? instructionData[0] : null;

  return (
    <>
      <style>
        {`
          .text-hover-primary:hover { color: var(--primary, #0f763f) !important; }
          .modal-table th, .modal-table td { vertical-align: middle; }

          /* Form Controls */
          .form-control-compact { padding: 2px 6px; font-size: 0.85rem; height: 28px; border: 1px solid #ced4da; border-radius: 2px; }
          .form-select-compact { padding: 2px 24px 2px 6px; font-size: 0.85rem; height: 28px; border: 1px solid #ced4da; border-radius: 2px; }

          /* Custom Tabs styling for the left sidebar */
          .custom-side-tab { transition: all 0.2s ease; border-left: 3px solid transparent; white-space: nowrap; }
          .custom-side-tab.active { background-color: #e9ecef; border-left-color: transparent; font-weight: 700; color: #333 !important; }
          .custom-side-tab:hover:not(.active) { background-color: #f1f3f5; }

          /* Responsive Internal Sidebar Tabs - Slimmer Fixes */
          .inner-tab-container { 
            display: flex; 
            flex-direction: row; 
            overflow-x: auto; 
            border-bottom: 1px solid #dee2e6; 
          }
          .inner-tab-container .custom-side-tab { 
            border-left: none; 
            border-bottom: 3px solid transparent; 
            text-align: center; 
          }
          .inner-tab-container .custom-side-tab.active { 
            border-left-color: transparent; 
            border-bottom-color: var(--primary, #0f763f); 
          }

          /* Sub-tabs for modals */
          .modal-sub-tabs { flex-wrap: nowrap; overflow-x: auto; white-space: nowrap; }
          .modal-sub-tabs .nav-link { border-radius: 0; color: #6c757d; font-weight: 600; padding: 0.75rem 1.5rem; }
          .modal-sub-tabs .nav-link.active { color: #212529; border-bottom: 2px solid var(--primary, #0f763f); background: transparent; }

          /* Instruction detail view */
          .inst-label { min-width: 140px; font-weight: 700; color: #212529; font-size: 0.875rem; }
          .inst-value-green { color: var(--primary, #0f763f); font-weight: 600; }
          .inst-checkbox { width: 14px; height: 14px; accent-color: var(--primary, #0f763f); flex-shrink: 0; }

          /* Pharmacy Hover effect */
          .pharmacy-item:hover { background-color: #b5e4d3; color: #000; cursor: pointer; }

          /* Table inputs minimum width */
          .min-w-drug { min-width: 400px; width: 45%; }
          .min-w-freq { min-width: 50px; width: 8%; }
          .min-w-rem { min-width: 150px; width: 23%; }

          /* Responsive adjustments */
          @media (max-width: 575.98px) {
            .modal-footer-actions { flex-direction: column-reverse; width: 100%; }
            .modal-footer-actions button { width: 100%; margin-top: 8px; }
            .inst-label { min-width: 100px; margin-bottom: 0.5rem; }
            .d-flex.mb-3 { flex-direction: column; }
          }

          @media (min-width: 768px) {
            .inner-tab-container { 
              flex-direction: column; 
              overflow-x: visible; 
              border-bottom: none; 
              border-right: 1px solid #dee2e6; 
              min-width: 180px; 
              height: 100%; 
            }
            .inner-tab-container .custom-side-tab { 
              border-bottom: none; 
              border-left: 3px solid transparent; 
              text-align: left; 
            }
            .inner-tab-container .custom-side-tab.active { 
              border-bottom-color: transparent; 
              border-left-color: var(--primary, #0f763f); 
            }
          }
        `}
      </style>

  

      <div className="content doctor-content bg-light mt-n4 d-flex flex-column" style={{ minHeight: "100vh" }}>
        <div className="container-fluid px-3 px-lg-5 pt-0 flex-grow-1 d-flex flex-column">
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
                {/* Patient Profile Header */}
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
                    <div className="text-muted small d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-start gap-2">
                      <div className="d-flex align-items-center gap-1">
                        <i className="isax isax-location text-danger" />
                        {mockPatientProfile.address}
                      </div>
                    </div>
                  </div>
                </div>

          

                {/* Toolbar */}
                <div className="d-flex flex-row flex-wrap justify-content-between align-items-center mb-3 gap-2">
                  <h5 className="fw-bold text-dark mb-0 text-uppercase text-nowrap" style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}>
                    Discharge Instructions
                  </h5>

                  <div className="d-flex flex-nowrap justify-content-end gap-2 ms-auto">
                    <button
                      onClick={() => {
                        if (activeTab === "disposition") setShowDisposeModal(true);
                        if (activeTab === "instruction") handleOpenAddInstruction();
                      }}
                      disabled={!activeTab}
                      className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-1 px-3 py-2 text-nowrap fw-bold ${
                        !activeTab ? "bg-light text-muted opacity-50" : "bg-white text-dark text-hover-primary"
                      }`}
                      style={{ borderRadius: "4px", cursor: activeTab ? "pointer" : "not-allowed" }}
                    >
                      <i className="isax isax-add"></i>
                      {activeTab === "disposition" ? "Dispose" : activeTab === "instruction" ? "Add Instr" : "Add"}
                    </button>

                    <button
                      className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-1 px-3 py-2 text-nowrap fw-bold ${
                        (activeTab === "instruction" && instructionData.length === 0) ||
                        (activeTab === "disposition" && !dispositionData) ||
                        !activeTab
                          ? "bg-light text-muted opacity-50"
                          : "bg-white text-dark text-hover-primary"
                      }`}
                      style={{
                        borderRadius: "4px",
                        cursor:
                          (activeTab === "instruction" && instructionData.length > 0) ||
                          (activeTab === "disposition" && dispositionData)
                            ? "pointer"
                            : "not-allowed",
                      }}
                      disabled={
                        !activeTab ||
                        (activeTab === "instruction" && instructionData.length === 0) ||
                        (activeTab === "disposition" && !dispositionData)
                      }
                      onClick={() => {
                        if (activeTab === "instruction") handleOpenEditInstruction();
                        if (activeTab === "disposition") handleOpenEditDisposition();
                      }}
                    >
                      <i className="isax isax-edit-2"></i> Edit {activeTab === "disposition" ? "Disp" : ""}
                    </button>
                  </div>
                </div>

                {/* Main Content Layout */}
                <div
                  className="d-flex flex-column flex-md-row flex-grow-1 overflow-hidden border rounded"
                  style={{ minHeight: "450px", backgroundColor: "#e2e5e9" }}
                >
                  {/* Sidebar / Topbar Tabs */}
                  <div className="bg-light inner-tab-container">
                    <button
                      className={`btn px-3 py-2 border-0 rounded-0 custom-side-tab ${
                        activeTab === "disposition" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("disposition")}
                      style={{ fontSize: "0.85rem" }}
                    >
                      Disposition
                    </button>
                    <button
                      className={`btn px-3 py-2 border-0 rounded-0 custom-side-tab ${
                        activeTab === "instruction" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("instruction")}
                      style={{ fontSize: "0.85rem" }}
                    >
                      Discharge Instruction
                    </button>
                  </div>

                  {/* rght content area */}
                  <div className="flex-grow-1 bg-white d-flex flex-column overflow-hidden overflow-y-auto w-100">
                    {!activeTab && (
                      <div className="text-center text-muted py-5 d-flex flex-column align-items-center justify-content-center h-100">
                        <i className="isax isax-mouse-circle mb-3 opacity-50" style={{ fontSize: "3rem" }}></i>
                        <h6 className="fw-bold mb-1">Select a category</h6>
                        <p className="small mb-0">Please select a tab from the menu to view records.</p>
                      </div>
                    )}

                    {/* dispo tab*/}
                    {activeTab === "disposition" && (
                      <div className="p-4 bg-white h-100">
                        {!dispositionData ? (
                          <div className="text-center text-muted py-5 d-flex flex-column align-items-center justify-content-center h-100">
                            <i className="isax isax-folder-open mb-3 opacity-50 d-block" style={{ fontSize: "3rem" }}></i>
                            <h6 className="fw-bold mb-1">No disposition set.</h6>
                            <p className="small mb-0">Click <strong className="text-dark">Dispose</strong> in the toolbar above to set one.</p>
                          </div>
                        ) : (
                          <div className="container-fluid px-0" style={{ maxWidth: "850px" }}>
                            <h6 className="fw-bold text-dark border-bottom pb-2 mb-3" style={{ fontSize: "0.95rem" }}>
                              Disposition and Condition
                            </h6>
                            <div className="row g-4 mb-5" style={{ maxWidth: "600px" }}>
                              <div className="col-12 col-md-6">
                                <div className="text-dark small mb-1">Type of Disposition</div>
                                <div className="border px-3 py-1 bg-white" style={{ borderColor: "#888", color: "#1976d2", minHeight: "32px", fontSize: "0.9rem" }}>
                                  {dispositionData.typeOfDisposition}
                                </div>
                              </div>
                              <div className="col-12 col-md-6">
                                <div className="text-dark small mb-1">Type of Condition</div>
                                <div className="border px-3 py-1 bg-white" style={{ borderColor: "#888", color: "#1976d2", minHeight: "32px", fontSize: "0.9rem" }}>
                                  {dispositionData.typeOfCondition || "\u00A0"}
                                </div>
                              </div>
                            </div>
                            <h6 className="fw-bold text-dark border-bottom pb-2 mb-3 mt-4" style={{ fontSize: "0.95rem" }}>
                              Date of Discharge (for Nurse on Duty)
                            </h6>
                            <div className="row g-4">
                              <div className="col-12 col-md-5 col-lg-4">
                                <div className="border px-3 py-2 bg-white text-center fw-medium text-dark" style={{ borderColor: "#888", fontSize: "0.9rem" }}>
                                  {dispositionData.dateOfDischarge ? formatDateTime(dispositionData.dateOfDischarge) : "00-00-0000 00:00 AM"}
                                </div>
                              </div>
                              <div className="col-12 col-md-7 col-lg-8">
                                <p className="text-dark small mb-3 lh-base">
                                  Date of discharge is intended to be entered by Nurse using Nurse Module when patient is ready to leave the hospital. This field is made available here for reference, editing and CF4 compliance purpose.
                                </p>
                                <p className="text-dark small mb-0 lh-base">
                                  Setting Date and Time of Discharge will render this record inactive and secured. Other module will no longer be able to make alteration to it.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* discharge intruct tab, doc view */}
                    {activeTab === "instruction" && (
                      <>
                        {!viewedInstruction ? (
                          <div className="text-center text-muted py-5 d-flex flex-column align-items-center justify-content-center h-100">
                            <i className="isax isax-folder-open mb-3 opacity-50" style={{ fontSize: "3rem" }}></i>
                            <h6 className="fw-bold mb-1">No discharge instructions recorded.</h6>
                            <p className="small mb-0">Click <strong className="text-dark">Add Instr</strong> in the toolbar above.</p>
                          </div>
                        ) : (
                          <div className="p-3 p-md-4" style={{ fontSize: "0.875rem", lineHeight: "1.9" }}>
                            
                            {/* sa diet */}
                            <div className="d-flex mb-3 flex-column flex-sm-row">
                              <div className="inst-label me-sm-4">Diet</div>
                              <div>
                                {Object.entries(viewedInstruction.diet).map(([key, val]) => (
                                  <div key={key} className="d-flex align-items-center gap-2 mb-1">
                                    <input type="checkbox" className="inst-checkbox" checked={val.checked} readOnly />
                                    <span className={val.checked ? "text-dark" : "text-muted"}>{key}</span>
                                    {val.checked && val.details && <span className="fw-bold text-dark ms-3">{val.details.toUpperCase()}</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* sa acts */}
                            <div className="d-flex mb-3 flex-column flex-sm-row">
                              <div className="inst-label me-sm-4">Activity</div>
                              <div>
                                {Object.entries(viewedInstruction.activity).map(([key, val]) => (
                                  <div key={key} className="d-flex align-items-center gap-2 mb-1">
                                    <input type="checkbox" className="inst-checkbox" checked={val.checked} readOnly />
                                    <span className={val.checked ? "text-dark" : "text-muted"}>{key}</span>
                                    {val.checked && val.details && <span className="fw-bold text-dark ms-3">{val.details.toUpperCase()}</span>}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* sa medecines */}
                            {(() => {
                              const filled = viewedInstruction.drugs.filter((d) => d.name.trim() !== "");
                              if (filled.length === 0) return null;
                              return (
                                <div className="mb-3">
                                  <div className="fw-bold text-dark border-bottom pb-1 mb-2">Medicines</div>
                                  <div className="table-responsive">
                                    <table className="table table-sm mb-0" style={{ fontSize: "0.82rem", minWidth: "600px" }}>
                                      <thead>
                                        <tr>
                                          <th rowSpan={2} className="border py-1 px-2 text-dark fw-semibold bg-light" style={{ width: "40%" }}>Drug Description</th>
                                          <th colSpan={4} className="border py-1 px-2 text-dark fw-semibold text-center bg-light">AM</th>
                                          <th rowSpan={2} className="border py-1 px-2 text-dark fw-semibold bg-light">Remarks</th>
                                        </tr>
                                        <tr>
                                          <th className="border py-1 px-2 text-dark fw-semibold text-center bg-light" style={{ width: "9%" }}>AM</th>
                                          <th className="border py-1 px-2 text-dark fw-semibold text-center bg-light" style={{ width: "9%" }}>Noon</th>
                                          <th className="border py-1 px-2 text-dark fw-semibold text-center bg-light" style={{ width: "9%" }}>PM</th>
                                          <th className="border py-1 px-2 text-dark fw-semibold text-center bg-light" style={{ width: "9%" }}>Night</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {filled.map((drug, idx) => (
                                          <tr key={idx}>
                                            <td className="border py-1 px-2 text-wrap">{drug.name}</td>
                                            <td className="border py-1 px-2 text-center">{drug.morning || ""}</td>
                                            <td className="border py-1 px-2 text-center">{drug.noon || ""}</td>
                                            <td className="border py-1 px-2 text-center">{drug.afternoon || ""}</td>
                                            <td className="border py-1 px-2 text-center">{drug.night || ""}</td>
                                            <td className="border py-1 px-2">{drug.remark || ""}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              );
                            })()}
                            
                            <div className="d-flex align-items-start border-top pt-3 mb-3 flex-column flex-sm-row">
                              <div className="inst-label me-sm-3">Special Instruction</div>
                              <span className="inst-value-green">{viewedInstruction.specialInstruction || "—"}</span>
                            </div>
                            
                            <div className="d-flex align-items-center border-top pt-3 mb-3 flex-column flex-sm-row align-items-sm-center">
                              <div className="inst-label me-sm-3 w-100 w-sm-auto mb-2 mb-sm-0">OPD Checkup</div>
                              <span className="inst-value-green w-100 w-sm-auto">{viewedInstruction.opdCheckUp ? formatDateTime(viewedInstruction.opdCheckUp) : "—"}</span>
                            </div>
                        
<div className="border-top pt-3 mb-3">
  <div className="fw-bold text-dark mb-3">Signatories</div>
  <div className="d-flex flex-column flex-sm-row justify-content-between flex-wrap gap-4">


<div style={{ minWidth: "180px" }}>
  <div className="text-dark fw-semibold mb-2" style={{ minHeight: "1.4rem", fontSize: "0.875rem" }}>&nbsp;</div>
  <div className="border-top pt-1">
    <div className="text-dark small" style={{ fontSize: "0.875rem" }}>Attending / Resident-In-Charge</div>
    <div className="text-muted" style={{ fontSize: "0.875rem" }}>01-01-1900</div>
  </div>
</div>


<div className="mt-2 mt-sm-0" style={{ minWidth: "180px" }}>  {/* ← removed text-sm-end */}
  <div className="inst-value-green fw-semibold mb-2" style={{ fontSize: "0.875rem" }}>{viewedInstruction.patientSign || "—"}</div>
  <div className="border-top pt-1">
    <div className="text-dark" style={{ fontSize: "0.875rem" }}>Patient/Representative</div>
    {viewedInstruction.patientSignDate && (
      <div className="text-muted" style={{ fontSize: "0.875rem" }}>{formatDateTime(viewedInstruction.patientSignDate)}</div>
    )}
  </div>
</div>

  </div>
</div>
                        
                            <div className="d-flex align-items-start border-top pt-3 flex-column flex-sm-row">
                              <div className="inst-label me-sm-3">Contact Number</div>
                              <div className="d-flex gap-5 flex-wrap">
                                <div><div className="text-dark">{viewedInstruction.contactGlobe || "0000-000-0000"}</div><div className="text-muted small">Globe</div></div>
                                <div><div className="text-dark">{viewedInstruction.contactSmart || "—"}</div><div className="text-muted small">Smart/Sun</div></div>
                              </div>
                            </div>

                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {showDisposeModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}>
          <div className="modal-dialog modal-lg modal-fullscreen-md-down modal-dialog-centered px-0 px-md-2">
            <div className="modal-content shadow-lg border-0 rounded-1 overflow-hidden bg-white h-100">
              <div className="modal-header border-0 py-3 d-flex align-items-center" style={{ backgroundColor: "#333b45" }}>
                <h5 className="modal-title text-white fw-bold m-0 d-flex align-items-center gap-2" style={{ fontSize: "1.1rem" }}>
                  <i className="isax isax-edit-2" style={{ fontSize: "1.5rem" }}></i> SET DISPOSITION
                </h5>
                <button type="button" className="btn-close btn-close-white shadow-none" onClick={() => setShowDisposeModal(false)}></button>
              </div>
              <form onSubmit={handleSaveDisposition} className="d-flex flex-column h-100 mb-0">
                <div className="modal-body p-3 p-md-4 bg-light">
                  <div className="card border-0 shadow-sm mb-0">
                    <div className="card-body p-3 p-md-4">
                      <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Disposition and Condition</h6>
                      <div className="row g-3 mb-4">
                        <div className="col-12 col-md-6">
                          <label className="form-label text-muted small fw-bold">
                            Type of Disposition <span className="text-danger">*</span>
                          </label>
                          <select required className="form-select shadow-none" style={{ borderColor: "var(--primary, #0f763f)" }} value={dispForm.typeOfDisposition} onChange={(e) => setDispForm({ ...dispForm, typeOfDisposition: e.target.value })}>
                            <option value="">Select Disposition...</option>
                            <option>Absconded</option><option>Died</option><option>Discharge</option><option>Discharge Against Medl. Advise</option><option>Transferred</option>
                          </select>
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="form-label text-muted small fw-bold">
                            Type of Condition <span className="text-danger">*</span>
                          </label>
                          <select required className="form-select shadow-none" style={{ borderColor: "var(--primary, #0f763f)" }} value={dispForm.typeOfCondition} onChange={(e) => setDispForm({ ...dispForm, typeOfCondition: e.target.value })}>
                            <option value="">Select Condition...</option>
                            <option>Expired</option><option>Improved</option><option>Recovered</option><option>Unimproved</option>
                          </select>
                        </div>
                      </div>
                      <h6 className="fw-bold text-dark border-bottom pb-2 mb-3 mt-4">Date of Discharge (for Nurse on Duty)</h6>
                      <div className="row g-4">
                        <div className="col-12 col-md-5">
                          <label className="form-label text-muted small fw-bold d-none">Date <span className="text-danger">*</span></label>
                          <input required type="datetime-local" className="form-control shadow-none mb-2" style={{ borderColor: "var(--primary, #0f763f)" }} value={dispForm.dateOfDischarge} onChange={(e) => setDispForm({ ...dispForm, dateOfDischarge: e.target.value })} />
                          <button type="button" className="btn btn-outline-secondary w-100 fw-medium" onClick={setDispCurrentDate}>Set Current Date</button>
                        </div>
                        <div className="col-12 col-md-7">
                          <p className="text-muted small mb-2">Date of discharge is intended to be entered by Nurse using the Nurse Module when patient is ready to leave the hospital.</p>
                          <p className="text-muted small mb-0">Setting the Date and Time of Discharge will render this record inactive and inaccessible in other module.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-3 justify-content-end mt-auto" style={{ backgroundColor: "#e2e5e9" }}>
                  <div className="d-flex modal-footer-actions gap-2 w-100 justify-content-sm-end">
                    <button type="submit" className="btn rounded-1 px-5 py-2 fw-medium shadow-sm text-white" style={{ backgroundColor: "var(--primary, #0f763f)", cursor: "pointer" }}>SAVE</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showInstructionModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}>
          <div className="modal-dialog modal-xl modal-fullscreen-lg-down modal-dialog-centered px-0 px-md-2">
            <div className="modal-content shadow-lg border-0 rounded-1 overflow-hidden bg-white h-100">
              <div className="modal-header border-0 py-3 d-flex align-items-center" style={{ backgroundColor: "#333b45" }}>
                <h5 className="modal-title text-white fw-bold m-0 d-flex align-items-center gap-2 text-truncate" style={{ fontSize: "1.1rem" }}>
                  <i className="isax isax-document-text" style={{ fontSize: "1.5rem" }}></i>
                  {editingInstructionIdx !== null ? "EDIT INSTRUCTION" : "NEW INSTRUCTION"}
                </h5>
                <button type="button" className="btn-close btn-close-white shadow-none flex-shrink-0" onClick={() => { setShowInstructionModal(false); setEditingInstructionIdx(null); }}></button>
              </div>

              <ul className="nav nav-tabs modal-sub-tabs bg-light px-3 pt-2 border-bottom-0">
                <li className="nav-item">
                  <button className={`nav-link border-top-0 border-start-0 border-end-0 ${instActiveTab === "instruction" ? "active" : ""}`} onClick={() => setInstActiveTab("instruction")}>
                    Instruction
                  </button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link border-top-0 border-start-0 border-end-0 ${instActiveTab === "drugs" ? "active" : ""}`} onClick={() => setInstActiveTab("drugs")}>
                    Drugs and Medicine
                  </button>
                </li>
              </ul>

              <form onSubmit={handleSaveInstruction} className="d-flex flex-column mb-0 flex-grow-1 overflow-hidden">
                <div className="modal-body p-0 bg-white flex-grow-1" style={{ minHeight: "50vh", overflowY: "auto" }}>
                  {instActiveTab === "instruction" && (
                    <div className="p-3 p-md-4 container-fluid">
                      <div className="row mb-4">
                        <div className="col-12 col-md-3 col-lg-2 fw-bold text-dark text-md-end mt-1 mb-2 mb-md-0">Diet</div>
                        <div className="col-12 col-md-9 col-lg-10">
                          {Object.keys(instForm.diet).map((dietKey) => (
                          <div key={dietKey} className="d-flex align-items-center mb-2">
                            <div className="form-check" style={{ width: "160px", flexShrink: 0 }}>
                              <input
                                className="form-check-input shadow-none"
                                type="checkbox"
                                id={`diet-${dietKey}`}
                                style={{ borderColor: "var(--primary, #0f763f)" }}
                                checked={instForm.diet[dietKey].checked}
                                onChange={(e) => handleDietChange(dietKey, "checked", e.target.checked)}
                              />
                              <label className="form-check-label text-dark" htmlFor={`diet-${dietKey}`}>{dietKey}</label>
                            </div>
                            {instForm.diet[dietKey].checked && (
                              <input
                                type="text"
                                className="form-control form-control-sm shadow-none flex-grow-1 text-uppercase"
                                style={{ borderColor: "var(--primary, #0f763f)" }}
                                value={instForm.diet[dietKey].details}
                                onChange={(e) => handleDietChange(dietKey, "details", e.target.value.toUpperCase())}
                                autoFocus
                              />
                            )}
                          </div>
                        ))}
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col-12 col-md-3 col-lg-2 fw-bold text-dark text-md-end mt-1 mb-2 mb-md-0">Activity</div>
                        <div className="col-12 col-md-9 col-lg-10">
                         {Object.keys(instForm.activity).map((actKey) => (
                          <div key={actKey} className="d-flex align-items-center mb-2">
                            <div className="form-check" style={{ width: "160px", flexShrink: 0 }}>
                              <input
                                className="form-check-input shadow-none"
                                type="checkbox"
                                id={`act-${actKey}`}
                                style={{ borderColor: "var(--primary, #0f763f)" }}
                                checked={instForm.activity[actKey].checked}
                                onChange={(e) => handleActivityChange(actKey, "checked", e.target.checked)}
                              />
                              <label className="form-check-label text-dark" htmlFor={`act-${actKey}`}>{actKey}</label>
                            </div>
                            {instForm.activity[actKey].checked && (
                              <input
                                type="text"
                                className="form-control form-control-sm shadow-none flex-grow-1 text-uppercase"
                                style={{ borderColor: "var(--primary, #0f763f)" }}
                                value={instForm.activity[actKey].details}
                                onChange={(e) => handleActivityChange(actKey, "details", e.target.value.toUpperCase())}
                              />
                            )}
                          </div>
                        ))}
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col-12 col-md-3 col-lg-2 fw-bold text-dark text-md-end mt-1 mb-2 mb-md-0">Special Instruction</div>
                        <div className="col-12 col-md-9 col-lg-10"><textarea className="form-control shadow-none text-uppercase" rows={3} style={{ borderColor: "var(--primary, #0f763f)" }} value={instForm.specialInstruction} onChange={(e) => setInstForm({ ...instForm, specialInstruction: e.target.value.toUpperCase() })}></textarea></div>
                      </div>
                      <div className="row mb-4 align-items-center">
                        <div className="col-12 col-md-3 col-lg-2 fw-bold text-dark text-md-end mb-2 mb-md-0">OPD Check Up</div>
                        <div className="col-12 col-md-6 col-lg-4"><input type="datetime-local" className="form-control form-control-sm shadow-none" style={{ borderColor: "var(--primary, #0f763f)" }} value={instForm.opdCheckUp} onChange={(e) => setInstForm({ ...instForm, opdCheckUp: e.target.value })} /></div>
                      </div>
                      
                
                      <div className="row mb-4">
                        <div className="col-12 col-md-3 col-lg-2 fw-bold text-dark text-md-end mt-1 mb-2 mb-md-0">Patient/Rep Sign</div>
                        <div className="col-12 col-md-9 col-lg-10">
                          <div className="d-flex flex-column gap-2" style={{ maxWidth: "350px" }}>
                            <div className="position-relative">
                              <input 
                                required 
                                type="text" 
                                className="form-control form-control-sm shadow-none text-uppercase" 
                                style={{ borderColor: "#ced4da", paddingRight: "40px" }} 
                                value={instForm.patientSign} 
                                onChange={(e) => setInstForm({ ...instForm, patientSign: e.target.value.toUpperCase() })} 
                              />
                              <button
                                type="button"
                                className="btn position-absolute top-50 end-0 translate-middle-y border-0 p-0 px-2 text-muted"
                                onClick={() => {
                                  const { firstName, middleName, lastName } = mockPatientProfile;
                                  const mi = middleName ? `${middleName.charAt(0)}.` : "";
                                  setInstForm({ ...instForm, patientSign: `${firstName} ${mi} ${lastName}`.trim().toUpperCase() });
                                }}
                                title="Auto-fill patient name"
                                style={{ zIndex: 5 }}
                              >
                                <i className="isax isax-user text-secondary" style={{ fontSize: "22px" }}></i>
                              </button>
                            </div>
                            <div>
                              <input 
                                required 
                                type="datetime-local" 
                                className="form-control form-control-sm shadow-none" 
                                style={{ borderColor: "#ced4da" }} 
                                value={instForm.patientSignDate} 
                                onChange={(e) => setInstForm({ ...instForm, patientSignDate: e.target.value })} 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                 
                      <div className="row mb-2">
                        <div className="col-12 col-md-3 col-lg-2 fw-bold text-dark text-md-end mt-1 mb-2 mb-md-0">Contact Number</div>
                        <div className="col-12 col-md-9 col-lg-10">
                          <div className="row g-3">
                            <div className="col-12 col-sm-6">
                              <label className="form-label text-muted small fw-bold">Globe</label>
                              <input 
                                type="number" 
                                className="form-control form-control-sm shadow-none text-uppercase" 
                                style={{ borderColor: "var(--primary, #0f763f)" }} 
                                placeholder="0000-000-0000" 
                                value={instForm.contactGlobe} 
                                onChange={(e) => setInstForm({ ...instForm, contactGlobe: e.target.value.toUpperCase() })} 
                              />
                            </div>
                            <div className="col-12 col-sm-6">
                              <label className="form-label text-muted small fw-bold">Smart/Sun</label>
                              <input 
                                type="number" 
                                className="form-control form-control-sm shadow-none text-uppercase" 
                                style={{ borderColor: "var(--primary, #0f763f)" }} 
                                placeholder="0000-000-0000" 
                                value={instForm.contactSmart} 
                                onChange={(e) => setInstForm({ ...instForm, contactSmart: e.target.value.toUpperCase() })} 
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {instActiveTab === "drugs" && (
                    <div className="table-responsive h-100">
                      <table className="table modal-table bg-white mb-0 w-100 border-0" style={{ tableLayout: "auto", minWidth: "800px" }}>
                        <thead style={{ backgroundColor: "#f8f9fa", position: "sticky", top: 0, zIndex: 1 }}>
                          <tr>
                            <th className="border py-2 px-2 text-dark fw-semibold text-center min-w-drug" rowSpan={2} style={{ fontSize: "0.82rem" }}>Drugs | Medicine</th>
                            <th className="border py-2 px-2 text-dark fw-semibold text-center" colSpan={4} style={{ fontSize: "0.82rem" }}>Frequency</th>
                            <th className="border py-2 px-2 text-dark fw-semibold text-center min-w-rem" rowSpan={2} style={{ fontSize: "0.82rem" }}>Remark</th>
                          </tr>
                          <tr>
                            <th className="border py-1 px-1 text-dark fw-semibold text-center min-w-freq" style={{ fontSize: "0.78rem" }}>Morning</th>
                            <th className="border py-1 px-1 text-dark fw-semibold text-center min-w-freq" style={{ fontSize: "0.78rem" }}>Noon</th>
                            <th className="border py-1 px-1 text-dark fw-semibold text-center min-w-freq" style={{ fontSize: "0.78rem" }}>Afternoon</th>
                            <th className="border py-1 px-1 text-dark fw-semibold text-center min-w-freq" style={{ fontSize: "0.78rem" }}>Night</th>
                          </tr>
                        </thead>
                        <tbody>
                          {instForm.drugs.map((drug, idx) => (
                            <tr key={idx} style={{ height: "32px" }}>
                              <td className="p-0 border align-middle min-w-drug">
                                <div className="d-flex h-100 align-items-stretch">
                                  <input
                                    type="text"
                                    className="form-control border-0 rounded-0 shadow-none px-2 py-1 flex-grow-1 bg-white text-dark text-truncate"
                                    style={{ fontSize: "0.82rem", height: "32px", cursor: "pointer" }}
                                    value={drug.name}
                                    placeholder="Click icon to select..."
                                    readOnly
                                    onClick={() => openPharmacyList(idx)}
                                  />
                                  <button
                                    type="button"
                                    className="btn border-0 border-start bg-white text-muted px-2 flex-shrink-0 d-flex align-items-center justify-content-center rounded-0 text-hover-primary"
                                    style={{ fontSize: "0.75rem", minWidth: "32px", height: "32px" }}
                                    onClick={() => openPharmacyList(idx)}
                                  >
                                    &#8801;
                                  </button>
                                </div>
                              </td>
                              <td className="p-0 border align-middle min-w-freq"><input type="text" className="form-control border-0 rounded-0 shadow-none text-center py-1 w-100 text-uppercase" style={{ fontSize: "0.82rem", height: "32px" }} value={drug.morning} onChange={(e) => updateDrugRow(idx, "morning", e.target.value.toUpperCase())} /></td>
                              <td className="p-0 border align-middle min-w-freq"><input type="text" className="form-control border-0 rounded-0 shadow-none text-center py-1 w-100 text-uppercase" style={{ fontSize: "0.82rem", height: "32px" }} value={drug.noon} onChange={(e) => updateDrugRow(idx, "noon", e.target.value.toUpperCase())} /></td>
                              <td className="p-0 border align-middle min-w-freq"><input type="text" className="form-control border-0 rounded-0 shadow-none text-center py-1 w-100 text-uppercase" style={{ fontSize: "0.82rem", height: "32px" }} value={drug.afternoon} onChange={(e) => updateDrugRow(idx, "afternoon", e.target.value.toUpperCase())} /></td>
                              <td className="p-0 border align-middle min-w-freq"><input type="text" className="form-control border-0 rounded-0 shadow-none text-center py-1 w-100 text-uppercase" style={{ fontSize: "0.82rem", height: "32px" }} value={drug.night} onChange={(e) => updateDrugRow(idx, "night", e.target.value.toUpperCase())} /></td>
                              <td className="p-0 border align-middle min-w-rem"><input type="text" className="form-control border-0 rounded-0 shadow-none py-1 px-2 w-100 text-uppercase" style={{ fontSize: "0.82rem", height: "32px" }} value={drug.remark} onChange={(e) => updateDrugRow(idx, "remark", e.target.value.toUpperCase())} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <div className="modal-footer border-0 p-3 justify-content-end mt-auto flex-shrink-0" style={{ backgroundColor: "#e2e5e9" }}>
                  <div className="d-flex modal-footer-actions gap-2 w-100 justify-content-sm-end">
                    <button type="submit" className="btn rounded-1 px-5 py-2 fw-medium shadow-sm text-white" style={{ backgroundColor: "var(--primary, #0f763f)" }}>SAVE</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showPharmacyModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1070 }}>
          <div className="modal-dialog modal-dialog-centered modal-md px-2">
            <div className="modal-content shadow-lg border-0 rounded-1 overflow-hidden bg-white">
              
              {/* Header */}
              <div className="modal-header border-0 py-2 d-flex align-items-center" style={{ backgroundColor: "#f0f0f0" }}>
                <h6 className="modal-title fw-bold text-dark m-0 d-flex align-items-center gap-2" style={{ fontSize: "0.9rem" }}>
                  <ImageWithBasePath src="assets/img/icons/pharmacy-icon.png" alt="" style={{ width: "16px", height: "16px" }} className="fallback-icon" /> 
                  Pharmacy Drugs List
                </h6>
                <button type="button" className="btn-close shadow-none" style={{ fontSize: "0.7rem" }} onClick={() => setShowPharmacyModal(false)}></button>
              </div>

              {/* Search Bar Area */}
              <div className="p-2 border-bottom bg-white d-flex align-items-center gap-2">
                <input 
                  type="text" 
                  className="form-control form-control-sm shadow-none border-secondary flex-grow-1"
                  autoFocus
                  value={pharmacySearchQuery}
                  onChange={(e) => setPharmacySearchQuery(e.target.value)}
                />
                <span className="text-dark small fw-medium text-nowrap">Find Item</span>
              </div>

              {/* List Area */}
              <div className="modal-body p-0" style={{ maxHeight: "400px", overflowY: "auto" }}>
                {filteredPharmacyDrugs.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {filteredPharmacyDrugs.map((drug, index) => (
                      <li 
                        key={index} 
                        className="list-group-item list-group-item-action border-bottom-0 py-2 px-3 pharmacy-item text-dark"
                        style={{ fontSize: "0.85rem" }}
                        onClick={() => selectPharmacyDrug(drug)}
                      >
                        {drug}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-muted small">
                    No medicines found.
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL: VALIDATION ALERT
      ========================================= */}
      {showValidationModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1080 }}>
          <div className="modal-dialog modal-dialog-centered modal-sm px-2">
            <div className="modal-content shadow-lg border-0 rounded-1 overflow-hidden bg-white">
              <div className="modal-header border-0 py-2 d-flex align-items-center" style={{ backgroundColor: "#dc3545" }}>
                <h6 className="modal-title fw-bold text-white m-0 d-flex align-items-center gap-2" style={{ fontSize: "0.95rem" }}>
                  <i className="isax isax-warning-2"></i> Validation Error
                </h6>
                <button type="button" className="btn-close btn-close-white shadow-none" style={{ fontSize: "0.7rem" }} onClick={() => setShowValidationModal(false)}></button>
              </div>
              <div className="modal-body p-4 text-center">
                <p className="mb-0 text-dark fw-medium" style={{ fontSize: "0.9rem" }}>{validationMessage}</p>
              </div>
              <div className="modal-footer border-0 p-2 justify-content-center" style={{ backgroundColor: "#f8f9fa" }}>
                <button type="button" className="btn btn-sm px-4 fw-bold text-white shadow-sm" style={{ backgroundColor: "#dc3545", borderRadius: "4px" }} onClick={() => setShowValidationModal(false)}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default DispositionModule;