import React, { Component, useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import { toast } from "react-hot-toast";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
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
import { motion } from "framer-motion";
import RevenueOverview from "./pages/reports/RevenueOverview";

const App = () => {
  const navigate = useNavigate();
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const mobileNavRef = useRef(null);

  useEffect(() => {
    setIsDesktopExpanded(
      localStorage.getItem("isDesktopExpanded") === "true"
        ? true
        : localStorage.getItem("isDesktopExpanded") === null
        ? true
        : false
    );
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileNavRef.current && !mobileNavRef.current.contains(e.target)) {
        setIsMobileExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchInstitution = async () => {
    try {
      const response = await axios.get("/institution/institution-data");
      const institutionData = response.data.institutionData;

      if (institutionData.status === "inactive") {
        navigate("/account-inactive");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isLoginPage =
    location.pathname === "/login" ||
    location.pathname === "/" ||
    location.pathname === "/complete-profile" ||
    location.pathname === "/verify-otp";

  return (
    <>
      <Toastify />
      {/* Sidebar */}
      {/* {!isLoginPage && (
        <Sidebar
          mobileNavRef={mobileNavRef}
          isDesktopExpanded={isDesktopExpanded}
          isMobileExpanded={isMobileExpanded}
        />
      )} */}

      {/* Main content area */}
      {/* <motion.div
        // className={`flex-1 ${
        //   !isLoginPage && isSidebarCollapsed
        //     ? "lg:ml-16"
        //     : !isLoginPage
        //     ? "lg:ml-[17%]"
        //     : ""
        // } transition-margin duration-300`}

        className={`transition-all duration-400 flex-grow ${
          isDesktopExpanded ? "lg:ml-[17%] ml-0" : "ml-16"
        }`}
      > */}
      {/* Navbar */}
      {/* {!isLoginPage && (
          <Navbar
            toggleSidebar={() => setIsMobileExpanded(!isMobileExpanded)}
            user={{ name: "John Doe" }}
            toggleSidebarCollapse={() => {
              setIsDesktopExpanded(!isDesktopExpanded);
              localStorage.setItem(
                "isDesktopExpanded",
                !isDesktopExpanded ? "true" : "false"
              );
            }}
          />
        )} */}

      {/* Page content */}
      {/* <div className={`${isLoginPage ? "p-0" : "p-3"} `}> */}
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/account-inactive" element={<AccountInactive />} />
        <Route exact path="/user-profile" element={<Profile />} />
        <Route exact path="/verify-otp" element={<VerifyOTP />} />

        {/* Account Setup Routes */}
        <Route path="/account-setup" element={<Outlet />}>
          <Route path="profile" element={<InstitutionData />} />
          <Route path="institution-teams" element={<InstitutionTeams />} />
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
        <Route exact path="/complete-profile" element={<CompleteProfile />} />

        {/* Requests Routes */}
        <Route exact path="/requests" element={<Outlet />}>
          <Route exact path="document-requests" element={<DocumentRequest />} />
          <Route
            exact
            path="document-requests/:documentId"
            element={<DocumentDetails />}
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
      </Routes>
      {/* </div> */}
      {/* </motion.div> */}
    </>
  );
};
// }

export default withRouter(App);
