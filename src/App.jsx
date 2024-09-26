import React, { Component } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';


class App extends Component {
  state = {
    isSidebarVisible: false,
    isSidebarCollapsed: false, // For wide screens partial collapse
   
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

    return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar
          isVisible={isSidebarVisible}
          isCollapsed={isSidebarCollapsed}
          closeSidebar={this.toggleMobileSidebar}
        />

        {/* Main content area */}
        <div
          className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-44 xl:ml-64'}`}
        >
          {/* Navbar */}
          <Navbar
            toggleSidebar={this.toggleMobileSidebar}
            user={user}
            toggleSidebarCollapse={this.toggleSidebarCollapse} // To control wide screen collapse
          />

          {/* Page content */}
          <div className="p-8">
            <Dashboard />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
