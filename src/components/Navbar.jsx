import React from "react";
import { FaBars, FaCaretRight } from "react-icons/fa";
import withRouter from '../components/withRouter'
import Logout from "../pages/auth/Logout";

class Navbar extends React.Component {
  state = {
    isLogoutModalOpen: false
  };

  handleLogoutClick = () => {
    this.setState({ isLogoutModalOpen: true });
  };

  // Function to close the modal
  closeLogoutModal = () => {
    this.setState({ isLogoutModalOpen: false });
  };
  render() {
    const { toggleSidebar, toggleSidebarCollapse, user } = this.props;

    return (
      <div className="text-gray-800 bg-white px-4 py-2.5 flex justify-between items-center border-b font-figtree" onClick={this.handleLogoutClick}>
        <div className="flex items-center">
          {/* Sidebar Toggle Button (Mobile) */}
          <button
            className="md:hidden focus:outline-none bg-red-200 ml-1 rounded-lg p-1.5"
            onClick={toggleSidebar}
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5"
            >
                <path d="M17 4H3V6H17V4ZM13 11H3V13H13V11ZM17 18H3V20H17V18ZM22.0104 8.81412L20.5962 7.3999L16 11.9961L20.5962 16.5923L22.0104 15.1781L18.8284 11.9961L22.0104 8.81412Z"></path>
            </svg>
          </button>

          {/* Sidebar Collapse Button (Wide Screens) */}
          <button
            className="hidden md:block focus:outline-none bg-red-200 rounded-lg p-1.5 rotate-180"
            onClick={toggleSidebarCollapse}
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5"
            >
                <path d="M17 4H3V6H17V4ZM13 11H3V13H13V11ZM17 18H3V20H17V18ZM22.0104 8.81412L20.5962 7.3999L16 11.9961L20.5962 16.5923L22.0104 15.1781L18.8284 11.9961L22.0104 8.81412Z"></path>
            </svg>
            
          </button>

          <h1 className="text-xl font-semibold ml-4">Dashboard</h1>
        </div>
        
        <Logout />
      </div>
    );
  }
}

export default withRouter(Navbar);
