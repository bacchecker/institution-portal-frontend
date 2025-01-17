import React from "react";
import secureLocalStorage from "react-secure-storage";
import RedirectToAccountSetupPage from "./RedirectToAccountSetupPage";

function AccountSetupProtectedRoute({ children }) {
  const user = JSON?.parse(secureLocalStorage?.getItem("user"));

  

  return user?.institution?.setup_done === 1 ? (
    children
  ) : (
    <RedirectToAccountSetupPage />
  );
}

export default AccountSetupProtectedRoute;
