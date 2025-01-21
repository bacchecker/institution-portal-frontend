import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { getAccountStatus } from "../utils/AccountStatus";
import { useGetInstitutionDetailsQuery } from "../redux/apiSlice";
import LoadItems from "./LoadItems";

const PrivateRoute = ({ children }) => {
  const token = secureLocalStorage.getItem("userToken");
  const location = useLocation();
  const { isLoading } = useGetInstitutionDetailsQuery();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadItems color={"#ff0404"} />
      </div>
    );
  }

  const accountStatus = getAccountStatus();
  if (!accountStatus) {
    return <Navigate to="/" replace />;
  }

  const { isActive, isInactive, setupDone, currentStep } = accountStatus;

  // Root path handling
  if (location.pathname === "/") {
    if (isInactive) return <Navigate to="/account-under-review" replace />;
    if (!setupDone && currentStep !== 5)
      return <Navigate to="/account-setup" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  // Define protected paths that require setup completion
  const protectedPaths = [
    "/dashboard",
    "/manage-document",
    "/e-check",
    "/search-all",
    "/user-support",
    "/reports",
    "/activity-logs",
    "/subscription-plans",
    "/payment",
  ];

  // Public paths that don't require setup
  const publicPaths = [
    "/account-under-review",
    "/account-setup",
    "/unauthorized",
    "/2fa-authentication",
    "/2fa-authentication-success",
  ];

  const isProtectedPath = protectedPaths.includes(location.pathname);
  const isPublicPath = publicPaths.includes(location.pathname);

  // Handle routing based on status
  if (isInactive && location.pathname !== "/account-under-review") {
    return <Navigate to="/account-under-review" replace />;
  }

  if (isActive && !setupDone && currentStep !== 5 && isProtectedPath) {
    return <Navigate to="/account-setup" replace />;
  }

  if (
    isActive &&
    (setupDone || currentStep === 5) &&
    location.pathname === "/account-setup"
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  // Allow access if path is public or user has completed setup
  if (isPublicPath || (isProtectedPath && (setupDone || currentStep === 5))) {
    return children;
  }

  return <Navigate to="/unauthorized" replace />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
