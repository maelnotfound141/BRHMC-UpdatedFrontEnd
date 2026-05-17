import NurseSidebar from "@/components/custom-sidebar/nurseSidebar";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";
import ccsFormHtml from "@/pages/doctor-modules/printableForms/index1.html?raw";
import patientIdHtml from "@/pages/doctor-modules/printableForms/index2.html?raw";
import otherFormHtml from "@/pages/doctor-modules/printableForms/index3.html?raw";
import brhmcLogo from "@/pages/doctor-modules/printableForms/logo/brhmclogo.jpg";

type PrintableFormKey = "ccs-form" | "patient-id" | "other-form";

type PrintableForm = {
  key: PrintableFormKey;
  label: string;
  subtitle: string;
  icon: string;
  html: string;
  defaultHeight: number;
};

const printableForms: PrintableForm[] = [
  {
    key: "ccs-form",
    label: "CCS Form",
    subtitle: "Clinical cover sheet",
    icon: "isax isax-document-text",
    html: ccsFormHtml,
    defaultHeight: 1280,
  },
  {
    key: "patient-id",
    label: "Patient ID",
    subtitle: "Patient identification form",
    icon: "isax isax-card",
    html: patientIdHtml,
    defaultHeight: 1120,
  },
  {
    key: "other-form",
    label: "Other Form",
    subtitle: "Watcher and supporting forms",
    icon: "isax isax-document-copy",
    html: otherFormHtml,
    defaultHeight: 1320,
  },
];

const clampZoom = (value: number) => Math.min(160, Math.max(50, value));

const Forms = () => {
  const location = useLocation();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [activeFormKey, setActiveFormKey] =
    useState<PrintableFormKey>("ccs-form");
  const [zoom, setZoom] = useState(100);
  const [previewHeight, setPreviewHeight] = useState(
    printableForms[0].defaultHeight
  );

  const [mockPatientProfile] = useState({
    hospitalNumber: "000000000777288",
    lastName: "DO",
    firstName: "REA",
    middleName: "MON",
    address: "111 Legazpi City, Albay 4500",
  });

  useEffect(() => {
    const selectedPatientId = location.state?.selectedPatientId;

    if (selectedPatientId) {
      setTimeout(() => {}, 1500);
    }
  }, [location.state]);

  const activeForm =
    printableForms.find((form) => form.key === activeFormKey) ||
    printableForms[0];

  const previewHtml = useMemo(
    () =>
      activeForm.html.replaceAll("/logo/brhmclogo.jpg", brhmcLogo),
    [activeForm.html]
  );

  useEffect(() => {
    setPreviewHeight(activeForm.defaultHeight);
  }, [activeForm]);

  const handleIframeLoad = () => {
    const iframeDocument = iframeRef.current?.contentWindow?.document;

    if (!iframeDocument) return;

    const measuredHeight = Math.max(
      iframeDocument.documentElement?.scrollHeight || 0,
      iframeDocument.body?.scrollHeight || 0,
      activeForm.defaultHeight
    );

    setPreviewHeight(measuredHeight);
  };

  const handleZoomChange = (value: string) => {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) return;

    setZoom(clampZoom(numericValue));
  };

  const handlePrintCurrent = () => {
    const iframeWindow = iframeRef.current?.contentWindow;

    if (!iframeWindow) return;

    iframeWindow.focus();
    iframeWindow.print();
  };

  return (
    <>
      <style>{`
        .nurse-forms-card {
          border-top: 4px solid var(--primary, #0f763f);
        }

        .nurse-forms-avatar {
          width: 90px;
          height: 90px;
          border: 2px solid var(--primary, #0f763f);
          color: var(--primary, #0f763f);
        }

        .nurse-forms-toolbar {
          background: #fff;
          border-bottom: 1px solid #e9ecef;
        }

        .nurse-forms-toolbar-main {
          display: grid;
          grid-template-columns: minmax(190px, auto) minmax(0, 1fr) auto;
          align-items: center;
          gap: 14px;
        }

        .nurse-forms-toolbar-controls {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          flex-wrap: wrap;
        }

        .nurse-forms-zoom-input {
          width: 78px;
          min-height: 38px;
          border: 1px solid #dee2e6;
          border-radius: 5px;
          text-align: center;
          font-weight: 800;
          color: #172033;
        }

        .nurse-forms-zoom-input:focus {
          border-color: var(--primary, #0f763f);
          box-shadow: 0 0 0 0.15rem rgba(15, 118, 63, 0.16);
          outline: none;
        }

        .nurse-forms-action-btn {
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

        .nurse-forms-action-btn:hover,
        .nurse-forms-action-btn:focus {
          border-color: var(--primary, #0f763f);
          color: var(--primary, #0f763f);
        }

        .nurse-forms-action-btn.primary {
          background: var(--primary, #0f763f);
          border-color: var(--primary, #0f763f);
          color: #fff;
        }

        .nurse-forms-action-btn.primary:hover,
        .nurse-forms-action-btn.primary:focus,
        .nurse-forms-action-btn.primary:active {
          background: var(--primary, #0f763f);
          border-color: var(--primary, #0f763f);
          color: #fff;
        }

        .nurse-forms-tabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          min-width: 0;
        }

        .nurse-forms-tabs::-webkit-scrollbar {
          display: none;
        }

        .nurse-forms-tab {
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

        .nurse-forms-tab:hover {
          border-color: var(--primary, #0f763f);
          color: var(--primary, #0f763f);
        }

        .nurse-forms-tab.active {
          background: var(--primary, #0f763f);
          border-color: var(--primary, #0f763f);
          color: #fff;
          box-shadow: 0 8px 20px rgba(15, 118, 63, 0.18);
        }

        .nurse-forms-tab i {
          font-size: 1rem;
        }

        .nurse-forms-preview-section {
          min-height: 620px;
          background: #eef2f4;
        }

        .nurse-forms-preview-scroll {
          min-height: 620px;
          max-height: calc(100dvh - 320px);
          overflow: auto;
          padding: 24px;
        }

        .nurse-forms-preview-stage {
          width: 794px;
          margin: 0 auto;
          transform-origin: top center;
          transition: width 0.18s ease, height 0.18s ease;
        }

        .nurse-forms-preview-page {
          width: 794px;
          background: #fff;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.16);
          overflow: hidden;
          transform-origin: top left;
          transition: transform 0.18s ease;
        }

        .nurse-forms-preview-frame {
          width: 794px;
          border: 0;
          display: block;
          background: #fff;
        }

        @media (max-width: 991.98px) {
          .nurse-forms-toolbar-main {
            grid-template-columns: 1fr;
            align-items: stretch;
          }

          .nurse-forms-toolbar-controls {
            justify-content: flex-start;
          }

          .nurse-forms-preview-scroll {
            max-height: calc(100dvh - 360px);
            padding: 18px;
          }
        }

        @media (max-width: 575.98px) {
          .content.nurse-content {
            margin-top: -1rem !important;
          }

          .container-fluid {
            padding-left: 10px !important;
            padding-right: 10px !important;
          }

          .nurse-forms-avatar {
            width: 74px !important;
            height: 74px !important;
          }

          .nurse-forms-patient-name {
            font-size: 1.25rem !important;
          }

          .nurse-forms-toolbar {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }

          .nurse-forms-action-btn,
          .nurse-forms-zoom-input {
            width: 100%;
          }

          .nurse-forms-toolbar-controls {
            display: grid;
            grid-template-columns: 1fr;
          }

          .nurse-forms-tabs {
            gap: 6px;
          }

          .nurse-forms-tab {
            min-width: 130px;
          }

          .nurse-forms-preview-section {
            min-height: 520px;
          }

          .nurse-forms-preview-scroll {
            min-height: 520px;
            max-height: calc(100dvh - 420px);
            padding: 12px;
          }
        }
      `}</style>

      <div
        className="content nurse-content bg-light mt-n4"
        style={{ minHeight: "100vh" }}
      >
        <div className="container-fluid px-3 px-lg-5 pt-0">
          <div className="nurse-dashboard-layout">
            <NurseSidebar />

            <div className="nurse-dashboard-main mt-4 mt-lg-0">
              <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-4 nurse-forms-card">
                <div className="bg-white px-3 px-md-4 pt-4">
                  <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3 gap-md-4 pb-4 border-bottom text-center text-md-start">
                    <div className="nurse-forms-avatar acc-patient-avatar rounded-circle d-flex align-items-center justify-content-center bg-light shadow-sm flex-shrink-0">
                      <i
                        className="isax isax-user fs-1"
                        style={{ color: "var(--primary, #0f763f)" }}
                      />
                    </div>

                    <div className="w-100">
                      <div className="badge bg-light text-secondary border mb-2 px-2 py-1">
                        ID: {mockPatientProfile.hospitalNumber}
                      </div>

                      <h3 className="nurse-forms-patient-name acc-patient-name fw-bold mb-1 text-dark fs-3 fs-md-2">
                        {mockPatientProfile.lastName},{" "}
                        {mockPatientProfile.firstName}{" "}
                        {mockPatientProfile.middleName}
                      </h3>

                      <div className="text-muted small d-flex align-items-center justify-content-center justify-content-md-start gap-2 flex-wrap">
                        <i className="isax isax-location text-danger" />
                        <span>{mockPatientProfile.address}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="nurse-forms-toolbar px-3 px-md-4 py-3">
                  <div className="nurse-forms-toolbar-main">
                    <div className="min-width-0">
                      <h5 className="fw-bold text-dark mb-1 text-uppercase">
                        Forms Print Preview
                      </h5>
                      <p className="text-muted small mb-0">
                        Preview and print the selected patient form.
                      </p>
                    </div>

                    <div className="nurse-forms-tabs" role="tablist">
                      {printableForms.map((form) => (
                        <button
                          type="button"
                          key={form.key}
                          className={`nurse-forms-tab ${
                            activeFormKey === form.key ? "active" : ""
                          }`}
                          role="tab"
                          aria-selected={activeFormKey === form.key}
                          onClick={() => setActiveFormKey(form.key)}
                        >
                          <i className={form.icon} />
                          <span>{form.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="nurse-forms-toolbar-controls">
                      <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2">
                        <input
                          type="number"
                          className="nurse-forms-zoom-input"
                          value={zoom}
                          min={50}
                          max={160}
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
                        className="nurse-forms-action-btn"
                        onClick={() => setZoom(100)}
                      >
                        <i className="isax isax-refresh" />
                        Reset
                      </button>

                      <button
                        type="button"
                        className="nurse-forms-action-btn primary"
                        onClick={handlePrintCurrent}
                      >
                        <i className="isax isax-printer" />
                        Print
                      </button>
                    </div>
                  </div>
                </div>

                <div className="nurse-forms-preview-section">
                  <div className="nurse-forms-preview-scroll">
                    <div
                      className="nurse-forms-preview-stage"
                      style={{
                        width: `${794 * (zoom / 100)}px`,
                        height: `${previewHeight * (zoom / 100)}px`,
                      }}
                    >
                      <div
                        className="nurse-forms-preview-page"
                        style={{ transform: `scale(${zoom / 100})` }}
                      >
                        <iframe
                          key={activeForm.key}
                          ref={iframeRef}
                          title={`${activeForm.label} Print Preview`}
                          className="nurse-forms-preview-frame"
                          srcDoc={previewHtml}
                          onLoad={handleIframeLoad}
                          style={{ height: `${previewHeight}px` }}
                        />
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

export default Forms;
