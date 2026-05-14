import NurseSidebar from "@/components/custom-sidebar/nurseSidebar";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

/* patient accomodation module */
const RegDetails = () => {
  const [open, setOpen] = useState(false);
  const [showEditRoomModal, setShowEditRoomModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showRecordDetailsModal, setShowRecordDetailsModal] = useState(false);

  const [infoMessage, setInfoMessage] = useState("");
  const [selectedTransferWard, setSelectedTransferWard] = useState("Ward 1A - Medicine");
  const [selectedTransferBed, setSelectedTransferBed] = useState<string | null>(null);
  const [selectedEditRoom, setSelectedEditRoom] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<AccomodationRecord | null>(null);

  const location = useLocation();

  type AccomodationRecord = {
    id: number;
    ward: string;
    room: string;
    bed: string;
    dateFrom: string;
    dateTo: string;
    lengthOfStay: string;
    status: "Active" | "Inactive";
  };

  type RoomBed = {
    bed: string;
    status: "Occupied" | "Vacant";
    allowedOccupant: number;
    actualOccupant: number;
    patient?: string;
  };

  type RoomGroup = {
    roomName: string;
    beds: RoomBed[];
  };

  const [mockPatientProfile] = useState({
    hospitalNumber: "000000000777288",
    lastName: "DO",
    firstName: "REA",
    middleName: "MON",
    address: "111 Estanza, Legazpi City, Albay",
  });

  const [accomodationRecords, setAccomodationRecords] = useState<AccomodationRecord[]>([
    {
      id: 1,
      ward: "Ph Med",
      room: "6104",
      bed: "000",
      dateFrom: "03/21/26 02:45 PM",
      dateTo: "-",
      lengthOfStay: "0 day and 1 hr",
      status: "Active",
    },
  ]);

  const transferWards = [
    "CCU",
    "MICU",
    "NICU",
    "NICU Trans",
    "PICU",
    "PIMAM",
    "Private/Pay",
    "SICU",
    "Surge Ward",
    "Ward 1A - Medicine",
    "Ward 1B - Medicine",
    "Ward 1C - Medicine",
    "Ward 2A - Pedia",
    "Ward 2B - Pedia",
    "Ward 3A - Surgery",
    "Ward 3B - Surgery",
    "Ward 3C - Surgery",
    "Ward 4A - Ob Gyne",
    "Ward 4B - Ob Gyne",
    "Ward 4C - Ob Gyne",
  ];

  const transferRoomGroups: Record<string, RoomGroup[]> = {
    "Ward 1A - Medicine": [
      {
        roomName: "RM1A",
        beds: [
          {
            bed: "---",
            status: "Occupied",
            allowedOccupant: 50,
            actualOccupant: 34,
            patient: "000000000777288 - DO, REA MON",
          },
          {
            bed: "Bed 001",
            status: "Occupied",
            allowedOccupant: 1,
            actualOccupant: 1,
            patient: "000000000774773 - LAURETA, LEA OSTRIA",
          },
          {
            bed: "Bed 002",
            status: "Occupied",
            allowedOccupant: 1,
            actualOccupant: 1,
          },
          {
            bed: "Bed 003",
            status: "Occupied",
            allowedOccupant: 1,
            actualOccupant: 1,
            patient: "000000000730927 - ELLA, JOSEFINA BOROC",
          },
          {
            bed: "Bed 004",
            status: "Occupied",
            allowedOccupant: 1,
            actualOccupant: 1,
            patient: "000000000024412 - NUEVA, PATRIA LIM",
          },
          {
            bed: "Bed 005",
            status: "Occupied",
            allowedOccupant: 1,
            actualOccupant: 1,
            patient: "000000001011233 - MORCOZO, AILEEN CALSADO",
          },
          {
            bed: "Bed 006",
            status: "Occupied",
            allowedOccupant: 1,
            actualOccupant: 1,
            patient: "000000000783429 - ESTEVES, SERINE GUEVARRA",
          },
          {
            bed: "Bed 007",
            status: "Vacant",
            allowedOccupant: 1,
            actualOccupant: 0,
          },
          {
            bed: "Bed 008",
            status: "Occupied",
            allowedOccupant: 1,
            actualOccupant: 1,
            patient: "000000000768213 - ABINES, GHEEMAR KYLE TARROQUIN",
          },
          {
            bed: "Bed 009",
            status: "Occupied",
            allowedOccupant: 1,
            actualOccupant: 1,
            patient: "00000000660304 - LEGASPI, JOYCE BALANA",
          },
          {
            bed: "Bed 010",
            status: "Vacant",
            allowedOccupant: 1,
            actualOccupant: 0,
          },
          {
            bed: "Bed 011",
            status: "Vacant",
            allowedOccupant: 1,
            actualOccupant: 0,
          },
          {
            bed: "Bed 012",
            status: "Vacant",
            allowedOccupant: 1,
            actualOccupant: 0,
          },
          {
            bed: "Bed 013",
            status: "Vacant",
            allowedOccupant: 1,
            actualOccupant: 0,
          },
        ],
      },
    ],
    CCU: [],
    MICU: [],
    NICU: [],
    "NICU Trans": [],
    PICU: [],
    PIMAM: [],
    "Private/Pay": [],
    SICU: [],
    "Surge Ward": [],
    "Ward 1B - Medicine": [],
    "Ward 1C - Medicine": [],
    "Ward 2A - Pedia": [],
    "Ward 2B - Pedia": [],
    "Ward 3A - Surgery": [],
    "Ward 3B - Surgery": [],
    "Ward 3C - Surgery": [],
    "Ward 4A - Ob Gyne": [],
    "Ward 4B - Ob Gyne": [],
    "Ward 4C - Ob Gyne": [],
  };

  const editRoomGroups: RoomGroup[] = [
    {
      roomName: "6104",
      beds: [
        {
          bed: "000",
          status: "Occupied",
          allowedOccupant: 50,
          actualOccupant: 1,
        },
        {
          bed: "001",
          status: "Vacant",
          allowedOccupant: 1,
          actualOccupant: 0,
        },
        {
          bed: "002",
          status: "Vacant",
          allowedOccupant: 1,
          actualOccupant: 0,
        },
        {
          bed: "003",
          status: "Vacant",
          allowedOccupant: 1,
          actualOccupant: 0,
        },
        {
          bed: "004",
          status: "Vacant",
          allowedOccupant: 1,
          actualOccupant: 0,
        },
        {
          bed: "005",
          status: "Vacant",
          allowedOccupant: 1,
          actualOccupant: 0,
        },
        {
          bed: "006",
          status: "Vacant",
          allowedOccupant: 1,
          actualOccupant: 0,
        },
      ],
    },
    {
      roomName: "6105",
      beds: [
        {
          bed: "000",
          status: "Occupied",
          allowedOccupant: 50,
          actualOccupant: 1,
        },
        {
          bed: "001",
          status: "Vacant",
          allowedOccupant: 2,
          actualOccupant: 0,
        },
        {
          bed: "002",
          status: "Vacant",
          allowedOccupant: 1,
          actualOccupant: 0,
        },
        {
          bed: "003",
          status: "Vacant",
          allowedOccupant: 1,
          actualOccupant: 0,
        },
        {
          bed: "004",
          status: "Vacant",
          allowedOccupant: 1,
          actualOccupant: 0,
        },
        {
          bed: "005",
          status: "Vacant",
          allowedOccupant: 1,
          actualOccupant: 0,
        },
        {
          bed: "006",
          status: "Vacant",
          allowedOccupant: 1,
          actualOccupant: 0,
        },
        {
          bed: "007",
          status: "Vacant",
          allowedOccupant: 1,
          actualOccupant: 0,
        },
      ],
    },
    {
      roomName: "6106",
      beds: [
        {
          bed: "000",
          status: "Vacant",
          allowedOccupant: 50,
          actualOccupant: 0,
        },
      ],
    },
  ];

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

  const getCurrentDateTime = () => {
    return "03/21/26 03:32 PM";
  };

  const getTotalLengthOfStay = () => {
    return "0 day and 1 hr";
  };

  const editTotalBeds = editRoomGroups.reduce(
    (total, room) => total + room.beds.length,
    0
  );

  const editVacantBeds = editRoomGroups.reduce(
    (total, room) =>
      total + room.beds.filter((bed) => bed.status === "Vacant").length,
    0
  );

  const selectedEditRoomLabel = selectedEditRoom
    ? selectedEditRoom.replace("|", " - Bed ")
    : "No bed selected";

  const selectedTransferBedLabel = selectedTransferBed
    ? selectedTransferBed.replace("|", " - ")
    : "No vacant bed selected";

  const handleOpenEditRoomModal = () => {
    setSelectedEditRoom(null);
    setShowEditRoomModal(true);
  };

  const handleOpenTransferModal = () => {
    setSelectedTransferWard("Ward 1A - Medicine");
    setSelectedTransferBed(null);
    setShowTransferModal(true);
  };

  const handleShowInfo = (message: string) => {
    setInfoMessage(message);
    setShowInfoModal(true);
  };

  const handleViewRecordDetails = (record: AccomodationRecord) => {
    setSelectedRecord(record);
    setShowRecordDetailsModal(true);
  };

  const handleSaveEditRoom = () => {
    if (!selectedEditRoom) {
      handleShowInfo("Please select a room and bed before saving.");
      return;
    }

    const [room, bed] = selectedEditRoom.split("|");

    setAccomodationRecords((prev) =>
      prev.map((record) =>
        record.status === "Active"
          ? {
              ...record,
              room,
              bed,
            }
          : record
      )
    );

    setShowEditRoomModal(false);
    handleShowInfo("Room and bed successfully updated.");
  };

  const handleTransferPatient = () => {
    if (!selectedTransferBed) return;

    const currentDateTime = getCurrentDateTime();
    const [room, bed] = selectedTransferBed.split("|");

    setAccomodationRecords((prev) => {
      const updatedRecords = prev.map((record) =>
        record.status === "Active"
          ? {
              ...record,
              dateTo: currentDateTime,
              status: "Inactive" as const,
            }
          : record
      );

      return [
        ...updatedRecords,
        {
          id: Date.now(),
          ward: selectedTransferWard,
          room,
          bed,
          dateFrom: currentDateTime,
          dateTo: "-",
          lengthOfStay: "0 day and 0 hr",
          status: "Active",
        },
      ];
    });

    setShowTransferModal(false);
    handleShowInfo("Transfer successfully completed.");
  };

  const handleRevoke = () => {
    setAccomodationRecords((prev) =>
      prev.map((record) =>
        record.status === "Active"
          ? {
              ...record,
              dateTo: getCurrentDateTime(),
              status: "Inactive",
            }
          : record
      )
    );

    handleShowInfo("Revoke successfully completed.");
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

  const RoomBedMobileCard = ({
    room,
    bed,
    selectedValue,
    onSelect,
    allowOnlyVacant = false,
  }: {
    room: RoomGroup;
    bed: RoomBed;
    selectedValue: string | null;
    onSelect: (value: string) => void;
    allowOnlyVacant?: boolean;
  }) => {
    const value = `${room.roomName}|${bed.bed}`;
    const isSelected = selectedValue === value;
    const canSelect = allowOnlyVacant ? bed.status === "Vacant" : true;

    return (
      <button
        type="button"
        disabled={!canSelect}
        className={`acc-bed-card text-start ${isSelected ? "selected" : ""}`}
        onClick={() => {
          if (canSelect) onSelect(value);
        }}
      >
        <div className="d-flex justify-content-between gap-2 mb-2">
          <div>
            <div className="small text-muted fw-semibold">Room / Bed</div>
            <div className="fw-bold text-dark">
              {room.roomName} - {bed.bed}
            </div>
          </div>

          <span
            className={`badge rounded-pill px-3 py-2 ${
              bed.status === "Vacant" ? "acc-bed-vacant" : "acc-bed-occupied"
            }`}
          >
            {bed.status}
          </span>
        </div>

        <div className="row g-2 small">
          <div className="col-6">
            <span className="text-muted d-block">Allowed</span>
            <span className="fw-bold text-dark">{bed.allowedOccupant}</span>
          </div>

          <div className="col-6">
            <span className="text-muted d-block">Actual</span>
            <span className="fw-bold text-dark">{bed.actualOccupant}</span>
          </div>

          <div className="col-12">
            <span className="text-muted d-block">Patient</span>
            <span className="fw-semibold text-dark acc-mobile-patient">
              {bed.patient || "—"}
            </span>
          </div>
        </div>

        {isSelected && (
          <div
            className="small fw-bold mt-2"
            style={{ color: "var(--primary, #0f763f)" }}
          >
            Selected
          </div>
        )}
      </button>
    );
  };

  const RoomRow = ({
    room,
    bed,
    selectedValue,
    onSelect,
    allowOnlyVacant = false,
  }: {
    room: RoomGroup;
    bed: RoomBed;
    selectedValue: string | null;
    onSelect: (value: string) => void;
    allowOnlyVacant?: boolean;
  }) => {
    const value = `${room.roomName}|${bed.bed}`;
    const isSelected = selectedValue === value;
    const canSelect = allowOnlyVacant ? bed.status === "Vacant" : true;

    return (
      <tr
        className={isSelected ? "acc-room-selected" : ""}
        onClick={() => {
          if (canSelect) onSelect(value);
        }}
        style={{
          cursor: canSelect ? "pointer" : "default",
        }}
      >
        <td style={{ width: "40px" }}>
          {isSelected ? (
            <span
              className="rounded-circle d-inline-flex align-items-center justify-content-center"
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: "var(--primary, #0f763f)",
                color: "#fff",
              }}
            >
              <i className="isax isax-tick-circle" style={{ fontSize: "14px" }}></i>
            </span>
          ) : bed.status === "Occupied" ? (
            <i className="isax isax-user text-muted"></i>
          ) : (
            <i className="isax isax-hospital text-muted"></i>
          )}
        </td>

        <td
          className={
            bed.status === "Vacant"
              ? "small fw-bold text-danger"
              : "small fw-bold text-dark"
          }
        >
          {bed.bed}
        </td>

        <td
          className={
            bed.status === "Vacant"
              ? "small fw-semibold text-danger"
              : "small fw-semibold text-muted"
          }
        >
          {bed.status}
        </td>

        <td className="small fw-bold text-center">{bed.allowedOccupant}</td>
        <td className="small fw-bold text-center">{bed.actualOccupant}</td>

        <td className="small fw-semibold text-dark text-truncate">
          {bed.patient || ""}
        </td>
      </tr>
    );
  };

  return (
    <>
      {/* page content */}
      <div
        className="content nurse-content bg-light mt-n4"
        style={{ minHeight: "100vh" }}
      >
        <div className="container-fluid px-3 px-lg-5 pt-0">
          <div className="row">
            {/* nurse sidebar */}
            <NurseSidebar />

            {/* specific patient record */}
            <div className="col-lg-8 col-xl-9 mt-4 mt-lg-0">
              <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-4 acc-main-card">
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

                {/* toolbar buttons */}
                <div className="bg-white px-3 px-md-4 py-3 border-bottom">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <h5 className="fw-bold text-dark mb-0 text-center text-md-start text-uppercase">
                      Accomodation
                    </h5>

                    <div
                      className="d-flex flex-column flex-sm-row flex-wrap justify-content-center justify-content-md-end pb-1 pb-lg-0 ms-md-auto"
                      style={{ gap: "6px" }}
                    >
                      <button
                        type="button"
                        className="reg-toolbar-btn btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap bg-white text-dark fw-bold text-hover-primary flex-grow-1 flex-md-grow-0"
                        style={{ borderRadius: "4px", cursor: "pointer" }}
                        onClick={handleOpenEditRoomModal}
                      >
                        <i className="isax isax-edit"></i>
                        <span>Edit Room</span>
                      </button>

                      <button
                        type="button"
                        className="reg-toolbar-btn btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap bg-white text-dark fw-bold text-hover-primary flex-grow-1 flex-md-grow-0"
                        style={{ borderRadius: "4px", cursor: "pointer" }}
                        onClick={handleOpenTransferModal}
                      >
                        <i className="isax isax-forward"></i>
                        <span>Transfer</span>
                      </button>

                      <button
                        type="button"
                        className="reg-toolbar-btn btn btn-sm border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-nowrap bg-white text-danger fw-bold flex-grow-1 flex-md-grow-0"
                        style={{ borderRadius: "4px", cursor: "pointer" }}
                        onClick={handleRevoke}
                      >
                        <i className="isax isax-close-circle"></i>
                        <span>Revoke</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* accomodation table */}
                <SectionHeader title="Ward and Room Accomodation" />

                <div className="p-2 p-md-3">
                  <div className="acc-table-wrap">
                    <table className="table table-sm align-middle mb-0 acc-table">
                      <thead>
                        <tr>
                          <th className="acc-col-ward">Ward</th>
                          <th className="acc-col-room">Room</th>
                          <th className="acc-col-bed">Bed</th>
                          <th className="d-none d-lg-table-cell">Date From</th>
                          <th className="d-none d-xl-table-cell">Date To</th>
                          <th className="d-none d-lg-table-cell">Length of Stay</th>
                          <th className="text-end acc-col-status">Status</th>
                          <th className="text-end acc-col-action d-table-cell d-lg-none">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {accomodationRecords.map((record) => (
                          <tr
                            key={record.id}
                            className={
                              record.status === "Active"
                                ? "acc-active-row"
                                : "acc-inactive-row"
                            }
                          >
                            <td>
                              <span className="acc-table-text">{record.ward}</span>
                            </td>

                            <td>
                              <span className="acc-table-text">{record.room}</span>
                            </td>

                            <td>
                              <span className="acc-table-text">{record.bed}</span>
                            </td>

                            <td className="d-none d-lg-table-cell">
                              <span className="acc-table-text">{record.dateFrom}</span>
                            </td>

                            <td className="d-none d-xl-table-cell">
                              <span className="acc-table-text">{record.dateTo}</span>
                            </td>

                            <td className="d-none d-lg-table-cell">
                              <span className="acc-table-text">
                                {record.lengthOfStay}
                              </span>
                            </td>

                            <td className="text-end">
                              <span
                                className={`badge rounded-pill px-3 py-2 ${
                                  record.status === "Active"
                                    ? "acc-status-active"
                                    : "acc-status-inactive"
                                }`}
                              >
                                {record.status}
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

                  <div className="acc-total-los">
                    Total LOS : {getTotalLengthOfStay()}
                  </div>
                </div>

                <div className="d-none d-xl-block" style={{ minHeight: "420px" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* transfer utility modal */}
      {showTransferModal && (
        <div className="acc-window-backdrop">
          <div className="acc-window shadow-lg">
            <div className="acc-window-title">
              <div>
                <h5 className="fw-bold mb-0">Transfer Utility</h5>
                <div className="small opacity-75">
                  Select a vacant bed to transfer the patient.
                </div>
              </div>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowTransferModal(false)}
              />
            </div>

            <div className="acc-window-body">
              <div className="acc-side-panel hide-scrollbar">
                <ul className="acc-ward-list">
                  {transferWards.map((ward) => (
                    <li
                      key={ward}
                      className={selectedTransferWard === ward ? "active" : ""}
                      onClick={() => {
                        setSelectedTransferWard(ward);
                        setSelectedTransferBed(null);
                      }}
                    >
                      {ward}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="acc-modal-content">
                <div className="acc-room-container hide-scrollbar">
                  {transferRoomGroups[selectedTransferWard]?.length > 0 ? (
                    transferRoomGroups[selectedTransferWard].map((room) => (
                      <div key={room.roomName}>
                        <div className="acc-room-header">
                          <div className="acc-room-title">
                            {selectedTransferWard}
                          </div>

                          <div className="acc-room-stats">
                            <span>Total No. of Bed : 90</span>
                            <span>Number of Vacant Bed : 48</span>
                          </div>
                        </div>

                        <div className="acc-room-name-row">
                          <span>Room Name :</span>
                          <span>{room.roomName}</span>
                          <span className="ms-auto acc-small-head">
                            Allowed
                            <br />
                            Occupant
                          </span>
                          <span className="acc-small-head">
                            Actual
                            <br />
                            Occupant
                          </span>
                        </div>

                        <div className="acc-desktop-room-list">
                          <table className="acc-room-table">
                            <tbody>
                              {room.beds.map((bed) => (
                                <RoomRow
                                  key={bed.bed}
                                  room={room}
                                  bed={bed}
                                  selectedValue={selectedTransferBed}
                                  onSelect={setSelectedTransferBed}
                                  allowOnlyVacant
                                />
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="acc-mobile-room-list">
                          {room.beds.map((bed) => (
                            <RoomBedMobileCard
                              key={bed.bed}
                              room={room}
                              bed={bed}
                              selectedValue={selectedTransferBed}
                              onSelect={setSelectedTransferBed}
                              allowOnlyVacant
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>
                      <div className="acc-room-header">
                        <div className="acc-room-title">
                          {selectedTransferWard}
                        </div>

                        <div className="acc-room-stats">
                          <span>Total No. of Bed : 0</span>
                          <span>Number of Vacant Bed : 0</span>
                        </div>
                      </div>

                      <div className="p-4 text-muted small fw-semibold">
                        No available room record for this ward.
                      </div>
                    </div>
                  )}
                </div>

                <div className="acc-select-footer">
                  <div className="acc-transfer-selected-box">
                    Selected: {selectedTransferBedLabel}
                  </div>

                  <button
                    type="button"
                    className="btn btn-sm text-white fw-bold px-5 py-2"
                    style={{
                      backgroundColor: "var(--primary, #0f763f)",
                      borderColor: "var(--primary, #0f763f)",
                    }}
                    disabled={!selectedTransferBed}
                    onClick={handleTransferPatient}
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* edit room modal */}
      {showEditRoomModal && (
        <div className="acc-window-backdrop">
          <div className="acc-window shadow-lg">
            <div className="acc-window-title">
              <div>
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <i className="isax isax-edit"></i>
                  Update Room / Bed
                </h5>
                <div className="small opacity-75">
                  Select the new room and bed assignment for the patient.
                </div>
              </div>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowEditRoomModal(false)}
              />
            </div>

            <div className="acc-window-body">
              <div className="acc-side-panel hide-scrollbar">
                <div className="p-3 border-bottom">
                  <div className="small text-muted fw-semibold text-uppercase mb-1">
                    Current Ward
                  </div>
                  <div className="fw-bold text-dark">Ph Med</div>
                </div>

                <div className="p-3 border-bottom">
                  <div className="small text-muted fw-semibold text-uppercase mb-1">
                    Total Beds
                  </div>
                  <div className="fw-bold text-dark">{editTotalBeds}</div>
                </div>

                <div className="p-3 border-bottom">
                  <div className="small text-muted fw-semibold text-uppercase mb-1">
                    Vacant Beds
                  </div>
                  <div
                    className="fw-bold"
                    style={{ color: "var(--primary, #0f763f)" }}
                  >
                    {editVacantBeds}
                  </div>
                </div>

                <div className="p-3">
                  <div className="small text-muted fw-semibold text-uppercase mb-2">
                    Selected
                  </div>

                  <div className="acc-transfer-selected-box">
                    {selectedEditRoomLabel}
                  </div>
                </div>
              </div>

              <div className="acc-modal-content">
                <div className="acc-room-container hide-scrollbar">
                  <div className="acc-room-header">
                    <div className="acc-room-title">Available Room and Bed List</div>

                    <div className="acc-room-stats">
                      <span>Click a row or card to select a bed assignment.</span>
                      <span>Total No. of Bed : {editTotalBeds}</span>
                      <span>Number of Vacant Bed : {editVacantBeds}</span>
                    </div>
                  </div>

                  <div className="acc-desktop-room-list">
                    <table className="table table-sm align-middle mb-0 acc-room-table-clean">
                      <thead>
                        <tr>
                          <th style={{ width: "50px" }}></th>
                          <th>Room</th>
                          <th>Bed</th>
                          <th>Status</th>
                          <th className="text-center">Allowed Occupant</th>
                          <th className="text-center">Actual Occupant</th>
                          <th>Patient</th>
                        </tr>
                      </thead>

                      <tbody>
                        {editRoomGroups.map((room) =>
                          room.beds.map((bed) => {
                            const value = `${room.roomName}|${bed.bed}`;
                            const isSelected = selectedEditRoom === value;

                            return (
                              <tr
                                key={`${room.roomName}-${bed.bed}`}
                                className={isSelected ? "acc-room-selected" : ""}
                                onClick={() => setSelectedEditRoom(value)}
                                style={{ cursor: "pointer" }}
                              >
                                <td className="text-center">
                                  {isSelected ? (
                                    <span
                                      className="rounded-circle d-inline-flex align-items-center justify-content-center"
                                      style={{
                                        width: "24px",
                                        height: "24px",
                                        backgroundColor:
                                          "var(--primary, #0f763f)",
                                        color: "#fff",
                                      }}
                                    >
                                      <i
                                        className="isax isax-tick-circle"
                                        style={{ fontSize: "14px" }}
                                      ></i>
                                    </span>
                                  ) : bed.status === "Occupied" ? (
                                    <i className="isax isax-user text-muted"></i>
                                  ) : (
                                    <i className="isax isax-hospital text-muted"></i>
                                  )}
                                </td>

                                <td className="fw-bold text-dark">
                                  {room.roomName}
                                </td>

                                <td className="fw-bold text-dark">{bed.bed}</td>

                                <td>
                                  <span
                                    className={`badge rounded-pill px-3 py-2 ${
                                      bed.status === "Vacant"
                                        ? "acc-bed-vacant"
                                        : "acc-bed-occupied"
                                    }`}
                                  >
                                    {bed.status}
                                  </span>
                                </td>

                                <td className="text-center fw-bold">
                                  {bed.allowedOccupant}
                                </td>

                                <td className="text-center fw-bold">
                                  {bed.actualOccupant}
                                </td>

                                <td className="text-muted small fw-semibold">
                                  <span className="acc-table-text">
                                    {bed.patient || "—"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="acc-mobile-room-list">
                    {editRoomGroups.map((room) =>
                      room.beds.map((bed) => (
                        <RoomBedMobileCard
                          key={`${room.roomName}-${bed.bed}`}
                          room={room}
                          bed={bed}
                          selectedValue={selectedEditRoom}
                          onSelect={setSelectedEditRoom}
                        />
                      ))
                    )}
                  </div>
                </div>

                <div className="acc-select-footer">
                  <div className="acc-transfer-selected-box">
                    Selected: {selectedEditRoomLabel}
                  </div>

                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-light border fw-bold px-4 py-2"
                      onClick={() => setShowEditRoomModal(false)}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm text-white fw-bold px-5 py-2"
                      style={{
                        backgroundColor: selectedEditRoom
                          ? "var(--primary, #0f763f)"
                          : "#f8f9fa",
                        borderColor: selectedEditRoom
                          ? "var(--primary, #0f763f)"
                          : "#dee2e6",
                        color: selectedEditRoom ? "#fff" : "#6c757d",
                        cursor: selectedEditRoom ? "pointer" : "not-allowed",
                      }}
                      disabled={!selectedEditRoom}
                      onClick={handleSaveEditRoom}
                    >
                      <i className="isax isax-save-2 me-2"></i>
                      Save Changes
                    </button>
                  </div>
                </div>
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
                    Accomodation Details
                  </h5>
                  <div className="small text-white-50">
                    Complete ward and room information.
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
                  <div className="col-6">
                    <DetailItem label="Ward" value={selectedRecord.ward} />
                  </div>

                  <div className="col-6">
                    <DetailItem label="Room" value={selectedRecord.room} />
                  </div>

                  <div className="col-6">
                    <DetailItem label="Bed" value={selectedRecord.bed} />
                  </div>

                  <div className="col-6">
                    <div className="border rounded-1 bg-light p-3 h-100">
                      <span
                        className="text-muted d-block text-uppercase mb-1"
                        style={{ fontSize: "0.7rem" }}
                      >
                        Status
                      </span>
                      <span
                        className={`badge rounded-pill px-3 py-2 ${
                          selectedRecord.status === "Active"
                            ? "acc-status-active"
                            : "acc-status-inactive"
                        }`}
                      >
                        {selectedRecord.status}
                      </span>
                    </div>
                  </div>

                  <div className="col-12">
                    <DetailItem label="Date From" value={selectedRecord.dateFrom} />
                  </div>

                  <div className="col-12">
                    <DetailItem label="Date To" value={selectedRecord.dateTo} />
                  </div>

                  <div className="col-12">
                    <DetailItem
                      label="Length of Stay"
                      value={selectedRecord.lengthOfStay}
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

      {/* /page content */}
    </>
  );
};

export default RegDetails;