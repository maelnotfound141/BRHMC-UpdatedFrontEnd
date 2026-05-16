import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setDoctorMobileSidebar } from "@/core/redux/sidebarSlice";
import { doctorSidebarData } from "@/core/data/json/doctorSidebarData";

import testprintHtml from "@/pages/doctor-modules/printableForms/testprint.html?raw";

const FORM_TABS = [
  { id: "patient-history", label: "Patient History" },
  { id: "discharge-instruction", label: "Discharge Instruction" },
  { id: "discharge-summary", label: "Discharge Summary" },
  { id: "medical-abstract", label: "Medical Abstract" },
  { id: "claim-form-4", label: "Claim Form 4" },
  { id: "archive-file", label: "Archive File" },
];

const SIDEBAR_COLLAPSED_KEY = "doctor-sidebar-desktop-collapsed";

const DoctorSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const doctorMobileSidebar = useSelector(
    (state: any) => state.sidebar.doctorMobileSidebar
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(FORM_TABS[0].id);
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(false);

  const [isMobileView, setIsMobileView] = useState(false);

  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;

    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
  });

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem(
      SIDEBAR_COLLAPSED_KEY,
      isDesktopCollapsed ? "true" : "false"
    );
  }, [isDesktopCollapsed]);

  useEffect(() => {
    if (!isMobileView) {
      document.documentElement.classList.remove("doctor-sidebar-mobile-open");
      return;
    }

    if (doctorMobileSidebar) {
      document.documentElement.classList.add("doctor-sidebar-mobile-open");
    } else {
      document.documentElement.classList.remove("doctor-sidebar-mobile-open");
    }

    return () => {
      document.documentElement.classList.remove("doctor-sidebar-mobile-open");
    };
  }, [isMobileView, doctorMobileSidebar]);

  const isActive = (item: typeof doctorSidebarData[0]) => {
    const p = item.path;

    if (location.pathname === p) return true;
    if (location.pathname.startsWith(`${p}/`)) return true;
    if (item.relativeLinks?.includes(location.pathname)) return true;

    return false;
  };

  const toggleDesktopSidebar = () => {
    setIsDesktopCollapsed((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    if (isMobileView) {
      dispatch(setDoctorMobileSidebar(false));
    }
  };

  const openModal = () => {
    if (!isSidebarOpen && !isMobileView) return;

    setActiveTab(FORM_TABS[0].id);
    setIsLoading(true);
    setIsModalOpen(true);

    setTimeout(() => setIsLoading(false), 700);
  };

  const handleTabClick = (id: string) => {
    if (id === activeTab) return;

    setActiveTab(id);
    setIsLoading(true);

    setTimeout(() => setIsLoading(false), 500);
  };

  const printDoc = (html: string) => {
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;

    win.document.write(html);
    win.document.close();
    win.addEventListener("load", () => setTimeout(() => win.print(), 300));
  };

  const handlePrintCurrent = () => printDoc(testprintHtml);

  const handlePrintAll = () =>
    printDoc(
      FORM_TABS.map(() => testprintHtml).join(
        `<div style="page-break-after:always"></div>`
      )
    );

  const zoomIn = () => setZoom((z) => Math.min(z + 10, 200));
  const zoomOut = () => setZoom((z) => Math.max(z - 10, 30));

  const onZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);

    if (!isNaN(v)) {
      setZoom(Math.min(Math.max(v, 30), 200));
    }
  };

  return (
    <>
      <style>{`
        .doctor-sidebar-responsive-wrap {
          position: relative;
          flex: 0 0 280px;
          max-width: 280px;
          transition: all 0.25s ease;
          z-index: 20;
        }

        .doctor-sidebar-responsive-wrap.sidebar-collapsed {
          flex: 0 0 78px;
          max-width: 78px;
        }

        .doctor-sidebar-responsive-wrap .profile-sidebar {
          position: sticky;
          top: 105px;
          width: 100%;
          overflow: hidden;
          transition: all 0.25s ease;
        }

        .doctor-desktop-collapse-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 25;
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 6px;
          background: transparent !important;
          color: var(--primary, #0f763f);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: none !important;
          transition: all 0.2s ease;
          padding: 0;
          cursor: pointer;
        }

        .doctor-desktop-collapse-btn:hover {
          background: rgba(15, 118, 63, 0.08) !important;
          color: var(--primary, #0f763f);
          transform: none;
        }

        .doctor-desktop-collapse-btn:focus,
        .doctor-desktop-collapse-btn:active {
          outline: none;
          box-shadow: none !important;
          background: transparent !important;
          color: var(--primary, #0f763f);
        }

        .doctor-desktop-collapse-btn i {
          font-size: 20px;
          color: var(--primary, #0f763f);
          line-height: 1;
        }

        .doctor-sidebar-responsive-wrap.sidebar-collapsed .doctor-desktop-collapse-btn {
          top: 14px;
          left: 50%;
          right: auto;
          transform: translateX(-50%);
        }

        .doctor-sidebar-responsive-wrap.sidebar-expanded .widget-profile {
          padding-top: 54px !important;
        }

        .doctor-sidebar-responsive-wrap.sidebar-collapsed .widget-profile {
          padding: 54px 8px 14px !important;
        }

        .doctor-sidebar-responsive-wrap.sidebar-collapsed .profile-det-info h3,
        .doctor-sidebar-responsive-wrap.sidebar-collapsed .patient-details,
        .doctor-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu span,
        .doctor-sidebar-responsive-wrap.sidebar-collapsed .unread-msg {
          display: none !important;
        }

        .doctor-sidebar-responsive-wrap.sidebar-collapsed .profile-info-widget {
          justify-content: center !important;
        }

        .doctor-sidebar-responsive-wrap.sidebar-collapsed .profile-det-info {
          width: 100%;
        }

        .doctor-sidebar-responsive-wrap.sidebar-collapsed .profile-det-info .mb-3 {
          font-size: 1.45rem !important;
          margin: 0 !important;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .doctor-sidebar-responsive-wrap.sidebar-collapsed .dashboard-widget {
          padding: 0 !important;
        }

        .doctor-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu {
          padding: 0 !important;
          margin: 0 !important;
        }

        .doctor-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul {
          padding: 0 !important;
          margin: 0 !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .doctor-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul li {
          width: 100%;
          margin: 0 !important;
          padding: 0 8px !important;
        }

        .doctor-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul li a {
          width: 42px;
          height: 42px;
          min-height: 42px;
          margin: 0 auto !important;
          padding: 0 !important;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }

        .doctor-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul li a i {
          margin: 0 !important;
          padding: 0 !important;
          font-size: 17px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .doctor-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul li.active a {
          background: var(--primary, #0f763f) !important;
          color: #fff !important;
        }

        .doctor-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul li.active a i {
          color: #fff !important;
        }

        .doctor-sidebar-mobile-backdrop {
          display: none;
        }

        @media (min-width: 992px) {
          .doctor-sidebar-responsive-wrap.sidebar-expanded {
            flex-basis: 280px;
            max-width: 280px;
          }
        }

        @media (max-width: 991.98px) {
          .doctor-sidebar-responsive-wrap {
            position: fixed;
            top: 0;
            left: 0;
            width: 280px;
            max-width: 280px;
            height: 100dvh;
            padding: 76px 12px 16px;
            background: #fff;
            box-shadow: 12px 0 35px rgba(0, 0, 0, 0.18);
            transform: translateX(-105%);
            transition: transform 0.25s ease;
            overflow-y: auto;
            z-index: 1045;
            flex: none !important;
          }

          .doctor-sidebar-responsive-wrap.sidebar-mobile-open {
            transform: translateX(0);
          }

          .doctor-sidebar-responsive-wrap.sidebar-expanded,
          .doctor-sidebar-responsive-wrap.sidebar-collapsed {
            flex: none !important;
            flex-basis: auto !important;
            max-width: 280px;
          }

          .doctor-sidebar-responsive-wrap .profile-sidebar {
            position: static;
          }

          .doctor-sidebar-responsive-wrap.sidebar-collapsed .profile-det-info h3,
          .doctor-sidebar-responsive-wrap.sidebar-collapsed .patient-details,
          .doctor-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu span,
          .doctor-sidebar-responsive-wrap.sidebar-collapsed .unread-msg {
            display: initial !important;
          }

          .doctor-sidebar-responsive-wrap.sidebar-collapsed .dashboard-widget {
            padding: inherit !important;
          }

          .doctor-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul {
            display: block;
            padding: inherit !important;
            margin: inherit !important;
          }

          .doctor-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul li {
            width: auto;
            padding: inherit !important;
          }

          .doctor-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul li a {
            width: auto;
            height: auto;
            min-height: initial;
            margin: inherit !important;
            padding: inherit !important;
            justify-content: flex-start;
          }

          .doctor-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul li a i {
            margin-right: 10px !important;
          }

          .doctor-sidebar-mobile-backdrop {
            position: fixed;
            inset: 0;
            z-index: 1040;
            background: rgba(0, 0, 0, 0.25);
            display: block;
          }

          .doctor-sidebar-mobile-open body {
            overflow: hidden;
          }
        }

        @media (max-width: 575.98px) {
          .doctor-sidebar-responsive-wrap {
            width: 265px;
            max-width: 265px;
            padding-left: 10px;
            padding-right: 10px;
          }
        }

        .pfw-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1050;
          background: rgba(0, 0, 0, 0.45);
          animation: pfwFade .15s ease;
        }

        @keyframes pfwFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pfwSlide {
          from {
            opacity: 0;
            transform: translateY(-16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .pfw-modal-dialog {
          position: fixed;
          inset: 0;
          z-index: 1055;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .pfw-modal-box {
          background: #fff;
          border-radius: 8px;
          width: 100%;
          max-width: 1000px;
          height: 86vh;
          max-height: 700px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 32px rgba(0, 0, 0, .22);
          overflow: hidden;
          animation: pfwSlide .2s ease;
          font-family: inherit;
        }

        .pfw-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-bottom: 1px solid #dee2e6;
          background: #fff;
          flex-shrink: 0;
        }

        .pfw-modal-title {
          font-size: 16px;
          font-weight: 600;
          color: #212529;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
        }

        .pfw-modal-title i {
          color: var(--primary, #0f763f);
          font-size: 15px;
        }

        .pfw-modal-body {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .pfw-nav-col {
          width: 190px;
          flex-shrink: 0;
          background: #111418;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .pfw-nav-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px 0;
          margin: 0;
          list-style: none;
        }

        .pfw-nav-list::-webkit-scrollbar {
          width: 4px;
        }

        .pfw-nav-list::-webkit-scrollbar-thumb {
          background: #2a2e33;
          border-radius: 2px;
        }

        .pfw-nav-btn {
          display: block;
          width: 100%;
          padding: 9px 16px 9px 14px;
          text-align: right;
          font-size: 12.5px;
          font-weight: 400;
          color: #8a9bb0;
          background: none;
          border: none;
          border-left: 3px solid transparent;
          cursor: pointer;
          transition: color .12s, background .12s, border-color .12s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pfw-nav-btn:hover {
          color: #c8d6e5;
          background: rgba(255, 255, 255, .05);
        }

        .pfw-nav-btn.active {
          color: #4dd0e1;
          border-left-color: #4dd0e1;
          background: rgba(77, 208, 225, .09);
          font-weight: 500;
        }

        .pfw-nav-footer {
          flex-shrink: 0;
          border-top: 1px solid #1e2226;
          padding: 10px 0 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .pfw-print-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #8a9bb0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          width: 100%;
          padding: 7px 0;
          text-align: center;
          transition: color .12s, background .12s;
        }

        .pfw-print-btn:hover {
          color: #e2e8f0;
          background: rgba(255, 255, 255, .05);
        }

        .pfw-print-btn i {
          font-size: 18px;
        }

        .pfw-content-col {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          background: #f5f5f5;
        }

        .pfw-toolbar {
          flex-shrink: 0;
          background: #ffffff;
          border-bottom: 1px solid #dee2e6;
          padding: 6px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pfw-zoom-wrap {
          display: flex;
          align-items: stretch;
          border: 1px solid #ced4da;
          border-radius: 4px;
          overflow: hidden;
          height: 26px;
        }

        .pfw-zoom-input {
          width: 44px;
          border: none;
          outline: none;
          text-align: center;
          font-size: 12.5px;
          background: #fff;
          padding: 0;
          font-family: inherit;
          -moz-appearance: textfield;
        }

        .pfw-zoom-input::-webkit-outer-spin-button,
        .pfw-zoom-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }

        .pfw-zoom-spins {
          display: flex;
          flex-direction: column;
          border-left: 1px solid #ced4da;
        }

        .pfw-zoom-spin {
          flex: 1;
          background: #f8f9fa;
          border: none;
          cursor: pointer;
          font-size: 7px;
          color: #495057;
          padding: 0 5px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background .1s;
        }

        .pfw-zoom-spin:hover {
          background: #e2e6ea;
        }

        .pfw-zoom-spin + .pfw-zoom-spin {
          border-top: 1px solid #ced4da;
        }

        .pfw-toolbar-label {
          font-size: 12.5px;
          color: #6c757d;
        }

        .pfw-frame-area {
          flex: 1;
          overflow: auto;
          padding: 20px;
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          background: #f0f2f5;
        }

        .pfw-frame-area::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .pfw-frame-area::-webkit-scrollbar-track {
          background: #e9ecef;
        }

        .pfw-frame-area::-webkit-scrollbar-thumb {
          background: #adb5bd;
          border-radius: 4px;
        }

        .pfw-page-wrap {
          transform-origin: top left;
          box-shadow: 0 2px 12px rgba(0, 0, 0, .18);
          background: #fff;
          flex-shrink: 0;
        }

        .pfw-page-wrap iframe {
          display: block;
          border: none;
          width: 816px;
          height: 1056px;
        }

        .pfw-loading-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #6c757d;
          font-size: 13px;
          background: #f0f2f5;
        }

        .pfw-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #dee2e6;
          border-top-color: var(--primary, #0f763f);
          border-radius: 50%;
          animation: pfwSpin .75s linear infinite;
        }

        @keyframes pfwSpin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 767.98px) {
          .pfw-modal-dialog {
            padding: 10px;
          }

          .pfw-modal-box {
            height: 90vh;
          }

          .pfw-modal-body {
            flex-direction: column;
          }

          .pfw-nav-col {
            width: 100%;
            max-height: 160px;
          }

          .pfw-nav-list {
            display: flex;
            overflow-x: auto;
            overflow-y: hidden;
            padding: 8px;
          }

          .pfw-nav-list li {
            flex: 0 0 auto;
          }

          .pfw-nav-btn {
            text-align: center;
            border-left: 0;
            border-bottom: 3px solid transparent;
            padding: 8px 12px;
          }

          .pfw-nav-btn.active {
            border-left-color: transparent;
            border-bottom-color: #4dd0e1;
          }

          .pfw-nav-footer {
            flex-direction: row;
            padding: 8px;
          }

          .pfw-frame-area {
            padding: 14px;
          }
        }
      `}</style>

      {isMobileView && doctorMobileSidebar && (
        <div
          className="doctor-sidebar-mobile-backdrop"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          "doctor-sidebar-responsive-wrap",
          isSidebarOpen ? "sidebar-expanded" : "sidebar-collapsed",
          isMobileView && doctorMobileSidebar ? "sidebar-mobile-open" : "",
        ].join(" ")}
      >
        {!isMobileView && (
          <button
            type="button"
            className="doctor-desktop-collapse-btn"
            onClick={toggleDesktopSidebar}
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <i className="fa-solid fa-bars" />
          </button>
        )}

        <div className="profile-sidebar doctor-sidebar profile-sidebar-new theiaStickySidebar">
          <div
            className="widget-profile pro-widget-content"
            onClick={openModal}
            style={{
              cursor: isSidebarOpen || isMobileView ? "pointer" : "default",
            }}
            title={isSidebarOpen || isMobileView ? "Patient Form" : undefined}
          >
            <div className="profile-info-widget justify-content-center">
              <div className="profile-det-info text-center">
                <div className="mb-3" style={{ fontSize: "3rem", opacity: 0.8 }}>
                  <i className="fa-regular fa-copy"></i>
                </div>

                <h3
                  className="text-uppercase fw-bold mt-2"
                  style={{ letterSpacing: "1px" }}
                >
                  Patient Form
                </h3>

                <div className="patient-details mt-2">
                  <p className="small text-muted mb-0">
                    Electronic Medical Record Utility
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-widget">
            <nav className="dashboard-menu">
              <ul>
                {doctorSidebarData.map((item) => (
                  <li key={item.path} className={isActive(item) ? "active" : ""}>
                    <Link
                      to={item.path}
                      onClick={closeMobileSidebar}
                      title={
                        !isSidebarOpen && !isMobileView ? item.label : undefined
                      }
                    >
                      <i className={item.icon}></i>
                      <span>{item.label}</span>

                      {item.badge && (
                        <small className="unread-msg">{item.badge}</small>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </aside>

      {isModalOpen && (
        <>
          <div
            className="pfw-modal-backdrop"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="pfw-modal-dialog">
            <div
              className="pfw-modal-box"
              role="dialog"
              aria-modal="true"
              aria-label="Printable Forms"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pfw-modal-header">
                <h5 className="pfw-modal-title">
                  <i className="fa-solid fa-print"></i>
                  Printable Forms
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close"
                />
              </div>

              <div className="pfw-modal-body">
                <div className="pfw-nav-col">
                  <ul
                    className="pfw-nav-list"
                    role="tablist"
                    aria-label="Printable forms"
                  >
                    {FORM_TABS.map((tab) => (
                      <li key={tab.id} role="presentation">
                        <button
                          type="button"
                          role="tab"
                          className={`pfw-nav-btn${
                            activeTab === tab.id ? " active" : ""
                          }`}
                          aria-selected={activeTab === tab.id}
                          onClick={() => handleTabClick(tab.id)}
                        >
                          {tab.label}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="pfw-nav-footer">
                    <button
                      type="button"
                      className="pfw-print-btn"
                      onClick={handlePrintCurrent}
                      title="Print current form"
                    >
                      <i className="fa-solid fa-print"></i>
                      Print Current Page
                    </button>

                    <button
                      type="button"
                      className="pfw-print-btn"
                      onClick={handlePrintAll}
                      title="Print all forms"
                    >
                      <i className="fa-solid fa-print"></i>
                      Print All
                    </button>
                  </div>
                </div>

                <div className="pfw-content-col">
                  <div className="pfw-toolbar">
                    <div className="pfw-zoom-wrap">
                      <input
                        type="number"
                        className="pfw-zoom-input"
                        value={zoom}
                        min={30}
                        max={200}
                        onChange={onZoomChange}
                        aria-label="Zoom level"
                      />

                      <div className="pfw-zoom-spins">
                        <button
                          type="button"
                          className="pfw-zoom-spin"
                          onClick={zoomIn}
                          aria-label="Zoom in"
                        >
                          ▲
                        </button>

                        <button
                          type="button"
                          className="pfw-zoom-spin"
                          onClick={zoomOut}
                          aria-label="Zoom out"
                        >
                          ▼
                        </button>
                      </div>
                    </div>

                    <span className="pfw-toolbar-label">Page Zoom</span>
                  </div>

                  {isLoading ? (
                    <div
                      className="pfw-loading-area"
                      role="status"
                      aria-live="polite"
                    >
                      <div className="pfw-spinner"></div>
                      <span>Please wait…</span>
                    </div>
                  ) : (
                    <div className="pfw-frame-area">
                      <div
                        className="pfw-page-wrap"
                        style={{ transform: `scale(${zoom / 100})` }}
                      >
                        <iframe
                          key={activeTab}
                          ref={iframeRef}
                          srcDoc={testprintHtml}
                          title={
                            FORM_TABS.find((t) => t.id === activeTab)?.label ??
                            "Form"
                          }
                          sandbox="allow-same-origin allow-scripts allow-modals allow-popups"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DoctorSidebar;