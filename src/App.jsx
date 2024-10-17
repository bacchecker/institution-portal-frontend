import React, { Component } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import { toast } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import withRouter from "./components/withRouter";
import CompleteProfile from "./pages/CompleteProfile";
import DocumentRequest from "./pages/document-request/DocumentRequest";
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
import DocumentDetails from "./pages/document-request/DocumentDetails";
import AccountInactive from "./pages/complete-profile/AccountInactive";
import PaymentRevenueSetup from "./pages/PaymentRevenueSetup";


class App extends Component {
  state = {
    isSidebarVisible: false,
    isSidebarCollapsed: false,
  };

  toggleMobileSidebar = () => {
    this.setState({ isSidebarVisible: !this.state.isSidebarVisible });
  };

  toggleSidebarCollapse = () => {
    this.setState({ isSidebarCollapsed: !this.state.isSidebarCollapsed });
  };

  handleClickOutside = (e) => {
    const sidebarElement = document.querySelector(".sidebar");
    if (
      sidebarElement &&
      !sidebarElement.contains(e.target) &&
      window.innerWidth < 768
    ) {
      this.setState({ isSidebarVisible: false });
    }
  };

  fetchInstitution = async () => {
    try {
      const response = await axios.get("/institution/institution-data");
      const institutionData = response.data.institutionData;

      if (institutionData.status == "inactive") {
        this.props.navigate("/account-inactive");
      }
    } catch (error) {
      console.error(error);
    }
  };

  componentDidMount() {
    //this.fetchInstitution();
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  render() {
    const { isSidebarVisible, isSidebarCollapsed } = this.state;
    const isLoginPage =
      location.pathname === "/login" ||
      location.pathname === "/" ||
      location.pathname === "/complete-profile" ||
      location.pathname === "/verify-otp";

    return (
      <div className="flex h-screen bg-gray-100 dark:bg-slate-950 font-figtree">
        <Toastify />
        {/* Sidebar */}
        {!isLoginPage && (
          <Sidebar
            isVisible={isSidebarVisible}
            isCollapsed={isSidebarCollapsed}
            closeSidebar={this.toggleMobileSidebar}
          />
        )}

        {/* Main content area */}
        <div
          className={`flex-1 ${
            !isLoginPage && isSidebarCollapsed
              ? "lg:ml-16"
              : !isLoginPage
              ? "lg:ml-[17%]"
              : ""
          } transition-margin duration-300`}
        >
          {/* Navbar */}
          {!isLoginPage && (
            <Navbar
              toggleSidebar={this.toggleMobileSidebar}
              user={this.state.user}
              toggleSidebarCollapse={this.toggleSidebarCollapse}
            />
          )}

          {/* Page content */}
          <div className={`${isLoginPage ? "p-0" : "p-3"} `}>
            <Routes>
              <Route exact path="/" element={<Login />} />
              <Route exact path="/login" element={<Login />} />
              <Route
                exact
                path="/account-inactive"
                element={<AccountInactive />}
              />
              <Route exact path="/user-profile" element={<Profile />} />
              <Route exact path="/verify-otp" element={<VerifyOTP />} />
              <Route
                exact
                path="/account-profile"
                element={<InstitutionData />}
              />
              <Route
                exact
                path="/institution-teams"
                element={<InstitutionTeams />}
              />
              <Route
                exact
                path="/operations-certificate"
                element={<OperationsCert />}
              />
              <Route
                exact
                path="/letter-templates"
                element={<InstitutionLetter />}
              />
              <Route exact path="/dashboard" element={<Dashboard />} />
              <Route
                exact
                path="/complete-profile"
                element={<CompleteProfile />}
              />
              <Route
                exact
                path="/document-requests"
                element={<DocumentRequest />}
              />
              <Route
                exact
                path="/document-requests/:documentId"
                element={<DocumentDetails />}
              />
              <Route exact path="/document-types" element={<DocumentTypes />} />
              <Route
                exact
                path="/document-types/add-remove"
                element={<AddDocumentType />}
              />
              <Route
                exact
                path="/document-types/:documentId"
                element={<ValidationQuestions />}
              />
              <Route
                exact
                path="/institution-teams/:institutionId"
                element={<InstitutionUsers />}
              />

              {/* // Kwamina */}
              <Route
                exact
                path="/payment-revenue-setup"
                element={<PaymentRevenueSetup />}
              />
            </Routes>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
