import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setNurseMobileSidebar } from "@/core/redux/sidebarSlice";
import { all_routes } from "@/routes/all_routes";

type BatchRequestRecord = {
  rivNumber: string;
  shift: string;
  requestType: string;
  dateCreated: string;
  status: string;
};

type PatientRecord = {
  id: string;
  name: string;
  lengthOfStay: number;
};

type SupplyCatalogItem = {
  id: string;
  description: string;
  chargeSlipCode: string;
  rate: string;
};

type RequestedSupplyItem = SupplyCatalogItem & {
  quantity: number;
  issued: string;
};

type SubmitDialogState = "confirm" | "success" | "cancelled" | "empty" | null;

const fallbackBatch: BatchRequestRecord = {
  rivNumber: "RIV-2026-0001",
  shift: "1st Shift",
  requestType: "Regular",
  dateCreated: "03/21/2026 04:02 PM",
  status: "Created",
};

const patientRecords: PatientRecord[] = [
  {
    id: "patient-rea-mon",
    name: "DO, REA MON",
    lengthOfStay: 0,
  },
];

const supplyDescriptions = [
  "0.9% sodium chloride 500ml",
  "15L Capacity Drainage Bag, Empty effluent",
  "Abdominal binder",
  "Abdominal Binder",
  "Abdominal pad 12x12, 12 ply",
  "Abdominal pad 18x18, 12 ply",
  "Abdominal pad 8x12, 12 ply",
  "Abdominal Pad, absorbent,30x30cmx12ply",
  "Absorbable Hemostat",
  "Absorbable Hemostat (knit)",
  "Absorbable Hemostat (Oxicel Knit)",
  "absorbable hemostat FIBRIL (reign)",
  "Absorbable Hemostat Surgicel(4inx4in)",
  "Absorbable Hemostat Surgicel(4inx8in)",
  "Absorbable Hemostat, 10.20cm x 20.3cm",
  "Absorbable Hemostat, 10.2cm x 10.2cm",
  "Absorbable Hemostat, 3cm x 4cm",
  "Absorbable Hemostat, 7.6cm x 10.2cm",
  "Cotton balls, pack 10's",
  "Cotton Swab",
  "Cottonoids",
  "Cover All",
  "Cranial Fixation",
  "Cranial Fixation straight",
  "Cranial perforator, adult",
  "Cranial perforator, infant",
  "Cranial perforator, neonate",
  "Cranial perforator, pedia",
  "CRANIOTOME BLADE",
  "Craniotome blade",
  "Craniotome Blade",
  "CS KIT (MEDKO)",
  "CS PACK",
  "CT Tripack",
  "Cup Feeder, per piece",
  "Cup Feeder, per use",
  "Gloves Examination, Medium, Nitrile",
  "Harmonic Shear 17cm",
];

const supplyCatalog: SupplyCatalogItem[] = supplyDescriptions.map(
  (description, index) => ({
    id: `supply-${index + 1}`,
    description,
    chargeSlipCode:
      index % 3 === 0 ? `SUP-${String(index + 1).padStart(4, "0")}` : "-",
    rate: index % 4 === 0 ? "0.00" : "-",
  })
);

const SupplyRequisition = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMobileView, setIsMobileView] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(
    patientRecords[0].id
  );
  const [showSupplyModal, setShowSupplyModal] = useState(false);
  const [itemSearch, setItemSearch] = useState("");
  const [draftQuantities, setDraftQuantities] = useState<
    Record<string, string>
  >({});
  const [requestedItemsByPatient, setRequestedItemsByPatient] = useState<
    Record<string, RequestedSupplyItem[]>
  >({});
  const [submitDialog, setSubmitDialog] =
    useState<SubmitDialogState>(null);
  const lastPatientClickRef = useRef<{ id: string; time: number } | null>(null);

  const nurseMobileSidebar = useSelector(
    (state: any) => state.sidebar.nurseMobileSidebar
  );

  const batch =
    (location.state as { batchRequest?: BatchRequestRecord } | null)
      ?.batchRequest || fallbackBatch;

  const isSidebarOpen = isMobileView
    ? nurseMobileSidebar
    : !isDesktopCollapsed;

  const selectedPatient =
    patientRecords.find((patient) => patient.id === selectedPatientId) ||
    patientRecords[0];

  const requestedItems = requestedItemsByPatient[selectedPatientId] || [];

  const filteredPatients = useMemo(() => {
    const keyword = patientSearch.trim().toLowerCase();

    if (!keyword) return patientRecords;

    return patientRecords.filter((patient) =>
      patient.name.toLowerCase().includes(keyword)
    );
  }, [patientSearch]);

  const filteredSupplyItems = useMemo(() => {
    const keyword = itemSearch.trim().toLowerCase();

    if (!keyword) return supplyCatalog;

    return supplyCatalog.filter(
      (item) =>
        item.description.toLowerCase().includes(keyword) ||
        item.chargeSlipCode.toLowerCase().includes(keyword)
    );
  }, [itemSearch]);

  const selectedDraftItems = useMemo(
    () =>
      supplyCatalog
        .map((item) => ({
          ...item,
          quantity: Number(draftQuantities[item.id] || 0),
        }))
        .filter((item) => item.quantity > 0),
    [draftQuantities]
  );

  const hasRequestItems = useMemo(
    () =>
      Object.values(requestedItemsByPatient).some(
        (items) => items.length > 0
      ),
    [requestedItemsByPatient]
  );

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

  const openSupplyModal = (patientId: string) => {
    const existingItems = requestedItemsByPatient[patientId] || [];

    setSelectedPatientId(patientId);
    setDraftQuantities(
      existingItems.reduce<Record<string, string>>((acc, item) => {
        acc[item.id] = String(item.quantity);
        return acc;
      }, {})
    );
    setItemSearch("");
    setShowSupplyModal(true);
  };

  const handlePatientRowClick = (patientId: string) => {
    const now = Date.now();
    const lastClick = lastPatientClickRef.current;

    setSelectedPatientId(patientId);

    if (lastClick?.id === patientId && now - lastClick.time <= 450) {
      lastPatientClickRef.current = null;
      openSupplyModal(patientId);
      return;
    }

    lastPatientClickRef.current = { id: patientId, time: now };
  };

  const closeSupplyModal = () => {
    setShowSupplyModal(false);
  };

  const updateDraftQuantity = (itemId: string, value: string) => {
    const numericValue = value.replace(/\D/g, "");

    setDraftQuantities((prev) => {
      const next = { ...prev };

      if (!numericValue || Number(numericValue) < 1) {
        delete next[itemId];
        return next;
      }

      next[itemId] = String(Math.min(Number(numericValue), 999));
      return next;
    });
  };

  const toggleDraftItem = (itemId: string, checked: boolean) => {
    setDraftQuantities((prev) => {
      const next = { ...prev };

      if (checked) {
        next[itemId] = next[itemId] || "1";
      } else {
        delete next[itemId];
      }

      return next;
    });
  };

  const saveSupplyItems = () => {
    const savedItems = supplyCatalog.reduce<RequestedSupplyItem[]>(
      (acc, item) => {
        const quantity = Number(draftQuantities[item.id] || 0);

        if (quantity > 0) {
          acc.push({
            ...item,
            quantity,
            issued: "",
          });
        }

        return acc;
      },
      []
    );

    setRequestedItemsByPatient((prev) => ({
      ...prev,
      [selectedPatientId]: savedItems,
    }));
    setShowSupplyModal(false);
  };

  const updateRequestedQuantity = (itemId: string, value: string) => {
    const numericValue = value.replace(/\D/g, "");

    if (!numericValue || Number(numericValue) < 1) return;

    setRequestedItemsByPatient((prev) => ({
      ...prev,
      [selectedPatientId]: (prev[selectedPatientId] || []).map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.min(Number(numericValue), 999),
            }
          : item
      ),
    }));
  };

  const removeRequestedItem = (itemId: string) => {
    setRequestedItemsByPatient((prev) => ({
      ...prev,
      [selectedPatientId]: (prev[selectedPatientId] || []).filter(
        (item) => item.id !== itemId
      ),
    }));
  };

  const closeSubmitDialog = () => {
    setSubmitDialog(null);
  };

  const handleSubmitRequestClick = () => {
    setSubmitDialog(hasRequestItems ? "confirm" : "empty");
  };

  return (
    <>
      <style>{`
        .supply-req-sidebar-wrap {
          flex: 0 0 280px;
          max-width: 280px;
          transition: all 0.25s ease;
          z-index: 20;
        }

        .supply-req-sidebar-wrap.sidebar-collapsed {
          flex-basis: 78px;
          max-width: 78px;
        }

        .supply-req-sidebar-card {
          position: sticky;
          top: 105px;
          width: 100%;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
          overflow: hidden;
        }

        .supply-req-toggle {
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

        .supply-req-profile {
          padding: 74px 20px 22px;
          text-align: center;
          transition: all 0.25s ease;
          border-bottom: 1px solid #eef1f4;
        }

        .supply-req-profile-icon {
          font-size: 3rem;
          color: #6f7b8a;
          line-height: 1;
          margin-bottom: 20px;
        }

        .supply-req-title {
          color: #172033;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 0;
        }

        .supply-req-sidebar-wrap.sidebar-collapsed .supply-req-toggle {
          left: 50%;
          right: auto;
          transform: translateX(-50%);
        }

        .supply-req-sidebar-wrap.sidebar-collapsed .supply-req-profile {
          padding: 64px 8px 14px;
        }

        .supply-req-sidebar-wrap.sidebar-collapsed .supply-req-profile-icon {
          font-size: 1.65rem;
          margin-bottom: 0;
        }

        .supply-req-sidebar-wrap.sidebar-collapsed .supply-req-title,
        .supply-req-sidebar-wrap.sidebar-collapsed .supply-req-menu,
        .supply-req-sidebar-wrap.sidebar-collapsed .supply-req-batch-block {
          display: none;
        }

        .supply-req-menu {
          padding: 18px 20px;
          border-bottom: 1px solid #eef1f4;
        }

        .supply-req-action {
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

        .supply-req-action:hover {
          background: rgba(15, 118, 63, 0.08);
          color: var(--primary, #0f763f);
        }

        .supply-req-action i {
          font-size: 1.55rem;
        }

        .supply-req-batch-block {
          padding: 18px 20px 26px;
          text-align: center;
          background: #fff;
        }

        .supply-req-batch-number {
          font-weight: 800;
          color: #172033;
          margin-bottom: 2px;
        }

        .supply-req-batch-status {
          font-weight: 900;
          color: var(--primary, #0f763f);
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .supply-req-batch-meta {
          text-align: left;
          font-size: 0.78rem;
          color: #6c757d;
          line-height: 1.35;
        }

        .supply-req-main-card {
          min-height: calc(100vh - 130px);
        }

        .supply-req-close-btn {
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

        .supply-req-close-btn:hover {
          background: var(--primary, #0f763f);
          border-color: var(--primary, #0f763f);
          color: #fff;
        }

        .supply-req-grid {
          display: grid;
          grid-template-columns: 330px minmax(0, 1fr);
          min-height: 620px;
        }

        .supply-req-patient-panel {
          border-right: 1px solid #dee2e6;
          background: #fff;
        }

        .supply-req-panel-title {
          padding: 10px 12px;
          border-bottom: 1px solid #dee2e6;
          font-weight: 800;
          color: #495057;
          background: #fff;
        }

        .supply-req-search {
          padding: 8px 12px;
          border-bottom: 1px solid #dee2e6;
        }

        .supply-req-patient-table thead th,
        .supply-req-item-table thead th {
          background: #101214;
          color: #fff;
          font-size: 0.78rem;
          font-weight: 700;
          border-color: #101214;
          white-space: nowrap;
          padding: 10px 12px;
        }

        .supply-req-patient-table tbody td {
          background: #d8eef5;
          padding: 10px 12px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #495057;
        }

        .supply-req-patient-table tbody tr {
          cursor: pointer;
        }

        .supply-req-patient-table tbody tr:hover td,
        .supply-req-patient-table tbody tr.active td {
          background: rgba(15, 118, 63, 0.18);
          color: #172033;
        }

        .supply-req-patient-name {
          display: inline-block;
          min-width: 0;
        }

        .supply-req-patient-open {
          width: 28px;
          height: 28px;
          border: 0;
          border-radius: 5px;
          background: transparent;
          color: var(--primary, #0f763f);
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .supply-req-patient-open:hover {
          background: rgba(15, 118, 63, 0.1);
        }

        .supply-req-los-cell {
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          min-width: 72px;
        }

        .supply-req-item-area {
          display: flex;
          flex-direction: column;
          min-width: 0;
          background: #fff;
        }

        .supply-req-item-table-wrap {
          min-height: 380px;
          border-bottom: 1px solid #dee2e6;
        }

        .supply-req-item-table tbody td {
          padding: 8px 10px;
          font-size: 0.84rem;
          vertical-align: middle;
        }

        .supply-req-item-table tbody tr:nth-child(even) td {
          background: #f8fafb;
        }

        .supply-req-table-icon-btn {
          width: 30px;
          height: 30px;
          border: 0;
          border-radius: 5px;
          background: transparent;
          color: #0b7285;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .supply-req-table-icon-btn:hover {
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
        }

        .supply-req-qty-input {
          width: 64px;
          height: 30px;
          border: 1px solid #adb5bd;
          border-radius: 4px;
          padding: 3px 7px;
          text-align: right;
          font-weight: 800;
          color: #172033;
        }

        .supply-req-qty-input:focus {
          border-color: var(--primary, #0f763f);
          box-shadow: 0 0 0 0.15rem rgba(15, 118, 63, 0.16);
          outline: none;
        }

        .supply-req-empty-state {
          min-height: 330px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
          font-weight: 700;
        }

        .supply-req-count-bar {
          background: var(--primary, #0f763f);
          color: #fff;
          font-size: 0.82rem;
          font-weight: 800;
          padding: 8px 12px;
        }

        .supply-req-record {
          padding: 12px;
          font-weight: 800;
          color: #172033;
        }

        .supply-req-record-summary {
          padding: 0 12px 18px;
          font-size: 0.84rem;
          color: #495057;
        }

        .supply-req-record-table {
          display: grid;
          grid-template-columns: 90px 80px minmax(180px, 1fr);
          gap: 8px 18px;
          max-width: 640px;
        }

        .supply-req-record-table .head {
          color: #4b6b8a;
          font-size: 0.78rem;
          font-weight: 800;
        }

        .supply-req-record-table .issued-head {
          color: #b02a37;
        }

        .supply-req-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1060;
          background: rgba(15, 23, 42, 0.38);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
        }

        .supply-req-modal {
          width: min(1220px, 96vw);
          max-height: min(90dvh, 860px);
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.28);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .supply-req-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 14px 16px;
          border-bottom: 1px solid #e9ecef;
          background: #fff;
        }

        .supply-req-modal-title {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .supply-req-modal-title i {
          color: var(--primary, #0f763f);
          font-size: 1.25rem;
        }

        .supply-req-modal-title h6 {
          margin: 0;
          color: #172033;
          font-size: 0.95rem;
          font-weight: 900;
        }

        .supply-req-modal-title span {
          display: block;
          color: #6c757d;
          font-size: 0.78rem;
          font-weight: 700;
        }

        .supply-req-modal-close {
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 5px;
          background: transparent;
          color: #495057;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .supply-req-modal-close:hover {
          background: #f1f3f5;
          color: #212529;
        }

        .supply-req-modal-body {
          padding: 14px;
          min-height: 0;
          flex: 1 1 auto;
          overflow: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .supply-req-modal-search {
          position: relative;
          max-width: 460px;
        }

        .supply-req-modal-search i {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          pointer-events: none;
        }

        .supply-req-modal-search input {
          padding-left: 34px;
          height: 36px;
          border-radius: 6px;
          font-weight: 700;
        }

        .supply-req-picker-layout {
          min-height: 0;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 420px;
          gap: 12px;
        }

        .supply-req-catalog-window,
        .supply-req-selected-window {
          border: 1px solid #dce5ea;
          border-radius: 8px;
          overflow: hidden;
          background: #fff;
        }

        .supply-req-catalog-window {
          min-width: 0;
        }

        .supply-req-catalog-scroll {
          max-height: 520px;
          overflow: auto;
        }

        .supply-req-catalog-table {
          min-width: 620px;
        }

        .supply-req-catalog-table thead th {
          position: sticky;
          top: 0;
          z-index: 1;
          background: var(--primary, #0f763f);
          color: #fff;
          border-color: var(--primary, #0f763f);
          font-size: 0.78rem;
          padding: 10px 12px;
          white-space: nowrap;
        }

        .supply-req-catalog-table tbody td {
          padding: 7px 10px;
          font-size: 0.84rem;
          vertical-align: middle;
        }

        .supply-req-catalog-table tbody tr:nth-child(even) td {
          background: #f8fafb;
        }

        .supply-req-catalog-table tbody tr.selected td {
          background: rgba(15, 118, 63, 0.16);
        }

        .supply-req-check {
          width: 18px;
          height: 18px;
          accent-color: var(--primary, #0f763f);
        }

        .supply-req-selected-window {
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .supply-req-selected-head {
          padding: 11px 12px;
          border-bottom: 1px solid #dce5ea;
          background: #eef5f8;
          color: #172033;
          font-size: 0.86rem;
          font-weight: 900;
        }

        .supply-req-selected-list {
          padding: 8px;
          overflow: auto;
          max-height: 480px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .supply-req-selected-item {
          border: 1px solid #e9ecef;
          border-radius: 6px;
          padding: 6px 8px;
          background: #fff;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto auto;
          align-items: center;
          gap: 8px;
        }

        .supply-req-selected-item-title {
          color: #172033;
          font-size: 0.78rem;
          font-weight: 800;
          line-height: 1.2;
          overflow-wrap: anywhere;
        }

        .supply-req-selected-item .supply-req-qty-input {
          width: 58px;
          height: 26px;
          font-size: 0.78rem;
          padding: 2px 6px;
        }

        .supply-req-selected-remove {
          border: 0;
          border-radius: 5px;
          background: transparent;
          color: #dc3545;
          width: 26px;
          height: 26px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .supply-req-selected-remove:hover {
          background: rgba(220, 53, 69, 0.1);
        }

        .supply-req-selected-empty {
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #6c757d;
          font-size: 0.84rem;
          font-weight: 700;
          padding: 18px;
        }

        .supply-req-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 12px 14px 14px;
          border-top: 1px solid #e9ecef;
          background: #fff;
        }

        .supply-req-confirm-modal {
          width: min(430px, 100%);
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.28);
          overflow: hidden;
        }

        .supply-req-confirm-body {
          padding: 24px;
          text-align: center;
        }

        .supply-req-confirm-icon {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          margin: 0 auto 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.7rem;
          color: var(--primary, #0f763f);
          background: rgba(15, 118, 63, 0.1);
        }

        .supply-req-confirm-icon.cancelled {
          color: #6c757d;
          background: #f1f3f5;
        }

        .supply-req-confirm-title {
          color: #172033;
          font-size: 1rem;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .supply-req-confirm-text {
          color: #6c757d;
          font-size: 0.88rem;
          font-weight: 700;
          line-height: 1.45;
          margin: 0;
        }

        .supply-req-confirm-actions {
          display: flex;
          justify-content: center;
          gap: 10px;
          padding: 0 24px 24px;
        }

        .supply-req-confirm-actions .btn {
          min-width: 110px;
          font-weight: 800;
        }

        .supply-req-mobile-backdrop {
          display: none;
        }

        @media (max-width: 991.98px) {
          .supply-req-sidebar-wrap {
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

          .supply-req-sidebar-wrap.sidebar-mobile-open {
            transform: translateX(0);
            pointer-events: auto;
          }

          .supply-req-sidebar-wrap.sidebar-expanded,
          .supply-req-sidebar-wrap.sidebar-collapsed {
            flex: none !important;
            flex-basis: auto !important;
            max-width: 280px;
          }

          .supply-req-sidebar-card {
            position: static;
          }

          .supply-req-sidebar-wrap.sidebar-collapsed .supply-req-toggle {
            left: auto;
            right: 18px;
            transform: none;
          }

          .supply-req-sidebar-wrap.sidebar-collapsed .supply-req-title,
          .supply-req-sidebar-wrap.sidebar-collapsed .supply-req-menu,
          .supply-req-sidebar-wrap.sidebar-collapsed .supply-req-batch-block {
            display: block;
          }

          .supply-req-sidebar-wrap.sidebar-collapsed .supply-req-profile-icon {
            font-size: 3rem;
            margin-bottom: 20px;
          }

          .supply-req-profile {
            padding: 64px 18px 22px;
          }

          .supply-req-grid {
            grid-template-columns: 1fr;
          }

          .supply-req-picker-layout {
            grid-template-columns: 1fr;
          }

          .supply-req-catalog-scroll,
          .supply-req-selected-list {
            max-height: 34dvh;
          }

          .supply-req-patient-panel {
            border-right: 0;
            border-bottom: 1px solid #dee2e6;
          }

          .supply-req-mobile-backdrop {
            position: fixed;
            inset: 0;
            z-index: 1040;
            background: rgba(0, 0, 0, 0.25);
            display: block;
          }
        }

        @media (max-width: 575.98px) {
          .supply-req-sidebar-wrap {
            width: 265px;
            max-width: 265px;
            padding-left: 10px;
            padding-right: 10px;
          }

          .supply-req-modal-backdrop {
            padding: 8px;
          }

          .supply-req-modal {
            max-height: 94dvh;
          }

          .supply-req-modal-body {
            padding: 10px;
          }

          .supply-req-modal-footer {
            flex-direction: column-reverse;
          }

          .supply-req-modal-footer .btn {
            width: 100%;
          }

          .supply-req-confirm-actions {
            flex-direction: column-reverse;
          }

          .supply-req-confirm-actions .btn {
            width: 100%;
          }

          .supply-req-catalog-scroll {
            overflow-x: hidden;
            overflow-y: auto;
          }

          .supply-req-catalog-table {
            min-width: 0;
            width: 100%;
            table-layout: fixed;
          }

          .supply-req-catalog-table thead th,
          .supply-req-catalog-table tbody td {
            padding: 8px 5px;
          }

          .supply-req-catalog-table thead th {
            font-size: 0.68rem;
            line-height: 1.15;
            white-space: normal;
          }

          .supply-req-catalog-table thead th:nth-child(1),
          .supply-req-catalog-table tbody td:nth-child(1) {
            width: auto;
          }

          .supply-req-catalog-table thead th:nth-child(2),
          .supply-req-catalog-table tbody td:nth-child(2) {
            width: 48px;
          }

          .supply-req-catalog-table thead th:nth-child(3),
          .supply-req-catalog-table tbody td:nth-child(3) {
            width: 70px;
          }

          .supply-req-catalog-table tbody td:first-child {
            font-size: 0.76rem;
            line-height: 1.25;
            overflow-wrap: anywhere;
            white-space: normal;
          }

          .supply-req-catalog-table .supply-req-qty-input {
            width: 54px;
            padding-left: 5px;
            padding-right: 5px;
          }

          .supply-req-record-table {
            grid-template-columns: 60px 60px minmax(140px, 1fr);
            gap: 8px;
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
                className="supply-req-mobile-backdrop"
                onClick={closeMobileSidebar}
                aria-hidden="true"
              />
            )}

            <aside
              className={[
                "supply-req-sidebar-wrap",
                isSidebarOpen ? "sidebar-expanded" : "sidebar-collapsed",
                isMobileView && nurseMobileSidebar
                  ? "sidebar-mobile-open"
                  : "",
              ].join(" ")}
            >
              <div className="supply-req-sidebar-card">
                <button
                  type="button"
                  className="supply-req-toggle"
                  aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                  title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                  onClick={toggleSidebar}
                >
                  <i className="fa-solid fa-bars" />
                </button>

                <div className="supply-req-profile">
                  <div className="supply-req-profile-icon">
                    <i className="isax isax-box" />
                  </div>
                  <h4 className="supply-req-title">Central Supply</h4>
                </div>

                <div className="supply-req-menu">
                  <div className="fw-bold text-center text-dark mb-3">
                    Supplies Requisition
                  </div>

                  <button
                    type="button"
                    className="supply-req-action"
                    onClick={handleSubmitRequestClick}
                  >
                    <i className="isax isax-send-2" />
                    <span>Submit Request</span>
                  </button>

                  <button type="button" className="supply-req-action">
                    <i className="isax isax-close-square" />
                    <span>Cancel Request</span>
                  </button>
                </div>

                <div className="supply-req-batch-block">
                  <div className="supply-req-batch-number">
                    {batch.rivNumber}
                  </div>
                  <div className="supply-req-batch-status">
                    Batch {batch.status}
                  </div>
                  <div className="supply-req-batch-meta">
                    <div className="fw-bold text-dark">Created</div>
                    <div>{batch.dateCreated}</div>
                    <div>{batch.requestType}</div>
                    <div>{batch.shift}</div>
                  </div>
                </div>
              </div>
            </aside>

            <div className="nurse-dashboard-main mt-4 mt-lg-0">
              <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-4 supply-req-main-card">
                <div className="bg-white px-3 px-md-4 py-3 border-bottom">
                  <div className="d-flex align-items-center justify-content-between gap-3">
                    <h5 className="fw-bold text-dark mb-0 text-uppercase">
                      Supplies Requisition
                    </h5>
                    <button
                      type="button"
                      className="supply-req-close-btn"
                      aria-label="Back to requisition"
                      title="Back to requisition"
                      onClick={() => navigate(all_routes.nurseRequisition)}
                    >
                      <i className="isax isax-close-circle" />
                    </button>
                  </div>
                </div>

                <div className="supply-req-grid">
                  <section className="supply-req-patient-panel">
                    <div className="supply-req-panel-title">Patient List</div>
                    <div className="supply-req-search">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        aria-label="Search patient"
                        placeholder="Search patient"
                        value={patientSearch}
                        onChange={(event) =>
                          setPatientSearch(event.target.value)
                        }
                      />
                    </div>

                    <div className="table-responsive">
                      <table className="table table-sm align-middle mb-0 supply-req-patient-table">
                        <thead>
                          <tr>
                            <th>Patient Name</th>
                            <th className="text-end">Length of Stay</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPatients.length > 0 ? (
                            filteredPatients.map((patient) => (
                              <tr
                                key={patient.id}
                                className={
                                  selectedPatientId === patient.id
                                    ? "active"
                                    : ""
                                }
                                onClick={() => handlePatientRowClick(patient.id)}
                                onDoubleClick={() => openSupplyModal(patient.id)}
                                title="Double-click to select supplies"
                              >
                                <td>
                                  <span className="supply-req-patient-name">
                                    <span>{patient.name}</span>
                                  </span>
                                </td>
                                <td className="text-end">
                                  <span className="supply-req-los-cell">
                                    <span>{patient.lengthOfStay}</span>
                                    <button
                                      type="button"
                                      className="supply-req-patient-open"
                                      aria-label={`Select supplies for ${patient.name}`}
                                      title="Select supplies"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        openSupplyModal(patient.id);
                                      }}
                                    >
                                      <i className="isax isax-edit-2" />
                                    </button>
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={2} className="text-muted">
                                No patient found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section className="supply-req-item-area">
                    <div className="supply-req-panel-title">
                      Requested Item per Patient : {selectedPatient.name}
                    </div>

                    <div className="table-responsive supply-req-item-table-wrap">
                      <table className="table table-sm align-middle mb-0 supply-req-item-table">
                        <thead>
                          <tr>
                            <th style={{ width: "44px" }}></th>
                            <th className="text-center">Req. Qty</th>
                            <th className="text-center">Issued</th>
                            <th>Item Description</th>
                            <th>Charge Slip Code</th>
                            <th>Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requestedItems.length > 0 ? (
                            requestedItems.map((item) => (
                              <tr key={item.id}>
                                <td className="text-center">
                                  <button
                                    type="button"
                                    className="supply-req-table-icon-btn"
                                    aria-label={`Remove ${item.description}`}
                                    title="Remove item"
                                    onClick={() => removeRequestedItem(item.id)}
                                  >
                                    <i className="isax isax-trash" />
                                  </button>
                                </td>
                                <td className="text-center">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="supply-req-qty-input"
                                    aria-label={`Requested quantity for ${item.description}`}
                                    value={item.quantity}
                                    onChange={(event) =>
                                      updateRequestedQuantity(
                                        item.id,
                                        event.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td className="text-center text-muted">
                                  {item.issued || "-"}
                                </td>
                                <td className="fw-semibold text-dark">
                                  {item.description}
                                </td>
                                <td>{item.chargeSlipCode}</td>
                                <td>{item.rate}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="p-0">
                                <div className="supply-req-empty-state">
                                  Double-click a patient name to select supplies.
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="supply-req-count-bar">
                      Number of item/s : {requestedItems.length}
                    </div>

                    <div className="supply-req-record">
                      Batch Request Record : {batch.rivNumber}
                    </div>
                    {requestedItems.length > 0 && (
                      <div className="supply-req-record-summary">
                        <div className="supply-req-record-table">
                          <div className="head">Req. Qty</div>
                          <div className="head issued-head">Issued</div>
                          <div className="head">Item Description</div>

                          {requestedItems.map((item) => (
                            <Fragment key={item.id}>
                              <div className="fw-bold text-center">
                                {item.quantity}
                              </div>
                              <div className="text-muted text-center">
                                {item.issued || "-"}
                              </div>
                              <div>{item.description}</div>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {submitDialog && (
        <div
          className="supply-req-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="supplyReqSubmitModalTitle"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeSubmitDialog();
            }
          }}
        >
          <div className="supply-req-confirm-modal">
            <div className="supply-req-modal-header">
              <div className="supply-req-modal-title">
                <i className="isax isax-send-2" />
                <div className="min-width-0">
                  <h6 id="supplyReqSubmitModalTitle">Submit Request</h6>
                  <span>{batch.rivNumber}</span>
                </div>
              </div>

              <button
                type="button"
                className="supply-req-modal-close"
                aria-label="Close submit request dialog"
                onClick={closeSubmitDialog}
              >
                <i className="isax isax-close-circle" />
              </button>
            </div>

            {submitDialog === "empty" ? (
              <>
                <div className="supply-req-confirm-body">
                  <div className="supply-req-confirm-icon cancelled">
                    <i className="isax isax-info-circle" />
                  </div>
                  <div className="supply-req-confirm-title">
                    No Request Items
                  </div>
                  <p className="supply-req-confirm-text">
                    There is no saved request to submit.
                  </p>
                </div>

                <div className="supply-req-confirm-actions">
                  <button
                    type="button"
                    className="btn btn-sm text-white"
                    style={{
                      backgroundColor: "var(--primary, #0f763f)",
                      borderColor: "var(--primary, #0f763f)",
                    }}
                    onClick={closeSubmitDialog}
                  >
                    OK
                  </button>
                </div>
              </>
            ) : submitDialog === "confirm" ? (
              <>
                <div className="supply-req-confirm-body">
                  <div className="supply-req-confirm-icon">
                    <i className="isax isax-info-circle" />
                  </div>
                  <div className="supply-req-confirm-title">
                    Submit Batch Request?
                  </div>
                  <p className="supply-req-confirm-text">
                    You are about to submit a batch request.
                  </p>
                </div>

                <div className="supply-req-confirm-actions">
                  <button
                    type="button"
                    className="btn btn-sm btn-light border"
                    onClick={() => setSubmitDialog("cancelled")}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm text-white"
                    style={{
                      backgroundColor: "var(--primary, #0f763f)",
                      borderColor: "var(--primary, #0f763f)",
                    }}
                    onClick={() => setSubmitDialog("success")}
                  >
                    Yes
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="supply-req-confirm-body">
                  <div
                    className={`supply-req-confirm-icon ${
                      submitDialog === "cancelled" ? "cancelled" : ""
                    }`}
                  >
                    <i
                      className={
                        submitDialog === "success"
                          ? "isax isax-tick-circle"
                          : "isax isax-close-circle"
                      }
                    />
                  </div>
                  <div className="supply-req-confirm-title">
                    {submitDialog === "success"
                      ? "Batch Request Submitted"
                      : "Submission Cancelled"}
                  </div>
                  <p className="supply-req-confirm-text">
                    {submitDialog === "success"
                      ? "The batch request was submitted successfully."
                      : "The batch request was not submitted."}
                  </p>
                </div>

                <div className="supply-req-confirm-actions">
                  <button
                    type="button"
                    className="btn btn-sm text-white"
                    style={{
                      backgroundColor: "var(--primary, #0f763f)",
                      borderColor: "var(--primary, #0f763f)",
                    }}
                    onClick={closeSubmitDialog}
                  >
                    OK
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showSupplyModal && (
        <div
          className="supply-req-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="supplyReqItemModalTitle"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeSupplyModal();
            }
          }}
        >
          <div className="supply-req-modal">
            <div className="supply-req-modal-header">
              <div className="supply-req-modal-title">
                <i className="isax isax-box" />
                <div className="min-width-0">
                  <h6 id="supplyReqItemModalTitle">
                    Supplies Items Select Utility
                  </h6>
                  <span>{selectedPatient.name}</span>
                </div>
              </div>

              <button
                type="button"
                className="supply-req-modal-close"
                aria-label="Close item selection"
                onClick={closeSupplyModal}
              >
                <i className="isax isax-close-circle" />
              </button>
            </div>

            <div className="supply-req-modal-body">
              <div className="supply-req-modal-search">
                <i className="isax isax-search-normal-1" />
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search item description or code"
                  aria-label="Search supplies"
                  value={itemSearch}
                  autoFocus
                  onChange={(event) => setItemSearch(event.target.value)}
                />
              </div>

              <div className="supply-req-picker-layout">
                <div className="supply-req-catalog-window">
                  <div className="table-responsive supply-req-catalog-scroll">
                    <table className="table table-sm align-middle mb-0 supply-req-catalog-table">
                      <thead>
                        <tr>
                          <th>Item Description</th>
                          <th className="text-center">Select</th>
                          <th className="text-center">
                            <span className="d-none d-sm-inline">
                              Requested Quantity
                            </span>
                            <span className="d-sm-none">Qty</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSupplyItems.length > 0 ? (
                          filteredSupplyItems.map((item) => {
                            const quantity = draftQuantities[item.id] || "";
                            const isSelected = Number(quantity) > 0;

                            return (
                              <tr
                                key={item.id}
                                className={isSelected ? "selected" : ""}
                              >
                                <td className="fw-semibold text-dark">
                                  {item.description}
                                </td>
                                <td className="text-center">
                                  <input
                                    type="checkbox"
                                    className="supply-req-check"
                                    aria-label={`Select ${item.description}`}
                                    checked={isSelected}
                                    onChange={(event) =>
                                      toggleDraftItem(
                                        item.id,
                                        event.target.checked
                                      )
                                    }
                                  />
                                </td>
                                <td className="text-center">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="supply-req-qty-input"
                                    aria-label={`Requested quantity for ${item.description}`}
                                    placeholder="0"
                                    value={quantity}
                                    onChange={(event) =>
                                      updateDraftQuantity(
                                        item.id,
                                        event.target.value
                                      )
                                    }
                                  />
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={3} className="text-muted p-4">
                              No item matches your search.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <aside
                  className="supply-req-selected-window"
                  aria-label="Selected supplies"
                >
                  <div className="supply-req-selected-head">
                    Selected Items ({selectedDraftItems.length})
                  </div>

                  {selectedDraftItems.length > 0 ? (
                    <div className="supply-req-selected-list">
                      {selectedDraftItems.map((item) => (
                        <div className="supply-req-selected-item" key={item.id}>
                          <div className="supply-req-selected-item-title">
                            {item.description}
                          </div>
                          <input
                            type="text"
                            inputMode="numeric"
                            className="supply-req-qty-input"
                            aria-label={`Selected quantity for ${item.description}`}
                            value={
                              draftQuantities[item.id] || String(item.quantity)
                            }
                            onChange={(event) =>
                              updateDraftQuantity(item.id, event.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="supply-req-selected-remove"
                            aria-label={`Remove ${item.description}`}
                            title="Remove selected item"
                            onClick={() => toggleDraftItem(item.id, false)}
                          >
                            <i className="isax isax-trash" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="supply-req-selected-empty">
                      Selected supplies will stay visible here while you scroll
                      the item list.
                    </div>
                  )}
                </aside>
              </div>
            </div>

            <div className="supply-req-modal-footer">
              <button type="button"
                className="btn btn-sm btn-light border fw-bold px-4"
                onClick={closeSupplyModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-sm text-white fw-bold px-4"
                style={{
                  backgroundColor: "var(--primary, #0f763f)",
                  borderColor: "var(--primary, #0f763f)",
                }}
                onClick={saveSupplyItems}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SupplyRequisition;
