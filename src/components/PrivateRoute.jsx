import React from "react";
import LoadingToRedirect from "./LoadingToRedirect";
import secureLocalStorage from "react-secure-storage";

function PrivateRoute({ children }) {
  const token = JSON?.parse(secureLocalStorage?.getItem("userToken"))?.token;

  return token ? children : <LoadingToRedirect />;
}

export default PrivateRoute;
