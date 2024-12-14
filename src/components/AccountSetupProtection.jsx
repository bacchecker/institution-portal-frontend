import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";

function AccountSetupProtection({ children }) {
  const navigate = useNavigate();

  const user = JSON?.parse(secureLocalStorage?.getItem("user"));

  useEffect(() => {
    if (
      user?.institution?.status !== "active" &&
      !user?.institution?.setup_done
    ) {
      navigate("/account-under-review");
    }
  }, [user]);

  if (
    user?.institution?.status === "active" &&
    !user?.institution?.setup_done
  ) {
    return children;
  }

  navigate(-1);
  return null;
}

export default AccountSetupProtection;
