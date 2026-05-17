import NurseSidebar from "@/components/custom-sidebar/nurseSidebar";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";

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

  const totalAmount = chargeRecords.reduce(
    (sum, record) => sum + record.totalCost,
    0
  );

  const hasItemWithoutChargeSlip = chargeRecords.some(
    (record) => record.chargeSlipNo === "-"
  );

  useEffect(() => {
    const selectedPatientId = location.state?.selectedPatientId;

    if (selectedPatientId) {
      setTimeout(() => {}, 1500);
    }
  }, [location.state]);

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

  const handleAddChargeItem = () => {
    if (!selectedItem) {
      handleShowInfo("Please select an item first.");
      return;
    }

    if (quantity <= 0) {
      handleShowInfo("Quantity must be greater than zero.");
      return;
    }

    const newRecord: ChargeRecord = {
      id: Date.now(),
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
      chargeSlipChecked: true,
      chargeSlipNo: "-",
      dateTimeEntered: formatDateTimeNow(),
      enteredBy: "Lique, Rowan M",
    };

    setChargeRecords((prev) => [...prev, newRecord]);
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

  const handleDeleteRecord = (id: number) => {
    setChargeRecords((prev) => prev.filter((record) => record.id !== id));
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
                          className="d-flex flex-column flex-sm-row flex-wrap justify-content-center justify-content-xl-end pb-1 pb-lg-0"
                          style={{ gap: "6px" }}
                        >
                          <button
                            type="button"
                            className="reg-toolbar-btn charges-add-item-btn btn btn-sm btn-primary shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap text-white fw-bold flex-grow-1 flex-md-grow-0"
                            style={{ borderRadius: "4px", cursor: "pointer" }}
                            onClick={handleOpenAddItemModal}
                          >
                            <i className="isax isax-add-circle"></i>
                            <span>Add Item</span>
                          </button>

                          <button
                            type="button"
                            className="reg-toolbar-btn btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap bg-white text-dark fw-bold text-hover-primary flex-grow-1 flex-md-grow-0"
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
                            <th className="charges-col-delete"></th>
                            <th className="charges-col-type">Type of Charge</th>
                            <th className="charges-col-item">
                              Item Description
                            </th>
                            <th className="charges-col-unit text-end">
                              Unit Cost
                            </th>
                            <th className="charges-col-qty text-center">Qty</th>
                            <th className="charges-col-total text-end">
                              Total Cost
                            </th>
                            <th className="charges-col-slip text-center">
                              Charge Slip
                            </th>
                            <th className="charges-col-date d-none d-lg-table-cell">
                              Date/Time Entered
                            </th>
                            <th className="charges-col-entered d-none d-xl-table-cell">
                              Entered by
                            </th>
                            <th className="text-end d-table-cell d-lg-none">
                              Action
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
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="charges-delete-btn"
                                  onClick={() => handleDeleteRecord(record.id)}
                                  title="Delete"
                                >
                                  <i className="isax isax-trash"></i>
                                </button>
                              </td>

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

                              <td className="text-end">
                                <span className="acc-table-text fw-bold">
                                  {formatMoney(record.totalCost)}
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

                              <td className="d-none d-lg-table-cell">
                                <span className="acc-table-text">
                                  {record.dateTimeEntered}
                                </span>
                              </td>

                              <td className="d-none d-xl-table-cell">
                                <span className="acc-table-text">
                                  {record.enteredBy}
                                </span>
                              </td>

                              <td className="text-end d-table-cell d-lg-none">
                                <button
                                  type="button"
                                  className="acc-view-btn"
                                  onClick={() => handleViewRecordDetails(record)}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="charges-total-bar">
                    <span>Total Amount</span>
                    <strong>{formatMoney(totalAmount)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                    <i className="isax isax-add-circle"></i>
                    Add Charge Item
                  </h5>
                  <div className="small text-white-50">
                    Select an item from Oxygen, Service, or Procedure.
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAddItemModal(false)}
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
                    onClick={() => setShowAddItemModal(false)}
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
                      onClick={handleAddChargeItem}
                    >
                      <i className="isax isax-add-circle me-2"></i>
                      Add
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

      <style>{`
        .charges-main-card {
          min-height: calc(100vh - 190px);
        }

        .charges-card-body {
          display: flex;
          flex-direction: column;
          min-height: calc(100vh - 435px);
          padding: 16px;
          background: #fff;
        }

        .charges-table-area {
          flex: 1 1 auto;
        }

        .charges-warning-banner {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 38px;
          padding: 8px 12px;
          border-radius: 4px;
          background: #fff3cd;
          border: 1px solid #ffecb5;
          color: #856404;
          font-size: 0.82rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .charges-warning-banner i {
          font-size: 1rem;
        }

        .charges-total-bar {
          position: sticky;
          bottom: 0;
          z-index: 20;
          margin-top: auto;
          background: #fff;
          color: #1f2a44;
          min-height: 44px;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 10px 0;
          font-size: 1rem;
          border-top: 1px solid #eef1f4;
        }

        .charges-total-bar strong {
          font-size: 1rem;
          font-weight: 800;
        }

        .acc-table-wrap {
          width: 100%;
          overflow-x: auto;
          border: 1px solid #d8e2e5;
          border-radius: 4px;
          background: #fff;
        }

        .charges-table {
          table-layout: fixed;
          min-width: 1120px;
        }

        .charges-table thead th {
          background: #eef3f7;
          color: #111827;
          font-size: 0.78rem;
          font-weight: 800;
          white-space: nowrap;
          padding: 0.75rem 0.75rem;
          border-bottom: 1px solid #d8e2e5;
        }

        .charges-table tbody td {
          font-size: 0.86rem;
          padding: 0.75rem 0.75rem;
          vertical-align: middle;
          color: #344054;
        }

        .charges-table tbody tr {
          background: #fff;
        }

        .charges-table tbody tr:hover {
          background: #f7fbf9;
        }

        .charges-row-warning {
          background: #fffaf0 !important;
        }

        .charges-row-warning:hover {
          background: #fff4d8 !important;
        }

        .charges-col-delete {
          width: 48px;
        }

        .charges-col-type {
          width: 150px;
        }

        .charges-col-item {
          width: 190px;
        }

        .charges-col-unit {
          width: 105px;
        }

        .charges-col-qty {
          width: 70px;
        }

        .charges-col-total {
          width: 110px;
        }

        .charges-col-slip {
          width: 150px;
        }

        .charges-col-date {
          width: 150px;
        }

        .charges-col-entered {
          width: 150px;
        }

        .acc-table-text {
          display: inline-block;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: middle;
        }

        .charges-delete-btn {
          border: 0;
          background: transparent;
          color: #5b9a9a;
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }

        .charges-delete-btn:hover {
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
        }

        .charges-checkbox {
          width: 16px;
          height: 16px;
          cursor: pointer;
          border-color: var(--primary, #0f763f);
        }

        .charges-checkbox:checked {
          background-color: var(--primary, #0f763f);
          border-color: var(--primary, #0f763f);
        }

        .charges-no-slip-text {
          color: #b45309;
          font-size: 0.75rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .charges-slip-code {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 24px;
          padding: 3px 8px;
          border-radius: 4px;
          background: rgba(15, 118, 63, 0.1);
          color: var(--primary, #0f763f);
          font-size: 0.78rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .reg-toolbar-btn:hover {
          color: var(--primary, #0f763f) !important;
          border-color: var(--primary, #0f763f) !important;
        }

        .charges-add-item-btn,
        .charges-add-item-btn:hover,
        .charges-add-item-btn:focus,
        .charges-add-item-btn:active,
        .charges-add-item-btn.active,
        .charges-add-item-btn.show {
          background-color: var(--primary, #0f763f) !important;
          border-color: var(--primary, #0f763f) !important;
          color: #fff !important;
        }

        .charges-add-item-btn:focus,
        .charges-add-item-btn:focus-visible {
          box-shadow: 0 0 0 0.2rem rgba(15, 118, 63, 0.25) !important;
        }

        .acc-view-btn {
          border: 1px solid var(--primary, #0f763f);
          color: var(--primary, #0f763f);
          background: #fff;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 10px;
        }

        .acc-view-btn:hover {
          background: var(--primary, #0f763f);
          color: #fff;
        }

        .charges-fixed-modal-dialog {
          max-width: 1120px;
        }

        .charges-fixed-modal-content {
          height: 78vh;
          min-height: 620px;
          max-height: 780px;
          display: flex;
          flex-direction: column;
        }

        .charges-fixed-modal-body {
          flex: 1 1 auto;
          overflow: hidden;
          padding: 0;
          display: flex;
          flex-direction: column;
        }

        .charges-simple-tabs {
          display: flex;
          align-items: center;
          gap: 0;
          background: #f8fafc;
          border-bottom: 1px solid #dee2e6;
          padding: 0 16px;
          flex-shrink: 0;
        }

        .charges-simple-tab {
          border: 0;
          border-bottom: 3px solid transparent;
          background: transparent;
          color: #495057;
          font-size: 0.9rem;
          font-weight: 800;
          padding: 14px 18px 11px;
          border-radius: 0;
          min-width: 110px;
        }

        .charges-simple-tab:hover {
          color: var(--primary, #0f763f);
          background: rgba(15, 118, 63, 0.05);
        }

        .charges-simple-tab.active {
          color: var(--primary, #0f763f);
          border-bottom-color: var(--primary, #0f763f);
          background: #fff;
        }

        .charges-modal-list-panel,
        .charges-modal-selected-panel {
          flex: 1 1 auto;
          min-height: 0;
          padding: 18px;
          display: flex;
          flex-direction: column;
        }

        .charges-modal-table-wrap {
          flex: 1 1 auto;
          min-height: 0;
          overflow: auto;
        }

        .charges-pick-simple-table {
          table-layout: fixed;
          min-width: 780px;
        }

        .charges-pick-simple-table thead th {
          background: #eef3f7;
          color: #111827;
          font-size: 0.78rem;
          font-weight: 800;
          white-space: nowrap;
          padding: 0.7rem 0.75rem;
          border-bottom: 1px solid #d8e2e5;
          position: sticky;
          top: 0;
          z-index: 2;
        }

        .charges-pick-simple-table tbody td {
          font-size: 0.84rem;
          padding: 0.62rem 0.75rem;
          vertical-align: middle;
          color: #344054;
        }

        .charges-pick-simple-table tbody tr:nth-child(odd) {
          background: #fff;
        }

        .charges-pick-simple-table tbody tr:nth-child(even) {
          background: #f8faf9;
        }

        .charges-pick-simple-table tbody tr:hover {
          background: rgba(15, 118, 63, 0.12) !important;
        }

        .acc-info-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1080;
          background: rgba(0, 0, 0, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .acc-info-box {
          width: min(92vw, 420px);
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
        }

        .acc-info-title {
          background: #f1f3f5;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 800;
        }

        .acc-info-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(15, 118, 63, 0.1);
          color: var(--primary, #0f763f);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.35rem;
          flex-shrink: 0;
        }

        @media (max-width: 1199.98px) {
          .charges-table {
            min-width: 1040px;
          }

          .charges-col-entered {
            width: 130px;
          }

          .charges-warning-banner {
            width: 100%;
            white-space: normal;
            justify-content: flex-start;
          }
        }

        @media (max-width: 991.98px) {
          .charges-main-card {
            min-height: calc(100vh - 160px);
          }

          .charges-card-body {
            min-height: calc(100vh - 400px);
            padding: 12px;
          }

          .charges-table {
            min-width: 880px;
          }

          .charges-fixed-modal-content {
            height: 82vh;
            min-height: 560px;
          }

          .charges-simple-tabs {
            overflow-x: auto;
            padding: 0 10px;
          }

          .charges-simple-tab {
            min-width: 100px;
            padding: 12px 14px 9px;
            font-size: 0.84rem;
          }
        }

        @media (max-width: 575.98px) {
          .charges-card-body {
            min-height: calc(100vh - 430px);
            padding: 10px;
          }

          .charges-total-bar {
            justify-content: center;
          }

          .charges-fixed-modal-content {
            height: 86vh;
            min-height: 520px;
          }

          .charges-modal-list-panel,
          .charges-modal-selected-panel {
            padding: 14px;
          }

          .charges-simple-tab {
            min-width: 95px;
          }
        }
          .charges-selected-large-card {
  flex: 1 1 auto;
  min-height: 0;
  background: #f8fafc;
  border: 1px solid #d8e2e5;
  border-radius: 10px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.charges-selected-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 34px;
}

.charges-selected-title {
  color: #111827;
  font-size: 1.65rem;
  font-weight: 900;
  line-height: 1.25;
  margin-bottom: 0;
}

.charges-change-item-btn {
  border: 1px solid var(--primary, #0f763f);
  background: #fff;
  color: var(--primary, #0f763f);
  border-radius: 6px;
  padding: 9px 18px;
  font-size: 0.85rem;
  font-weight: 800;
  white-space: nowrap;
}

.charges-change-item-btn:hover {
  background: var(--primary, #0f763f);
  color: #fff;
}

.charges-calc-large-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 18px;
}

.charges-calc-box {
  background: #fff;
  border: 1px solid #d8e2e5;
  border-radius: 10px;
  padding: 18px;
  min-height: 145px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.charges-calc-box label {
  color: #6b7280;
  font-size: 0.82rem;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.charges-calc-box input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #111827;
  font-size: 1.55rem;
  font-weight: 900;
  text-align: right;
  padding: 0;
}

.charges-large-qty-control {
  display: grid;
  grid-template-columns: 48px 1fr 48px;
  border: 1px solid #d8e2e5;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  min-height: 54px;
}

.charges-large-qty-control button {
  border: 0;
  background: #eef3f7;
  color: #111827;
  font-size: 1.4rem;
  font-weight: 900;
}

.charges-large-qty-control button:hover {
  background: rgba(15, 118, 63, 0.12);
  color: var(--primary, #0f763f);
}

.charges-large-qty-control input {
  border-left: 1px solid #d8e2e5;
  border-right: 1px solid #d8e2e5;
  text-align: center;
  font-size: 1.45rem;
}

.charges-total-box-large {
  background: rgba(15, 118, 63, 0.07);
  border-color: rgba(15, 118, 63, 0.25);
}

.charges-total-box-large input {
  color: var(--primary, #0f763f);
}

/* TABLET */
@media (max-width: 991.98px) {
  .charges-selected-large-card {
    justify-content: flex-start;
    padding: 22px;
    overflow-y: auto;
  }

  .charges-selected-header {
    margin-bottom: 22px;
  }

  .charges-selected-title {
    font-size: 1.35rem;
  }

  .charges-calc-large-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .charges-calc-box {
    min-height: 118px;
    padding: 16px;
  }

  .charges-calc-box input {
    font-size: 1.35rem;
  }

  .charges-large-qty-control {
    min-height: 50px;
  }
}

/* SMALL TABLET / PHONE */
@media (max-width: 575.98px) {
  .charges-selected-large-card {
    padding: 16px;
  }

  .charges-selected-header {
    flex-direction: column;
    gap: 12px;
  }

  .charges-selected-title {
    font-size: 1.1rem;
  }

  .charges-change-item-btn {
    width: 100%;
  }

  .charges-calc-box {
    min-height: 105px;
  }

  .charges-calc-box input {
    font-size: 1.15rem;
  }

  .charges-large-qty-control {
    grid-template-columns: 44px 1fr 44px;
  }
}
      `}</style>
    </>
  );
};

export default RegDetails;
