import React, { useEffect, useState } from 'react';
import Dashboard from "./pages/Dashboard";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import withRouter from "./components/withRouter";
import VerifyOTP from "./pages/auth/VerifyOTP";
import Toastify from "./components/Toastify";
import Profile from "./pages/user-profile/Profile";
import "suneditor/src/assets/css/suneditor.css";
import AccountInactive from "./pages/complete-profile/AccountInactive";
import PaymentRevenueSetup from "./pages/PaymentRevenueSetup";
import RevenueOverview from "./pages/reports/RevenueOverview";
import { Button } from "@nextui-org/react";
import ValidationRequest from "./pages/requests/ValidationRequest";
import DocumentRequest from "./pages/requests/document-request/DocumentRequest";
import DocumentDetails from "./pages/requests/document-request/DocumentDetails";
import InstitutionDocumentTypes from "./pages/accountSettingsComponents/InstitutionDocumentTypes";
import RolesAndPermissions from "./pages/security/RolesAndPermissions";
import { Toaster } from "sonner";
import AccountSetupPage from "./pages/AccountSetupPage";
import LetterTemplates from "./pages/accountSettingsComponents/LetterTemplates";
import DepartmentManagement from "./pages/accountSettingsComponents/DepartmentManagement";
import UserManagement from "./pages/accountSettingsComponents/UserManagement";
import Tickets from "./pages/support/Tickets";
import ChangePassword from "./pages/auth/ChangePassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ProtectedRoute from './ProtectedRoute';
import axios from "@utils/axiosConfig";

const App = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get("/institution/institution-data");

        setUserRole(response.data.userRole);
      } catch (error) {
        navigate('/login')
        console.error('Failed to fetch user role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const isLoginPage =
    location.pathname === "/login" ||
    location.pathname === "/" ||
    location.pathname === "/complete-profile" ||
    location.pathname === "/verify-otp";
    location.pathname === "/change-password";
  

  return (
    <div className="font-figtree">
      <Toastify />
      <Toaster richColors />

      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/account-inactive" element={<AccountInactive />} />
        <Route exact path="/user-profile" element={<Profile />} />
        <Route exact path="/verify-otp" element={<VerifyOTP />} />
        <Route exact path="/change-password" element={<ChangePassword />} />
        <Route exact path="/forgot-password" element={<ForgotPassword />} />
        <Route exact path="/account-setup" element={<AccountSetupPage />} />

        <Route exact path="/dashboard" element={<Dashboard />} />

        {/* Requests Routes */}
        <Route exact path="/requests" element={<Outlet />}>
        <Route
          exact
          path="document-requests"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Admin', 'Customer Service']}>
              <DocumentRequest />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="document-requests/:documentId"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Admin', 'Customer Service']}>
              <DocumentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="validation-requests"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Customer Service', 'Admin']}>
              <ValidationRequest />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route exact path="/account-settings" element={<Outlet />}>
        <Route
          exact
          path="document-types"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Admin', 'HR']}>
              <InstitutionDocumentTypes />
            </ProtectedRoute>
          }
        />
        <Route
          exact path="letter-templates"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Admin', 'HR']}>
              <LetterTemplates />
            </ProtectedRoute>
          }
        />
        <Route
          exact path="departments"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Admin']}>
              <DepartmentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          exact path="users"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Admin']}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route exact path="/security" element={<Outlet />}>
        <Route
          exact path="roles-permissions"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Admin']}>
              <RolesAndPermissions />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route exact path="/supports" element={<Outlet />}>
        <Route
          exact path="tickets"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Finance', 'Admin', 'Customer Service', 'HR']}>
              <Tickets />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        exact path="/payment-revenue-setup"
        element={
          <ProtectedRoute userRole={userRole} allowedRoles={['Finance', 'Admin']}>
            <PaymentRevenueSetup />
          </ProtectedRoute>
        }
      />

      <Route exact path="/reports" element={<Outlet />}>
        <Route
          exact path="revenue-overview"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={['Finance', 'Admin']}>
              <RevenueOverview />
            </ProtectedRoute>
          }
        />
      </Route>

        <Route
          path="*"
          element={
            <section className="h-screen w-screen flex items-center justify-center flex-col gap-4">
              <p className="text-6xl text-danger font-bold">404</p>

              <p>Page Not found</p>

              <Button
                color="danger"
                onClick={() => {
                  navigate(-1);
                }}
              >
                Go Back
              </Button>
            </section>
          }
        />
        <Route
          path="/unauthorized"
          element={
            <section className="h-screen w-screen flex items-center justify-center flex-col gap-4">
              <p className="text-6xl text-danger font-bold">403</p>

              <p>Unauthorised Access</p>

              <Button
                color="danger"
                onClick={() => {
                  navigate('/dashboard');
                }}
              >
                Go Back
              </Button>
            </section>
          }
        />
      </Routes>
    </div>
  );
};
// }

export default withRouter(App);
