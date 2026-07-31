import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface activeTabState {
  activeIdx: string;
}

const initialState: activeTabState = {
  activeIdx: window.localStorage.getItem("activeTab") as string,
};

export const activeTabSlice = createSlice({
  name: "activeTab",
  initialState,
  reducers: {
    changeActiveTab: (state, action: PayloadAction<string>) => {
      state.activeIdx = action.payload;
      window.localStorage.setItem("activeTab", action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeActiveTab } = activeTabSlice.actions;

export default activeTabSlice.reducer;
