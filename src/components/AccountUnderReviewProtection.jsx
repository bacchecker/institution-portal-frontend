import React from "react";
import secureLocalStorage from "react-secure-storage";
import RedirectPage from "./RedirectPage";

function AccountUnderReviewProtection({ children }) {
  const user = JSON?.parse(secureLocalStorage?.getItem("user"));

  return user?.institution?.status === "inactive" && !user?.institution?.setup_done ? children : <RedirectPage />;
}

export default AccountUnderReviewProtection;
