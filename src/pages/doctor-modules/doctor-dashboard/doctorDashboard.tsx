import ImageWithBasePath from "@/components/image-with-base-path";
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router";
import { all_routes } from "@/routes/all_routes";

// doctor dashboard component
const DoctorDashboard = () => {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLAnchorElement | null>(null);

  const mockPatients = [
    { id: "000000000777288", lastName: "BALUTE", firstName: "REA", middleName: "MON", suffix: "" },
    { id: "000000000777289", lastName: "DELA CRUZ", firstName: "JUAN", middleName: "PROFILO", suffix: "JR" },
    { id: "000000000777290", lastName: "SANTOS", firstName: "MARIA", middleName: "CLARA", suffix: "" }
  ];

  const [patientData, setPatientData] = useState({
    patientId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    generalParameter: "",
    suffix: ""
  });
  const [errors, setErrors] = useState({ patientId: false });
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [consultationRecords, setConsultationRecords] = useState<any[]>([]);

  const resetModalForm = () => {
    setPatientData({ patientId: "", firstName: "", middleName: "", lastName: "", generalParameter: "", suffix: "" });
    setErrors({ patientId: false });
    setIsSearching(false);
    setSelectedPatient(null);
    setConsultationRecords([]);
  };

  const handleCloseModal = () => {
    resetModalForm();
    setShowModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPatientData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientData.patientId.trim()) {
      setErrors({ patientId: true });
      return;
    }
    setErrors({ patientId: false });
    setIsLoading(true);
    console.log("Connecting to API...", patientData);
    setTimeout(() => {
      setIsLoading(false);
      setIsSearching(true);
    }, 1500);
  };

  const handlePatientSelect = (patientId: string) => {
    setIsLoading(true);
    setSelectedPatient(patientId);
    console.log("Fetching Consultation Records for:", patientId);
    setTimeout(() => {
      setConsultationRecords([
        { date: "04/15/2026 04:23 PM", type: "OPD Consultation", discharge: "—" },
        { date: "11/18/2025 08:48 AM", type: "ER Department (For Admission)", discharge: "21 Mar 26 02:40 PM" }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleConsultationRecordClick = (patientId: string) => {
    navigate(all_routes.doctorMypatients, { state: { selectedPatientId: patientId } });
    handleCloseModal();
  };

  const handleBackToList = () => {
    setSelectedPatient(null);
    setConsultationRecords([]);
  };

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

  return (
    <>
      <style>
        {`
          /* search patient banner */
          .find-patient-banner {
            cursor: pointer;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
            transition: box-shadow 0.25s ease, border-color 0.25s ease;
            border-left: 4px solid var(--primary, #0f763f) !important;
          }

          .find-patient-banner:hover,
          .find-patient-banner:focus-visible {
            box-shadow: 0 6px 20px rgba(15, 118, 63, 0.13) !important;
            border-color: var(--primary, #0f763f) !important;
            outline: none;
          }

          .find-patient-banner:active {
            transform: scale(0.995);
          }

          .find-patient-banner:focus-visible {
            outline: 2px solid var(--primary, #0f763f);
            outline-offset: 2px;
          }

          .fp-icon-wrap {
            width: 44px;
            height: 44px;
            background: rgba(15, 118, 63, 0.09);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: background 0.25s ease, transform 0.25s ease;
          }

          .find-patient-banner:hover .fp-icon-wrap {
            background: rgba(15, 118, 63, 0.16);
            transform: scale(1.07);
          }

          .fp-search-pill {
            display: flex;
            align-items: center;
            gap: 6px;
            background: rgba(15, 118, 63, 0.07);
            border: 1px solid rgba(15, 118, 63, 0.18);
            border-radius: 20px;
            padding: 5px 13px;
            font-size: 0.78rem;
            font-weight: 600;
            color: var(--primary, #0f763f);
            white-space: nowrap;
            transition: background 0.2s ease;
          }

          .find-patient-banner:hover .fp-search-pill {
            background: rgba(15, 118, 63, 0.13);
          }

          /* pulse dot */
          .fp-pulse {
            width: 7px;
            height: 7px;
            background: var(--primary, #0f763f);
            border-radius: 50%;
            animation: fpPulse 2s ease-in-out infinite;
            flex-shrink: 0;
          }

          @keyframes fpPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50%       { opacity: 0.45; transform: scale(0.7); }
          }

          /* utility cards */
          .utility-card {
            background: #ffffff;
            border: 1px solid #f0f2f5 !important;
            border-radius: 16px !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }

          .utility-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06) !important;
            border-color: transparent !important;
          }

          .utility-card::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: var(--primary, #0f763f);
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .utility-card:hover::before {
            opacity: 1;
          }

          .utility-icon-wrap {
            width: 56px;
            height: 56px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }

          .utility-card:hover .utility-icon-wrap {
            transform: scale(1.05);
          }

          .utility-arrow {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #f8f9fa;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            color: #adb5bd;
          }

          .utility-card:hover .utility-arrow {
            background: var(--primary, #0f763f);
            color: #ffffff;
            transform: translateX(4px);
          }

          /* responsive tweaks */
          @media (max-width: 575.98px) {
            .fp-divider       { display: none !important; }
            .fp-subtitle      { display: none !important; }
            .fp-search-pill   { padding: 4px 10px; font-size: 0.72rem; }
            .fp-icon-wrap     { width: 38px; height: 38px; border-radius: 8px; }
          }

          @media (min-width: 576px) and (max-width: 767.98px) {
            .fp-subtitle { display: none !important; }
          }
        `}
      </style>

      {/* page content */}
      <div
        className="content doctor-content bg-light mt-n4 d-flex flex-column"
        style={{ minHeight: "100vh" }}
      >
        <div className="container-fluid px-3 px-lg-5 pt-0 flex-grow-1 d-flex flex-column">

          {/* find patient banner */}
          <div className="row mb-3">
            <div className="col-12">
              <div
                className="card border-0 shadow-sm find-patient-banner"
                role="button"
                tabIndex={0}
                onClick={() => setShowModal(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setShowModal(true);
                  }
                }}
                aria-label="Search for a patient"
                style={{ borderRadius: "12px" }}
              >
                <div className="d-flex align-items-center gap-3 px-3 px-sm-4 py-3">

                  {/* icon */}
                  <div className="fp-icon-wrap">
                    <i
                      className="isax isax-user-search"
                      style={{ fontSize: "1.35rem", color: "var(--primary, #0f763f)", fontWeight: "300" }}
                    />
                  </div>

                  {/* label group */}
                  <div className="d-flex align-items-center gap-3 flex-grow-1 min-width-0">
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold text-dark" style={{ fontSize: "0.95rem", lineHeight: 1.2 }}>
                          Find Patient
                        </span>
                        <div className="fp-pulse" />
                      </div>
                      <p
                        className="text-muted mb-0 fp-subtitle"
                        style={{ fontSize: "0.78rem", lineHeight: 1.3, marginTop: "2px" }}
                      >
                        Search by hospital number, name, or general parameter
                      </p>
                    </div>

                    {/* hidden xs */}
                    <div
                      className="fp-divider"
                      style={{ width: "1px", height: "32px", background: "#dee2e6", flexShrink: 0 }}
                    />

                    {/* hidden xs */}
                    <span
                      className="text-muted fp-divider"
                      style={{ fontSize: "0.78rem", whiteSpace: "nowrap" }}
                    >
                      Click to open patient search
                    </span>
                  </div>

                  {/* search pill */}
                  <div className="fp-search-pill flex-shrink-0">
                    <i className="isax isax-search-normal-1" style={{ fontSize: "0.8rem", fontWeight: "300" }} />
                    <span>Search</span>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* sa module utilities */}
          <div className="row flex-grow-1">
            <div className="col-12">
              <div
                className="card border-0 shadow-sm p-3 p-md-4 h-100"
                style={{ borderRadius: "12px", borderTop: "4px solid var(--primary, #0f763f)" }}
              >
              <div className="row mb-4">
                  <div className="col-12">
                    <div 
                      className="p-3 rounded-3" 
                      style={{ backgroundColor: "rgba(9, 125, 25, 0.06)" }}
                    >
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <i
                          className="isax isax-element-3"
                          style={{ fontSize: "1.5rem", color: "var(--primary, #0f763f)", fontWeight: "300" }}
                        />
                        <h5 className="fw-bold text-dark mb-0">Module Utilities</h5>
                      </div>
                      <p className="text-muted small mb-0 ms-4 ps-1">
                        Quick access to essential tools and features
                      </p>
                    </div>
                  </div>
                </div>
                
            <div className="row g-4">
                  {[
                    {
                      title: "Patient Log",
                      desc: "List of patients under this ward",
                      icon: "isax isax-document-text",
                      color: "var(--primary, #0f763f)",
                      bg: "rgba(15, 118, 63, 0.08)",
                      path: all_routes.doctorPatientLog // add path reference
                    },
                    {
                      title: "Archive Viewer",
                      desc: "Access archive file online",
                      icon: "isax isax-archive",
                      color: "var(--primary, #0f763f)",
                      bg: "rgba(15, 118, 63, 0.08)",
                      path: all_routes.doctorArchiveViewer // add path reference
                    },
                    {
                      title: "Reports",
                      desc: "System report generation",
                      icon: "isax isax-chart-square",
                      color: "var(--primary, #0f763f)",
                      bg: "rgba(15, 118, 63, 0.08)",
                      path: all_routes.doctorReports // add path reference
                    }
                  ].map((item, index) => (
                    <div className="col-12 col-md-6 col-lg-4" key={index}>
                      <div 
                        className="card h-100 p-4 utility-card"
                        onClick={() => navigate(item.path)} // handle redirect click
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div 
                            className="utility-icon-wrap" 
                            style={{ backgroundColor: item.bg, color: item.color }}
                          >
                            <i className={item.icon} style={{ fontSize: "1.8rem" }} />
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold text-dark">{item.title}</h6>
                            <p className="small text-muted mb-0">{item.desc}</p>
                          </div>
                          <div className="utility-arrow flex-shrink-0">
                            <i className="isax isax-arrow-right-3" style={{ fontSize: "1.2rem" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            zIndex: 1060
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg tablet-modal-wide">
            <div className="modal-content shadow-lg border-0 search-patient-modal">
              
              <div className="search-patient-modal-header d-flex justify-content-between align-items-center p-3 border-bottom">
                <Link to={all_routes.doctorDashboard} className="logo d-flex align-items-center text-decoration-none text-dark gap-2">
                  <h2 className="logo-name mb-0 fs-3 fw-bold">BRHMC</h2>
                  <ImageWithBasePath
                    src="assets/img/brhmclogo.png"
                    alt="logo"
                    className="img-fluid"
                    style={{ height: '30px' }}
                  />
                </Link>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                />
              </div>

              {isLoading ? (
                <div className="modal-body text-center py-5">
                  <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h6 className="text-muted fw-bold">Querying iHOMIS Database...</h6>
                  <p className="small text-secondary">Searching for Patient ID: {patientData.patientId}</p>
                </div>

              ) : !isSearching ? (
                <form onSubmit={handleSubmitSearch}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-12">
                        <label htmlFor="patientId" className="form-label small fw-bold">
                          Hospital Number <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className={`input-group-text bg-transparent border-end-0 ${errors.patientId ? 'border-danger' : ''}`}>
                            <i className="isax isax-personalcard" />
                          </span>
                          <input
                            type="number"
                            className={`form-control border-start-0 ${errors.patientId ? 'is-invalid' : ''}`}
                            id="patientId"
                            placeholder="Enter Hospital Number"
                            value={patientData.patientId}
                            onChange={(e) => {
                              handleInputChange(e);
                              if (errors.patientId) setErrors({ patientId: false });
                            }}
                          />
                          {errors.patientId && <div className="invalid-feedback">A valid Patient ID is required.</div>}
                        </div>
                      </div>

                      <div className="col-md-4">
                        <label htmlFor="firstName" className="form-label small fw-bold">First Name</label>
                        <input type="text" className="form-control" id="firstName" value={patientData.firstName} onChange={handleInputChange} />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="middleName" className="form-label small fw-bold">Middle Name</label>
                        <input type="text" className="form-control" id="middleName" value={patientData.middleName} onChange={handleInputChange} />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="lastName" className="form-label small fw-bold">Last Name</label>
                        <input type="text" className="form-control" id="lastName" value={patientData.lastName} onChange={handleInputChange} />
                      </div>

                      <div className="col-md-8">
                        <label htmlFor="generalParameter" className="form-label small fw-bold">General Parameter</label>
                        <input type="text" className="form-control" id="generalParameter" value={patientData.generalParameter} onChange={handleInputChange} />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="suffix" className="form-label small fw-bold">Suffix</label>
                        <select
                          className="form-select"
                          id="suffix"
                          value={patientData.suffix}
                          onChange={(e) => setPatientData(prev => ({ ...prev, suffix: e.target.value }))}
                        >
                          <option value="">None</option>
                          <option value="Jr.">Jr.</option>
                          <option value="Sr.">Sr.</option>
                          <option value="II">II</option>
                          <option value="III">III</option>
                        </select>
                      </div>
                    </div>
                  </div>
               <div className="modal-footer bg-light d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn fw-bold"
                  style={
                    {
                      borderRadius: "8px",
                      minWidth: "100px",
                      backgroundColor: "#6c757d",
                      borderColor: "#6c757d",
                      color: "#ffffff",
                      boxShadow: "none",

                      "--bs-btn-bg": "#6c757d",
                      "--bs-btn-border-color": "#6c757d",
                      "--bs-btn-hover-bg": "#5c636a",
                      "--bs-btn-hover-border-color": "#565e64",
                      "--bs-btn-active-bg": "#565e64",
                      "--bs-btn-active-border-color": "#51585e",
                      "--bs-btn-disabled-bg": "#6c757d",
                      "--bs-btn-disabled-border-color": "#6c757d",
                      "--bs-btn-focus-shadow-rgb": "108, 117, 125",
                    } as React.CSSProperties
                  }
                  onClick={handleCloseModal}
                >
                  Close
                </button>

  <button
    type="submit"
    className="btn fw-bold"
    style={
      {
        borderRadius: "8px",
        minWidth: "150px",
        backgroundColor: "var(--primary, #0f763f)",
        borderColor: "var(--primary, #0f763f)",
        color: "#ffffff",
        boxShadow: "none",

        "--bs-btn-bg": "var(--primary, #0f763f)",
        "--bs-btn-border-color": "var(--primary, #0f763f)",
        "--bs-btn-hover-bg": "var(--primary, #0f763f)",
        "--bs-btn-hover-border-color": "var(--primary, #0f763f)",
        "--bs-btn-active-bg": "var(--primary, #0f763f)",
        "--bs-btn-active-border-color": "var(--primary, #0f763f)",
        "--bs-btn-disabled-bg": "var(--primary, #0f763f)",
        "--bs-btn-disabled-border-color": "var(--primary, #0f763f)",
        "--bs-btn-focus-shadow-rgb": "15, 118, 63",
      } as React.CSSProperties
    }
  >
    Search Patient
  </button>
</div>
                </form>

              ) : selectedPatient ? (
                <>
                  <div className="modal-body p-0 bg-white">
                    <div className="d-flex align-items-center justify-content-between px-3 py-2" style={{ backgroundColor: "#002b2b", color: "white" }}>
                      <div className="d-flex align-items-center gap-2">
                        <i className="isax isax-folder-2 fw-bold" />
                        <span className="fw-bold" style={{ fontSize: "0.75rem" }}>CONSULTATION RECORD</span>
                        <span className="ms-1 border-start ps-2 d-none d-sm-inline" style={{ fontSize: "0.65rem", opacity: 0.8 }}>
                          Patient Consultation And Confinement History
                        </span>
                      </div>
                    </div>
                    <div className="table-responsive" style={{ minHeight: "300px" }}>
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr style={{ fontSize: "0.75rem" }}>
                            <th className="ps-3 border-0 py-3">Date Of Consultation :</th>
                            <th className="border-0 py-3">Type Of Consultation :</th>
                            <th className="border-0 py-3 d-none d-sm-table-cell">Date Of Discharge :</th>
                          </tr>
                        </thead>
                        <tbody style={{ fontSize: "0.85rem" }}>
                          {consultationRecords.map((record, index) => (
                            <tr
                              key={index}
                              style={{ borderBottom: "1px solid #f1f1f1", cursor: "pointer" }}
                              onClick={() => handleConsultationRecordClick(selectedPatient!)}
                            >
                              <td className="ps-3 py-3">{record.date}</td>
                              <td className="py-3 fw-bold">{record.type}</td>
                              <td className="py-3 text-secondary d-none d-sm-table-cell">{record.discharge}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="modal-footer justify-content-between border-0 p-2" style={{ backgroundColor: "black", color: "white" }}>
                    <div className="ps-2 text-start">
                      <div className="fw-bold" style={{ fontSize: "0.85rem" }}>{consultationRecords.length} Record/s Found</div>
                      <div className="text-info" style={{ fontSize: "0.65rem" }}>Select and double click or hit Enter key to retrieve record.</div>
                    </div>
                    <button
                      className="btn btn-dark btn-sm d-flex align-items-center gap-2 px-3"
                      style={{ backgroundColor: "#1c2b46", border: "1px solid #333" }}
                      onClick={handleBackToList}
                    >
                      <i className="isax isax-arrow-left-2 small" />
                      <span className="small fw-bold">BACK TO PATIENT LIST</span>
                    </button>
                  </div>
                </>

              ) : (
                <>
                  <div className="modal-body p-0 bg-white">
                    <div className="table-responsive" style={{ minHeight: "300px" }}>
                      <table className="table table-hover mb-0">
                        <thead>
                          <tr style={{ fontSize: "0.8rem", borderBottom: "2px solid #dee2e6" }}>
                            <th className="ps-3 border-0 py-3">Hospital Number :</th>
                            <th className="border-0 py-3">Last Name :</th>
                            <th className="border-0 py-3">First Name :</th>
                            <th className="border-0 py-3 d-none d-sm-table-cell">Middle Name :</th>
                          </tr>
                        </thead>
                        <tbody style={{ fontSize: "0.85rem" }}>
                          {mockPatients.map((patient, index) => (
                            <tr
                              key={index}
                              style={{ cursor: "pointer", borderBottom: "1px solid #f1f1f1" }}
                              onClick={() => handlePatientSelect(patient.id)}
                            >
                              <td className="ps-3 py-3 text-secondary">{patient.id}</td>
                              <td className="py-3">{patient.lastName}</td>
                              <td className="py-3">{patient.firstName}</td>
                              <td className="py-3 d-none d-sm-table-cell">{patient.middleName}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="modal-footer justify-content-between border-0 p-3" style={{ backgroundColor: "black", color: "white" }}>
                    <div className="text-start">
                      <div className="fw-bold" style={{ fontSize: "0.9rem" }}>{mockPatients.length} Record/s Found</div>
                      <div className="fst-italic text-info" style={{ fontSize: "0.7rem" }}>Select a patient to retrieve record.</div>
                    </div>
                    <button
                      className="btn btn-sm d-flex align-items-center gap-2 px-3 py-2"
                      style={{ backgroundColor: "#1a2234", color: "white", border: "1px solid #333", borderRadius: "6px" }}
                      onClick={() => setIsSearching(false)}
                    >
                      <i className="isax isax-arrow-left-2" />
                      <span className="small fw-bold">BACK TO SEARCH</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorDashboard;