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

  // Define paths that are always accessible
  const publicPaths = [
    "/account-under-review",
    "/account-setup",
    "/unauthorized",
    "/2fa-authentication",
    "/2fa-authentication-success",
  ];

  const isPublicPath = publicPaths.includes(location.pathname);

  // Allow access to public paths regardless of status
  if (isPublicPath) {
    return children;
  }

  // Handle inactive account
  if (isInactive) {
    return <Navigate to="/account-under-review" replace />;
  }

  // Handle incomplete setup
  if (isActive && !setupDone && currentStep !== 5) {
    return <Navigate to="/account-setup" replace />;
  }

  // Allow access to protected routes only if active and setup complete
  if (isActive && (setupDone || currentStep === 5)) {
    return children;
  }

  return <Navigate to="/unauthorized" replace />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
