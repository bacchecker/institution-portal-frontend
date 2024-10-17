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
          institution,
          token,
          isAuthenticated: true,
        }),

      // Action to log out the user
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage", // Name of the localStorage key
      getStorage: () => localStorage, // Store in localStorage
    }
  )
);

export default useAuthStore;
