import Dashboard from "./pages/Dashboard";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import withRouter from "./components/withRouter";
import VerifyOTP from "./pages/auth/VerifyOTP";
import Toastify from "./components/Toastify";
import DocumentTypes from "./pages/document-types/DocumentTypes";
import Profile from "./pages/user-profile/Profile";
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

const App = () => {
  const navigate = useNavigate();

  const isLoginPage =
    location.pathname === "/login" ||
    location.pathname === "/" ||
    location.pathname === "/complete-profile" ||
    location.pathname === "/verify-otp";

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
        <Route exact path="/account-setup" element={<AccountSetupPage />} />

        <Route exact path="/dashboard" element={<Dashboard />} />

        {/* Requests Routes */}
        <Route exact path="/requests" element={<Outlet />}>
          <Route exact path="document-requests" element={<DocumentRequest />} />
          <Route
            exact
            path="document-requests/:documentId"
            element={<DocumentDetails />}
          />

          <Route
            exact
            path="validation-requests"
            element={<ValidationRequest />}
          />
        </Route>

        <Route exact path="/account-settings" element={<Outlet />}>
          <Route
            exact
            path="document-types"
            element={<InstitutionDocumentTypes />}
          />
          <Route exact path="letter-templates" element={<LetterTemplates />} />
          <Route exact path="departments" element={<DepartmentManagement />} />
          <Route exact path="users" element={<UserManagement />} />
        </Route>

        <Route exact path="/security" element={<Outlet />}>
          <Route
            exact
            path="roles-permissions"
            element={<RolesAndPermissions />}
          />
        </Route>

        {/* // Kwamina */}
        <Route
          exact
          path="/payment-revenue-setup"
          element={<PaymentRevenueSetup />}
        />

        <Route exact path="/reports" element={<Outlet />}>
          <Route exact path="revenue-overview" element={<RevenueOverview />} />
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
      </Routes>
    </div>
  );
};
// }

export default withRouter(App);
