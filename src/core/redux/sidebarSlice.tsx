import { createSlice } from "@reduxjs/toolkit";

export interface SidebarState {
  mobileSidebar: boolean;
  doctorMobileSidebar: boolean;
  nurseMobileSidebar: boolean;
  miniSidebar: boolean;
  expandMenu: boolean;
  hiddenLayout: boolean;
}

const initialState: SidebarState = {
  mobileSidebar: false,
  doctorMobileSidebar: false,
  nurseMobileSidebar: false,
  miniSidebar: false,
  expandMenu: false,
  hiddenLayout: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setMobileSidebar: (state, { payload }) => {
      state.mobileSidebar = payload;
    },

    resetMobileSidebar: (state) => {
      state.mobileSidebar = false;
    },

    setDoctorMobileSidebar: (state, { payload }) => {
      state.doctorMobileSidebar = payload;

      if (payload) {
        state.nurseMobileSidebar = false;
        state.mobileSidebar = false;
      }
    },

    resetDoctorMobileSidebar: (state) => {
      state.doctorMobileSidebar = false;
    },

    setNurseMobileSidebar: (state, { payload }) => {
      state.nurseMobileSidebar = payload;

      if (payload) {
        state.doctorMobileSidebar = false;
        state.mobileSidebar = false;
      }
    },

    resetNurseMobileSidebar: (state) => {
      state.nurseMobileSidebar = false;
    },

    setMiniSidebar: (state, { payload }) => {
      state.miniSidebar = payload;
    },

    toggleMiniSidebar: (state) => {
      state.miniSidebar = !state.miniSidebar;
    },

    setExpandMenu: (state, { payload }) => {
      state.expandMenu = payload;
    },

    setHiddenLayout: (state, { payload }) => {
      state.hiddenLayout = payload;
    },

    toggleHiddenLayout: (state) => {
      state.hiddenLayout = !state.hiddenLayout;
    },
  },
});

export const {
  setMobileSidebar,
  resetMobileSidebar,
  setDoctorMobileSidebar,
  resetDoctorMobileSidebar,
  setNurseMobileSidebar,
  resetNurseMobileSidebar,
  setMiniSidebar,
  toggleMiniSidebar,
  setExpandMenu,
  setHiddenLayout,
  toggleHiddenLayout,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;