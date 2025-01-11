import secureLocalStorage from "react-secure-storage";

export const getUserPermissions = () => {
  const institutionName = JSON?.parse(secureLocalStorage?.getItem("userPermissions"))?.names;
  console.log(institutionName);
  
  return institutionName || []; // Return permissions or an empty array
};
