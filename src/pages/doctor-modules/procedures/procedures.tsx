import React, { useEffect, useState } from "react";
import DoctorSidebar from "@/components/custom-sidebar/doctorSidebar";
import ImageWithBasePath from "@/components/image-with-base-path";
import { useLocation } from "react-router";

const ProcedureAndComplication = () => {
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
  const [activeTab, setActiveTab] = useState<"procedure" | "complication">("procedure");
  
  const [savedData, setSavedData] = useState({
    procedure: "",
    complication: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);

  useEffect(() => {
    if (location.state?.selectedPatientId) {
      setTimeout(() => {}, 1500);
    }
  }, [location.state]);

const currentData = savedData[activeTab];
const hasData = currentData.trim().length > 0;
const isEmpty = !hasData;
  
  // --- Handlers ---
  const handleTabSwitch = (tab: "procedure" | "complication") => {
    if (isEditing) return; // pag prevent sa tab switching while editing para ma avoid mawala ung data
    setActiveTab(tab);
  };

  const handleAdd = () => {
    setTempText("");
    setIsEditing(true);
  };

  const handleEdit = () => {
    setTempText(savedData[activeTab]);
    setIsEditing(true);
  };

  const handleSave = () => {
  setSavedData((prev) => ({
    ...prev,
    [activeTab]: tempText,
  }));

  setIsEditing(false);

  if (window.innerWidth < 992) {
    setShowMobileActions(false);
  }
};

  const handleCancel = () => {
  setTempText("");
  setIsEditing(false);

  if (window.innerWidth < 992) {
    setShowMobileActions(false);
  }
};

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setSavedData((prev) => ({
      ...prev,
      [activeTab]: "",
    }));
    setShowDeleteModal(false);
    setIsEditing(false);
  };

  return (
    <>
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
          .hide-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
          .hide-scrollbar { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
          .text-hover-primary:hover { color: var(--primary, #0f763f) !important; }
          
          /* Custom Tabs to match table header feel */
          .content-tab {
            background-color: transparent;
            border: none;
            padding: 12px 24px;
            font-size: 0.9rem;
            font-weight: 600;
            color: #6c757d;
            border-bottom: 3px solid transparent;
            transition: all 0.2s;
          }
          .content-tab.active {
            color: var(--primary, #0f763f);
            border-bottom-color: var(--primary, #0f763f);
            background-color: #ffffff;
          }
          .content-tab:disabled {
            opacity: 0.5;
            cursor: not-allowed;
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
        `}

        
      </style>


      <div className="content doctor-content bg-light mt-n4 d-flex flex-column" style={{ minHeight: "100vh" }}>
        <div className="container-fluid px-3 px-lg-5 pt-0 flex-grow-1 d-flex flex-column">
                <div className="doctor-dashboard-layout">
                  <DoctorSidebar />

                 <div className="doctor-dashboard-main">
              <div className="card border-0 shadow-sm p-3 p-md-4 mb-4 d-flex flex-column flex-grow-1" style={{ borderRadius: "12px", borderTop: "4px solid var(--primary, #0f763f)" }}>
                
                <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3 gap-md-4 mb-4 pb-4 border-bottom text-center text-md-start">
                  <div className="rounded-circle d-flex align-items-center justify-content-center bg-light shadow-sm flex-shrink-0" style={{ width: "90px", height: "90px", border: "2px solid var(--primary, #0f763f)" }}>
                    <i className="isax isax-user fs-1 text-primary" style={{ color: "var(--primary, #0f763f)" }} />
                  </div>
                  <div>
                    <div className="badge bg-light text-secondary border mb-2 px-2 py-1">ID: {mockPatientProfile.hospitalNumber}</div>
                    <h3 className="fw-bold mb-1 text-dark fs-3 fs-md-2">
                      {mockPatientProfile.lastName}, {mockPatientProfile.firstName} {mockPatientProfile.middleName}
                    </h3>
                    <div className="text-muted small d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                      <i className="isax isax-location text-danger" />
                      {mockPatientProfile.address}
                    </div>
                  </div>
                </div>

               

                {/* main content area */}
                <div className="d-flex flex-column flex-grow-1 mb-4">
                  
                  <div
  className={`
    flex-wrap justify-content-center justify-content-md-end pb-1 pb-lg-0 ms-md-auto
    d-lg-flex
    ${showMobileActions ? "d-flex" : "d-none d-lg-flex"}
    ${isEmpty && !showMobileActions ? "d-none d-lg-flex" : ""}
  `}
  style={{ gap: "6px" }}
>
  <button 
    onClick={handleAdd} 
    disabled={isEditing || hasData}
    className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap flex-grow-1 flex-md-grow-0 ${
      (isEditing || hasData)
        ? 'bg-light text-muted opacity-50'
        : 'bg-white text-dark fw-bold text-hover-primary'
    }`}
    style={{
      borderRadius: "4px",
      cursor: (isEditing || hasData) ? "not-allowed" : "pointer"
    }}
  >
    <i className="isax isax-add-square"></i>
    <span>Add</span>
  </button>

  <button 
    onClick={handleEdit} 
    disabled={isEditing || !hasData}
    className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap flex-grow-1 flex-md-grow-0 ${
      (isEditing || !hasData)
        ? 'bg-light text-muted opacity-50'
        : 'bg-white text-dark fw-bold text-hover-primary'
    }`}
    style={{
      borderRadius: "4px",
      cursor: (isEditing || !hasData) ? "not-allowed" : "pointer"
    }}
  >
    <i className="isax isax-edit"></i>
    <span>Edit</span>
  </button>

  <button 
    onClick={handleSave} 
    disabled={!isEditing}
    className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap flex-grow-1 flex-md-grow-0 ${
      !isEditing
        ? 'bg-light text-muted opacity-50'
        : 'bg-white text-dark fw-bold text-hover-primary'
    }`}
    style={{
      borderRadius: "4px",
      cursor: !isEditing ? "not-allowed" : "pointer"
    }}
  >
    <i className="isax isax-save-2"></i>
    <span>Save</span>
  </button>

  <button 
    onClick={handleCancel} 
    disabled={!isEditing}
    className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap flex-grow-1 flex-md-grow-0 ${
      !isEditing
        ? 'bg-light text-muted opacity-50'
        : 'bg-white text-dark fw-bold text-hover-primary'
    }`}
    style={{
      borderRadius: "4px",
      cursor: !isEditing ? "not-allowed" : "pointer"
    }}
  >
    <i className="isax isax-undo"></i>
    <span>Cancel</span>
  </button>

  <button 
    onClick={handleDeleteClick} 
    disabled={isEditing || !hasData}
    className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap flex-grow-1 flex-md-grow-0 ${
      (isEditing || !hasData)
        ? 'bg-light text-muted opacity-50'
        : 'bg-white text-danger fw-bold'
    }`}
    style={{
      borderRadius: "4px",
      cursor: (isEditing || !hasData) ? "not-allowed" : "pointer"
    }}
  >
    <i className="isax isax-trash"></i>
    <span>Del</span>
  </button>
</div>

                  <div
  className="border rounded-0 flex-grow-1 bg-white shadow-sm d-flex flex-column overflow-hidden"
  style={{ minHeight: "450px" }}
  onClick={() => {
    if (window.innerWidth < 992) {
      setShowMobileActions(true);
    }
  }}
>
                    
                    <div className="d-flex border-bottom" style={{ backgroundColor: "#f8f9fa" }}>
                      <button 
                        className={`content-tab ${activeTab === 'procedure' ? 'active' : ''}`}
                        onClick={() => handleTabSwitch('procedure')}
                        disabled={isEditing && activeTab !== 'procedure'}
                      >
                        Procedure
                      </button>
                      <button 
                        className={`content-tab ${activeTab === 'complication' ? 'active' : ''}`}
                        onClick={() => handleTabSwitch('complication')}
                        disabled={isEditing && activeTab !== 'complication'}
                      >
                        Complication
                      </button>
                    </div>

                    {/* edit content area */}
                    <div className="d-flex flex-column flex-grow-1 p-3 p-md-4" style={{ backgroundColor: "#ffffff" }}>
                      {!isEditing && !hasData ? (
                        <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted py-5 text-center">

  {/* DESKTOP ICON */}
  <i className="isax isax-document-text fs-1 mb-3 opacity-50 d-none d-lg-block" style={{ fontSize: '3rem' }}></i>

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
      className="isax isax-add-square text-primary"
      style={{ fontSize: "2rem" }}
    />
  </div>

  {/* MOBILE LABEL */}
  <span className="mt-2 fw-semibold text-muted d-lg-none" style={{ fontSize: "14px" }}>
    Add New
  </span>

  <h6 className="fw-bold mb-1">
    No {activeTab} data recorded.
  </h6>

  <p className="small mb-0">
    Click <strong className="text-dark">Add</strong> or tap the icon above to begin.
  </p>

</div>
                      ) : (
                        <div className="d-flex flex-column flex-grow-1 fade-in">
                          <label className="fw-bold mb-2 text-dark" style={{ fontSize: "0.9rem", color: "var(--primary, #0f763f)" }}>
                            {activeTab === 'procedure' ? 'Procedure Done' : 'Complication Details'}
                          </label>
                          <textarea
                            className="form-control rounded-1 shadow-none flex-grow-1"
                            style={{ 
                              borderColor: isEditing ? "var(--primary, #0f763f)" : "#dee2e6", 
                              resize: "none", 
                              fontSize: "0.95rem",
                              backgroundColor: isEditing ? "#ffffff" : "#f8f9fa",
                              minHeight: "300px"
                            }}
                            value={isEditing ? tempText : savedData[activeTab]}
                            onChange={(e) => setTempText(e.target.value)}
                            disabled={!isEditing}
                            placeholder={`Type ${activeTab} details here...`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
{/* Delete Confirmation Modal */}
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
        <div className="acc-info-icon">
          <i className="isax isax-trash"></i>
        </div>

        <div>
          <div className="fw-bold text-dark mb-1">Delete Record?</div>

          <div className="small fw-semibold text-muted">
            Are you sure you want to delete the record for{" "}
            <span className="text-danger text-capitalize">{activeTab}</span>?
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 px-4 pb-3">
        <button
          type="button"
          className="btn btn-sm btn-light fw-bold px-4 border"
          onClick={() => setShowDeleteModal(false)}
        >
          Cancel
        </button>

        <button
          type="button"
          className="btn btn-sm btn-danger fw-bold px-4"
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

export default ProcedureAndComplication;