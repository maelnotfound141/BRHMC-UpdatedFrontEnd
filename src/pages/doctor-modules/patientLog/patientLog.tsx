import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setDoctorMobileSidebar } from "@/core/redux/sidebarSlice";
import { all_routes } from "@/routes/all_routes";
import "./patientLog.css";

type PatientLogType = "admission" | "erd" | "opd";
type PatientLogStatus = "Admitted" | "Under My Care" | "May Go Home" | "Disposed";

interface PatientLogRecord {
  hospitalNo: string;
  patientName: string;
  admissionDate: string;
  ward: string;
  lengthOfStay: string;
  service: string;
  account: string;
  mghDate: string;
  disposition: string;
  attendingPhysician: string;
  status: PatientLogStatus;
  withPhilHealth: boolean;
  type: PatientLogType;
}

const patientLogTabs: { key: PatientLogType; label: string; icon: string }[] = [
  { key: "admission", label: "Admission", icon: "isax isax-hospital" },
  { key: "erd", label: "ERD", icon: "isax isax-hospital" },
  { key: "opd", label: "OPD", icon: "isax isax-profile-2user" },
];

const patientLogPageSizeOptions = [10, 20, 50, 100];
const defaultPatientLogPageSize = 10;

const patientLogRecords: PatientLogRecord[] = [
  {
    hospitalNo: "000000000777288",
    patientName: "DO, REA MON",
    admissionDate: "03/21/2026",
    ward: "Ph Med",
    lengthOfStay: "0d, 6h",
    service: "Medicine",
    account: "Service",
    mghDate: "---",
    disposition: "---",
    attendingPhysician: "ROWAN M. LIQUE MD",
    status: "Under My Care",
    withPhilHealth: true,
    type: "admission",
  },
    {
    hospitalNo: "000000000777288",
    patientName: "DO, REA MON",
    admissionDate: "03/21/2026",
    ward: "Ph Med",
    lengthOfStay: "0d, 6h",
    service: "Medicine",
    account: "Service",
    mghDate: "---",
    disposition: "---",
    attendingPhysician: "ROWAN M. LIQUE MD",
    status: "Under My Care",
    withPhilHealth: true,
    type: "admission",
  },
    {
    hospitalNo: "000000000777288",
    patientName: "DO, REA MON",
    admissionDate: "03/21/2026",
    ward: "Ph Med",
    lengthOfStay: "0d, 6h",
    service: "Medicine",
    account: "Service",
    mghDate: "---",
    disposition: "---",
    attendingPhysician: "ROWAN M. LIQUE MD",
    status: "Under My Care",
    withPhilHealth: true,
    type: "admission",
  },
    {
    hospitalNo: "000000000777288",
    patientName: "DO, REA MON",
    admissionDate: "03/21/2026",
    ward: "Ph Med",
    lengthOfStay: "0d, 6h",
    service: "Medicine",
    account: "Service",
    mghDate: "---",
    disposition: "---",
    attendingPhysician: "ROWAN M. LIQUE MD",
    status: "Under My Care",
    withPhilHealth: true,
    type: "admission",
  },
    {
    hospitalNo: "000000000777288",
    patientName: "DO, REA MON",
    admissionDate: "03/21/2026",
    ward: "Ph Med",
    lengthOfStay: "0d, 6h",
    service: "Medicine",
    account: "Service",
    mghDate: "---",
    disposition: "---",
    attendingPhysician: "ROWAN M. LIQUE MD",
    status: "Under My Care",
    withPhilHealth: true,
    type: "admission",
  },
    {
    hospitalNo: "000000000777288",
    patientName: "DO, REA MON",
    admissionDate: "03/21/2026",
    ward: "Ph Med",
    lengthOfStay: "0d, 6h",
    service: "Medicine",
    account: "Service",
    mghDate: "---",
    disposition: "---",
    attendingPhysician: "ROWAN M. LIQUE MD",
    status: "Under My Care",
    withPhilHealth: true,
    type: "admission",
  },
    {
    hospitalNo: "000000000777288",
    patientName: "DO, REA MON",
    admissionDate: "03/21/2026",
    ward: "Ph Med",
    lengthOfStay: "0d, 6h",
    service: "Medicine",
    account: "Service",
    mghDate: "---",
    disposition: "---",
    attendingPhysician: "ROWAN M. LIQUE MD",
    status: "Under My Care",
    withPhilHealth: true,
    type: "admission",
  },
    {
    hospitalNo: "000000000777288",
    patientName: "DO, REA MON",
    admissionDate: "03/21/2026",
    ward: "Ph Med",
    lengthOfStay: "0d, 6h",
    service: "Medicine",
    account: "Service",
    mghDate: "---",
    disposition: "---",
    attendingPhysician: "ROWAN M. LIQUE MD",
    status: "Under My Care",
    withPhilHealth: true,
    type: "admission",
  },
    {
    hospitalNo: "000000000777288",
    patientName: "DO, REA MON",
    admissionDate: "03/21/2026",
    ward: "Ph Med",
    lengthOfStay: "0d, 6h",
    service: "Medicine",
    account: "Service",
    mghDate: "---",
    disposition: "---",
    attendingPhysician: "ROWAN M. LIQUE MD",
    status: "Under My Care",
    withPhilHealth: true,
    type: "admission",
  },
  {
    hospitalNo: "000000000777289",
    patientName: "DELA CRUZ, JUAN PROFILO JR",
    admissionDate: "03/22/2026",
    ward: "Pedia",
    lengthOfStay: "1d, 2h",
    service: "Pediatrics",
    account: "Service",
    mghDate: "---",
    disposition: "---",
    attendingPhysician: "ROWAN M. LIQUE MD",
    status: "Admitted",
    withPhilHealth: false,
    type: "admission",
  },
  {
    hospitalNo: "000000000777290",
    patientName: "GAN, HENRY GREGORIO",
    admissionDate: "03/23/2026",
    ward: "Mental",
    lengthOfStay: "69d, 4h",
    service: "Surgery",
    account: "Pay",
    mghDate: "03/25/2026",
    disposition: "May go home",
    attendingPhysician: "ROWAN M. LIQUE MD",
    status: "May Go Home",
    withPhilHealth: true,
    type: "admission",
  },
  {
    hospitalNo: "000000000777291",
    patientName: "REYES, ANTONIO LUIS",
    admissionDate: "03/24/2026",
    ward: "ERD",
    lengthOfStay: "0d, 3h",
    service: "Emergency",
    account: "Service",
    mghDate: "---",
    disposition: "---",
    attendingPhysician: "ROWAN M. LIQUE MD",
    status: "Under My Care",
    withPhilHealth: true,
    type: "erd",
  },
  {
    hospitalNo: "000000000777292",
    patientName: "GARCIA, ELAINE MARI",
    admissionDate: "03/24/2026",
    ward: "ERD",
    lengthOfStay: "0d, 1h",
    service: "Emergency",
    account: "Pay",
    mghDate: "---",
    disposition: "Transferred",
    attendingPhysician: "ROWAN M. LIQUE MD",
    status: "Disposed",
    withPhilHealth: false,
    type: "erd",
  },
  {
    hospitalNo: "000000000777293",
    patientName: "GAN, HENRY GREGORIO",
    admissionDate: "03/25/2026",
    ward: "OPD",
    lengthOfStay: "0d, 0h",
    service: "Consultation",
    account: "Service",
    mghDate: "---",
    disposition: "---",
    attendingPhysician: "ROWAN M. LIQUE MD",
    status: "Admitted",
    withPhilHealth: true,
    type: "opd",
  },
];

const PatientLog = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeType, setActiveType] = useState<PatientLogType>("admission");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWard, setSelectedWard] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPatientLogPageSize);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<PatientLogRecord | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const wardSelectRef = useRef<HTMLSelectElement | null>(null);

  const doctorMobileSidebar = useSelector(
    (state: any) => state.sidebar.doctorMobileSidebar
  );

  const isSidebarOpen = isMobileView
    ? doctorMobileSidebar
    : !isDesktopCollapsed;

  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth < 992;
      setIsMobileView(mobile);

      if (!mobile) {
        dispatch(setDoctorMobileSidebar(false));
      }
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, [dispatch]);

  const wardOptions = useMemo(() => {
    return Array.from(new Set(patientLogRecords.map((record) => record.ward))).sort();
  }, []);

  const filteredRecords = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return patientLogRecords.filter((record) => {
      const matchesType = record.type === activeType;
      const matchesWard = selectedWard === "all" || record.ward === selectedWard;
      const matchesSearch =
        !query ||
        record.patientName.toLowerCase().includes(query) ||
        record.hospitalNo.includes(query) ||
        record.attendingPhysician.toLowerCase().includes(query);

      return matchesType && matchesWard && matchesSearch;
    });
  }, [activeType, searchTerm, selectedWard]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / pageSize)
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const pageStart = (safeCurrentPage - 1) * pageSize;
  const pageEnd = Math.min(pageStart + pageSize, filteredRecords.length);

  const paginatedRecords = useMemo(() => {
    return filteredRecords.slice(pageStart, pageEnd);
  }, [filteredRecords, pageEnd, pageStart]);

  const paginationPages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeType, pageSize, searchTerm, selectedWard]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const summaryCards = useMemo(
    () => [
      {
        label: "Admitted",
        value: filteredRecords.filter((record) => record.status !== "Disposed").length,
        icon: "isax isax-hospital",
      },
      {
        label: "Under My Care",
        value: filteredRecords.filter((record) => record.status === "Under My Care").length,
        icon: "isax isax-user-tick",
      },
      {
        label: "w/ PhilHealth",
        value: filteredRecords.filter((record) => record.withPhilHealth).length,
        icon: "isax isax-shield-tick",
      },
      {
        label: "May go home",
        value: filteredRecords.filter((record) => record.status === "May Go Home").length,
        icon: "isax isax-home",
      },
      {
        label: "Disposed",
        value: filteredRecords.filter((record) => record.status === "Disposed").length,
        icon: "isax isax-export-1",
      },
    ],
    [filteredRecords]
  );

  const toggleSidebar = () => {
    if (isMobileView) {
      dispatch(setDoctorMobileSidebar(!doctorMobileSidebar));
      return;
    }

    setIsDesktopCollapsed((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    if (isMobileView) {
      dispatch(setDoctorMobileSidebar(false));
    }
  };

  const openCollapsedControl = (control: "search" | "ward") => {
    if (isMobileView) {
      dispatch(setDoctorMobileSidebar(true));
      return;
    }

    setIsDesktopCollapsed(false);

    window.setTimeout(() => {
      if (control === "search") {
        searchInputRef.current?.focus();
        return;
      }

      wardSelectRef.current?.focus();
    }, 0);
  };

  const handlePatientOpen = (patientId: string) => {
    navigate(all_routes.doctorMypatients, {
      state: { selectedPatientId: patientId },
    });
    closeMobileSidebar();
  };

  const handlePatientRowClick = (patientId: string) => {
    if (isMobileView) {
      handlePatientOpen(patientId);
    }
  };

  const handlePatientRowDoubleClick = (patientId: string) => {
    if (!isMobileView) {
      handlePatientOpen(patientId);
    }
  };

  const handlePatientKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    patientId: string
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handlePatientOpen(patientId);
    }
  };

  return (
    <>
      <div
        className="content doctor-content bg-light mt-n4"
        style={{ minHeight: "100vh" }}
      >
        <div className="container-fluid px-3 px-lg-5 pt-0">
          <div className="doctor-dashboard-layout patient-log-layout">
            {isMobileView && doctorMobileSidebar && (
              <div
                className="patient-log-mobile-backdrop"
                onClick={closeMobileSidebar}
                aria-hidden="true"
              />
            )}

            <aside
              className={[
                "patient-log-sidebar-wrap",
                isSidebarOpen ? "sidebar-expanded" : "sidebar-collapsed",
                isMobileView && doctorMobileSidebar ? "sidebar-mobile-open" : "",
              ].join(" ")}
            >
              <div className="patient-log-sidebar-card">
                <button
                  type="button"
                  className="patient-log-menu-toggle"
                  aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                  title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                  onClick={toggleSidebar}
                >
                  <i className="fa-solid fa-bars" />
                </button>

                <div className="patient-log-sidebar-profile">
                  <div className="patient-log-sidebar-icon">
                    <i className="isax isax-document-text" />
                  </div>

                  <h4 className="patient-log-sidebar-title">Patient Log</h4>
                  <p className="patient-log-sidebar-subtitle">
                    Ward patient records
                  </p>
                </div>

                <nav className="patient-log-sidebar-menu" aria-label="Patient log">
                  <button
                    type="button"
                    className="patient-log-sidebar-menu-btn active"
                    title={!isSidebarOpen && !isMobileView ? "Patient Record" : undefined}
                  >
                    <i className="isax isax-profile-2user" />
                    <span>Patient Record</span>
                  </button>
                </nav>

                <div className="patient-log-sidebar-filters">
                  <div className="patient-log-filter-group">
                    <label htmlFor="patient-log-search">Search Patient</label>
                    <div className="patient-log-search-wrap">
                      <i className="isax isax-search-normal-1" />
                      <input
                        ref={searchInputRef}
                        id="patient-log-search"
                        type="search"
                        className="form-control"
                        placeholder="Name or hospital no."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="patient-log-filter-group">
                    <label htmlFor="patient-log-ward-filter">Filter by Ward</label>
                    <select
                      ref={wardSelectRef}
                      id="patient-log-ward-filter"
                      className="form-select"
                      value={selectedWard}
                      onChange={(event) => setSelectedWard(event.target.value)}
                    >
                      <option value="all">All wards</option>
                      {wardOptions.map((ward) => (
                        <option value={ward} key={ward}>
                          {ward}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="patient-log-collapsed-tools" aria-label="Patient log filters">
                  <button
                    type="button"
                    className="patient-log-collapsed-tool-btn"
                    aria-label="Search patient"
                    title="Search patient"
                    onClick={() => openCollapsedControl("search")}
                  >
                    <i className="isax isax-search-normal-1" />
                  </button>

                  <button
                    type="button"
                    className="patient-log-collapsed-tool-btn"
                    aria-label="Filter by ward"
                    title="Filter by ward"
                    onClick={() => openCollapsedControl("ward")}
                  >
                    <i className="isax isax-filter" />
                  </button>
                </div>
              </div>
            </aside>

            <div className="doctor-dashboard-main patient-log-main mt-4 mt-lg-0">
              <div className="card border-0 shadow-sm rounded-3 mb-4 patient-log-card">
                <div className="bg-white px-3 px-md-4 pt-4">
                  <div className="d-flex justify-content-between align-items-center gap-3 pb-4 border-bottom patient-log-page-head">
                    <div className="d-flex align-items-center gap-3 min-width-0">
                   

                      <div className="patient-log-page-icon">
                        <i className="isax isax-document-text fs-3" />
                      </div>

                      <div className="min-width-0">
                        <h4 className="fw-bold mb-1 text-dark text-uppercase text-truncate">
                          Patient Log
                        </h4>
                        <p className="text-muted small mb-0">
                          {isMobileView
                            ? "Tap a patient to open the patient account record"
                            : "Double-click a patient to open the patient account record"}
                        </p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3 flex-shrink-0 patient-log-head-actions">
                      <div className="text-end d-none d-md-block">
                        <div className="fw-bold text-dark patient-log-physician-name">
                          ROWAN M. LIQUE MD
                        </div>
                        <div className="text-muted small">Department of Medicine</div>
                      </div>

                      <button
                        type="button"
                        className="patient-log-close-btn"
                        aria-label="Back to doctor dashboard"
                        title="Back to doctor dashboard"
                        onClick={() => navigate(all_routes.doctorDashboard)}
                      >
                        <i className="isax isax-close-circle" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="patient-log-tabs" role="tablist" aria-label="Patient log type">
                  {patientLogTabs.map((tab) => (
                    <button
                      type="button"
                      key={tab.key}
                      className={`patient-log-tab-btn ${
                        activeType === tab.key ? "active" : ""
                      }`}
                      role="tab"
                      aria-selected={activeType === tab.key}
                      onClick={() => setActiveType(tab.key)}
                    >
                      <i className={tab.icon} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                <div className="patient-log-summary" aria-label="Patient log summary">
                  {summaryCards.map((item) => (
                    <div className="patient-log-summary-item" key={item.label}>
                      <i className={item.icon} />
                      <div>
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="patient-log-table-shell">
           

                  <div className="table-responsive patient-log-table-wrap d-none d-md-block">
                    <table className="table align-middle mb-0 patient-log-table">
                      <colgroup>
                        <col className="patient-log-col-hospital" />
                        <col className="patient-log-col-name" />
                        <col className="patient-log-col-date" />
                        <col className="patient-log-col-ward" />
                        <col className="patient-log-col-los" />
                        <col className="patient-log-col-service" />
                        <col className="patient-log-col-action" />
                      </colgroup>
                      <thead>
                        <tr>
                          <th>Hospital No</th>
                          <th>Patient Name</th>
                          <th>Date of Admission</th>
                          <th>Ward</th>
                          <th>Length of Stay</th>
                          <th>Type of Service</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecords.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="patient-log-empty-cell">
                              <div className="patient-log-empty-state">
                                <i className="isax isax-document-text" />
                                <h6>No patient records found</h6>
                                <p>Try a different search term, ward, or log type.</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          paginatedRecords.map((record, index) => (
                            <tr
                              key={`${record.hospitalNo}-${pageStart + index}`}
                              role="button"
                              tabIndex={0}
                              onClick={() => handlePatientRowClick(record.hospitalNo)}
                              onDoubleClick={() =>
                                handlePatientRowDoubleClick(record.hospitalNo)
                              }
                              onKeyDown={(event) =>
                                handlePatientKeyDown(event, record.hospitalNo)
                              }
                            >
                              <td className="text-muted patient-log-nowrap-cell" title={record.hospitalNo}>
                                {record.hospitalNo}
                              </td>
                              <td className="patient-log-name-cell">
                                <div className="patient-log-name-content">
                                  <span title={record.patientName}>{record.patientName}</span>
                                </div>
                              </td>
                              <td>{record.admissionDate}</td>
                              <td>
                                <span className="patient-log-ward-badge">
                                  {record.ward}
                                </span>
                              </td>
                              <td>{record.lengthOfStay}</td>
                              <td>{record.service}</td>
                              <td className="patient-log-action-cell">
                                <button
                                  type="button"
                                  className="patient-log-view-more-btn"
                                  aria-label={`View details for ${record.patientName}`}
                                  title={`View details for ${record.patientName}`}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setSelectedDetails(record);
                                  }}
                                  onKeyDown={(event) => event.stopPropagation()}
                                >
                                  <i className="isax isax-eye" />
                                  <span>Details</span>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="patient-log-mobile-list d-md-none">
                    {filteredRecords.length === 0 ? (
                      <div className="patient-log-empty-state">
                        <i className="isax isax-document-text" />
                        <h6>No patient records found</h6>
                        <p>Try a different search term, ward, or log type.</p>
                      </div>
                    ) : (
                      paginatedRecords.map((record, index) => (
                        <div
                          className="patient-log-mobile-card"
                          key={`${record.hospitalNo}-${pageStart + index}`}
                          role="button"
                          tabIndex={0}
                          onClick={() => handlePatientOpen(record.hospitalNo)}
                          onKeyDown={(event) =>
                            handlePatientKeyDown(event, record.hospitalNo)
                          }
                        >
                          <div className="d-flex justify-content-between align-items-start gap-2">
                            <div className="min-width-0">
                              <div className="patient-log-mobile-name">
                                {record.patientName}
                              </div>
                              <div className="text-muted small">
                                {record.hospitalNo}
                              </div>
                            </div>
                            <span className="patient-log-ward-badge">
                              {record.ward}
                            </span>
                          </div>

                          <button
                            type="button"
                            className="patient-log-mobile-view-more"
                            aria-label={`View details for ${record.patientName}`}
                            title={`View details for ${record.patientName}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedDetails(record);
                            }}
                            onKeyDown={(event) => event.stopPropagation()}
                          >
                            <i className="isax isax-eye" />
                            <span>Details</span>
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  </div>

                <div className="patient-log-sticky-footer">
                  <div className="patient-log-pagination">
                    <div className="patient-log-pagination-meta">
                      <div className="patient-log-pagination-info">
                        {filteredRecords.length === 0
                          ? "Showing 0 of 0 records"
                          : `Showing ${pageStart + 1}-${pageEnd} of ${
                              filteredRecords.length
                            } records`}
                      </div>

                      <label className="patient-log-page-size">
                        <span>Show</span>
                        <select
                          value={pageSize}
                          onChange={(event) => setPageSize(Number(event.target.value))}
                        >
                          {patientLogPageSizeOptions.map((option) => (
                            <option value={option} key={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="patient-log-pagination-actions" aria-label="Patient log pagination">
                      <button
                        type="button"
                        className="patient-log-page-btn"
                        aria-label="Previous page"
                        disabled={safeCurrentPage === 1}
                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      >
                        <i className="isax isax-arrow-left-2" />
                      </button>

                      {paginationPages.map((page) => (
                        <button
                          type="button"
                          key={page}
                          className={`patient-log-page-btn ${
                            safeCurrentPage === page ? "active" : ""
                          }`}
                          aria-label={`Go to page ${page}`}
                          aria-current={safeCurrentPage === page ? "page" : undefined}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        type="button"
                        className="patient-log-page-btn"
                        aria-label="Next page"
                        disabled={safeCurrentPage === totalPages}
                        onClick={() =>
                          setCurrentPage((page) => Math.min(totalPages, page + 1))
                        }
                      >
                        <i className="isax isax-arrow-right-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedDetails && (
        <div
          className="patient-log-details-backdrop"
          onClick={() => setSelectedDetails(null)}
        >
          <div
            className="patient-log-details-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Patient log details"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="patient-log-details-header">
              <div className="min-width-0">
                <div className="patient-log-details-label">Patient Log Details</div>
                <h5>{selectedDetails.patientName}</h5>
                <p>{selectedDetails.hospitalNo}</p>
              </div>

              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setSelectedDetails(null)}
              />
            </div>

            <div className="patient-log-details-body">
              {[
                { label: "Hospital No", value: selectedDetails.hospitalNo },
                { label: "Patient Name", value: selectedDetails.patientName },
                { label: "Date of Admission", value: selectedDetails.admissionDate },
                { label: "Ward", value: selectedDetails.ward },
                { label: "Length of Stay", value: selectedDetails.lengthOfStay },
                { label: "Type of Service", value: selectedDetails.service },
                { label: "Type of Account", value: selectedDetails.account },
                { label: "MGH Date", value: selectedDetails.mghDate },
                { label: "Disposition", value: selectedDetails.disposition },
                { label: "Attending Physician", value: selectedDetails.attendingPhysician },
                {
                  label: "PhilHealth",
                  value: selectedDetails.withPhilHealth ? "With PhilHealth" : "No PhilHealth",
                },
                { label: "Status", value: selectedDetails.status },
              ].map((item) => (
                <div className="patient-log-details-item" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>

            <div className="patient-log-details-footer">
              <button
                type="button"
                className="btn btn-sm border fw-bold px-3"
                onClick={() => setSelectedDetails(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-sm text-white fw-bold px-3 patient-log-open-record-btn"
                onClick={() => handlePatientOpen(selectedDetails.hospitalNo)}
              >
                <i className="isax isax-arrow-right-3 me-1" />
                Open Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PatientLog;
