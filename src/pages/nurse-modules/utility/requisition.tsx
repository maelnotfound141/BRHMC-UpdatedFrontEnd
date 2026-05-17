import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setNurseMobileSidebar } from "@/core/redux/sidebarSlice";
import { all_routes } from "@/routes/all_routes";

const tableHeaders = [
  "RIV Number",
  "Shift",
  "Request Type",
  "Date Created",
  "Date/Time Submitted",
  "Date/Time Prepared",
  "Date/Time Issued",
  "Status",
];

type Period = "by-date" | "quarterly" | "monthly" | "annual";
type RequestType =
  | ""
  | "Regular"
  | "Additional"
  | "Shared Supplies"
  | "Emergency Stock"
  | "Personnel Use";

type BatchRequestRecord = {
  rivNumber: string;
  shift: string;
  requestType: Exclude<RequestType, "">;
  dateCreated: string;
  dateSubmitted: string;
  datePrepared: string;
  dateIssued: string;
  status: string;
};

type CalendarDay = {
  date: Date;
  inCurrentMonth: boolean;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const normalizeDate = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const isSameDate = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getQuarter = (date: Date) => Math.floor(date.getMonth() / 3) + 1;

const buildCalendarDays = (visibleMonth: Date): CalendarDay[] => {
  const firstDay = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth(),
    1
  );
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    return {
      date,
      inCurrentMonth: date.getMonth() === visibleMonth.getMonth(),
    };
  });
};

const formatDateLabel = (date: Date) =>
  date.toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const formatDateTime = (date: Date) =>
  date.toLocaleString("en-PH", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const requestTypes: Exclude<RequestType, "">[] = [
  "Regular",
  "Additional",
  "Shared Supplies",
  "Emergency Stock",
  "Personnel Use",
];

const shiftOptions = ["1st Shift", "2nd Shift", "3rd Shift"];

const requestGuides: Record<Exclude<RequestType, "">, string[]> = {
  Regular: [
    "REGULAR REQUEST - Use this option to request supplies to be used for the next shift. Submit request at least 2 hours before the end of current shift.",
    "Use Additional Request option should the ward have additional supplies needed for the current shift.",
    "In this option, you will have to set in the next field what shift this request to be created.",
  ],
  Additional: [
    "ADDITIONAL REQUEST - Use this option for supplies needed within the current shift.",
    "This request is intended for items not included in the regular request.",
  ],
  "Shared Supplies": [
    "SHARED SUPPLIES - Use this option to request common supplies shared by the ward.",
  ],
  "Emergency Stock": [
    "EMERGENCY STOCK - Use this option for urgent or emergency supply needs.",
  ],
  "Personnel Use": [
    "PERSONNEL USE - Use this option for supply requests intended for personnel use.",
  ],
};

const NurseRequisition = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileView, setIsMobileView] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [period, setPeriod] = useState<Period>("by-date");
  const [selectedDate, setSelectedDate] = useState(() =>
    normalizeDate(new Date())
  );
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [retrievedRange, setRetrievedRange] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequestType, setSelectedRequestType] =
    useState<RequestType>("");
  const [selectedShift, setSelectedShift] = useState("");
  const [batchRequests, setBatchRequests] = useState<BatchRequestRecord[]>([]);

  const nurseMobileSidebar = useSelector(
    (state: any) => state.sidebar.nurseMobileSidebar
  );

  const isSidebarOpen = isMobileView
    ? nurseMobileSidebar
    : !isDesktopCollapsed;

  const calendarDays = buildCalendarDays(visibleMonth);
  const selectedQuarter = getQuarter(visibleMonth);
  const selectedRangeLabel =
    period === "by-date"
      ? formatDateLabel(selectedDate)
      : period === "monthly"
        ? `${monthNames[visibleMonth.getMonth()]} ${visibleMonth.getFullYear()}`
        : period === "quarterly"
          ? `Q${selectedQuarter} ${visibleMonth.getFullYear()}`
          : `${visibleMonth.getFullYear()}`;

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

  const handlePeriodChange = (nextPeriod: Period) => {
    setPeriod(nextPeriod);

    if (nextPeriod === "by-date") {
      setVisibleMonth(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
      );
    }
  };

  const moveMonth = (amount: number) => {
    setVisibleMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + amount, 1)
    );
  };

  const moveYear = (amount: number) => {
    setVisibleMonth(
      (prev) => new Date(prev.getFullYear() + amount, prev.getMonth(), 1)
    );
  };

  const goToday = () => {
    const today = normalizeDate(new Date());
    setSelectedDate(today);
    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const handleCalendarDateClick = (date: Date) => {
    const normalized = normalizeDate(date);

    if (period === "by-date") {
      setSelectedDate(normalized);
    }

    setVisibleMonth(new Date(normalized.getFullYear(), normalized.getMonth(), 1));
  };

  const isDateSelected = (date: Date) => {
    if (period === "by-date") return isSameDate(date, selectedDate);
    if (period === "monthly") {
      return (
        date.getFullYear() === visibleMonth.getFullYear() &&
        date.getMonth() === visibleMonth.getMonth()
      );
    }
    if (period === "quarterly") {
      return (
        date.getFullYear() === visibleMonth.getFullYear() &&
        getQuarter(date) === selectedQuarter
      );
    }

    return date.getFullYear() === visibleMonth.getFullYear();
  };

  const resetCreateModal = () => {
    setSelectedRequestType("");
    setSelectedShift("");
  };

  const handleCloseCreateModal = () => {
    resetCreateModal();
    setShowCreateModal(false);
  };

  const handleCreateBatchRequest = () => {
    if (!selectedRequestType || !selectedShift) return;

    const sequence = String(batchRequests.length + 1).padStart(4, "0");
    const year = new Date().getFullYear();

    setBatchRequests((prev) => [
      ...prev,
      {
        rivNumber: `RIV-${year}-${sequence}`,
        shift: selectedShift,
        requestType: selectedRequestType,
        dateCreated: formatDateTime(new Date()),
        dateSubmitted: "-",
        datePrepared: "-",
        dateIssued: "-",
        status: "Created",
      },
    ]);

    handleCloseCreateModal();
  };

  return (
    <>
      <style>{`
        .central-supply-sidebar-wrap {
          flex: 0 0 280px;
          max-width: 280px;
          transition: all 0.25s ease;
          z-index: 20;
        }

        .central-supply-sidebar-wrap.sidebar-collapsed {
          flex-basis: 78px;
          max-width: 78px;
        }

        .central-supply-sidebar-card {
          position: sticky;
          top: 105px;
          width: 100%;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
          overflow: hidden;
        }

        .central-supply-toggle {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 46px;
          height: 46px;
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
          font-size: 24px;
        }

        .central-supply-profile {
          padding: 74px 20px 24px;
          text-align: center;
          transition: all 0.25s ease;
          border-bottom: 1px solid #eef1f4;
        }

        .central-supply-profile-icon {
          font-size: 3rem;
          color: #6f7b8a;
          line-height: 1;
          margin-bottom: 22px;
        }

        .central-supply-title {
          color: #172033;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 0;
        }

        .central-supply-sidebar-wrap.sidebar-collapsed .central-supply-toggle {
          left: 50%;
          right: auto;
          transform: translateX(-50%);
        }

        .central-supply-sidebar-wrap.sidebar-collapsed .central-supply-profile {
          padding: 64px 8px 14px;
        }

        .central-supply-sidebar-wrap.sidebar-collapsed .central-supply-profile-icon {
          font-size: 1.65rem;
          margin-bottom: 0;
        }

        .central-supply-sidebar-wrap.sidebar-collapsed .central-supply-title {
          display: none;
        }

        .central-supply-sidebar-wrap.sidebar-collapsed .central-supply-panel {
          display: block;
          padding: 8px;
        }

        .central-supply-sidebar-wrap.sidebar-collapsed .central-supply-period,
        .central-supply-sidebar-wrap.sidebar-collapsed .central-supply-range-pill,
        .central-supply-sidebar-wrap.sidebar-collapsed .central-supply-calendar {
          display: none;
        }

        .central-supply-panel {
          padding: 16px;
        }

        .central-supply-period {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 16px;
        }

        .central-supply-radio {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #495057;
          cursor: pointer;
        }

        .central-supply-radio input {
          accent-color: var(--primary, #0f763f);
        }

        .central-supply-calendar {
          border: 1px solid #dce5ea;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .central-supply-month {
          background: rgba(15, 118, 63, 0.1);
          color: var(--primary, #0f763f);
          font-weight: 800;
          text-align: center;
          padding: 8px;
          border-bottom: 1px solid #dce5ea;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }

        .central-supply-month-label {
          flex: 1 1 auto;
          min-width: 0;
          font-size: 0.86rem;
          white-space: nowrap;
        }

        .central-supply-month-btn {
          width: 28px;
          height: 28px;
          border: 0;
          border-radius: 5px;
          background: transparent;
          color: var(--primary, #0f763f);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .central-supply-month-btn:hover {
          background: rgba(15, 118, 63, 0.12);
        }

        .central-supply-calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }

        .central-supply-calendar-cell {
          min-height: 30px;
          border: 0;
          border-right: 1px solid #dce5ea;
          border-bottom: 1px solid #dce5ea;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: #495057;
          background: #f8fafb;
          cursor: pointer;
        }

        .central-supply-calendar-cell:nth-child(7n) {
          border-right: 0;
        }

        .central-supply-calendar-cell.weekend {
          color: #dc3545;
        }

        .central-supply-calendar-cell.selected {
          background: var(--primary, #0f763f);
          color: #fff;
        }

        .central-supply-calendar-cell.muted {
          color: #adb5bd;
          background: #f1f3f5;
        }

        .central-supply-calendar-cell.muted.weekend {
          color: #d78a92;
        }

        .central-supply-calendar-cell.today {
          box-shadow: inset 0 0 0 2px #f59f00;
        }

        .central-supply-calendar-cell.header {
          background: #eef5f8;
          color: #6c757d;
          min-height: 26px;
          cursor: default;
        }

        .central-supply-calendar-nav {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          background: rgba(15, 118, 63, 0.1);
          color: var(--primary, #0f763f);
          font-weight: 800;
          font-size: 0.72rem;
          text-align: center;
          padding: 0;
        }

        .central-supply-calendar-nav button {
          border: 0;
          background: transparent;
          color: var(--primary, #0f763f);
          font-weight: 800;
          font-size: 0.72rem;
          padding: 8px 0;
        }

        .central-supply-calendar-nav button:hover {
          background: rgba(15, 118, 63, 0.12);
        }

        .central-supply-range-pill {
          border: 1px solid rgba(15, 118, 63, 0.2);
          border-radius: 8px;
          background: rgba(15, 118, 63, 0.07);
          color: var(--primary, #0f763f);
          font-size: 0.76rem;
          font-weight: 800;
          line-height: 1.35;
          padding: 9px 10px;
          margin-bottom: 12px;
          text-align: center;
        }

        .central-supply-action {
          width: 100%;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #172033;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 12px;
          font-weight: 800;
          transition: all 0.2s ease;
        }

        .central-supply-action:hover {
          background: rgba(15, 118, 63, 0.08);
          color: var(--primary, #0f763f);
        }

        .central-supply-action i {
          font-size: 1.35rem;
        }

        .central-supply-sidebar-wrap.sidebar-collapsed .central-supply-action {
          width: 46px;
          height: 46px;
          padding: 0;
          margin: 0 auto 6px;
          border-radius: 8px;
          gap: 0;
        }

        .central-supply-sidebar-wrap.sidebar-collapsed .central-supply-action span {
          display: none;
        }

        .central-supply-close-btn {
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

        .central-supply-close-btn:hover {
          background: var(--primary, #0f763f);
          border-color: var(--primary, #0f763f);
          color: #fff;
        }

        .central-supply-generate-btn {
          border-radius: 5px;
          border: 1px solid var(--primary, #0f763f);
          background: var(--primary, #0f763f);
          color: #fff;
          font-weight: 800;
        }

        .central-supply-generate-btn:hover,
        .central-supply-generate-btn:focus,
        .central-supply-generate-btn:active {
          border-color: var(--primary, #0f763f);
          background: var(--primary, #0f763f);
          color: #fff;
          box-shadow: 0 0 0 0.15rem rgba(15, 118, 63, 0.18);
        }

        .central-supply-table thead th {
          background: #101214;
          color: #fff;
          font-size: 0.78rem;
          font-weight: 700;
          border-color: #101214;
          white-space: nowrap;
          padding: 12px 14px;
        }

        .central-supply-table tbody td {
          padding: 12px 14px;
          font-size: 0.84rem;
          vertical-align: middle;
        }

        .central-supply-table tbody tr.central-supply-data-row {
          cursor: pointer;
        }

        .central-supply-table tbody tr.central-supply-data-row:hover td {
          background: rgba(15, 118, 63, 0.06);
        }

        .central-supply-results-bar {
          border-bottom: 1px solid #e9ecef;
          background: #fff;
        }

        .central-supply-table-empty {
          height: 440px;
          background: #fff;
        }

        .central-supply-mobile-backdrop {
          display: none;
        }

        .central-supply-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1060;
          background: rgba(0, 0, 0, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .central-supply-modal {
          width: 100%;
          max-width: 560px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
          overflow: hidden;
        }

        .central-supply-modal-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          border-bottom: 1px solid #e9ecef;
          background: #fff;
        }

        .central-supply-modal-title h6 {
          font-size: 0.88rem;
          font-weight: 800;
          margin: 0;
        }

        .central-supply-modal-close {
          width: 30px;
          height: 30px;
          border: 0;
          border-radius: 5px;
          background: transparent;
          color: #495057;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .central-supply-modal-close:hover {
          background: #f1f3f5;
          color: #212529;
        }

        .central-supply-modal-body {
          padding: 22px;
        }

        .central-supply-modal-row {
          display: grid;
          grid-template-columns: 140px minmax(0, 1fr);
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .central-supply-modal-label {
          text-align: right;
          font-weight: 800;
          color: #495057;
          font-size: 0.86rem;
        }

        .central-supply-modal-select {
          width: 100%;
          height: 34px;
          border: 1px solid #adb5bd;
          border-radius: 2px;
          padding: 4px 8px;
          font-weight: 700;
          color: #212529;
          background: #fff;
        }

        .central-supply-modal-select:focus {
          border-color: var(--primary, #0f763f);
          box-shadow: 0 0 0 0.15rem rgba(15, 118, 63, 0.18);
          outline: none;
        }

        .central-supply-guide-wrap {
          margin-left: 148px;
          margin-top: 10px;
        }

        .central-supply-guide-title {
          color: var(--primary, #0f763f);
          font-size: 0.86rem;
          font-weight: 900;
          margin-bottom: 6px;
        }

        .central-supply-guide-box {
          min-height: 165px;
          border: 1px solid #adb5bd;
          background: #fff;
          padding: 10px;
          color: #19716e;
          font-size: 0.82rem;
          font-weight: 700;
          line-height: 1.35;
        }

        .central-supply-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 0 22px 18px;
        }

        .central-supply-create-btn {
          min-width: 150px;
          border-radius: 5px;
          font-weight: 800;
          color: var(--primary, #0f763f);
          border: 1px solid var(--primary, #0f763f);
          background: #fff;
        }

        .central-supply-create-btn:hover,
        .central-supply-create-btn:focus,
        .central-supply-create-btn:active {
          color: #fff;
          background: var(--primary, #0f763f);
          border-color: var(--primary, #0f763f);
          box-shadow: 0 0 0 0.15rem rgba(15, 118, 63, 0.18);
        }

        .central-supply-create-btn:disabled {
          color: #6c757d;
          border-color: #ced4da;
          background: #f8f9fa;
          opacity: 0.75;
          box-shadow: none;
        }

        @media (max-width: 575.98px) {
          .central-supply-modal-row {
            grid-template-columns: 1fr;
            gap: 5px;
          }

          .central-supply-modal-label {
            text-align: left;
          }

          .central-supply-guide-wrap {
            margin-left: 0;
          }
        }

        @media (max-width: 991.98px) {
          .central-supply-sidebar-wrap {
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

          .central-supply-sidebar-wrap.sidebar-mobile-open {
            transform: translateX(0);
            pointer-events: auto;
          }

          .central-supply-sidebar-wrap.sidebar-expanded,
          .central-supply-sidebar-wrap.sidebar-collapsed {
            flex: none !important;
            flex-basis: auto !important;
            max-width: 280px;
          }

          .central-supply-sidebar-card {
            position: static;
          }

          .central-supply-sidebar-wrap.sidebar-collapsed .central-supply-toggle {
            left: auto;
            right: 18px;
            transform: none;
          }

          .central-supply-sidebar-wrap.sidebar-collapsed .central-supply-title,
          .central-supply-sidebar-wrap.sidebar-collapsed .central-supply-panel {
            display: block;
          }

          .central-supply-sidebar-wrap.sidebar-collapsed .central-supply-panel {
            padding: 16px;
          }

          .central-supply-sidebar-wrap.sidebar-collapsed .central-supply-period {
            display: grid;
          }

          .central-supply-sidebar-wrap.sidebar-collapsed .central-supply-range-pill,
          .central-supply-sidebar-wrap.sidebar-collapsed .central-supply-calendar {
            display: block;
          }

          .central-supply-sidebar-wrap.sidebar-collapsed .central-supply-action {
            width: 100%;
            height: auto;
            padding: 14px 12px;
            margin: 0;
            border-radius: 8px;
            gap: 10px;
          }

          .central-supply-sidebar-wrap.sidebar-collapsed .central-supply-action span {
            display: inline;
          }

          .central-supply-sidebar-wrap.sidebar-collapsed .central-supply-profile-icon {
            font-size: 3rem;
            margin-bottom: 22px;
          }

          .central-supply-profile {
            padding: 64px 18px 22px;
          }

          .central-supply-mobile-backdrop {
            position: fixed;
            inset: 0;
            z-index: 1040;
            background: rgba(0, 0, 0, 0.25);
            display: block;
          }
        }

        @media (max-width: 575.98px) {
          .central-supply-sidebar-wrap {
            width: 265px;
            max-width: 265px;
            padding-left: 10px;
            padding-right: 10px;
          }

          .central-supply-table-empty {
            height: 320px;
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
                className="central-supply-mobile-backdrop"
                onClick={closeMobileSidebar}
                aria-hidden="true"
              />
            )}

            <aside
              className={[
                "central-supply-sidebar-wrap",
                isSidebarOpen ? "sidebar-expanded" : "sidebar-collapsed",
                isMobileView && nurseMobileSidebar
                  ? "sidebar-mobile-open"
                  : "",
              ].join(" ")}
            >
              <div className="central-supply-sidebar-card">
                <button
                  type="button"
                  className="central-supply-toggle"
                  aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                  title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                  onClick={toggleSidebar}
                >
                  <i className="fa-solid fa-bars" />
                </button>

                <div className="central-supply-profile">
                  <div className="central-supply-profile-icon">
                    <i className="isax isax-box" />
                  </div>

                  <h4 className="central-supply-title">Central Supply</h4>
                </div>

                <div className="central-supply-panel">
                  <div className="central-supply-period">
                    {[
                      ["by-date", "By Date"],
                      ["quarterly", "Quarterly"],
                      ["monthly", "Monthly"],
                      ["annual", "Annual"],
                    ].map(([value, label]) => (
                      <label className="central-supply-radio" key={value}>
                        <input
                          type="radio"
                          name="central-supply-period"
                          checked={period === value}
                          onChange={() => handlePeriodChange(value as Period)}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="central-supply-range-pill">
                    {selectedRangeLabel}
                  </div>

                  <div className="central-supply-calendar">
                    <div className="central-supply-month">
                      <button
                        type="button"
                        className="central-supply-month-btn"
                        onClick={() => moveMonth(-1)}
                        aria-label="Previous month"
                      >
                        <i className="isax isax-arrow-left-2" />
                      </button>
                      <span className="central-supply-month-label">
                        {monthNames[visibleMonth.getMonth()]}{" "}
                        {visibleMonth.getFullYear()}
                      </span>
                      <button
                        type="button"
                        className="central-supply-month-btn"
                        onClick={() => moveMonth(1)}
                        aria-label="Next month"
                      >
                        <i className="isax isax-arrow-right-3" />
                      </button>
                    </div>
                    <div className="central-supply-calendar-grid">
                      {["S", "M", "T", "W", "Th", "F", "S"].map((day) => (
                        <div
                          className="central-supply-calendar-cell header"
                          key={day}
                        >
                          {day}
                        </div>
                      ))}

                      {calendarDays.map((day) => {
                        const isWeekend =
                          day.date.getDay() === 0 || day.date.getDay() === 6;
                        const isSelected = isDateSelected(day.date);
                        const isToday = isSameDate(day.date, new Date());

                        return (
                        <button
                          type="button"
                          className={[
                            "central-supply-calendar-cell",
                            isWeekend ? "weekend" : "",
                            isSelected ? "selected" : "",
                            isToday ? "today" : "",
                            !day.inCurrentMonth ? "muted" : "",
                          ].join(" ")}
                          key={day.date.toISOString()}
                          onClick={() => handleCalendarDateClick(day.date)}
                        >
                          {day.date.getDate()}
                        </button>
                        );
                      })}
                    </div>
                    <div className="central-supply-calendar-nav">
                      <button type="button" onClick={() => moveYear(-1)}>
                        Y
                      </button>
                      <button type="button" onClick={() => moveMonth(-1)}>
                        M
                      </button>
                      <button type="button" onClick={goToday}>
                        Today
                      </button>
                      <button type="button" onClick={() => moveMonth(1)}>
                        M
                      </button>
                      <button type="button" onClick={() => moveYear(1)}>
                        Y
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="central-supply-action"
                    onClick={() => setRetrievedRange(selectedRangeLabel)}
                  >
                    <i className="isax isax-calendar-search" />
                    <span>Retrieve</span>
                  </button>

                  <button type="button" className="central-supply-action">
                    <i className="isax isax-printer" />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            </aside>

            <div className="nurse-dashboard-main mt-4 mt-lg-0">
              <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-4">
                <div className="bg-white px-3 px-md-4 py-3 border-bottom">
                  <div className="d-flex align-items-center justify-content-between gap-3">
                    <button
                      type="button"
                      className="btn btn-sm central-supply-generate-btn px-4 py-2"
                      onClick={() => setShowCreateModal(true)}
                    >
                      Generate Batch Request
                    </button>

                    <button
                      type="button"
                      className="central-supply-close-btn"
                      aria-label="Back to ward utility"
                      title="Back to ward utility"
                      onClick={() => navigate(all_routes.nurseUtility)}
                    >
                      <i className="isax isax-close-circle" />
                    </button>
                  </div>
                </div>

                <div className="central-supply-results-bar px-3 px-md-4 py-2">
                  <div className="small text-muted">
                    Active range:{" "}
                    <span className="fw-bold text-dark">{selectedRangeLabel}</span>
                    {retrievedRange && (
                      <>
                        <span className="mx-2">|</span>
                        Retrieved:{" "}
                        <span className="fw-bold text-dark">
                          {retrievedRange}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0 central-supply-table">
                    <thead>
                      <tr>
                        {tableHeaders.map((header) => (
                          <th key={header}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {batchRequests.length > 0 ? (
                        batchRequests.map((request) => (
                          <tr
                            key={request.rivNumber}
                            className="central-supply-data-row"
                            onClick={() =>
                              navigate(all_routes.nurseSupplyRequisition, {
                                state: { batchRequest: request },
                              })
                            }
                          >
                            <td className="fw-bold text-dark">
                              {request.rivNumber}
                            </td>
                            <td>{request.shift}</td>
                            <td>{request.requestType}</td>
                            <td>{request.dateCreated}</td>
                            <td>{request.dateSubmitted}</td>
                            <td>{request.datePrepared}</td>
                            <td>{request.dateIssued}</td>
                            <td>
                              <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2">
                                {request.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={tableHeaders.length} className="p-0">
                            <div className="central-supply-table-empty" />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="central-supply-modal-backdrop">
          <div className="central-supply-modal">
            <div className="central-supply-modal-title">
              <h6 className="d-flex align-items-center gap-2">
                <i className="isax isax-add-square" />
                Create New Batch Request
              </h6>

              <button
                type="button"
                className="central-supply-modal-close"
                onClick={handleCloseCreateModal}
                aria-label="Close"
              >
                <i className="isax isax-close-circle" />
              </button>
            </div>

            <div className="central-supply-modal-body">
              <div className="central-supply-modal-row">
                <label
                  className="central-supply-modal-label"
                  htmlFor="requestType"
                >
                  Type of Request :
                </label>
                <select
                  id="requestType"
                  className="central-supply-modal-select"
                  value={selectedRequestType}
                  onChange={(event) => {
                    setSelectedRequestType(event.target.value as RequestType);
                    setSelectedShift("");
                  }}
                >
                  <option value=""></option>
                  {requestTypes.map((requestType) => (
                    <option value={requestType} key={requestType}>
                      {requestType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="central-supply-modal-row">
                <label className="central-supply-modal-label" htmlFor="shift">
                  Shift :
                </label>
                <select
                  id="shift"
                  className="central-supply-modal-select"
                  value={selectedShift}
                  disabled={!selectedRequestType}
                  onChange={(event) => setSelectedShift(event.target.value)}
                >
                  <option value=""></option>
                  {shiftOptions.map((shift) => (
                    <option value={shift} key={shift}>
                      {shift}
                    </option>
                  ))}
                </select>
              </div>

              <div className="central-supply-guide-wrap">
                <div className="central-supply-guide-title">
                  Request Option Guide
                </div>
                <div className="central-supply-guide-box">
                  {selectedRequestType
                    ? requestGuides[selectedRequestType].map((line, index) => (
                        <p className="mb-3" key={index}>
                          {line}
                        </p>
                      ))
                    : null}
                </div>
              </div>
            </div>

            <div className="central-supply-modal-footer">
              <button
                type="button"
                className="btn central-supply-create-btn"
                disabled={!selectedRequestType || !selectedShift}
                onClick={handleCreateBatchRequest}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NurseRequisition;
