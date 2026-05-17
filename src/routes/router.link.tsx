import { Navigate, Route } from "react-router";
import { all_routes } from "./all_routes";
import { lazy, Suspense } from "react";

//Doctor Module Components
const DoctorDashboard = lazy(() => import("@/pages/doctor-modules/doctor-dashboard/doctorDashboard"));
const DoctorHistory = lazy(() => import("@/pages/doctor-modules/history/history"));
const SignsSymptoms = lazy(() => import("@/pages/doctor-modules/signsSymptoms/signsSymptomps"));
const PhysicalExams = lazy(() => import("@/pages/doctor-modules/physicalExams/physicalExams"));
const MyPatients = lazy(() => import("@/pages/doctor-modules/my-patients/myPatients"));
const ReviewofSystem = lazy(() => import("@/pages/doctor-modules/reviewofSystem/reviewofSystem"));
const WardCourse = lazy(() => import("@/pages/doctor-modules/wardCourse/wardCourse"));
const DrugsMeds = lazy(() => import("@/pages/doctor-modules/drugsMeds/drugsMeds"));
const Procedures = lazy(() => import("@/pages/doctor-modules/procedures/procedures"));
const PatientlabDiag = lazy(() => import("@/pages/doctor-modules/patientLabDiag/patientLabDiag"));
const Desposition = lazy(() => import("@/pages/doctor-modules/desposition/desposition"));
const DischargeInstruction = lazy(() => import("@/pages/doctor-modules/dischargeinstruction/dischargeInstruction"));
const Physician = lazy(() => import("@/pages/doctor-modules/physician/physician"));
const Signatory = lazy(() => import("@/pages/doctor-modules/signatory/signatory"));
const Diagnosis = lazy(() => import("@/pages/doctor-modules/diagnosis/diagnosis"));
const DoctorPrintableForms = lazy(() => import("@/pages/doctor-modules/printableForms/printableForms")); 
const PatientLog     = lazy(() => import("@/pages/doctor-modules/patientLog/patientLog"));
const ArchiveViewer  = lazy(() => import("@/pages/doctor-modules/archiveViewer/archiveViewer"));
const Reports        = lazy(() => import("@/pages/doctor-modules/reports/reports"));
//Nurse Module Components
const NurseDashboard = lazy (() => import ("@/pages/nurse-modules/nurse-dashboard/nurseDashboard"));
const RegDetails = lazy(() => import("@/pages/nurse-modules/RegDetails/regDetails")); 
const Forms = lazy (() => import ("@/pages/nurse-modules/nurseForms/forms"));
const Accomodation = lazy (() => import ("@/pages/nurse-modules/accomodation/accomodation"));
const Charges = lazy (() => import ("@/pages/nurse-modules/nurseCharges/charges"));
const PreBill = lazy (() => import ("@/pages/nurse-modules/PreBill/preBill"));
const Discharge = lazy (() => import ("@/pages/nurse-modules/nurseDischarge/discharge")); 
const NursePatientLog = lazy(() => import("@/pages/nurse-modules/patientLog/patientLog"));
const NurseUtility = lazy(() => import("@/pages/nurse-modules/utility/utility"));
const NurseRequestTemplate = lazy(() => import("@/pages/nurse-modules/utility/requestTemplate"));
const NurseRequisition = lazy(() => import("@/pages/nurse-modules/utility/requisition"));
const NurseSupplyRequisition = lazy(() => import("@/pages/nurse-modules/utility/supplyRequisition"));
const NurseReport = lazy(() => import("@/pages/nurse-modules/report/report"));

//Auth Components
const Login = lazy(() => import("@/pages/authentication/login/login"));
const Maintenance = lazy(() => import("@/pages/authentication/maintanence"));
const Error404 = lazy(() => import("@/pages/authentication/error-404/error404"));
const Error500 = lazy(() => import("@/pages/authentication/error-500/error500"));
const Unauthorized = lazy(() => import("@/pages/authentication/unauthorized"));

const route = all_routes;
console.log("doctorWardCourse path:", route.doctorWardCourse);
const suspenseFallback = <div></div>;

//Public Routes
export const publicRoutes = [
  {
    path: "/",
    name: "Root",
    element: <Navigate to={route.login} />,
    route: Route,
  },
];

//Auth Routes
export const authRoutes = [
  {
    id: "1",
    path: route.login,
    element: (
      <Suspense fallback={suspenseFallback}>
        <Login />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "12",
    path: route.maintenance,
    element: (
      <Suspense fallback={suspenseFallback}>
        <Maintenance />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "13",
    path: route.error404,
    element: (
      <Suspense fallback={suspenseFallback}>
        <Error404 />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "14",
    path: route.error500,
    element: (
      <Suspense fallback={suspenseFallback}>
        <Error500 />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "15",
    path: route.unauthorized,
    element: (
      <Suspense fallback={suspenseFallback}>
        <Unauthorized />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  }
];

//Custom layout 
export const customLayout = [
  //Doctors Module
  {
    id: "1",
    path: route.doctorDashboard,
    element: (
      <Suspense fallback={suspenseFallback}>
        <DoctorDashboard />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "2",
    path: route.doctorHistory,
    element: (
      <Suspense fallback={suspenseFallback}>
        <DoctorHistory />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "3",
    path: route.doctorSignsSymps,
    element: (
      <Suspense fallback={suspenseFallback}>
        <SignsSymptoms />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "4",
    path: route.doctorphysicalExams,
    element: (
      <Suspense fallback={suspenseFallback}>
        <PhysicalExams />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "5",
    path: route.doctorMypatients,
    element: (
      <Suspense fallback={suspenseFallback}>
        <MyPatients />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "6",
    path: route.doctorreviewofSystem,
    element: (
      <Suspense fallback={suspenseFallback}>
        <ReviewofSystem />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "7",
    path: route.doctorWardCourse,
    element: (
      <Suspense fallback={suspenseFallback}>
        <WardCourse />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "8",
    path: route.doctordrugsMeds,
    element: (
      <Suspense fallback={suspenseFallback}>
        <DrugsMeds />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "9",
    path: route.doctorProcedures,
    element: (
      <Suspense fallback={suspenseFallback}>
        <Procedures />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "10",
    path: route.doctorPatientLabDiag,
    element: (
      <Suspense fallback={suspenseFallback}>
        <PatientlabDiag />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "11",
    path: route.doctorDesposition,
    element: (
      <Suspense fallback={suspenseFallback}>
        <Desposition/>
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "12",
    path: route.doctorPhysicain,
    element: (
      <Suspense fallback={suspenseFallback}>
        <Physician />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "13",
    path: route.doctorSignatory,
    element: (
      <Suspense fallback={suspenseFallback}>
        <Signatory />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "14",
    path: route.doctorDiagnosis,
    element: (
      <Suspense fallback={suspenseFallback}>
        <Diagnosis />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "14-discharge",
    path: route.doctorDischargeInstruction,
    element: (
      <Suspense fallback={suspenseFallback}>
        <DischargeInstruction />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "14-printable",
    path: route.doctorPrintableForms,
    element: (
      <Suspense fallback={suspenseFallback}>
        <DoctorPrintableForms />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },

  //Nurse Module
    {
    id: "15",
    path: route.nurseDashboard,
    element: (
      <Suspense fallback={suspenseFallback}>
        <NurseDashboard />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
      {
    id: "16",
    path: route.nurseRegDetails,
    element: (
      <Suspense fallback={suspenseFallback}>
        <RegDetails />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "17",
    path: route.nurseForms,
    element: (
      <Suspense fallback={suspenseFallback}>
        <Forms />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "18",
    path: route.nurseAccomodation,
    element: (
      <Suspense fallback={suspenseFallback}>
        <Accomodation/>
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "19",
    path: route.nurseCharges,
    element: (
      <Suspense fallback={suspenseFallback}>
        <Charges />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "20",
    path: route.nursePreBill,
    element: (
      <Suspense fallback={suspenseFallback}>
        <PreBill />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "21",
    path: route.nurseDischarge,
    element: (
      <Suspense fallback={suspenseFallback}>
        <Discharge />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "nurse-utility-patientlog",
    path: route.nursePatientLog,
    element: (
      <Suspense fallback={suspenseFallback}>
        <NursePatientLog />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "nurse-utility-tools",
    path: route.nurseUtility,
    element: (
      <Suspense fallback={suspenseFallback}>
        <NurseUtility />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "nurse-utility-request-template",
    path: route.nurseRequestTemplate,
    element: (
      <Suspense fallback={suspenseFallback}>
        <NurseRequestTemplate />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "nurse-utility-requisition",
    path: route.nurseRequisition,
    element: (
      <Suspense fallback={suspenseFallback}>
        <NurseRequisition />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "nurse-utility-supply-requisition",
    path: route.nurseSupplyRequisition,
    element: (
      <Suspense fallback={suspenseFallback}>
        <NurseSupplyRequisition />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },
  {
    id: "nurse-utility-report",
    path: route.nurseReport,
    element: (
      <Suspense fallback={suspenseFallback}>
        <NurseReport />
      </Suspense>
    ),
    route: Route,
    meta_title: "BRHMC",
  },

  {
  id: "utility-patientlog",
  path: route.doctorPatientLog,
  element: (
    <Suspense fallback={suspenseFallback}>
      <PatientLog />
    </Suspense>
  ),
  route: Route,
  meta_title: "BRHMC",
},
{
  id: "utility-archiveviewer",
  path: route.doctorArchiveViewer,
  element: (
    <Suspense fallback={suspenseFallback}>
      <ArchiveViewer />
    </Suspense>
  ),
  route: Route,
  meta_title: "BRHMC",
},
{
  id: "utility-reports",
  path: route.doctorReports,
  element: (
    <Suspense fallback={suspenseFallback}>
      <Reports />
    </Suspense>
  ),
  route: Route,
  meta_title: "BRHMC",
},
];
