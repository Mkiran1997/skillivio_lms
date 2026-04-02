import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface UiState {
//   sidebarOpen: boolean;
//   activeSection: string;
// }

const initialState/*: UiState*/ = {
  sidebarOpen: true,
  activeSection: "Dashboard",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action/*: PayloadAction<boolean>*/) => {
      state.sidebarOpen = action.payload;
    },
    setActiveSection: (state, action/*: PayloadAction<string>*/) => {
      state.activeSection = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setActiveSection } =
  uiSlice.actions;
export default uiSlice.reducer;
