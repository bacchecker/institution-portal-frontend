import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { getAccountStatus } from "../utils/AccountStatus";

const AccountSetupProtectedRoute = ({ children }) => {
  const accountStatus = getAccountStatus();

  if (!accountStatus) {
    return <Navigate to="/" replace />;
  }

  const { isActive, setupDone, currentStep } = accountStatus;

  if (!isActive) {
    return <Navigate to="/account-under-review" replace />;
  }

  // Consider setup complete if either setup_done is true OR currentStep is 5
  const isSetupComplete = setupDone || currentStep === 5;
  if (!isSetupComplete) {
    return <Navigate to="/account-setup" replace />;
  }

  return children;
};

AccountSetupProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AccountSetupProtectedRoute;
