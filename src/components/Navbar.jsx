import React from "react";
import { FaBars, FaCaretRight } from "react-icons/fa";
import withRouter from '../components/withRouter'
import { IoIosLock } from "react-icons/io";
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
      <div className="text-gray-800 bg-white px-4 py-2 flex justify-between items-center border-b" onClick={this.handleLogoutClick}>
        <div className="flex items-center">
          {/* Sidebar Toggle Button (Mobile) */}
          <button
            className="md:hidden focus:outline-none bg-red-200 ml-1 rounded-lg p-2"
            onClick={toggleSidebar}
          >
            <FaBars size={20}/>
          </button>

          {/* Sidebar Collapse Button (Wide Screens) */}
          <button
            className="hidden md:block focus:outline-none ml-4 bg-red-200 rounded-lg p-2.5"
            onClick={toggleSidebarCollapse}
          >
            <FaBars size={20} />
          </button>

          <h1 className="text-xl ml-4">Dashboard</h1>
        </div>
        
        <Logout />
      </div>
    );
  }
}

export default withRouter(Navbar);
