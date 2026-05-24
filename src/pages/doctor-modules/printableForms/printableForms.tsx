import DoctorSidebar from "@/components/custom-sidebar/doctorSidebar";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PatientHistoryAndPhysicalExamination from "./patientHistoryForms";
import PatientHistoryFormPage2 from "./patientHistoryFormsPage2";
import DischargeSummary from "./dischargeSummary";

type PrintableFormKey =
  | "patient-history"
  | "discharge-instruction"
  | "discharge-summary"
  | "medical-abstract"
  | "claim-form-4"
  | "archive-file";

type PrintableForm = {
  key: PrintableFormKey;
  label: string;
  icon: string;
  defaultHeight: number;
};

const printableForms: PrintableForm[] = [
  {
    key: "patient-history",
    label: "Patient History",
    icon: "isax isax-document-text",
    defaultHeight: 2320,
  },
  {
    key: "discharge-instruction",
    label: "Discharge Instruction",
    icon: "isax isax-document-forward",
    defaultHeight: 620,
  },
  {
    key: "discharge-summary",
    label: "Discharge Summary",
    icon: "isax isax-clipboard-text",
    defaultHeight: 1180,
  },
  {
    key: "medical-abstract",
    label: "Medical Abstract",
    icon: "isax isax-document-copy",
    defaultHeight: 620,
  },
  {
    key: "claim-form-4",
    label: "Claim Form 4",
    icon: "isax isax-document-normal",
    defaultHeight: 620,
  },
  {
    key: "archive-file",
    label: "Archive File",
    icon: "isax isax-archive-book",
    defaultHeight: 620,
  },
];

const PREVIEW_BASE_WIDTH = 860;
const MIN_ZOOM = 50;
const MAX_ZOOM = 160;

const clampZoom = (value: number) =>
  Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

const BlankPreview = ({ title }: { title: string }) => (
  <div className="doctor-print-blank-preview">
    <div>
      <i className="isax isax-document-text" />
      <h6>{title}</h6>
      <p>Preview is not available yet.</p>
    </div>
  </div>
);

const PrintableForms = () => {
  const previewScrollRef = useRef<HTMLDivElement | null>(null);
  const previewContentRef = useRef<HTMLDivElement | null>(null);
  const [activeFormKey, setActiveFormKey] =
    useState<PrintableFormKey>("patient-history");
  const [zoom, setZoom] = useState(100);
  const [zoomMode, setZoomMode] = useState<"fit-width" | "manual">(
    "fit-width"
  );
  const [previewHeight, setPreviewHeight] = useState(
    printableForms[0].defaultHeight
  );

  const [mockPatientProfile] = useState({
    hospitalNumber: "000000000777288",
    lastName: "DO",
    firstName: "REA",
    middleName: "MON",
  });

  const activeForm =
    printableForms.find((form) => form.key === activeFormKey) ||
    printableForms[0];

  const previewContent = useMemo<ReactNode>(() => {
    switch (activeFormKey) {
      case "patient-history":
        return (
          <>
            <PatientHistoryAndPhysicalExamination embedded />
            <PatientHistoryFormPage2 embedded />
          </>
        );
      case "discharge-summary":
        return <DischargeSummary embedded />;
      case "discharge-instruction":
      case "medical-abstract":
      case "claim-form-4":
      case "archive-file":
      default:
        return <BlankPreview title={activeForm.label} />;
    }
  }, [activeForm.label, activeFormKey]);

  useEffect(() => {
    setPreviewHeight(activeForm.defaultHeight);

    const frame = window.requestAnimationFrame(() => {
      const measuredHeight = Math.max(
        previewContentRef.current?.scrollHeight || 0,
        activeForm.defaultHeight
      );

      setPreviewHeight(measuredHeight);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeForm.defaultHeight, activeFormKey]);

  const handleZoomChange = (value: string) => {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) return;

    setZoomMode("manual");
    setZoom(clampZoom(numericValue));
  };

  const handleFitWidth = useCallback(() => {
    const previewScroll = previewScrollRef.current;

    if (!previewScroll) return;

    const styles = window.getComputedStyle(previewScroll);
    const horizontalPadding =
      parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
    const availableWidth = previewScroll.clientWidth - horizontalPadding;

    if (availableWidth <= 0) return;

    setZoom(clampZoom(Math.floor((availableWidth / PREVIEW_BASE_WIDTH) * 100)));
  }, []);

  useEffect(() => {
    if (zoomMode !== "fit-width") return;

    const frame = window.requestAnimationFrame(handleFitWidth);

    window.addEventListener("resize", handleFitWidth);

    let observer: ResizeObserver | undefined;

    if (typeof ResizeObserver !== "undefined" && previewScrollRef.current) {
      observer = new ResizeObserver(handleFitWidth);
      observer.observe(previewScrollRef.current);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleFitWidth);
      observer?.disconnect();
    };
  }, [activeFormKey, handleFitWidth, zoomMode]);

  const handlePrintCurrent = () => {
    window.print();
  };

  return (
    <>
      <style>{`
        .doctor-print-card {
          border-top: 4px solid var(--primary, #0f763f);
          display: flex;
          flex-direction: column;
          height: calc(100dvh - 104px);
          min-height: 680px;
        }

        .doctor-print-toolbar {
          background: #fff;
          border-bottom: 1px solid #e9ecef;
          flex-shrink: 0;
        }

        .doctor-print-toolbar-main {
          display: grid;
          grid-template-columns: minmax(230px, 0.8fr) minmax(0, 1.4fr) auto;
          align-items: center;
          gap: 14px;
        }

        .doctor-print-patient-strip {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          color: #6c757d;
          font-size: 0.78rem;
          font-weight: 700;
          line-height: 1.3;
        }

        .doctor-print-patient-strip strong {
          color: #172033;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .doctor-print-patient-strip span {
          min-width: 0;
        }

        .doctor-print-toolbar-controls {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          flex-wrap: wrap;
        }

        .doctor-print-zoom-input {
          width: 78px;
          min-height: 38px;
          border: 1px solid #dee2e6;
          border-radius: 5px;
          text-align: center;
          font-weight: 800;
          color: #172033;
        }

        .doctor-print-zoom-input:focus {
          border-color: var(--primary, #0f763f);
          box-shadow: 0 0 0 0.15rem rgba(15, 118, 63, 0.16);
          outline: none;
        }

        .doctor-print-action-btn {
          min-height: 38px;
          border: 1px solid #dee2e6;
          border-radius: 5px;
          background: #fff;
          color: #172033;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px 14px;
          font-weight: 800;
          transition: all 0.2s ease;
        }

        .doctor-print-action-btn:hover,
        .doctor-print-action-btn:focus {
          border-color: var(--primary, #0f763f);
          color: var(--primary, #0f763f);
        }

        .doctor-print-action-btn.primary {
          background: var(--primary, #0f763f);
          border-color: var(--primary, #0f763f);
          color: #fff;
        }

        .doctor-print-action-btn.primary:hover,
        .doctor-print-action-btn.primary:focus,
        .doctor-print-action-btn.primary:active {
          background: var(--primary, #0f763f);
          border-color: var(--primary, #0f763f);
          color: #fff;
        }

        .doctor-print-tabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          min-width: 0;
        }

        .doctor-print-tabs::-webkit-scrollbar {
          display: none;
        }

        .doctor-print-tab {
          min-height: 38px;
          border: 1px solid #e9ecef;
          border-radius: 5px;
          background: #fff;
          color: #495057;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px 12px;
          font-weight: 800;
          white-space: nowrap;
          text-align: center;
          transition: all 0.2s ease;
        }

        .doctor-print-tab:hover {
          border-color: var(--primary, #0f763f);
          color: var(--primary, #0f763f);
        }

        .doctor-print-tab.active {
          background: var(--primary, #0f763f);
          border-color: var(--primary, #0f763f);
          color: #fff;
          box-shadow: 0 8px 20px rgba(15, 118, 63, 0.18);
        }

        .doctor-print-tab i {
          font-size: 1rem;
        }

        .doctor-print-preview-section {
          flex: 1;
          min-height: 0;
          display: flex;
          background: #eef2f4;
        }

        .doctor-print-preview-scroll {
          flex: 1;
          min-height: 0;
          max-height: none;
          overflow: auto;
          padding: 16px 20px;
        }

        .doctor-print-preview-stage {
          width: 860px;
          margin: 0 auto;
          transform-origin: top center;
          transition: width 0.18s ease, height 0.18s ease;
        }

        .doctor-print-preview-page {
          width: 860px;
          transform-origin: top left;
          transition: transform 0.18s ease;
        }

        .doctor-print-preview-form-render > div {
          margin-left: auto !important;
          margin-right: auto !important;
        }

        .doctor-print-blank-preview {
          width: 794px;
          min-height: 520px;
          margin: 0 auto;
          background: #fff;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.16);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #6c757d;
        }

        .doctor-print-blank-preview i {
          color: var(--primary, #0f763f);
          display: block;
          font-size: 2.8rem;
          margin-bottom: 10px;
        }

        .doctor-print-blank-preview h6 {
          color: #172033;
          font-weight: 900;
          margin-bottom: 4px;
        }

        .doctor-print-blank-preview p {
          font-size: 0.88rem;
          font-weight: 700;
          margin: 0;
        }

        @media (max-width: 991.98px) {
          .doctor-print-card {
            height: auto;
            min-height: calc(100dvh - 96px);
          }

          .doctor-print-toolbar-main {
            grid-template-columns: 1fr;
            align-items: stretch;
          }

          .doctor-print-toolbar-controls {
            justify-content: flex-start;
          }

          .doctor-print-preview-scroll {
            padding: 14px;
          }
        }

        @media (max-width: 575.98px) {
          .content.doctor-content {
            margin-top: -1rem !important;
          }

          .container-fluid {
            padding-left: 10px !important;
            padding-right: 10px !important;
          }

          .doctor-print-toolbar {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }

          .doctor-print-action-btn,
          .doctor-print-zoom-input {
            width: 100%;
          }

          .doctor-print-toolbar-controls {
            display: grid;
            grid-template-columns: 1fr;
          }

          .doctor-print-tabs {
            gap: 6px;
          }

          .doctor-print-tab {
            min-width: 150px;
          }

          .doctor-print-preview-section {
            min-height: calc(100dvh - 330px);
          }

          .doctor-print-preview-scroll {
            padding: 12px;
          }
        }

        @media print {
          body * {
            visibility: hidden !important;
          }

          .doctor-print-preview-print-area,
          .doctor-print-preview-print-area * {
            visibility: visible !important;
          }

          .doctor-print-preview-print-area {
            position: absolute !important;
            inset: 0 auto auto 0 !important;
            width: 100% !important;
            background: #fff !important;
          }

          .doctor-print-preview-scroll {
            overflow: visible !important;
            max-height: none !important;
            min-height: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }

          .doctor-print-preview-stage,
          .doctor-print-preview-page {
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            transform: none !important;
          }

          .doctor-print-preview-form-render > div {
            break-after: page;
            page-break-after: always;
          }

          .doctor-print-preview-form-render > div:last-child {
            break-after: auto;
            page-break-after: auto;
          }

          .doctor-print-blank-preview {
            box-shadow: none !important;
          }
        }
      `}</style>

      <div
        className="content doctor-content bg-light mt-n4"
        style={{ minHeight: "100vh" }}
      >
        <div className="container-fluid px-2 px-lg-3 pt-0">
          <div className="doctor-dashboard-layout">
            <DoctorSidebar />

            <div className="doctor-dashboard-main mt-4 mt-lg-0">
              <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-0 doctor-print-card">
                <div className="doctor-print-toolbar px-3 px-md-4 py-3">
                  <div className="doctor-print-toolbar-main">
                    <div className="min-width-0">
                      <h5 className="fw-bold text-dark mb-1 text-uppercase">
                        Forms Print Preview
                      </h5>
                      <div className="doctor-print-patient-strip">
                        <span>ID: {mockPatientProfile.hospitalNumber}</span>
                        <strong>
                          {mockPatientProfile.lastName},{" "}
                          {mockPatientProfile.firstName}{" "}
                          {mockPatientProfile.middleName}
                        </strong>
                      </div>
                    </div>

                    <div className="doctor-print-tabs" role="tablist">
                      {printableForms.map((form) => (
                        <button
                          type="button"
                          key={form.key}
                          className={`doctor-print-tab ${
                            activeFormKey === form.key ? "active" : ""
                          }`}
                          role="tab"
                          aria-selected={activeFormKey === form.key}
                          onClick={() => {
                            setActiveFormKey(form.key);
                            setZoomMode("fit-width");
                          }}
                        >
                          <i className={form.icon} />
                          <span>{form.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="doctor-print-toolbar-controls">
                      <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2">
                        <input
                          type="number"
                          className="doctor-print-zoom-input"
                          value={zoom}
                          min={MIN_ZOOM}
                          max={MAX_ZOOM}
                          step={10}
                          aria-label="Preview zoom percentage"
                          onChange={(event) => handleZoomChange(event.target.value)}
                        />
                        <span className="small text-muted fw-bold align-self-center text-nowrap">
                          Zoom
                        </span>
                      </div>

                      <button
                        type="button"
                        className="doctor-print-action-btn"
                        onClick={() => {
                          setZoomMode("fit-width");
                          window.requestAnimationFrame(handleFitWidth);
                        }}
                      >
                        <i className="isax isax-maximize-4" />
                        Fit Width
                      </button>

                      <button
                        type="button"
                        className="doctor-print-action-btn"
                        onClick={() => {
                          setZoomMode("manual");
                          setZoom(100);
                        }}
                      >
                        <i className="isax isax-refresh" />
                        Reset
                      </button>

                      <button
                        type="button"
                        className="doctor-print-action-btn primary"
                        onClick={handlePrintCurrent}
                      >
                        <i className="isax isax-printer" />
                        Print
                      </button>
                    </div>
                  </div>
                </div>

                <div className="doctor-print-preview-section doctor-print-preview-print-area">
                  <div
                    className="doctor-print-preview-scroll"
                    ref={previewScrollRef}
                  >
                    <div
                      className="doctor-print-preview-stage"
                      style={{
                        width: `${PREVIEW_BASE_WIDTH * (zoom / 100)}px`,
                        height: `${previewHeight * (zoom / 100)}px`,
                      }}
                    >
                      <div
                        className="doctor-print-preview-page"
                        style={{ transform: `scale(${zoom / 100})` }}
                      >
                        <div
                          ref={previewContentRef}
                          className="doctor-print-preview-form-render"
                        >
                          {previewContent}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintableForms;
