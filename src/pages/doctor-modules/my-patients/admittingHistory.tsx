import ImageWithBasePath from "@/components/image-with-base-path";
const AdmittingHistory = () => {
  return (
    <div
      style={{
        margin: 0,
        padding: "20px",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
        background: "#f1f1f1",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "900px",
          minHeight: "1300px",
          background: "#fff",
          border: "1px solid #000",
          padding: "14px 14px 14px 40px",
          boxSizing: "border-box",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            border: "1px solid #000",
          }}
        >
          {/* HEADER TOP */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
            }}
          >
            {/* LEFT LOGO */}

            <div
              style={{
                width: "70px",
                height: "55px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
              }}
            >
              <ImageWithBasePath 
                src="/assets/img/logo_doh.bmp" 
                alt="DOH Logo" 
                className="logo-img" 
                />
            </div>

            {/* CENTER */}

            <div
              style={{
                flex: 1,
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                }}
              >
                Republic of the Philippines
              </div>

              <div
                style={{
                  fontSize: "11px",
                }}
              >
                Department of Health
              </div>

              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                BICOL REGIONAL HOSPITAL AND MEDICAL CENTER
              </div>

              <div
                style={{
                  fontSize: "11px",
                }}
              >
                Daraga, Albay
              </div>
            </div>

            {/* RIGHT LOGO */}

            <div
              style={{
                width: "70px",
                height: "55px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
              }}
            >
                <ImageWithBasePath 
                                            src="/assets/img/brhmclogo.png" 
                                            alt="BRHMC Logo" 
                                            className="logo-img" 
                                        />
            </div>
          </div>

          {/* HEADER BOTTOM */}

          <div
            style={{
              display: "flex",
              borderTop: "1px solid #000",
            }}
          >
            {/* TITLE */}

            <div
              style={{
                flex: 1,
                fontSize: "20px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                padding: "10px 14px",
                borderRight: "1px solid #000",
              }}
            >
              ADMITTING HISTORY
            </div>

            {/* FORM INFO */}

            <div
              style={{
                width: "250px",
              }}
            >
              {[
                {
                  label: "Form Code",
                  value: "FM-MED-GEN-01",
                },
                {
                  label: "Effectivity",
                  value: "September 28, 2022",
                },
                {
                  label: "Revision",
                  value: "1",
                },
              ].map((item, index) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    borderBottom:
                      index !== 2 ? "1px solid #000" : "none",
                  }}
                >
                  <div
                    style={{
                      width: "90px",
                      borderRight: "1px solid #000",
                      fontWeight: "bold",
                      padding: "4px 6px",
                      fontSize: "12px",
                    }}
                  >
                    {item.label}
                  </div>

                  <div
                    style={{
                      flex: 1,
                      padding: "4px 6px",
                      fontSize: "12px",
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PATIENT INFO */}

        <div
          style={{
            marginTop: "18px",
            display: "flex",
            gap: "30px",
          }}
        >
          {/* LEFT COLUMN */}

          <div
            style={{
              flex: 1,
            }}
          >
            {["SURNAME", "GIVEN NAME", "MIDDLE NAME"].map(
              (label) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                    gap: "6px",
                  }}
                >
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </label>

                  <div
                    style={{
                      flex: 1,
                      borderBottom: "1px solid #000",
                      height: "14px",
                    }}
                  />
                </div>
              )
            )}
          </div>

          {/* MIDDLE COLUMN */}

          <div
            style={{
              width: "140px",
              flex: "none",
            }}
          >
            {["AGE", "SEX", "CS"].map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                  gap: "6px",
                }}
              >
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </label>

                <div
                  style={{
                    flex: 1,
                    borderBottom: "1px solid #000",
                    height: "14px",
                  }}
                />
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN */}

          <div
            style={{
              width: "260px",
              flex: "none",
            }}
          >
            {["HOSPITAL NO", "WARD", "BED NO"].map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                  gap: "6px",
                }}
              >
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </label>

                <div
                  style={{
                    flex: 1,
                    borderBottom: "1px solid #000",
                    height: "14px",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* CONTENT */}

        <div
          style={{
            marginTop: "20px",
            paddingLeft: "10px",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginTop: "10px",
            }}
          >
            GENERAL CONDITION OF THE PATIENT
          </div>

          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginTop: "120px",
            }}
          >
            BRIEF HISTORY
          </div>

          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginTop: "160px",
            }}
          >
            PERTINENT PHYSICAL EXAMINATION
          </div>

          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginTop: "300px",
            }}
          >
            ADMITTING DIAGNOSIS
          </div>
        </div>

        {/* FOOTER */}

        <div
          style={{
            marginTop: "200px",
            marginRight: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              width: "260px",
              borderTop: "1px solid #000",
              marginBottom: "6px",
            }}
          />

          <div
            style={{
              fontSize: "14px",
              fontStyle: "italic",
              textAlign: "right",
              marginRight: "30px",
            }}
          >
            Signature of Admitting Physician
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmittingHistory;