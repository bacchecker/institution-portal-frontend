import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { getAccountStatus } from "../utils/AccountStatus";
import { useGetInstitutionDetailsQuery } from "../redux/apiSlice";

const AccountSetupProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isLoading } = useGetInstitutionDetailsQuery(undefined, {
    // Refetch on mount to ensure we have latest data
    refetchOnMountOrArgChange: true,
    // Skip refetch if we're navigating away from account setup
    skip: location.pathname === "/dashboard" && getAccountStatus()?.setupDone
  });
  
  // Get current status from local storage
  const accountStatus = getAccountStatus();

  // During loading, maintain current route to prevent flicker
  if (isLoading) {
    return children;
  }

  if (!accountStatus) {
    return <Navigate to="/" replace />;
  }

  const { isActive, setupDone, currentStep } = accountStatus;
  const isSetupComplete = setupDone || currentStep === 5;
  const isAccountSetupPath = location.pathname === "/account-setup";

  // If account is not active, redirect to under review
  if (!isActive) {
    return <Navigate to="/account-under-review" replace />;
  }

  // If on account setup page and setup is complete, redirect to dashboard
  if (isAccountSetupPath && isSetupComplete) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not on account setup page and setup is incomplete, redirect to account setup
  if (!isAccountSetupPath && !isSetupComplete) {
    return <Navigate to="/account-setup" replace />;
  }

  return children;
};

AccountSetupProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AccountSetupProtectedRoute;
