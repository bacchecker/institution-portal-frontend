import React from "react";
import secureLocalStorage from "react-secure-storage";
import RedirectPage from "./RedirectPage";

function AccountSuspendedProtection({ children }) {
  const user = JSON?.parse(secureLocalStorage?.getItem("user"));

  return user?.institution?.status === "suspended" ? children : <RedirectPage />;
}

export default AccountSuspendedProtection;
