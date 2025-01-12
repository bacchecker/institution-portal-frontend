import React from 'react';
import secureLocalStorage from 'react-secure-storage';
import secureStorage from 'react-secure-storage';

/**
 * Wraps components or elements with a permission check.
 * @param {Object} props - The props for the component.
 * @param {string|string[]} props.permission - The required permission(s) to show the children.
 * @param {React.ReactNode} props.children - The content to render if permission is granted.
 * @returns {React.ReactNode|null} - The children if permission is granted, or null otherwise.
 */
const PermissionWrapper = ({ permission, children }) => {
    let permissions = secureLocalStorage.getItem('userPermissions') || [];   
  const isAdmin = JSON.parse(secureLocalStorage.getItem("userRole"))?.isAdmin;
  if (typeof permissions === 'string') {
        permissions = JSON.parse(permissions); // Ensure permissions is an array
    }

    if (!Array.isArray(permissions)) {
        console.error('Permissions is not an array:', permissions);
        return null;
    }

    const hasPermission = (perm) => permissions.includes(perm);

    const hasRequiredPermissions = Array.isArray(permission)
        ? permission.some(hasPermission) // At least one permission must match
        : hasPermission(permission);

    return hasRequiredPermissions || isAdmin ? children : null;
};

export default PermissionWrapper;
