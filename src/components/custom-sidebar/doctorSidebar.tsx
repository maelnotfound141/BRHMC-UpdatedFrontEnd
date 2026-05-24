import { useCallback, useEffect, useRef, useState } from "react";
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
const FORM_FRAME_WIDTH = 816;
const FORM_FRAME_HEIGHT = 1056;
const MIN_ZOOM = 30;
const MAX_ZOOM = 200;

const clampZoom = (value: number) =>
  Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

const DoctorSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const frameAreaRef = useRef<HTMLDivElement>(null);

  const doctorMobileSidebar = useSelector(
    (state: any) => state.sidebar.doctorMobileSidebar
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(FORM_TABS[0].id);
  const [zoom, setZoom] = useState(100);
  const [zoomMode, setZoomMode] = useState<"fit" | "manual">("fit");
  const [isLoading, setIsLoading] = useState(false);
  const [isPrintSidebarHidden, setIsPrintSidebarHidden] = useState(false);

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

  const fitFormToFrame = useCallback(() => {
    const frameArea = frameAreaRef.current;

    if (!frameArea) return;

    const styles = window.getComputedStyle(frameArea);
    const horizontalPadding =
      parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
    const verticalPadding =
      parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
    const availableWidth = frameArea.clientWidth - horizontalPadding;
    const availableHeight = frameArea.clientHeight - verticalPadding;

    if (availableWidth <= 0 || availableHeight <= 0) return;

    const nextZoom = Math.floor(
      Math.min(
        (availableWidth / FORM_FRAME_WIDTH) * 100,
        (availableHeight / FORM_FRAME_HEIGHT) * 100
      )
    );

    setZoom(clampZoom(nextZoom));
  }, []);

  const handleNavClick = () => {
    closeMobileSidebar();
  };

  const openModal = () => {
    setActiveTab(FORM_TABS[0].id);
    setZoomMode("fit");
    setIsPrintSidebarHidden(false);
    setIsLoading(true);
    setIsModalOpen(true);

    setTimeout(() => setIsLoading(false), 700);
  };

  const handleTabClick = (id: string) => {
    if (id === activeTab) return;

    setActiveTab(id);
    setZoomMode("fit");
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

  const zoomIn = () => {
    setZoomMode("manual");
    setZoom((z) => clampZoom(z + 10));
  };

  const zoomOut = () => {
    setZoomMode("manual");
    setZoom((z) => clampZoom(z - 10));
  };

  const handleFitToScreen = () => {
    setZoomMode("fit");
    window.requestAnimationFrame(fitFormToFrame);
  };

  const handleResetZoom = () => {
    setZoomMode("manual");
    setZoom(100);
  };

  const onZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);

    if (!isNaN(v)) {
      setZoomMode("manual");
      setZoom(clampZoom(v));
    }
  };

  useEffect(() => {
    if (!isModalOpen || isLoading || zoomMode !== "fit") return;

    const frame = window.requestAnimationFrame(fitFormToFrame);

    window.addEventListener("resize", fitFormToFrame);

    let observer: ResizeObserver | undefined;

    if (typeof ResizeObserver !== "undefined" && frameAreaRef.current) {
      observer = new ResizeObserver(fitFormToFrame);
      observer.observe(frameAreaRef.current);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", fitFormToFrame);
      observer?.disconnect();
    };
  }, [fitFormToFrame, isLoading, isModalOpen, zoomMode]);

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

        .doctor-sidebar-responsive-wrap .widget-profile {
          position: relative;
          z-index: 1;
          pointer-events: auto;
        }

        .doctor-sidebar-responsive-wrap .dashboard-widget {
          position: relative;
          z-index: 10;
          pointer-events: auto;
        }

        .doctor-sidebar-responsive-wrap .dashboard-menu {
          position: relative;
          z-index: 10;
          pointer-events: auto;
        }

        .doctor-sidebar-responsive-wrap .dashboard-menu ul,
        .doctor-sidebar-responsive-wrap .dashboard-menu ul li,
        .doctor-sidebar-responsive-wrap .dashboard-menu ul li a {
          pointer-events: auto;
        }

        .doctor-desktop-collapse-btn {
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
          pointer-events: none;
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
          padding: 54px 8px 8px !important;
          margin-bottom: 0 !important;
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
          pointer-events: auto;
          cursor: pointer;
        }

        .doctor-sidebar-responsive-wrap.sidebar-collapsed .dashboard-widget {
          padding: 0 !important;
          margin-top: 4px !important;
          position: relative;
          z-index: 20;
        }

        .doctor-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu {
          padding: 0 !important;
          margin: 0 !important;
          position: relative;
          z-index: 20;
        }

        .doctor-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul {
          padding: 0 !important;
          margin: 0 !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          position: relative;
          z-index: 20;
        }

        .doctor-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul li {
          width: 100%;
          margin: 0 !important;
          padding: 0 8px !important;
          position: relative;
          z-index: 20;
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
          position: relative;
          z-index: 25;
          cursor: pointer;
          pointer-events: auto;
        }

        .doctor-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu ul li a i {
          margin: 0 !important;
          padding: 0 !important;
          font-size: 17px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
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
            pointer-events: none;
          }

          .doctor-sidebar-responsive-wrap.sidebar-mobile-open {
            transform: translateX(0);
            pointer-events: auto;
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

          .doctor-sidebar-responsive-wrap.sidebar-expanded .widget-profile,
          .doctor-sidebar-responsive-wrap.sidebar-collapsed .widget-profile {
            padding-top: inherit !important;
          }

          .doctor-sidebar-responsive-wrap.sidebar-collapsed .profile-det-info h3,
          .doctor-sidebar-responsive-wrap.sidebar-collapsed .patient-details,
          .doctor-sidebar-responsive-wrap.sidebar-collapsed .dashboard-menu span,
          .doctor-sidebar-responsive-wrap.sidebar-collapsed .unread-msg {
            display: initial !important;
          }

          .doctor-sidebar-responsive-wrap.sidebar-collapsed .dashboard-widget {
            padding: inherit !important;
            margin-top: inherit !important;
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
          align-items: stretch;
          justify-content: stretch;
          padding: 0;
        }

        .pfw-modal-box {
          position: relative;
          background: #fff;
          border-radius: 0;
          width: 100%;
          max-width: none;
          height: 100dvh;
          max-height: none;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 32px rgba(0, 0, 0, .22);
          overflow: hidden;
          animation: pfwSlide .2s ease;
          font-family: inherit;
        }

        .pfw-modal-close-btn {
          position: absolute;
          top: 14px;
          right: 16px;
          z-index: 12;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(15, 23, 42, 0.1);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.94);
          color: #212529;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.14);
          transition: color .12s, border-color .12s, background .12s;
        }

        .pfw-modal-close-btn:hover,
        .pfw-modal-close-btn:focus {
          background: #fff;
          border-color: var(--primary, #0f763f);
          color: var(--primary, #0f763f);
          outline: none;
        }

        .pfw-modal-body {
          flex: 1;
          min-height: 0;
          display: flex;
          overflow: hidden;
        }

        .pfw-nav-col {
          width: 176px;
          flex-shrink: 0;
          background: #111418;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: width .18s ease, max-height .18s ease, padding .18s ease;
        }

        .pfw-nav-toggle-btn {
          position: absolute;
          top: 14px;
          left: 188px;
          z-index: 12;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          background: rgba(17, 20, 24, 0.96);
          color: #c8d6e5;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.2);
          transition: left .18s ease, background .12s, color .12s, border-color .12s;
        }

        .pfw-nav-toggle-btn:hover,
        .pfw-nav-toggle-btn:focus {
          background: #111418;
          border-color: #4dd0e1;
          color: #4dd0e1;
          outline: none;
        }

        .pfw-preview-sidebar-hidden .pfw-nav-col {
          width: 0;
        }

        .pfw-preview-sidebar-hidden .pfw-nav-list,
        .pfw-preview-sidebar-hidden .pfw-nav-footer {
          opacity: 0;
          pointer-events: none;
        }

        .pfw-preview-sidebar-hidden .pfw-nav-toggle-btn {
          left: 14px;
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
          min-height: 0;
          display: flex;
          flex-direction: column;
          background: #f5f5f5;
          position: relative;
        }

        .pfw-toolbar {
          position: absolute;
          top: 50%;
          right: 18px;
          z-index: 8;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(15, 23, 42, 0.12);
          border-radius: 8px;
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.18);
          padding: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .pfw-zoom-wrap {
          display: flex;
          align-items: stretch;
          border: 1px solid #ced4da;
          border-radius: 4px;
          overflow: hidden;
          width: 46px;
          height: 40px;
          background: #fff;
        }

        .pfw-zoom-input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          text-align: center;
          font-size: 13px;
          font-weight: 700;
          background: #fff;
          padding: 0;
          font-family: inherit;
          -moz-appearance: textfield;
        }

        .pfw-zoom-input::-webkit-outer-spin-button,
        .pfw-zoom-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }

        .pfw-zoom-step-btn {
          flex: 0 0 auto;
          width: 46px;
          height: 40px;
          min-height: 40px;
          background: #f8f9fa;
          border: 1px solid #ced4da;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0;
          color: #495057;
          padding: 0;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background .1s;
        }

        .pfw-zoom-step-btn:hover,
        .pfw-zoom-step-btn:focus {
          background: #e2e6ea;
          border-color: var(--primary, #0f763f);
          color: var(--primary, #0f763f);
          outline: none;
        }

        .pfw-zoom-step-btn::before {
          font-family: "Font Awesome 7 Free";
          font-weight: 900;
          font-size: 12px;
          line-height: 1;
        }

        .pfw-zoom-step-btn.pfw-zoom-in-btn::before {
          content: "\\f077";
        }

        .pfw-zoom-step-btn.pfw-zoom-out-btn::before {
          content: "\\f078";
        }

        .pfw-fit-btn {
          height: 40px;
          width: 46px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          background: #fff;
          color: #495057;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background .12s, color .12s, border-color .12s;
        }

        .pfw-fit-btn:hover,
        .pfw-fit-btn:focus {
          background: #f8f9fa;
          border-color: var(--primary, #0f763f);
          color: var(--primary, #0f763f);
        }

        .pfw-frame-area {
          flex: 1;
          overflow: auto;
          padding: 16px 84px 16px 20px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          background: #f0f2f5;
        }

        @media (max-width: 1199.98px) {
          .pfw-nav-col {
            width: 164px;
          }

          .pfw-nav-toggle-btn {
            left: 176px;
          }

          .pfw-frame-area {
            padding: 14px 78px 14px 16px;
          }
        }

        @media (max-width: 991.98px) {
          .pfw-toolbar {
            right: 12px;
          }

          .pfw-frame-area {
            padding-right: 72px;
          }
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

        .pfw-page-stage {
          position: relative;
          flex: 0 0 auto;
          margin: 0 auto;
        }

        .pfw-page-wrap {
          transform-origin: top left;
          box-shadow: 0 2px 12px rgba(0, 0, 0, .18);
          background: #fff;
          position: absolute;
          inset: 0 auto auto 0;
          width: ${FORM_FRAME_WIDTH}px;
          height: ${FORM_FRAME_HEIGHT}px;
        }

        .pfw-page-wrap iframe {
          display: block;
          border: none;
          width: ${FORM_FRAME_WIDTH}px;
          height: ${FORM_FRAME_HEIGHT}px;
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
            padding: 0;
          }

          .pfw-modal-box {
            height: 100dvh;
            border-radius: 0;
          }

          .pfw-modal-body {
            flex-direction: column;
          }

          .pfw-modal-close-btn {
            top: 8px;
            right: 8px;
            width: 36px;
            height: 36px;
          }

          .pfw-nav-col {
            width: 100%;
            max-height: 160px;
            padding-left: 48px;
            padding-right: 48px;
          }

          .pfw-nav-toggle-btn,
          .pfw-preview-sidebar-hidden .pfw-nav-toggle-btn {
            top: 8px;
            left: 8px;
            width: 36px;
            height: 36px;
          }

          .pfw-preview-sidebar-hidden .pfw-nav-col {
            width: 100%;
            max-height: 0;
            padding: 0;
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

          .pfw-toolbar {
            top: auto;
            right: 12px;
            bottom: 12px;
            transform: none;
            flex-direction: column;
            gap: 6px;
          }

          .pfw-frame-area {
            padding: 12px 66px 12px 12px;
          }
        }

        @media (max-width: 575.98px) {
          .pfw-nav-col {
            max-height: 132px;
          }

          .pfw-nav-list {
            padding: 6px;
          }

          .pfw-nav-btn {
            min-height: 38px;
            padding: 7px 10px;
            font-size: 12px;
          }

          .pfw-nav-footer {
            gap: 0;
            padding: 6px;
          }

          .pfw-print-btn {
            min-height: 42px;
            padding: 5px 8px;
            font-size: 10.5px;
          }

          .pfw-toolbar {
            right: 8px;
            bottom: 8px;
            padding: 6px;
          }

          .pfw-zoom-wrap {
            width: 44px;
            height: 38px;
          }

          .pfw-zoom-input {
            width: 100%;
          }

          .pfw-zoom-step-btn {
            width: 44px;
            height: 38px;
            min-height: 38px;
          }

          .pfw-fit-btn {
            width: 44px;
            height: 38px;
          }

          .pfw-frame-area {
            padding: 10px 60px 10px 10px;
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
              cursor: "pointer",
            }}
            title="Patient Form"
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

      {isModalOpen && (
        <>
          <div
            className="pfw-modal-backdrop"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="pfw-modal-dialog">
            <div
              className={`pfw-modal-box${
                isPrintSidebarHidden ? " pfw-preview-sidebar-hidden" : ""
              }`}
              role="dialog"
              aria-modal="true"
              aria-label="Printable Forms"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="pfw-nav-toggle-btn"
                onClick={() =>
                  setIsPrintSidebarHidden((isHidden) => !isHidden)
                }
                aria-label={
                  isPrintSidebarHidden
                    ? "Show print preview sidebar"
                    : "Hide print preview sidebar"
                }
                title={
                  isPrintSidebarHidden
                    ? "Show print preview sidebar"
                    : "Hide print preview sidebar"
                }
              >
                <i
                  className={`fa-solid ${
                    isPrintSidebarHidden
                      ? "fa-chevron-right"
                      : "fa-chevron-left"
                  }`}
                />
              </button>

              <button
                type="button"
                className="pfw-modal-close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close print preview"
                title="Close"
              >
                <i className="fa-solid fa-xmark" />
              </button>

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
                        min={MIN_ZOOM}
                        max={MAX_ZOOM}
                        onChange={onZoomChange}
                        aria-label="Zoom level"
                      />

                    </div>
                        <button
                          type="button"
                          className="pfw-zoom-step-btn pfw-zoom-in-btn"
                          onClick={zoomIn}
                          aria-label="Zoom in"
                          title="Zoom in"
                        >
                          ▲
                        </button>

                        <button
                          type="button"
                          className="pfw-zoom-step-btn pfw-zoom-out-btn"
                          onClick={zoomOut}
                          aria-label="Zoom out"
                          title="Zoom out"
                        >
                          ▼
                        </button>

                    <button
                      type="button"
                      className="pfw-fit-btn"
                      onClick={handleFitToScreen}
                      title="Fit form to screen"
                      aria-label="Fit form to screen"
                    >
                      <i className="fa-solid fa-expand"></i>
                    </button>

                    <button
                      type="button"
                      className="pfw-fit-btn"
                      onClick={handleResetZoom}
                      title="Reset zoom"
                      aria-label="Reset zoom"
                    >
                      <i className="isax isax-refresh" />
                    </button>
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
                    <div className="pfw-frame-area" ref={frameAreaRef}>
                      <div
                        className="pfw-page-stage"
                        style={{
                          width: `${FORM_FRAME_WIDTH * (zoom / 100)}px`,
                          height: `${FORM_FRAME_HEIGHT * (zoom / 100)}px`,
                        }}
                      >
                        <div
                          className="pfw-page-wrap"
                          style={{ transform: `scale(${zoom / 100})` }}
                        >
                          <iframe
                            key={activeTab}
                            ref={iframeRef}
                            srcDoc={testprintHtml}
                            title={
                              FORM_TABS.find((t) => t.id === activeTab)
                                ?.label ?? "Form"
                            }
                            sandbox="allow-same-origin allow-scripts allow-modals allow-popups"
                          />
                        </div>
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
