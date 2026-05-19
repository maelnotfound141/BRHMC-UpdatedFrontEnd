import DoctorSidebar from "@/components/custom-sidebar/doctorSidebar";
import ImageWithBasePath from "@/components/image-with-base-path";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import "./physicalExams.css";

const EXAM_CATEGORIES = [
  "General Survey",
  "Vital Sign",
  "Skin",
  "HEENT",
  "Chest | Lung",
  "Cardio Vascular",
  "Abdomen",
  "Extremities",
  "Neuro Exam"
];

const GENERAL_SURVEY_OPTIONS = ["Altered sensorium", "Cardio distress", "Bed ridden", "Ambulatory", "Wheel chair"];
const SKIN_OPTIONS = ["Rashes", "Lesion", "Cyanosis", "Jaundice", "Petechiae", "Poor skin turgor", "Cold clummy skin", "Pale nailbeds"];
const CHEST_LUNG_OPTIONS = ["Wheezes", "Decreased breath sounds", "Lagging", "Rales / Crackles / Rhonchi", "Intercostal rib / clavicular retraction", "Assymetrical chest expansion"];
const CARDIO_VASCULAR_OPTIONS = ["Displaced apex beat", "Murmur", "Irregular rhythm", "Thrills", "Pericardial bulge", "Heaves", "Muffled heart sound", "Adynamic precordium", "Tachycardic", "Bradycardic"];
const ABDOMEN_OPTIONS = ["Abdominal rigidity", "Palpable mass", "Hyperactive vowel sounds", "Abdominal tenderness", "Trympanitic / dull abdomen", "Hepatomegaly", "Splenomegaly", "Abdominal distension", "Visible veins"];
const EXTREMITIES_OPTIONS = ["Cyanosis", "Adynamic pulses on all extremeties", "Pallor", "Swelling", "Weak Pulse", "Clubbing", "Limitation of Range of Movement", "Capillary refil time is less than", "Muscle bulk and tone", "Edema"];
const NEURO_OPTIONS = ["Normal gait", "Abnormal reflexes", "Poor muscle coordination", "Intact sensation"];

const HEENT_GROUPS = {
  "HEAD AND NECK": ["Uneven dist of hair", "Facial edema", "Abnormal uvula", "Sunken fontanelle", "Abnormal trachea", "Cervical lymphadenopathy"],
  "EYE": ["Anicretic sclerae", "Periorbital edima", "Sunken eyeball", "Abnormal pupillary reaction", "Pale palpebral conjunctivae", "Conjuntival suffusion or injection"],
  "EAR": ["External ear discharge and tenderness", "Abnormal umbo", "Exernal auditory meatus"],
  "NOSE": ["Abnormal septum", "Nasal discharge", "Alar flaring noted", "Dry mucous membrane"],
  "THROAT AND ORAL": ["Dry lips", "Moist oral mucosa", "Abnormal Tongue"]
};

const INITIAL_FORM_STATE: any = {
  "General Survey": { selected: [], otherChecked: false, otherValue: "" },
  "Vital Sign": { palpatory: false, systolic: "", diastolic: "", hr: "", rr: "", temp: "", o2: "", height: "", weight: "", bmi: "" },
  "Skin": { selected: [], otherChecked: false, otherValue: "" },
  "HEENT": { selected: [], otherChecked: false, otherValue: "" },
  "Chest | Lung": { selected: [], otherChecked: false, otherValue: "" },
  "Cardio Vascular": { selected: [], otherChecked: false, otherValue: "" },
  "Abdomen": { selected: [], girth: "", otherChecked: false, otherValue: "" },
  "Extremities": { selected: [], otherChecked: false, otherValue: "" },
  "Neuro Exam": { selected: [], otherChecked: false, otherValue: "" }
};

const PhysicalExamination = () => {
  const [open, setOpen] = useState(false);
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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState(EXAM_CATEGORIES[0]);

  const [unlockedCategories, setUnlockedCategories] = useState<string[]>([]);

  const [formData, setFormData] = useState<any>(JSON.parse(JSON.stringify(INITIAL_FORM_STATE)));
  const [savedState, setSavedState] = useState<any>(null);

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
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const categoryHasData = (category: string, stateObj: any) => {
    if (!stateObj) return false;
    const catData = stateObj[category];
    if (!catData) return false;
    if (catData.selected && catData.selected.length > 0) return true;
    if (catData.otherChecked || (catData.otherValue && catData.otherValue.trim() !== "")) return true;
    if (category === "Vital Sign" && (catData.palpatory || catData.systolic || catData.diastolic || catData.hr || catData.rr || catData.temp || catData.o2 || catData.weight || catData.height || catData.bmi)) return true;
    if (category === "Abdomen" && catData.girth) return true;
    return false;
  };

  const toggleSelection = (category: string, option: string) => {
    if (!unlockedCategories.includes(category)) return;
    setFormData((prev: any) => {
      const selected = prev[category].selected;
      const newSelected = selected.includes(option) 
        ? selected.filter((item: string) => item !== option) 
        : [...selected, option];
      return { ...prev, [category]: { ...prev[category], selected: newSelected } };
    });
  };

  const updateField = (category: string, field: string, value: any) => {
    if (!unlockedCategories.includes(category)) return;
    setFormData((prev: any) => ({
      ...prev,
      [category]: { ...prev[category], [field]: value }
    }));
  };

  const handleAdd = () => setUnlockedCategories((prev) => [...new Set([...prev, activeCategory])]);
  const handleEdit = () => setUnlockedCategories((prev) => [...new Set([...prev, activeCategory])]);
  const handleSave = () => {
    setSavedState(JSON.parse(JSON.stringify(formData)));
    setUnlockedCategories([]); 
  };
  const handleCancel = () => {
    setFormData(JSON.parse(JSON.stringify(savedState || INITIAL_FORM_STATE)));
    setUnlockedCategories([]);
  };
  const handleDeleteClick = () => setShowDeleteModal(true);
  const confirmDelete = () => {
    setFormData((prev: any) => ({
      ...prev,
      [activeCategory]: JSON.parse(JSON.stringify(INITIAL_FORM_STATE[activeCategory]))
    }));
    setSavedState((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        [activeCategory]: JSON.parse(JSON.stringify(INITIAL_FORM_STATE[activeCategory]))
      };
    });
    setUnlockedCategories((prev) => prev.filter(c => c !== activeCategory));
    setShowDeleteModal(false);
  };

  const catHasData = categoryHasData(activeCategory, savedState); 
  const isUnlocked = unlockedCategories.includes(activeCategory);
  const isAnyUnlocked = unlockedCategories.length > 0;
  const showForm = catHasData || isUnlocked;

  const renderOtherTextarea = (category: string) => {
    const currentText = formData[category].otherValue || "";
    const remainingChars = 255 - currentText.length;

    return (
      <div className="col-12 mt-4">
        <div className="form-check d-flex align-items-center gap-1 mb-2">
          <input
            className="form-check-input mt-0 shadow-none"
            type="checkbox"
            id={`check-other-${category}`}
            checked={formData[category].otherChecked}
            onChange={(e) => {
              updateField(category, "otherChecked", e.target.checked);
              if (!e.target.checked) updateField(category, "otherValue", "");
            }}
            disabled={!isUnlocked}
            style={{ border: '1px solid var(--primary, #0f763f)', cursor: isUnlocked ? 'pointer' : 'not-allowed', width: '16px', height: '16px' }}
          />
          <label className="form-check-label text-dark pt-1 fw-bold" htmlFor={`check-other-${category}`} style={{ fontSize: "0.85rem", cursor: isUnlocked ? 'pointer' : 'not-allowed' }}>
            Other
          </label>
        </div>
        <textarea
          className="form-control rounded-1 shadow-none"
          value={currentText}
          onChange={(e) => updateField(category, "otherValue", e.target.value.toUpperCase())}
          disabled={!formData[category].otherChecked || !isUnlocked}
          maxLength={255}
          rows={3}
          style={{ 
            borderColor: "var(--primary, #0f763f)", 
            backgroundColor: (!formData[category].otherChecked || !isUnlocked) ? "#f8f9fa" : "#ffffff",
            fontSize: "0.9rem",
            resize: "none"
          }}
        ></textarea>
        
        <div className="d-flex flex-column flex-sm-row justify-content-between text-muted mt-2 gap-2" style={{ fontSize: "0.75rem", lineHeight: "1.4" }}>
          <span className="text-center text-sm-start">Date Logged <br className="d-none d-sm-block"/> {new Date().toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})}</span>
          <span className="text-center text-sm-end">
            This Text Field will hold maximum of 255 characters<br className="d-none d-sm-block"/>
            <span style={{ color: "var(--primary, #0f763f)" }}>Remaining available characters {remainingChars}</span>
          </span>
        </div>
      </div>
    );
  };

  const renderStandardCheckboxes = (category: string, options: string[]) => (
    <div className="row g-3">
      {options.map((opt, idx) => (
        <div className="col-12 col-sm-6 col-md-4 col-xl-3" key={idx}>
          <div className="form-check d-flex align-items-center gap-1">
            <input
              className="form-check-input mt-0 shadow-none"
              type="checkbox"
              id={`${category.replace(/[^a-zA-Z0-9]/g, '')}-${idx}`}
              checked={formData[category].selected.includes(opt)}
              onChange={() => toggleSelection(category, opt)}
              disabled={!isUnlocked}
              style={{ border: '1px solid var(--primary, #0f763f)', cursor: isUnlocked ? 'pointer' : 'not-allowed', width: '16px', height: '16px' }}
            />
            <label className="form-check-label text-dark pt-1" htmlFor={`${category.replace(/[^a-zA-Z0-9]/g, '')}-${idx}`} style={{ fontSize: "0.85rem", cursor: isUnlocked ? 'pointer' : 'not-allowed' }}>
              {opt}
            </label>
          </div>
        </div>
      ))}
    </div>
  );

  const renderVitalSigns = () => {
    const data = formData["Vital Sign"];

    const getInputStyle = (borderColor: string, customWidth: string = "95px") => ({
      border: `2px solid ${borderColor}`,
      backgroundColor: isUnlocked ? '#ffffff' : '#f8f9fa',
      fontSize: '1.15rem', 
      fontWeight: '600',
      color: '#333',
      height: '3rem', 
      width: customWidth, 
      textAlign: 'center' as const,
      cursor: isUnlocked ? 'text' : 'not-allowed'
    });

    const getLabelStyle = (color: string) => ({
      color: color,
      fontWeight: '600',
      fontSize: '0.85rem',
      marginBottom: '0.4rem',
      display: 'block'
    });

    return (
      <div className="d-flex flex-column gap-4 fade-in">     

        <div className="d-flex flex-wrap align-items-start gap-4">
          
          <div className="d-flex flex-column justify-content-end">
            <div className="mb-2">
              <label style={{ ...getLabelStyle('#8e44ad'), marginBottom: '0.2rem' }}>Blood Pressure ( mmHg )</label>
              
              <div className="form-check d-flex align-items-center mb-0 ms-1">
                <input
                  className="form-check-input mt-0 shadow-none"
                  type="checkbox"
                  id="vs-palpatory"
                  checked={data.palpatory}
                  onChange={(e) => updateField("Vital Sign", "palpatory", e.target.checked)}
                  disabled={!isUnlocked}
                  style={{ border: '2px solid #8e44ad', cursor: isUnlocked ? 'pointer' : 'not-allowed', width: '16px', height: '16px' }}
                />
                <label className="form-check-label ms-1 pt-1 fw-semibold" htmlFor="vs-palpatory" style={{ fontSize: "0.8rem", color: "#8e44ad", cursor: isUnlocked ? 'pointer' : 'not-allowed' }}>Palpatory</label>
              </div>
            </div>
            
            <div className="d-flex gap-2">
              <div>
                <input type="number" className="form-control shadow-none rounded-1" placeholder="0" value={data.systolic} onChange={(e) => updateField("Vital Sign", "systolic", e.target.value)} disabled={!isUnlocked} style={getInputStyle('#8e44ad')}/>
                <small className="d-block text-center text-md-start mt-1" style={{ fontSize: "0.75rem", color: "#8e44ad", fontWeight: '500' }}>Systolic</small>
              </div>
              <div>
                <input type="number" className="form-control shadow-none rounded-1" placeholder="0" value={data.diastolic} onChange={(e) => updateField("Vital Sign", "diastolic", e.target.value)} disabled={!isUnlocked} style={getInputStyle('#8e44ad')}/>
                <small className="d-block text-center text-md-start mt-1" style={{ fontSize: "0.75rem", color: "#8e44ad", fontWeight: '500' }}>Diastolic</small>
              </div>
            </div>
          </div>

          <div className="d-flex flex-wrap align-items-start gap-3 pb-2 vital-group-margin">
            <div>
              <label style={getLabelStyle('#17a2b8')}>HR / Min.</label>
              <input type="number" className="form-control shadow-none rounded-1" placeholder="0" value={data.hr} onChange={(e) => updateField("Vital Sign", "hr", e.target.value)} disabled={!isUnlocked} style={getInputStyle('#17a2b8')}/>
            </div>
            <div>
              <label style={getLabelStyle('#17a2b8')}>RR / Min.</label>
              <input type="number" className="form-control shadow-none rounded-1" placeholder="0" value={data.rr} onChange={(e) => updateField("Vital Sign", "rr", e.target.value)} disabled={!isUnlocked} style={getInputStyle('#17a2b8')}/>
            </div>
            <div>
              <label style={getLabelStyle('#17a2b8')}>Temperature</label>
              <input type="number" step="0.1" className="form-control shadow-none rounded-1" placeholder=".0" value={data.temp} onChange={(e) => updateField("Vital Sign", "temp", e.target.value)} disabled={!isUnlocked} style={getInputStyle('#17a2b8', '140px')}/>
            </div>
            <div>
              <label style={getLabelStyle('#17a2b8')}>O2 Saturation</label>
              <input type="number" step="0.01" className="form-control shadow-none rounded-1" placeholder=".00" value={data.o2} onChange={(e) => updateField("Vital Sign", "o2", e.target.value)} disabled={!isUnlocked} style={getInputStyle('#17a2b8')}/>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap align-items-start gap-4 mt-2">
          <div>
            <label style={getLabelStyle('#333')}>Height (cm)</label>
            <input type="number" step="0.01" className="form-control shadow-none rounded-1" placeholder=".00" value={data.height} onChange={(e) => updateField("Vital Sign", "height", e.target.value)} disabled={!isUnlocked} style={getInputStyle('#333', '100px')}/>
          </div>
          <div>
            <label style={getLabelStyle('#333')}>Weight (kg)</label>
            <input type="number" step="0.01" className="form-control shadow-none rounded-1" placeholder=".00" value={data.weight} onChange={(e) => updateField("Vital Sign", "weight", e.target.value)} disabled={!isUnlocked} style={getInputStyle('#333', '100px')}/>
          </div>
          <div>
            <label style={getLabelStyle('#e67e22')}>BMI</label>
            <input type="number" step="0.01" className="form-control shadow-none rounded-1" placeholder=".00" value={data.bmi} onChange={(e) => updateField("Vital Sign", "bmi", e.target.value)} disabled={!isUnlocked} style={getInputStyle('#e67e22', '100px')}/>
          </div>
        </div>

        <div className="mt-4 text-center text-md-start">
          <label style={getLabelStyle('#17a2b8')} className="mb-0">Date Logged</label>
          <div className="text-dark fw-medium" style={{ fontSize: "0.85rem" }}>
            {new Date().toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
          </div>
        </div>

      </div>
    );
  };

  const renderFormContent = () => {
if (!showForm) {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-muted text-center"
      style={{ flex: 1, minHeight: "350px" }}
    >
      {/* Desktop icon only */}
      <i
        className="isax isax-document-text mb-3 opacity-50 d-none d-lg-block"
        style={{ fontSize: "3rem" }}
      ></i>

      {/* Mobile FAB */}
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

      <h5 className="text-dark fw-bold mb-0 mt-3">
        No physical exam data recorded.
      </h5>
    </div>
  );
}

    return (
      <div className="fade-in">
        {activeCategory === "General Survey" && (
          <>{renderStandardCheckboxes("General Survey", GENERAL_SURVEY_OPTIONS)}{renderOtherTextarea("General Survey")}</>
        )}
        {activeCategory === "Vital Sign" && renderVitalSigns()}
        {activeCategory === "Skin" && (
          <>{renderStandardCheckboxes("Skin", SKIN_OPTIONS)}{renderOtherTextarea("Skin")}</>
        )}
        {activeCategory === "HEENT" && (
          <>
            <div className="row g-4">
              {Object.entries(HEENT_GROUPS).map(([groupName, options], gIdx) => (
                <div className="col-12" key={gIdx}>
                  <h6 className="fw-bold mb-2" style={{ color: "#8b0000", fontSize: "0.85rem" }}>{groupName}</h6>
                  {renderStandardCheckboxes("HEENT", options)}
                </div>
              ))}
            </div>
            {renderOtherTextarea("HEENT")}
          </>
        )}
        {activeCategory === "Chest | Lung" && (
          <>{renderStandardCheckboxes("Chest | Lung", CHEST_LUNG_OPTIONS)}{renderOtherTextarea("Chest | Lung")}</>
        )}
        {activeCategory === "Cardio Vascular" && (
          <>{renderStandardCheckboxes("Cardio Vascular", CARDIO_VASCULAR_OPTIONS)}{renderOtherTextarea("Cardio Vascular")}</>
        )}
        {activeCategory === "Abdomen" && (
          <>
            {renderStandardCheckboxes("Abdomen", ABDOMEN_OPTIONS)}
            <div className="mt-4 d-flex flex-wrap align-items-center gap-2">
              <label className="fw-bold text-dark" style={{ fontSize: "0.85rem" }}>Abdominal girth</label>
              <input type="number" className="form-control shadow-none px-2 py-1 text-center" value={formData["Abdomen"].girth} onChange={(e) => updateField("Abdomen", "girth", e.target.value)} disabled={!isUnlocked} style={{ width: "80px", border: '1px solid #333', backgroundColor: isUnlocked ? '#fff' : '#f8f9fa' }} />
              <span className="text-dark" style={{ fontSize: "0.85rem" }}>cm</span>
            </div>
            {renderOtherTextarea("Abdomen")}
          </>
        )}
        {activeCategory === "Extremities" && (
          <>{renderStandardCheckboxes("Extremities", EXTREMITIES_OPTIONS)}{renderOtherTextarea("Extremities")}</>
        )}
        {activeCategory === "Neuro Exam" && (
          <>{renderStandardCheckboxes("Neuro Exam", NEURO_OPTIONS)}{renderOtherTextarea("Neuro Exam")}</>
        )}
      </div>
    );
  };

  return (
    <>
      
   

      <div className="content doctor-content bg-light mt-n4 d-flex flex-column" style={{ minHeight: "100vh" }}>
        <div className="container-fluid px-3 px-lg-5 pt-0 flex-grow-1 d-flex flex-column">
                <div className="doctor-dashboard-layout">
  <DoctorSidebar />

  <div className="doctor-dashboard-main">
              <div
                className="card border-0 shadow-sm p-3 p-md-4 mb-4 d-flex flex-column h-100"
                style={{ borderRadius: "12px", borderTop: "4px solid var(--primary, #0f763f)" }}
              >
                {/* Patient Profile Header */}
                <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3 gap-md-4 mb-4 pb-4 border-bottom text-center text-md-start position-relative">
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

              
                <div className="d-flex flex-column flex-grow-1 mb-4">
                  
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
  <h5 className="fw-bold text-dark mb-0 text-center text-md-start text-uppercase">Physical Examination</h5>
  
 <div className={`d-flex flex-wrap justify-content-center justify-content-md-end pb-1 pb-md-0 ms-md-auto ${!catHasData && !isUnlocked ? "d-none d-lg-flex" : ""}`} style={{ gap: "4px" }}>
                      <button 
                        onClick={handleAdd} 
                        disabled={catHasData || isUnlocked}
                        className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap ${
                          (catHasData || isUnlocked) ? 'bg-light text-muted opacity-50' : 'bg-white text-dark fw-bold text-hover-primary'
                        }`}
                        style={{ borderRadius: "3px", cursor: (catHasData || isUnlocked) ? "not-allowed" : "pointer" }}
                      >
                        <i className="isax isax-add-square"></i> <span className="d-none d-md-inline">Add</span>
                        
                      </button>
                      
                      <button 
                        onClick={handleEdit} 
                        disabled={!catHasData || isUnlocked}
                        className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap ${
                          (!catHasData || isUnlocked) ? 'bg-light text-muted opacity-50' : 'bg-white text-dark fw-bold'
                        }`}
                        style={{ borderRadius: "3px", cursor: (!catHasData || isUnlocked) ? "not-allowed" : "pointer" }}
                      >
                        <i className="isax isax-edit"></i> <span className="d-none d-md-inline">Edit</span>
                      </button>
                      
                      <button 
                        onClick={handleSave} 
                        disabled={!isAnyUnlocked}
                        className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap ${
                          !isAnyUnlocked ? 'bg-light text-muted opacity-50' : 'text-white fw-bold'
                        }`}
                        style={{ 
                          borderRadius: "3px", 
                          cursor: !isAnyUnlocked ? "not-allowed" : "pointer",
                          backgroundColor: isAnyUnlocked ? "var(--primary, #0f763f)" : undefined,
                          borderColor: isAnyUnlocked ? "var(--primary, #0f763f)" : undefined
                        }}
                      >
                        <i className="isax isax-save-2"></i> <span className="d-none d-md-inline">Save</span>
                      </button>
                      
                      <button 
                        onClick={handleCancel} 
                        disabled={!isAnyUnlocked}
                        className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap ${
                          !isAnyUnlocked ? 'bg-light text-muted opacity-50' : 'bg-white text-dark fw-bold'
                        }`}
                        style={{ borderRadius: "3px", cursor: !isAnyUnlocked ? "not-allowed" : "pointer" }}
                      >
                        <i className="isax isax-undo"></i> <span className="d-none d-md-inline">Cancel</span>
                      </button>
                      
                      <button 
                        onClick={handleDeleteClick} 
                        disabled={!catHasData || isUnlocked}
                        className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap ${
                          (!catHasData || isUnlocked) ? 'bg-light text-muted opacity-50' : 'bg-white text-danger fw-bold'
                        }`}
                        style={{ borderRadius: "3px", cursor: (!catHasData || isUnlocked) ? "not-allowed" : "pointer" }}
                      >
                        <i className="isax isax-trash"></i> <span className="d-none d-md-inline">Del</span>
                      </button>
                    </div>
                  </div>

                  <div className="border rounded-0 flex-grow-1 bg-white shadow-sm d-flex flex-column flex-lg-row overflow-hidden" style={{ minHeight: "450px" }}>
                    
                    <div className="bg-light border-bottom border-lg-bottom-0 border-lg-end responsive-exam-sidebar overflow-x-auto hide-scrollbar">
                      <div className="list-group list-group-flush rounded-0 h-100 p-2 gap-1 sidebar-flex">
                        {EXAM_CATEGORIES.map((category) => {
                          const hasContent = categoryHasData(category, formData);

                          return (
                            <button
                              key={category}
                              onClick={() => setActiveCategory(category)}
                              className={`list-group-item list-group-item-action border-0 rounded-2 py-2 px-3 text-nowrap d-flex align-items-center justify-content-between text-start ${
                                activeCategory === category ? "fw-bold shadow-sm" : "text-muted"
                              }`}
                              style={{
                                backgroundColor: activeCategory === category ? "var(--primary, #0f763f)" : "transparent",
                                color: activeCategory === category ? "#ffffff" : "inherit",
                                fontSize: "0.9rem",
                                transition: "all 0.2s"
                              }}
                            >
                              {category}
                              {hasContent && (
                                <i className={`isax isax-tick-circle ms-2 ${activeCategory === category ? 'text-white' : 'text-success'}`} style={{ fontSize: '1.1rem' }}></i>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                      <div
                        className="flex-grow-1 d-flex flex-column p-3 p-md-4 position-relative overflow-y-auto"
                        style={{ maxHeight: "600px" }}
                      >
                        {/* Mobile Center FAB */}


                        {renderFormContent()}
                      </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

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
          <div className="fw-bold text-dark mb-1">Clear Record?</div>

          <div className="small fw-semibold text-muted">
            Are you sure you want to clear the record for{" "}
            <span className="text-danger fw-bold">{activeCategory}</span>?
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

export default PhysicalExamination;
