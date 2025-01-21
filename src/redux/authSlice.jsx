import { createSlice } from "@reduxjs/toolkit";
import { storage } from "../utils/storage";

const initialState = {
  token: null,
  user: null,
  permissions: [],
  subscription: null,
  two_factor: null,
  institution: null,
  selectedTemplate: null,
  isAdmin: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const userData = {
        user: action.payload.user,
        two_factor: action.payload.two_factor,
        institution: action.payload.institution,
        subscription: action.payload.subscription,
        selectedTemplate: action.payload.selectedTemplate,
      };

      // Update storage
      storage.setUser(userData);

      // Update state
      state.user = action.payload.user;
      state.two_factor = action.payload.two_factor;
      state.institution = action.payload.institution;
      state.selectedTemplate = action.payload.selectedTemplate;
      state.subscription = action.payload.subscription;
    },
    setUserToken: (state, action) => {
      storage.setToken(action.payload.token);
      state.token = action.payload.token;
    },
    setIsAdmin: (state, action) => {
      storage.setRole({ isAdmin: action.payload.isAdmin });
      state.isAdmin = action.payload.isAdmin;
    },
    setUserPermissions: (state, action) => {
      storage.setPermissions(action.payload.permissions);
      state.permissions = action.payload.permissions;
    },
    logout: (state) => {
      // Clear storage
      storage.clearAll();

      // Reset state
      Object.assign(state, initialState);
    },
  },
});

export const { setUser, logout, setUserToken, setUserPermissions, setIsAdmin } =
  authSlice.actions;

export default authSlice.reducer;
