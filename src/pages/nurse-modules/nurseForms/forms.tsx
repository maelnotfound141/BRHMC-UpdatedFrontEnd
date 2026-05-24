import { useCallback, useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { useLocation, useNavigate } from "react-router";
import ClinicalCoverSheet from "@/pages/doctor-modules/printableForms/index1";
import PatientIdentificationCard from "@/pages/doctor-modules/printableForms/index2";
import WatcherDischargeLabels from "@/pages/doctor-modules/printableForms/index3";
import brhmcLogo from "@/pages/doctor-modules/printableForms/logo/brhmclogo.jpg";
import { all_routes } from "@/routes/all_routes";

type PrintableFormKey = "ccs-form" | "patient-id" | "other-form";

type PrintableForm = {
  key: PrintableFormKey;
  label: string;
  subtitle: string;
  icon: string;
  Component: ComponentType<{ logoSrc?: string }>;
  defaultHeight: number;
};

const printableForms: PrintableForm[] = [
  {
    key: "ccs-form",
    label: "CCS Form",
    subtitle: "Clinical cover sheet",
    icon: "isax isax-document-text",
    Component: ClinicalCoverSheet,
    defaultHeight: 1280,
  },
  {
    key: "patient-id",
    label: "Patient ID",
    subtitle: "Patient identification form",
    icon: "isax isax-card",
    Component: PatientIdentificationCard,
    defaultHeight: 1120,
  },
  {
    key: "other-form",
    label: "Other Form",
    subtitle: "Watcher and supporting forms",
    icon: "isax isax-document-copy",
    Component: WatcherDischargeLabels,
    defaultHeight: 1320,
  },
];
const defaultPrintableForm = printableForms[0] as PrintableForm;

const MIN_ZOOM = 50;
const MAX_ZOOM = 160;
const clampZoom = (value: number) =>
  Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const printMarginsByForm: Record<
  PrintableFormKey,
  { top: number; right: number; bottom: number; left: number }
> = {
  "ccs-form": { top: 16, right: 0, bottom: 0, left: 0 },
  "patient-id": { top: 0, right: 0, bottom: 0, left: 0 },
  "other-form": { top: 16, right: 18, bottom: 0, left: 18 },
};

const Forms = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const printFrameRef = useRef<HTMLIFrameElement | null>(null);
  const printRootRef = useRef<Root | null>(null);
  const previewScrollRef = useRef<HTMLDivElement | null>(null);
  const previewContentRef = useRef<HTMLDivElement | null>(null);

  const [activeFormKey, setActiveFormKey] =
    useState<PrintableFormKey>("ccs-form");
  const [zoom, setZoom] = useState(100);
  const [zoomMode, setZoomMode] = useState<"fit-screen" | "manual">(
    "fit-screen"
  );
  const [previewHeight, setPreviewHeight] = useState(
    defaultPrintableForm.defaultHeight
  );
  const [isFormsSidebarHidden, setIsFormsSidebarHidden] = useState(false);

  useEffect(() => {
    const selectedPatientId = location.state?.selectedPatientId;

    if (selectedPatientId) {
      setTimeout(() => {}, 1500);
    }
  }, [location.state]);

  const activeForm =
    printableForms.find((form) => form.key === activeFormKey) ||
    defaultPrintableForm;
  const ActivePrintableForm = activeForm.Component;

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

  const zoomIn = () => {
    setZoomMode("manual");
    setZoom((currentZoom) => clampZoom(currentZoom + 10));
  };

  const zoomOut = () => {
    setZoomMode("manual");
    setZoom((currentZoom) => clampZoom(currentZoom - 10));
  };

  const handleClosePreview = useCallback(() => {
    if (location.key !== "default") {
      navigate(-1);
      return;
    }

    navigate(all_routes.nurseDashboard, { replace: true });
  }, [location.key, navigate]);

  const handleFitToScreen = useCallback(() => {
    const previewScroll = previewScrollRef.current;

    if (!previewScroll) return;

    const styles = window.getComputedStyle(previewScroll);
    const horizontalPadding =
      parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
    const verticalPadding =
      parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
    const availableWidth = previewScroll.clientWidth - horizontalPadding;
    const availableHeight = previewScroll.clientHeight - verticalPadding;

    if (availableWidth <= 0 || availableHeight <= 0) return;

    const targetHeight = Math.max(
      previewContentRef.current?.scrollHeight || 0,
      A4_HEIGHT_PX
    );

    const nextZoom = Math.floor(
      Math.min(
        (availableWidth / A4_WIDTH_PX) * 100,
        (availableHeight / targetHeight) * 100
      )
    );

    setZoom(clampZoom(nextZoom));
  }, []);

  useEffect(() => {
    if (zoomMode !== "fit-screen") return;

    const frame = window.requestAnimationFrame(handleFitToScreen);

    window.addEventListener("resize", handleFitToScreen);

    let observer: ResizeObserver | undefined;

    if (typeof ResizeObserver !== "undefined" && previewScrollRef.current) {
      observer = new ResizeObserver(handleFitToScreen);
      observer.observe(previewScrollRef.current);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleFitToScreen);
      observer?.disconnect();
    };
  }, [activeFormKey, handleFitToScreen, previewHeight, zoomMode]);

  const handlePrintForms = (formsToPrint: PrintableForm[]) => {
    const printFrame = printFrameRef.current;
    const printDocument = printFrame?.contentDocument;
    const printWindow = printFrame?.contentWindow;
    const title =
      formsToPrint.length === 1
        ? formsToPrint[0]?.label ?? "Nurse Forms"
        : "Nurse Forms";

    if (!printFrame || !printDocument || !printWindow) return;

    printRootRef.current?.unmount();
    printRootRef.current = null;

    printDocument.open();
    printDocument.write(`<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>${title}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
            }

            html,
            body {
              background: #fff;
              margin: 0;
              min-height: 297mm;
              padding: 0;
              width: 210mm;
            }

            .print-page {
              background: #fff;
              height: 297mm;
              overflow: hidden;
              page-break-after: always;
              position: relative;
              width: 210mm;
            }

            .print-page:last-child {
              page-break-after: auto;
            }

            .print-fit {
              left: 0;
              position: absolute;
              top: 0;
              transform-origin: top left;
            }
          </style>
        </head>
        <body>
          <div id="print-root"></div>
        </body>
      </html>`);
    printDocument.close();

    const printRootElement = printDocument.getElementById("print-root");

    if (!printRootElement) return;

    printRootRef.current = createRoot(printRootElement);
    printRootRef.current.render(
      <>
        {formsToPrint.map((form) => {
          const PrintableComponent = form.Component;

          return (
            <div
              className="print-page"
              data-form-key={form.key}
              key={form.key}
            >
              <div className="print-fit">
                <PrintableComponent logoSrc={brhmcLogo} />
              </div>
            </div>
          );
        })}
      </>
    );

    window.setTimeout(() => {
      const printPages = Array.from(
        printDocument.querySelectorAll<HTMLElement>(".print-page")
      );

      if (!printPages.length) return;

      const overrideStyle = printDocument.createElement("style");
      overrideStyle.textContent = `
        .printable-form-document {
          background: #fff !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .printable-form-document .page {
          box-shadow: none !important;
          margin: 0 auto !important;
        }

        @media print {
          .printable-form-document {
            background: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .printable-form-document .page {
            box-shadow: none !important;
            margin: 0 auto !important;
          }
        }
      `;
      printDocument.head.appendChild(overrideStyle);

      printPages.forEach((printPage) => {
        const printFit =
          printPage.querySelector<HTMLElement>(".print-fit");
        const printableDocument =
          printPage.querySelector<HTMLElement>(".printable-form-document");
        const printablePage =
          printPage.querySelector<HTMLElement>(
            ".printable-form-document .page"
          ) || printableDocument;
        const formKey = printPage.dataset.formKey as PrintableFormKey;

        if (!printFit || !printablePage) return;

        const measuredWidth = Math.max(
          printablePage.scrollWidth,
          Math.ceil(printablePage.getBoundingClientRect().width)
        );
        const measuredHeight = Math.max(
          printablePage.scrollHeight,
          Math.ceil(printablePage.getBoundingClientRect().height)
        );
        const printMargins = printMarginsByForm[formKey];
        const availableWidth =
          A4_WIDTH_PX - printMargins.left - printMargins.right;
        const availableHeight =
          A4_HEIGHT_PX - printMargins.top - printMargins.bottom;
        const scale = Math.min(
          1,
          availableWidth / Math.max(measuredWidth, 1),
          availableHeight / Math.max(measuredHeight, 1)
        );
        const offsetX =
          printMargins.left +
          Math.max((availableWidth - measuredWidth * scale) / 2, 0);
        const offsetY = printMargins.top;

        printFit.style.width = `${measuredWidth}px`;
        printFit.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
      });

      printWindow.focus();
      printWindow.print();
    }, 250);
  };

  const handlePrintCurrent = () => handlePrintForms([activeForm]);

  const handlePrintAll = () => handlePrintForms(printableForms);

  const handleResetZoom = () => {
    setZoomMode("manual");
    setZoom(100);
  };

  return (
    <>
      <style>{`
        .nurse-forms-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1050;
          background: rgba(0, 0, 0, 0.45);
        }

        .nurse-forms-modal-dialog {
          position: fixed;
          inset: 0;
          z-index: 1055;
          display: flex;
          align-items: stretch;
          justify-content: stretch;
          padding: 0;
        }

        .nurse-forms-modal-box {
          position: relative;
          width: 100%;
          max-width: none;
          height: 100dvh;
          max-height: none;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 8px 32px rgba(0, 0, 0, .22);
          font-family: inherit;
        }

        .nurse-forms-modal-close-btn {
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

        .nurse-forms-modal-close-btn:hover,
        .nurse-forms-modal-close-btn:focus {
          background: #fff;
          border-color: var(--primary, #0f763f);
          color: var(--primary, #0f763f);
          outline: none;
        }

        .nurse-forms-modal-body {
          flex: 1;
          min-height: 0;
          display: flex;
          overflow: hidden;
        }

        .nurse-forms-nav-col {
          width: 176px;
          flex-shrink: 0;
          background: #111418;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: width .18s ease, max-height .18s ease, padding .18s ease;
        }

        .nurse-forms-nav-toggle-btn {
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

        .nurse-forms-nav-toggle-btn:hover,
        .nurse-forms-nav-toggle-btn:focus {
          background: #111418;
          border-color: #4dd0e1;
          color: #4dd0e1;
          outline: none;
        }

        .nurse-forms-sidebar-hidden .nurse-forms-nav-col {
          width: 0;
        }

        .nurse-forms-sidebar-hidden .nurse-forms-nav-list,
        .nurse-forms-sidebar-hidden .nurse-forms-nav-footer {
          opacity: 0;
          pointer-events: none;
        }

        .nurse-forms-sidebar-hidden .nurse-forms-nav-toggle-btn {
          left: 14px;
        }

        .nurse-forms-nav-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px 0;
          margin: 0;
          list-style: none;
        }

        .nurse-forms-nav-list::-webkit-scrollbar {
          width: 4px;
        }

        .nurse-forms-nav-list::-webkit-scrollbar-thumb {
          background: #2a2e33;
          border-radius: 2px;
        }

        .nurse-forms-nav-btn {
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

        .nurse-forms-nav-btn:hover {
          color: #c8d6e5;
          background: rgba(255, 255, 255, .05);
        }

        .nurse-forms-nav-btn.active {
          color: #4dd0e1;
          border-left-color: #4dd0e1;
          background: rgba(77, 208, 225, .09);
          font-weight: 500;
        }

        .nurse-forms-nav-btn i {
          flex-shrink: 0;
          font-size: 14px;
        }

        .nurse-forms-nav-footer {
          flex-shrink: 0;
          border-top: 1px solid #1e2226;
          padding: 10px 0 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .nurse-forms-print-btn {
          width: 100%;
          padding: 7px 0;
          border: none;
          background: none;
          color: #8a9bb0;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          text-align: center;
          transition: color .12s, background .12s;
        }

        .nurse-forms-print-btn:hover {
          color: #e2e8f0;
          background: rgba(255, 255, 255, .05);
        }

        .nurse-forms-print-btn i {
          font-size: 18px;
        }

        .nurse-forms-content-col {
          flex: 1;
          min-width: 0;
          min-height: 0;
          display: flex;
          flex-direction: column;
          background: #f5f5f5;
          position: relative;
        }

        .nurse-forms-card {
          border-top: 4px solid var(--primary, #0f763f);
          display: flex;
          flex-direction: column;
          height: calc(100dvh - 104px);
          min-height: 680px;
        }

        .nurse-forms-avatar {
          width: 90px;
          height: 90px;
          border: 2px solid var(--primary, #0f763f);
          color: var(--primary, #0f763f);
        }

        .nurse-forms-patient-panel {
          flex-shrink: 0;
        }

        .nurse-forms-toolbar {
          background: #fff;
          border-bottom: 1px solid #e9ecef;
          flex-shrink: 0;
        }

        .nurse-forms-toolbar-main {
          display: grid;
          grid-template-columns: minmax(190px, 0.45fr) minmax(0, 1fr);
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
          flex: 1;
          min-height: 0;
          position: relative;
          display: flex;
          background: #eef2f4;
        }

        .nurse-forms-preview-scroll {
          flex: 1;
          min-height: 0;
          max-height: none;
          overflow: auto;
          padding: 16px 84px 16px 20px;
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

        .nurse-forms-floating-controls {
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

        .nurse-forms-zoom-wrap {
          display: flex;
          align-items: stretch;
          border: 1px solid #ced4da;
          border-radius: 4px;
          overflow: hidden;
          width: 46px;
          height: 40px;
          background: #fff;
        }

        .nurse-forms-zoom-input {
          width: 100%;
          height: 100%;
          min-height: 0;
          border: none;
          outline: none;
          text-align: center;
          font-size: 13px;
          font-weight: 700;
          color: #172033;
          background: #fff;
          padding: 0;
          font-family: inherit;
          -moz-appearance: textfield;
        }

        .nurse-forms-zoom-input:focus {
          box-shadow: none;
        }

        .nurse-forms-zoom-input::-webkit-outer-spin-button,
        .nurse-forms-zoom-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }

        .nurse-forms-zoom-step-btn {
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

        .nurse-forms-zoom-step-btn:hover,
        .nurse-forms-zoom-step-btn:focus {
          background: #e2e6ea;
          border-color: var(--primary, #0f763f);
          color: var(--primary, #0f763f);
          outline: none;
        }

        .nurse-forms-zoom-step-btn::before {
          font-family: "Font Awesome 7 Free";
          font-weight: 900;
          font-size: 12px;
          line-height: 1;
        }

        .nurse-forms-zoom-step-btn.nurse-forms-zoom-in-btn::before {
          content: "\\f077";
        }

        .nurse-forms-zoom-step-btn.nurse-forms-zoom-out-btn::before {
          content: "\\f078";
        }

        .nurse-forms-floating-btn {
          width: 46px;
          height: 40px;
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

        .nurse-forms-floating-btn:hover,
        .nurse-forms-floating-btn:focus {
          background: #f8f9fa;
          border-color: var(--primary, #0f763f);
          color: var(--primary, #0f763f);
          outline: none;
        }

        .nurse-forms-floating-btn.primary {
          background: var(--primary, #0f763f);
          border-color: var(--primary, #0f763f);
          color: #fff;
        }

        .nurse-forms-floating-btn.primary:hover,
        .nurse-forms-floating-btn.primary:focus {
          background: var(--primary, #0f763f);
          border-color: var(--primary, #0f763f);
          color: #fff;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }

          html,
          body {
            background: #fff !important;
            height: auto !important;
            margin: 0 !important;
            min-height: 297mm !important;
            padding: 0 !important;
            width: 210mm !important;
          }

          body * {
            visibility: hidden !important;
          }

          .nurse-forms-preview-print-target,
          .nurse-forms-preview-print-target * {
            visibility: visible !important;
          }

          .nurse-forms-preview-section,
          .nurse-forms-preview-scroll,
          .nurse-forms-preview-stage,
          .nurse-forms-preview-page,
          .nurse-forms-preview-print-target {
            background: #fff !important;
            box-shadow: none !important;
            height: auto !important;
            max-height: none !important;
            min-height: 0 !important;
            overflow: visible !important;
            padding: 0 !important;
            transform: none !important;
            width: 794px !important;
          }

          .nurse-forms-preview-print-target {
            left: 0 !important;
            min-height: 297mm !important;
            position: absolute !important;
            top: 0 !important;
            width: 210mm !important;
          }

          .nurse-forms-preview-print-target .printable-form-document {
            background: #fff !important;
            min-height: 297mm !important;
            padding: 0 !important;
            width: 210mm !important;
          }

          .nurse-forms-preview-print-target .page {
            box-shadow: none !important;
            margin-left: auto !important;
            margin-right: auto !important;
            max-width: 210mm !important;
          }
        }

        @media (max-width: 991.98px) {
          .nurse-forms-nav-col {
            width: 164px;
          }

          .nurse-forms-nav-toggle-btn {
            left: 176px;
          }

          .nurse-forms-card {
            height: auto;
            min-height: calc(100dvh - 96px);
          }

          .nurse-forms-toolbar-main {
            grid-template-columns: 1fr;
            align-items: stretch;
          }

          .nurse-forms-toolbar-controls {
            justify-content: flex-start;
          }

          .nurse-forms-preview-scroll {
            padding: 14px 78px 14px 16px;
          }
        }

        @media (max-width: 767.98px) {
          .nurse-forms-modal-body {
            flex-direction: column;
          }

          .nurse-forms-modal-close-btn {
            top: 8px;
            right: 8px;
            width: 36px;
            height: 36px;
          }

          .nurse-forms-nav-col {
            width: 100%;
            max-height: 160px;
            padding-left: 48px;
            padding-right: 48px;
          }

          .nurse-forms-nav-toggle-btn,
          .nurse-forms-sidebar-hidden .nurse-forms-nav-toggle-btn {
            top: 8px;
            left: 8px;
            width: 36px;
            height: 36px;
          }

          .nurse-forms-sidebar-hidden .nurse-forms-nav-col {
            width: 100%;
            max-height: 0;
            padding: 0;
          }

          .nurse-forms-nav-list {
            display: flex;
            overflow-x: auto;
            overflow-y: hidden;
            padding: 8px;
          }

          .nurse-forms-nav-list li {
            flex: 0 0 auto;
          }

          .nurse-forms-nav-btn {
            text-align: center;
            border-left: 0;
            border-bottom: 3px solid transparent;
            padding: 8px 12px;
          }

          .nurse-forms-nav-btn.active {
            border-left-color: transparent;
            border-bottom-color: #4dd0e1;
          }

          .nurse-forms-nav-footer {
            flex-direction: row;
            padding: 8px;
          }

          .nurse-forms-floating-controls {
            top: auto;
            right: 12px;
            bottom: 12px;
            transform: none;
            flex-direction: column;
            gap: 6px;
          }

          .nurse-forms-preview-scroll {
            padding: 12px 66px 12px 12px;
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

          .nurse-forms-floating-btn {
            height: 38px;
            width: 44px;
          }

          .nurse-forms-zoom-wrap {
            width: 44px;
            height: 38px;
          }

          .nurse-forms-zoom-input {
            width: 100%;
            min-height: 0;
          }

          .nurse-forms-zoom-step-btn {
            width: 44px;
            height: 38px;
            min-height: 38px;
          }

          .nurse-forms-preview-section {
            min-height: 0;
          }

          .nurse-forms-preview-scroll {
            padding: 10px 60px 10px 10px;
          }
        }
      `}</style>

      <div
        className="nurse-forms-modal-backdrop"
        onClick={handleClosePreview}
      />

      <div className="nurse-forms-modal-dialog">
        <div
          className={`nurse-forms-modal-box${
            isFormsSidebarHidden ? " nurse-forms-sidebar-hidden" : ""
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Nurse printable forms"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="nurse-forms-nav-toggle-btn"
            onClick={() => setIsFormsSidebarHidden((isHidden) => !isHidden)}
            aria-label={
              isFormsSidebarHidden
                ? "Show print preview sidebar"
                : "Hide print preview sidebar"
            }
            title={
              isFormsSidebarHidden
                ? "Show print preview sidebar"
                : "Hide print preview sidebar"
            }
          >
            <i
              className={`fa-solid ${
                isFormsSidebarHidden ? "fa-chevron-right" : "fa-chevron-left"
              }`}
            />
          </button>

          <button
            type="button"
            className="nurse-forms-modal-close-btn"
            onClick={handleClosePreview}
            aria-label="Close print preview"
            title="Close"
          >
            <i className="fa-solid fa-xmark" />
          </button>

          <div className="nurse-forms-modal-body">
            <div className="nurse-forms-nav-col">
              <ul
                className="nurse-forms-nav-list"
                role="tablist"
                aria-label="Nurse printable forms"
              >
                {printableForms.map((form) => (
                  <li key={form.key} role="presentation">
                    <button
                      type="button"
                      role="tab"
                      className={`nurse-forms-nav-btn${
                        activeFormKey === form.key ? " active" : ""
                      }`}
                      aria-selected={activeFormKey === form.key}
                      onClick={() => {
                        setActiveFormKey(form.key);
                        setZoomMode("fit-screen");
                      }}
                    >
                      {form.label}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="nurse-forms-nav-footer">
                <button
                  type="button"
                  className="nurse-forms-print-btn"
                  onClick={handlePrintCurrent}
                  title="Print current form"
                >
                  <i className="fa-solid fa-print" />
                  Print Current Page
                </button>

                <button
                  type="button"
                  className="nurse-forms-print-btn"
                  onClick={handlePrintAll}
                  title="Print all forms"
                >
                  <i className="fa-solid fa-print" />
                  Print All
                </button>
              </div>
            </div>

            <div className="nurse-forms-content-col">
              <div className="nurse-forms-floating-controls">
                <div className="nurse-forms-zoom-wrap">
                  <input
                    type="number"
                    className="nurse-forms-zoom-input"
                    value={zoom}
                    min={MIN_ZOOM}
                    max={MAX_ZOOM}
                    step={10}
                    aria-label="Preview zoom percentage"
                    title="Zoom percentage"
                    onChange={(event) => handleZoomChange(event.target.value)}
                  />

                </div>

                <button
                  type="button"
                  className="nurse-forms-zoom-step-btn nurse-forms-zoom-in-btn"
                  onClick={zoomIn}
                  aria-label="Zoom in"
                  title="Zoom in"
                >
                  Zoom in
                </button>

                <button
                  type="button"
                  className="nurse-forms-zoom-step-btn nurse-forms-zoom-out-btn"
                  onClick={zoomOut}
                  aria-label="Zoom out"
                  title="Zoom out"
                >
                  Zoom out
                </button>

                <button
                  type="button"
                  className="nurse-forms-floating-btn"
                  onClick={() => {
                    setZoomMode("fit-screen");
                    window.requestAnimationFrame(handleFitToScreen);
                  }}
                  title="Fit form to screen"
                  aria-label="Fit form to screen"
                >
                  <i className="fa-solid fa-expand" />
                </button>

                <button
                  type="button"
                  className="nurse-forms-floating-btn"
                  onClick={handleResetZoom}
                  title="Reset zoom"
                  aria-label="Reset zoom"
                >
                  <i className="isax isax-refresh" />
                </button>
              </div>

              <div className="nurse-forms-preview-section">
                <div
                  className="nurse-forms-preview-scroll"
                  ref={previewScrollRef}
                >
                  <div
                    className="nurse-forms-preview-stage"
                    style={{
                      width: `${A4_WIDTH_PX * (zoom / 100)}px`,
                      height: `${previewHeight * (zoom / 100)}px`,
                    }}
                  >
                    <div
                      className="nurse-forms-preview-page"
                      style={{ transform: `scale(${zoom / 100})` }}
                    >
                      <div
                        ref={previewContentRef}
                        key={activeForm.key}
                        className="nurse-forms-preview-print-target"
                      >
                        <ActivePrintableForm logoSrc={brhmcLogo} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <iframe
        ref={printFrameRef}
        title="Printable form output"
        aria-hidden="true"
        tabIndex={-1}
        style={{
          border: 0,
          height: "297mm",
          left: "-10000px",
          opacity: 0,
          pointerEvents: "none",
          position: "fixed",
          top: 0,
          width: "210mm",
        }}
      />
    </>
  );
};

export default Forms;
