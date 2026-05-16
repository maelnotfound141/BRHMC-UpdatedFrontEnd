import { useEffect, useState } from "react";
import DoctorSidebar from "@/components/custom-sidebar/doctorSidebar";
import { useLocation } from "react-router";

interface DispositionData {
  typeOfDisposition: string;
  typeOfCondition: string;
  dateOfDischarge: string;
}

const DispositionModule = () => {
  const location = useLocation();

  const [mockPatientProfile] = useState({
    hospitalNumber: "000000000777288",
    lastName: "DO",
    firstName: "REA",
    middleName: "MON",
    address: "111 Estanza, Legazpi City, Albay",
    birthdate: "01/01/2000",
    age: "26 Yrs. Old",
    civilStatus: "Married",
    gender: "Male",
    employmentStatus: "Employed",
    nationality: "Filipino",
    religion: "Catholic",
    seniorCitizenNo: "",
    mssNo: "",
    isPersonnel: "No",
  });

  const [showDisposeModal, setShowDisposeModal] = useState(false);
  const [dispositionData, setDispositionData] = useState<DispositionData | null>(null);

  const [dispForm, setDispForm] = useState<DispositionData>({
    typeOfDisposition: "Discharge",
    typeOfCondition: "",
    dateOfDischarge: "",
  });

  useEffect(() => {
    if (location.state?.selectedPatientId) {
      setTimeout(() => {}, 1500);
    }
  }, [location.state]);

  const handleSaveDisposition = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setDispositionData(dispForm);
    setShowDisposeModal(false);
  };

  const handleOpenAddDisposition = () => {
    setDispForm({
      typeOfDisposition: "Discharge",
      typeOfCondition: "",
      dateOfDischarge: "",
    });
    setShowDisposeModal(true);
  };

  const handleOpenEditDisposition = () => {
    if (!dispositionData) return;

    setDispForm({ ...dispositionData });
    setShowDisposeModal(true);
  };

  const setDispCurrentDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    setDispForm({
      ...dispForm,
      dateOfDischarge: now.toISOString().slice(0, 16),
    });
  };

  const formatDateTime = (dt: string) => {
    if (!dt) return "—";

    try {
      return new Date(dt).toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dt.replace("T", " ");
    }
  };

  return (
    <>
      <style>
        {`
          .text-hover-primary:hover {
            color: var(--primary, #0f763f) !important;
          }

          .disposition-action-btn {
            min-height: 38px;
            font-size: 0.9rem;
          }

          .disposition-main-panel {
            min-height: 460px;
          }

          .disposition-empty-icon {
            font-size: 3.25rem;
          }

          .disposition-section-title {
            font-size: 1rem;
            letter-spacing: 0.3px;
          }

          .disposition-label {
            font-size: 0.85rem;
          }

          .disposition-value {
            font-size: 0.95rem;
            min-height: 42px;
          }

          .disposition-note {
            font-size: 0.95rem;
            line-height: 1.7;
          }

          @media (max-width: 575.98px) {
            .modal-footer-actions {
              flex-direction: column-reverse;
              width: 100%;
            }

            .modal-footer-actions button {
              width: 100%;
              margin-top: 8px;
            }
          }
        `}
      </style>

      <div
        className="content doctor-content bg-light mt-n4"
        style={{ minHeight: "100vh" }}
      >
        <div className="container-fluid px-3 px-lg-5 pt-0">
          <div className="doctor-dashboard-layout">
            <DoctorSidebar />

            <div className="doctor-dashboard-main">
              <div
                className="card border-0 shadow-sm p-3 p-md-4 mb-4"
                style={{
                  borderRadius: "12px",
                  borderTop: "4px solid var(--primary, #0f763f)",
                }}
              >
                {/* Patient Profile Header */}
                <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3 gap-md-4 mb-4 pb-4 border-bottom text-center text-md-start">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center bg-light shadow-sm flex-shrink-0"
                    style={{
                      width: "90px",
                      height: "90px",
                      border: "2px solid var(--primary, #0f763f)",
                    }}
                  >
                    <i
                      className="isax isax-user fs-1 text-primary"
                      style={{ color: "var(--primary, #0f763f)" }}
                    />
                  </div>

                  <div>
                    <div className="badge bg-light text-secondary border mb-2 px-2 py-1">
                      ID: {mockPatientProfile.hospitalNumber}
                    </div>

                    <h3 className="fw-bold mb-1 text-dark fs-3 fs-md-2">
                      {mockPatientProfile.lastName},{" "}
                      {mockPatientProfile.firstName}{" "}
                      {mockPatientProfile.middleName}
                    </h3>

                    <div className="text-muted small d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-start gap-2">
                      <div className="d-flex align-items-center gap-1">
                        <i className="isax isax-location text-danger" />
                        {mockPatientProfile.address}
                      </div>
                    </div>
                  </div>
                </div>



                {/* Toolbar */}
                <div className="d-flex flex-row flex-wrap justify-content-between align-items-center mb-4 gap-2">
                  <h5
                    className="fw-bold text-dark mb-0 text-uppercase text-nowrap"
                    style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
                  >
                    Disposition
                  </h5>

                  <div
  className={`justify-content-end gap-2 ms-auto ${
    !dispositionData
      ? "d-none d-lg-flex"
      : "d-flex flex-nowrap"
  }`}
>
                    <button
  type="button"
  onClick={handleOpenAddDisposition}
  className="btn btn-sm shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap fw-bold text-white disposition-action-btn"
  style={{
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#0f763f",
    border: "1px solid #0f763f",
  }}
>
  <i className="isax isax-add"></i>
  <span>Dispose</span>
</button>

                    <button
                      type="button"
                      disabled={!dispositionData}
                      onClick={handleOpenEditDisposition}
                      className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap fw-bold disposition-action-btn ${
                        dispositionData
                          ? "bg-white text-dark text-hover-primary"
                          : "bg-light text-muted opacity-50"
                      }`}
                      style={{
                        borderRadius: "4px",
                        cursor: dispositionData ? "pointer" : "not-allowed",
                      }}
                    >
                      <i className="isax isax-edit-2"></i>
                      <span>Edit</span>
                    </button>
                  </div>
                </div>

                {/* Main Content */}
                <div className="border rounded bg-white disposition-main-panel">
                 {!dispositionData ? (
  <div className="text-center text-muted py-5 px-3 d-flex flex-column align-items-center justify-content-center h-100">

    {/* DESKTOP ICON */}
    <i className="isax isax-folder-open mb-3 opacity-50 d-none d-lg-block disposition-empty-icon"></i>

    {/* MOBILE ADD BUTTON */}
    <div
      className="rounded-circle d-flex align-items-center justify-content-center shadow-sm d-lg-none mb-2"
      onClick={handleOpenAddDisposition}
      style={{
        width: "64px",
        height: "64px",
        border: "2px solid var(--primary, #0f763f)",
        backgroundColor: "#fff",
        cursor: "pointer",
      }}
    >
      <i
        className="isax isax-add text-primary"
        style={{ fontSize: "2rem" }}
      />
    </div>

    {/* MOBILE LABEL */}
    <span
      className="mt-2 fw-semibold text-muted d-lg-none"
      style={{ fontSize: "14px" }}
    >
      Add New
    </span>

    {/* EMPTY TEXT */}
    <h5 className="fw-bold mb-2 text-dark">
      No disposition set.
    </h5>

    <p className="mb-0" style={{ fontSize: "0.95rem" }}>
      Click <strong className="text-dark">Dispose</strong> in the toolbar above to set one.
    </p>
  </div>
) : (
                    <div className="p-3 p-md-4">
                      <h6 className="fw-bold mb-3 text-secondary text-uppercase disposition-section-title">
                        Disposition and Condition
                      </h6>

                      <div className="px-2 px-md-3 mb-4">
                        <div className="row mb-3 align-items-center">
                          <div className="col-12 col-md-4 text-muted small fw-semibold text-start text-md-end pr-md-4 mb-1 mb-md-0 disposition-label">
                            Type of Disposition:
                          </div>
                          <div className="col-12 col-md-8 fw-bold text-dark text-uppercase bg-light rounded px-3 py-2 border border-light-subtle text-break disposition-value d-flex align-items-center">
                            {dispositionData.typeOfDisposition || "—"}
                          </div>
                        </div>

                        <div className="row mb-3 align-items-center">
                          <div className="col-12 col-md-4 text-muted small fw-semibold text-start text-md-end pr-md-4 mb-1 mb-md-0 disposition-label">
                            Type of Condition:
                          </div>
                          <div className="col-12 col-md-8 fw-bold text-dark text-uppercase bg-light rounded px-3 py-2 border border-light-subtle text-break disposition-value d-flex align-items-center">
                            {dispositionData.typeOfCondition || "—"}
                          </div>
                        </div>

                        <div className="row mb-3 align-items-center">
                          <div className="col-12 col-md-4 text-muted small fw-semibold text-start text-md-end pr-md-4 mb-1 mb-md-0 disposition-label">
                            Date of Discharge:
                          </div>
                          <div className="col-12 col-md-8 fw-bold text-dark text-uppercase bg-light rounded px-3 py-2 border border-light-subtle text-break disposition-value d-flex align-items-center">
                            {dispositionData.dateOfDischarge
                              ? formatDateTime(dispositionData.dateOfDischarge)
                              : "00-00-0000 00:00 AM"}
                          </div>
                        </div>
                      </div>

                      <div className="bg-light rounded-2 border border-light-subtle p-3 p-md-4">
                        <h6 className="fw-bold text-dark mb-3">
                          Nurse on Duty Reminder
                        </h6>

                        <p className="text-dark mb-3 disposition-note">
                          Date of discharge is intended to be entered by Nurse using Nurse Module when patient is ready to leave the hospital. This field is made available here for reference, editing and CF4 compliance purpose.
                        </p>

                        <p className="text-dark mb-0 disposition-note">
                          Setting Date and Time of Discharge will render this record inactive and secured. Other module will no longer be able to make alteration to it.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDisposeModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-lg modal-fullscreen-md-down modal-dialog-centered px-0 px-md-2">
            <div className="modal-content shadow-lg border-0 rounded-1 overflow-hidden bg-white h-100">
              <div
                className="modal-header border-0 py-3 d-flex align-items-center"
                style={{ backgroundColor: "#333b45" }}
              >
                <h5
                  className="modal-title text-white fw-bold m-0 d-flex align-items-center gap-2"
                  style={{ fontSize: "1.1rem" }}
                >
                  <i className="isax isax-edit-2" style={{ fontSize: "1.5rem" }}></i>
                  SET DISPOSITION
                </h5>

                <button
                  type="button"
                  className="btn-close btn-close-white shadow-none"
                  onClick={() => setShowDisposeModal(false)}
                ></button>
              </div>

              <form onSubmit={handleSaveDisposition} className="d-flex flex-column h-100 mb-0">
                <div className="modal-body p-3 p-md-4 bg-light">
                  <div className="card border-0 shadow-sm mb-0">
                    <div className="card-body p-3 p-md-4">
                      <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">
                        Disposition and Condition
                      </h6>

                      <div className="row g-3 mb-4">
                        <div className="col-12 col-md-6">
                          <label className="form-label text-muted small fw-bold">
                            Type of Disposition <span className="text-danger">*</span>
                          </label>

                          <select
                            required
                            className="form-select shadow-none"
                            style={{ borderColor: "var(--primary, #0f763f)" }}
                            value={dispForm.typeOfDisposition}
                            onChange={(e) =>
                              setDispForm({
                                ...dispForm,
                                typeOfDisposition: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Disposition...</option>
                            <option>Absconded</option>
                            <option>Died</option>
                            <option>Discharge</option>
                            <option>Discharge Against Medl. Advise</option>
                            <option>Transferred</option>
                          </select>
                        </div>

                        <div className="col-12 col-md-6">
                          <label className="form-label text-muted small fw-bold">
                            Type of Condition <span className="text-danger">*</span>
                          </label>

                          <select
                            required
                            className="form-select shadow-none"
                            style={{ borderColor: "var(--primary, #0f763f)" }}
                            value={dispForm.typeOfCondition}
                            onChange={(e) =>
                              setDispForm({
                                ...dispForm,
                                typeOfCondition: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Condition...</option>
                            <option>Expired</option>
                            <option>Improved</option>
                            <option>Recovered</option>
                            <option>Unimproved</option>
                          </select>
                        </div>
                      </div>

                      <h6 className="fw-bold text-dark border-bottom pb-2 mb-3 mt-4">
                        Date of Discharge (for Nurse on Duty)
                      </h6>

                      <div className="row g-4">
                        <div className="col-12 col-md-5">
                          <input
                            required
                            type="datetime-local"
                            className="form-control shadow-none mb-2"
                            style={{ borderColor: "var(--primary, #0f763f)" }}
                            value={dispForm.dateOfDischarge}
                            onChange={(e) =>
                              setDispForm({
                                ...dispForm,
                                dateOfDischarge: e.target.value,
                              })
                            }
                          />

                          <button
                            type="button"
                            className="btn btn-outline-secondary w-100 fw-medium"
                            onClick={setDispCurrentDate}
                          >
                            Set Current Date
                          </button>
                        </div>

                        <div className="col-12 col-md-7">
                          <p className="text-muted small mb-2">
                            Date of discharge is intended to be entered by Nurse using the Nurse Module when patient is ready to leave the hospital.
                          </p>

                          <p className="text-muted small mb-0">
                            Setting the Date and Time of Discharge will render this record inactive and inaccessible in other module.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="modal-footer border-0 p-3 justify-content-end mt-auto"
                  style={{ backgroundColor: "#e2e5e9" }}
                >
                  <div className="d-flex modal-footer-actions gap-2 w-100 justify-content-sm-end">
                    <button
  type="button"
  className="btn rounded-1 px-5 py-2 fw-medium shadow-sm bg-white border text-black"
  onClick={() => setShowDisposeModal(false)}
>
  CANCEL
</button>

                    <button
                      type="submit"
                      className="btn rounded-1 px-5 py-2 fw-medium shadow-sm text-white"
                      style={{
                        backgroundColor: "var(--primary, #0f763f)",
                        cursor: "pointer",
                      }}
                    >
                      SAVE
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DispositionModule;
