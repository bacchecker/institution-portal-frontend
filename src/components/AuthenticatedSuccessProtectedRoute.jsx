import React from "react";
import secureLocalStorage from "react-secure-storage";
import RedirectToMFAAuthPage from "./RedirectToMFAAuthPage";

function AuthenticatedSuccessProtectedRoute({ children }) {
  const two_factor = JSON?.parse(
    secureLocalStorage?.getItem("user")
  )?.two_factor;

  return !two_factor ? children : <RedirectToMFAAuthPage />;
}

export default AuthenticatedSuccessProtectedRoute;
