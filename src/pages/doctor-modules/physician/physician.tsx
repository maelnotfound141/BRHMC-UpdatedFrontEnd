// import DoctorSidebar from "@/components/custom-sidebar/doctorSidebar";
// import { useEffect, useRef, useState } from "react";

// interface Physician {
//   id: number;
//   type: string;
//   name: string;
//   accessStatus: string;
// }

// const PhysicianModule = () => {
//   const [open, setOpen] = useState(false);

//   // modal states
//   const [showAddModal, setShowAddModal] =
//     useState(false);
//   const [isEditing, setIsEditing] =
//     useState(false);
//   const [selectedRecordId, setSelectedRecordId] =
//     useState<number | null>(null);
//   const [
//     showDeleteConfirmModal,
//     setShowDeleteConfirmModal,
//   ] = useState(false);

//   // form states
//   const [physicianType, setPhysicianType] =
//     useState("");
//   const [physicianName, setPhysicianName] =
//     useState("LIQUE R, MD");
//   const [accessStatus, setAccessStatus] =
//     useState("Active");

//   // patient profile
//   const [mockPatientProfile] = useState({
//     hospitalNumber: "000000000777288",
//     lastName: "DO",
//     firstName: "REA",
//     middleName: "MON",
//     address: "111 Estanza, Legazpi City, Albay",
//   });

//   // physician list
//   const [physicians, setPhysicians] =
//     useState<Physician[]>([]);

//   const wrapperRef =
//     useRef<HTMLDivElement | null>(null);

//   const toggleRef =
//     useRef<HTMLAnchorElement | null>(null);

//   useEffect(() => {
//     const handleOutsideClick = (
//       event: MouseEvent
//     ) => {
//       if (
//         wrapperRef.current &&
//         !wrapperRef.current.contains(
//           event.target as Node
//         ) &&
//         toggleRef.current &&
//         !toggleRef.current.contains(
//           event.target as Node
//         )
//       ) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener(
//       "click",
//       handleOutsideClick
//     );

//     return () =>
//       document.removeEventListener(
//         "click",
//         handleOutsideClick
//       );
//   }, []);

//   // ESC close modal
//   useEffect(() => {
//     const handleKeyDown = (
//       e: KeyboardEvent
//     ) => {
//       if (e.key === "Escape") {
//         setShowAddModal(false);
//         setShowDeleteConfirmModal(false);
//       }
//     };

//     window.addEventListener(
//       "keydown",
//       handleKeyDown
//     );

//     return () =>
//       window.removeEventListener(
//         "keydown",
//         handleKeyDown
//       );
//   }, []);

//   const resetForm = () => {
//     setIsEditing(false);
//     setPhysicianType("");
//     setPhysicianName("LIQUE R, MD");
//     setAccessStatus("Active");
//   };

//   // ADD BUTTON LOGIC
//   const handleAdd = () => {
//     resetForm();
//     setIsEditing(false);
//     setSelectedRecordId(null);
//     setShowAddModal(true);
//   };

//   const openEditModalForRecord = (
//     record: Physician
//   ) => {
//     setIsEditing(true);
//     setPhysicianType(record.type);
//     setPhysicianName(record.name);
//     setAccessStatus(record.accessStatus);
//     setSelectedRecordId(record.id);
//     setShowAddModal(true);
//   };

//   const handleOpenEdit = () => {
//     if (selectedRecordId === null) return;

//     const recordToEdit = physicians.find(
//       (r) => r.id === selectedRecordId
//     );

//     if (recordToEdit) {
//       openEditModalForRecord(recordToEdit);
//     }
//   };

//   const handleDeleteClick = () => {
//     if (selectedRecordId === null) return;

//     setShowDeleteConfirmModal(true);
//   };

//   const confirmDelete = () => {
//     if (selectedRecordId === null) return;

//     setPhysicians((prev) =>
//       prev.filter(
//         (r) => r.id !== selectedRecordId
//       )
//     );

//     setSelectedRecordId(null);
//     setShowDeleteConfirmModal(false);
//   };

//   const handleSave = () => {
//     if (!physicianType || !physicianName)
//       return;

//     const newRecord: Physician = {
//       id:
//         isEditing &&
//         selectedRecordId !== null
//           ? selectedRecordId
//           : Date.now(),
//       type: physicianType,
//       name: physicianName,
//       accessStatus,
//     };

//     if (
//       isEditing &&
//       selectedRecordId !== null
//     ) {
//       setPhysicians((prevRecords) =>
//         prevRecords.map((r) =>
//           r.id === selectedRecordId
//             ? newRecord
//             : r
//         )
//       );
//     } else {
//       setPhysicians((prevRecords) => [
//         ...prevRecords,
//         newRecord,
//       ]);
//     }

//     resetForm();
//     setShowAddModal(false);
//   };

//   const isSaveDisabled =
//     !physicianType || !physicianName;

//   const hasRecords =
//     physicians.length > 0;

//   return (
//     <>
//       <style>
//         {`
//           .selected-row td {
//             background-color: rgba(15, 118, 63, 0.15) !important;
//           }

//           .text-hover-primary:hover {
//             color: var(--primary, #0f763f) !important;
//           }

//           .action-btn {
//             min-width: 36px;
//           }

//           .custom-empty-state {
//             min-height: 250px;
//           }
//         `}
//       </style>

//       <div
//         className="content doctor-content bg-light mt-n4 d-flex flex-column"
//         style={{ minHeight: "100vh" }}
//       >
//         <div className="container-fluid px-3 px-lg-5 pt-0 flex-grow-1 d-flex flex-column">
//          <div className="doctor-dashboard-layout">
//                   <DoctorSidebar />

//                  <div className="doctor-dashboard-main">
//               <div
//                 className="card border-0 shadow-sm p-3 p-md-4 mb-4 d-flex flex-column h-100"
//                 style={{
//                   borderRadius: "12px",
//                   borderTop:
//                     "4px solid var(--primary, #0f763f)",
//                 }}
//               >
//                 {/* PROFILE HEADER */}
//                 <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3 gap-md-4 mb-4 pb-4 border-bottom text-center text-md-start">
//                   <div
//                     className="rounded-circle d-flex align-items-center justify-content-center bg-light shadow-sm flex-shrink-0"
//                     style={{
//                       width: "90px",
//                       height: "90px",
//                       border:
//                         "2px solid var(--primary, #0f763f)",
//                     }}
//                   >
//                     <i
//                       className="isax isax-user fs-1 text-primary"
//                       style={{
//                         color:
//                           "var(--primary, #0f763f)",
//                       }}
//                     />
//                   </div>

//                   <div>
//                     <div className="badge bg-light text-secondary border mb-2 px-2 py-1">
//                       ID:{" "}
//                       {
//                         mockPatientProfile.hospitalNumber
//                       }
//                     </div>

//                     <h3 className="fw-bold mb-1 text-dark fs-3 fs-md-2">
//                       {
//                         mockPatientProfile.lastName
//                       }
//                       ,{" "}
//                       {
//                         mockPatientProfile.firstName
//                       }{" "}
//                       {
//                         mockPatientProfile.middleName
//                       }
//                     </h3>

//                     <div className="text-muted small d-flex align-items-center justify-content-center justify-content-md-start gap-2">
//                       <i className="isax isax-location text-danger" />
//                       {
//                         mockPatientProfile.address
//                       }
//                     </div>
//                   </div>
//                 </div>

//                 {/* PHYSICIAN SECTION */}
//                 <div className="d-flex flex-column flex-grow-1 mb-4">
//                   {/* HEADER */}
//                   <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-3 gap-3">
//                     <h5 className="fw-bold text-dark mb-0 text-uppercase">
//                       Physician
//                     </h5>

//                     {/* ACTION BUTTONS */}
//                     <div
//                       className="d-flex flex-wrap justify-content-end rounded-1"
//                       role="group"
//                       style={{ gap: "4px" }}
//                     >
//                       {/* DESKTOP ADD BUTTON */}
//                       <button
//                         onClick={handleAdd}
//                         className="btn btn-sm mt-0 d-none d-lg-flex align-items-center gap-2 px-3 py-2 text-white fw-bold"
//                         style={{
//                           borderRadius: "3px",
//                           backgroundColor:
//                             "var(--primary, #0f763f)",
//                           border:
//                             "1px solid var(--primary, #0f763f)",
//                         }}
//                       >
//                         <i className="isax isax-add-square"></i>
//                         Add
//                       </button>

//                       {/* MOBILE ADD BUTTON ONLY WHEN RECORDS EXIST */}
//                       {hasRecords && (
//                         <button
//                           onClick={handleAdd}
//                           className="btn btn-sm mt-0 d-flex d-lg-none align-items-center gap-2 px-3 py-2 text-white fw-bold"
//                           style={{
//                             borderRadius: "3px",
//                             backgroundColor:
//                               "var(--primary, #0f763f)",
//                             border:
//                               "1px solid var(--primary, #0f763f)",
//                           }}
//                         >
//                           <i className="isax isax-add-square"></i>
//                           Add
//                         </button>
//                       )}

//                       {/* EDIT BUTTON */}
//                       <button
//                         onClick={handleOpenEdit}
//                         disabled={
//                           selectedRecordId === null
//                         }
//                         className={`btn btn-sm border-secondary-subtle d-flex align-items-center justify-content-center gap-2 px-3 py-2 ${
//                           selectedRecordId === null
//                             ? "bg-light text-muted opacity-50"
//                             : "bg-white text-dark fw-bold"
//                         }`}
//                         style={{
//                           borderRadius: "3px",
//                           cursor:
//                             selectedRecordId === null
//                               ? "not-allowed"
//                               : "pointer",
//                         }}
//                       >
//                         <i className="isax isax-edit"></i>
//                         Edit
//                       </button>

//                       {/* DELETE BUTTON */}
//                       <button
//                         onClick={
//                           handleDeleteClick
//                         }
//                         disabled={
//                           selectedRecordId === null
//                         }
//                         className={`btn btn-sm border-secondary-subtle d-flex align-items-center justify-content-center gap-2 px-3 py-2 ${
//                           selectedRecordId === null
//                             ? "bg-light text-muted opacity-50"
//                             : "bg-white text-danger fw-bold"
//                         }`}
//                         style={{
//                           borderRadius: "3px",
//                           cursor:
//                             selectedRecordId === null
//                               ? "not-allowed"
//                               : "pointer",
//                         }}
//                       >
//                         <i className="isax isax-trash"></i>
//                         Del
//                       </button>
//                     </div>
//                   </div>

//                   {/* TABLE */}
//                   <div className="border rounded-0 flex-grow-1 bg-white d-flex flex-column shadow-sm">
//                     <table
//                       className="table table-hover align-middle mb-0"
//                       style={{
//                         tableLayout: "auto",
//                       }}
//                     >
//                       <thead className="table-light">
//                         <tr>
//                           <th className="fw-semibold text-secondary py-3 ps-3 border-bottom text-nowrap">
//                             Type of Physician
//                           </th>

//                           <th className="fw-semibold text-secondary py-3 border-bottom d-none d-md-table-cell">
//                             Name of Physician
//                           </th>

//                           <th className="fw-semibold text-secondary py-3 pe-3 border-bottom text-nowrap">
//                             Access Status
//                           </th>
//                         </tr>
//                       </thead>

//                       <tbody>
//                         {hasRecords ? (
//                           physicians.map(
//                             (record) => (
//                               <tr
//                                 key={record.id}
//                                 onClick={() =>
//                                   setSelectedRecordId(
//                                     record.id
//                                   )
//                                 }
//                                 onDoubleClick={() => {
//                                   setSelectedRecordId(
//                                     record.id
//                                   );

//                                   openEditModalForRecord(
//                                     record
//                                   );
//                                 }}
//                                 className={
//                                   selectedRecordId ===
//                                   record.id
//                                     ? "selected-row"
//                                     : ""
//                                 }
//                                 style={{
//                                   cursor: "pointer",
//                                 }}
//                               >
//                                 <td className="ps-3 py-3 text-dark border-bottom-0">
//                                   {
//                                     record.type
//                                   }
//                                 </td>

//                                 <td className="py-3 text-dark border-bottom-0 d-none d-md-table-cell">
//                                   {
//                                     record.name
//                                   }
//                                 </td>

//                                 <td className="pe-3 py-3 text-dark border-bottom-0">
//                                   {
//                                     record.accessStatus
//                                   }
//                                 </td>
//                               </tr>
//                             )
//                           )
//                         ) : (
//                           <tr>
//   <td
//     colSpan={3}
//     className="border-bottom-0"
//   >
//     <div className="d-flex flex-column align-items-center justify-content-center text-muted py-5 custom-empty-state">
//       <i className="isax isax-document-text fs-1 mb-2 opacity-50"></i>

//       <p className="mb-1 text-center">
//         No physicians added
//         yet.
//       </p>

//       {/* MOBILE EMPTY STATE ADD BUTTON */}
//       <button
//         onClick={
//           handleAdd
//         }
//         className="btn btn-sm mt-3 d-flex d-lg-none align-items-center gap-2 px-3 py-2 text-white fw-bold"
//         style={{
//           borderRadius:
//             "3px",
//           backgroundColor:
//             "var(--primary, #0f763f)",
//           border:
//             "1px solid var(--primary, #0f763f)",
//         }}
//       >
//         <i className="isax isax-add-square"></i>
//         Add
//       </button>
//     </div>
//   </td>
// </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ADD / EDIT MODAL */}
//       {showAddModal && (
//         <div
//           className="modal fade show d-block"
//           tabIndex={-1}
//           style={{
//             backgroundColor:
//               "rgba(0,0,0,0.5)",
//             zIndex: 1050,
//           }}
//         >
//           <div className="modal-dialog modal-dialog-centered px-3">
//             <div
//               className="modal-content border-0 shadow-lg"
//               style={{
//                 borderRadius: "8px",
//                 overflow: "hidden",
//               }}
//             >
//               <div
//                 className="modal-header border-0 py-3 d-flex align-items-center"
//                 style={{
//                   backgroundColor: "#333b45",
//                 }}
//               >
//                 <h3
//                   className="modal-title text-white fw-bold m-0 d-flex align-items-center gap-2"
//                   style={{
//                     fontSize: "1.1rem",
//                     letterSpacing: "0.5px",
//                   }}
//                 >
//                   <i
//                     className={
//                       isEditing
//                         ? "isax isax-edit"
//                         : "isax isax-add-square"
//                     }
//                     style={{
//                       fontSize: "1.75rem",
//                     }}
//                   />

//                   {isEditing
//                     ? "EDIT PHYSICIAN"
//                     : "ADD PHYSICIAN"}
//                 </h3>

//                 <button
//                   type="button"
//                   className="btn-close btn-close-white ms-auto"
//                   onClick={() =>
//                     setShowAddModal(false)
//                   }
//                 ></button>
//               </div>

//               <div className="modal-body p-4 bg-white">
//                 <div className="row mb-3 align-items-center">
//                   <div className="col-4">
//                     <label className="form-label text-dark fw-bold mb-0">
//                       Type of Physician
//                     </label>
//                   </div>

//                   <div className="col-8">
//                     <select
//                       value={physicianType}
//                       onChange={(e) =>
//                         setPhysicianType(
//                           e.target.value
//                         )
//                       }
//                       className="form-select rounded-1 shadow-none text-dark py-1"
//                     >
//                       <option
//                         value=""
//                         disabled
//                       ></option>

//                       <option value="Admitting">
//                         Admitting
//                       </option>

//                       <option value="Attending">
//                         Attending
//                       </option>

//                       <option value="Consultant">
//                         Consultant
//                       </option>

//                       <option value="Resident">
//                         Resident
//                       </option>

//                       <option value="Surgeon">
//                         Surgeon
//                       </option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="row mb-3 align-items-center">
//                   <div className="col-4">
//                     <label className="form-label text-dark fw-bold mb-0">
//                       Name of Physician
//                     </label>
//                   </div>

//                   <div className="col-8">
//                     <select
//                       value={physicianName}
//                       onChange={(e) =>
//                         setPhysicianName(
//                           e.target.value
//                         )
//                       }
//                       className="form-select rounded-1 shadow-none text-dark py-1"
//                     >
//                       <option value="LIQUE R, MD">
//                         LIQUE R, MD
//                       </option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="row mb-3 align-items-center">
//                   <div className="col-4">
//                     <label className="form-label text-dark fw-bold mb-0">
//                       Access to Record
//                     </label>
//                   </div>

//                   <div className="col-8">
//                     <input
//                       type="text"
//                       value={accessStatus}
//                       readOnly
//                       className="form-control rounded-1 shadow-none text-dark py-1 w-50"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div
//                 className="modal-footer border-0 d-flex justify-content-end p-3"
//                 style={{
//                   backgroundColor: "#e2e5e9",
//                 }}
//               >
//                 <button
//                   type="button"
//                   className={`btn text-white rounded-1 px-4 py-2 fw-medium ${
//                     isSaveDisabled
//                       ? "opacity-50"
//                       : ""
//                   }`}
//                   style={{
//                     backgroundColor:
//                       "var(--primary, #0f763f)",
//                     cursor:
//                       isSaveDisabled
//                         ? "not-allowed"
//                         : "pointer",
//                   }}
//                   onClick={handleSave}
//                   disabled={isSaveDisabled}
//                 >
//                   Save and Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* DELETE MODAL */}
//       {showDeleteConfirmModal && (
//         <div
//           className="modal fade show d-block"
//           tabIndex={-1}
//           style={{
//             backgroundColor:
//               "rgba(0,0,0,0.5)",
//             zIndex: 1060,
//           }}
//         >
//           <div className="modal-dialog modal-sm modal-dialog-centered px-3">
//             <div
//               className="modal-content border-0 shadow-lg"
//               style={{
//                 borderRadius: "8px",
//                 overflow: "hidden",
//               }}
//             >
//               <div
//                 className="modal-header border-0 py-2 d-flex align-items-center"
//                 style={{
//                   backgroundColor: "#dc3545",
//                 }}
//               >
//                 <h6 className="modal-title text-white fw-bold m-0 d-flex align-items-center gap-2">
//                   <i className="isax isax-trash"></i>
//                   Confirm Delete
//                 </h6>
//               </div>

//               <div className="modal-body p-4 text-center bg-white">
//                 <i
//                   className="isax isax-warning-2 text-danger mb-3 d-block"
//                   style={{
//                     fontSize: "2.5rem",
//                   }}
//                 ></i>

//                 <p className="mb-0 text-dark fw-medium">
//                   Are you sure you want to
//                   delete this physician?
//                 </p>
//               </div>

//               <div
//                 className="modal-footer border-0 p-2 justify-content-center"
//                 style={{
//                   backgroundColor: "#f8f9fa",
//                 }}
//               >
//                 <button
//                   type="button"
//                   className="btn btn-sm btn-light border border-secondary-subtle fw-bold text-dark shadow-sm px-4"
//                   onClick={() =>
//                     setShowDeleteConfirmModal(
//                       false
//                     )
//                   }
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="button"
//                   className="btn btn-sm px-4 fw-bold text-white shadow-sm"
//                   style={{
//                     backgroundColor:
//                       "#dc3545",
//                   }}
//                   onClick={confirmDelete}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default PhysicianModule;




import DoctorSidebar from "@/components/custom-sidebar/doctorSidebar";
import { useEffect, useRef, useState } from "react";

interface Physician {
  id: number;
  type: string;
  name: string;
  accessStatus: string;
}

const PhysicianModule = () => {
  const [open, setOpen] = useState(false);

  // modal states
  const [showAddModal, setShowAddModal] =
    useState(false);
  const [isEditing, setIsEditing] =
    useState(false);
  const [selectedRecordId, setSelectedRecordId] =
    useState<number | null>(null);

  const [
    showDeleteConfirmModal,
    setShowDeleteConfirmModal,
  ] = useState(false);

  // form states
  const [physicianType, setPhysicianType] =
    useState("");

  const [physicianName, setPhysicianName] =
    useState("LIQUE R, MD");

  const [accessStatus, setAccessStatus] =
    useState("Active");

  // patient profile
  const [mockPatientProfile] = useState({
    hospitalNumber: "000000000777288",
    lastName: "DO",
    firstName: "REA",
    middleName: "MON",
    address: "111 Estanza, Legazpi City, Albay",
  });

  // physician list
  const [physicians, setPhysicians] =
    useState<Physician[]>([]);

  const wrapperRef =
    useRef<HTMLDivElement | null>(null);

  const toggleRef =
    useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node
        ) &&
        toggleRef.current &&
        !toggleRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "click",
      handleOutsideClick
    );

    return () =>
      document.removeEventListener(
        "click",
        handleOutsideClick
      );
  }, []);

  // ESC close modal
  useEffect(() => {
    const handleKeyDown = (
      e: KeyboardEvent
    ) => {
      if (e.key === "Escape") {
        setShowAddModal(false);
        setShowDeleteConfirmModal(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, []);

  const resetForm = () => {
    setIsEditing(false);
    setPhysicianType("");
    setPhysicianName("LIQUE R, MD");
    setAccessStatus("Active");
  };

  // ADD BUTTON LOGIC
  const handleAdd = () => {
    resetForm();
    setIsEditing(false);
    setSelectedRecordId(null);
    setShowAddModal(true);
  };

  const openEditModalForRecord = (
    record: Physician
  ) => {
    setIsEditing(true);
    setPhysicianType(record.type);
    setPhysicianName(record.name);
    setAccessStatus(record.accessStatus);
    setSelectedRecordId(record.id);
    setShowAddModal(true);
  };

  const handleOpenEdit = () => {
    if (selectedRecordId === null) return;

    const recordToEdit = physicians.find(
      (r) => r.id === selectedRecordId
    );

    if (recordToEdit) {
      openEditModalForRecord(recordToEdit);
    }
  };

  const handleDeleteClick = () => {
    if (selectedRecordId === null) return;

    setShowDeleteConfirmModal(true);
  };

  const confirmDelete = () => {
    if (selectedRecordId === null) return;

    setPhysicians((prev) =>
      prev.filter(
        (r) => r.id !== selectedRecordId
      )
    );

    setSelectedRecordId(null);
    setShowDeleteConfirmModal(false);
  };

  const handleSave = () => {
    if (!physicianType || !physicianName)
      return;

    const newRecord: Physician = {
      id:
        isEditing &&
        selectedRecordId !== null
          ? selectedRecordId
          : Date.now(),
      type: physicianType,
      name: physicianName,
      accessStatus,
    };

    if (
      isEditing &&
      selectedRecordId !== null
    ) {
      setPhysicians((prevRecords) =>
        prevRecords.map((r) =>
          r.id === selectedRecordId
            ? newRecord
            : r
        )
      );
    } else {
      setPhysicians((prevRecords) => [
        ...prevRecords,
        newRecord,
      ]);
    }

    resetForm();
    setShowAddModal(false);
  };

  const isSaveDisabled =
    !physicianType || !physicianName;

  const hasRecords =
    physicians.length > 0;

  return (
    <>
      <style>
        {`
          .selected-row td {
            background-color: rgba(15, 118, 63, 0.15) !important;
          }

          .custom-empty-state {
            min-height: 350px;
          }

          @media (max-width: 767px) {
            .physician-mobile-card {
              padding: 1rem !important;
              border-radius: 14px !important;
            }

            .physician-mobile-table {
              border: none !important;
              box-shadow: none !important;
            }

            .physician-mobile-empty {
              min-height: 420px;
              border: 1px solid #dee2e6;
              border-radius: 10px;
              background: #fff;
            }

            .physician-mobile-title {
              font-size: 1rem !important;
              text-align: center;
            }

            .physician-mobile-name {
              font-size: 1.7rem !important;
            }
          }
        `}
      </style>

      <div
        className="content doctor-content bg-light mt-n4 d-flex flex-column"
        style={{ minHeight: "100vh" }}
      >
        <div className="container-fluid px-2 px-lg-5 pt-0 flex-grow-1 d-flex flex-column">
          <div className="doctor-dashboard-layout">
            <DoctorSidebar />

            <div className="doctor-dashboard-main">
              <div
                className="card border-0 shadow-sm p-3 p-md-4 mb-4 d-flex flex-column h-100 physician-mobile-card"
                style={{
                  borderRadius: "12px",
                  borderTop:
                    "4px solid var(--primary, #0f763f)",
                }}
              >
                {/* PROFILE HEADER */}
                <div className="d-flex flex-column align-items-center gap-3 mb-4 pb-4 border-bottom text-center">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center bg-light shadow-sm"
                    style={{
                      width: "90px",
                      height: "90px",
                      border:
                        "2px solid var(--primary, #0f763f)",
                    }}
                  >
                    <i
                      className="isax isax-user fs-1"
                      style={{
                        color:
                          "var(--primary, #0f763f)",
                      }}
                    />
                  </div>

                  <div>
                    <div className="badge bg-light text-secondary border mb-2 px-2 py-1">
                      ID:{" "}
                      {
                        mockPatientProfile.hospitalNumber
                      }
                    </div>

                    <h3 className="fw-bold mb-1 text-dark physician-mobile-name">
                      {
                        mockPatientProfile.lastName
                      }
                      ,{" "}
                      {
                        mockPatientProfile.firstName
                      }{" "}
                      {
                        mockPatientProfile.middleName
                      }
                    </h3>

                    <div className="text-muted small d-flex align-items-center justify-content-center gap-2">
                      <i className="isax isax-location text-danger" />

                      {
                        mockPatientProfile.address
                      }
                    </div>
                  </div>
                </div>

                {/* PHYSICIAN SECTION */}
                <div className="d-flex flex-column flex-grow-1 mb-4">
                  {/* HEADER */}
                  <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-3 gap-3">
                    <h5 className="fw-bold text-dark mb-0 text-uppercase physician-mobile-title">
                      Physician
                    </h5>

                    {/* ACTION BUTTONS */}
                    {hasRecords && (
                      <div
                        className="d-flex flex-wrap justify-content-end rounded-1"
                        role="group"
                        style={{ gap: "4px" }}
                      >
                        {/* ADD BUTTON */}
                        <button
                          onClick={handleAdd}
                          className="btn btn-sm d-flex align-items-center gap-2 px-3 py-2 text-white fw-bold"
                          style={{
                            borderRadius: "3px",
                            backgroundColor:
                              "var(--primary, #0f763f)",
                            border:
                              "1px solid var(--primary, #0f763f)",
                          }}
                        >
                          <i className="isax isax-add-square"></i>
                          Add
                        </button>

                        {/* EDIT BUTTON */}
                        <button
                          onClick={handleOpenEdit}
                          disabled={
                            selectedRecordId === null
                          }
                          className={`btn btn-sm border-secondary-subtle d-flex align-items-center justify-content-center gap-2 px-3 py-2 ${
                            selectedRecordId === null
                              ? "bg-light text-muted opacity-50"
                              : "bg-white text-dark fw-bold"
                          }`}
                        >
                          <i className="isax isax-edit"></i>
                          Edit
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={
                            handleDeleteClick
                          }
                          disabled={
                            selectedRecordId === null
                          }
                          className={`btn btn-sm border-secondary-subtle d-flex align-items-center justify-content-center gap-2 px-3 py-2 ${
                            selectedRecordId === null
                              ? "bg-light text-muted opacity-50"
                              : "bg-white text-danger fw-bold"
                          }`}
                        >
                          <i className="isax isax-trash"></i>
                          Del
                        </button>
                      </div>
                    )}
                  </div>

                  {/* TABLE */}
                  <div className="border rounded-0 flex-grow-1 bg-white d-flex flex-column shadow-sm physician-mobile-table">
                    <table
                      className="table table-hover align-middle mb-0"
                      style={{
                        tableLayout: "auto",
                      }}
                    >
                      {hasRecords && (
                        <thead className="table-light">
                          <tr>
                            <th className="fw-semibold text-secondary py-3 ps-3 border-bottom text-nowrap">
                              Type of Physician
                            </th>

                            <th className="fw-semibold text-secondary py-3 border-bottom d-none d-md-table-cell">
                              Name of Physician
                            </th>

                            <th className="fw-semibold text-secondary py-3 pe-3 border-bottom text-nowrap">
                              Access Status
                            </th>
                          </tr>
                        </thead>
                      )}

                      <tbody>
                        {hasRecords ? (
                          physicians.map(
                            (record) => (
                              <tr
                                key={record.id}
                                onClick={() =>
                                  setSelectedRecordId(
                                    record.id
                                  )
                                }
                                onDoubleClick={() => {
                                  setSelectedRecordId(
                                    record.id
                                  );

                                  openEditModalForRecord(
                                    record
                                  );
                                }}
                                className={
                                  selectedRecordId ===
                                  record.id
                                    ? "selected-row"
                                    : ""
                                }
                                style={{
                                  cursor: "pointer",
                                }}
                              >
                                <td className="ps-3 py-3 text-dark border-bottom-0">
                                  {
                                    record.type
                                  }
                                </td>

                                <td className="py-3 text-dark border-bottom-0 d-none d-md-table-cell">
                                  {
                                    record.name
                                  }
                                </td>

                                <td className="pe-3 py-3 text-dark border-bottom-0">
                                  {
                                    record.accessStatus
                                  }
                                </td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan={3}
                              className="border-bottom-0"
                            >
                              <div className="d-flex flex-column align-items-center justify-content-center text-center text-muted py-5 custom-empty-state physician-mobile-empty">
                                <button
                                  onClick={
                                    handleAdd
                                  }
                                  className="btn rounded-circle d-flex align-items-center justify-content-center mb-3"
                                  style={{
                                    width: "72px",
                                    height: "72px",
                                    border:
                                      "2px solid var(--primary, #0f763f)",
                                    color:
                                      "var(--primary, #0f763f)",
                                    background:
                                      "#fff",
                                  }}
                                >
                                  <i
                                    className="isax isax-add"
                                    style={{
                                      fontSize:
                                        "2rem",
                                    }}
                                  />
                                </button>

                                <p className="fw-medium mb-2 text-dark">
                                  Add New
                                </p>

                                <p className="mb-0 fw-bold text-dark">
                                  No physician
                                  records found
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* TOTAL */}
                  <div className="mt-3 small text-muted fw-semibold">
                    Total Number of Record/s:{" "}
                    {physicians.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showAddModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{
            backgroundColor:
              "rgba(0,0,0,0.5)",
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered px-3">
            <div
              className="modal-content border-0 shadow-lg"
              style={{
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <div
                className="modal-header border-0 py-3 d-flex align-items-center"
                style={{
                  backgroundColor: "#333b45",
                }}
              >
                <h3
                  className="modal-title text-white fw-bold m-0 d-flex align-items-center gap-2"
                  style={{
                    fontSize: "1.1rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  <i
                    className={
                      isEditing
                        ? "isax isax-edit"
                        : "isax isax-add-square"
                    }
                    style={{
                      fontSize: "1.75rem",
                    }}
                  />

                  {isEditing
                    ? "EDIT PHYSICIAN"
                    : "ADD PHYSICIAN"}
                </h3>

                <button
                  type="button"
                  className="btn-close btn-close-white ms-auto"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                ></button>
              </div>

              <div className="modal-body p-4 bg-white">
                <div className="row mb-3 align-items-center">
                  <div className="col-4">
                    <label className="form-label text-dark fw-bold mb-0">
                      Type of Physician
                    </label>
                  </div>

                  <div className="col-8">
                    <select
                      value={physicianType}
                      onChange={(e) =>
                        setPhysicianType(
                          e.target.value
                        )
                      }
                      className="form-select rounded-1 shadow-none text-dark py-1"
                    >
                      <option
                        value=""
                        disabled
                      ></option>

                      <option value="Admitting">
                        Admitting
                      </option>

                      <option value="Attending">
                        Attending
                      </option>

                      <option value="Consultant">
                        Consultant
                      </option>

                      <option value="Resident">
                        Resident
                      </option>

                      <option value="Surgeon">
                        Surgeon
                      </option>
                    </select>
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <div className="col-4">
                    <label className="form-label text-dark fw-bold mb-0">
                      Name of Physician
                    </label>
                  </div>

                  <div className="col-8">
                    <select
                      value={physicianName}
                      onChange={(e) =>
                        setPhysicianName(
                          e.target.value
                        )
                      }
                      className="form-select rounded-1 shadow-none text-dark py-1"
                    >
                      <option value="LIQUE R, MD">
                        LIQUE R, MD
                      </option>
                    </select>
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <div className="col-4">
                    <label className="form-label text-dark fw-bold mb-0">
                      Access to Record
                    </label>
                  </div>

                  <div className="col-8">
                    <input
                      type="text"
                      value={accessStatus}
                      readOnly
                      className="form-control rounded-1 shadow-none text-dark py-1 w-50"
                    />
                  </div>
                </div>
              </div>

              <div
                className="modal-footer border-0 d-flex justify-content-end p-3"
                style={{
                  backgroundColor: "#e2e5e9",
                }}
              >
                <button
                  type="button"
                  className={`btn text-white rounded-1 px-4 py-2 fw-medium ${
                    isSaveDisabled
                      ? "opacity-50"
                      : ""
                  }`}
                  style={{
                    backgroundColor:
                      "var(--primary, #0f763f)",
                    cursor:
                      isSaveDisabled
                        ? "not-allowed"
                        : "pointer",
                  }}
                  onClick={handleSave}
                  disabled={isSaveDisabled}
                >
                  Save and Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteConfirmModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{
            backgroundColor:
              "rgba(0,0,0,0.5)",
            zIndex: 1060,
          }}
        >
          <div className="modal-dialog modal-sm modal-dialog-centered px-3">
            <div
              className="modal-content border-0 shadow-lg"
              style={{
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <div
                className="modal-header border-0 py-2 d-flex align-items-center"
                style={{
                  backgroundColor: "#dc3545",
                }}
              >
                <h6 className="modal-title text-white fw-bold m-0 d-flex align-items-center gap-2">
                  <i className="isax isax-trash"></i>
                  Confirm Delete
                </h6>
              </div>

              <div className="modal-body p-4 text-center bg-white">
                <i
                  className="isax isax-warning-2 text-danger mb-3 d-block"
                  style={{
                    fontSize: "2.5rem",
                  }}
                ></i>

                <p className="mb-0 text-dark fw-medium">
                  Are you sure you want to
                  delete this physician?
                </p>
              </div>

              <div
                className="modal-footer border-0 p-2 justify-content-center"
                style={{
                  backgroundColor: "#f8f9fa",
                }}
              >
                <button
                  type="button"
                  className="btn btn-sm btn-light border border-secondary-subtle fw-bold text-dark shadow-sm px-4"
                  onClick={() =>
                    setShowDeleteConfirmModal(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-sm px-4 fw-bold text-white shadow-sm"
                  style={{
                    backgroundColor:
                      "#dc3545",
                  }}
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhysicianModule;