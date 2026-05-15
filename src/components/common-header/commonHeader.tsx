import { Link, useLocation } from "react-router";
import ImageWithBasePath from "../image-with-base-path";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDoctorMobileSidebar,
  setNurseMobileSidebar,
} from "@/core/redux/sidebarSlice";
import HeaderNav from "../header/headerNav";
import { all_routes } from "@/routes/all_routes";
import ProfileModal from "../profile-modal/ProfileModal";
import { doctorSidebarData } from "@/core/data/json/doctorSidebarData";
import { nurseSidebarData } from "@/core/data/json/nurseSidebarData";

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const doctorMobileSidebar = useSelector(
    (state: any) => state.sidebar.doctorMobileSidebar
  );

  const nurseMobileSidebar = useSelector(
    (state: any) => state.sidebar.nurseMobileSidebar
  );

  const isDoctorRoute = useMemo(() => {
    return doctorSidebarData.some((item) => {
      if (location.pathname === item.path) return true;
      if (location.pathname.startsWith(`${item.path}/`)) return true;
      if (item.relativeLinks?.includes(location.pathname)) return true;
      return false;
    });
  }, [location.pathname]);

  const isNurseRoute = useMemo(() => {
    return nurseSidebarData.some((item) => {
      if (location.pathname === item.path) return true;
      if (location.pathname.startsWith(`${item.path}/`)) return true;
      if (item.relativeLinks?.includes(location.pathname)) return true;
      return false;
    });
  }, [location.pathname]);

  const isSidebarOpen = isDoctorRoute
    ? doctorMobileSidebar
    : isNurseRoute
      ? nurseMobileSidebar
      : false;

  // scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // only toggles the active module sidebar drawer
  const onSidebarToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDoctorRoute) {
      dispatch(setDoctorMobileSidebar(!doctorMobileSidebar));
      return;
    }

    if (isNurseRoute) {
      dispatch(setNurseMobileSidebar(!nurseMobileSidebar));
    }
  };

  return (
    <header
      className={`header header-default inner-header ${
        isScrolled ? "fixed" : ""
      }`}
    >
      <div className="container">
        <nav className="navbar navbar-expand-lg header-nav">
          {/* mobile/tablet module sidebar button and logo */}
          <div className="navbar-header d-flex align-items-center gap-2">
            {(isDoctorRoute || isNurseRoute) && (
              <Link
                to="#"
                className="module-mobile-sidebar-btn d-lg-none"
                onClick={onSidebarToggle}
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                <i
                  className={`fa-solid ${
                    isSidebarOpen ? "fa-xmark" : "fa-bars"
                  }`}
                />
              </Link>
            )}

            <Link to={all_routes.doctorDashboard} className="navbar-brand logo">
              <h2 className="logo-name">BRHMC</h2>
              <ImageWithBasePath
                src="assets/img/brhmclogo.png"
                className="img-fluid"
                alt="Logo"
              />
            </Link>
          </div>

          {/* desktop navigation */}
          <div className="header-menu">
            <div className="main-menu-wrapper">
              <div className="menu-header">
                <Link to={all_routes.doctorDashboard} className="menu-logo">
                  <h2 className="logo-name">BRHMC</h2>
                  <ImageWithBasePath
                    src="assets/img/brhmclogo.png"
                    className="img-fluid"
                    alt="Logo"
                  />
                </Link>
              </div>

              <HeaderNav />
            </div>
          </div>

          {/* right side icons and time */}
          <ul className="nav header-navbar-rht align-items-center">
            <li className="nav-item me-2 fw-medium text-dark profile-icon">
              <span className="d-none d-sm-inline">
                {currentTime.toLocaleString("en-PH", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>

              <span className="d-inline d-sm-none" style={{ fontSize: "12px" }}>
                {currentTime.toLocaleString("en-PH", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </li>

            <ProfileModal />
          </ul>
        </nav>
      </div>

      <style>{`
        .module-mobile-sidebar-btn {
          width: 38px;
          height: 38px;
          min-width: 38px;
          border-radius: 50%;
          background: var(--primary, #0f763f);
          color: #fff !important;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          box-shadow: 0 6px 18px rgba(15, 118, 63, 0.25);
          transition: all 0.2s ease;
        }

        .module-mobile-sidebar-btn:hover {
          filter: brightness(0.95);
          transform: translateY(-1px);
        }

        .module-mobile-sidebar-btn i {
          font-size: 16px;
          line-height: 1;
        }

        @media (max-width: 575.98px) {
          .module-mobile-sidebar-btn {
            width: 34px;
            height: 34px;
            min-width: 34px;
          }

          .module-mobile-sidebar-btn i {
            font-size: 14px;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;