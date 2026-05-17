import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setNurseMobileSidebar } from "@/core/redux/sidebarSlice";
import { all_routes } from "@/routes/all_routes";

const utilityMenuItems = [
  {
    key: "requisition",
    label: "Requisition",
    icon: "isax isax-receipt-item",
  },
  {
    key: "stock-management",
    label: "Stock Management",
    icon: "isax isax-box",
  },
];

const requisitionOptions = [
  {
    title: "Request Template",
    desc: "Create and manage ward request templates",
    icon: "isax isax-document-text",
    path: all_routes.nurseRequestTemplate,
  },
  {
    title: "Requisition",
    desc: "Prepare and submit ward requisitions",
    icon: "isax isax-receipt-item",
    path: all_routes.nurseRequisition,
  },
];

const NurseUtility = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeItem, setActiveItem] = useState(utilityMenuItems[0].key);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const nurseMobileSidebar = useSelector(
    (state: any) => state.sidebar.nurseMobileSidebar
  );

  const activeMenuItem =
    utilityMenuItems.find((item) => item.key === activeItem) ||
    utilityMenuItems[0];

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

  return (
    <>
      <style>{`
        .ward-utility-sidebar-wrap {
          flex: 0 0 280px;
          max-width: 280px;
          transition: all 0.25s ease;
          z-index: 20;
        }

        .ward-utility-sidebar-wrap.sidebar-collapsed {
          flex-basis: 78px;
          max-width: 78px;
        }

        .ward-utility-sidebar-card {
          position: sticky;
          top: 105px;
          width: 100%;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
          overflow: hidden;
        }

        .ward-utility-menu-toggle {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 6px;
          background: transparent;
          color: var(--primary, #0f763f);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          z-index: 3;
          cursor: pointer;
        }

        .ward-utility-profile {
          padding: 74px 20px 28px;
          text-align: center;
          transition: all 0.25s ease;
        }

        .ward-utility-profile-icon {
          font-size: 3rem;
          color: #6f7b8a;
          line-height: 1;
          margin-bottom: 28px;
        }

        .ward-utility-profile-title {
          color: #172033;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 0;
        }

        .ward-utility-sidebar-wrap.sidebar-collapsed .ward-utility-menu-toggle {
          left: 50%;
          right: auto;
          transform: translateX(-50%);
        }

        .ward-utility-sidebar-wrap.sidebar-collapsed .ward-utility-profile {
          padding: 64px 8px 14px;
        }

        .ward-utility-sidebar-wrap.sidebar-collapsed .ward-utility-profile-icon {
          font-size: 1.65rem;
          margin-bottom: 0;
        }

        .ward-utility-sidebar-wrap.sidebar-collapsed .ward-utility-profile-title,
        .ward-utility-sidebar-wrap.sidebar-collapsed .ward-utility-menu-btn span {
          display: none;
        }

        .ward-utility-menu {
          padding: 18px 20px 24px;
        }

        .ward-utility-sidebar-wrap.sidebar-collapsed .ward-utility-menu {
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ward-utility-menu-btn {
          width: 100%;
          min-height: 48px;
          border: 0;
          border-radius: 4px;
          background: transparent;
          color: #172033;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          font-size: 1rem;
          font-weight: 500;
          text-align: left;
          transition: all 0.2s ease;
        }

        .ward-utility-sidebar-wrap.sidebar-collapsed .ward-utility-menu-btn {
          width: 42px;
          height: 42px;
          min-height: 42px;
          justify-content: center;
          padding: 0;
          margin: 0 auto;
          border-radius: 8px;
        }

        .ward-utility-menu-btn:hover {
          background: rgba(15, 118, 63, 0.08);
          color: var(--primary, #0f763f);
        }

        .ward-utility-menu-btn.active {
          background: var(--primary, #0f763f);
          color: #fff;
          font-weight: 700;
        }

        .ward-utility-menu-btn i {
          width: 18px;
          font-size: 1rem;
          text-align: center;
        }

        .ward-utility-sidebar-wrap.sidebar-collapsed .ward-utility-menu-btn i {
          width: auto;
          font-size: 1.05rem;
        }

        .ward-utility-main-menu-btn {
          width: 38px;
          height: 38px;
          border-radius: 6px;
          display: none;
          align-items: center;
          justify-content: center;
          border: 1px solid #dee2e6;
          background: #fff;
          color: var(--primary, #0f763f);
          flex-shrink: 0;
        }

        .ward-utility-close-btn {
          width: 38px;
          height: 38px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #dee2e6;
          background: #fff;
          color: #212529;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .ward-utility-close-btn:hover {
          background: var(--primary, #0f763f);
          border-color: var(--primary, #0f763f);
          color: #fff;
        }

        .ward-utility-section-head {
          background: #eef5f8;
          border-top: 1px solid #dce5ea;
          border-bottom: 1px solid #dce5ea;
        }

        .ward-utility-empty-state {
          min-height: 420px;
          background: #fff;
        }

        .ward-utility-options {
          min-height: 420px;
          background: #fff;
        }

        .ward-utility-option-card {
          border: 1px solid #e9ecef !important;
          border-radius: 10px !important;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .ward-utility-option-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary, #0f763f) !important;
          box-shadow: 0 8px 25px rgba(15, 118, 63, 0.12) !important;
        }

        .ward-utility-option-card:hover .ward-utility-option-arrow {
          opacity: 0.6 !important;
          transform: translateX(3px);
        }

        .ward-utility-option-icon {
          width: 52px;
          height: 52px;
          border-radius: 10px;
          background: rgba(15, 118, 63, 0.08);
          color: var(--primary, #0f763f);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ward-utility-option-arrow {
          transition: all 0.25s ease;
        }

        .ward-utility-mobile-backdrop {
          display: none;
        }

        @media (max-width: 991.98px) {
          .ward-utility-sidebar-wrap {
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
            pointer-events: none;
          }

          .ward-utility-sidebar-wrap.sidebar-mobile-open {
            transform: translateX(0);
            pointer-events: auto;
          }

          .ward-utility-sidebar-wrap.sidebar-expanded,
          .ward-utility-sidebar-wrap.sidebar-collapsed {
            flex: none !important;
            flex-basis: auto !important;
            max-width: 280px;
          }

          .ward-utility-sidebar-card {
            position: static;
          }

          .ward-utility-sidebar-wrap.sidebar-collapsed .ward-utility-menu-toggle {
            left: auto;
            right: 18px;
            transform: none;
          }

          .ward-utility-sidebar-wrap.sidebar-collapsed .ward-utility-profile-title,
          .ward-utility-sidebar-wrap.sidebar-collapsed .ward-utility-menu-btn span {
            display: inline;
          }

          .ward-utility-sidebar-wrap.sidebar-collapsed .ward-utility-profile-icon {
            font-size: 3rem;
            margin-bottom: 28px;
          }

          .ward-utility-profile {
            padding: 64px 18px 22px;
          }

          .ward-utility-menu {
            display: block;
          }

          .ward-utility-sidebar-wrap.sidebar-collapsed .ward-utility-menu {
            display: block;
            padding: 18px 20px 24px;
          }

          .ward-utility-sidebar-wrap.sidebar-collapsed .ward-utility-menu-btn {
            width: 100%;
            height: auto;
            min-height: 48px;
            justify-content: flex-start;
            padding: 12px;
            margin: 0;
            border-radius: 4px;
          }

          .ward-utility-sidebar-wrap.sidebar-collapsed .ward-utility-menu-btn i {
            width: 18px;
          }

          .ward-utility-main-menu-btn {
            display: inline-flex;
          }

          .ward-utility-mobile-backdrop {
            position: fixed;
            inset: 0;
            z-index: 1040;
            background: rgba(0, 0, 0, 0.25);
            display: block;
          }
        }

        @media (max-width: 575.98px) {
          .ward-utility-sidebar-wrap {
            width: 265px;
            max-width: 265px;
            padding-left: 10px;
            padding-right: 10px;
          }

          .ward-utility-empty-state {
            min-height: 320px;
          }

          .ward-utility-options {
            min-height: 320px;
          }
        }
      `}</style>

      <div
        className="content nurse-content bg-light mt-n4"
        style={{ minHeight: "100vh" }}
      >
        <div className="container-fluid px-3 px-lg-5 pt-0">
          <div className="nurse-dashboard-layout">
            {isMobileView && nurseMobileSidebar && (
              <div
                className="ward-utility-mobile-backdrop"
                onClick={closeMobileSidebar}
                aria-hidden="true"
              />
            )}

            <aside
              className={[
                "ward-utility-sidebar-wrap",
                isSidebarOpen ? "sidebar-expanded" : "sidebar-collapsed",
                isMobileView && nurseMobileSidebar
                  ? "sidebar-mobile-open"
                  : "",
              ].join(" ")}
            >
              <div className="ward-utility-sidebar-card">
                <button
                  type="button"
                  className="ward-utility-menu-toggle"
                  aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                  title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                  onClick={toggleSidebar}
                  style={{
                    width: "46px",
                    height: "46px",
                    fontSize: "24px",
                  }}
                >
                  <i className="fa-solid fa-bars" />
                </button>

                <div className="ward-utility-profile">
                  <div className="ward-utility-profile-icon">
                    <i className="isax isax-setting-2" />
                  </div>

                  <h4 className="ward-utility-profile-title">Ward Utility</h4>
                </div>

                <nav className="ward-utility-menu" aria-label="Ward utility">
                  {utilityMenuItems.map((item) => (
                    <button
                      type="button"
                      key={item.key}
                      className={`ward-utility-menu-btn ${
                        activeItem === item.key ? "active" : ""
                      }`}
                      title={
                        !isSidebarOpen && !isMobileView ? item.label : undefined
                      }
                      onClick={() => {
                        setActiveItem(item.key);
                        closeMobileSidebar();
                      }}
                    >
                      <i className={item.icon} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            <div className="nurse-dashboard-main mt-4 mt-lg-0">
              <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-4 acc-main-card">
                <div className="bg-white px-3 px-md-4 pt-4">
                  <div className="d-flex justify-content-between align-items-center gap-3 pb-4 border-bottom">
                    <div className="d-flex align-items-center gap-3 min-width-0">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center bg-light shadow-sm flex-shrink-0"
                        style={{
                          width: "58px",
                          height: "58px",
                          border: "2px solid var(--primary, #0f763f)",
                        }}
                      >
                        <i
                          className="isax isax-setting-2 fs-3"
                          style={{ color: "var(--primary, #0f763f)" }}
                        />
                      </div>

                      <h4 className="fw-bold mb-0 text-dark text-uppercase text-truncate">
                        Ward Utility
                      </h4>
                    </div>

                    <button
                      type="button"
                      className="ward-utility-close-btn"
                      aria-label="Back to nurse dashboard"
                      title="Back to nurse dashboard"
                      onClick={() => navigate(all_routes.nurseDashboard)}
                    >
                      <i className="isax isax-close-circle" />
                    </button>
                  </div>
                </div>

                <div className="bg-white px-3 px-md-4 py-3">
                  <h5 className="fw-bold text-dark mb-0 text-uppercase">
                    {activeMenuItem.label}
                  </h5>
                </div>

                {activeItem === "requisition" ? (
                  <div className="ward-utility-options p-3 p-md-4">
                    <div className="row g-3">
                      {requisitionOptions.map((option) => (
                        <div className="col-12 col-md-6 col-xl-4" key={option.title}>
                          <div
                            className="card shadow-sm ward-utility-option-card h-100 p-3"
                            onClick={() => navigate(option.path)}
                          >
                            <div className="d-flex align-items-center gap-3">
                              <div className="ward-utility-option-icon">
                                <i
                                  className={option.icon}
                                  style={{ fontSize: "1.75rem", fontWeight: "300" }}
                                />
                              </div>

                              <div className="flex-grow-1 min-width-0">
                                <h6
                                  className="mb-1 fw-semibold text-dark"
                                  style={{ fontSize: "0.95rem" }}
                                >
                                  {option.title}
                                </h6>
                                <p
                                  className="small text-muted mb-0 lh-sm"
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  {option.desc}
                                </p>
                              </div>

                              <i
                                className="isax isax-arrow-right-3 text-muted ward-utility-option-arrow"
                                style={{
                                  fontSize: "1rem",
                                  opacity: 0.3,
                                  fontWeight: "300",
                                  flexShrink: 0,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="ward-utility-empty-state" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NurseUtility;
