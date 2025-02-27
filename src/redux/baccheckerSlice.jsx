import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentRegScreen: "accountType",
  applicantCurrentScreen: 1,
  institutionCurrentScreen: 1,
  inputValues: {},
  institutionInputValues: {},
  selectedTab: null,
  message: {},
  selectedFrontImage: null,
  selectedBackImage: null,
};

const baccheckerSlice = createSlice({
  name: "bacchecker",
  initialState,
  reducers: {
    setCurrentRegScreen: (state, action) => {
      state.currentRegScreen = action.payload;
    },
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setApplicantCurrentScreen: (state, action) => {
      state.applicantCurrentScreen = action.payload;
    },
    setInstitutionCurrentScreen: (state, action) => {
      state.institutionCurrentScreen = action.payload;
    },
    setInputValue: (state, action) => {
      const { name, value } = action.payload;
      if (name && value !== undefined) {
        if (!state.inputValues) {
          state.inputValues = {};
        }
        state.inputValues[name] = value;
      } else {
        console.error("Invalid input value or name");
      }
    },
    resetInputValues: (state) => {
      state.inputValues = {};
    },
    setInstitutionInputValue: (state, action) => {
      const { name, value } = action.payload;
      if (name && value !== undefined) {
        if (!state.institutionInputValues) {
          state.institutionInputValues = {};
        }
        state.institutionInputValues[name] = value;
      } else {
        console.error("Invalid input value or name");
      }
    },
    resetInstitutionInputValues: (state) => {
      state.institutionInputValues = {};
    },
    setSelectedFrontImage: (state, action) => {
      state.selectedFrontImage = action.payload;
    },
    setSelectedBackImage: (state, action) => {
      state.selectedBackImage = action.payload;
    },
  },
});

export const {
  setCurrentRegScreen,
  setInputValue,
  setSelectedFrontImage,
  setSelectedBackImage,
  setApplicantCurrentScreen,
  resetInputValues,
  setInstitutionCurrentScreen,
  setInstitutionInputValue,
  resetInstitutionInputValues,
  setSelectedTab,
  setMessage
} = baccheckerSlice.actions;

export default baccheckerSlice.reducer;
