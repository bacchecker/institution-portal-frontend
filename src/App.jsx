import React, { Component } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import { Routes, Route } from "react-router-dom";
import Login from './pages/auth/Login';
import withRouter from './components/withRouter';
import CompleteProfile from './pages/CompleteProfile';
import DocumentRequest from './pages/DocumentRequest';
import InstitutionUsers from './pages/InstitutionUsers';
import VerifyOTP from './pages/auth/VerifyOTP';
import Toastify from './components/Toastify';
import DocumentTypes from './pages/DocumentTypes';
import ValidationQuestions from './pages/ValidationQuestions';

class App extends Component {
  state = {
    isSidebarVisible: false,
    isSidebarCollapsed: false,
   
  };

  // Toggle mobile sidebar visibility
  toggleMobileSidebar = () => {
    this.setState({ isSidebarVisible: !this.state.isSidebarVisible });
  };

  // Toggle sidebar collapse on wide screens
  toggleSidebarCollapse = () => {
    this.setState({ isSidebarCollapsed: !this.state.isSidebarCollapsed });
  };

  // Collapse sidebar on click outside (for mobile)
  handleClickOutside = (e) => {
    const sidebarElement = document.querySelector('.sidebar');
    if (sidebarElement && !sidebarElement.contains(e.target) && window.innerWidth < 768) {
      this.setState({ isSidebarVisible: false });
    }
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  render() {
    const { isSidebarVisible, isSidebarCollapsed, user } = this.state;
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
          className={`flex-1 ${!isLoginPage && isSidebarCollapsed ? 'lg:ml-16' : !isLoginPage ? 'lg:ml-52 xl:ml-64' : ''} transition-margin duration-300`}
        >
          {/* Navbar */}
          {!isLoginPage && <Navbar
            toggleSidebar={this.toggleMobileSidebar}
            user={user}
            toggleSidebarCollapse={this.toggleSidebarCollapse}
          />}

          {/* Page content */}
          <div className={`${isLoginPage ? 'p-0' : 'px-10 py-6'} bg-gray-100`}>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/verify-otp" element={<VerifyOTP />} />
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route exact path="/complete-profile" element={<CompleteProfile />} />
            <Route exact path="/document-requests" element={<DocumentRequest />} />
            <Route exact path="/document-types" element={<DocumentTypes />} />
            <Route exact path="/staff" element={<InstitutionUsers />} />
            <Route exact path="/document-types/:documentId" element={<ValidationQuestions />} />
          </Routes>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
