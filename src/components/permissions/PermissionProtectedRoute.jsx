import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { getAccountStatus } from "../../utils/AccountStatus";

/**
 * Protects a route based on permissions.
 * @param {Object} props - The props for the component.
 * @param {string|string[]} permission - The required permission(s) to access the route.
 * @param {React.ReactNode} children - The children components to render if permission is granted.
 * @returns {React.ReactNode} - The children if permission is granted, or a redirect otherwise.
 */
const PermissionProtectedRoute = ({ permission, children }) => {
  let permissions = secureLocalStorage.getItem("userPermissions") || [];
  const isAdmin = JSON.parse(secureLocalStorage.getItem("userRole"))?.isAdmin;
  const accountStatus = getAccountStatus();

  // Check setup completion first
  if (
    accountStatus &&
    !accountStatus.setupDone &&
    accountStatus.currentStep !== 5
  ) {
    return <Navigate to="/account-setup" replace />;
  }
  console.log(permissions);
  // Parse permissions if stored as a string
  if (typeof permissions === "string") {
    try {
      permissions = JSON.parse(permissions);
    } catch {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Ensure permissions is an array
  if (!Array.isArray(permissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  const hasPermission = (perm) => permissions.includes(perm);

  const hasRequiredPermissions = Array.isArray(permission)
    ? permission.some(hasPermission)
    : hasPermission(permission);

  return hasRequiredPermissions || isAdmin ? (
    children
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};

PermissionProtectedRoute.propTypes = {
  permission: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  children: PropTypes.node.isRequired,
};

export default PermissionProtectedRoute;
