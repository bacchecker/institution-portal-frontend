import Dashboard from "./pages/Dashboard";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import withRouter from "./components/withRouter";
import CompleteProfile from "./pages/CompleteProfile";
import AddDocumentType from "./pages/document-types/AddDocumentType";
import VerifyOTP from "./pages/auth/VerifyOTP";
import Toastify from "./components/Toastify";
import DocumentTypes from "./pages/document-types/DocumentTypes";
import ValidationQuestions from "./pages/document-types/ValidationQuestions";
import Profile from "./pages/user-profile/Profile";
import InstitutionData from "./pages/complete-profile/InstitutionData";
import OperationsCert from "./pages/complete-profile/OperationsCert";
import InstitutionTeams from "./pages/institution-teams/InstitutionTeams";
import InstitutionUsers from "./pages/institution-teams/InstitutionUsers";
import InstitutionLetter from "./pages/complete-profile/InstitutionLetter";
import AccountInactive from "./pages/complete-profile/AccountInactive";
import PaymentRevenueSetup from "./pages/PaymentRevenueSetup";
import RevenueOverview from "./pages/reports/RevenueOverview";
import { Button } from "@nextui-org/react";
import ValidationRequest from "./pages/requests/ValidationRequest";
import DocumentRequest from "./pages/requests/document-request/DocumentRequest";
import DocumentDetails from "./pages/requests/document-request/DocumentDetails";
import TermsConditions from "./pages/complete-profile/TermsConditions";
import RolesAndPermissions from "./pages/security/RolesAndPermissions";

const App = () => {
  const navigate = useNavigate();

  const isLoginPage =
    location.pathname === "/login" ||
    location.pathname === "/" ||
    location.pathname === "/complete-profile" ||
    location.pathname === "/verify-otp";

  return (
    <>
      <Toastify />

      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/account-inactive" element={<AccountInactive />} />
        <Route exact path="/user-profile" element={<Profile />} />
        <Route exact path="/verify-otp" element={<VerifyOTP />} />

        {/* Account Setup Routes */}

        <Route path="/account-setup" element={<Outlet />}>
          <Route exact path="" element={<CompleteProfile />} />

          <Route path="profile" element={<InstitutionData />} />
          <Route path="institution-teams" element={<InstitutionTeams />} />
          <Route path="terms-conditions" element={<TermsConditions />} />
          <Route path="operations-certificate" element={<OperationsCert />} />
          <Route path="letter-templates" element={<InstitutionLetter />} />

          <Route path="document-types" element={<DocumentTypes />} />
          <Route
            path="document-types/add-remove"
            element={<AddDocumentType />}
          />
          <Route
            path="document-types/:documentId"
            element={<ValidationQuestions />}
          />
          <Route
            path="institution-teams/:institutionId"
            element={<InstitutionUsers />}
          />
        </Route>

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
    </>
  );
};
// }

export default withRouter(App);
