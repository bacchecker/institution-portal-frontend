import secureLocalStorage from "react-secure-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      institution: null,
      isAuthenticated: false,

      // Action to log in the user
      login: (user, institution, token) =>
        set({
          user,
          token,
          institution,
          isAuthenticated: true,
        }),

      // Action to log out the user
      logout: () =>
        set({
          user: null,
          token: null,
          institution: null,
          isAuthenticated: false,
        }),
      updateInstitution: (institution) =>
        set({
          institution,
        }),
      updateUser: (user) =>
        set({
          user,
        }),
    }),
    {
      name: "auth-storage", // Name of the localStorage key
      getStorage: () => secureLocalStorage, // Store in localStorage
    }
  )
);

export default useAuthStore;