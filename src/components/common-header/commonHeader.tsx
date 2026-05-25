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

const nurseUtilityRoutes = [
  all_routes.nursePatientLog,
  all_routes.nurseUtility,
  all_routes.nurseRequestTemplate,
  all_routes.nurseRequisition,
  all_routes.nurseSupplyRequisition,
  all_routes.nurseReport,
];

const doctorUtilityRoutes = [all_routes.doctorPatientLog];

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
    if (doctorUtilityRoutes.includes(location.pathname)) return true;

    return doctorSidebarData.some((item) => {
      if (location.pathname === item.path) return true;
      if (location.pathname.startsWith(`${item.path}/`)) return true;
      if (item.relativeLinks?.includes(location.pathname)) return true;
      return false;
    });
  }, [location.pathname]);

  const isNurseRoute = useMemo(() => {
    if (nurseUtilityRoutes.includes(location.pathname)) return true;

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
  const showSidebarToggle =
    (isDoctorRoute || isNurseRoute) &&
    location.pathname !== all_routes.doctorDashboard;

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
          {/* logo */}
          <div className="navbar-header d-flex align-items-center">
            <Link to={all_routes.doctorDashboard} className="navbar-brand logo">
              <h2 className="logo-name ihomis-wordmark">
                <span className="ihomis-i">i</span>
                <span className="ihomis-main">HOMIS</span>
              </h2>
              <span className="logo-mark">
                <ImageWithBasePath
                  src="assets/img/brhmclogo.png"
                  className="img-fluid"
                  alt="Logo"
                />
              </span>
            </Link>
          </div>

          {/* desktop navigation */}
          <div className="header-menu">
            <div className="main-menu-wrapper">
              <div className="menu-header">
                <Link to={all_routes.doctorDashboard} className="menu-logo">
                  <h2 className="logo-name ihomis-wordmark">
                    <span className="ihomis-i">i</span>
                    <span className="ihomis-main">HOMIS</span>
                  </h2>
                  <span className="logo-mark">
                    <ImageWithBasePath
                      src="assets/img/brhmclogo.png"
                      className="img-fluid"
                      alt="Logo"
                    />
                  </span>
                </Link>
              </div>

              <HeaderNav />
            </div>
          </div>

          {/* right side time, profile, and sidebar toggle */}
          <ul className="nav header-navbar-rht align-items-center">
            <li className="nav-item fw-medium text-dark profile-icon header-time-item">
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

            {showSidebarToggle && (
              <li className="nav-item module-sidebar-toggle-item d-lg-none">
                <Link
                  to="#"
                  className="module-mobile-sidebar-btn"
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
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
