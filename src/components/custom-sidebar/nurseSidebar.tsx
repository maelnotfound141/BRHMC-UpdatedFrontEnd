import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setNurseMobileSidebar } from "@/core/redux/sidebarSlice";
import { nurseSidebarData } from "@/core/data/json/nurseSidebarData";

const SIDEBAR_COLLAPSED_KEY = "nurse-sidebar-desktop-collapsed";

const NurseSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const nurseMobileSidebar = useSelector(
    (state: any) => state.sidebar.nurseMobileSidebar
  );

  const [isMobileView, setIsMobileView] = useState(false);

  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
  });

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem(
      SIDEBAR_COLLAPSED_KEY,
      isDesktopCollapsed ? "true" : "false"
    );
  }, [isDesktopCollapsed]);

  useEffect(() => {
    if (!isMobileView) {
      document.documentElement.classList.remove("nurse-sidebar-mobile-open");
      return;
    }

    if (nurseMobileSidebar) {
      document.documentElement.classList.add("nurse-sidebar-mobile-open");
    } else {
      document.documentElement.classList.remove("nurse-sidebar-mobile-open");
    }

    return () => {
      document.documentElement.classList.remove("nurse-sidebar-mobile-open");
    };
  }, [isMobileView, nurseMobileSidebar]);

  const isActive = (item: typeof nurseSidebarData[0]) => {
    const itemPath = item.path;

    if (location.pathname === itemPath) return true;
    if (location.pathname.startsWith(`${itemPath}/`)) return true;
    if (item.relativeLinks?.includes(location.pathname)) return true;

    return false;
  };

  const toggleDesktopSidebar = () => {
    setIsDesktopCollapsed((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    if (isMobileView) {
      dispatch(setNurseMobileSidebar(false));
    }
  };

  const handleNavClick = () => {
    closeMobileSidebar();
  };

  return (
    <>
      <style>{`
        .nurse-sidebar-responsive-wrap {
          position: relative;
          flex: 0 0 280px;
          max-width: 280px;
          transition: all 0.25s ease;
          z-index: 20;
        }

        .nurse-sidebar-responsive-wrap.sidebar-collapsed {
          flex: 0 0 78px;
          max-width: 78px;
        }

        .nurse-sidebar-responsive-wrap .profile-sidebar {
          position: sticky;
          top: 105px;
          width: 100%;
          overflow: hidden;
          transition: all 0.25s ease;
        }

        .nurse-sidebar-responsive-wrap .widget-profile {
          position: relative;
          z-index: 1;
        }

        .nurse-sidebar-responsive-wrap .dashboard-widget {
          position: relative;
          z-index: 10;
          pointer-events: auto;
        }

        .nurse-sidebar-responsive-wrap .dashboard-menu {
          position: relative;
          z-index: 10;
          pointer-events: auto;
        }

        .nurse-sidebar-responsive-wrap .dashboard-menu ul,
        .nurse-sidebar-responsive-wrap .dashboard-menu ul li,
        .nurse-sidebar-responsive-wrap .dashboard-menu ul li a {
          pointer-events: auto;
        }

        .nurse-desktop-collapse-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 30;
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
          pointer-events: auto;
        }

        .nurse-desktop-collapse-btn:hover {
          background: rgba(15, 118, 63, 0.08) !important;
          color: var(--primary, #0f763f);
          transform: none;
        }

        .nurse-desktop-collapse-btn:focus,
        .nurse-desktop-collapse-btn:active {
          outline: none;
          box-shadow: none !important;
          background: transparent !important;
          color: var(--primary, #0f763f);
        }

        .nurse-desktop-collapse-btn i {
          font-size: 20px;
          color: var(--primary, #0f763f);
          line-height: 1;
          pointer-events: none;
        }

        .nurse-sidebar-responsive-wrap.sidebar-collapsed .nurse-desktop-collapse-btn {
          top: 14px;
          left: 50%;
          right: auto;
          transform: translateX(-50%);
        }

        .nurse-sidebar-responsive-wrap.sidebar-expanded .widget-profile {
          padding-top: 54px !important;
        }

        .nurse-sidebar-responsive-wrap.sidebar-collapsed .widget-profile {
          padding: 54px 8px 8px !important;
          margin-bottom: 0 !important;
        }

        .nurse-sidebar-responsive-wrap.sidebar-collapsed .profile-det-info h3,
        .nurse-sidebar-responsive-wrap.sidebar-collapsed .patient-details,
        .nurse-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu span,
        .nurse-sidebar-responsive-wrap.sidebar-collapsed .unread-msg {
          display: none !important;
        }

        .nurse-sidebar-responsive-wrap.sidebar-collapsed .profile-info-widget {
          justify-content: center !important;
        }

        .nurse-sidebar-responsive-wrap.sidebar-collapsed .profile-det-info {
          width: 100%;
        }

        .nurse-sidebar-responsive-wrap.sidebar-collapsed .profile-det-info .mb-3 {
          font-size: 1.45rem !important;
          margin: 0 !important;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .nurse-sidebar-responsive-wrap.sidebar-collapsed .dashboard-widget {
          padding: 0 !important;
          margin-top: 4px !important;
          position: relative;
          z-index: 20;
        }

        .nurse-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu {
          padding: 0 !important;
          margin: 0 !important;
          position: relative;
          z-index: 20;
        }

        .nurse-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul {
          padding: 0 !important;
          margin: 0 !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          position: relative;
          z-index: 20;
        }

        .nurse-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul li {
          width: 100%;
          margin: 0 !important;
          padding: 0 8px !important;
          position: relative;
          z-index: 20;
        }

        .nurse-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul li a {
          width: 42px;
          height: 42px;
          min-height: 42px;
          margin: 0 auto !important;
          padding: 0 !important;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          position: relative;
          z-index: 25;
          cursor: pointer;
          pointer-events: auto;
        }

        .nurse-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul li a i {
          margin: 0 !important;
          padding: 0 !important;
          font-size: 17px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .nurse-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul li.active a {
          background: var(--primary, #0f763f) !important;
          color: #fff !important;
        }

        .nurse-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul li.active a i {
          color: #fff !important;
        }

        .nurse-sidebar-mobile-backdrop {
          display: none;
        }

        @media (min-width: 992px) {
          .nurse-sidebar-responsive-wrap.sidebar-expanded {
            flex-basis: 280px;
            max-width: 280px;
          }
        }

        @media (max-width: 991.98px) {
          .nurse-sidebar-responsive-wrap {
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

          .nurse-sidebar-responsive-wrap.sidebar-mobile-open {
            transform: translateX(0);
            pointer-events: auto;
          }

          .nurse-sidebar-responsive-wrap.sidebar-expanded,
          .nurse-sidebar-responsive-wrap.sidebar-collapsed {
            flex: none !important;
            flex-basis: auto !important;
            max-width: 280px;
          }

          .nurse-sidebar-responsive-wrap .profile-sidebar {
            position: static;
          }

          .nurse-sidebar-responsive-wrap.sidebar-expanded .widget-profile,
          .nurse-sidebar-responsive-wrap.sidebar-collapsed .widget-profile {
            padding-top: inherit !important;
          }

          .nurse-sidebar-responsive-wrap.sidebar-collapsed .profile-det-info h3,
          .nurse-sidebar-responsive-wrap.sidebar-collapsed .patient-details,
          .nurse-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu span,
          .nurse-sidebar-responsive-wrap.sidebar-collapsed .unread-msg {
            display: initial !important;
          }

          .nurse-sidebar-responsive-wrap.sidebar-collapsed .dashboard-widget {
            padding: inherit !important;
            margin-top: inherit !important;
          }

          .nurse-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul {
            display: block;
            padding: inherit !important;
            margin: inherit !important;
          }

          .nurse-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul li {
            width: auto;
            padding: inherit !important;
          }

          .nurse-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul li a {
            width: auto;
            height: auto;
            min-height: initial;
            margin: inherit !important;
            padding: inherit !important;
            justify-content: flex-start;
          }

          .nurse-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul li a i {
            margin-right: 10px !important;
          }

          .nurse-sidebar-mobile-backdrop {
            position: fixed;
            inset: 0;
            z-index: 1040;
            background: rgba(0, 0, 0, 0.25);
            display: block;
          }

          .nurse-sidebar-mobile-open body {
            overflow: hidden;
          }
        }

        @media (max-width: 575.98px) {
          .nurse-sidebar-responsive-wrap {
            width: 265px;
            max-width: 265px;
            padding-left: 10px;
            padding-right: 10px;
          }
        }
      `}</style>

      {isMobileView && nurseMobileSidebar && (
        <div
          className="nurse-sidebar-mobile-backdrop"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          "nurse-sidebar-responsive-wrap",
          isSidebarOpen ? "sidebar-expanded" : "sidebar-collapsed",
          isMobileView && nurseMobileSidebar ? "sidebar-mobile-open" : "",
        ].join(" ")}
      >
        {!isMobileView && (
          <button
            type="button"
            className="nurse-desktop-collapse-btn"
            onClick={toggleDesktopSidebar}
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <i className="fa-solid fa-bars" />
          </button>
        )}

        <div className="profile-sidebar doctor-sidebar profile-sidebar-new theiaStickySidebar">
          <div className="widget-profile pro-widget-content">
            <div className="profile-info-widget justify-content-center">
              <div className="profile-det-info text-center">
                <div className="mb-3" style={{ fontSize: "3rem", opacity: 0.8 }}>
                  <i className="fa-solid fa-user-nurse"></i>
                </div>

                <h3
                  className="text-uppercase fw-bold mt-2"
                  style={{ letterSpacing: "1px" }}
                >
                  Nursing Care
                </h3>

                <div className="patient-details mt-2">
                  <p className="small text-muted mb-0"></p>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-widget">
            <nav className="dashboard-menu">
              <ul>
                {nurseSidebarData.map((item) => (
                  <li key={item.path} className={isActive(item) ? "active" : ""}>
                    <Link
                      to={item.path}
                      onClick={handleNavClick}
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
    </>
  );
};

export default NurseSidebar;