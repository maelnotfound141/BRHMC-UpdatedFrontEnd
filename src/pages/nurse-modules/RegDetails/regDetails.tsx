import NurseSidebar from "@/components/custom-sidebar/nurseSidebar";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

/* patient registration details */
const RegDetails = () => {
  const [open, setOpen] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const location = useLocation();

  const [mockPatientProfile, setMockPatientProfile] = useState({
    hospitalNumber: "000000000777288",
    lastName: "DO",
    firstName: "REA",
    middleName: "MON",
    address: "111 Estanza, Legazpi City, Albay",

    admissionDetails: {
      dateOfAdmission: "03/21/2026 02:45 PM",
      admittingDiagnosis:
        "TEST ADMITTING DIAGNOSIS. FOR SYSTEM MAINTENANCE PURPOSE, PLEASE IGNORE THIS RECORD",
      admittingPhysician: "---, --, MD",
      attendingPhysician: "---",
      wardAssignment: "Ph Med",
      typeOfAccomodation: "SERVI",
      typeOfService: "Medicine",
      watchId: "260321-039",
      patage: "26",
    },

    dischargeDetails: {
      disdate: "---",
      dispcode: "---",
      condcode: "---",
    },

    accountDetails: {
      mssClassification: "Initial",
      philhealthCategory: "---",
      philhealthRequirement: "---",
      mayGoHome: "---",
      statementOfAccount: "---",
    },

    wardAssignments: [
      {
        ward: "Ph Med",
        from: "03/21/2026 02:45 PM",
        to: "-",
        lengthOfStay: "0 day and 1 hr",
      },
    ],
  });

  const [editForm, setEditForm] = useState(mockPatientProfile);

  useEffect(() => {
    const selectedPatientId = location.state?.selectedPatientId;

    if (selectedPatientId) {
      setTimeout(() => {}, 1500);
    }
  }, [location.state]);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleOpenUpdateModal = () => {
    setEditForm(mockPatientProfile);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setEditForm(mockPatientProfile);
  };

  const handleProfileChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAdmissionChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      admissionDetails: {
        ...prev.admissionDetails,
        [field]: value,
      },
    }));
  };

  const handleDischargeChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      dischargeDetails: {
        ...prev.dischargeDetails,
        [field]: value,
      },
    }));
  };

  const handleAccountChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      accountDetails: {
        ...prev.accountDetails,
        [field]: value,
      },
    }));
  };

  const handleWardChange = (index: number, field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      wardAssignments: prev.wardAssignments.map((ward, wardIndex) =>
        wardIndex === index ? { ...ward, [field]: value } : ward
      ),
    }));
  };

  const handleSubmitUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMockPatientProfile(editForm);
    setShowUpdateModal(false);
  };

  const admissionInfo = [
    {
      label: "Date of Admission",
      value: mockPatientProfile.admissionDetails.dateOfAdmission,
    },
    {
      label: "Admitting Diagnosis",
      value: mockPatientProfile.admissionDetails.admittingDiagnosis,
    },
    {
      label: "Admitting Physician",
      value: mockPatientProfile.admissionDetails.admittingPhysician,
    },
    {
      label: "Attending Physician",
      value: mockPatientProfile.admissionDetails.attendingPhysician,
    },
    {
      label: "Ward Assignment",
      value: mockPatientProfile.admissionDetails.wardAssignment,
    },
    {
      label: "Type of Accommodation",
      value: mockPatientProfile.admissionDetails.typeOfAccomodation,
    },
    {
      label: "Type of Service",
      value: mockPatientProfile.admissionDetails.typeOfService,
    },
    {
      label: "Watch ID",
      value: mockPatientProfile.admissionDetails.watchId,
    },
    {
      label: "Patient Age",
      value: mockPatientProfile.admissionDetails.patage,
    },
  ];

  const dischargeInfo = [
    {
      label: "Disdate",
      value: mockPatientProfile.dischargeDetails.disdate,
    },
    {
      label: "Dispcode",
      value: mockPatientProfile.dischargeDetails.dispcode,
    },
    {
      label: "Condcode",
      value: mockPatientProfile.dischargeDetails.condcode,
    },
  ];

  const accountInfo = [
    {
      label: "MSS Classification",
      value: mockPatientProfile.accountDetails.mssClassification,
    },
    {
      label: "PhilHealth Category",
      value: mockPatientProfile.accountDetails.philhealthCategory,
    },
    {
      label: "PhilHealth Requirement",
      value: mockPatientProfile.accountDetails.philhealthRequirement,
    },
    {
      label: "May Go Home",
      value: mockPatientProfile.accountDetails.mayGoHome,
    },
    {
      label: "Statement of Account",
      value: mockPatientProfile.accountDetails.statementOfAccount,
    },
  ];

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="px-3 py-2 border-bottom" style={{ background: "#eef5f8" }}>
      <h6 className="fw-bold mb-0 text-dark">{title}</h6>
    </div>
  );

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="row mb-2">
      <div className="col-12 col-md-5 text-md-end text-muted small fw-semibold mb-1 mb-md-0">
        {label}:
      </div>

      <div className="col-12 col-md-7 small fw-semibold text-dark text-break">
        {value || "---"}
      </div>
    </div>
  );

  const FormInput = ({
    label,
    value,
    onChange,
    textarea = false,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    textarea?: boolean;
  }) => (
    <div className="col-12 col-md-6">
      <label className="form-label small fw-semibold text-muted">{label}</label>

      {textarea ? (
        <textarea
          className="form-control form-control-sm"
          rows={3}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          type="text"
          className="form-control form-control-sm"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  );

  return (
    <>
     <style>
  {`
    .text-hover-primary:hover {
      color: var(--primary, #0f763f) !important;
    }

    .reg-toolbar-btn:disabled {
      cursor: not-allowed !important;
    }

    .nurse-dashboard-layout {
      display: flex;
      align-items: flex-start;
      gap: 24px;
      width: 100%;
    }

    .nurse-dashboard-main {
      flex: 1 1 auto;
      min-width: 0;
      width: 100%;
    }

    @media (max-width: 991.98px) {
      .nurse-dashboard-layout {
        display: block;
      }

      .nurse-dashboard-main {
        width: 100%;
      }
    }

    .reg-update-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      z-index: 1050;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .reg-update-modal {
      width: 100%;
      max-width: 900px;
      max-height: 90vh;
      overflow-y: auto;
      background: #fff;
      border-radius: 8px;
    }

    .reg-modal-section-title {
      background: #eef5f8;
      border-left: 4px solid var(--primary, #0f763f);
    }
  `}
</style>
      {/* page content */}
      {/* page content */}
<div
  className="content nurse-content bg-light mt-n4"
  style={{ minHeight: "100vh" }}
>
  <div className="container-fluid px-3 px-lg-5 pt-0">
    <div className="nurse-dashboard-layout">
      {/* nurse sidebar */}
      <NurseSidebar />

      {/* specific patient record */}
      <div className="nurse-dashboard-main mt-4 mt-lg-0">
              <div
                className="card border-0 shadow-sm rounded-3 overflow-hidden mb-4"
                style={{
                  borderTop: "4px solid var(--primary, #0f763f)",
                }}
              >
                {/* patient profile header */}
                <div className="bg-white px-3 px-md-4 pt-4">
                  <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3 gap-md-4 pb-4 border-bottom text-center text-md-start">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center bg-light shadow-sm flex-shrink-0"
                      style={{
                        width: "90px",
                        height: "90px",
                        border: "2px solid var(--primary, #0f763f)",
                      }}
                    >
                      <i
                        className="isax isax-user fs-1"
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

                      <div className="text-muted small d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                        <i className="isax isax-location text-danger" />
                        {mockPatientProfile.address}
                      </div>
                    </div>
                  </div>
                </div>

                {/* toolbar buttons */}
                <div className="bg-white px-3 px-md-4 py-3 border-bottom">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <h5 className="fw-bold text-dark mb-0 text-center text-md-start text-uppercase">
                      Registration Details
                    </h5>

                  </div>
                </div>

                {/* content layout */}
                <div className="row g-0">
                  {/* left column */}
                  <div className="col-12 col-xl-6 border-end">
                    {/* admission details */}
                    <div className="border-bottom">
                      <SectionHeader title="Admission Details" />

                      <div className="p-3">
                        {admissionInfo.map((item, index) => (
                          <InfoRow
                            key={index}
                            label={item.label}
                            value={item.value}
                          />
                        ))}
                      </div>
                    </div>

                    {/* disposition and discharge */}
                    <div className="border-bottom">
                      <SectionHeader title="Disposition and Discharge" />

                      <div className="p-3">
                        {dischargeInfo.map((item, index) => (
                          <InfoRow
                            key={index}
                            label={item.label}
                            value={item.value}
                          />
                        ))}
                      </div>
                    </div>

                    {/* account details */}
                    <div>
                      <SectionHeader title="Account Details" />

                      <div className="p-3">
                        <div className="row g-3 text-center">
                          {accountInfo.map((item, index) => (
                            <div className="col-6 col-md" key={index}>
                              <div className="small text-muted fw-semibold mb-2">
                                {item.label}
                              </div>

                              <div
                                className="fw-bold small"
                                style={{
                                  color:
                                    item.value === "Initial"
                                      ? "var(--primary, #0f763f)"
                                      : "#343a40",
                                }}
                              >
                                {item.value || "---"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* right column */}
                  <div className="col-12 col-xl-6">
                    <SectionHeader title="Ward and Room Assignment" />

                    <div className="p-3">
                      <div className="table-responsive">
                        <table className="table table-sm align-middle mb-0">
                          <thead>
                            <tr>
                              <th className="border-0 text-muted small fw-semibold">
                                Ward
                              </th>
                              <th className="border-0 text-muted small fw-semibold">
                                From
                              </th>
                              <th className="border-0 text-muted small fw-semibold">
                                To
                              </th>
                              <th className="border-0 text-muted small fw-semibold text-end">
                                Length of Stay
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {mockPatientProfile.wardAssignments.map(
                              (ward, index) => (
                                <tr key={index}>
                                  <td className="fw-semibold small">
                                    {ward.ward}
                                  </td>

                                  <td className="small text-muted">
                                    {ward.from}
                                  </td>

                                  <td className="small text-muted">
                                    {ward.to}
                                  </td>

                                  <td className="small text-muted text-end">
                                    {ward.lengthOfStay}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div
                      className="d-none d-xl-block"
                      style={{ minHeight: "420px" }}
                    />
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

export default RegDetails;