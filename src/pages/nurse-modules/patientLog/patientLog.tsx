import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setNurseMobileSidebar } from "@/core/redux/sidebarSlice";
import { all_routes } from "@/routes/all_routes";
import "../../doctor-modules/patientLog/patientLog.css";

type NursePatientLogType = "main-log" | "rooming-in";
type NursePatientLogStatus =
  | "Admitted"
  | "Pending Claim Req."
  | "Complete Claim Req."
  | "Return to Ward"
  | "For Billing"
  | "FSOA";

interface NursePatientLogRecord {
  hospitalNo: string;
  patientClass: string;
  patientName: string;
  modalPatientName: string;
  admissionDate: string;
  wardAssignment: string;
  lengthOfStay: string;
  billStatus: string;
  transitAction: string;
  transitDateTime: string;
  status: NursePatientLogStatus;
  type: NursePatientLogType;
}

const nursePatientLogTabs: {
  key: NursePatientLogType;
  label: string;
  icon: string;
}[] = [
  { key: "main-log", label: "Main Log", icon: "isax isax-user-tick" },
  { key: "rooming-in", label: "Rooming-In", icon: "isax isax-profile-2user" },
];

const nursePatientLogPageSizeOptions = [10, 20, 50, 100];
const defaultNursePatientLogPageSize = 10;

const nursePatientLogRecords: NursePatientLogRecord[] = [
  {
    hospitalNo: "000000000777288",
    patientClass: "",
    patientName: "DO, REA MON",
    modalPatientName: "DO, REA M.",
    admissionDate: "03-21-2026 02:45 PM",
    wardAssignment: "Ph Med",
    lengthOfStay: "0",
    billStatus: "",
    transitAction: "ADMIT",
    transitDateTime: "03/21/2026 03:01 PM",
    status: "Admitted",
    type: "main-log",
  },
];

const NursePatientLog = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeType, setActiveType] =
    useState<NursePatientLogType>("main-log");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWard, setSelectedWard] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultNursePatientLogPageSize);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [selectedTransit, setSelectedTransit] =
    useState<NursePatientLogRecord | null>(null);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const wardSelectRef = useRef<HTMLSelectElement | null>(null);

  const nurseMobileSidebar = useSelector(
    (state: any) => state.sidebar.nurseMobileSidebar
  );

  const isSidebarOpen = isMobileView
    ? nurseMobileSidebar
    : !isDesktopCollapsed;

  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth < 992;
      setIsMobileView(mobile);

      if (!mobile) {
        dispatch(setNurseMobileSidebar(false));
      }
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, [dispatch]);

  const wardOptions = useMemo(() => {
    return Array.from(
      new Set(nursePatientLogRecords.map((record) => record.wardAssignment))
    ).sort();
  }, []);

  const filteredRecords = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return nursePatientLogRecords.filter((record) => {
      const matchesType = record.type === activeType;
      const matchesWard =
        selectedWard === "all" || record.wardAssignment === selectedWard;
      const matchesSearch =
        !query ||
        record.patientName.toLowerCase().includes(query) ||
        record.hospitalNo.includes(query) ||
        record.wardAssignment.toLowerCase().includes(query) ||
        record.billStatus.toLowerCase().includes(query);

      return matchesType && matchesWard && matchesSearch;
    });
  }, [activeType, searchTerm, selectedWard]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
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
        value: filteredRecords.filter((record) => record.status === "Admitted")
          .length,
        icon: "isax isax-hospital",
      },
      {
        label: "Pending Claim Req.",
        value: filteredRecords.filter(
          (record) => record.status === "Pending Claim Req."
        ).length,
        icon: "isax isax-clock",
      },
      {
        label: "Complete Claim Req.",
        value: filteredRecords.filter(
          (record) => record.status === "Complete Claim Req."
        ).length,
        icon: "isax isax-tick-circle",
      },
      {
        label: "Return to Ward",
        value: filteredRecords.filter(
          (record) => record.status === "Return to Ward"
        ).length,
        icon: "isax isax-undo",
      },
      {
        label: "For Billing",
        value: filteredRecords.filter((record) => record.status === "For Billing")
          .length,
        icon: "isax isax-receipt-item",
      },
      {
        label: "FSOA",
        value: filteredRecords.filter((record) => record.status === "FSOA").length,
        icon: "isax isax-document-text",
      },
    ],
    [filteredRecords]
  );

  const toggleSidebar = () => {
    if (isMobileView) {
      dispatch(setNurseMobileSidebar(!nurseMobileSidebar));
      return;
    }

    setIsDesktopCollapsed((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    if (isMobileView) {
      dispatch(setNurseMobileSidebar(false));
    }
  };

  const openCollapsedControl = (control: "search" | "ward") => {
    if (isMobileView) {
      dispatch(setNurseMobileSidebar(true));
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

  const handlePatientTransitOpen = (record: NursePatientLogRecord) => {
    setSelectedTransit(record);
    closeMobileSidebar();
  };

  const handlePatientKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    record: NursePatientLogRecord
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handlePatientTransitOpen(record);
    }
  };

  const handleSaveTransit = () => {
    if (!selectedTransit) {
      return;
    }

    navigate(all_routes.nurseRegDetails, {
      state: { selectedPatientId: selectedTransit.hospitalNo },
    });
  };

  return (
    <>
      <style>{`
        .nurse-patient-log-tabs.patient-log-tabs {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .nurse-patient-log-summary.patient-log-summary {
          grid-template-columns: repeat(6, minmax(0, 1fr));
        }

        .nurse-patient-log-table {
          min-width: 940px;
        }

        .nurse-patient-log-table .patient-log-col-hospital {
          width: 150px;
        }

        .nurse-patient-log-table .nurse-patient-log-col-class {
          width: 90px;
        }

        .nurse-patient-log-table .patient-log-col-name {
          width: 250px;
        }

        .nurse-patient-log-table .patient-log-col-date {
          width: 170px;
        }

        .nurse-patient-log-table .nurse-patient-log-col-ward {
          width: 145px;
        }

        .nurse-patient-log-table .nurse-patient-log-col-los {
          width: 85px;
        }

        .nurse-patient-log-table .nurse-patient-log-col-bill {
          width: 130px;
        }

        .nurse-patient-log-table th:nth-child(2),
        .nurse-patient-log-table td:nth-child(2),
        .nurse-patient-log-table th:nth-child(4),
        .nurse-patient-log-table td:nth-child(4),
        .nurse-patient-log-table th:nth-child(5),
        .nurse-patient-log-table td:nth-child(5),
        .nurse-patient-log-table th:nth-child(6),
        .nurse-patient-log-table td:nth-child(6),
        .nurse-patient-log-table th:nth-child(7),
        .nurse-patient-log-table td:nth-child(7) {
          text-align: center;
        }

        .nurse-patient-log-table tbody tr.active td {
          background: #eaf7ef;
        }

        .nurse-patient-transit-modal {
          max-width: 740px;
        }

        .nurse-patient-transit-body {
          padding: 28px 24px 30px;
          text-align: center;
        }

        .nurse-patient-transit-system {
          color: #6c757d;
          font-size: 0.7rem;
          font-weight: 700;
          margin-top: 4px;
        }

        .nurse-patient-transit-patient {
          color: #5d6675;
          font-size: 0.86rem;
          font-weight: 800;
          letter-spacing: 0.2px;
          margin-top: 10px;
          text-transform: uppercase;
        }

        .nurse-patient-transit-action {
          color: #172033;
          font-size: 1.12rem;
          font-weight: 900;
          letter-spacing: 0.8px;
          line-height: 1;
          margin-top: 4px;
        }

        .nurse-patient-transit-time {
          width: min(100%, 420px);
          min-height: 58px;
          border: 2px solid rgba(15, 118, 63, 0.18);
          border-radius: 6px;
          background: var(--primary, #0f763f);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(1.55rem, 4vw, 2.1rem);
          font-weight: 500;
          line-height: 1;
          margin: 22px auto 16px;
          padding: 10px 16px;
          white-space: nowrap;
        }

        .nurse-patient-transit-note {
          color: #5d6675;
          font-size: 0.82rem;
          line-height: 1.45;
          margin: 0 auto;
          max-width: 560px;
        }

        .nurse-patient-transit-divider {
          width: min(100%, 520px);
          height: 1px;
          background: #edf0f2;
          margin: 20px auto 0;
        }

        .nurse-patient-log-mobile-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          margin-top: 12px;
        }

        .nurse-patient-log-mobile-grid span {
          display: block;
          color: #6c757d;
          font-size: 0.68rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .nurse-patient-log-mobile-grid strong {
          display: block;
          color: #172033;
          font-size: 0.82rem;
          line-height: 1.25;
          margin-top: 2px;
          word-break: break-word;
        }

        @media (max-width: 1199.98px) {
          .nurse-patient-log-summary.patient-log-summary {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 767.98px) {
          .nurse-patient-log-summary.patient-log-summary {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .nurse-patient-transit-body {
            padding: 22px 16px 24px;
          }
        }

        @media (max-width: 575.98px) {
          .nurse-patient-log-mobile-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div
        className="content nurse-content bg-light mt-n4"
        style={{ minHeight: "100vh" }}
      >
        <div className="container-fluid px-3 px-lg-5 pt-0">
          <div className="nurse-dashboard-layout patient-log-layout">
            {isMobileView && nurseMobileSidebar && (
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
                isMobileView && nurseMobileSidebar ? "sidebar-mobile-open" : "",
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
                    title={
                      !isSidebarOpen && !isMobileView ? "Patient Transit" : undefined
                    }
                  >
                    <i className="isax isax-profile-2user" />
                    <span>Patient Transit</span>
                  </button>
                </nav>

                <div className="patient-log-sidebar-filters">
                  <div className="patient-log-filter-group">
                    <label htmlFor="nurse-patient-log-search">Search Patient</label>
                    <div className="patient-log-search-wrap">
                      <i className="isax isax-search-normal-1" />
                      <input
                        ref={searchInputRef}
                        id="nurse-patient-log-search"
                        type="search"
                        className="form-control"
                        placeholder="Name or hospital no."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="patient-log-filter-group">
                    <label htmlFor="nurse-patient-log-ward-filter">
                      Filter by Ward
                    </label>
                    <select
                      ref={wardSelectRef}
                      id="nurse-patient-log-ward-filter"
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

                <div
                  className="patient-log-collapsed-tools"
                  aria-label="Patient log filters"
                >
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

            <div className="nurse-dashboard-main patient-log-main mt-4 mt-lg-0">
              <div className="card border-0 shadow-sm rounded-3 mb-4 patient-log-card">
                <div className="bg-white px-3 px-md-4 pt-4">
                  <div className="d-flex justify-content-between align-items-center gap-3 pb-4 border-bottom patient-log-page-head">
                    <div className="d-flex align-items-center gap-3 min-width-0">
                      <button
                        type="button"
                        className="patient-log-main-menu-btn"
                        aria-label="Open patient log menu"
                        title="Open patient log menu"
                        onClick={toggleSidebar}
                      >
                        <i className="fa-solid fa-bars" />
                      </button>

                      <div className="patient-log-page-icon">
                        <i className="isax isax-document-text fs-3" />
                      </div>

                      <div className="min-width-0">
                        <h4 className="fw-bold mb-1 text-dark text-uppercase text-truncate">
                          Patient Log
                        </h4>
                        <p className="text-muted small mb-0">
                          Click a patient row to record ward arrival.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="patient-log-close-btn"
                      aria-label="Back to nurse dashboard"
                      title="Back to nurse dashboard"
                      onClick={() => navigate(all_routes.nurseDashboard)}
                    >
                      <i className="isax isax-close-circle" />
                    </button>
                  </div>
                </div>

                <div
                  className="patient-log-tabs nurse-patient-log-tabs"
                  role="tablist"
                  aria-label="Patient log type"
                >
                  {nursePatientLogTabs.map((tab) => (
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

                <div
                  className="patient-log-summary nurse-patient-log-summary"
                  aria-label="Patient log summary"
                >
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
                    <table className="table align-middle mb-0 patient-log-table nurse-patient-log-table">
                      <colgroup>
                        <col className="patient-log-col-hospital" />
                        <col className="nurse-patient-log-col-class" />
                        <col className="patient-log-col-name" />
                        <col className="patient-log-col-date" />
                        <col className="nurse-patient-log-col-ward" />
                        <col className="nurse-patient-log-col-los" />
                        <col className="nurse-patient-log-col-bill" />
                      </colgroup>
                      <thead>
                        <tr>
                          <th>Hospital Number</th>
                          <th>Class</th>
                          <th>Patient Name</th>
                          <th>Date of Admission</th>
                          <th>Ward Assignment</th>
                          <th>LOS</th>
                          <th>Bill Status</th>
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
                              className={
                                selectedTransit?.hospitalNo === record.hospitalNo
                                  ? "active"
                                  : ""
                              }
                              role="button"
                              tabIndex={0}
                              onClick={() => handlePatientTransitOpen(record)}
                              onKeyDown={(event) =>
                                handlePatientKeyDown(event, record)
                              }
                            >
                              <td
                                className="text-muted patient-log-nowrap-cell"
                                title={record.hospitalNo}
                              >
                                {record.hospitalNo}
                              </td>
                              <td>{record.patientClass}</td>
                              <td className="patient-log-name-cell">
                                <div className="patient-log-name-content">
                                  <span title={record.patientName}>
                                    {record.patientName}
                                  </span>
                                </div>
                              </td>
                              <td>{record.admissionDate}</td>
                              <td>
                                <span className="patient-log-ward-badge">
                                  {record.wardAssignment}
                                </span>
                              </td>
                              <td>{record.lengthOfStay}</td>
                              <td>{record.billStatus}</td>
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
                          onClick={() => handlePatientTransitOpen(record)}
                          onKeyDown={(event) =>
                            handlePatientKeyDown(event, record)
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
                              {record.wardAssignment}
                            </span>
                          </div>

                          <div className="nurse-patient-log-mobile-grid">
                            <div>
                              <span>Date of Admission</span>
                              <strong>{record.admissionDate}</strong>
                            </div>
                            <div>
                              <span>LOS</span>
                              <strong>{record.lengthOfStay}</strong>
                            </div>
                            <div>
                              <span>Class</span>
                              <strong>{record.patientClass || "---"}</strong>
                            </div>
                            <div>
                              <span>Bill Status</span>
                              <strong>{record.billStatus || "---"}</strong>
                            </div>
                          </div>
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
                          onChange={(event) =>
                            setPageSize(Number(event.target.value))
                          }
                        >
                          {nursePatientLogPageSizeOptions.map((option) => (
                            <option value={option} key={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div
                      className="patient-log-pagination-actions"
                      aria-label="Patient log pagination"
                    >
                      <button
                        type="button"
                        className="patient-log-page-btn"
                        aria-label="Previous page"
                        disabled={safeCurrentPage === 1}
                        onClick={() =>
                          setCurrentPage((page) => Math.max(1, page - 1))
                        }
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
                          aria-current={
                            safeCurrentPage === page ? "page" : undefined
                          }
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

      {selectedTransit && (
        <div
          className="patient-log-details-backdrop"
          onClick={() => setSelectedTransit(null)}
        >
          <div
            className="patient-log-details-modal nurse-patient-transit-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Patient transit utility"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="patient-log-details-header">
              <div className="min-width-0">
                <div className="patient-log-details-label">
                  Patient Transit Utility
                </div>
                <h5>Ward Module</h5>
                <p className="nurse-patient-transit-system">
                  Integrated Hospital Operation and Management Information System
                </p>
              </div>

              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setSelectedTransit(null)}
              />
            </div>

            <div className="nurse-patient-transit-body">
              <div className="nurse-patient-transit-patient">
                {selectedTransit.modalPatientName}
              </div>
              <div className="nurse-patient-transit-action">
                {selectedTransit.transitAction}
              </div>

              <div className="nurse-patient-transit-time">
                {selectedTransit.transitDateTime}
              </div>

              <p className="nurse-patient-transit-note">
                This interface records the date and time of arrival of patient
                from admission or transfer from other ward. This interface will
                activate the patient record once the date has been saved.
              </p>

              <div className="nurse-patient-transit-divider" />
            </div>

            <div className="patient-log-details-footer">
              <button
                type="button"
                className="btn btn-sm border fw-bold px-3"
                onClick={() => setSelectedTransit(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-sm text-white fw-bold px-3 patient-log-open-record-btn"
                onClick={handleSaveTransit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NursePatientLog;
