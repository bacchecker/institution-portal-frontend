import { createSlice } from "@reduxjs/toolkit";
import secureLocalStorage from "react-secure-storage";

const initialState = {
  token: null,
  user: null,
  two_factor: null,
  institution: null,
  selectedTemplate: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      secureLocalStorage.setItem(
        "user",
        JSON.stringify({
          user: action.payload.user,
          token: action.payload.token,
          two_factor: action.payload.two_factor,
          institution: action.payload.institution,
          selectedTemplate: action.payload.selectedTemplate,
        })
      );
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.two_factor = action.payload.two_factor;
      state.institution = action.payload.institution;
      state.selectedTemplate = action.payload.selectedTemplate;
    },
    logout: (state) => {
      secureLocalStorage.clear();
      state.user = null;
      state.token = null;
      state.two_factor = null;
      state.institution = null;
      state.selectedTemplate = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
