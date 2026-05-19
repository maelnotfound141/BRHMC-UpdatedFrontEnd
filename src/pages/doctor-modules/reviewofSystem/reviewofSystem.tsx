import DoctorSidebar from "@/components/custom-sidebar/doctorSidebar";
import DeleteConfirmationModal from "@/components/delete-confirmation-modal/DeleteConfirmationModal";
import ImageWithBasePath from "@/components/image-with-base-path";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import "./reviewofSystem.css";

const ROS_CATEGORIES = [
  "General",
  "Cardiovascular",
  "Hematologic",
  "Skin",
  "Chest and Lung",
  "Musculoskeletal",
  "HEENT",
  "Gastrointestinal",
  "Endocrine",
  "Consciousness",
  "Genitourinary",
  "Nervous"
];


const ROS_OPTIONS: Record<string, string[]> = {
  "General": ["Weight loss", "Weight gain", "Poor activity", "Loss of appetite", "Growth delay", "Body malaise", "Fever", "Difficulty of sleeping"],
  "Cardiovascular": ["Easy fatigability", "Fainting spell", "Cyanosis", "Orthopnea"],
  "Hematologic": ["Easy Bruising", "Pallor", "Bleeding manifestation"],
  "Skin": ["Rashes", "Pallor", "Changes in skin color", "Wound lesion", "Acne", "Pruritus"],
  "Chest and Lung": ["Hemoptysis", "Difficulty of breathing", "Chest pain", "Cough"],
  "Musculoskeletal": ["Stiffness", "Limping", "Limitation of movement", "Pain / swelling", "Involuntary hand movement"],
  "HEENT": ["Headache", "Dizziness", "Visual difficulty", "Tearing", "Ear pain", "Nasal discharge", "Aural discharge", "Epistaxis", "Toothache", "Salivation", "Sore throat"],
  "Gastrointestinal": ["Nausea", "Vomiting", "Constipation", "Abdominal pain", "Jaundice", "Passage of worm", "Encopresis", "Food intolerance", "Pica"],
  "Endocrine": ["Palpitation", "Polyphagia", "Polyuria", "Cold/heat intolerance", "Polydipsia", "Breast asymmetry, pain or discharge"],
  "Consciousness": ["Altered sensorium", "Loss of consciousness", "Lethargy", "Disorientation"],
  "Genitourinary": ["Discoloration of urine", "Burning sensation", "Enuresis", "Frequency of discharge", "Peripheral edema", "Dysuria", "Polyuria", "Hematuria"],
  "Nervous": ["Tremor", "Sleeping problem", "Convulsion", "Weakness or paralysis", "Mental deterioration", "Memory loss", "Eating problem", "Hallucination", "School failure", "Mood change", "Temper outburst", "Personality / behavioural change"]
};

// pag generate iniital stat based sa categories
const INITIAL_FORM_STATE: any = ROS_CATEGORIES.reduce((acc, cat) => {
  acc[cat] = { selected: [], otherChecked: false, otherValue: "" };
  return acc;
}, {} as any);

const ReviewOfSystem = () => {
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

  // state management
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState(ROS_CATEGORIES[0]);
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

  // helpers
  const categoryHasData = (category: string, stateObj: any) => {
    if (!stateObj) return false;
    const catData = stateObj[category];
    if (!catData) return false;
    if (catData.selected && catData.selected.length > 0) return true;
    if (catData.otherChecked || (catData.otherValue && catData.otherValue.trim() !== "")) return true;
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

  // sa toolbars
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

  // pag render UI
  const renderCheckboxesAndOther = (category: string) => {
    const options = ROS_OPTIONS[category] || [];
    const currentText = formData[category].otherValue || "";
    const remainingChars = 255 - currentText.length;

    return (
      <div className="fade-in">
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

        <div className="col-12 mt-4">
          <div className="form-check d-flex align-items-center gap-1 mb-3">
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
            <label className="form-check-label text-dark pt-1" htmlFor={`check-other-${category}`} style={{ fontSize: "0.85rem", cursor: isUnlocked ? 'pointer' : 'not-allowed' }}>
              Other
            </label>
          </div>
          
          <label className="fw-bold mb-1" style={{ color: "var(--primary, #0f763f)", fontSize: "0.85rem" }}>Others</label>
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
          No system review data recorded.
        </h5>
      </div>
    );
  }

  return renderCheckboxesAndOther(activeCategory);
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
                    <h5 className="fw-bold text-dark mb-0 text-center text-md-start text-uppercase">Review of System</h5>
            
                    <div className={`d-flex flex-wrap justify-content-center justify-content-lg-end pb-1 pb-lg-0 ms-lg-auto ${!catHasData && !isUnlocked ? "d-none d-lg-flex" : ""}`} style={{ gap: "4px" }}>
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

                  {/* split layout araa */}
                  <div className="border rounded-0 flex-grow-1 bg-white shadow-sm d-flex flex-column flex-lg-row overflow-hidden" style={{ minHeight: "450px" }}>
                    
                    {/*leftg sidebar - categoried*/}
                    <div className="bg-light border-bottom border-lg-bottom-0 border-lg-end responsive-exam-sidebar overflow-x-auto hide-scrollbar">
                      <div className="list-group list-group-flush rounded-0 h-100 p-2 gap-1 d-flex flex-row flex-lg-column">
                        {ROS_CATEGORIES.map((category) => {
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
        <DeleteConfirmationModal
          message={
            <>
              Are you sure you want to clear the record for{" "}
              <strong className="text-danger">{activeCategory}</strong>?
            </>
          }
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
};

export default ReviewOfSystem;
