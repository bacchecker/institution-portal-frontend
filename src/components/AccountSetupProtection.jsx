import React, { useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";

function AccountSetupProtection({ children }) {
  const user = secureLocalStorage
    ? JSON.parse(secureLocalStorage.getItem("user"))
    : null;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user?.institution?.status !== "active") {
      navigate("/account-under-review");
    }
  }, [user, navigate]);

  return user?.institution?.status === "active" ? children : null;
}

export default AccountSetupProtection;
