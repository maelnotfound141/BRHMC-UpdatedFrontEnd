type PatientIdentificationCardProps = {
  logoSrc?: string;
};

export const PatientIdentificationCardStyles = ".printable-form-document * { margin: 0; padding: 0; box-sizing: border-box; }\n\n.printable-form-document { font-family: Arial, sans-serif;\r\n            background-color: #f0f0f0;\r\n            padding: 10px; }\n\n.printable-form-document .page { width: 794px;\r\n            background-color: white;\r\n            margin: 20px auto;\r\n            padding: 30px 40px;\r\n            box-shadow: 0 0 10px rgba(0,0,0,0.1); }\n\n.printable-form-document .page-header { display: flex;\r\n            align-items: stretch;\r\n            border: 1.5px solid #555;\r\n            margin-bottom: 18px; }\n\n.printable-form-document .logo-wrap { flex: 0 0 95px; \r\n            display: flex;\r\n            align-items: center;\r\n            justify-content: center;\r\n            padding: 6px; }\n\n.printable-form-document .logo-wrap img { width: 85px;  \r\n            height: 85px; \r\n            object-fit: contain; }\n\n.printable-form-document .hospital-info { flex: 1;\r\n            padding: 6px 10px;\r\n            color: #004d40;\r\n            font-size: 11px;\r\n            line-height: 1.5;\r\n            display: flex;\r\n            flex-direction: column;\r\n            justify-content: center; }\n\n.printable-form-document .hospital-info strong { font-size: 12.5px; }\n\n.printable-form-document .form-code-table { border-collapse: collapse;\r\n            font-size: 11px;\r\n            flex: 0 0 auto;\r\n            border-left: 1px solid #555; }\n\n.printable-form-document .form-code-table td { padding: 5px 8px;\r\n            white-space: nowrap; }\n\n.printable-form-document .form-code-table tr:not(:last-child) td { border-bottom: 1px solid #555; }\n\n.printable-form-document .form-code-table td:first-child { border-right: 1px solid #555; }\n\n.printable-form-document h1 { text-align: center;\r\n            font-size: 19px;\r\n            font-weight: bold;\r\n            margin-bottom: 14px;\r\n            letter-spacing: 0.5px; }\n\n.printable-form-document .id-section { font-size: 12px; }\n\n.printable-form-document .field-table { width: 100%;\r\n            border-collapse: collapse;\r\n            margin-bottom: 6px;\r\n            font-size: 12px; }\n\n.printable-form-document .field-table td { vertical-align: baseline; padding: 0; }\n\n.printable-form-document .lbl { white-space: nowrap;\r\n            width: 140px;\r\n            padding-right: 4px; }\n\n.printable-form-document .colon { width: 10px; }\n\n.printable-form-document .val { border-bottom: 1px solid #000;\r\n            font-weight: bold;\r\n            padding: 0 3px 1px; }\n\n.printable-form-document .val-noLine { font-weight: bold;\r\n            padding: 0 3px 1px; }\n\n.printable-form-document .hosp-num-row { text-align: right;\r\n            margin-bottom: 8px;\r\n            font-size: 12px; }\n\n.printable-form-document /* Mga Checkbox */\r\n        .checkbox-area { margin-top: 6px;\r\n            margin-left: 195px;   /*code para i-align sa column kang value */ }\n\n.printable-form-document .checkbox-row-line { display: flex;\r\n            gap: 40px;\r\n            margin-bottom: 4px;\r\n            font-size: 12px; }\n\n.printable-form-document .cb-item { white-space: nowrap; }\n\n.printable-form-document /* Putol-putol na Linya */\r\n        .dotted-line { border-top: 1.5px dashed #555;\r\n            margin: 28px 0; }\n\n.printable-form-document .consent-section { font-size: 12px; line-height: 1.6; }\n\n.printable-form-document .cval { display: inline-block;\r\n            border-bottom: 1px solid #000;\r\n            font-weight: bold;\r\n            min-width: 180px;\r\n            padding: 0 4px 1px;\r\n            text-align: center; }\n\n.printable-form-document .cval-wide { display: inline-block;\r\n            border-bottom: 1px solid #000;\r\n            font-weight: bold;\r\n            min-width: 300px;\r\n            padding: 0 4px 1px;\r\n            text-align: center; }\n\n.printable-form-document .italic { font-style: italic; }\n\n.printable-form-document .sub-label { font-size: 10px;\r\n            text-align: center;\r\n            display: block;\r\n            margin-top: 1px; }\n\n.printable-form-document .consent-row1 { display: flex;\r\n            align-items: flex-end;\r\n            gap: 0;\r\n            margin-bottom: 2px; }\n\n.printable-form-document .consent-part { display: flex; flex-direction: column; }\n\n.printable-form-document .date-row { display: flex;\r\n            align-items: baseline;\r\n            gap: 6px;\r\n            margin-top: 22px;\r\n            font-size: 12px; }\n\n.printable-form-document .day-field { border-bottom: 1px solid #000;\r\n            font-weight: bold;\r\n            width: 50px;\r\n            text-align: center;\r\n            display: inline-block;\r\n            padding: 0 2px; }\n\n.printable-form-document .month-field { border-bottom: 1px solid #000;\r\n            font-weight: bold;\r\n            width: 140px;\r\n            text-align: center;\r\n            display: inline-block;\r\n            padding: 0 2px; }\n\n.printable-form-document sup { font-size: 9px; }\n\n.printable-form-document /* Lagda */\r\n        .signature-area { display: flex;\r\n            justify-content: flex-end;\r\n            margin-top: 40px; }\n\n.printable-form-document .signature-field { text-align: center; width: 300px; }\n\n.printable-form-document .sig-line { border-top: 1px solid #000;\r\n            display: block;\r\n            margin-bottom: 4px; }\n\n.printable-form-document .sig-label { font-size: 11px; font-style: italic; }\n\n@media print {\n.printable-form-document { background: white; padding: 0; }\n\n.printable-form-document .page { margin: 0; padding: 20px 30px; box-shadow: none; }\n}";

export const PatientIdentificationCard = ({ logoSrc = "/logo/brhmclogo.jpg" }: PatientIdentificationCardProps) => (
  <>
    <style>{PatientIdentificationCardStyles}</style>
    <div className="printable-form-document">
      <div className="page">
        <div className="page-header">
          <div className="logo-wrap">
            <img src={logoSrc} alt="BRHMC Logo" />
          </div>
          <div className="hospital-info">
            <strong>
              {"BICOL REGIONAL HOSPITAL AND MEDICAL CENTER"}
            </strong>
            {"\r\n            Daraga, Albay"}
            <br />
            {"\r\n            Trunkline: (052) 732-5555   Telehealth Hotline: (052) 732-5596"}
            <br />
            {"\r\n            Website: http://www.brhth.doh.gov.ph   Email: brhmc.cares@gmail.com"}
            <br />
            {"\r\n            Facebook Page: http://www.facebook.com/brhth\r\n        "}
          </div>
          <table className="form-code-table">
            <tr>
              <td>
                {"Form Code"}
              </td>
              <td>
                {"FM-NRS-GEN-01"}
              </td>
            </tr>
            <tr>
              <td>
                {"Effectivity"}
              </td>
              <td>
                {"May 1, 2017"}
              </td>
            </tr>
            <tr>
              <td>
                {"Revision"}
              </td>
              <td style={{ textAlign: "center" }}>
                {"0"}
              </td>
            </tr>
          </table>
        </div>
        <h1>
          {"PATIENT'S IDENTIFICATION CARD"}
        </h1>
        <div className="id-section">
          <div className="hosp-num-row">
            {"\r\n            HOSPITAL NUMBER :  "}
            <strong style={{ fontSize: "15px" }}>
              {"000000000777288"}
            </strong>
          </div>
          <table className="field-table">
            <tr>
              <td className="lbl">
                {"NAME OF PATIENT"}
              </td>
              <td className="colon">
                {":"}
              </td>
              <td className="val" style={{ width: "310px" }}>
                {"DO, REA MON"}
              </td>
              <td style={{ width: "12px" }}>
              </td>
              <td style={{ whiteSpace: "nowrap" }}>
                {"AGE : "}
                <span className="val-noLine" style={{ borderBottom: "1px solid #000", display: "inline-block", minWidth: "30px", textAlign: "center" }}>
                  {"26"}
                </span>
              </td>
              <td style={{ width: "10px" }}>
              </td>
              <td style={{ whiteSpace: "nowrap" }}>
                {"SEX : "}
                <span className="val-noLine" style={{ borderBottom: "1px solid #000", display: "inline-block", minWidth: "25px", textAlign: "center" }}>
                  {"M"}
                </span>
              </td>
              <td style={{ width: "10px" }}>
              </td>
              <td style={{ whiteSpace: "nowrap" }}>
                {"CS : "}
                <span className="val-noLine" style={{ borderBottom: "1px solid #000", display: "inline-block", minWidth: "60px", textAlign: "center" }}>
                  {"Married"}
                </span>
              </td>
            </tr>
          </table>
          <table className="field-table">
            <tr>
              <td className="lbl">
                {"PERMANENT ADDRESS"}
              </td>
              <td className="colon">
                {":"}
              </td>
              <td className="val">
                {"111, ESTANZA, LEGAZPI CITY, ALBAY"}
              </td>
            </tr>
          </table>
          <table className="field-table">
            <tr>
              <td className="lbl">
                {"DATE ADMITTED"}
              </td>
              <td className="colon">
                {":"}
              </td>
              <td className="val" style={{ width: "195px" }}>
                {"Mar/21/2026 02:45 PM"}
              </td>
              <td style={{ width: "16px" }}>
              </td>
              <td style={{ whiteSpace: "nowrap" }}>
                {"DATE DISCHARGED"}
              </td>
              <td className="colon">
                {" :"}
              </td>
              <td className="val" style={{ width: "180px" }}>
                {" "}
              </td>
            </tr>
          </table>
          <table className="field-table">
            <tr>
              <td className="lbl">
                {"SERVICE/DEPARTMENT"}
              </td>
              <td className="colon">
                {":"}
              </td>
              <td className="val" style={{ width: "195px" }}>
                {"Medicine"}
              </td>
              <td style={{ width: "16px" }}>
              </td>
              <td style={{ whiteSpace: "nowrap" }}>
                {"ATTENDING PHYSICIAN"}
              </td>
              <td className="colon">
                {" :"}
              </td>
              <td className="val" style={{ width: "180px" }}>
                {" "}
              </td>
            </tr>
          </table>
          <table className="field-table" style={{ marginBottom: "2px" }}>
            <tr>
              <td className="lbl" style={{ width: "185px" }}>
                {"CONDITION UPON DISCHARGE"}
              </td>
              <td className="colon">
                {":"}
              </td>
              <td className="val" style={{ width: "250px" }}>
                {" "}
              </td>
              <td>
              </td>
            </tr>
          </table>
          <div className="checkbox-area">
            <div className="checkbox-row-line">
              <span className="cb-item">
                {"[   ] FAIR"}
              </span>
              <span className="cb-item">
                {"[   ] UNIMPROVED"}
              </span>
              <span className="cb-item">
                {"[   ] TRANSFERRED"}
              </span>
            </div>
            <div className="checkbox-row-line">
              <span className="cb-item">
                {"[   ] IMPROVED"}
              </span>
              <span className="cb-item">
                {"[   ] ABSCONDED"}
              </span>
              <span className="cb-item">
                {"[   ] DIED"}
              </span>
            </div>
          </div>
        </div>
        <div className="dotted-line">
        </div>
        <div className="page-header">
          <div className="logo-wrap">
            <img src={logoSrc} alt="BRHMC Logo" />
          </div>
          <div className="hospital-info">
            <strong>
              {"BICOL REGIONAL HOSPITAL AND MEDICAL CENTER"}
            </strong>
            {"\r\n            Daraga, Albay"}
            <br />
            {"\r\n            Trunkline: (052) 732-5555   Telehealth Hotline: (052) 732-5596"}
            <br />
            {"\r\n            Website: http://www.brhth.doh.gov.ph   Email: brhmc.cares@gmail.com"}
            <br />
            {"\r\n            Facebook Page: http://www.facebook.com/brhth\r\n        "}
          </div>
          <table className="form-code-table">
            <tr>
              <td>
                {"Form Code"}
              </td>
              <td>
                {"FM-ADM-AMT-07"}
              </td>
            </tr>
            <tr>
              <td>
                {"Effectivity"}
              </td>
              <td>
                {"May 1, 2017"}
              </td>
            </tr>
            <tr>
              <td>
                {"Revision"}
              </td>
              <td style={{ textAlign: "center" }}>
                {"1"}
              </td>
            </tr>
          </table>
        </div>
        <h1>
          {"CONSENT FOR ADMISSION AND TREATMENT"}
        </h1>
        <div className="consent-section">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", marginBottom: "16px" }}>
            <tr>
              <td style={{ verticalAlign: "bottom", whiteSpace: "nowrap", width: "55px", paddingRight: "6px" }}>
                {"\r\n                    I,\r\n                "}
              </td>
              <td style={{ verticalAlign: "bottom", borderBottom: "1px solid #000", fontWeight: "bold", textAlign: "center", paddingBottom: "2px" }}>
                {"\r\n                    SHI SU KA\r\n                "}
              </td>
              <td style={{ verticalAlign: "bottom", whiteSpace: "nowrap", width: "195px", paddingLeft: "14px" }}>
                {"\r\n                    hereby consent\r\n                "}
              </td>
            </tr>
            <tr>
              <td style={{ fontStyle: "italic", fontSize: "11px", paddingRight: "6px", verticalAlign: "top" }}>
                {"\r\n                    ( Ako si )\r\n                "}
              </td>
              <td style={{ fontSize: "11px", verticalAlign: "top" }}>
                <div style={{ display: "flex", justifyContent: "space-around", paddingTop: "2px" }}>
                  <span>
                    {"Given Name  "}
                    <span className="italic">
                      {"( Pangalan )"}
                    </span>
                  </span>
                  <span>
                    {"Surname  "}
                    <span className="italic">
                      {"( Apelyedo )"}
                    </span>
                  </span>
                </div>
              </td>
              <td style={{ fontStyle: "italic", fontSize: "11px", verticalAlign: "top", paddingLeft: "14px" }}>
                {"\r\n                    ( ay sumasang-ayon na si )\r\n                "}
              </td>
            </tr>
            <tr>
              <td colSpan={3} style={{ height: "14px" }}>
              </td>
            </tr>
            <tr>
              <td style={{ verticalAlign: "bottom" }}>
              </td>
              <td style={{ verticalAlign: "bottom", borderBottom: "1px solid #000", fontWeight: "bold", textAlign: "center", paddingBottom: "2px" }}>
                {"\r\n                    DO, REA MON\r\n                "}
              </td>
              <td style={{ verticalAlign: "bottom", paddingLeft: "14px", whiteSpace: "nowrap" }}>
                {"\r\n                    to be admitted in this hospital and thereby\r\n                "}
              </td>
            </tr>
            <tr>
              <td>
              </td>
              <td style={{ fontSize: "11px", textAlign: "center", verticalAlign: "top", paddingTop: "2px" }}>
                {"\r\n                    Patient's Name  "}
                <span className="italic">
                  {"( Pangalan ng Pasyente )"}
                </span>
              </td>
              <td style={{ fontStyle: "italic", fontSize: "11px", verticalAlign: "top", paddingLeft: "14px", paddingTop: "2px" }}>
                {"\r\n                    ( ay ipapasok sa ospital na ito at ako ay )\r\n                "}
              </td>
            </tr>
          </table>
          <div style={{ marginBottom: "4px", fontSize: "12px" }}>
            {"\r\n            will abide to all hospital rules and regulations."}
            <br />
            <span className="italic" style={{ fontSize: "11px" }}>
              {"( na susunod sa mga patakaran at alituntunin ng ospital )"}
            </span>
          </div>
          <div className="date-row">
            <span>
              {"Date this"}
            </span>
            <span className="day-field">
              {"21"}
              <sup>
                {"st"}
              </sup>
            </span>
            <span>
              {"day of"}
            </span>
            <span className="month-field">
              {"March, 2026"}
            </span>
          </div>
          <div className="signature-area">
            <div className="signature-field">
              <span className="sig-line">
                {" "}
              </span>
              <div className="sig-label">
                {"\r\n                    Signature of Patient/Relative"}
                <br />
                <span className="italic">
                  {"( Lagda ng pasyente/Kamag-anak )"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default PatientIdentificationCard;
