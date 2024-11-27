import React from "react";
import RedirectPage from "./RedirectPage";
import secureLocalStorage from "react-secure-storage";

function AuthenticationProtectedRoute({ children }) {
  const two_factor = JSON?.parse(
    secureLocalStorage?.getItem("user")
  )?.two_factor;

  return two_factor ? children : <RedirectPage />;
}

export default AuthenticationProtectedRoute;
