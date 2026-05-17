import { useEffect } from "react";

const PatientHistoryFormPage2 = ({
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
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        background: "#f1f1f1",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "794px",
          minHeight: "1123px",
          background: "#fff",
          border: "1px solid #000",
          padding: "40px 40px 60px 40px",
          boxSizing: "border-box",
        }}
      >
        {/* ================= SYSTEM REVIEW ================= */}

        <div
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "18px",
          }}
        >
          SYSTEM REVIEW:
        </div>

        <div
          style={{
            paddingLeft: "50px",
            lineHeight: 1.35,
            fontSize: "16px",
            fontWeight: 500,
            marginBottom: "45px",
          }}
        >
          {[
            "GENERAL",
            "SKIN",
            "EENT",
            "MUSCULOSKELETAL",
            "RESPIRATORY",
            "CARDIOVASCULAR",
            "GASTROINTESTINAL",
            "GENITOURINARY",
            "REPRODUCTIVE",
            "NERVOUS",
          ].map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>

        {/* ================= PHYSICAL EXAMINATION ================= */}

        <div
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            letterSpacing: "8px",
            marginBottom: "28px",
          }}
        >
          PHYSICAL EXAMINATION
        </div>

        {/* GENERAL SURVEY */}

        <div
          style={{
            fontSize: "20px",
            marginBottom: "2px",
          }}
        >
          General Survey
        </div>

        <div
          style={{
            fontSize: "15px",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          VITAL SIGNS
        </div>

        {/* ================= VITAL SIGNS ROW 1 ================= */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          {["BP", "CR", "RR", "TEMP"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <label
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginRight: "4px",
                }}
              >
                {label}
              </label>

              <div
                style={{
                  width: "120px",
                  borderBottom: "1px solid #000",
                  height: "12px",
                }}
              />
            </div>
          ))}
        </div>

        {/* ================= VITAL SIGNS ROW 2 ================= */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          {["WEIGHT:", "LENGTH:", "BMI:"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <label
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginRight: "4px",
                }}
              >
                {label}
              </label>

              <div
                style={{
                  width: "180px",
                  borderBottom: "1px solid #000",
                  height: "12px",
                }}
              />
            </div>
          ))}
        </div>

        {/* ================= BODY SYSTEMS ================= */}

        <div
          style={{
            marginTop: "12px",
          }}
        >
          {[
            "SKIN",
            "HEENT",
            "CHEST/LUNGS",
            "HEART",
            "ABDOMEN",
            "GENITO-URINARY",
            "EXTREMITIES",
            "NEUROLOGICAL EXAM",
          ].map((item) => (
            <div
              key={item}
              style={{
                fontSize: "18px",
                marginBottom: "26px",
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* ================= DIAGNOSIS ================= */}

        <div
          style={{
            marginTop: "200px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          DIAGNOSIS:
        </div>

        {/* ================= FOOTER ================= */}

        <div
          style={{
            marginTop: "110px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              width: "260px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                borderTop: "1px solid #000",
                marginBottom: "6px",
              }}
            />

            <div
              style={{
                fontSize: "14px",
              }}
            >
              (Attending Physician)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHistoryFormPage2;
