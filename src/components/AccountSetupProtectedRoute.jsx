import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { getAccountStatus } from "../utils/AccountStatus";
import { useGetInstitutionDetailsQuery } from "../redux/apiSlice";

const AccountSetupProtectedRoute = ({ children }) => {
  const location = useLocation();
  // Fetch latest institution data
  const { data: institutionData, isLoading } = useGetInstitutionDetailsQuery(undefined, {
    // Refetch on mount to ensure we have latest data
    refetchOnMountOrArgChange: true
  });
  
  // Get current status from local storage (will be updated by the query above)
  const accountStatus = getAccountStatus();

  if (isLoading || !accountStatus) {
    return null; // Or a loading spinner
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
