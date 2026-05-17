import NurseSidebar from "@/components/custom-sidebar/nurseSidebar";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";
import "./charges.css";

/* patient charges module */
const RegDetails = () => {
  const location = useLocation();

  type ChargeCategory = "Oxygen" | "Service" | "Procedure";

  type ChargeItem = {
    id: number;
    category: ChargeCategory;
    description: string;
    rate: number;
    otherDescription?: string;
  };

  type ChargeRecord = {
    id: number;
    typeOfCharge: string;
    itemDescription: string;
    unitCost: number;
    quantity: number;
    totalCost: number;
    chargeSlipChecked: boolean;
    chargeSlipNo: string;
    dateTimeEntered: string;
    enteredBy: string;
  };

  const [mockPatientProfile] = useState({
    hospitalNumber: "000000000777288",
    lastName: "DO",
    firstName: "REA",
    middleName: "MON",
    address: "111 Legazpi City, Albay 4500",
  });

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showRecordDetailsModal, setShowRecordDetailsModal] = useState(false);

  const [infoMessage, setInfoMessage] = useState("");
  const [activeTab, setActiveTab] = useState<ChargeCategory>("Service");
  const [searchValue, setSearchValue] = useState("");
  const [selectedItem, setSelectedItem] = useState<ChargeItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedRecord, setSelectedRecord] = useState<ChargeRecord | null>(null);
  const [recordPendingDelete, setRecordPendingDelete] =
    useState<ChargeRecord | null>(null);
  const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
  const totalBarRef = useRef<HTMLDivElement | null>(null);
  const [isTotalBarVisible, setIsTotalBarVisible] = useState(false);

  const formatDateTimeNow = () => {
    const now = new Date();

    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const year = String(now.getFullYear()).slice(-2);

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    const displayHours = String(hours).padStart(2, "0");

    return `${month}/${day}/${year} ${displayHours}:${minutes} ${ampm}`;
  };

  const [chargeRecords, setChargeRecords] = useState<ChargeRecord[]>([
    {
      id: 1,
      typeOfCharge: "Room and Board",
      itemDescription: "Ph Med",
      unitCost: 700,
      quantity: 0,
      totalCost: 0,
      chargeSlipChecked: true,
      chargeSlipNo: "-",
      dateTimeEntered: formatDateTimeNow(),
      enteredBy: "Lique, Rowan M",
    },
  ]);

  const oxygenItems: ChargeItem[] = [
    {
      id: 1,
      category: "Oxygen",
      description: "Oxygen Service",
      rate: 90,
      otherDescription: "In-Patient",
    },
    {
      id: 2,
      category: "Oxygen",
      description: "Oxygen Per Hour",
      rate: 75,
      otherDescription: "Per Hour",
    },
    {
      id: 3,
      category: "Oxygen",
      description: "Oxygen Tank",
      rate: 150,
      otherDescription: "Per Use",
    },
  ];

  const serviceItems: ChargeItem[] = [
    {
      id: 101,
      category: "Service",
      description: "Bedside Care",
      rate: 75,
    },
    {
      id: 102,
      category: "Service",
      description: "Bilateral Tubal Ligation",
      rate: 3000,
    },
    {
      id: 103,
      category: "Service",
      description: "Billilight",
      rate: 150,
      otherDescription: "In-Patient",
    },
    {
      id: 104,
      category: "Service",
      description: "Bipap",
      rate: 2800,
    },
    {
      id: 105,
      category: "Service",
      description: "Blood Sugar Monitoring/Screening",
      rate: 150,
    },
    {
      id: 106,
      category: "Service",
      description: "Blood Transfusion",
      rate: 220,
    },
    {
      id: 107,
      category: "Service",
      description: "Blood Transfusion Fee",
      rate: 500,
    },
    {
      id: 108,
      category: "Service",
      description: "Blood Transfusion w/ BT set and Cannula",
      rate: 150,
      otherDescription: "In-Patient",
    },
    {
      id: 109,
      category: "Service",
      description: "Bronchology Room",
      rate: 2500,
    },
    {
      id: 110,
      category: "Service",
      description: "Bronchoscopy without Pathology or Laboratory",
      rate: 33000,
    },
    {
      id: 111,
      category: "Service",
      description: "Cardiac Monitor",
      rate: 75,
    },
    {
      id: 112,
      category: "Service",
      description: "Cardiac Monitor",
      rate: 900,
      otherDescription: "Per Day",
    },
    {
      id: 113,
      category: "Service",
      description: "Cardiac Monitor",
      rate: 50,
      otherDescription: "Per Hour",
    },
    {
      id: 114,
      category: "Service",
      description: "Cardiac Monitoring",
      rate: 130,
    },
    {
      id: 115,
      category: "Service",
      description: "Cardiac Rehabilitation",
      rate: 12000,
    },
    {
      id: 116,
      category: "Service",
      description: "Cardio Pulmonary Resuscitation (CPR)",
      rate: 320,
    },
    {
      id: 117,
      category: "Service",
      description: "Catheterization /w Foley Catheter (2 way)",
      rate: 300,
      otherDescription: "In-Patient",
    },
    {
      id: 118,
      category: "Service",
      description: "Catheterization only",
      rate: 150,
      otherDescription: "In-Patient",
    },
    {
      id: 119,
      category: "Service",
      description: "Incision",
      rate: 800,
      otherDescription: "OPD",
    },
    {
      id: 120,
      category: "Service",
      description: "Injection ( Insulin Syringe )",
      rate: 80,
      otherDescription: "In-Patient",
    },
    {
      id: 121,
      category: "Service",
      description: "Injection ( Ordinary Syringe )",
      rate: 50,
      otherDescription: "In-Patient",
    },
    {
      id: 122,
      category: "Service",
      description: "Injection (insulin syringe)",
      rate: 50,
      otherDescription: "OPD",
    },
    {
      id: 123,
      category: "Service",
      description: "Insulin Syringe Injection",
      rate: 51,
    },
  ];

  const procedureItems: ChargeItem[] = [
    {
      id: 201,
      category: "Procedure",
      description: "Amputation - Below Knee",
      rate: 11200,
    },
    {
      id: 202,
      category: "Procedure",
      description: "Amputation - Foot",
      rate: 8400,
    },
    {
      id: 203,
      category: "Procedure",
      description: "Amputation - Leg Thrribia & Fibula",
      rate: 11200,
    },
    {
      id: 204,
      category: "Procedure",
      description: "Angiogram",
      rate: 4200,
    },
    {
      id: 205,
      category: "Procedure",
      description: "Appendectomy",
      rate: 5600,
    },
    {
      id: 206,
      category: "Procedure",
      description: "Appendectomy w/ Exploration",
      rate: 8400,
    },
    {
      id: 207,
      category: "Procedure",
      description: "Arthroplasty, Revision, Hip",
      rate: 22400,
    },
    {
      id: 208,
      category: "Procedure",
      description: "Arthrotomy",
      rate: 2800,
    },
    {
      id: 209,
      category: "Procedure",
      description: "Aspiration/Biopsy",
      rate: 2520,
    },
    {
      id: 210,
      category: "Procedure",
      description: "AV Fistula Creation",
      rate: 4200,
    },
    {
      id: 211,
      category: "Procedure",
      description: "Bedside Care",
      rate: 90,
    },
    {
      id: 212,
      category: "Procedure",
      description: "Bilateral Tubal Ligation Mini Laparotomy under Local Anesth",
      rate: 5300,
    },
    {
      id: 213,
      category: "Procedure",
      description: "Biopsy",
      rate: 560,
    },
    {
      id: 214,
      category: "Procedure",
      description: "Biopsy, Bone Marrow",
      rate: 2520,
    },
    {
      id: 215,
      category: "Procedure",
      description: "Biopsy, Breast, Needle Core",
      rate: 6108,
    },
    {
      id: 216,
      category: "Procedure",
      description: "Blood Transfusion",
      rate: 300,
    },
    {
      id: 217,
      category: "Procedure",
      description: "Bone Marrow Aspiration",
      rate: 2520,
    },
    {
      id: 218,
      category: "Procedure",
      description: "Bronchoscopy",
      rate: 5600,
    },
    {
      id: 219,
      category: "Procedure",
      description: "Cardiac Monitoring",
      rate: 250,
    },
    {
      id: 220,
      category: "Procedure",
      description: "Cardio Pulmonary Resuscitation (CPR)",
      rate: 500,
    },
    {
      id: 221,
      category: "Procedure",
      description: "Cardioplasty",
      rate: 16800,
    },
  ];

  const allItems = useMemo(() => {
    if (activeTab === "Oxygen") return oxygenItems;
    if (activeTab === "Service") return serviceItems;
    return procedureItems;
  }, [activeTab]);

  const filteredItems = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    if (!keyword) return allItems;

    return allItems.filter((item) =>
      `${item.description} ${item.rate} ${item.otherDescription || ""}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [allItems, searchValue]);

  const selectedTotal = selectedItem ? selectedItem.rate * quantity : 0;
  const isEditingCharge = editingRecordId !== null;

  const totalAmount = chargeRecords.reduce(
    (sum, record) => sum + record.totalCost,
    0
  );
  const shouldFloatTotalAmount = chargeRecords.length > 5;
  const showFloatingTotalAmount = shouldFloatTotalAmount && !isTotalBarVisible;

  const hasItemWithoutChargeSlip = chargeRecords.some(
    (record) => record.chargeSlipNo === "-"
  );

  useEffect(() => {
    const selectedPatientId = location.state?.selectedPatientId;

    if (selectedPatientId) {
      setTimeout(() => {}, 1500);
    }
  }, [location.state]);

  useEffect(() => {
    const totalBar = totalBarRef.current;

    if (!shouldFloatTotalAmount || !totalBar) {
      setIsTotalBarVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTotalBarVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(totalBar);

    return () => observer.disconnect();
  }, [shouldFloatTotalAmount]);

  const formatMoney = (value: number) => {
    return value.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const generateChargeSlipNo = () => {
    return `W26-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  const handleShowInfo = (message: string) => {
    setInfoMessage(message);
    setShowInfoModal(true);
  };

  const resetAddItemForm = (tab: ChargeCategory = activeTab) => {
    setActiveTab(tab);
    setSearchValue("");
    setSelectedItem(null);
    setQuantity(1);
  };

  const handleOpenAddItemModal = () => {
    setEditingRecordId(null);
    resetAddItemForm("Service");
    setShowAddItemModal(true);
  };

  const handleChangeTab = (tab: ChargeCategory) => {
    resetAddItemForm(tab);
  };

  const handleSelectItem = (item: ChargeItem) => {
    setSelectedItem(item);
    setQuantity(1);
  };

  const handleSaveChargeItem = () => {
    if (!selectedItem) {
      handleShowInfo("Please select an item first.");
      return;
    }

    if (quantity <= 0) {
      handleShowInfo("Quantity must be greater than zero.");
      return;
    }

    const savedCharge = {
      typeOfCharge:
        selectedItem.category === "Procedure"
          ? "Procedure"
          : selectedItem.category === "Oxygen"
          ? "Oxygen"
          : "Service Fee - Admitted",
      itemDescription: selectedItem.description,
      unitCost: selectedItem.rate,
      quantity,
      totalCost: selectedItem.rate * quantity,
    };

    if (editingRecordId) {
      setChargeRecords((prev) =>
        prev.map((record) =>
          record.id === editingRecordId
            ? {
                ...record,
                ...savedCharge,
              }
            : record
        )
      );
      setEditingRecordId(null);
      setShowAddItemModal(false);
      handleShowInfo("Item successfully updated.");
      return;
    }

    setChargeRecords((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...savedCharge,
        chargeSlipChecked: true,
        chargeSlipNo: "-",
        dateTimeEntered: formatDateTimeNow(),
        enteredBy: "Lique, Rowan M",
      },
    ]);
    setShowAddItemModal(false);
    handleShowInfo("Item successfully added.");
  };

  const handleGenerateChargeSlip = () => {
    const checkedRecordsWithoutSlip = chargeRecords.filter(
      (record) => record.chargeSlipChecked && record.chargeSlipNo === "-"
    );

    if (checkedRecordsWithoutSlip.length === 0) {
      handleShowInfo("Please check at least one item without a charge slip code.");
      return;
    }

    const slipNo = generateChargeSlipNo();

    setChargeRecords((prev) =>
      prev.map((record) =>
        record.chargeSlipChecked && record.chargeSlipNo === "-"
          ? {
              ...record,
              chargeSlipNo: slipNo,
              chargeSlipChecked: false,
            }
          : record
      )
    );

    handleShowInfo(`Charge slip successfully generated: ${slipNo}`);
  };

  const handleToggleChargeSlip = (id: number) => {
    setChargeRecords((prev) =>
      prev.map((record) =>
        record.id === id && record.chargeSlipNo === "-"
          ? {
              ...record,
              chargeSlipChecked: !record.chargeSlipChecked,
            }
          : record
      )
    );
  };

  const handleRequestDeleteRecord = (record: ChargeRecord) => {
    setRecordPendingDelete(record);
  };

  const handleCancelDeleteRecord = () => {
    setRecordPendingDelete(null);
  };

  const handleConfirmDeleteRecord = () => {
    if (!recordPendingDelete) return;

    setChargeRecords((prev) =>
      prev.filter((record) => record.id !== recordPendingDelete.id)
    );

    if (selectedRecord?.id === recordPendingDelete.id) {
      setSelectedRecord(null);
      setShowRecordDetailsModal(false);
    }

    setRecordPendingDelete(null);
  };

  const handleEditRecord = (record: ChargeRecord) => {
    const matchingItem = [...oxygenItems, ...serviceItems, ...procedureItems].find(
      (item) =>
        item.description === record.itemDescription &&
        item.rate === record.unitCost
    );
    const fallbackCategory: ChargeCategory =
      record.typeOfCharge === "Procedure"
        ? "Procedure"
        : record.typeOfCharge === "Oxygen"
        ? "Oxygen"
        : "Service";

    setEditingRecordId(record.id);
    setActiveTab(matchingItem?.category || fallbackCategory);
    setSearchValue("");
    setSelectedItem(
      matchingItem || {
        id: record.id,
        category: fallbackCategory,
        description: record.itemDescription,
        rate: record.unitCost,
      }
    );
    setQuantity(Math.max(1, record.quantity || 1));
    setShowAddItemModal(true);
  };

  const handleViewRecordDetails = (record: ChargeRecord) => {
    setSelectedRecord(record);
    setShowRecordDetailsModal(true);
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="px-3 py-2 border-bottom" style={{ background: "#eef5f8" }}>
      <h6 className="fw-bold mb-0 text-dark">{title}</h6>
    </div>
  );

  const DetailItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <div className="border rounded-1 bg-light p-3 h-100">
      <span
        className="text-muted d-block text-uppercase mb-1"
        style={{ fontSize: "0.7rem" }}
      >
        {label}
      </span>
      <span className="fw-bold text-dark">{value}</span>
    </div>
  );

  return (
    <>
      <div
        className="content nurse-content bg-light mt-n4"
        style={{ minHeight: "100vh" }}
      >
        <div className="container-fluid px-3 px-lg-5 pt-0">
          <div className="nurse-dashboard-layout">
            <NurseSidebar />

            <div className="nurse-dashboard-main mt-4 mt-lg-0">
              <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-4 acc-main-card charges-main-card">
                {/* patient profile header */}
                <div className="bg-white px-3 px-md-4 pt-4">
                  <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3 gap-md-4 pb-4 border-bottom text-center text-md-start">
                    <div
                      className="acc-patient-avatar rounded-circle d-flex align-items-center justify-content-center bg-light shadow-sm flex-shrink-0"
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

                    <div className="w-100">
                      <div className="badge bg-light text-secondary border mb-2 px-2 py-1">
                        ID: {mockPatientProfile.hospitalNumber}
                      </div>

                      <h3 className="acc-patient-name fw-bold mb-1 text-dark fs-3 fs-md-2">
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

                {/* toolbar buttons and warning */}
                <div className="bg-white px-3 px-md-4 py-3 border-bottom">
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-3">
                      <h5 className="fw-bold text-dark mb-0 text-center text-xl-start text-uppercase">
                        Charges
                      </h5>

                      <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center justify-content-lg-end gap-2 ms-xl-auto">
                        {hasItemWithoutChargeSlip && (
                          <div className="charges-warning-banner">
                            <i className="isax isax-warning-2"></i>
                            <span>
                              One or more items does not have charge slip code assigned.
                            </span>
                          </div>
                        )}

                        <div
                          className="charges-toolbar-actions d-flex flex-column flex-sm-row flex-wrap justify-content-center justify-content-xl-end pb-1 pb-lg-0"
                          style={{ gap: "6px" }}
                        >
                          <button
                            type="button"
                            className={`reg-toolbar-btn charges-add-item-btn btn btn-sm btn-primary shadow-sm align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap text-white fw-bold flex-grow-1 flex-md-grow-0 ${
                              chargeRecords.length > 0
                                ? "d-flex"
                                : "d-none d-lg-flex"
                            }`}
                            style={{ borderRadius: "4px", cursor: "pointer" }}
                            onClick={handleOpenAddItemModal}
                          >
                            <i className="isax isax-add-circle"></i>
                            <span>Add Item</span>
                          </button>

                          <button
                            type="button"
                            className={`reg-toolbar-btn btn btn-sm border border-secondary-subtle shadow-sm align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap bg-white text-dark fw-bold text-hover-primary flex-grow-1 flex-md-grow-0 ${
                              chargeRecords.length > 0
                                ? "d-flex"
                                : "d-none d-lg-flex"
                            }`}
                            style={{ borderRadius: "4px", cursor: "pointer" }}
                            onClick={handleGenerateChargeSlip}
                          >
                            <i className="isax isax-receipt-text"></i>
                            <span>Charge Slip</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <SectionHeader title="Patient Charges" />

                <div className="charges-card-body">
                  <div className="charges-table-area">
                    <div className="acc-table-wrap">
                      <table className="table table-sm align-middle mb-0 acc-table charges-table">
                        <thead>
                          <tr>
                            <th className="charges-col-type">Type of Charge</th>
                            <th className="charges-col-item">
                              Item Description
                            </th>
                            <th className="charges-col-unit text-end">
                              Unit Cost
                            </th>
                            <th className="charges-col-qty text-center">Qty</th>
                            <th className="charges-col-slip text-center">
                              Charge Slip
                            </th>
                            <th className="charges-col-actions text-center">
                              Actions
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {chargeRecords.map((record) => (
                            <tr
                              key={record.id}
                              className={
                                record.chargeSlipNo === "-"
                                  ? "charges-row-warning"
                                  : "acc-active-row"
                              }
                            >
                              <td>
                                <span className="acc-table-text fw-bold">
                                  {record.typeOfCharge}
                                </span>
                              </td>

                              <td>
                                <span className="acc-table-text">
                                  {record.itemDescription}
                                </span>
                              </td>

                              <td className="text-end">
                                <span className="acc-table-text">
                                  {formatMoney(record.unitCost)}
                                </span>
                              </td>

                              <td className="text-center">
                                <span className="acc-table-text">
                                  {record.quantity}
                                </span>
                              </td>

                              <td className="text-center">
                                {record.chargeSlipNo === "-" ? (
                                  <div className="d-flex justify-content-center align-items-center gap-2">
                                    <input
                                      type="checkbox"
                                      className="form-check-input charges-checkbox"
                                      checked={record.chargeSlipChecked}
                                      onChange={() =>
                                        handleToggleChargeSlip(record.id)
                                      }
                                    />

                                    <span className="charges-no-slip-text">
                                      No slip
                                    </span>
                                  </div>
                                ) : (
                                  <span className="charges-slip-code">
                                    {record.chargeSlipNo}
                                  </span>
                                )}
                              </td>

                              <td className="text-center charges-actions-cell">
                                <div className="charges-action-group">
                                  <button
                                    type="button"
                                    className="charges-action-btn charges-view-btn"
                                    onClick={() => handleViewRecordDetails(record)}
                                    title="View More"
                                  >
                                    <i className="isax isax-eye"></i>
                                    <span>View More</span>
                                  </button>

                                  <button
                                    type="button"
                                    className="charges-action-btn"
                                    onClick={() => handleEditRecord(record)}
                                    title="Edit"
                                  >
                                    <i className="isax isax-edit-2"></i>
                                    <span>Edit</span>
                                  </button>

                                  <button
                                    type="button"
                                    className="charges-action-btn charges-delete-btn"
                                    onClick={() =>
                                      handleRequestDeleteRecord(record)
                                    }
                                    title="Delete"
                                  >
                                    <i className="isax isax-trash"></i>
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}

                          {chargeRecords.length === 0 && (
                            <tr className="charges-empty-row d-table-row d-lg-none">
                              <td colSpan={6} className="charges-empty-cell">
                                <button
                                  type="button"
                                  className="charges-empty-add-btn"
                                  onClick={handleOpenAddItemModal}
                                >
                                  <span className="charges-empty-add-icon"></span>
                                  <span>Add Item</span>
                                </button>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="charges-total-bar" ref={totalBarRef}>
                    <span>Total Amount</span>
                    <strong>PHP {formatMoney(totalAmount)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showFloatingTotalAmount && (
        <div className="charges-floating-total shadow-lg">
          <span>Total Amount</span>
          <strong>PHP {formatMoney(totalAmount)}</strong>
        </div>
      )}

      {/* add item modal */}
      {showAddItemModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.45)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl px-2 charges-fixed-modal-dialog">
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden charges-fixed-modal-content">
              <div
                className="modal-header border-0"
                style={{ backgroundColor: "var(--primary, #0f763f)" }}
              >
                <div>
                  <h5 className="modal-title text-white fw-bold mb-0 d-flex align-items-center gap-2">
                    <i
                      className={`isax ${
                        isEditingCharge ? "isax-edit-2" : "isax-add-circle"
                      }`}
                    ></i>
                    {isEditingCharge ? "Edit Charge Item" : "Add Charge Item"}
                  </h5>
                  <div className="small text-white-50">
                    {isEditingCharge
                      ? "Update the selected charge item details."
                      : "Select an item from Oxygen, Service, or Procedure."}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setEditingRecordId(null);
                    setShowAddItemModal(false);
                  }}
                />
              </div>

              <div className="modal-body bg-white charges-fixed-modal-body">
                {/* simple tabs */}
                <div className="charges-simple-tabs">
                  <button
                    type="button"
                    className={`charges-simple-tab ${
                      activeTab === "Oxygen" ? "active" : ""
                    }`}
                    onClick={() => handleChangeTab("Oxygen")}
                  >
                    Oxygen
                  </button>

                  <button
                    type="button"
                    className={`charges-simple-tab ${
                      activeTab === "Service" ? "active" : ""
                    }`}
                    onClick={() => handleChangeTab("Service")}
                  >
                    Service
                  </button>

                  <button
                    type="button"
                    className={`charges-simple-tab ${
                      activeTab === "Procedure" ? "active" : ""
                    }`}
                    onClick={() => handleChangeTab("Procedure")}
                  >
                    Procedure
                  </button>
                </div>

                {!selectedItem ? (
                  <div className="charges-modal-list-panel">
                    <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                      <div>
                        <h6 className="fw-bold text-dark mb-1">
                          {activeTab} List
                        </h6>
                        <div className="small text-muted">
                          Click or double click an item to select.
                        </div>
                      </div>

                      <div className="w-100" style={{ maxWidth: "360px" }}>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={searchValue}
                          onChange={(event) =>
                            setSearchValue(event.target.value)
                          }
                          placeholder={`Search ${activeTab.toLowerCase()} item...`}
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="acc-table-wrap charges-modal-table-wrap">
                      <table className="table table-sm align-middle mb-0 acc-table charges-pick-simple-table">
                        <thead>
                          <tr>
                            <th>Item Description</th>
                            <th className="text-end">
                              {activeTab === "Procedure" ? "Rate" : "Cost"}
                            </th>
                            <th className="d-none d-md-table-cell">
                              {activeTab === "Procedure"
                                ? "Rate ID"
                                : "Other Description"}
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredItems.map((item) => (
                            <tr
                              key={item.id}
                              onClick={() => handleSelectItem(item)}
                              onDoubleClick={() => handleSelectItem(item)}
                              style={{ cursor: "pointer" }}
                            >
                              <td className="fw-semibold">
                                {item.description}
                              </td>
                              <td className="text-end">
                                {formatMoney(item.rate)}
                              </td>
                              <td className="d-none d-md-table-cell">
                                {item.otherDescription || ""}
                              </td>
                            </tr>
                          ))}

                          {filteredItems.length === 0 && (
                            <tr>
                              <td
                                colSpan={3}
                                className="text-center text-muted fw-semibold py-4"
                              >
                                No item found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                 <div className="charges-modal-selected-panel">
  <div className="charges-selected-large-card">
    <div className="charges-selected-header">
      <div>
        <div className="small text-muted fw-bold text-uppercase mb-1">
          Item Description
        </div>

        <h4 className="charges-selected-title">
          {selectedItem.description}
        </h4>
      </div>

      <button
        type="button"
        className="charges-change-item-btn"
        onClick={() => setSelectedItem(null)}
      >
        Change Item
      </button>
    </div>

    <div className="charges-calc-large-grid">
      <div className="charges-calc-box">
        <label>Rate</label>
        <input
          type="text"
          value={formatMoney(selectedItem.rate)}
          readOnly
        />
      </div>

      <div className="charges-calc-box charges-qty-box">
        <label>Quantity</label>

        <div className="charges-large-qty-control">
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          >
            -
          </button>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) =>
              setQuantity(Math.max(1, Number(event.target.value) || 1))
            }
          />

          <button
            type="button"
            onClick={() => setQuantity((prev) => prev + 1)}
          >
            +
          </button>
        </div>
      </div>

      <div className="charges-calc-box charges-total-box-large">
        <label>Total</label>
        <input
          type="text"
          value={formatMoney(selectedTotal)}
          readOnly
        />
      </div>
    </div>
  </div>
</div>
                )}
              </div>

              <div className="modal-footer border-0 bg-light">
                {!selectedItem ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-light border fw-bold px-4"
                    onClick={() => {
                      setEditingRecordId(null);
                      setShowAddItemModal(false);
                    }}
                  >
                    Cancel
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-sm btn-light border fw-bold px-4"
                      onClick={() => setSelectedItem(null)}
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm text-white fw-bold px-5"
                      style={{
                        backgroundColor: "var(--primary, #0f763f)",
                        borderColor: "var(--primary, #0f763f)",
                      }}
                      onClick={handleSaveChargeItem}
                    >
                      <i
                        className={`isax ${
                          isEditingCharge ? "isax-tick-circle" : "isax-add-circle"
                        } me-2`}
                      ></i>
                      {isEditingCharge ? "Save" : "Add"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* record details modal */}
      {showRecordDetailsModal && selectedRecord && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.45)", zIndex: 1070 }}
        >
          <div className="modal-dialog modal-dialog-centered acc-responsive-modal px-2">
            <div className="modal-content border-0 shadow-lg overflow-hidden">
              <div
                className="modal-header border-0"
                style={{ backgroundColor: "var(--primary, #0f763f)" }}
              >
                <div>
                  <h5 className="modal-title text-white fw-bold mb-0">
                    Charge Details
                  </h5>
                  <div className="small text-white-50">
                    Complete charge item information.
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowRecordDetailsModal(false)}
                />
              </div>

              <div className="modal-body bg-white">
                <div className="row g-3">
                  <div className="col-12">
                    <DetailItem
                      label="Type of Charge"
                      value={selectedRecord.typeOfCharge}
                    />
                  </div>

                  <div className="col-12">
                    <DetailItem
                      label="Item Description"
                      value={selectedRecord.itemDescription}
                    />
                  </div>

                  <div className="col-6">
                    <DetailItem
                      label="Unit Cost"
                      value={formatMoney(selectedRecord.unitCost)}
                    />
                  </div>

                  <div className="col-6">
                    <DetailItem label="Qty" value={selectedRecord.quantity} />
                  </div>

                  <div className="col-6">
                    <DetailItem
                      label="Total Cost"
                      value={formatMoney(selectedRecord.totalCost)}
                    />
                  </div>

                  <div className="col-6">
                    <DetailItem
                      label="Charge Slip"
                      value={selectedRecord.chargeSlipNo}
                    />
                  </div>

                  <div className="col-12">
                    <DetailItem
                      label="Date/Time Entered"
                      value={selectedRecord.dateTimeEntered}
                    />
                  </div>

                  <div className="col-12">
                    <DetailItem
                      label="Entered By"
                      value={selectedRecord.enteredBy}
                    />
                  </div>
                </div>
              </div>

              <div
                className="modal-footer border-0"
                style={{ backgroundColor: "#e2e5e9" }}
              >
                <button
                  type="button"
                  className="btn text-white fw-bold px-4"
                  style={{
                    backgroundColor: "var(--primary, #0f763f)",
                    borderColor: "var(--primary, #0f763f)",
                  }}
                  onClick={() => setShowRecordDetailsModal(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* delete confirmation modal */}
      {recordPendingDelete && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.45)", zIndex: 1075 }}
        >
          <div className="modal-dialog modal-dialog-centered px-2">
            <div className="modal-content border-0 shadow-lg overflow-hidden">
              <div className="modal-header border-0 bg-light">
                <div>
                  <h5 className="modal-title fw-bold mb-0 text-dark">
                    Delete Charge Item
                  </h5>
                  <div className="small text-muted">
                    This action will remove the charge from the patient list.
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCancelDeleteRecord}
                />
              </div>

              <div className="modal-body bg-white">
                <div className="d-flex gap-3 align-items-start">
                  <div className="charges-delete-confirm-icon">
                    <i className="isax isax-trash"></i>
                  </div>

                  <div>
                    <div className="fw-bold text-dark mb-1">
                      Are you sure you want to delete this charge?
                    </div>
                    <div className="small text-muted">
                      {recordPendingDelete.typeOfCharge} -{" "}
                      {recordPendingDelete.itemDescription}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 bg-light">
                <button
                  type="button"
                  className="btn btn-sm btn-light border fw-bold px-4"
                  onClick={handleCancelDeleteRecord}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-danger fw-bold px-4"
                  onClick={handleConfirmDeleteRecord}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* info modal */}
      {showInfoModal && (
        <div className="acc-info-backdrop">
          <div className="acc-info-box shadow-lg">
            <div className="acc-info-title">
              <span>Info</span>

              <button
                type="button"
                className="btn-close btn-close-sm"
                onClick={() => setShowInfoModal(false)}
              />
            </div>

            <div className="d-flex align-items-center gap-3 p-4">
              <div className="acc-info-icon">
                <i className="isax isax-info-circle"></i>
              </div>

              <div className="small fw-semibold text-dark">{infoMessage}</div>
            </div>

            <div className="d-flex justify-content-end px-4 pb-3">
              <button
                type="button"
                className="btn btn-sm text-white fw-bold px-4"
                style={{
                  backgroundColor: "var(--primary, #0f763f)",
                  borderColor: "var(--primary, #0f763f)",
                }}
                onClick={() => setShowInfoModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

  
    </>
  );
};

export default RegDetails;
