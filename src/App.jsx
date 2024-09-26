import React, { Component } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import { Routes, Route } from "react-router-dom";
import Login from './pages/auth/Login';
import withRouter from './components/withRouter';
import CompleteProfile from './pages/CompleteProfile';

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
    const isLoginPage = location.pathname === '/login' || location.pathname === '/institution/complete-profile';

    return (
      <div className="flex h-screen bg-gray-100">
        
        {/* Sidebar */}
        {!isLoginPage && <Sidebar
          isVisible={isSidebarVisible}
          isCollapsed={isSidebarCollapsed}
          closeSidebar={this.toggleMobileSidebar}
        />}

        {/* Main content area */}
        <div
          className={`flex-1 ${!isLoginPage && isSidebarCollapsed ? 'lg:ml-16' : !isLoginPage ? 'lg:ml-44 xl:ml-64' : ''} transition-margin duration-300`}
        >
          {/* Navbar */}
          {!isLoginPage && <Navbar
            toggleSidebar={this.toggleMobileSidebar}
            user={user}
            toggleSidebarCollapse={this.toggleSidebarCollapse}
          />}

          {/* Page content */}
          <div className={`${isLoginPage ? 'p-0' : 'p-8'}`}>
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/institution/dashboard" element={<Dashboard />} />
            <Route exact path="/institution/complete-profile" element={<CompleteProfile />} />
          </Routes>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
