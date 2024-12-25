import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import AccountSetupProtection from "@/components/AccountSetupProtection";
import RevenueOverview from "@/pages/reports/RevenueOverview";
import SystemLogs from "./pages/SystemLogs";
import SearchAll from "./pages/SearchAll";

function App() {
  return (
    <>
      <Toaster richColors />
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
                    path="/account-setup"
                    element={
                      <AuthenticatedSuccessProtectedRoute>
                        <AccountSetupProtection>
                          <AccountSetup />
                        </AccountSetupProtection>
                      </AuthenticatedSuccessProtectedRoute>
                    }
                  />
                  <Route
                    path="/2fa-authentication"
                    element={
                      <AuthenticationProtectedRoute>
                        <AuthenticationPage />
                      </AuthenticationProtectedRoute>
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
                          <ManageRequest />
                        </AccountSetupProtectedRoute>
                      </AuthenticatedSuccessProtectedRoute>
                    }
                  />
                  <Route
                    path="/search-all"
                    element={
                      <AuthenticatedSuccessProtectedRoute>
                        <AccountSetupProtectedRoute>
                          <SearchAll />
                        </AccountSetupProtectedRoute>
                      </AuthenticatedSuccessProtectedRoute>
                    }
                  />
                  <Route
                    path="/user-support"
                    element={
                      <AuthenticatedSuccessProtectedRoute>
                        <AccountSetupProtectedRoute>
                          <Tickets />
                        </AccountSetupProtectedRoute>
                      </AuthenticatedSuccessProtectedRoute>
                    }
                  />
                  <Route
                    path="/reports"
                    element={
                      <AuthenticatedSuccessProtectedRoute>
                        <AccountSetupProtectedRoute>
                          <RevenueOverview />
                        </AccountSetupProtectedRoute>
                      </AuthenticatedSuccessProtectedRoute>
                    }
                  />
                  <Route
                    path="/system-logs"
                    element={
                      <AuthenticatedSuccessProtectedRoute>
                        <AccountSetupProtectedRoute>
                          <SystemLogs />
                        </AccountSetupProtectedRoute>
                      </AuthenticatedSuccessProtectedRoute>
                    }
                  />
                </Routes>
              </RootLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
