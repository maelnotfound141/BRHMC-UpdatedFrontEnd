import ImageWithBasePath from "@/components/image-with-base-path";
import { useEffect } from "react";

const DischargeSummary = ({ embedded = false }: { embedded?: boolean }) => {
  useEffect(() => {
    if (embedded) return;

    const navbar = document.querySelector(".navbar") as HTMLElement;
    if (navbar) navbar.style.display = "none";
    return () => {
      if (navbar) navbar.style.display = "";
    };
  }, [embedded]);

  const sections = [
    {
      title: "FINAL DIAGNOSIS",
      height: "55px",
    },
    {
      title: "Brief Clinical History and Patients P.E.",
      height: "120px",
    },
    {
      title:
        "Laboratory Findings: (Including ECG, X-ray & other diagnostic procedure)",
      height: "120px",
    },
    {
      title: "Course in the Ward: (including medications)",
      height: "120px",
    },
    {
      title:
        "Dispositions: (Indicate home medications, special instructions and follow-up)",
      height: "120px",
    },
  ];

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        background: "#d9d9d9",
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          width: "794px",
          minHeight: "1123px",
          background: "#fff",
          margin: "10px auto",
          padding: "18px 28px",
          color: "#000",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* ================= HEADER ================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "80px 1fr 80px",
            alignItems: "center",
            borderTop: "1px solid black",
            borderLeft: "1px solid black",
            borderRight: "1px solid black",
            padding: "6px 10px",
          }}
        >
          {/* LEFT LOGO */}

          <div
            style={{
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              textAlign: "center",
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
              textAlign: "center",
              fontSize: "9px",
              lineHeight: 1.2,
            }}
          >
            <p style={{ margin: 0 }}>Republic of the Philippines</p>
            <p style={{ margin: 0 }}>Department of Health</p>
            <p style={{ margin: 0 }}>
              BICOL REGIONAL HOSPITAL AND MEDICAL CENTER
            </p>
            <p style={{ margin: 0 }}>Daraga, Albay</p>
          </div>

          {/* RIGHT LOGO */}

          <div
            style={{
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
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

        {/* ================= TITLE ================= */}

        <div
          style={{
            border: "1px solid black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            height: "56px",
          }}
        >
          <h1
            style={{
              flex: 1,
                fontSize: "24px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                padding: "10px 14px",
                borderRight: "1px solid #000",
                paddingLeft: "32px",
            }}
          >
            DISCHARGE SUMMARY
          </h1>

          {/* MINI BOX */}

          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: "210px",
              borderLeft: "1px solid black",
              fontSize: "9px",
            }}
          >
            {[
              {
                label: "Form Code",
                value: "FM-MED-GEN-06",
              },
              {
                label: "Effectivity",
                value: "September 28, 2022",
              },
              {
                label: "Revision",
                value: "1",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid black",
                  padding: "2px 5px",
                }}
              >
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= INFO ================= */}

        <div
          style={{
            marginTop: "8px",
            fontSize: "11px",
          }}
        >
          {/* ROW 1 */}

          <InfoRow>
            <span>SURNAME</span>
            <Line />

            <span>AGE</span>
            <SmallLine />

            <span>HOSPITAL NO.</span>
            <Line />
          </InfoRow>

          {/* ROW 2 */}

          <InfoRow>
            <span>NAME</span>
            <Line />

            <span>SEX</span>
            <SmallLine />

            <span>WARD</span>
            <Line />
          </InfoRow>

          {/* ROW 3 */}

          <InfoRow>
            <span>MIDDLE NAME</span>
            <Line />

            <span>CS</span>
            <SmallLine />

            <span>ROOM/BED NO.</span>
            <Line />
          </InfoRow>

          {/* ROW 4 */}

          <InfoRow>
            <span>Date Admitted</span>
            <Line />

            <span>Date Discharge</span>
            <Line />
          </InfoRow>

          {/* ROW 5 */}

          <InfoRow>
            <span>Admitting Physician</span>
            <Line />

            <span>Attending Physician</span>
            <Line />
          </InfoRow>

          {/* ROW 6 */}

          <InfoRow>
            <span>Admitting Diagnosis</span>
            <Line />
          </InfoRow>
        </div>

        {/* ================= SECTIONS ================= */}

        {sections.map((section) => (
          <div
            key={section.title}
            style={{
              marginTop: "18px",
            }}
          >
            <h3
              style={{
                fontSize: "12px",
                margin: "0 0 8px",
                fontWeight: "bold",
              }}
            >
              {section.title}
            </h3>

            <div
              style={{
                height: section.height,
                backgroundImage: `repeating-linear-gradient(
                  to bottom,
                  transparent,
                  transparent 17px,
                  #bcbcbc 18px
                )`,
              }}
            />
          </div>
        ))}

        {/* ================= FOOTER ================= */}

        <div
          style={{
            marginTop: "80px",
            display: "flex",
            justifyContent: "space-between",
            padding: "0 10px",
          }}
        >
          {/* LEFT */}

          <div>
            <div
              style={{
                width: "180px",
                borderBottom: "1px solid black",
                marginBottom: "5px",
              }}
            />

            <p
              style={{
                margin: 0,
                fontSize: "11px",
                textAlign: "center",
              }}
            >
              DATE ACCOMPLISHED
            </p>
          </div>

          {/* RIGHT */}

          <div>
            <div
              style={{
                width: "180px",
                borderBottom: "1px solid black",
                marginBottom: "5px",
              }}
            />

            <p
              style={{
                margin: 0,
                fontSize: "11px",
                textAlign: "center",
              }}
            >
              RESIDENT IN CHARGE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const InfoRow = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      marginBottom: "2px",
      gap: "4px",
    }}
  >
    {children}
  </div>
);

const Line = () => (
  <div
    style={{
      borderBottom: "1px solid black",
      flex: 1,
      height: "12px",
    }}
  />
);

const SmallLine = () => (
  <div
    style={{
      width: "70px",
      borderBottom: "1px solid black",
      height: "12px",
    }}
  />
);

export default DischargeSummary;
