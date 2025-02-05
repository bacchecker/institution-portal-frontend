import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "@/pages/Login";
import { Toaster } from "sonner";
import ResetPassword from "@/pages/ResetPassword";
import NewPassword from "@/pages/NewPassword";
import AuthenticationProtectedRoute from "@/components/AuthenticationProtectedRoute";
import AuthenticatedSuccessProtectedRoute from "@/components/AuthenticatedSuccessProtectedRoute";
import AuthenticationPage from "@/pages/AuthenticationPage";
import PrivateRoute from "@/components/PrivateRoute";
import RootLayout from "@/components/RootLayout";
import AccountUnderReview from "@/pages/AccountUnderReview";
import AccountSetup from "@/pages/AccountSetup";
import ManageRequest from "@/pages/requests/ManageRequest";
import Tickets from "@/pages/support/Tickets";
import Dashboard from "@/pages/Dashboard";
import AccountSetupProtectedRoute from "@/components/AccountSetupProtectedRoute";
import AccountUnderReviewProtection from "@/components/AccountUnderReviewProtection";
import RevenueOverview from "@/pages/reports/RevenueOverview";
import SystemLogs from "./pages/SystemLogs";
import SearchAll from "./pages/SearchAll";
import VerificationRequest from "./pages/requests/VerficationRequests";
import PermissionProtectedRoute from "./components/permissions/PermissionProtectedRoute";
import Unauthorized from "./components/permissions/Unauthorized";
import Plans from "./pages/subscription/Plans";
import Payment from "./pages/payment/Payment";
import { getAccountSetupStatus } from "./utils/AccountSetupStatus";
import AccountSuspended from "@/pages/AccountSuspended";
import AccountSuspendedProtection from "@/components/AccountSuspendedProtection";
import AccountSettings from "./pages/accountSettingsComponents/AccountSettings";
import UpdateRequest from "./pages/accountSettingsComponents/UpdateRequest";

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<NewPassword />} />

        <Route
          path="/*"
          element={
            <PrivateRoute>
              <RootLayout>
                <Routes>
                  <Route
                    path="/2fa-authentication"
                    element={
                      <AuthenticationProtectedRoute>
                        <AuthenticationPage />
                      </AuthenticationProtectedRoute>
                    }
                  />
                  <Route
                    path="/account-under-review"
                    element={
                      <AuthenticatedSuccessProtectedRoute>
                        <AccountUnderReviewProtection>
                          <AccountUnderReview />
                        </AccountUnderReviewProtection>
                      </AuthenticatedSuccessProtectedRoute>
                    }
                  />
                  <Route
                    path="/account-suspended"
                    element={
                      <AuthenticatedSuccessProtectedRoute>
                        <AccountSuspendedProtection>
                          <AccountSuspended />
                        </AccountSuspendedProtection>
                      </AuthenticatedSuccessProtectedRoute>
                    }
                  />
                  <Route
                    path="/account-setup"
                    element={
                      <AuthenticatedSuccessProtectedRoute>
                        <AccountSetupProtectedRoute>
                          <AccountSetup />
                        </AccountSetupProtectedRoute>
                      </AuthenticatedSuccessProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <AuthenticatedSuccessProtectedRoute>
                        <AccountSetupProtectedRoute>
                          <Dashboard />
                        </AccountSetupProtectedRoute>
                      </AuthenticatedSuccessProtectedRoute>
                    }
                  />
                  <Route
                    path="/manage-document"
                    element={
                      <AuthenticatedSuccessProtectedRoute>
                        <AccountSetupProtectedRoute>
                          <PermissionProtectedRoute
                            permission={["document-requests.view"]}
                          >
                            <ManageRequest />
                          </PermissionProtectedRoute>
                        </AccountSetupProtectedRoute>
                      </AuthenticatedSuccessProtectedRoute>
                    }
                  />
                  <Route
                    path="/e-check"
                    element={
                      <AuthenticatedSuccessProtectedRoute>
                        <PermissionProtectedRoute
                          permission={["verification-requests.view"]}
                        >
                          <VerificationRequest />
                        </PermissionProtectedRoute>
                      </AuthenticatedSuccessProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="/search-all"
                    element={
                      <AuthenticatedSuccessProtectedRoute>
                        <SearchAll />
                      </AuthenticatedSuccessProtectedRoute>
                    }
                  />
                  <Route
                    path="/user-support"
                    element={
                      <AuthenticatedSuccessProtectedRoute>
                        <PermissionProtectedRoute
                          permission={["institution.tickets.view"]}
                        >
                          <Tickets />
                        </PermissionProtectedRoute>
                      </AuthenticatedSuccessProtectedRoute>
                    }
                  />
                  <Route
                    path="/reports"
                    element={
                      <AuthenticatedSuccessProtectedRoute>
                        <PermissionProtectedRoute
                          permission={["institution.reports.view"]}
                        >
                          <RevenueOverview />
                        </PermissionProtectedRoute>
                      </AuthenticatedSuccessProtectedRoute>
                    }
                  />
                  <Route
                    path="/activity-logs"
                    element={
                      <AuthenticatedSuccessProtectedRoute>
                        <PermissionProtectedRoute
                          permission={["institution.activity-logs.view"]}
                        >
                          <SystemLogs />
                        </PermissionProtectedRoute>
                      </AuthenticatedSuccessProtectedRoute>
                    }
                  />
                  <Route
                    path="/subscription-plans"
                    element={
                      <AuthenticatedSuccessProtectedRoute>
                        <PermissionProtectedRoute
                          permission={["verification-requests.view"]}
                        >
                          <Plans />
                        </PermissionProtectedRoute>
                      </AuthenticatedSuccessProtectedRoute>
                    }
                  />
                  <Route
                    path="/payment"
                    element={
                      <AuthenticatedSuccessProtectedRoute>
                        <AccountSetupProtectedRoute>
                          <PermissionProtectedRoute
                            permission={["institution.payments.view"]}
                          >
                            <Payment />
                          </PermissionProtectedRoute>
                        </AccountSetupProtectedRoute>
                      </AuthenticatedSuccessProtectedRoute>
                    }
                  />
                  <Route
                    path="/account-settings"
                    element={
                      <AuthenticatedSuccessProtectedRoute>
                        <AccountSetupProtectedRoute>
                          <PermissionProtectedRoute
                            permission={["institution.settings.view"]}
                          >
                            <AccountSettings />
                          </PermissionProtectedRoute>
                        </AccountSetupProtectedRoute>
                      </AuthenticatedSuccessProtectedRoute>
                    }
                  />
                  <Route
                    path="/account-settings/update-request"
                    element={
                      <AuthenticatedSuccessProtectedRoute>
                        <AccountSetupProtectedRoute>
                          <PermissionProtectedRoute
                            permission={["institution.settings.view"]}
                          >
                            <UpdateRequest />
                          </PermissionProtectedRoute>
                        </AccountSetupProtectedRoute>
                      </AuthenticatedSuccessProtectedRoute>
                    }
                  />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                </Routes>
              </RootLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

const RequireSetupComplete = ({ children }) => {
  const { isSetupComplete } = getAccountSetupStatus();

  if (!isSetupComplete) {
    return <Navigate to="/account-setup" />;
  }

  return <Outlet />;
};

export default App;
