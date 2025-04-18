import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { storage } from "../../utils/storage";
import { getAccountStatus } from "../../utils/AccountStatus";

/**
 * Protects a route based on permissions.
 * @param {Object} props - The props for the component.
 * @param {string|string[]} permission - The required permission(s) to access the route.
 * @param {React.ReactNode} children - The children components to render if permission is granted.
 * @returns {React.ReactNode} - The children if permission is granted, or a redirect otherwise.
 */
const PermissionProtectedRoute = ({ permission, children }) => {
  let permissions = storage.getPermissions() || [];
  const isAdmin = storage.getRole()?.isAdmin;
  const accountStatus = getAccountStatus();

  // If account is inactive, redirect to review page
  if (accountStatus?.isInactive) {
    return <Navigate to="/account-under-review" replace />;
  }

  // Check setup completion
  if (
    accountStatus &&
    !accountStatus.setupDone &&
    accountStatus.currentStep !== 5
  ) {
    return <Navigate to="/account-setup" replace />;
  }

  // Parse permissions if stored as a string
  if (typeof permissions === "string") {
    try {
      permissions = JSON.parse(permissions);
    } catch {
      console.error("Failed to parse permissions");
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Ensure permissions is an array
  if (!Array.isArray(permissions)) {
    console.error("Permissions is not an array");
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
