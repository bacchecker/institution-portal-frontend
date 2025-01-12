import { createSlice } from "@reduxjs/toolkit";
import secureLocalStorage from "react-secure-storage";

const initialState = {
  token: null,
  user: null,
  permissions: [],
  subscription: null,
  two_factor: null,
  institution: null,
  selectedTemplate: null,
  isAdmin: null
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
          two_factor: action.payload.two_factor,
          institution: action.payload.institution,
          subscription: action.payload.subscription,
          selectedTemplate: action.payload.selectedTemplate,
        })
      );

      state.user = action.payload.user;
      state.two_factor = action.payload.two_factor;
      state.institution = action.payload.institution;
      state.selectedTemplate = action.payload.selectedTemplate;
    },
    setUserToken: (state, action) => {
      secureLocalStorage.setItem(
        "userToken",
        JSON.stringify({
          token: action.payload.token,
        })
      );

      state.token = action.payload.token;
    },
    setIsAdmin: (state, action) => {
      secureLocalStorage.setItem(
        "userRole",
        JSON.stringify({
          isAdmin: action.payload.isAdmin,
        })
      );
      state.isAdmin = action.payload.isAdmin;
    },
    setUserPermissions: (state, action) => {
      secureLocalStorage.setItem(
        "userPermissions",
        JSON.stringify(action.payload.permissions)
      );

      state.permissions = action.payload.permissions;
    },
    logout: (state) => {
      secureLocalStorage.clear();
      state.user = null;
      state.permissions = [];
      state.subscription = null;
      state.token = null;
      state.two_factor = null;
      state.institution = null;
      state.selectedTemplate = null;
      state.isAdmin = null
    },
  },
});

export const { setUser, logout, setUserToken, setUserPermissions, setIsAdmin } = authSlice.actions;

export default authSlice.reducer;
