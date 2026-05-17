import { all_routes } from "@/routes/all_routes";

export interface nurseSidebarItem {
  label: string;
  path: string;
  icon?: string;
  badge?: number;
  relativeLinks?: string[]; 
}

export const nurseSidebarData: nurseSidebarItem[] = [
  {
    label: "Dashboard",
    path: all_routes.nurseDashboard,
    icon: "isax isax-category-2",
  },
  {
    label: "Reg Details",
    path: all_routes.nurseRegDetails,
    icon: "fa-solid fa-user-injured", 
  },
  {
    label: "PreBill",
    path: all_routes.nursePreBill,
    icon: "isax isax-clock",
  },
  {
    label: "Discharge",
    path: all_routes.nurseDischarge,
    icon: "isax isax-export-1",
  },
  {
    label: "Forms",
    path: all_routes.nurseForms,
    icon: "isax isax-calendar-1",
  },
  {
    label: "Charges",
    path: all_routes.nurseCharges,
    icon: "isax isax-calendar-tick",
  },
  {
    label: "Accomodation",
    path: all_routes.nurseAccomodation,
    icon: "isax isax-clipboard-tick", 
  },
];
