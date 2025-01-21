import secureLocalStorage from "react-secure-storage";

const STORAGE_KEYS = {
  USER: "user",
  TOKEN: "userToken",
  PERMISSIONS: "userPermissions",
  ROLE: "userRole",
};

export const storage = {
  // Get methods
  getUser: () => JSON.parse(secureLocalStorage.getItem(STORAGE_KEYS.USER)),
  getToken: () => JSON.parse(secureLocalStorage.getItem(STORAGE_KEYS.TOKEN)),
  getPermissions: () => {
    const perms = secureLocalStorage.getItem(STORAGE_KEYS.PERMISSIONS);
    return typeof perms === "string" ? JSON.parse(perms) : perms;
  },
  getRole: () => JSON.parse(secureLocalStorage.getItem(STORAGE_KEYS.ROLE)),

  // Set methods
  setUser: (userData) =>
    secureLocalStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData)),
  setToken: (token) =>
    secureLocalStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify({ token })),
  setPermissions: (permissions) =>
    secureLocalStorage.setItem(
      STORAGE_KEYS.PERMISSIONS,
      JSON.stringify(permissions)
    ),
  setRole: (role) =>
    secureLocalStorage.setItem(STORAGE_KEYS.ROLE, JSON.stringify(role)),

  // Clear methods
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      secureLocalStorage.removeItem(key);
    });
  },

  clearAuth: () => {
    secureLocalStorage.removeItem(STORAGE_KEYS.TOKEN);
    secureLocalStorage.removeItem(STORAGE_KEYS.PERMISSIONS);
    secureLocalStorage.removeItem(STORAGE_KEYS.ROLE);
  },

  // Check methods
  hasValidSession: () => {
    const token = storage.getToken();
    const user = storage.getUser();
    return !!(token?.token && user);
  },
};
