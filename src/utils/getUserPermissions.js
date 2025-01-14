import secureLocalStorage from "react-secure-storage";

export const getUserPermissions = () => {
  const institutionName = JSON?.parse(
    secureLocalStorage?.getItem("userPermissions")
  )?.names;

  return institutionName || []; // Return permissions or an empty array
};
