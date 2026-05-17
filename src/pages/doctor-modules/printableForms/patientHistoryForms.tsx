import ImageWithBasePath from "@/components/image-with-base-path"
import { useEffect } from "react";

const PatientHistoryAndPhysicalExamination = ({
  embedded = false,
}: {
  embedded?: boolean;
}) => {

useEffect(() => {
    if (embedded) return;

    const navbar = document.querySelector(".navbar") as HTMLElement;
    if (navbar) navbar.style.display = "none";
    return () => {
      if (navbar) navbar.style.display = "";
    };
  }, [embedded]);
  
  return (
    <div
      style={{
        background: "#f1f1f1",
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "794px",
          minHeight: "1123px",
          background: "#fff",
          border: "1px solid #000",
          paddingTop: "14px",
          paddingRight: "14px",
          paddingBottom: "14px",
          paddingLeft: "40px",
          boxSizing: "border-box",
        }}
      >
        {/* ================= HEADER ================= */}
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
                height: "70px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              <div className="header">
                    <ImageWithBasePath 
                      src="/assets/img/logo_doh.bmp" 
                      alt="DOH Logo" 
                      className="logo-img" 
                    />
            </div>
            </div>
            {/* CENTER HEADER */}
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
                height: "70px",
                
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
                textAlign: "center",
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
                fontSize: "18px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                padding: "10px 14px",
                borderRight: "1px solid #000",
                paddingLeft: "32px",
              }}
            >
              PATIENT HISTORY AND PHYSICAL EXAMINATION
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
                  value: "FM-MED-GEN-02",
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

        {/* ================= PATIENT INFO ================= */}
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

        {/* ================= CONTENT ================= */}
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
            GENERAL DATA:
          </div>

          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginTop: "45px",
            }}
          >
            CHIEF COMPLAINT:
          </div>

          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginTop: "60px",
            }}
          >
            HISTORY OF PRESENT ILLNESS:
          </div>

          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginTop: "520px",
            }}
          >
            PAST MEDICAL HISTORY:
          </div>

          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginTop: "120px",
            }}
          >
            GROWTH AND DEVELOPMENT:
          </div>

          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginTop: "60px",
            }}
          >
            PERSONAL / SOCIAL HISTORY:
          </div>

          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginTop: "60px",
            }}
          >
            FAMILY HISTORY:
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div
          style={{
            marginTop: "80px",
            textAlign: "center",
            fontSize: "14px",
            fontStyle: "italic",
          }}
        >
          Continuation at the back....
        </div>
      </div>
    </div>
  );
};

export default PatientHistoryAndPhysicalExamination;
