import NurseSidebar from "@/components/custom-sidebar/nurseSidebar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

type Disposition =
  | ""
  | "Absconded"
  | "Died"
  | "Discharge"
  | "Discharge Against Medical Advice"
  | "Transferred";

type DischargeForm = {
  dateOfAdmission: string;
  dateOfDischarge: string;
  disposition: Disposition;
  condition: string;
  deathDateTime: string;
  censusInclude: string;
  accommodationType: string;
};

const dispositionOptions: Exclude<Disposition, "">[] = [
  "Absconded",
  "Died",
  "Discharge",
  "Discharge Against Medical Advice",
  "Transferred",
];

const formatDateTime = (date: Date) =>
  date.toLocaleString("en-PH", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const admissionDate = "03/21/2026 02:45 PM";
const emptyDateTime = "00/00/0000 00:00 AM";
const emptyDeathDateTime = "";

const Discharge = () => {
  const location = useLocation();
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [modalError, setModalError] = useState("");

  const [patientProfile, setPatientProfile] = useState({
    hospitalNumber: "000000000777288",
    fullName: "DO, REA MON",
    address: "111 Legazpi City, Albay 4500",
    status: "Admitted",
    ward: "Ph Med",
    watcherId: "260321-039",
    accountType: "Service",
    serviceType: "Medicine",
    dischargeDetails: {
      dateOfAdmission: admissionDate,
      dateOfDischarge: emptyDateTime,
      disposition: "" as Disposition,
      condition: "",
      deathDateTime: emptyDeathDateTime,
      censusInclude: "",
      accommodationType: "Service",
    },
  });

  const [form, setForm] = useState<DischargeForm>(
    patientProfile.dischargeDetails
  );

  useEffect(() => {
    const selectedPatientId = location.state?.selectedPatientId;

    if (selectedPatientId) {
      setTimeout(() => {}, 1500);
    }
  }, [location.state]);

  const openDischargeModal = () => {
    setForm(patientProfile.dischargeDetails);
    setModalError("");
    setShowDischargeModal(true);
  };

  const closeDischargeModal = () => {
    setShowDischargeModal(false);
    setModalError("");
  };

  const handleFormChange = <T extends keyof DischargeForm>(
    field: T,
    value: DischargeForm[T]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "disposition" && value !== "Died"
        ? {
            deathDateTime: emptyDeathDateTime,
            censusInclude: "",
          }
        : {}),
    }));
    setModalError("");
  };

  const handleUseCurrentDateTime = () => {
    setForm((prev) => ({
      ...prev,
      dateOfDischarge: formatDateTime(new Date()),
    }));
  };

  const handleSaveDischarge = () => {
    if (!form.disposition) {
      setModalError("Select a disposition before saving.");
      return;
    }

    if (form.disposition === "Died" && !form.deathDateTime) {
      setModalError("Select the date and time of death before saving.");
      return;
    }

    setPatientProfile((prev) => ({
      ...prev,
      status: form.disposition === "Discharge" ? "Discharged" : form.disposition,
      dischargeDetails: form,
    }));
    closeDischargeModal();
  };

  return (
    <>
      <style>{`
        .discharge-layout {
          display: flex;
          align-items: flex-start;
          gap: 24px;
          width: 100%;
        }

        .discharge-main {
          flex: 1 1 auto;
          min-width: 0;
          width: 100%;
        }

        .discharge-card {
          border-top: 4px solid var(--primary, #0f763f);
        }

        .discharge-avatar {
          width: 90px;
          height: 90px;
          border: 2px solid var(--primary, #0f763f);
          color: var(--primary, #0f763f);
        }

        .discharge-status {
          color: #78b82a;
          font-size: clamp(1.35rem, 2vw, 1.8rem);
          font-weight: 900;
          letter-spacing: 0.2px;
        }

        .discharge-toolbar {
          background: #fff;
          border-bottom: 1px solid #e9ecef;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
        }

        .discharge-toolbar-title {
          color: #172033;
          font-size: 1.05rem;
          font-weight: 900;
          text-transform: uppercase;
          margin: 0;
        }

        .discharge-toolbar-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
          flex-wrap: wrap;
        }

        .discharge-toolbar-btn {
          min-height: 38px;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          padding: 8px 14px;
          color: #172033;
          background: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 800;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
        }

        .discharge-toolbar-btn.primary {
          background: var(--primary, #0f763f);
          border-color: var(--primary, #0f763f);
          color: #fff;
        }

        .discharge-toolbar-btn.primary:hover,
        .discharge-toolbar-btn.primary:focus,
        .discharge-toolbar-btn.primary:active {
          background: var(--primary, #0f763f);
          color: #fff;
        }

        .discharge-toolbar-btn:disabled {
          background: #f8f9fa;
          color: #adb5bd;
          cursor: not-allowed;
          box-shadow: none;
        }

        .discharge-admission-card {
          min-height: 520px;
          background: #fff;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
        }

        .discharge-info-label {
          color: #6c757d;
          font-size: 0.78rem;
          font-weight: 800;
          text-align: left;
          text-transform: uppercase;
        }

        .discharge-info-value {
          color: #172033;
          font-size: 0.95rem;
          font-weight: 800;
        }

        .discharge-summary-panel {
          width: min(560px, 100%);
          margin: 0;
        }

        .discharge-summary-status {
          color: #78b82a;
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 900;
          line-height: 1.1;
          text-align: left;
          margin-bottom: 24px;
        }

        .discharge-summary-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .discharge-summary-row {
          display: grid;
          grid-template-columns: minmax(170px, 0.72fr) minmax(0, 1.28fr);
          align-items: start;
          gap: 12px;
        }

        .discharge-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1060;
          background: rgba(15, 23, 42, 0.38);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
        }

        .discharge-modal {
          width: min(760px, calc(100vw - 36px));
          height: min(78dvh, 560px);
          max-height: min(88dvh, 560px);
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.28);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .discharge-modal-header {
          min-height: 44px;
          padding: 9px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid var(--primary, #0f763f);
          background: var(--primary, #0f763f);
        }

        .discharge-modal-title {
          color: #fff;
          font-size: 0.9rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
        }

        .discharge-modal-title i {
          color: #fff;
        }

        .discharge-modal-close {
          width: 32px;
          height: 32px;
          border: 0;
          border-radius: 5px;
          background: transparent;
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .discharge-modal-close:hover {
          background: rgba(255, 255, 255, 0.16);
          color: #fff;
        }

        .discharge-modal-layout {
          min-height: 0;
          display: block;
          flex: 1 1 auto;
          overflow: auto;
        }

        .discharge-modal-body {
          min-height: 0;
          padding: 28px 32px;
          background: #fff;
        }

        .discharge-modal-footer {
          border-top: 1px solid #e9ecef;
          background: #fff;
          padding: 12px 16px;
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          flex-wrap: wrap;
        }

        .discharge-modal-action {
          min-height: 38px;
          border-radius: 5px;
          border: 1px solid #dee2e6;
          background: #fff;
          color: #172033;
          padding: 8px 16px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .discharge-modal-action.primary {
          background: var(--primary, #0f763f);
          border-color: var(--primary, #0f763f);
          color: #fff;
        }

        .discharge-modal-action.primary:hover,
        .discharge-modal-action.primary:focus,
        .discharge-modal-action.primary:active {
          background: var(--primary, #0f763f);
          border-color: var(--primary, #0f763f);
          color: #fff;
        }

        .discharge-form-title {
          color: #6f7b8a;
          font-size: clamp(1.35rem, 2vw, 1.7rem);
          font-weight: 800;
          letter-spacing: 0.5px;
          margin-bottom: 20px;
          text-align: center;
        }

        .discharge-form-grid {
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .discharge-form-row {
          display: grid;
          grid-template-columns: 170px minmax(0, 1fr);
          align-items: center;
          gap: 12px;
        }

        .discharge-form-row.with-action {
          grid-template-columns: 170px minmax(0, 1fr) auto;
        }

        .discharge-form-label {
          color: #6c757d;
          font-size: 0.86rem;
          font-weight: 800;
          text-align: right;
        }

        .discharge-form-label.danger {
          color: #b02a37;
        }

        .discharge-readonly {
          min-height: 38px;
          border-radius: 6px;
          background: #343a40;
          color: #fff;
          display: flex;
          align-items: center;
          padding: 6px 10px;
          font-size: 1.05rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .discharge-current-btn {
          height: 34px;
          border-radius: 5px;
          border: 1px solid #dce5ea;
          background: #fff;
          color: #495057;
          padding: 0 12px;
          font-size: 0.78rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .discharge-current-btn:hover {
          border-color: var(--primary, #0f763f);
          color: var(--primary, #0f763f);
        }

        .discharge-input,
        .discharge-select {
          width: 100%;
          min-height: 36px;
          border: 1px solid #adb5bd;
          border-radius: 5px;
          background: #fff;
          color: #172033;
          padding: 5px 9px;
          font-weight: 700;
        }

        .discharge-input:focus,
        .discharge-select:focus {
          border-color: var(--primary, #0f763f);
          box-shadow: 0 0 0 0.15rem rgba(15, 118, 63, 0.16);
          outline: none;
        }

        .discharge-death-value {
          color: #b02a37;
          text-align: center;
          font-weight: 900;
        }

        .discharge-census-note {
          color: #6c757d;
          font-size: 0.78rem;
          font-weight: 700;
          line-height: 1.25;
        }

        .discharge-alert {
          max-width: 640px;
          margin: 16px auto 0;
          border-radius: 6px;
          padding: 10px 12px;
          background: rgba(220, 53, 69, 0.08);
          color: #b02a37;
          font-size: 0.84rem;
          font-weight: 800;
        }

        @media (max-width: 991.98px) {
          .discharge-layout,
          .nurse-dashboard-layout {
            display: block;
          }

          .discharge-main,
          .nurse-dashboard-main {
            width: 100%;
          }

          .discharge-modal-layout {
            display: block;
          }

          .discharge-modal {
            width: min(720px, calc(100vw - 28px));
            height: min(84dvh, 600px);
            max-height: min(90dvh, 600px);
          }
        }

        @media (max-width: 575.98px) {
          .discharge-toolbar {
            padding: 14px;
          }

          .discharge-toolbar-title,
          .discharge-toolbar-actions,
          .discharge-toolbar-btn {
            width: 100%;
          }

          .discharge-summary-row {
            grid-template-columns: 1fr;
            gap: 3px;
            text-align: left;
          }

          .discharge-info-label,
          .discharge-info-value {
            text-align: left;
          }

          .discharge-modal-backdrop {
            padding: 8px;
          }

          .discharge-modal {
            width: calc(100vw - 16px);
            height: 90dvh;
            max-height: 90dvh;
          }

          .discharge-modal-body {
            padding: 24px 14px;
          }

          .discharge-form-row,
          .discharge-form-row.with-action {
            grid-template-columns: 1fr;
            gap: 5px;
          }

          .discharge-form-label {
            text-align: left;
          }

          .discharge-readonly {
            font-size: 0.94rem;
          }

          .discharge-current-btn {
            width: 100%;
          }

          .discharge-modal-footer,
          .discharge-modal-action {
            width: 100%;
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
              <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-4 discharge-card">
                <div className="bg-white px-3 px-md-4 pt-4">
                  <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3 gap-md-4 pb-4 border-bottom text-center text-md-start">
                    <div className="acc-patient-avatar rounded-circle d-flex align-items-center justify-content-center bg-light shadow-sm flex-shrink-0 discharge-avatar">
                      <i
                        className="isax isax-user fs-1"
                        style={{ color: "var(--primary, #0f763f)" }}
                      />
                    </div>

                    <div className="w-100">
                      <div className="badge bg-light text-secondary border mb-2 px-2 py-1">
                        ID: {patientProfile.hospitalNumber}
                      </div>

                      <h3 className="acc-patient-name fw-bold mb-1 text-dark fs-3 fs-md-2">
                        {patientProfile.fullName}
                      </h3>

                      <div className="text-muted small d-flex align-items-center justify-content-center justify-content-md-start gap-2 flex-wrap">
                        <i className="isax isax-location text-danger" />
                        <span>{patientProfile.address}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="discharge-toolbar">
                  <h5 className="discharge-toolbar-title">Discharge</h5>

                  <div className="discharge-toolbar-actions">
                    <button
                      type="button"
                      className="discharge-toolbar-btn primary"
                      onClick={openDischargeModal}
                    >
                      <i className="isax isax-edit" />
                      <span>Discharge</span>
                    </button>
                    <button
                      type="button"
                      className="discharge-toolbar-btn"
                      disabled
                    >
                      <i className="isax isax-close-circle" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>

                <div className="discharge-admission-card p-3 p-md-4">
                  <div className="discharge-summary-panel">
                    <div className="discharge-summary-status">
                      {patientProfile.status}
                    </div>

                    <div className="discharge-summary-grid">
                      {[
                        {
                          label: "Date of Admission",
                          value: "Mar-21-2026 02:45 PM",
                        },
                        { label: "Ward", value: patientProfile.ward },
                        { label: "Watcher's ID", value: patientProfile.watcherId },
                        {
                          label: "Type of Accommodation",
                          value: patientProfile.accountType,
                        },
                        {
                          label: "Service",
                          value: patientProfile.serviceType,
                        },
                      ].map((item) => (
                        <div className="discharge-summary-row" key={item.label}>
                          <div className="discharge-info-label">
                            {item.label}:
                          </div>
                          <div className="discharge-info-value">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDischargeModal && (
        <div
          className="discharge-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dischargeUtilityTitle"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDischargeModal();
            }
          }}
        >
          <div className="discharge-modal">
            <div className="discharge-modal-header">
              <h6 className="discharge-modal-title" id="dischargeUtilityTitle">
                <i className="isax isax-setting-2" />
                Discharge Utility
              </h6>

              <button
                type="button"
                className="discharge-modal-close"
                aria-label="Close discharge utility"
                onClick={closeDischargeModal}
              >
                <i className="isax isax-close-circle" />
              </button>
            </div>

            <div className="discharge-modal-layout">
              <div className="discharge-modal-body">
                <div className="discharge-form-title">MODE : DISPOSITION</div>

                <div className="discharge-form-grid">
                  <div className="discharge-form-row">
                    <label className="discharge-form-label">
                      Date of Admission :
                    </label>
                    <div className="discharge-readonly">
                      {form.dateOfAdmission}
                    </div>
                  </div>

                  <div className="discharge-form-row with-action">
                    <label className="discharge-form-label">
                      Date of Discharge :
                    </label>
                    <div className="discharge-readonly">
                      {form.dateOfDischarge}
                    </div>
                    <button
                      type="button"
                      className="discharge-current-btn"
                      onClick={handleUseCurrentDateTime}
                    >
                      Current Date/Time
                    </button>
                  </div>

                  <div className="discharge-form-row">
                    <label className="discharge-form-label">
                      Disposition :
                    </label>
                    <select
                      className="discharge-select"
                      value={form.disposition}
                      onChange={(event) =>
                        handleFormChange(
                          "disposition",
                          event.target.value as Disposition
                        )
                      }
                    >
                      <option value=""></option>
                      {dispositionOptions.map((option) => (
                        <option value={option} key={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="discharge-form-row">
                    <label className="discharge-form-label">Condition :</label>
                    <input
                      type="text"
                      className="discharge-input"
                      value={form.condition}
                      onChange={(event) =>
                        handleFormChange("condition", event.target.value)
                      }
                    />
                  </div>

                  {form.disposition === "Died" && (
                    <>
                      <div className="discharge-form-row with-action">
                        <label className="discharge-form-label"></label>
                        <input
                          type="text"
                          className="discharge-input"
                          value={form.censusInclude}
                          onChange={(event) =>
                            handleFormChange("censusInclude", event.target.value)
                          }
                        />
                        <div className="discharge-census-note">
                          If disposition is DIED, user needs to set where census
                          to include.
                        </div>
                      </div>

                      <div className="discharge-form-row">
                        <label className="discharge-form-label danger">
                          Date and Time of Death :
                        </label>
                        <input
                          type="datetime-local"
                          className="discharge-input discharge-death-value"
                          value={form.deathDateTime}
                          onChange={(event) =>
                            handleFormChange("deathDateTime", event.target.value)
                          }
                        />
                      </div>
                    </>
                  )}

                  <div className="discharge-form-row">
                    <label className="discharge-form-label">
                      Type of Accommodation :
                    </label>
                    <input
                      type="text"
                      className="discharge-input"
                      value={form.accommodationType}
                      onChange={(event) =>
                        handleFormChange(
                          "accommodationType",
                          event.target.value
                        )
                      }
                    />
                  </div>
                </div>

                {modalError && (
                  <div className="discharge-alert">{modalError}</div>
                )}
              </div>
            </div>

            <div className="discharge-modal-footer">
              <button
                type="button"
                className="discharge-modal-action"
                onClick={closeDischargeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="discharge-modal-action primary"
                onClick={handleSaveDischarge}
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

export default Discharge;
