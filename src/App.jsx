import React, { Component } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import { Routes, Route, Navigate } from "react-router-dom"; // Import Navigate for redirection
import Login from './pages/auth/Login';
import withRouter from './components/withRouter';
import CompleteProfile from './pages/CompleteProfile';
import DocumentRequest from './pages/DocumentRequest';
import AddDocumentType from './pages/AddDocumentType';
import InstitutionUsers from './pages/InstitutionUsers';
import VerifyOTP from './pages/auth/VerifyOTP';
import Toastify from './components/Toastify';
import DocumentTypes from './pages/DocumentTypes';
import ValidationQuestions from './pages/ValidationQuestions';
import Profile from './pages/user-profile/Profile';
import AccountInactive from './pages/complete-profile/AccountInactive';
import axios from './axiosConfig';
import {toast} from 'react-hot-toast';
import InstitutionData from './pages/complete-profile/InstitutionData';

class App extends Component {
  state = {
    isSidebarVisible: false,
    isSidebarCollapsed: false,
    institutionStatus: null,
    profileComplete: null,
  };

  toggleMobileSidebar = () => {
    this.setState({ isSidebarVisible: !this.state.isSidebarVisible });
  };

  toggleSidebarCollapse = () => {
    this.setState({ isSidebarCollapsed: !this.state.isSidebarCollapsed });
  };

  handleClickOutside = (e) => {
    const sidebarElement = document.querySelector('.sidebar');
    if (sidebarElement && !sidebarElement.contains(e.target) && window.innerWidth < 768) {
      this.setState({ isSidebarVisible: false });
    }
  };

  componentDidMount() {
    this.fetchInstitution();
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  fetchInstitution = async () => {
    try {
      const response = await axios.get("/institution/institution-data");
      const institutionData = response.data.institutionData;

      if (institutionData) {
        this.setState({
          institutionStatus: institutionData.status,
          profileComplete: institutionData.profile_complete,
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  render() {
    const { isSidebarVisible, isSidebarCollapsed, institutionStatus, profileComplete } = this.state;
    const isLoginPage = location.pathname === '/login' || location.pathname === '/' || location.pathname === '/complete-profile' || location.pathname === '/verify-otp';


    return (
      <div className="flex h-screen bg-gray-100 font-figtree">
        <Toastify />
        {/* Sidebar */}
        {!isLoginPage && <Sidebar
          isVisible={isSidebarVisible}
          isCollapsed={isSidebarCollapsed}
          closeSidebar={this.toggleMobileSidebar}
        />}

        {/* Main content area */}
        <div
          className={`flex-1 ${!isLoginPage && isSidebarCollapsed ? 'lg:ml-16' : !isLoginPage ? 'lg:ml-[17%]' : ''} transition-margin duration-300`}
        >
          {/* Navbar */}
          {!isLoginPage && <Navbar
            toggleSidebar={this.toggleMobileSidebar}
            user={this.state.user}
            toggleSidebarCollapse={this.toggleSidebarCollapse}
          />}

          {/* Page content */}
          <div className={`${isLoginPage ? 'p-0' : 'p-3'} bg-gray-100`}>
            <Routes>
              <Route exact path="/" element={<Login />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/user-profile" element={<Profile />} />
              <Route exact path="/verify-otp" element={<VerifyOTP />} />
              <Route exact path="/account-inactive" element={<AccountInactive />} />
              <Route exact path="/account-profile" element={<InstitutionData />} />
              <Route exact path="/team-setup" element={<InstitutionUsers />} />
              <Route exact path="/dashboard" element={<Dashboard/>} />
              <Route exact path="/complete-profile" element={<CompleteProfile />} />
              <Route exact path="/document-requests" element={<DocumentRequest/>} />
              <Route exact path="/document-types" element={<DocumentTypes/>} />
              <Route exact path="/staff" element={<InstitutionUsers/>} />
              <Route exact path="/document-types/add-remove" element={<AddDocumentType />} />
              <Route exact path="/document-types/:documentId" element={<ValidationQuestions />} />
            </Routes>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
