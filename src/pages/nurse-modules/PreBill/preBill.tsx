import NurseSidebar from "@/components/custom-sidebar/nurseSidebar";

const PreBill = () => {
  const patientProfile = {
    hospitalNumber: "000000000777288",
    lastName: "DO",
    firstName: "REA",
    middleName: "MON",
    address: "111 Estanza, Legazpi City, Albay",
  };

  return (
    <>
      {/* Page Content */}
      <div
        className="content nurse-content bg-light mt-n4"
        style={{ minHeight: "100vh" }}
      >
        <div className="container-fluid px-3 px-lg-5 pt-0">
          <div className="nurse-dashboard-layout">
            <NurseSidebar />

            <div className="nurse-dashboard-main mt-4 mt-lg-0">
              <div
                className="card border-0 shadow-sm p-3 p-md-4 mb-4"
                style={{
                  borderRadius: "12px",
                  borderTop: "4px solid var(--primary, #0f763f)",
                }}
              >
                <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3 gap-md-4 text-center text-md-start">
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
                      ID: {patientProfile.hospitalNumber}
                    </div>
                    <h3 className="fw-bold mb-1 text-dark fs-3 fs-md-2">
                      {patientProfile.lastName}, {patientProfile.firstName}{" "}
                      {patientProfile.middleName}
                    </h3>
                    <div className="text-muted small d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                      <i className="isax isax-location text-danger" />
                      {patientProfile.address}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-top">
                  <p className="mb-0 text-dark">prebill</p>
                </div>
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
