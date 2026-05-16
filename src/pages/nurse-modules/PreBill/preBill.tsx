import NurseSidebar from "@/components/custom-sidebar/nurseSidebar";
import ImageWithBasePath from "@/components/image-with-base-path";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

const PreBill = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState("ADMISSION_DETAILS");

  const [mockPatientProfile, setMockPatientProfile] = useState({
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

    admissionDetails: {
      date: "05/05/2026 02:45 PM",
      physician: "Ippo Makunochi, MD",
      clerk: "Joseph Joestar",
      dischargeDate: "---",
      disposition: "---",
      diagnosis: "For Confinement",
    },
    accountInformation: {
      accountNumber: "2026-000026239",
      typeOfAccount: "Service",
      typeOfService: "Medicine",
      philHealthCategory: "---",
      philHealthRequirement: "---",
      typeOfBeneficiary: "---",
      fsoaActualTotal: "---",
      totalBalance: "---",
      lastUpdate: "---",
      billStatus: "Progressive",
    },
    wardAssignments: [
      {
        ward: "Ph Med",
        from: "03/21/2026 02:45 PM",
        to: "---",
        lengthOfStay: "0 day and 6 hrs",
        status: "Active",
      },
    ],
  });

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

  return (
    <>
   

      {/* Page Content */}
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
                    <div className="text-muted small d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                      <i className="isax isax-location text-danger" />
                      {mockPatientProfile.address}
                    </div>
                  </div>
                </div>

                {/* Demographics Grid */}
                <h6
                  className="fw-bold mb-3 text-secondary text-uppercase"
                  style={{ fontSize: "0.85rem", letterSpacing: "0.5px" }}
                >
                  Demographic Details
                </h6>

                <div className="row g-2 mb-4">
                  {[
                    { label: "Birthdate", value: mockPatientProfile.birthdate },
                    { label: "Age", value: mockPatientProfile.age },
                    { label: "Gender", value: mockPatientProfile.gender },
                    {
                      label: "Civil Status",
                      value: mockPatientProfile.civilStatus,
                    },
                    {
                      label: "Nationality",
                      value: mockPatientProfile.nationality,
                    },
                    { label: "Religion", value: mockPatientProfile.religion },
                    {
                      label: "Employment",
                      value: mockPatientProfile.employmentStatus,
                    },
                    {
                      label: "Hospital Personnel",
                      value: mockPatientProfile.isPersonnel,
                    },
                    {
                      label: "Senior Citizen No.",
                      value: mockPatientProfile.seniorCitizenNo,
                    },
                    { label: "MSS No.", value: mockPatientProfile.mssNo },
                  ].map((item, idx) => (
                    <div className="col-6 col-sm-4 col-md-3 col-xl-2" key={idx}>
                      <div className="px-3 py-2 bg-light rounded-2 h-100 border border-light-subtle text-center text-sm-start">
                        <span
                          className="text-muted d-block text-truncate mb-0"
                          style={{
                            fontSize: "0.7rem",
                            textTransform: "uppercase",
                          }}
                          title={item.label}
                        >
                          {item.label}
                        </span>
                        <span
                          className="fw-bold text-dark d-block text-truncate"
                          style={{ fontSize: "0.85rem" }}
                          title={item.value || "—"}
                        >
                          {item.value || "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tabs Navigation */}
                <div className="tab-navigation-wrapper mb-4">
                  <style>
                    {`
                      .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                      }
                    `}
                  </style>

                  <div
                    className="d-flex border-bottom overflow-x-auto text-nowrap pb-1 hide-scrollbar"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                      WebkitOverflowScrolling: "touch",
                    }}
                  >
                    <button
                      onClick={() => setActiveTab("ADMISSION_DETAILS")}
                      className={`btn btn-link text-decoration-none pb-2 px-3 px-md-4 ${
                        activeTab === "ADMISSION_DETAILS"
                          ? "fw-bold rounded-0"
                          : "text-muted fw-semibold"
                      }`}
                      style={{
                        whiteSpace: "nowrap",
                        ...(activeTab === "ADMISSION_DETAILS" && {
                          color: "var(--primary, #0f763f)",
                          borderBottom: "3px solid var(--primary, #0f763f)",
                        }),
                      }}
                    >
                      ADMISSION DETAILS
                    </button>
                    <button
                      onClick={() => setActiveTab("ACCOUNT_INFORMATION")}
                      className={`btn btn-link text-decoration-none pb-2 px-3 px-md-4 ${
                        activeTab === "ACCOUNT_INFORMATION"
                          ? "fw-bold rounded-0"
                          : "text-muted fw-semibold"
                      }`}
                      style={{
                        whiteSpace: "nowrap",
                        ...(activeTab === "ACCOUNT_INFORMATION" && {
                          color: "var(--primary, #0f763f)",
                          borderBottom: "3px solid var(--primary, #0f763f)",
                        }),
                      }}
                    >
                      ACCOUNT INFORMATION
                    </button>
                    <button
                      onClick={() => setActiveTab("WARD_ASSIGNMENT")}
                      className={`btn btn-link text-decoration-none pb-2 px-3 px-md-4 ${
                        activeTab === "WARD_ASSIGNMENT"
                          ? "fw-bold rounded-0"
                          : "text-muted fw-semibold"
                      }`}
                      style={{
                        whiteSpace: "nowrap",
                        ...(activeTab === "WARD_ASSIGNMENT" && {
                          color: "var(--primary, #0f763f)",
                          borderBottom: "3px solid var(--primary, #0f763f)",
                        }),
                      }}
                    >
                      WARD ASSIGNMENT
                    </button>
                  </div>
                </div>

                {/* TAB PANES */}

                {/* Admission Details Tab */}
                {activeTab === "ADMISSION_DETAILS" && (
                  <div className="px-2 px-md-3">
                    {[
                      {
                        label: "Date of Admission",
                        value: mockPatientProfile.admissionDetails.date,
                      },
                      {
                        label: "Admitting Physician",
                        value: mockPatientProfile.admissionDetails.physician,
                      },
                      {
                        label: "Admitting Clerk",
                        value: mockPatientProfile.admissionDetails.clerk,
                      },
                      {
                        label: "Date of Discharge",
                        value: mockPatientProfile.admissionDetails.dischargeDate,
                      },
                      {
                        label: "Disposition",
                        value: mockPatientProfile.admissionDetails.disposition,
                      },
                      {
                        label: "Admitting Diagnosis",
                        value: mockPatientProfile.admissionDetails.diagnosis,
                      },
                    ].map((item, idx) => (
                      <div className="row mb-3 align-items-center" key={idx}>
                        <div className="col-12 col-md-4 text-muted small fw-semibold text-start text-md-end pr-md-4 mb-1 mb-md-0">
                          {item.label}:
                        </div>
                        <div className="col-12 col-md-8 fw-bold text-dark text-uppercase bg-light rounded px-3 py-2 border border-light-subtle text-break">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Account Information Tab */}
                {activeTab === "ACCOUNT_INFORMATION" && (
                  <div className="px-2 px-md-3">
                    {[
                      {
                        label: "Account Number",
                        value: mockPatientProfile.accountInformation.accountNumber,
                      },
                      {
                        label: "Type of Account",
                        value: mockPatientProfile.accountInformation.typeOfAccount,
                      },
                      {
                        label: "Type of Service",
                        value: mockPatientProfile.accountInformation.typeOfService,
                      },
                      {
                        label: "PhilHealth Category",
                        value: mockPatientProfile.accountInformation.philHealthCategory,
                      },
                      {
                        label: "PhilHealth Requirement",
                        value: mockPatientProfile.accountInformation.philHealthRequirement,
                      },
                      {
                        label: "Type of Beneficiary",
                        value: mockPatientProfile.accountInformation.typeOfBeneficiary,
                      },
                      {
                        label: "FSOA Actual Total",
                        value: mockPatientProfile.accountInformation.fsoaActualTotal,
                      },
                      {
                        label: "Total Balance",
                        value: mockPatientProfile.accountInformation.totalBalance,
                      },
                      {
                        label: "Last Update",
                        value: mockPatientProfile.accountInformation.lastUpdate,
                      },
                      {
                        label: "Bill Status",
                        value: mockPatientProfile.accountInformation.billStatus,
                      },
                    ].map((item, idx) => (
                      <div className="row mb-3 align-items-center" key={idx}>
                        <div className="col-12 col-md-4 text-muted small fw-semibold text-start text-md-end pr-md-4 mb-1 mb-md-0">
                          {item.label}:
                        </div>
                        <div className="col-12 col-md-8 fw-bold text-dark text-uppercase bg-light rounded px-3 py-2 border border-light-subtle text-break">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Ward Assignment Tab (UPDATED) */}
                {activeTab === "WARD_ASSIGNMENT" && (
                  <div className="px-2 px-md-3">
                    <div className="border rounded-0 flex-grow-1 bg-white table-responsive">
                      <table className="table table-hover align-middle mb-0" style={{ tableLayout: "auto" }}>
                        <thead className="table-light">
                          <tr>
                            <th className="fw-semibold text-secondary py-3 ps-3 border-bottom text-nowrap">Ward Assignment</th>
                            <th className="fw-semibold text-secondary py-3 border-bottom text-nowrap">From</th>
                            <th className="fw-semibold text-secondary py-3 border-bottom text-nowrap">To</th>
                            <th className="fw-semibold text-secondary py-3 border-bottom text-nowrap">Length of Stay</th>
                            <th className="fw-semibold text-secondary py-3 pe-3 border-bottom text-nowrap">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockPatientProfile.wardAssignments.map((ward, idx) => (
                            <tr key={idx}>
                              <td className="ps-3 py-3 text-dark border-bottom-0 fw-bold">{ward.ward}</td>
                              <td className="py-3 text-secondary border-bottom-0">{ward.from}</td>
                              <td className="py-3 text-secondary border-bottom-0">{ward.to}</td>
                              <td className="py-3 text-secondary border-bottom-0">{ward.lengthOfStay}</td>
                              <td className="pe-3 py-3 text-dark border-bottom-0">{ward.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
    </>
  );
};

export default PreBill;