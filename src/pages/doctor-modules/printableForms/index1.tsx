type ClinicalCoverSheetProps = {
  logoSrc?: string;
};

export const ClinicalCoverSheetStyles = ".printable-form-document * { margin: 0;\r\n            padding: 0;\r\n            box-sizing: border-box; }\n\n.printable-form-document { font-family: Arial, Helvetica, sans-serif;\r\n            font-size: 10.5px;\r\n            background: #fff;\r\n            color: #000;\r\n            padding: 10px; }\n\n.printable-form-document .page { width: 780px;\r\n            margin: 0 auto;\r\n            background: #fff; }\n\n.printable-form-document table { width: 100%;\r\n            border-collapse: collapse; }\n\n.printable-form-document td, .printable-form-document th { border: 1px solid #000;\r\n            padding: 2px 4px;\r\n            vertical-align: top;\r\n            font-size: 10.5px;\r\n            font-family: Arial, Helvetica, sans-serif; }\n\n.printable-form-document .no-border { border: none !important; }\n\n.printable-form-document .border-top { border-top: 1px solid #000 !important; }\n\n.printable-form-document .border-bottom { border-bottom: 1px solid #000 !important; }\n\n.printable-form-document .border-left { border-left: 1px solid #000 !important; }\n\n.printable-form-document .border-right { border-right: 1px solid #000 !important; }\n\n.printable-form-document .bt-none { border-top: none !important; }\n\n.printable-form-document .bb-none { border-bottom: none !important; }\n\n.printable-form-document .bl-none { border-left: none !important; }\n\n.printable-form-document .br-none { border-right: none !important; }\n\n.printable-form-document .header-table td { border: none;\r\n            padding: 1px 3px; }\n\n.printable-form-document .center { text-align: center; }\n\n.printable-form-document .right { text-align: right; }\n\n.printable-form-document .bold { font-weight: bold; }\n\n.printable-form-document .small { font-size: 9px; }\n\n.printable-form-document .smaller { font-size: 8.5px; }\n\n.printable-form-document .label { font-size: 9.5px;\r\n            font-weight: normal; }\n\n.printable-form-document .value { font-size: 11px;\r\n            font-weight: bold; }\n\n.printable-form-document /* Para sa header */\r\n        .main-header { border: 1px solid #000;\r\n            border-bottom: none; }\n\n.printable-form-document /* Row para sa titulo */\r\n        .title-row td { border: 1px solid #000;\r\n            text-align: center;\r\n            font-size: 15px;\r\n            font-weight: bold;\r\n            padding: 4px;\r\n            letter-spacing: 1px; }\n\n.printable-form-document .section-label { font-size: 9.5px;\r\n            font-weight: normal;\r\n            display: block;\r\n            line-height: 1.2; }\n\n.printable-form-document .field-value { font-size: 11px;\r\n            font-weight: bold;\r\n            display: block;\r\n            line-height: 1.3; }\n\n.printable-form-document .sub-label { font-size: 8.5px;\r\n            color: #000;\r\n            display: block; }\n\n.printable-form-document .checkbox-row { display: inline-flex;\r\n            align-items: center;\r\n            gap: 2px;\r\n            margin-right: 6px;\r\n            font-size: 10px; }\n\n.printable-form-document .cb { display: inline-block;\r\n            width: 12px;\r\n            height: 12px;\r\n            border: 1px solid #000;\r\n            text-align: center;\r\n            font-size: 10px;\r\n            line-height: 12px;\r\n            font-weight: bold;\r\n            flex-shrink: 0;\r\n            margin: 0 1px; }\n\n.printable-form-document .cb.checked::after { content: 'X'; }\n\n.printable-form-document .row-h { height: 22px; }\n\n.printable-form-document .row-h2 { height: 30px; }\n\n.printable-form-document .row-h3 { height: 40px; }\n\n.printable-form-document .row-h4 { height: 55px; }\n\n.printable-form-document .diag-row { height: 48px; }\n\n.printable-form-document .op-row { height: 28px; }\n\n.printable-form-document .barcode { font-family: 'Libre Barcode 128', 'Libre Barcode 39', monospace;\r\n            font-size: 40px;\r\n            letter-spacing: -1px;\r\n            line-height: 1;\r\n            display: block;\r\n            padding: 4px 0; }\n\n.printable-form-document .disposition-table td { border: none;\r\n            padding: 1px 4px;\r\n            font-size: 11px;\r\n            vertical-align: top; }\n\n.printable-form-document .outer { border: 1px solid #000; }\n\n.printable-form-document .form-code-table { border-collapse: collapse; }\n\n.printable-form-document .form-code-table td { border: 1px solid #000;\r\n            padding: 2px 5px;\r\n            font-size: 10px; }\n\n.printable-form-document .checkbox-item { font-size: 11px;\r\n            white-space: nowrap;\r\n            margin: 0 3px;\r\n            display: inline-block; }\n\n.printable-form-document .checkbox-item-large { font-size: 11.5px;\r\n            white-space: nowrap;\r\n            margin: 0 4px;\r\n            display: inline-block; }\n\n@media print {\n.printable-form-document { padding: 0; }\n\n.printable-form-document .page { width: 100%; }\n}";

export const ClinicalCoverSheet = ({ logoSrc = "/logo/brhmclogo.jpg" }: ClinicalCoverSheetProps) => (
  <>
    <style>{ClinicalCoverSheetStyles}</style>
    <div className="printable-form-document">
      <div className="page">
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <tr>
            <td colSpan={10} style={{ border: "1px solid #000", borderBottom: "none", padding: "0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tr>
                  <td rowSpan={3} style={{ border: "none", width: "95px", textAlign: "center", padding: "5px", paddingLeft: "25px", verticalAlign: "middle" }}>
                    <img src={logoSrc} alt="BRHMC Logo" style={{ width: "85px", height: "85px", objectFit: "contain" }} />
                  </td>
                  <td rowSpan={3} style={{ border: "none", borderRight: "1px solid #000", textAlign: "center", padding: "19px 5px", verticalAlign: "top" }}>
                    <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                      {"Republic of the Philippines"}
                    </div>
                    <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                      {"Department of Health"}
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "bold", lineHeight: "1.4" }}>
                      {"BICOL REGIONAL HOsssSPITAL AND MEDICAL CENTER"}
                    </div>
                    <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                      {"Daraga Albay"}
                    </div>
                  </td>
                  <td style={{ border: "none", borderBottom: "1px solid #000", borderRight: "1px solid #000", padding: "2px 5px", fontSize: "10px", width: "75px", verticalAlign: "middle" }}>
                    {"Form Code"}
                  </td>
                  <td style={{ border: "none", borderBottom: "1px solid #000", padding: "2px 5px", fontSize: "10px", width: "120px", verticalAlign: "middle" }}>
                    {"FM-ADM-AMT-12"}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none", borderBottom: "1px solid #000", borderRight: "1px solid #000", padding: "2px 5px", fontSize: "10px", verticalAlign: "middle" }}>
                    {"Effectivity"}
                  </td>
                  <td style={{ border: "none", borderBottom: "1px solid #000", padding: "2px 5px", fontSize: "10px", verticalAlign: "middle" }}>
                    {"September 30, 2013"}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none", borderRight: "1px solid #000", padding: "2px 5px", fontSize: "10px", verticalAlign: "middle" }}>
                    {"Revision"}
                  </td>
                  <td style={{ border: "none", padding: "2px 5px", fontSize: "10px", textAlign: "center", verticalAlign: "middle" }}>
                    {"0"}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td colSpan={10} style={{ border: "1px solid #000", borderTop: "1px solid #000", textAlign: "center", fontSize: "16px", fontWeight: "bold", padding: "5px", letterSpacing: "1px" }}>
              {"\r\n                    CLINICAL COVER SHEET\r\n                "}
            </td>
          </tr>
          <tr>
            <td colSpan={3} style={{ border: "1px solid #000", borderTop: "none", padding: "2px 4px", width: "33%" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"SR CITIZEN NO. :"}
              </span>
            </td>
            <td colSpan={4} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"OLD HOSPITAL NUMBER :"}
              </span>
            </td>
            <td colSpan={3} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"HOSPITAL NUMBER :"}
              </span>
              <br />
              <span style={{ fontSize: "12px", fontWeight: "bold", display: "block", textAlign: "center" }}>
                {"000000000777288"}
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={7} style={{ border: "1px solid #000", borderTop: "none", padding: "2px 4px", verticalAlign: "top" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"PATIENT'S NAME :"}
              </span>
              <br />
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1px" }}>
                <tr>
                  <td style={{ border: "none", padding: "0 2px", width: "30%" }}>
                    <div style={{ fontSize: "13px", fontWeight: "bold" }}>
                      {"DO"}
                    </div>
                    <div style={{ fontSize: "8px", textAlign: "center", borderTop: "1px solid #000", marginTop: "1px" }}>
                      {"Lastname"}
                    </div>
                  </td>
                  <td style={{ border: "none", padding: "0 2px", width: "30%" }}>
                    <div style={{ fontSize: "13px", fontWeight: "bold" }}>
                      {"REA"}
                    </div>
                    <div style={{ fontSize: "8px", textAlign: "center", borderTop: "1px solid #000", marginTop: "1px" }}>
                      {"Firstname"}
                    </div>
                  </td>
                  <td style={{ border: "none", padding: "0 2px", width: "40%" }}>
                    <div style={{ fontSize: "13px", fontWeight: "bold" }}>
                      {"MON"}
                    </div>
                    <div style={{ fontSize: "8px", textAlign: "center", borderTop: "1px solid #000", marginTop: "1px" }}>
                      {"Middlename"}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
            <td colSpan={3} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px", fontSize: "10px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tr>
                  <td style={{ border: "none", padding: "1px 2px", fontSize: "9.5px" }}>
                    {"WARD"}
                  </td>
                  <td style={{ border: "none", padding: "1px 2px" }}>
                    {"|"}
                  </td>
                  <td style={{ border: "none", padding: "1px 2px", fontSize: "9.5px" }}>
                    {"ROOM"}
                  </td>
                  <td style={{ border: "none", padding: "1px 2px" }}>
                    {"|"}
                  </td>
                  <td style={{ border: "none", padding: "1px 2px", fontSize: "9.5px" }}>
                    {"BED"}
                  </td>
                  <td style={{ border: "none", padding: "1px 2px" }}>
                    {"|"}
                  </td>
                  <td style={{ border: "none", padding: "1px 2px", fontSize: "9.5px" }}>
                    {"SERVICE"}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none", padding: "1px 2px", fontSize: "10.5px", fontWeight: "bold" }}>
                    {"Ph Med"}
                  </td>
                  <td style={{ border: "none", padding: "1px 2px" }}>
                    {"|"}
                  </td>
                  <td style={{ border: "none", padding: "1px 2px", fontSize: "10.5px", fontWeight: "bold" }}>
                    {"6104"}
                  </td>
                  <td style={{ border: "none", padding: "1px 2px" }}>
                    {"|"}
                  </td>
                  <td style={{ border: "none", padding: "1px 2px", fontSize: "10.5px", fontWeight: "bold" }}>
                    {"000"}
                  </td>
                  <td style={{ border: "none", padding: "1px 2px" }}>
                    {"|"}
                  </td>
                  <td style={{ border: "none", padding: "1px 2px", fontSize: "10.5px", fontWeight: "bold" }}>
                    {"Medicine"}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td colSpan={5} style={{ border: "1px solid #000", borderTop: "none", padding: "2px 4px" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"PERMANENT ADDRESS :"}
              </span>
              <br />
              <span style={{ fontSize: "11px", fontWeight: "bold" }}>
                {"111 ESTANZA, LEGAZPI CITY, ALBAY"}
              </span>
            </td>
            <td colSpan={2} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px", verticalAlign: "top" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"TEL. NO."}
              </span>
            </td>
            <td colSpan={3} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", height: "100%" }}>
                <tr>
                  <td style={{ border: "none", padding: "2px 4px", width: "38%", verticalAlign: "top" }}>
                    <div style={{ fontSize: "9.5px", fontWeight: "normal", marginBottom: "2px" }}>
                      {"SEX"}
                    </div>
                    <span style={{ fontSize: "10.5px", whiteSpace: "nowrap" }}>
                      {"[ "}
                      <b>
                        {"X"}
                      </b>
                      {" ] M        [   ] F"}
                    </span>
                  </td>
                  <td style={{ border: "none", borderLeft: "1px solid #000", padding: "2px 4px", verticalAlign: "top" }}>
                    <div style={{ fontSize: "9.5px", fontWeight: "normal", marginBottom: "2px" }}>
                      {"CIVIL STATUS"}
                    </div>
                    <span style={{ fontSize: "10.5px", lineHeight: "1.6" }}>
                      {"\r\n                                    [   ]S    [   ]D    [   ]SEP   [   ]C"}
                      <br />
                      {"\r\n                                    [   ]W      [ "}
                      <b>
                        {"X"}
                      </b>
                      {" ] M     [   ]N\r\n                                "}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #000", borderTop: "none", padding: "2px 4px", whiteSpace: "nowrap", width: "10%" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"BIRTHDATE"}
              </span>
              <br />
              <span style={{ fontSize: "11px", fontWeight: "bold" }}>
                {"01/01/2000"}
              </span>
            </td>
            <td style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px", whiteSpace: "nowrap", width: "8%" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"AGE"}
              </span>
              <br />
              <span style={{ fontSize: "11px", fontWeight: "bold" }}>
                {"26 yr(s)"}
              </span>
            </td>
            <td colSpan={2} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px", width: "18%" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"BIRTH PLACE"}
              </span>
            </td>
            <td colSpan={2} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px", width: "14%" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"NATIONALITY"}
              </span>
              <br />
              <span style={{ fontSize: "11px", fontWeight: "bold" }}>
                {"Filipino"}
              </span>
            </td>
            <td style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px", width: "14%" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"RELIGION"}
              </span>
              <br />
              <span style={{ fontSize: "11px", fontWeight: "bold" }}>
                {"Catholic"}
              </span>
            </td>
            <td colSpan={3} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"OCCUPATION"}
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={3} style={{ border: "1px solid #000", borderTop: "none", padding: "2px 4px", height: "30px" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"EMPLOYER (Type of Business)"}
              </span>
            </td>
            <td colSpan={4} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px", textAlign: "center" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"ADDRESS"}
              </span>
            </td>
            <td colSpan={3} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"TEL. NO."}
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={3} style={{ border: "1px solid #000", borderTop: "none", padding: "2px 4px", height: "30px" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"FATHER'S NAME"}
              </span>
            </td>
            <td colSpan={4} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px", textAlign: "center" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"ADDRESS"}
              </span>
            </td>
            <td colSpan={3} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"TEL. NO."}
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={3} style={{ border: "1px solid #000", borderTop: "none", padding: "2px 4px", height: "30px" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"MOTHER'S (MAIDEN) NAME"}
              </span>
            </td>
            <td colSpan={4} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px", textAlign: "center" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"ADDRESS"}
              </span>
            </td>
            <td colSpan={3} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"TEL. NO."}
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={3} style={{ border: "1px solid #000", borderTop: "none", padding: "2px 4px", height: "30px" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"SPOUSE NAME"}
              </span>
            </td>
            <td colSpan={4} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px", textAlign: "center" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"ADDRESS"}
              </span>
            </td>
            <td colSpan={3} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"TEL. NO."}
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ border: "1px solid #000", borderTop: "none", padding: "2px 4px", verticalAlign: "top", width: "17%" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"ADMISSION"}
              </span>
              <br />
              <br />
              <span style={{ fontSize: "9.5px" }}>
                {"DATE : "}
              </span>
              <span style={{ fontSize: "10.5px", fontWeight: "bold" }}>
                {"03/21/2026"}
              </span>
              <br />
              <span style={{ fontSize: "9.5px" }}>
                {"TIME : "}
              </span>
              <span style={{ fontSize: "10.5px", fontWeight: "bold" }}>
                {"02:45 PM"}
              </span>
            </td>
            <td colSpan={2} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px", verticalAlign: "top", width: "17%" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"DISCHARGE"}
              </span>
              <br />
              <span style={{ fontSize: "9.5px" }}>
                {"DATE :"}
              </span>
              <br />
              <span style={{ fontSize: "9.5px" }}>
                {"TIME :"}
              </span>
            </td>
            <td rowSpan={2} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px", textAlign: "center", verticalAlign: "middle", width: "9%" }}>
              <span style={{ fontSize: "9px" }}>
                {"TOTAL NO"}
                <br />
                {"OF DAYS"}
              </span>
              <br />
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                {"1"}
              </span>
            </td>
            <td colSpan={5} rowSpan={2} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px", verticalAlign: "top", height: "72px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", height: "100%" }}>
                <tr>
                  <td style={{ border: "none", padding: "2px 4px", verticalAlign: "top", height: "50%" }}>
                    <span style={{ fontSize: "9.5px" }}>
                      {"ADMITTING PHYSICIAN"}
                    </span>
                    <br />
                    <span style={{ fontSize: "10.5px", fontWeight: "bold", display: "block", textAlign: "center", paddingRight: "15px" }}>
                      {"-- -. --, MD"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none", borderTop: "1px solid #000", padding: "2px 4px", verticalAlign: "top", height: "50%" }}>
                    <span style={{ fontSize: "9.5px" }}>
                      {"ATTENDING PHYSICIAN/SIGNATURE"}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td colSpan={4} style={{ border: "1px solid #000", borderTop: "none", padding: "2px 4px", verticalAlign: "top" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"ADMITTING CLERK"}
              </span>
              <br />
              <span style={{ fontSize: "11px", fontWeight: "bold" }}>
                {"ROWAN M. LIQUE"}
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={4} style={{ border: "1px solid #000", borderTop: "none", padding: "3px 6px" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"TYPE OF ADMISSION :"}
              </span>
              <br />
              <div style={{ display: "flex", gap: "30px", marginTop: "4px" }}>
                <span className="checkbox-item-large">
                  {"["}
                  <b>
                    {"X"}
                  </b>
                  {"] NEW"}
                </span>
                <span className="checkbox-item-large">
                  {"[ ] OLD"}
                </span>
                <span className="checkbox-item-large">
                  {"[ ] FORMER OPD"}
                </span>
              </div>
            </td>
            <td colSpan={6} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px", verticalAlign: "top" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"REFERRED BY :"}
              </span>
              <br />
              <span style={{ fontSize: "9.5px" }}>
                {"(Physician/Agency)"}
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={10} style={{ border: "1px solid #000", borderTop: "none", padding: "3px 8px" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"SOCIAL SERVICE CLASSIFICATION :"}
              </span>
              {"          \r\n                    "}
              <span style={{ marginLeft: "8px" }}>
                <span className="checkbox-item-large">
                  {"[    ]A"}
                </span>
                {"              \r\n                        "}
                <span className="checkbox-item-large">
                  {"[    ]B"}
                </span>
                {"              \r\n                        "}
                <span className="checkbox-item-large">
                  {"[    ]C1"}
                </span>
                {"             \r\n                        "}
                <span className="checkbox-item-large">
                  {"[    ]C2"}
                </span>
                {"             \r\n                        "}
                <span className="checkbox-item-large">
                  {"[    ]C3"}
                </span>
                {"             \r\n                        "}
                <span className="checkbox-item-large">
                  {"[    ]D"}
                </span>
                {"             \r\n                    "}
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ border: "1px solid #000", borderTop: "none", padding: "2px 4px", verticalAlign: "top", width: "18%" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"ALERT :"}
                <br />
                {"ALLERGIC TO"}
              </span>
            </td>
            <td colSpan={3} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px", textAlign: "left" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"HOSPITALIZATION PLAN"}
                <br />
                {"COMPANY/INDUSTRIAL NAME"}
              </span>
              <span style={{ fontSize: "11px", fontWeight: "bold", textAlign: "center", display: "block", marginTop: "6px" }}>
                {"N/A"}
              </span>
            </td>
            <td colSpan={3} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px", textAlign: "left" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"HEALTH INSURANCE NAME"}
              </span>
              <span style={{ fontSize: "11px", fontWeight: "bold", textAlign: "center", display: "block", marginTop: "17px" }}>
                {"N/A"}
              </span>
            </td>
            <td colSpan={2} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px", textAlign: "left" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"TYPE OF INSURANCE"}
                <br />
                {"COVERAGE"}
              </span>
              <span style={{ fontSize: "11px", fontWeight: "bold", textAlign: "center", display: "block", marginTop: "6px" }}>
                {"N/A"}
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={3} style={{ border: "1px solid #000", borderTop: "none", padding: "2px 4px", height: "48px", verticalAlign: "top" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"DATA FURNISHED BY : (signature over printed name)"}
              </span>
              <div style={{ marginTop: "4px", fontSize: "11px", fontWeight: "bold" }}>
                {"SHI SU KA"}
              </div>
            </td>
            <td colSpan={4} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px", verticalAlign: "top" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"ADDRESS OF INFORMANT"}
              </span>
            </td>
            <td colSpan={3} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px", verticalAlign: "top" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"RELATION TO PATIENT"}
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={10} style={{ border: "1px solid #000", borderTop: "none", padding: "3px 6px", height: "38px", verticalAlign: "top" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"ADMISSION DIAGNOSIS : "}
              </span>
              <span style={{ fontSize: "10.5px", fontWeight: "bold" }}>
                {"TEST ADMITTING DIAGNOSIS. FOR SYSTEM MAINTENANCE PURPOSE. PLEASE IGNORE THIS RECORD"}
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={3} style={{ border: "1px solid #000", borderTop: "none", padding: "2px 4px", height: "55px", verticalAlign: "top", width: "105px", minWidth: "105px", maxWidth: "105px" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"PRINCIPAL DIAGNOSIS :"}
              </span>
            </td>
            <td colSpan={5} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px", verticalAlign: "top" }}>
              {"\r\n                     \r\n                "}
            </td>
            <td colSpan={2} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px", verticalAlign: "top", width: "18%" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"ICD CODE NO."}
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={10} style={{ border: "1px solid #000", borderTop: "none", padding: "2px 6px", height: "36px", verticalAlign: "top" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"OTHER DIAGNOSES :"}
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={8} style={{ border: "1px solid #000", borderTop: "none", padding: "2px 4px", height: "26px", verticalAlign: "top" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"PRINCIPAL OPERATION/PROCEDURE :"}
              </span>
            </td>
            <td colSpan={2} style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2px 4px", verticalAlign: "top" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"ICPM CODE"}
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={10} style={{ border: "1px solid #000", borderTop: "none", padding: "2px 6px", height: "26px", verticalAlign: "top" }}>
              <span style={{ fontSize: "9.5px" }}>
                {"OTHER OPERATION(S) PROCEDURE(S) :"}
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={10} style={{ border: "1px solid #000", borderTop: "none", padding: "0", height: "54px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", height: "100%" }}>
                <tr>
                  <td style={{ border: "none", padding: "4px 6px", textAlign: "center", verticalAlign: "middle", width: "50%" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="220" height="42" viewBox="0 0 220 42">
                      <rect x="0" y="0" width="2" height="42" fill="#000" />
                      <rect x="4" y="0" width="1" height="42" fill="#000" />
                      <rect x="7" y="0" width="3" height="42" fill="#000" />
                      <rect x="12" y="0" width="1" height="42" fill="#000" />
                      <rect x="15" y="0" width="2" height="42" fill="#000" />
                      <rect x="19" y="0" width="1" height="42" fill="#000" />
                      <rect x="22" y="0" width="3" height="42" fill="#000" />
                      <rect x="27" y="0" width="1" height="42" fill="#000" />
                      <rect x="30" y="0" width="2" height="42" fill="#000" />
                      <rect x="34" y="0" width="1" height="42" fill="#000" />
                      <rect x="37" y="0" width="3" height="42" fill="#000" />
                      <rect x="42" y="0" width="2" height="42" fill="#000" />
                      <rect x="46" y="0" width="1" height="42" fill="#000" />
                      <rect x="49" y="0" width="3" height="42" fill="#000" />
                      <rect x="54" y="0" width="1" height="42" fill="#000" />
                      <rect x="57" y="0" width="2" height="42" fill="#000" />
                      <rect x="61" y="0" width="3" height="42" fill="#000" />
                      <rect x="66" y="0" width="1" height="42" fill="#000" />
                      <rect x="69" y="0" width="2" height="42" fill="#000" />
                      <rect x="73" y="0" width="1" height="42" fill="#000" />
                      <rect x="76" y="0" width="3" height="42" fill="#000" />
                      <rect x="81" y="0" width="2" height="42" fill="#000" />
                      <rect x="85" y="0" width="1" height="42" fill="#000" />
                      <rect x="88" y="0" width="2" height="42" fill="#000" />
                      <rect x="92" y="0" width="3" height="42" fill="#000" />
                      <rect x="97" y="0" width="1" height="42" fill="#000" />
                      <rect x="100" y="0" width="2" height="42" fill="#000" />
                      <rect x="104" y="0" width="1" height="42" fill="#000" />
                      <rect x="107" y="0" width="3" height="42" fill="#000" />
                      <rect x="112" y="0" width="1" height="42" fill="#000" />
                      <rect x="115" y="0" width="2" height="42" fill="#000" />
                      <rect x="119" y="0" width="3" height="42" fill="#000" />
                      <rect x="124" y="0" width="1" height="42" fill="#000" />
                      <rect x="127" y="0" width="2" height="42" fill="#000" />
                      <rect x="131" y="0" width="1" height="42" fill="#000" />
                      <rect x="134" y="0" width="3" height="42" fill="#000" />
                      <rect x="139" y="0" width="2" height="42" fill="#000" />
                      <rect x="143" y="0" width="1" height="42" fill="#000" />
                      <rect x="146" y="0" width="3" height="42" fill="#000" />
                      <rect x="151" y="0" width="1" height="42" fill="#000" />
                      <rect x="154" y="0" width="2" height="42" fill="#000" />
                      <rect x="158" y="0" width="1" height="42" fill="#000" />
                      <rect x="161" y="0" width="3" height="42" fill="#000" />
                      <rect x="166" y="0" width="2" height="42" fill="#000" />
                      <rect x="170" y="0" width="1" height="42" fill="#000" />
                      <rect x="173" y="0" width="2" height="42" fill="#000" />
                      <rect x="177" y="0" width="3" height="42" fill="#000" />
                      <rect x="182" y="0" width="1" height="42" fill="#000" />
                      <rect x="185" y="0" width="2" height="42" fill="#000" />
                      <rect x="189" y="0" width="1" height="42" fill="#000" />
                      <rect x="192" y="0" width="3" height="42" fill="#000" />
                      <rect x="197" y="0" width="1" height="42" fill="#000" />
                      <rect x="200" y="0" width="2" height="42" fill="#000" />
                      <rect x="204" y="0" width="3" height="42" fill="#000" />
                      <rect x="209" y="0" width="1" height="42" fill="#000" />
                      <rect x="212" y="0" width="2" height="42" fill="#000" />
                      <rect x="216" y="0" width="2" height="42" fill="#000" />
                      <rect x="219" y="0" width="1" height="42" fill="#000" />
                    </svg>
                  </td>
                  <td style={{ border: "none", borderLeft: "1px solid #000", padding: "4px 6px", verticalAlign: "middle", width: "50%" }}>
                    {"\r\n                                 \r\n                            "}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td colSpan={10} style={{ border: "1px solid #000", borderTop: "none", borderBottom: "none", padding: "4px 8px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tr>
                  <td style={{ border: "none", padding: "0", verticalAlign: "top", width: "50%" }}>
                    <div style={{ fontSize: "9.5px", fontWeight: "normal", marginBottom: "4px" }}>
                      {"DISPOSITION"}
                    </div>
                    <table style={{ borderCollapse: "collapse" }}>
                      <tr>
                        <td style={{ border: "none", padding: "2px 6px 2px 0", fontSize: "11px", whiteSpace: "nowrap" }}>
                          {"[ ] DISCHARGED"}
                        </td>
                        <td style={{ border: "none", padding: "2px 14px", fontSize: "11px", whiteSpace: "nowrap" }}>
                          {"[ ] DAMA"}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: "none", padding: "2px 6px 2px 0", fontSize: "11px", whiteSpace: "nowrap" }}>
                          {"[ ] TRANSFERRED"}
                        </td>
                        <td style={{ border: "none", padding: "2px 14px", fontSize: "11px", whiteSpace: "nowrap" }}>
                          {"[ ] ABSCONDED"}
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style={{ border: "none", padding: "0", verticalAlign: "top" }}>
                    <div style={{ fontSize: "9.5px", fontWeight: "normal", marginBottom: "4px" }}>
                      {"RESULTS"}
                    </div>
                    <table style={{ borderCollapse: "collapse" }}>
                      <tr>
                        <td style={{ border: "none", padding: "2px 6px 2px 0", fontSize: "11px", whiteSpace: "nowrap" }}>
                          {"[ ] RECOVERED"}
                        </td>
                        <td style={{ border: "none", padding: "2px 10px", fontSize: "11px", whiteSpace: "nowrap" }}>
                          {"[ ] DIED"}
                        </td>
                        <td style={{ border: "none", padding: "2px 10px", fontSize: "11px", whiteSpace: "nowrap" }}>
                          {"[ ] AUTOPSY"}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: "none", padding: "2px 6px 2px 0", fontSize: "11px", whiteSpace: "nowrap" }}>
                          {"[ ] IMPROVED"}
                        </td>
                        <td style={{ border: "none", padding: "2px 10px", fontSize: "11px", whiteSpace: "nowrap" }}>
                          {"[ ] -48 HOURS"}
                        </td>
                        <td style={{ border: "none", padding: "2px 10px", fontSize: "11px", whiteSpace: "nowrap" }}>
                          {"[ ] NO AUTOPSY"}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: "none", padding: "2px 6px 2px 0", fontSize: "11px", whiteSpace: "nowrap" }}>
                          {"[ ] UNIMPROVED"}
                        </td>
                        <td style={{ border: "none", padding: "2px 10px", fontSize: "11px", whiteSpace: "nowrap" }}>
                          {"[ ] +48 HOURS"}
                        </td>
                        <td style={{ border: "none", padding: "2px 10px", fontSize: "11px" }}>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td colSpan={10} style={{ border: "1px solid #000", borderTop: "none", padding: "3px 8px", textAlign: "right" }}>
              <span style={{ fontSize: "10px" }}>
                {"Hospital Number:   "}
              </span>
              <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                {"000000000777288"}
              </span>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </>
);

export default ClinicalCoverSheet;
