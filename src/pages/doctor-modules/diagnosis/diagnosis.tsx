// import React, { useEffect, useMemo, useState } from "react";
// import DoctorSidebar from "@/components/custom-sidebar/doctorSidebar";
// import DeleteConfirmationModal from "@/components/delete-confirmation-modal/DeleteConfirmationModal";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./diagnosis.css";

// // --- Types ---
// interface DiagnosisRecord {
//   id: string;
//   dateTime: string;
//   typeOfDiag: string;
//   physician: string;
//   typeOfPhysician: string;
//   diagnosisText: string;
//   icdCode: string;
//   isPrimary: string;
// }

// // --- Mock Data ---
// const MOCK_PHYSICIANS = [
//   "-- --. -",
//   "Abagatnan Alodie Joy. -",
//   "Abitria Jowanna. A",
//   "Aboga Louise.",
//   "Acosta John Patrick. L",
// ];

// const DIAGNOSIS_TYPES = ["Admitting", "Final"];
// const PHYSICIAN_TYPES = ["", "Attending Physician"];
// const YES_NO = ["Yes", "No"];

// // --- Helpers ---
// const getCurrentDateTimeLocal = () => {
//   const now = new Date();
//   now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
//   return now.toISOString().slice(0, 16);
// };

// const DiagnosisModule = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // --- Mock Patient ---
//   const [mockPatientProfile] = useState({
//     hospitalNumber: "000000000777288",
//     lastName: "DO",
//     firstName: "REA",
//     middleName: "MON",
//     address: "111 Estanza, Legazpi City, Albay",
//   });

//   // --- States ---
//   const [records, setRecords] = useState<DiagnosisRecord[]>([]);
//   const [selectedRecordId, setSelectedRecordId] = useState<string | null>(
//     null
//   );

//   const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>(
//     {}
//   );

//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   const [showDeleteModal, setShowDeleteModal] = useState(false);

//   // --- Responsive State ---
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 992);
//     };

//     handleResize();

//     window.addEventListener("resize", handleResize);

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // --- Form ---
//   const [formData, setFormData] = useState({
//     dateTime: getCurrentDateTimeLocal(),
//     typeOfDiag: "Admitting",
//     physician: MOCK_PHYSICIANS[0],
//     typeOfPhysician: "",
//     diagnosisText: "",
//     icdCode: "",
//     isPrimary: "No",
//   });

//   // --- Pagination ---
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   useEffect(() => {
//     if (location.state?.selectedPatientId) {
//       setTimeout(() => {}, 1000);
//     }
//   }, [location.state]);

//   const isRowSelected = selectedRecordId !== null;
//   const hasRecords = records.length > 0;

//   const isFormValid = useMemo(() => {
//     return formData.diagnosisText.trim().length > 0;
//   }, [formData]);

//   const totalPages = Math.max(1, Math.ceil(records.length / pageSize));

//   const paginatedRecords = records.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   // --- Handlers ---
//   const resetForm = () => {
//     setFormData({
//       dateTime: getCurrentDateTimeLocal(),
//       typeOfDiag: "Admitting",
//       physician: MOCK_PHYSICIANS[0],
//       typeOfPhysician: "",
//       diagnosisText: "",
//       icdCode: "",
//       isPrimary: "No",
//     });
//   };

//   const handleAdd = () => {
//     resetForm();
//     setIsEditing(false);
//     setShowModal(true);
//   };

//   const handleEdit = () => {
//     if (!selectedRecordId) return;

//     const selected = records.find((r) => r.id === selectedRecordId);

//     if (!selected) return;

//     setFormData({
//       dateTime: selected.dateTime,
//       typeOfDiag: selected.typeOfDiag,
//       physician: selected.physician,
//       typeOfPhysician: selected.typeOfPhysician,
//       diagnosisText: selected.diagnosisText,
//       icdCode: selected.icdCode,
//       isPrimary: selected.isPrimary,
//     });

//     setIsEditing(true);
//     setShowModal(true);
//   };

//   const handleDeleteClick = () => {
//     if (!selectedRecordId) return;

//     setShowDeleteModal(true);
//   };

//   const confirmDelete = () => {
//     if (!selectedRecordId) return;

//     setRecords((prev) =>
//       prev.filter((record) => record.id !== selectedRecordId)
//     );

//     setSelectedRecordId(null);
//     setShowDeleteModal(false);
//   };

//   const saveRecord = () => {
//     if (!isFormValid) return;

//     if (isEditing && selectedRecordId) {
//       setRecords((prev) =>
//         prev.map((record) =>
//           record.id === selectedRecordId
//             ? { ...record, ...formData }
//             : record
//         )
//       );
//     } else {
//       const newRecord: DiagnosisRecord = {
//         id: Date.now().toString(),
//         ...formData,
//       };

//       setRecords((prev) => [newRecord, ...prev]);
//     }

//     setShowModal(false);
//   };

//   const toggleRowExpand = (
//     e: React.MouseEvent<HTMLButtonElement>,
//     id: string
//   ) => {
//     e.stopPropagation();

//     setExpandedRows((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   const handleTypeChange = (
//     e: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     const val = e.target.value;

//     setFormData((prev) => {
//       const updated = {
//         ...prev,
//         typeOfDiag: val,
//       };

//       if (val === "Final") {
//         updated.typeOfPhysician = "Attending Physician";
//         updated.physician = "-- --. -";
//       }

//       return updated;
//     });
//   };

//   const currentPhysicianTypes =
//     formData.typeOfDiag === "Final"
//       ? ["Attending Physician"]
//       : PHYSICIAN_TYPES;

//   return (
//     <>
//       <div
//         className="content doctor-content bg-light mt-n4"
//         style={{ minHeight: "100vh" }}
//       >
//         <div className="container-fluid px-3 px-lg-5 pt-0">
//          <div className="doctor-dashboard-layout">
//   <DoctorSidebar />

//   <div className="doctor-dashboard-main">
//               <div
//                 className="card border-0 shadow-sm p-3 p-md-4 mb-4 flex-grow-1"
//                 style={{
//                   borderRadius: "16px",
//                   borderTop: "4px solid #0f763f",
//                   background: "#ffffff",
//                 }}
//               >
              
               
// {/* Header - RESPONSIVE PROFILE */}
// <div
//   className="
//     d-flex
//     flex-column
//     flex-md-row
//     align-items-center
//     align-items-md-start
//     gap-3
//     gap-md-4
//     mb-4
//     pb-4
//     border-bottom
//     text-center
//     text-md-start
//   "
// >

//   {/* Avatar */}
//   <div
//     className="
//       rounded-circle
//       d-flex
//       align-items-center
//       justify-content-center
//       bg-light
//       shadow-sm
//       flex-shrink-0
//       mx-auto
//       mx-md-0
//     "
//     style={{
//       width: "90px",
//       height: "90px",
//       border: "2px solid var(--primary, #0f763f)",
//     }}
//   >
//     <i
//       className="isax isax-user"
//       style={{
//         color: "var(--primary, #0f763f)",
//         fontSize: "42px",
//       }}
//     />
//   </div>

//   {/* Patient Info */}
//   <div
//     className="
//       d-flex
//       flex-column
//       align-items-center
//       align-items-md-start
//     "
//   >

//     {/* ID Badge */}
//     <div className="patient-badge bg-light text-secondary border mb-2 px-2 py-1 d-inline-flex align-items-center">
//       ID: {mockPatientProfile.hospitalNumber}
//     </div>

//     {/* Name */}
//     <h3 className="fw-bold mb-1 text-dark">
//       {mockPatientProfile.lastName},{" "}
//       {mockPatientProfile.firstName}{" "}
//       {mockPatientProfile.middleName}
//     </h3>

//     {/* Address */}
//     <div
//       className="
//         text-muted
//         small
//         d-flex
//         align-items-center
//         justify-content-center
//         justify-content-md-start
//         gap-2
//       "
//     >
//       <i className="isax isax-location text-danger" />
//       {mockPatientProfile.address}
//     </div>

//   </div>
// </div>

// {/* close button */}
// <button
//   type="button"
//   onClick={(e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     navigate("/doctor-dashboard", { replace: true });
//   }}
//   className="card-close-btn d-flex align-items-center justify-content-center"
// >
//   <span className="desktop-close text-white fw-bold">×</span>

//   <span className="mobile-back">
//   <i className="isax isax-arrow-left"></i>
// </span>
// </button>


// {/* close button */}
// <button
//   type="button"
//   onClick={(e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     navigate("/doctor-dashboard", { replace: true });
//   }}
//   className="card-close-btn d-flex align-items-center justify-content-center"
// >
//   <span className="desktop-close text-white fw-bold">×</span>

//   <span className="mobile-back">
//   <i className="isax isax-arrow-left"></i>
// </span>
// </button>

//                 {/* Toolbar */}
//                 <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
//                  <h5 className="fw-bold text-uppercase mb-0 flex-grow-1 text-center text-md-start">
//   Diagnosis
// </h5>

//                   {(!isMobile || hasRecords) && (
//                     <div className="d-flex gap-2 toolbar-mobile-stack">
//                       {/* Add */}
//                       <button
//   type="button"
//   onClick={handleAdd}
//   className="btn btn-sm border shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap fw-bold text-white"
//   style={{
//     borderRadius: "4px",
//     cursor: "pointer",
//     backgroundColor: "#0f763f",
//     borderColor: "#0f763f",
//   }}
// >
//   <i className="isax isax-add-square"></i>
//   <span>Add Diagnosis</span>
// </button>

//                       {/* Edit */}
//                       <button
//   type="button"
//   disabled={!isRowSelected}
//   onClick={handleEdit}
//   className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap fw-bold ${
//     isRowSelected
//       ? "bg-white text-dark text-hover-primary"
//       : "bg-light text-muted opacity-50"
//   }`}
//   style={{
//     borderRadius: "4px",
//     cursor: isRowSelected ? "pointer" : "not-allowed",
//   }}
// >
//   <i className="isax isax-edit"></i>
//   <span>Edit</span>
// </button>

//                       {/* Delete */}
//                       <button
//   type="button"
//   disabled={!isRowSelected}
//   onClick={handleDeleteClick}
//   className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap fw-bold ${
//     isRowSelected
//       ? "bg-white text-danger"
//       : "bg-light text-muted opacity-50"
//   }`}
//   style={{
//     borderRadius: "4px",
//     cursor: isRowSelected ? "pointer" : "not-allowed",
//   }}
// >
//   <i className="isax isax-trash"></i>
//   <span>Delete</span>
// </button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Table */}
//                 {/* Main Content */}
// <div
//   className="border rounded bg-white flex-grow-1 d-flex flex-column"
//   style={{
//     minHeight: "460px",
//     border: "1px solid #e5e7eb",
//   }}
// >
//  {!hasRecords ? (
//   <div className="d-flex flex-column align-items-center justify-content-center text-center text-muted py-5 custom-empty-state physician-mobile-empty h-100">

//     {/* DESKTOP EMPTY ICON */}
//     <i
//       className="isax isax-document-text fs-1 mb-3 opacity-50 d-none d-lg-block"
//       style={{
//         fontSize: "3rem",
//         color: "var(--primary, #0f763f)",
//       }}
//     ></i>

//     {/* MOBILE ADD BUTTON */}
//     <button
//   type="button"
//   onClick={handleAdd}
//   className="empty-state-fab d-lg-none"
// >
//   <i className="isax isax-add"></i>
// </button>

//     {/* MOBILE LABEL */}
//     <span
//       className="mt-2 fw-semibold text-muted d-lg-none"
//       style={{ fontSize: "14px" }}
//     >
      
//     </span>

//     {/* EMPTY TEXT */}
//     <p className="mb-0 fw-bold text-dark">
//       No diagnosis records found
//     </p>
//   </div>
// ) : (
//     <>
//       <div className="table-responsive flex-grow-1">
//         <table className="table table-hover align-middle mb-0">
//           <thead className="bg-light">
//             <tr>
//               <th className="px-4 py-3">Type</th>
//               <th className="px-4 py-3">Diagnosis</th>

//               <th className="px-4 py-3 d-none d-lg-table-cell">
//                 ICD
//               </th>

//               <th className="px-4 py-3 d-none d-lg-table-cell">
//                 Physician
//               </th>

//               <th className="px-4 py-3 text-center d-lg-none">
//                 Actions
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {paginatedRecords.map((record) => (
//               <React.Fragment key={record.id}>
//                 <tr
//                   onClick={() =>
//                     setSelectedRecordId(record.id)
//                   }
//                   className={
//                     selectedRecordId === record.id
//                       ? "selected-row"
//                       : ""
//                   }
//                   style={{ cursor: "pointer" }}
//                 >
//                   <td className="px-4 py-3">
//                     {record.typeOfDiag}
//                   </td>

//                   <td className="px-4 py-3 text-break">
//                     {record.diagnosisText}
//                   </td>

//                   <td className="px-4 py-3 d-none d-lg-table-cell">
//                     {record.icdCode || "—"}
//                   </td>

//                   <td className="px-4 py-3 d-none d-lg-table-cell">
//                     {record.physician}
//                   </td>

//                   <td className="text-center d-lg-none">
//                     <button
//                       className="btn btn-sm btn-outline-secondary"
//                       onClick={(e) =>
//                         toggleRowExpand(e, record.id)
//                       }
//                     >
//                       {expandedRows[record.id]
//                         ? "Hide"
//                         : "See More"}
//                     </button>
//                   </td>
//                 </tr>

//                 {expandedRows[record.id] && (
//                   <tr className="d-lg-none bg-light">
//                     <td colSpan={5}>
//                       <div className="p-3">
//                         <div className="mb-2">
//                           <strong>Primary:</strong>{" "}
//                           {record.isPrimary}
//                         </div>

//                         <div className="mb-2">
//                           <strong>ICD:</strong>{" "}
//                           {record.icdCode || "—"}
//                         </div>

//                         <div>
//                           <strong>Physician:</strong>{" "}
//                           {record.physician}
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-center p-3 border-top bg-light gap-3 mt-auto">
//         <div className="d-flex align-items-center gap-2">
//           <span className="small text-muted">Show</span>

//           <select
//             className="form-select form-select-sm"
//             style={{ width: "80px" }}
//             value={pageSize}
//             onChange={(e) => {
//               setPageSize(Number(e.target.value));
//               setCurrentPage(1);
//             }}
//           >
//             <option value={10}>10</option>
//             <option value={25}>25</option>
//             <option value={50}>50</option>
//           </select>

//           <span className="small text-muted">
//             entries
//           </span>
//         </div>

//         <div className="small text-muted">
//           Showing{" "}
//           {(currentPage - 1) * pageSize + 1} to{" "}
//           {Math.min(
//             currentPage * pageSize,
//             records.length
//           )}{" "}
//           of {records.length}
//         </div>

//         <div className="d-flex gap-2">
//           <button
//             className="btn btn-sm btn-outline-secondary"
//             disabled={currentPage === 1}
//             onClick={() =>
//               setCurrentPage((prev) => prev - 1)
//             }
//           >
//             Prev
//           </button>

//           <button
//             className="btn btn-sm btn-outline-secondary"
//             disabled={currentPage === totalPages}
//             onClick={() =>
//               setCurrentPage((prev) => prev + 1)
//             }
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </>
//   )}
// </div>

//                 {/* Footer Count */}
//                 <div className="mt-3 fw-bold text-muted small">
//                   Total Records:{" "}
//                   <span className="text-dark">{records.length}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add/Edit Modal */}
//       {showModal && (
//         <div
//           className="modal fade show d-block"
//           style={{
//             backgroundColor: "rgba(0,0,0,0.5)",
//             zIndex: 1060,
//           }}
//         >
//           <div className="modal-dialog modal-xl modal-dialog-centered">
//             <div className="modal-content border-0 shadow-lg">
//               <div className="modal-header">
//                 <h5 className="modal-title text-white">
//                   {isEditing ? "EDIT" : "ADD"} DIAGNOSIS
//                 </h5>

//                 <button
//                   className="btn-close btn-close-white"
//                   onClick={() => setShowModal(false)}
//                 ></button>
//               </div>

//               <div className="modal-body p-4">
//                 <div className="row g-3">
//                   <div className="col-md-3">
//                     <label className="small fw-bold mb-1">
//                       Date/Time
//                     </label>

//                     <input
//                       type="datetime-local"
//                       className="form-control"
//                       value={formData.dateTime}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           dateTime: e.target.value,
//                         })
//                       }
//                     />
//                   </div>

//                   <div className="col-md-3">
//                     <label className="small fw-bold mb-1">
//                       Type of Diagnosis
//                     </label>

//                     <select
//                       className="form-select"
//                       value={formData.typeOfDiag}
//                       onChange={handleTypeChange}
//                     >
//                       {DIAGNOSIS_TYPES.map((type) => (
//                         <option key={type}>{type}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label className="small fw-bold mb-1">
//                       Physician
//                     </label>

//                     <select
//                       className="form-select"
//                       value={formData.physician}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           physician: e.target.value,
//                         })
//                       }
//                     >
//                       {MOCK_PHYSICIANS.map((physician) => (
//                         <option key={physician}>
//                           {physician}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="col-md-3">
//                     <label className="small fw-bold mb-1">
//                       Type of Physician
//                     </label>

//                     <select
//                       className="form-select"
//                       value={formData.typeOfPhysician}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           typeOfPhysician: e.target.value,
//                         })
//                       }
//                     >
//                       {currentPhysicianTypes.map((type) => (
//                         <option key={type}>{type}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="col-12">
//                     <label className="small fw-bold mb-1">
//                       Diagnosis
//                     </label>

//                     <textarea
//                       rows={6}
//                       className="form-control"
//                       value={formData.diagnosisText}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           diagnosisText: e.target.value,
//                         })
//                       }
//                     />
//                   </div>

//                   <div className="col-md-4">
//                     <label className="small fw-bold mb-1">
//                       ICD Code
//                     </label>

//                     <input
//                       type="text"
//                       className="form-control"
//                       value={formData.icdCode}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           icdCode: e.target.value,
//                         })
//                       }
//                     />
//                   </div>

//                   <div className="col-md-3">
//                     <label className="small fw-bold mb-1">
//                       Primary Diagnosis
//                     </label>

//                     <select
//                       className="form-select"
//                       value={formData.isPrimary}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           isPrimary: e.target.value,
//                         })
//                       }
//                     >
//                       {YES_NO.map((opt) => (
//                         <option key={opt}>{opt}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               <div className="modal-footer bg-light">
//                 <button
//                   className="btn btn-success px-4"
//                   disabled={!isFormValid}
//                   onClick={saveRecord}
//                 >
//                   Save and Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {showDeleteModal && (
//         <DeleteConfirmationModal
//           message="Are you sure you want to delete this record?"
//           onCancel={() => setShowDeleteModal(false)}
//           onConfirm={confirmDelete}
//         />
//       )}
//     </>
//   );
// };

// export default DiagnosisModule;



import React, { useEffect, useMemo, useState } from "react";
import DoctorSidebar from "@/components/custom-sidebar/doctorSidebar";
import DeleteConfirmationModal from "@/components/delete-confirmation-modal/DeleteConfirmationModal";
import { useLocation, useNavigate } from "react-router-dom";
import "./diagnosis.css";

// --- Types ---
interface DiagnosisRecord {
  id: string;
  dateTime: string;
  typeOfDiag: string;
  physician: string;
  typeOfPhysician: string;
  diagnosisText: string;
  icdCode: string;
  isPrimary: string;
}

// --- Mock Data ---
const MOCK_PHYSICIANS = [
  "-- --. -",
  "Abagatnan Alodie Joy. -",
  "Abitria Jowanna. A",
  "Aboga Louise.",
  "Acosta John Patrick. L",
];

const DIAGNOSIS_TYPES = ["Admitting", "Final"];
const PHYSICIAN_TYPES = ["", "Attending Physician"];
const YES_NO = ["Yes", "No"];

// --- Helpers ---
const getCurrentDateTimeLocal = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const DiagnosisModule = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- Mock Patient ---
  const [mockPatientProfile] = useState({
    hospitalNumber: "000000000777288",
    lastName: "DO",
    firstName: "REA",
    middleName: "MON",
    address: "111 Estanza, Legazpi City, Albay",
  });

  // --- States ---
  const [records, setRecords] = useState<DiagnosisRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(
    null
  );

  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>(
    {}
  );

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // --- Responsive State ---
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Form ---
  const [formData, setFormData] = useState({
    dateTime: getCurrentDateTimeLocal(),
    typeOfDiag: "Admitting",
    physician: MOCK_PHYSICIANS[0],
    typeOfPhysician: "",
    diagnosisText: "",
    icdCode: "",
    isPrimary: "No",
  });

  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (location.state?.selectedPatientId) {
      setTimeout(() => {}, 1000);
    }
  }, [location.state]);

  const isRowSelected = selectedRecordId !== null;
  const hasRecords = records.length > 0;

  const isFormValid = useMemo(() => {
    return formData.diagnosisText.trim().length > 0;
  }, [formData]);

  const totalPages = Math.max(1, Math.ceil(records.length / pageSize));

  const paginatedRecords = records.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // --- Handlers ---
  const resetForm = () => {
    setFormData({
      dateTime: getCurrentDateTimeLocal(),
      typeOfDiag: "Admitting",
      physician: MOCK_PHYSICIANS[0],
      typeOfPhysician: "",
      diagnosisText: "",
      icdCode: "",
      isPrimary: "No",
    });
  };

  const handleAdd = () => {
    resetForm();
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = () => {
    if (!selectedRecordId) return;

    const selected = records.find((r) => r.id === selectedRecordId);

    if (!selected) return;

    setFormData({
      dateTime: selected.dateTime,
      typeOfDiag: selected.typeOfDiag,
      physician: selected.physician,
      typeOfPhysician: selected.typeOfPhysician,
      diagnosisText: selected.diagnosisText,
      icdCode: selected.icdCode,
      isPrimary: selected.isPrimary,
    });

    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteClick = () => {
    if (!selectedRecordId) return;

    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedRecordId) return;

    setRecords((prev) =>
      prev.filter((record) => record.id !== selectedRecordId)
    );

    setSelectedRecordId(null);
    setShowDeleteModal(false);
  };

  const saveRecord = () => {
    if (!isFormValid) return;

    if (isEditing && selectedRecordId) {
      setRecords((prev) =>
        prev.map((record) =>
          record.id === selectedRecordId
            ? { ...record, ...formData }
            : record
        )
      );
    } else {
      const newRecord: DiagnosisRecord = {
        id: Date.now().toString(),
        ...formData,
      };

      setRecords((prev) => [newRecord, ...prev]);
    }

    setShowModal(false);
  };

  const toggleRowExpand = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.stopPropagation();

    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const val = e.target.value;

    setFormData((prev) => {
      const updated = {
        ...prev,
        typeOfDiag: val,
      };

      if (val === "Final") {
        updated.typeOfPhysician = "Attending Physician";
        updated.physician = "-- --. -";
      }

      return updated;
    });
  };

  const currentPhysicianTypes =
    formData.typeOfDiag === "Final"
      ? ["Attending Physician"]
      : PHYSICIAN_TYPES;

  return (
    <>
      <div
        className="content doctor-content bg-light mt-n4"
        style={{ minHeight: "100vh" }}
      >
        <div className="container-fluid px-3 px-lg-5 pt-0">
         <div className="doctor-dashboard-layout">
  <DoctorSidebar />

  <div className="doctor-dashboard-main">
              <div
                className="card border-0 shadow-sm p-3 p-md-4 mb-4 flex-grow-1"
                style={{
                  borderRadius: "16px",
                  borderTop: "4px solid #0f763f",
                  background: "#ffffff",
                }}
              >

{/* close button */}
<button
  type="button"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/doctor-dashboard", { replace: true });
  }}
  className="card-close-btn d-flex align-items-center justify-content-center"
>
  <span className="desktop-close text-white fw-bold">×</span>

  <span className="mobile-back">
  <i className="isax isax-arrow-left"></i>
</span>
</button>

{/* ── HEADER — format updated to match all other modules ── */}
<div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3 gap-md-4 mb-4 pb-4 border-bottom text-center text-md-start">
  <div
    className="rounded-circle d-flex align-items-center justify-content-center bg-light shadow-sm flex-shrink-0"
    style={{ width: "90px", height: "90px", border: "2px solid var(--primary, #0f763f)" }}
  >
    <i className="isax isax-user fs-1 text-primary" style={{ color: "var(--primary, #0f763f)" }} />
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

                {/* Toolbar */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
                 <h5 className="fw-bold text-uppercase mb-0 flex-grow-1 text-center text-md-start">
  Diagnosis
</h5>

                  {(!isMobile || hasRecords) && (
                    <div className="d-flex gap-2 toolbar-mobile-stack">
                      {/* Add */}
                      <button
  type="button"
  onClick={handleAdd}
  className="btn btn-sm border shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap fw-bold text-white"
  style={{
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#0f763f",
    borderColor: "#0f763f",
  }}
>
  <i className="isax isax-add-square"></i>
  <span>Add Diagnosis</span>
</button>

                      {/* Edit */}
                      <button
  type="button"
  disabled={!isRowSelected}
  onClick={handleEdit}
  className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap fw-bold ${
    isRowSelected
      ? "bg-white text-dark text-hover-primary"
      : "bg-light text-muted opacity-50"
  }`}
  style={{
    borderRadius: "4px",
    cursor: isRowSelected ? "pointer" : "not-allowed",
  }}
>
  <i className="isax isax-edit"></i>
  <span>Edit</span>
</button>

                      {/* Delete */}
                      <button
  type="button"
  disabled={!isRowSelected}
  onClick={handleDeleteClick}
  className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap fw-bold ${
    isRowSelected
      ? "bg-white text-danger"
      : "bg-light text-muted opacity-50"
  }`}
  style={{
    borderRadius: "4px",
    cursor: isRowSelected ? "pointer" : "not-allowed",
  }}
>
  <i className="isax isax-trash"></i>
  <span>Delete</span>
</button>
                    </div>
                  )}
                </div>

                {/* Table */}
                {/* Main Content */}
<div
  className="border rounded bg-white flex-grow-1 d-flex flex-column"
  style={{
    minHeight: "460px",
    border: "1px solid #e5e7eb",
  }}
>
 {!hasRecords ? (
  <div className="d-flex flex-column align-items-center justify-content-center text-center text-muted py-5 custom-empty-state physician-mobile-empty h-100">

    {/* DESKTOP EMPTY ICON */}
    <i
      className="isax isax-document-text fs-1 mb-3 opacity-50 d-none d-lg-block"
      style={{
        fontSize: "3rem",
        color: "var(--primary, #0f763f)",
      }}
    ></i>

    {/* MOBILE ADD BUTTON */}
    <button
  type="button"
  onClick={handleAdd}
  className="empty-state-fab d-lg-none"
>
  <i className="isax isax-add"></i>
</button>

    {/* MOBILE LABEL */}
    <span
      className="mt-2 fw-semibold text-muted d-lg-none"
      style={{ fontSize: "14px" }}
    >
      
    </span>

    {/* EMPTY TEXT */}
    <p className="mb-0 fw-bold text-dark">
      No diagnosis records found
    </p>
  </div>
) : (
    <>
      <div className="table-responsive flex-grow-1">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-light">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Diagnosis</th>

              <th className="px-4 py-3 d-none d-lg-table-cell">
                ICD
              </th>

              <th className="px-4 py-3 d-none d-lg-table-cell">
                Physician
              </th>

              <th className="px-4 py-3 text-center d-lg-none">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedRecords.map((record) => (
              <React.Fragment key={record.id}>
                <tr
                  onClick={() =>
                    setSelectedRecordId(record.id)
                  }
                  className={
                    selectedRecordId === record.id
                      ? "selected-row"
                      : ""
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td className="px-4 py-3">
                    {record.typeOfDiag}
                  </td>

                  <td className="px-4 py-3 text-break">
                    {record.diagnosisText}
                  </td>

                  <td className="px-4 py-3 d-none d-lg-table-cell">
                    {record.icdCode || "—"}
                  </td>

                  <td className="px-4 py-3 d-none d-lg-table-cell">
                    {record.physician}
                  </td>

                  <td className="text-center d-lg-none">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={(e) =>
                        toggleRowExpand(e, record.id)
                      }
                    >
                      {expandedRows[record.id]
                        ? "Hide"
                        : "See More"}
                    </button>
                  </td>
                </tr>

                {expandedRows[record.id] && (
                  <tr className="d-lg-none bg-light">
                    <td colSpan={5}>
                      <div className="p-3">
                        <div className="mb-2">
                          <strong>Primary:</strong>{" "}
                          {record.isPrimary}
                        </div>

                        <div className="mb-2">
                          <strong>ICD:</strong>{" "}
                          {record.icdCode || "—"}
                        </div>

                        <div>
                          <strong>Physician:</strong>{" "}
                          {record.physician}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center p-3 border-top bg-light gap-3 mt-auto">
        <div className="d-flex align-items-center gap-2">
          <span className="small text-muted">Show</span>

          <select
            className="form-select form-select-sm"
            style={{ width: "80px" }}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>

          <span className="small text-muted">
            entries
          </span>
        </div>

        <div className="small text-muted">
          Showing{" "}
          {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(
            currentPage * pageSize,
            records.length
          )}{" "}
          of {records.length}
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((prev) => prev - 1)
            }
          >
            Prev
          </button>

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => prev + 1)
            }
          >
            Next
          </button>
        </div>
      </div>
    </>
  )}
</div>

                {/* Footer Count */}
                <div className="mt-3 fw-bold text-muted small">
                  Total Records:{" "}
                  <span className="text-dark">{records.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1060,
          }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title text-white">
                  {isEditing ? "EDIT" : "ADD"} DIAGNOSIS
                </h5>

                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="small fw-bold mb-1">
                      Date/Time
                    </label>

                    <input
                      type="datetime-local"
                      className="form-control"
                      value={formData.dateTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateTime: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="small fw-bold mb-1">
                      Type of Diagnosis
                    </label>

                    <select
                      className="form-select"
                      value={formData.typeOfDiag}
                      onChange={handleTypeChange}
                    >
                      {DIAGNOSIS_TYPES.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="small fw-bold mb-1">
                      Physician
                    </label>

                    <select
                      className="form-select"
                      value={formData.physician}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          physician: e.target.value,
                        })
                      }
                    >
                      {MOCK_PHYSICIANS.map((physician) => (
                        <option key={physician}>
                          {physician}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="small fw-bold mb-1">
                      Type of Physician
                    </label>

                    <select
                      className="form-select"
                      value={formData.typeOfPhysician}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          typeOfPhysician: e.target.value,
                        })
                      }
                    >
                      {currentPhysicianTypes.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="small fw-bold mb-1">
                      Diagnosis
                    </label>

                    <textarea
                      rows={6}
                      className="form-control"
                      value={formData.diagnosisText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          diagnosisText: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="small fw-bold mb-1">
                      ICD Code
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={formData.icdCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          icdCode: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="small fw-bold mb-1">
                      Primary Diagnosis
                    </label>

                    <select
                      className="form-select"
                      value={formData.isPrimary}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isPrimary: e.target.value,
                        })
                      }
                    >
                      {YES_NO.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-light">
                <button
                  className="btn btn-success px-4"
                  disabled={!isFormValid}
                  onClick={saveRecord}
                >
                  Save and Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          message="Are you sure you want to delete this record?"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
};

export default DiagnosisModule;