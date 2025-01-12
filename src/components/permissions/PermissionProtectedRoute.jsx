import React from 'react';
import { Navigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';

/**
 * Protects a route based on permissions.
 * @param {Object} props - The props for the component.
 * @param {string|string[]} permission - The required permission(s) to access the route.
 * @param {React.ReactNode} children - The children components to render if permission is granted.
 * @returns {React.ReactNode} - The children if permission is granted, or a redirect otherwise.
 */
const PermissionProtectedRoute = ({ permission, children }) => {
    let permissions = secureLocalStorage.getItem('userPermissions') || [];
    const isAdmin = JSON.parse(secureLocalStorage.getItem("userRole"))?.isAdmin;

    // Parse permissions if stored as a string
    if (typeof permissions === 'string') {
        try {
            permissions = JSON.parse(permissions);
        } catch (error) {
            console.error('Failed to parse permissions:', permissions);
            return <Navigate to="/unauthorized" />;
        }
    }

    // Ensure permissions is an array
    if (!Array.isArray(permissions)) {
        console.error('Permissions is not an array:', permissions);
        return <Navigate to="/unauthorized" />;
    }

    const hasPermission = (perm) => permissions.includes(perm);

    const hasRequiredPermissions = Array.isArray(permission)
        ? permission.some(hasPermission) // At least one permission must match
        : hasPermission(permission);

    return hasRequiredPermissions || isAdmin ? children : <Navigate to="/unauthorized" />;
};

export default PermissionProtectedRoute;
