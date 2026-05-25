import React, { useEffect, useState } from "react";
import DoctorSidebar from "@/components/custom-sidebar/doctorSidebar";
import ImageWithBasePath from "@/components/image-with-base-path";
import { useLocation, useNavigate } from "react-router-dom";
import "./drugMeds.css";

// --- Types ---
interface MainDrugRecord {
  id: string;
  name: string;
  description: string;
  qty: number;
  cost: number;
  dateDispensed: string;
}

interface IssuableDrug {
  id: string;
  code: string;
  name: string;
  selected: boolean;
  qtyIntakeNum: number;
  qtyIntakeUnit: string;
  freqNum: number;
  freqInterval: string;
  dateIssuance: string;
  qtyIssued: number;
  cost: number;
}

// --- mock data lang muna sa options ---
const INTAKE_UNITS = [
  "tablet(s)",
  "TABLET COATED",
  "TABLET COATED PARTICLES",
  "TABLET CONTROLLED RELEASE",
  "TABLET DELAYED ACTION",
  "TABLET DELAYED RELEASE",
  "TABLET DISPERSIBLE",
  "TABLET EFFERVESCENT",
  "TABLET ENTERIC COATED",
  "TABLET EXTENDED RELEASE",
  "TABLET FILM COATED",
];

const FREQUENCY_INTERVALS = ["Hour", "Day", "Week", "Month", "Year", "Minute"];

//get local time
const getCurrentDateTimeLocal = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const DrugsAndMedicine = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

  // --- State ---
  const [mainRecords, setMainRecords] = useState<MainDrugRecord[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showValidationAlert, setShowValidationAlert] = useState(false); // New state for the custom alert
  const [issuableDrugs, setIssuableDrugs] = useState<IssuableDrug[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});



  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 992);
  };

  handleResize(); // run once on mount

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  //pagination and sorting state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); 
  const [sortConfig, setSortConfig] = useState<{ field: 'date' | 'item' | null, order: 'asc' | 'desc' }>({ field: null, order: 'desc' });

  useEffect(() => {
    if (location.state?.selectedPatientId) {
      setTimeout(() => {}, 1500);
    }
  }, [location.state]);

  // --- sorting Logic ---
  const handleSort = (field: 'date' | 'item') => {
    let order: 'asc' | 'desc' = 'asc';
    if (sortConfig.field === field && sortConfig.order === 'asc') {
      order = 'desc';
    }
    setSortConfig({ field, order });
    setCurrentPage(1); //para ma reset to first page when sorting changes
  };

  const sortedRecords = [...mainRecords].sort((a, b) => {
    if (sortConfig.field === 'date') {
      const dateA = new Date(a.dateDispensed).getTime();
      const dateB = new Date(b.dateDispensed).getTime();
      return sortConfig.order === 'asc' ? dateA - dateB : dateB - dateA;
    }
    if (sortConfig.field === 'item') {
      return sortConfig.order === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    }
    return 0; // default or no sorting happens
  });

  // ---pagination calculation ---
  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize));
  const paginatedRecords = sortedRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); 
  };

  // --- handlers po ---
  const openDmListModal = () => {
    setIssuableDrugs([
      {
        id: "d1",
        code: "P26-111799",
        name: "Paracetamol, 500.00 mg",
        selected: false,
        qtyIntakeNum: 1.0,
        qtyIntakeUnit: "tablet(s)",
        freqNum: 1,
        freqInterval: "Day",
        dateIssuance: getCurrentDateTimeLocal(),
        qtyIssued: 1.0,
        cost: 2.77,
      },
      {
        id: "d2",
        code: "A12-992100",
        name: "Amoxicillin, 250.00 mg",
        selected: false,
        qtyIntakeNum: 1.0,
        qtyIntakeUnit: "tablet(s)",
        freqNum: 3,
        freqInterval: "Day",
        dateIssuance: getCurrentDateTimeLocal(),
        qtyIssued: 21.0,
        cost: 5.5,
      },
      {
        id: "d3",
        code: "M01-445811",
        name: "Mefenamic Acid, 500.00 mg",
        selected: false,
        qtyIntakeNum: 1.0,
        qtyIntakeUnit: "tablet(s)",
        freqNum: 2,
        freqInterval: "Day",
        dateIssuance: getCurrentDateTimeLocal(),
        qtyIssued: 10.0,
        cost: 4.25,
      },
    ]);
    setExpandedRows({});
    setShowModal(true);
  };

  const updateModalItem = (id: string, field: keyof IssuableDrug, value: any) => {
    setIssuableDrugs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const toggleRowExpand = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveModal = () => {
    const selectedItems = issuableDrugs.filter((d) => d.selected);
    if (selectedItems.length === 0) {
      // Show the custom alert modal instead of window.alert()
      setShowValidationAlert(true);
      return;
    }

    const newRecords: MainDrugRecord[] = selectedItems.map((item) => {
      const dateObj = new Date(item.dateIssuance);
      const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;

      const freqText = item.freqNum === 1 
        ? `Once A ${item.freqInterval}` 
        : `${item.freqNum} Times A ${item.freqInterval}`;

      const cleanName = item.name.split(',')[0];
      const dosageInfo = item.name.includes(',') ? item.name.substring(item.name.indexOf(',') + 1).trim() : "";

      const detailedDesc = `${item.qtyIntakeNum.toFixed(2)} ${item.qtyIntakeUnit.charAt(0).toUpperCase() + item.qtyIntakeUnit.slice(1)} , ${dosageInfo}, ${item.qtyIntakeNum.toFixed(2)} ${item.qtyIntakeUnit.charAt(0).toUpperCase() + item.qtyIntakeUnit.slice(1)} ${freqText}, Oral`;

      return {
        id: Date.now().toString() + Math.random(),
        name: cleanName,
        description: detailedDesc,
        qty: item.qtyIssued,
        cost: item.cost,
        dateDispensed: formattedDate,
      };
    });

    setMainRecords((prev) => [...newRecords, ...prev]);
    setCurrentPage(1); 
    setShowModal(false);
  };

  return (
    <>

      <div className="content doctor-content bg-light mt-n4 d-flex flex-column" style={{ minHeight: "100vh" }}>
        <div className="container-fluid px-3 px-lg-5 pt-0 flex-grow-1 d-flex flex-column">
          <div className="doctor-dashboard-layout">
  <DoctorSidebar />

  <div className="doctor-dashboard-main">
              <div className="card border-0 shadow-sm p-3 p-md-4 mb-4 d-flex flex-column flex-grow-1" style={{ borderRadius: "12px", borderTop: "4px solid var(--primary, #0f763f)" }}>
              {/* close button */}
                      
                        <button
                          type="button"
                          className="btn-close"
                          aria-label="Close"
                          style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            padding: "4px",
                            zIndex: 10,
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate("/doctor-dashboard", { replace: true });
                          }}
                        >
                        </button>

                {/* patient profle header */}
                <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3 gap-md-4 mb-4 pb-4 border-bottom text-center text-md-start">
                  <div className="rounded-circle d-flex align-items-center justify-content-center bg-light shadow-sm flex-shrink-0" style={{ width: "90px", height: "90px", border: "2px solid var(--primary, #0f763f)" }}>
                    <i className="isax isax-user fs-1 text-primary" style={{ color: "var(--primary, #0f763f)" }} />
                  </div>
                  <div>
                    <div className="badge bg-light text-secondary border mb-2 px-2 py-1">ID: {mockPatientProfile.hospitalNumber}</div>
                    <h3 className="fw-bold mb-1 text-dark fs-3 fs-md-2">
                      {mockPatientProfile.lastName}, {mockPatientProfile.firstName} {mockPatientProfile.middleName}
                    </h3>
                    <div className="text-muted small d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                      <i className="isax isax-location text-danger" />
                      {mockPatientProfile.address}
                    </div>
                  </div>
                </div>

           

                {/* main data scetion */}
                <div className="d-flex flex-column flex-grow-1 mb-4">
                
                  {/* toolbar */}
                 
<div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
  <h5 className="fw-bold text-dark mb-0 text-center text-md-start text-uppercase">
    Drugs and Medicine
  </h5>

  <div
    className="d-flex flex-wrap justify-content-center justify-content-md-end pb-1 pb-lg-0 ms-md-auto"
    style={{ gap: "6px" }}
  >
    {/* ✅ DM LIST BUTTON (hidden ONLY on mobile empty state) */}
    {/* ✅ DM LIST BUTTON */}
{!(isMobile && sortedRecords.length === 0) && (
  <button
    onClick={openDmListModal}
    disabled={showModal}
    className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap flex-grow-1 flex-md-grow-0 ${
      showModal
        ? "bg-light text-muted opacity-50"
        : "text-white fw-bold"
    }`}
    style={{
      borderRadius: "4px",
      cursor: showModal ? "not-allowed" : "pointer",
      backgroundColor: showModal ? undefined : "#0f763f",
      borderColor: showModal ? undefined : "#0f763f",
    }}
  >
    <i className="isax isax-menu-board"></i>
    <span>DM List</span>
  </button>
)}

    {/* sort by date btn */}
    <button
      onClick={() => handleSort("date")}
      className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap flex-grow-1 flex-md-grow-0 ${
        sortConfig.field === "date"
          ? "bg-light text-primary border-primary"
          : "bg-white text-dark"
      } fw-bold text-hover-primary`}
      style={{ borderRadius: "4px", cursor: "pointer" }}
    >
      <i
        className={`isax ${
          sortConfig.field === "date" && sortConfig.order === "asc"
            ? "isax-arrow-up-2"
            : "isax-arrow-down-1"
        }`}
      ></i>
      <span className="d-none d-sm-inline">Sort by Date</span>
    </button>

    {/* sort by item btn */}
    <button
      onClick={() => handleSort("item")}
      className={`btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap flex-grow-1 flex-md-grow-0 ${
        sortConfig.field === "item"
          ? "bg-light text-primary border-primary"
          : "bg-white text-dark"
      } fw-bold text-hover-primary`}
      style={{ borderRadius: "4px", cursor: "pointer" }}
    >
      {sortConfig.field === "item" ? (
        <i
          className={`isax ${
            sortConfig.order === "asc"
              ? "isax-arrow-up-2"
              : "isax-arrow-down-1"
          }`}
        ></i>
      ) : (
        <i className="isax isax-sort"></i>
      )}
      <span className="d-none d-sm-inline">Sort by Item</span>
    </button>
  </div>
</div>

                  {/* table layout */}
                  <div className="border rounded-0 flex-grow-1 bg-white shadow-sm d-flex flex-column overflow-hidden" style={{ minHeight: "450px" }}>
                    <div className="table-responsive flex-grow-1 bg-white p-0 border-0">
                      <table className="table table-hover table-fixed mb-0 align-middle"> 
                        <thead style={{ backgroundColor: "#f8f9fa" }}>
                          <tr>
  <th
    className="text-center text-dark align-middle"
    style={{
      width: "40%",
      whiteSpace: "normal",
      color: "#000"
    }}
  >
    Drug/Medicine Description
  </th>

  <th
    className="text-center text-dark align-middle"
    style={{
      width: "15%",
      whiteSpace: "nowrap",
      color: "#000"
    }}
  >
    Cost ₱
  </th>

  <th
    className="text-center text-dark align-middle"
    style={{
      width: "35%",
      whiteSpace: "nowrap",
      textAlign: "center",
      color: "#000"
    }}
  >
    Date Dispensed
  </th>
</tr>
                        </thead>
                        <tbody>
                          {paginatedRecords.length === 0 ? (
                              <tr>
                              <td
                                colSpan={3}
                                className="text-center text-muted border-0 p-0"
                                style={{ height: "350px", verticalAlign: "middle" }}
                              >
                                <div
                                  className="d-flex flex-column align-items-center justify-content-center w-100 bg-white"
                                  style={{
                                    height: "350px",
                                    margin: 0,
                                  }}
                                >

        
        {/* DESKTOP ONLY CONTENT */}
        {!isMobile && (
          <>
            {/* DESKTOP DOCUMENT ICON */}
            <i
              className="isax isax-document-text fs-1 mb-3 opacity-50 d-block"
              style={{
                fontSize: "3rem",
                color: "var(--primary, #0f763f)",
              }}
            ></i>

            {/* EMPTY TEXT */}
            <p className="mb-0 fw-bold text-dark">
              No drugs and medicine recorded yet.
            </p>
          </>
        )}

        {/* MOBILE ONLY CTA */}
        {isMobile && (
  <div className="d-flex flex-column align-items-center justify-content-center">
    
    <div
      onClick={openDmListModal}
    >
      <div className="modern-dm-icon-wrap d-flex align-items-center justify-content-center">
        <div className="modern-dm-pulse"></div>

        <div className="modern-dm-icon d-flex align-items-center justify-content-center">
          <i className="isax isax-menu-board"></i>
        </div>
      </div>

      <div className="modern-dm-text text-center">
        <span className="modern-dm-title">DM List</span>

        <span className="modern-dm-subtitle">
          Tap to issue medicine
        </span>
      </div>
    </div>

  </div>
)}

      </div>
    </td>
  </tr>
) : (
                            paginatedRecords.map((record) => (
                              <tr key={record.id} style={{ transition: "background-color 0.2s" }}>
                                <td className="align-top">
  <div className="fw-bold text-primary safe-text">
    {record.name}
  </div>

  <div className="text-dark small safe-text mt-1">
    {record.description}
  </div>
</td>
                                <td className="align-top text-center">
   {record.cost.toFixed(2)}
</td>
                                <td className="align-top text-muted text-center">
  {record.dateDispensed}
</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* pagination controls (no bugs) */}
                    {sortedRecords.length > 0 && (
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center p-3 border-top bg-light gap-2 pagination-controls">
                        
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-muted small fw-medium">Show</span>
                          <select 
                            className="form-select form-select-sm shadow-none" 
                            style={{ width: "75px", borderColor: "#ced4da" }}
                            value={pageSize}
                            onChange={handlePageSizeChange}
                          >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>
                          <span className="text-muted small fw-medium">entries</span>
                        </div>

                        <span className="text-muted small fw-medium text-center">
                          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedRecords.length)} of {sortedRecords.length} entries
                        </span>
                        
                        <div className="d-flex gap-1">
                          <button 
                            className="btn btn-sm btn-outline-secondary px-3" 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage === 1}
                          >
                            Prev
                          </button>
                          <span className="btn btn-sm btn-light disabled px-3 text-dark fw-bold border">
                            {currentPage} / {totalPages}
                          </span>
                          <button 
                            className="btn btn-sm btn-outline-secondary px-3" 
                            onClick={() => handlePageChange(currentPage + 1)} 
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-2 text-muted fw-bold" style={{ fontSize: "0.85rem" }}>
                  Total Number of Record/s: <span className="text-dark">{sortedRecords.length}</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* sa dm list na modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}>
          <div className="modal-dialog modal-xl tablet-wide-modal modal-dialog-centered px-2">
            <div className="modal-content shadow-lg border-0 rounded-1 overflow-hidden bg-white">
              
              {/* Header */}
              <div className="modal-header border-0 py-3 d-flex align-items-center" style={{ backgroundColor: "#333b45" }}>
                <h4 className="modal-title text-white fw-bold m-0 d-flex align-items-center gap-2" style={{ fontSize: "1.1rem", letterSpacing: "0.5px" }}>
                  <i className="isax isax-health" style={{ fontSize: "1.5rem" }}></i>
                  LIST OF DRUGS AND MEDICINE ISSUED TO PATIENT
                </h4>
                <button type="button" className="btn-close btn-close-white shadow-none" onClick={() => setShowModal(false)}></button>
              </div>

              {/* bdy */}
              <div className="modal-body p-0">
                <div className="table-responsive" style={{ maxHeight: "65vh" }}>
                  <table className="table modal-table bg-white mb-0 w-100">
                    <thead style={{ backgroundColor: "#f8f9fa", position: "sticky", top: 0, zIndex: 1 }}>
                      <tr>
                        <th className="border-bottom py-3 px-3 text-dark fw-bold text-center" style={{ width: "5%" }}>#</th>
                        <th className="border-bottom py-3 px-3 text-dark fw-bold" style={{ width: "35%" }}>Item Description</th>
                        
                        <th className="border-bottom py-3 px-3 text-dark fw-bold text-center d-none d-lg-table-cell" style={{ width: "15%" }}>Qty Intake</th>
                        <th className="border-bottom py-3 px-3 text-dark fw-bold text-center d-none d-lg-table-cell" style={{ width: "15%" }}>Frequency</th>
                        <th className="border-bottom py-3 px-3 text-dark fw-bold text-center d-none d-lg-table-cell" style={{ width: "15%" }}>Date of Issuance</th>
                        <th className="border-bottom py-3 px-3 text-dark fw-bold text-center d-none d-lg-table-cell" style={{ width: "8%" }}>Qty</th>
                        <th className="border-bottom py-3 px-3 text-dark fw-bold text-center d-none d-lg-table-cell" style={{ width: "7%" }}>Cost</th>
                        
                        <th className="border-bottom py-3 px-3 text-dark fw-bold text-center d-table-cell d-lg-none" style={{ width: "15%" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {issuableDrugs.map((item, index) => (
                        <React.Fragment key={item.id}>
                          <tr>
                            <td className="text-center text-muted py-3 px-3 align-middle">{index + 1}</td>
                            <td className="text-wrap py-3 px-3 align-middle">
                              <div className="d-flex align-items-start gap-2">
                                <input 
                                  type="checkbox" 
                                  className="form-check-input mt-1 shadow-none flex-shrink-0" 
                                  style={{ border: "1px solid var(--primary, #0f763f)", cursor: "pointer", width: "18px", height: "18px" }}
                                  checked={item.selected}
                                  onChange={(e) => updateModalItem(item.id, "selected", e.target.checked)}
                                />
                                <div>
                                  <span className="fw-bold text-dark d-block">{item.code}</span> 
                                  <span className="text-muted small">{item.name}</span>
                                </div>
                              </div>
                            </td>

                            <td className="text-center align-middle py-3 px-2 d-none d-lg-table-cell">
                              <div className="d-flex align-items-center gap-1 justify-content-center">
                                <input 
                                  type="number" 
                                  className="form-control form-control-compact text-end shadow-none" 
                                  style={{ width: "60px", borderColor: "var(--primary, #0f763f)" }} 
                                  value={item.qtyIntakeNum.toFixed(2)}
                                  onChange={(e) => updateModalItem(item.id, "qtyIntakeNum", parseFloat(e.target.value) || 0)}
                                  step="0.01" min="0"
                                />
                                <select 
                                  className="form-select form-select-compact shadow-none"
                                  style={{ width: "110px", borderColor: "var(--primary, #0f763f)" }}
                                  value={item.qtyIntakeUnit}
                                  onChange={(e) => updateModalItem(item.id, "qtyIntakeUnit", e.target.value)}
                                >
                                  {INTAKE_UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                                </select>
                              </div>
                            </td>
                            <td className="text-center align-middle py-3 px-2 d-none d-lg-table-cell">
                              <div className="d-flex align-items-center gap-1 justify-content-center">
                                <input 
                                  type="number" 
                                  className="form-control form-control-compact text-end shadow-none" 
                                  style={{ width: "50px", borderColor: "var(--primary, #0f763f)" }} 
                                  value={item.freqNum}
                                  onChange={(e) => updateModalItem(item.id, "freqNum", parseInt(e.target.value) || 0)}
                                  min="1"
                                />
                                <span className="text-muted small fw-bold">x/</span>
                                <select 
                                  className="form-select form-select-compact shadow-none"
                                  style={{ width: "95px", borderColor: "var(--primary, #0f763f)" }}
                                  value={item.freqInterval}
                                  onChange={(e) => updateModalItem(item.id, "freqInterval", e.target.value)}
                                >
                                  {FREQUENCY_INTERVALS.map(freq => <option key={freq} value={freq}>{freq}</option>)}
                                </select>
                              </div>
                            </td>
                            <td className="text-center align-middle py-3 px-2 d-none d-lg-table-cell">
                              <input 
                                type="datetime-local" 
                                className="form-control form-control-compact m-auto shadow-none" 
                                style={{ borderColor: "var(--primary, #0f763f)", maxWidth: "160px" }}
                                value={item.dateIssuance}
                                onChange={(e) => updateModalItem(item.id, "dateIssuance", e.target.value)}
                              />
                            </td>
                            <td className="text-center align-middle py-3 px-2 fw-bold text-dark d-none d-lg-table-cell">
                              {item.qtyIssued.toFixed(2)}
                            </td>
                            <td className="text-center align-middle py-3 px-2 text-muted small d-none d-lg-table-cell">
                              {item.cost.toFixed(2)}
                            </td>

                            <td className="text-center align-middle py-3 px-2 d-table-cell d-lg-none">
                              <button 
                                className="btn btn-sm btn-outline-secondary px-3 rounded-1 text-nowrap"
                                onClick={() => toggleRowExpand(item.id)}
                              >
                                {expandedRows[item.id] ? "Hide" : "See More"}
                              </button>
                            </td>
                          </tr>

                          {expandedRows[item.id] && (
                            <tr className="d-lg-none bg-light">
                              <td colSpan={3} className="px-3 py-3 border-bottom">
                                <div className="d-flex flex-column gap-3 rounded-2 border p-3 bg-white shadow-sm">
                                  
                                  <div className="d-flex flex-column">
                                    <label className="text-muted small fw-bold mb-1 text-uppercase">Qty Intake</label>
                                    <div className="d-flex gap-2">
                                      <input 
                                        type="number" 
                                        className="form-control form-control-sm shadow-none w-25" 
                                        style={{ borderColor: "var(--primary, #0f763f)" }} 
                                        value={item.qtyIntakeNum.toFixed(2)}
                                        onChange={(e) => updateModalItem(item.id, "qtyIntakeNum", parseFloat(e.target.value) || 0)}
                                        step="0.01" min="0"
                                      />
                                      <select 
                                        className="form-select form-select-sm shadow-none w-75"
                                        style={{ borderColor: "var(--primary, #0f763f)" }}
                                        value={item.qtyIntakeUnit}
                                        onChange={(e) => updateModalItem(item.id, "qtyIntakeUnit", e.target.value)}
                                      >
                                        {INTAKE_UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                                      </select>
                                    </div>
                                  </div>

                                  <div className="d-flex flex-column">
                                    <label className="text-muted small fw-bold mb-1 text-uppercase">Frequency</label>
                                    <div className="d-flex align-items-center gap-2">
                                      <input 
                                        type="number" 
                                        className="form-control form-control-sm shadow-none w-25" 
                                        style={{ borderColor: "var(--primary, #0f763f)" }} 
                                        value={item.freqNum}
                                        onChange={(e) => updateModalItem(item.id, "freqNum", parseInt(e.target.value) || 0)}
                                        min="1"
                                      />
                                      <span className="text-muted small fw-bold">x /</span>
                                      <select 
                                        className="form-select form-select-sm shadow-none flex-grow-1"
                                        style={{ borderColor: "var(--primary, #0f763f)" }}
                                        value={item.freqInterval}
                                        onChange={(e) => updateModalItem(item.id, "freqInterval", e.target.value)}
                                      >
                                        {FREQUENCY_INTERVALS.map(freq => <option key={freq} value={freq}>{freq}</option>)}
                                      </select>
                                    </div>
                                  </div>

                                  <div className="d-flex flex-column">
                                    <label className="text-muted small fw-bold mb-1 text-uppercase">Date of Issuance</label>
                                    <input 
                                      type="datetime-local" 
                                      className="form-control form-control-sm shadow-none w-100" 
                                      style={{ borderColor: "var(--primary, #0f763f)" }}
                                      value={item.dateIssuance}
                                      onChange={(e) => updateModalItem(item.id, "dateIssuance", e.target.value)}
                                    />
                                  </div>

                                  <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded-2 border">
                                    <div className="d-flex flex-column">
                                      <span className="text-muted small text-uppercase">Qty Issued</span>
                                      <span className="fw-bold text-dark fs-6">{item.qtyIssued.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex flex-column text-end">
                                      <span className="text-muted small text-uppercase">Cost</span>
                                      <span className="text-dark fw-bold fs-6">{item.cost.toFixed(2)}</span>
                                    </div>
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
              </div>

              {/* sa footer */}
              <div className="modal-footer border-0 p-3 justify-content-end" style={{ backgroundColor: "#e2e5e9" }}>
                <div className="d-flex modal-footer-actions gap-2 w-100 justify-content-sm-end">
                  <button 
                    type="button" 
                    className="btn rounded-1 px-5 py-2 fw-medium shadow-sm text-white" 
                    style={{ backgroundColor: "var(--primary, #0f763f)", cursor: "pointer" }} 
                    onClick={handleSaveModal}
                  >
                    SAVE
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* new alert modal */}
      {showValidationAlert && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1070 }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0 p-4 text-center">
              
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="#ffc107" className="mx-auto mb-3" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
              </svg>

              <h5 className="fw-bold mb-2">Selection Required</h5>
              <p className="text-muted small mb-4">Please select at least one drug to issue.</p>
              
              <button 
                type="button" 
                className="btn btn-warning fw-bold w-100 border-0" 
                onClick={() => setShowValidationAlert(false)}
              >
                Continue
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DrugsAndMedicine;