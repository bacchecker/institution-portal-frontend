import PropTypes from "prop-types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccountStatus } from "../utils/AccountStatus";

const AccountSetupProtection = ({ children }) => {
  const navigate = useNavigate();
  const accountStatus = getAccountStatus();

  useEffect(() => {
    if (!accountStatus) return;

    const { isActive, isInactive, setupDone, currentStep } = accountStatus;

    if (isInactive) {
      navigate("/account-under-review", { replace: true });
      return;
    }

    if (isActive && (setupDone || currentStep === 5)) {
      navigate("/dashboard", { replace: true });
      return;
    }
  }, [accountStatus, navigate]);

  return children;
};

AccountSetupProtection.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AccountSetupProtection;
